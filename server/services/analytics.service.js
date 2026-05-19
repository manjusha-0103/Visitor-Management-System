import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"


const analyticsHederDataService = async () => {
    const data = await sql`
        SELECT
            COUNT(*) AS total_appointments,

            COUNT(*) FILTER (
                WHERE is_preschedule = false
            ) AS total_walk_ins,

            COUNT(*) FILTER (
                WHERE is_preschedule = true
            ) AS total_preschedule,

            COUNT(*) FILTER (
                WHERE check_out IS NOT NULL
            ) AS total_checkout,

            COUNT(*) FILTER (
                WHERE check_out IS NULL
                  AND COALESCE(is_rejected, false) = false
                  AND COALESCE(is_preschedule, false) = false
                  AND COALESCE(is_approve, false) = false
            ) AS total_pendings,

            COUNT(*) FILTER (
                WHERE is_laptop = true
            ) AS total_laptop_registered,

            COUNT(*) FILTER (
                WHERE is_vehicle = true
            ) AS vehicles_registered,

            COUNT(*) FILTER (
                WHERE pass_id IS NOT NULL
                  AND pass_id <> ''
            ) AS total_passes_issued

        FROM "Appointments";
    `;

    return data[0];
};

const analyticsGraphnService = async ({year, month, last_15_days}) => {
    let line_chart;
    let department_traffic;
    let whereClause =  sql``;

    // ── Last 15 Days Trend ─────────────────────────────
    if (last_15_days) {
        line_chart = await sql`
            WITH dates AS (
                SELECT
                    generate_series(
                        CURRENT_DATE - INTERVAL '14 days',
                        CURRENT_DATE,
                        INTERVAL '1 day'
                    )::date AS full_date
            )

            SELECT
                TO_CHAR(d.full_date, 'DD Mon') AS date,

                COALESCE(
                    COUNT(a.id) FILTER (
                        WHERE a.is_preschedule = false
                    ),
                    0
                )::INT AS "walkIn",

                COALESCE(
                    COUNT(a.id) FILTER (
                        WHERE a.is_preschedule = true
                    ),
                    0
                )::INT AS "preScheduled"

            FROM dates d

            LEFT JOIN "Appointments" a
                ON DATE(a.date_time) = d.full_date

            GROUP BY d.full_date

            ORDER BY d.full_date;
        `;


        department_traffic = await sql`
            SELECT
                d.name AS department,

                COALESCE(COUNT(a.id), 0)::INT AS count

            FROM "Departments" d

            LEFT JOIN "Employee" e
                ON e.department = d.id

            LEFT JOIN "Appointments" a
                ON a.employee_id = e.id
            AND DATE(a.date_time) >= CURRENT_DATE - INTERVAL '14 days'

            GROUP BY d.id, d.name

            ORDER BY count DESC, d.name ASC;
        `;
    }

    // ── Monthly Trend For Selected Year ─────────────────
    else if (year && !month) {
        line_chart = await sql`
            WITH months AS (
                SELECT
                    generate_series(1, 12) AS month_no
            )

            SELECT
                TO_CHAR(
                    TO_DATE(months.month_no::text, 'MM'),
                    'Mon'
                ) AS month,

                COALESCE(
                    COUNT(a.id) FILTER (
                        WHERE a.is_preschedule = false
                    ),
                    0
                )::INT AS "walkIn",

                COALESCE(
                    COUNT(a.id) FILTER (
                        WHERE a.is_preschedule = true
                    ),
                    0
                )::INT AS "preScheduled"

            FROM months

            LEFT JOIN "Appointments" a
                ON EXTRACT(MONTH FROM a.date_time) = months.month_no
               AND EXTRACT(YEAR FROM a.date_time) = ${year}

            GROUP BY months.month_no

            ORDER BY months.month_no;
        `;

        department_traffic = await sql`
            SELECT
                d.name AS department,

                COALESCE(COUNT(a.id), 0)::INT AS count

            FROM "Departments" d

            LEFT JOIN "Employee" e
                ON e.department = d.id

            LEFT JOIN "Appointments" a
                ON a.employee_id = e.id
            AND EXTRACT(YEAR FROM a.date_time) = ${year}

            GROUP BY d.id, d.name

            ORDER BY count DESC, d.name ASC;
        `;

        
    }

    // ── Daily Trend For Selected Month & Year ───────────
    else if (year && month) {
        line_chart = await sql`
            WITH days AS (
                SELECT
                    generate_series(
                        DATE_TRUNC(
                            'month',
                            MAKE_DATE(${year}, ${month}, 1)
                        ),
                        (
                            DATE_TRUNC(
                                'month',
                                MAKE_DATE(${year}, ${month}, 1)
                            )
                            + INTERVAL '1 month'
                            - INTERVAL '1 day'
                        ),
                        INTERVAL '1 day'
                    )::date AS full_date
            )

            SELECT
                TO_CHAR(d.full_date, 'DD Mon') AS date,

                COALESCE(
                    COUNT(a.id) FILTER (
                        WHERE a.is_preschedule = false
                    ),
                    0
                )::INT AS "walkIn",

                COALESCE(
                    COUNT(a.id) FILTER (
                        WHERE a.is_preschedule = true
                    ),
                    0
                )::INT AS "preScheduled"

            FROM days d

            LEFT JOIN "Appointments" a
                ON DATE(a.date_time) = d.full_date

            GROUP BY d.full_date

            ORDER BY d.full_date;
        `;

        department_traffic = await sql`
            SELECT
                d.name AS department,

                COALESCE(COUNT(a.id), 0)::INT AS count

            FROM "Departments" d

            LEFT JOIN "Employee" e
                ON e.department = d.id

            LEFT JOIN "Appointments" a
                ON a.employee_id = e.id
            AND EXTRACT(YEAR FROM a.date_time) = ${year}
            AND EXTRACT(MONTH FROM a.date_time) = ${month}

            GROUP BY d.id, d.name

            ORDER BY count DESC, d.name ASC;
        `;
    }

    if (last_15_days) {
        whereClause = sql`
            WHERE DATE(date_time) >= CURRENT_DATE - INTERVAL '14 days'
        `;
    }

    // ── Year Filter ─────────────────────────────────────
    else if (year && !month) {
        whereClause = sql`
            WHERE EXTRACT(YEAR FROM date_time) = ${year}
        `;
    }

    // ── Year + Month Filter ─────────────────────────────
    else if (year && month) {
        whereClause = sql`
            WHERE EXTRACT(YEAR FROM date_time) = ${year}
              AND EXTRACT(MONTH FROM date_time) = ${month}
        `;
    }

    const approval_status = await sql`
        SELECT * FROM (

            SELECT
                'Approved' AS status,
                COUNT(*)::INT AS count,
                '#639922' AS color
            FROM "Appointments"
            ${whereClause}
            AND COALESCE(is_approve, false) = true

            UNION ALL

            SELECT
                'Pending' AS status,
                COUNT(*)::INT AS count,
                '#EF9F27' AS color
            FROM "Appointments"
            ${whereClause}
            AND check_out IS NULL
            AND COALESCE(is_rejected, false) = false
            AND COALESCE(is_approve, false) = false

            UNION ALL

            SELECT
                'Denied' AS status,
                COUNT(*)::INT AS count,
                '#E24B4A' AS color
            FROM "Appointments"
            ${whereClause}
            AND COALESCE(is_rejected, false) = true

            UNION ALL

            SELECT
                'Checked out' AS status,
                COUNT(*)::INT AS count,
                '#888780' AS color
            FROM "Appointments"
            ${whereClause}
            AND check_out IS NOT NULL

        ) AS approval_stats;
    `;

    


    return {line_chart, department_traffic, approval_status}
}


export{
    analyticsHederDataService,
    analyticsGraphnService
}