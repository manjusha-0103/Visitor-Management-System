import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import { uploadFile } from "../config/uploadFile.js";
import supabase from "../config/supabase.js"
import sendResponse from "../utils/sendResponse.js";

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
            a.is_laptop,
            a.laptop_make,
            a.laptop_model,
            a.laptop_serial_no,
            a.is_vehicle,
            a.vehicle_no,
            a.pass_id,
            v.visitor_position AS visitor_position,
            v.visitor_company,
            v.visitor_image,


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

const downloadAppointmentsService = async ({
    from_date,
    to_date,
    format = "xlsx" // xlsx | csv | pdf
}) => {

    // ── File identity ────────────────────────────────────
    const fileName   = `appointments-${from_date}-to-${to_date}.${format}`;
    const bucketPath = `appointment-reports/${fileName}`;

    // ── Early-exit: file already in bucket ──────────────
    // Check before touching the DB so we never do unnecessary work.
    const { data: existingFiles } = await supabase
        .storage
        .from("documents")
        .list("appointment-reports");

    const alreadyExists = existingFiles?.some(
        (file) => file.name === fileName
    );

    if (alreadyExists) {

        const { data: existing } = supabase
            .storage
            .from("documents")
            .getPublicUrl(bucketPath);

        return {
            success:        true,
            already_exists: true,
            file_url:       existing.publicUrl
        };
    }

    // ── Fetch Appointment Data ───────────────────────────
    const whereClause = sql`
        DATE(a.date_time AT TIME ZONE 'Asia/Kolkata')
        BETWEEN ${from_date} AND ${to_date}
    `;

    const data = await sql`
        SELECT

            -- Appointment
            a.id AS appointment_id,

            TO_CHAR(
                a.date_time AT TIME ZONE 'Asia/Kolkata',
                'DD Mon YYYY HH12:MI AM'
            ) AS appointment_date,

            TO_CHAR(
                a.check_in AT TIME ZONE 'Asia/Kolkata',
                'DD Mon YYYY HH12:MI AM'
            ) AS check_in,

            TO_CHAR(
                a.check_out AT TIME ZONE 'Asia/Kolkata',
                'DD Mon YYYY HH12:MI AM'
            ) AS check_out,

            a.is_preschedule,
            a.is_approve,
            a.is_rejected,

            a.is_laptop,
            a.make        AS laptop_make,
            a.model       AS laptop_model,
            a.serial_no   AS laptop_serial_no,

            a.is_vehicle,
            a.vehicle_no,
            a.pass_id,

            -- Visitor
            v.position AS visitor_position,
            v.company  AS visitor_company,
            v.photo    AS visitor_img,

            -- Employee
            e.position AS employee_position,

            -- Employee User
            eu.first_name AS employee_first_name,
            eu.last_name  AS employee_last_name,
            eu.email      AS employee_email,
            eu.phone      AS employee_phone,

            -- Visitor User
            vu.first_name AS visitor_first_name,
            vu.last_name  AS visitor_last_name,
            vu.email      AS visitor_email,
            vu.phone      AS visitor_phone

        FROM "Appointments" a

        JOIN "Employee" e  ON e.id  = a.employee_id
        JOIN "Visitors" v  ON v.id  = a.visitor_id
        JOIN "Users"    eu ON eu.id = e.user_id
        JOIN "Users"    vu ON vu.id = v.user_id

        WHERE ${whereClause}
        ORDER BY a.date_time ASC
    `;

    // ── Normalise rows ───────────────────────────────────
    const formattedData = data.map((item) => ({
        AppointmentID:    item.appointment_id,
        AppointmentDate:  item.appointment_date,
        VisitorName:      `${item.visitor_first_name || ""} ${item.visitor_last_name || ""}`.trim(),
        VisitorEmail:     item.visitor_email      || "-",
        VisitorPhone:     item.visitor_phone      || "-",
        VisitorCompany:   item.visitor_company    || "-",
        VisitorPosition:  item.visitor_position   || "-",
        VisitorImage:     item.visitor_img        || "-",   // raw URL
        EmployeeName:     `${item.employee_first_name || ""} ${item.employee_last_name || ""}`.trim(),
        EmployeeEmail:    item.employee_email     || "-",
        EmployeePhone:    item.employee_phone     || "-",
        EmployeePosition: item.employee_position  || "-",
        PreScheduled:     item.is_preschedule ? "Yes" : "No",
        Approved:         item.is_approve     ? "Yes" : "No",
        Rejected:         item.is_rejected    ? "Yes" : "No",
        CheckIn:          item.check_in       || "-",
        CheckOut:         item.check_out      || "-",
        Laptop:           item.is_laptop      ? "Yes" : "No",
        LaptopMake:       item.laptop_make    || "-",
        LaptopModel:      item.laptop_model   || "-",
        LaptopSerialNo:   item.laptop_serial_no || "-",
        Vehicle:          item.is_vehicle     ? "Yes" : "No",
        VehicleNo:        item.vehicle_no     || "-",
        PassID:           item.pass_id        || "-"
    }));

    // ────────────────────────────────────────────────────
    // Build file entirely in memory → fileBuffer
    // No temp directory, no disk writes.
    // ────────────────────────────────────────────────────
    let fileBuffer;

    const mimeTypes = {
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        csv:  "text/csv",
        pdf:  "application/pdf"
    };

    // ────────────────────────────────────────────────────
    // XLSX  –  VisitorImage as a clickable hyperlink
    // ────────────────────────────────────────────────────
    if (format === "xlsx") {

        const xlsxRows = formattedData.map((item) => ({
            AppointmentID:    item.AppointmentID,
            AppointmentDate:  item.AppointmentDate,
            VisitorName:      item.VisitorName,
            VisitorEmail:     item.VisitorEmail,
            VisitorPhone:     item.VisitorPhone,
            VisitorCompany:   item.VisitorCompany,
            VisitorPosition:  item.VisitorPosition,
            VisitorImage:     item.VisitorImage !== "-" ? "View Photo" : "-",
            EmployeeName:     item.EmployeeName,
            EmployeeEmail:    item.EmployeeEmail,
            EmployeePhone:    item.EmployeePhone,
            EmployeePosition: item.EmployeePosition,
            PreScheduled:     item.PreScheduled,
            Approved:         item.Approved,
            Rejected:         item.Rejected,
            CheckIn:          item.CheckIn,
            CheckOut:         item.CheckOut,
            Laptop:           item.Laptop,
            LaptopMake:       item.LaptopMake,
            LaptopModel:      item.LaptopModel,
            LaptopSerialNo:   item.LaptopSerialNo,
            Vehicle:          item.Vehicle,
            VehicleNo:        item.VehicleNo,
            PassID:           item.PassID
        }));

        const worksheet = XLSX.utils.json_to_sheet(xlsxRows);
        const workbook  = XLSX.utils.book_new();

        // "VisitorImage" is the 8th column → letter H
        const IMAGE_COL = "H";
        formattedData.forEach((item, rowIndex) => {
            if (item.VisitorImage && item.VisitorImage !== "-") {
                const cell = `${IMAGE_COL}${rowIndex + 2}`; // +2: header row + 1-based
                worksheet[cell] = {
                    t: "s",
                    v: "View Photo",
                    l: { Target: item.VisitorImage, Tooltip: "Open visitor photo" }
                };
            }
        });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

        // write() with type "buffer" returns a Buffer directly — no disk needed
        fileBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    }

    // ────────────────────────────────────────────────────
    // CSV  –  VisitorImage as plain URL column
    // ────────────────────────────────────────────────────
    else if (format === "csv") {

        const csvRows = formattedData.map((item) => ({
            AppointmentID:    item.AppointmentID,
            AppointmentDate:  item.AppointmentDate,
            VisitorName:      item.VisitorName,
            VisitorEmail:     item.VisitorEmail,
            VisitorPhone:     item.VisitorPhone,
            VisitorCompany:   item.VisitorCompany,
            VisitorPosition:  item.VisitorPosition,
            VisitorImageURL:  item.VisitorImage,   // full URL in CSV
            EmployeeName:     item.EmployeeName,
            EmployeeEmail:    item.EmployeeEmail,
            EmployeePhone:    item.EmployeePhone,
            EmployeePosition: item.EmployeePosition,
            PreScheduled:     item.PreScheduled,
            Approved:         item.Approved,
            Rejected:         item.Rejected,
            CheckIn:          item.CheckIn,
            CheckOut:         item.CheckOut,
            Laptop:           item.Laptop,
            LaptopMake:       item.LaptopMake,
            LaptopModel:      item.LaptopModel,
            LaptopSerialNo:   item.LaptopSerialNo,
            Vehicle:          item.Vehicle,
            VehicleNo:        item.VehicleNo,
            PassID:           item.PassID
        }));

        const csv = new Parser().parse(csvRows);
        fileBuffer = Buffer.from(csv, "utf-8");
    }

    // ────────────────────────────────────────────────────
    // PDF  –  built fully in memory via PDFKit passThrough
    //
    // Page : A2 landscape (~1587 × 1190 pt)
    // All 8 columns fit — total col widths = 1338 pt.
    // Visitor images fetched from URL → Buffer, embedded inline.
    // ────────────────────────────────────────────────────
    else if (format === "pdf") {

        // Fetch a visitor image URL → Buffer (null on any failure)
        const fetchImageBuffer = async (url) => {
            if (!url || url === "-") return null;
            try {
                const res = await fetch(url);
                if (!res.ok) return null;
                return Buffer.from(await res.arrayBuffer());
            } catch {
                return null;
            }
        };

        // Pre-fetch all visitor images in parallel
        const imageBuffers = await Promise.all(
            formattedData.map((item) => fetchImageBuffer(item.VisitorImage))
        );

        // Collect PDFKit output chunks into memory
        fileBuffer = await new Promise((resolve, reject) => {

            const chunks = [];

            const doc = new PDFDocument({
                margin: 0,
                size:   "A2",
                layout: "landscape"
            });

            doc.on("data",  (chunk) => chunks.push(chunk));
            doc.on("end",   ()      => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            // ── Layout constants ──────────────────────
            const PAGE_MARGIN_X   = 10;
            const PAGE_MARGIN_TOP = 10;
            const HEADER_HEIGHT   = 24;
            const ROW_HEIGHT      = 110;
            const FONT_HEADER     = 8.5;
            const FONT_BODY       = 7.5;
            const PAGE_HEIGHT     = doc.page.height; // ~1190 pt in A2 landscape

            // Columns — total 1338 pt (A2 landscape usable ≈ 1567 pt)
            const COLS = [
                { key: "sr",          label: "#",                width:  28 },
                { key: "visitor",     label: "Visitor Details",  width: 310 },
                { key: "employee",    label: "Employee Details", width: 230 },
                { key: "appointment", label: "Appointment",      width: 175 },
                { key: "laptop",      label: "Laptop Details",   width: 190 },
                { key: "vehicle",     label: "Vehicle",          width: 105 },
                { key: "status",      label: "Status",           width: 160 },
                { key: "pass",        label: "Pass Details",     width: 140 },
            ];

            // ── Draw header row ───────────────────────
            const drawHeader = (y) => {
                let x = PAGE_MARGIN_X;
                doc.font("Helvetica-Bold").fontSize(FONT_HEADER);
                for (const col of COLS) {
                    doc.rect(x, y, col.width, HEADER_HEIGHT).fillAndStroke("#1a1a2e", "#000000");
                    doc.fillColor("#ffffff").text(
                        col.label,
                        x + 4,
                        y + (HEADER_HEIGHT - FONT_HEADER) / 2,
                        { width: col.width - 8, align: "center", lineBreak: false }
                    );
                    x += col.width;
                }
                doc.fillColor("#000000");
            };

            // ── Draw one data row ─────────────────────
            const drawRow = (y, index, item, imgBuffer) => {
                let x = PAGE_MARGIN_X;

                // Alternating background
                const bgColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff";
                let bx = PAGE_MARGIN_X;
                for (const col of COLS) {
                    doc.rect(bx, y, col.width, ROW_HEIGHT).fillAndStroke(bgColor, "#cccccc");
                    bx += col.width;
                }

                doc.font("Helvetica").fontSize(FONT_BODY).fillColor("#111111");

                for (const col of COLS) {
                    const cx = x + 4;
                    const cy = y + 6;
                    const tw = col.width - 8;

                    switch (col.key) {

                        case "sr":
                            doc.text(String(index + 1), cx, cy, { width: tw, align: "center" });
                            break;

                        case "visitor": {
                            const IMG_W = 80, IMG_H = 80;
                            const IMG_X = x + 5;
                            const IMG_Y = y + (ROW_HEIGHT - IMG_H) / 2;

                            if (imgBuffer) {
                                try {
                                    doc.image(imgBuffer, IMG_X, IMG_Y, {
                                        fit: [IMG_W, IMG_H],
                                        align: "center", valign: "center"
                                    });
                                } catch {
                                    doc.fontSize(6).text("No Image", IMG_X, IMG_Y + 30, { width: IMG_W });
                                    doc.fontSize(FONT_BODY);
                                }
                            } else {
                                doc.rect(IMG_X, IMG_Y, IMG_W, IMG_H).strokeColor("#cccccc").stroke().strokeColor("#000000");
                                doc.fontSize(6).text("No Photo", IMG_X, IMG_Y + 34, { width: IMG_W, align: "center" });
                                doc.fontSize(FONT_BODY);
                            }

                            const TX = x + IMG_W + 10;
                            const TW = col.width - IMG_W - 14;
                            let ty = cy;
                            for (const line of [
                                `Name: ${item.VisitorName}`,
                                `Email: ${item.VisitorEmail}`,
                                `Phone: ${item.VisitorPhone}`,
                                `Position: ${item.VisitorPosition}`,
                                `Company: ${item.VisitorCompany}`
                            ]) {
                                doc.text(line, TX, ty, { width: TW, lineBreak: false });
                                ty += 13;
                            }
                            break;
                        }

                        case "employee": {
                            let ty = cy;
                            for (const line of [
                                `Name: ${item.EmployeeName}`,
                                `Email: ${item.EmployeeEmail}`,
                                `Phone: ${item.EmployeePhone}`,
                                `Position: ${item.EmployeePosition}`
                            ]) {
                                doc.text(line, cx, ty, { width: tw, lineBreak: false });
                                ty += 13;
                            }
                            break;
                        }

                        case "appointment": {
                            let ty = cy;
                            for (const line of [
                                "Date:", item.AppointmentDate, "",
                                "Check In:", item.CheckIn, "",
                                "Check Out:", item.CheckOut
                            ]) {
                                doc.text(line, cx, ty, { width: tw, lineBreak: false });
                                ty += 11;
                            }
                            break;
                        }

                        case "laptop": {
                            let ty = cy;
                            for (const line of [
                                `Laptop: ${item.Laptop}`,
                                `Make: ${item.LaptopMake}`,
                                `Model: ${item.LaptopModel}`,
                                `Serial: ${item.LaptopSerialNo}`
                            ]) {
                                doc.text(line, cx, ty, { width: tw, lineBreak: false });
                                ty += 13;
                            }
                            break;
                        }

                        case "vehicle": {
                            let ty = cy;
                            for (const line of [
                                `Vehicle: ${item.Vehicle}`,
                                `No: ${item.VehicleNo}`
                            ]) {
                                doc.text(line, cx, ty, { width: tw, lineBreak: false });
                                ty += 13;
                            }
                            break;
                        }

                        case "status": {
                            let ty = cy;
                            for (const line of [
                                `Pre-Schedule: ${item.PreScheduled}`,
                                `Approved: ${item.Approved}`,
                                `Rejected: ${item.Rejected}`
                            ]) {
                                doc.text(line, cx, ty, { width: tw, lineBreak: false });
                                ty += 13;
                            }
                            break;
                        }

                        case "pass":
                            doc.text("Pass ID:", cx, cy, { width: tw });
                            doc.text(String(item.PassID), cx, cy + 13, { width: tw });
                            break;

                        default:
                            break;
                    }

                    x += col.width;
                }
            };

            // ── Render ────────────────────────────────
            const totalColWidth = COLS.reduce((s, c) => s + c.width, 0);

            doc.font("Helvetica-Bold").fontSize(14).text(
                "Appointments Report",
                PAGE_MARGIN_X,
                PAGE_MARGIN_TOP,
                { align: "center", width: totalColWidth }
            );

            let y = PAGE_MARGIN_TOP + 22;
            drawHeader(y);
            y += HEADER_HEIGHT;

            for (const [index, item] of formattedData.entries()) {

                if (y + ROW_HEIGHT > PAGE_HEIGHT - PAGE_MARGIN_TOP) {
                    doc.addPage();
                    y = PAGE_MARGIN_TOP;
                    drawHeader(y);
                    y += HEADER_HEIGHT;
                }

                drawRow(y, index, item, imageBuffers[index]);
                y += ROW_HEIGHT;
            }

            doc.end();
        });
    }

    // ────────────────────────────────────────────────────
    // Upload buffer directly to Supabase — no local file
    // ────────────────────────────────────────────────────
    const { error } = await supabase
        .storage
        .from("documents")
        .upload(
            bucketPath,
            fileBuffer,
            {
                contentType: mimeTypes[format],
                upsert:      false
            }
        );

    // Race condition: another request uploaded between our list check and now
    if (error) {
        if (
            error.statusCode === "409" ||
            error.message?.includes("already exists")
        ) {
            const { data: existing } = supabase
                .storage
                .from("documents")
                .getPublicUrl(bucketPath);

            return {
                success:        true,
                already_exists: true,
                file_url:       existing.publicUrl
            };
        }
        throw error;
    }

    // ── Return public URL ──────────────────────────────
    const { data: publicData } = supabase
        .storage
        .from("documents")
        .getPublicUrl(bucketPath);

    return {
        success:        true,
        already_exists: false,
        file_url:       publicData.publicUrl
    };
};

export{
    pastAppointmentsService,
    downloadAppointmentsService
}