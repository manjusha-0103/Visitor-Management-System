import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"

// const pastAppointmentsService = async ({
//             page,
//             limit,
//             search = "",
//             is_approve = null,
//             is_preschedule = null,
//             date = null
//         }) => {
//     const offset = (page - 1) * limit;

//     const [countResult] = await sql`
//         SELECT COUNT(*) AS total
//         FROM "Appointments" a
//         WHERE a.date_time::date < CURRENT_DATE
//     `;

//     const total = Number(countResult.total);

//     const amps = await sql`
//         SELECT
//             -- Appointment
//             a.id AS appointment_id,
//             a.created_at AS appointment_created_at,
//             a.check_in,
//             a.check_out,
//             a.date_time,
//             a.is_preschedule,
//             a.is_approve,

//             -- Employee
//             e.id AS employee_id,
//             e.position AS employee_position,
//             e.department,

//             -- Employee User
//             eu.first_name AS employee_first_name,
//             eu.last_name AS employee_last_name,
//             eu.email AS employee_email,
//             eu.phone AS employee_phone,

//             -- Visitor
//             v.id AS visitor_id,
//             v.position AS visitor_position,
//             v.company,
//             v.is_laptop,
//             v.laptop_make,
//             v.laptop_model,
//             v.laptop_serial_no,
//             v.is_vehicle,
//             v.vehicle_no,
//             v.pass_id,

//             -- Visitor User
//             vu.first_name AS visitor_first_name,
//             vu.last_name AS visitor_last_name,
//             vu.email AS visitor_email,
//             vu.phone AS visitor_phone

//         FROM "Appointments" a

//         JOIN "Employee" e
//             ON e.id = a.employee_id

//         JOIN "Visitors" v
//             ON v.id = a.visitor_id

//         JOIN "Users" eu
//             ON eu.id = e.user_id

//         JOIN "Users" vu
//             ON vu.id = v.user_id

//         WHERE a.date_time::date < CURRENT_DATE

//         ORDER BY a.date_time DESC

//         LIMIT ${limit}
//         OFFSET ${offset}
//     `;

//     return  {
//         data: amps,

//         pagination: {
//             total,
//             page,
//             limit,
//             totalPages: Math.ceil(total / limit),
//             hasNextPage: page < Math.ceil(total / limit),
//             hasPrevPage: page > 1
//         }
//     }
// }

const pastAppointmentsService = async ({
    page = 1,
    limit = 10,
    search = "",
    is_approve = null,
    is_preschedule = null,
    date = null
}) => {

    const offset = (page - 1) * limit;

    const amps = await sql`
        SELECT
            -- Appointment
            a.id AS appointment_id,
            a.created_at AS appointment_created_at,
            a.check_in,
            a.check_out,
            a.date_time,
            a.is_preschedule,
            a.is_approve,

            -- Employee
            e.id AS employee_id,
            e.position AS employee_position,
            e.department,

            -- Employee User
            eu.first_name AS employee_first_name,
            eu.last_name AS employee_last_name,
            eu.email AS employee_email,
            eu.phone AS employee_phone,

            -- Visitor
            v.id AS visitor_id,
            v.position AS visitor_position,
            v.company,
            v.is_laptop,
            v.laptop_make,
            v.laptop_model,
            v.laptop_serial_no,
            v.is_vehicle,
            v.vehicle_no,
            v.pass_id,

            -- Visitor User
            vu.first_name AS visitor_first_name,
            vu.last_name AS visitor_last_name,
            vu.email AS visitor_email,
            vu.phone AS visitor_phone

        FROM "Appointments" a

        JOIN "Employee" e
            ON e.id = a.employee_id

        JOIN "Visitors" v
            ON v.id = a.visitor_id

        JOIN "Users" eu
            ON eu.id = e.user_id

        JOIN "Users" vu
            ON vu.id = v.user_id

        WHERE 1=1

            -- Past appointments
            AND a.date_time::date < CURRENT_DATE

            -- Search
            AND (
                ${search}::text IS NULL

                OR eu.email ILIKE ${'%' + (search || '') + '%'}
                OR eu.first_name ILIKE ${'%' + (search || '') + '%'}
                OR eu.last_name ILIKE ${'%' + (search || '') + '%'}

                OR vu.email ILIKE ${'%' + (search || '') + '%'}
                OR vu.first_name ILIKE ${'%' + (search || '') + '%'}
                OR vu.last_name ILIKE ${'%' + (search || '') + '%'}

                OR v.company ILIKE ${'%' + (search || '') + '%'}
            )

            -- is_approve filter
            AND (
                ${is_approve}::boolean IS NULL
                OR a.is_approve = ${is_approve}
            )

            -- is_preschedule filter
            AND (
                ${is_preschedule}::boolean IS NULL
                OR a.is_preschedule = ${is_preschedule}
            )

            -- date filter
            AND (
                ${date}::date IS NULL
                OR a.date_time::date = ${date}
            )

        ORDER BY a.date_time DESC

        LIMIT ${limit}
        OFFSET ${offset}
    `;

    // Count Query
    const [countResult] = await sql`

        SELECT COUNT(*) AS total

        FROM "Appointments" a

        JOIN "Employee" e
            ON e.id = a.employee_id

        JOIN "Visitors" v
            ON v.id = a.visitor_id

        JOIN "Users" eu
            ON eu.id = e.user_id

        JOIN "Users" vu
            ON vu.id = v.user_id

        WHERE

            a.date_time::date < CURRENT_DATE

            AND (
                ${search} = ''

                OR eu.email ILIKE ${'%' + search + '%'}
                OR eu.first_name ILIKE ${'%' + search + '%'}
                OR eu.last_name ILIKE ${'%' + search + '%'}

                OR vu.email ILIKE ${'%' + search + '%'}
                OR vu.first_name ILIKE ${'%' + search + '%'}
                OR vu.last_name ILIKE ${'%' + search + '%'}

                OR v.company ILIKE ${'%' + search + '%'}
            )

            AND (
                ${is_approve}::boolean IS NULL
                OR a.is_approve = ${is_approve}
            )

            AND (
                ${is_preschedule}::boolean IS NULL
                OR a.is_preschedule = ${is_preschedule}
            )

            AND (
                ${date}::date IS NULL
                OR a.date_time::date = ${date}
            )
    `;

    const total = Number(countResult.total);

    return {
        data: amps,

        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
        }
    };
};
export{
    pastAppointmentsService
}