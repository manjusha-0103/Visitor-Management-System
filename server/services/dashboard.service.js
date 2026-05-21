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

    // ── Date Filter ─────────────────────────────────────
    const whereClause = sql`
        DATE(a.date_time AT TIME ZONE 'Asia/Kolkata')
        BETWEEN ${from_date} AND ${to_date}
    `;

    // ── Fetch Appointment Data ──────────────────────────
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
            a.make AS laptop_make,
            a.model AS laptop_model,
            a.serial_no AS laptop_serial_no,

            a.is_vehicle,
            a.vehicle_no,
            a.pass_id,

            -- Visitor
            v.position AS visitor_position,
            v.company AS visitor_company,
            v.photo AS visitor_img,

            -- Employee
            e.position AS employee_position,

            -- Employee User
            eu.first_name AS employee_first_name,
            eu.last_name AS employee_last_name,
            eu.email AS employee_email,
            eu.phone AS employee_phone,

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

        WHERE ${whereClause}

        ORDER BY a.date_time ASC
    `;

    // ── Format Data ─────────────────────────────────────
    const formattedData = data.map((item) => ({

        AppointmentID: item.appointment_id,

        AppointmentDate: item.appointment_date,

        VisitorName:
            `${item.visitor_first_name || ""} ${item.visitor_last_name || ""}`.trim(),

        VisitorEmail: item.visitor_email || "-",

        VisitorPhone: item.visitor_phone || "-",

        VisitorCompany: item.visitor_company || "-",

        VisitorPosition: item.visitor_position || "-",

        // Raw URL kept for XLSX hyperlink / CSV / PDF image fetch
        VisitorImage: item.visitor_img || "-",

        EmployeeName:
            `${item.employee_first_name || ""} ${item.employee_last_name || ""}`.trim(),

        EmployeeEmail: item.employee_email || "-",

        EmployeePhone: item.employee_phone || "-",

        EmployeePosition: item.employee_position || "-",

        PreScheduled: item.is_preschedule ? "Yes" : "No",

        Approved: item.is_approve ? "Yes" : "No",

        Rejected: item.is_rejected ? "Yes" : "No",

        CheckIn: item.check_in || "-",

        CheckOut: item.check_out || "-",

        Laptop: item.is_laptop ? "Yes" : "No",

        LaptopMake: item.laptop_make || "-",

        LaptopModel: item.laptop_model || "-",

        LaptopSerialNo: item.laptop_serial_no || "-",

        Vehicle: item.is_vehicle ? "Yes" : "No",

        VehicleNo: item.vehicle_no || "-",

        PassID: item.pass_id || "-"
    }));

    // ── File Name ───────────────────────────────────────
    const fileName =
        `appointments-${from_date}-${to_date}.${format}`;

    const bucketPath =
        `appointment-reports/${fileName}`;

    // ── Check Existing File ─────────────────────────────
    const { data: existingFiles } = await supabase
        .storage
        .from("documents")
        .list("appointment-reports");

    const alreadyExists = existingFiles?.some(
        (file) => file.name === fileName
    );

    // ── Return Existing File ────────────────────────────
    if (alreadyExists) {

        const { data: existingFile } = supabase
            .storage
            .from("documents")
            .getPublicUrl(bucketPath);

        return {
            success: true,
            already_exists: true,
            file_url: existingFile.publicUrl
        };
    }

    // ── Temp Directory ──────────────────────────────────
    const tempDir = path.join(process.cwd(), "temp");

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const filePath = path.join(tempDir, fileName);

    // ────────────────────────────────────────────────────
    // XLSX Export  –  VisitorImage as a clickable hyperlink
    // ────────────────────────────────────────────────────
    if (format === "xlsx") {

        // Build rows without the raw image URL (replaced by hyperlink below)
        const xlsxRows = formattedData.map((item) => ({
            AppointmentID:   item.AppointmentID,
            AppointmentDate: item.AppointmentDate,
            VisitorName:     item.VisitorName,
            VisitorEmail:    item.VisitorEmail,
            VisitorPhone:    item.VisitorPhone,
            VisitorCompany:  item.VisitorCompany,
            VisitorPosition: item.VisitorPosition,
            // Placeholder text; real hyperlink added per-cell below
            VisitorImage:    item.VisitorImage !== "-" ? "View Photo" : "-",
            EmployeeName:    item.EmployeeName,
            EmployeeEmail:   item.EmployeeEmail,
            EmployeePhone:   item.EmployeePhone,
            EmployeePosition: item.EmployeePosition,
            PreScheduled:    item.PreScheduled,
            Approved:        item.Approved,
            Rejected:        item.Rejected,
            CheckIn:         item.CheckIn,
            CheckOut:        item.CheckOut,
            Laptop:          item.Laptop,
            LaptopMake:      item.LaptopMake,
            LaptopModel:     item.LaptopModel,
            LaptopSerialNo:  item.LaptopSerialNo,
            Vehicle:         item.Vehicle,
            VehicleNo:       item.VehicleNo,
            PassID:          item.PassID
        }));

        const worksheet = XLSX.utils.json_to_sheet(xlsxRows);
        const workbook  = XLSX.utils.book_new();

        // Column header row is row 1 (index 0); data starts at row 2 (index 1)
        // "VisitorImage" is the 8th column → letter H
        const imageColLetter = "H";

        formattedData.forEach((item, rowIndex) => {

            if (item.VisitorImage && item.VisitorImage !== "-") {

                const cellAddress = `${imageColLetter}${rowIndex + 2}`; // +2: 1 header + 1-based

                worksheet[cellAddress] = {
                    t: "s",
                    v: "View Photo",
                    l: { Target: item.VisitorImage, Tooltip: "Open visitor photo" }
                };
            }
        });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
        XLSX.writeFile(workbook, filePath);
    }

    // ────────────────────────────────────────────────────
    // CSV Export  –  VisitorImage as plain URL in its column
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

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(csvRows);
        fs.writeFileSync(filePath, csv);
    }

    
    else if (format === "pdf") {

        // Helper: fetch an image URL and return a Buffer (or null on failure)
        const fetchImageBuffer = async (url) => {
            if (!url || url === "-") return null;
            try {
                const response = await fetch(url);
                if (!response.ok) return null;
                const arrayBuffer = await response.arrayBuffer();
                return Buffer.from(arrayBuffer);
            } catch {
                return null;
            }
        };

        // Pre-fetch all visitor images in parallel
        const imageBuffers = await Promise.all(
            formattedData.map((item) => fetchImageBuffer(item.VisitorImage))
        );

        const stream = fs.createWriteStream(filePath);

        // A2 landscape gives ~1190 pt wide × 1684 pt tall (rotated)
        // Use A2 landscape: size [1190, 594] approximately — PDFKit uses
        // predefined "A2" string in landscape mode.
        const doc = new PDFDocument({
            margin: 0,
            size: "A2",
            layout: "landscape"
        });

        doc.pipe(stream);

        // ── Layout constants ──────────────────────────────
        const PAGE_MARGIN_X  = 10;
        const PAGE_MARGIN_TOP = 10;
        const HEADER_HEIGHT  = 24;
        const ROW_HEIGHT     = 110;
        const FONT_HEADER    = 8.5;
        const FONT_BODY      = 7.5;
        const PAGE_HEIGHT    = doc.page.height;   // ~1190 in landscape A2 (height axis)

        // Column definitions — widths must sum to ≤ (pageWidth - 2 * PAGE_MARGIN_X)
        // A2 landscape width = 1587.4 pt → usable = 1567 pt — we use 1550 to be safe
        const COLS = [
            { key: "sr",          label: "#",                  width:  28 },
            { key: "visitor",     label: "Visitor Details",    width: 310 },  // image 90 + text
            { key: "employee",    label: "Employee Details",   width: 230 },
            { key: "appointment", label: "Appointment",        width: 175 },
            { key: "laptop",      label: "Laptop Details",     width: 190 },
            { key: "vehicle",     label: "Vehicle",            width: 105 },
            { key: "status",      label: "Status",             width: 160 },
            { key: "pass",        label: "Pass Details",       width: 140 },
        ];
        // Total: 28+310+230+175+190+105+160+140 = 1338 pt  (fits well within A2 landscape ~1587)

        // ── Draw table header ─────────────────────────────
        const drawHeader = (y) => {

            let x = PAGE_MARGIN_X;

            doc.font("Helvetica-Bold").fontSize(FONT_HEADER);

            for (const col of COLS) {

                doc
                    .rect(x, y, col.width, HEADER_HEIGHT)
                    .fillAndStroke("#1a1a2e", "#000000");

                doc
                    .fillColor("#ffffff")
                    .text(
                        col.label,
                        x + 4,
                        y + (HEADER_HEIGHT - FONT_HEADER) / 2,
                        { width: col.width - 8, align: "center", lineBreak: false }
                    );

                x += col.width;
            }

            doc.fillColor("#000000");
        };

        // ── Draw a single data row ────────────────────────
        const drawRow = (y, index, item, imgBuffer) => {

            let x = PAGE_MARGIN_X;

            // Alternating row background
            const bgColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff";

            // Draw all cell backgrounds first
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

                    // ── Serial number ───────────────────────
                    case "sr":
                        doc.text(
                            String(index + 1),
                            cx, cy,
                            { width: tw, align: "center" }
                        );
                        break;

                    // ── Visitor (photo + text) ──────────────
                    case "visitor": {

                        const IMG_W  = 80;
                        const IMG_H  = 80;
                        const IMG_X  = x + 5;
                        const IMG_Y  = y + (ROW_HEIGHT - IMG_H) / 2;

                        // Photo
                        if (imgBuffer) {
                            try {
                                doc.image(imgBuffer, IMG_X, IMG_Y, {
                                    fit: [IMG_W, IMG_H],
                                    align: "center",
                                    valign: "center"
                                });
                            } catch {
                                doc.fontSize(6).text("No Image", IMG_X, IMG_Y + 30, { width: IMG_W });
                                doc.fontSize(FONT_BODY);
                            }
                        } else {
                            doc
                                .rect(IMG_X, IMG_Y, IMG_W, IMG_H)
                                .strokeColor("#cccccc")
                                .stroke()
                                .strokeColor("#000000");
                            doc.fontSize(6).text("No Photo", IMG_X, IMG_Y + 34, { width: IMG_W, align: "center" });
                            doc.fontSize(FONT_BODY);
                        }

                        // Text block to the right of the image
                        const TX = x + IMG_W + 10;
                        const TW = col.width - IMG_W - 14;

                        const visitorLines = [
                            `Name: ${item.VisitorName}`,
                            `Email: ${item.VisitorEmail}`,
                            `Phone: ${item.VisitorPhone}`,
                            `Position: ${item.VisitorPosition}`,
                            `Company: ${item.VisitorCompany}`
                        ];

                        let ty = cy;
                        for (const line of visitorLines) {
                            doc.text(line, TX, ty, { width: TW, lineBreak: false });
                            ty += 13;
                        }
                        break;
                    }

                    // ── Employee ────────────────────────────
                    case "employee": {
                        const lines = [
                            `Name: ${item.EmployeeName}`,
                            `Email: ${item.EmployeeEmail}`,
                            `Phone: ${item.EmployeePhone}`,
                            `Position: ${item.EmployeePosition}`
                        ];
                        let ty = cy;
                        for (const line of lines) {
                            doc.text(line, cx, ty, { width: tw, lineBreak: false });
                            ty += 13;
                        }
                        break;
                    }

                    // ── Appointment ─────────────────────────
                    case "appointment": {
                        const lines = [
                            `Date:`,
                            item.AppointmentDate,
                            ``,
                            `Check In:`,
                            item.CheckIn,
                            ``,
                            `Check Out:`,
                            item.CheckOut
                        ];
                        let ty = cy;
                        for (const line of lines) {
                            doc.text(line, cx, ty, { width: tw, lineBreak: false });
                            ty += 11;
                        }
                        break;
                    }

                    // ── Laptop ──────────────────────────────
                    case "laptop": {
                        const lines = [
                            `Laptop: ${item.Laptop}`,
                            `Make: ${item.LaptopMake}`,
                            `Model: ${item.LaptopModel}`,
                            `Serial: ${item.LaptopSerialNo}`
                        ];
                        let ty = cy;
                        for (const line of lines) {
                            doc.text(line, cx, ty, { width: tw, lineBreak: false });
                            ty += 13;
                        }
                        break;
                    }

                    // ── Vehicle ─────────────────────────────
                    case "vehicle": {
                        const lines = [
                            `Vehicle: ${item.Vehicle}`,
                            `No: ${item.VehicleNo}`
                        ];
                        let ty = cy;
                        for (const line of lines) {
                            doc.text(line, cx, ty, { width: tw, lineBreak: false });
                            ty += 13;
                        }
                        break;
                    }

                    // ── Status ──────────────────────────────
                    case "status": {
                        const lines = [
                            `Pre-Schedule: ${item.PreScheduled}`,
                            `Approved: ${item.Approved}`,
                            `Rejected: ${item.Rejected}`
                        ];
                        let ty = cy;
                        for (const line of lines) {
                            doc.text(line, cx, ty, { width: tw, lineBreak: false });
                            ty += 13;
                        }
                        break;
                    }

                    // ── Pass ────────────────────────────────
                    case "pass": {
                        doc.text(`Pass ID:`, cx, cy, { width: tw });
                        doc.text(String(item.PassID), cx, cy + 13, { width: tw });
                        break;
                    }

                    default:
                        break;
                }

                x += col.width;
            }
        };

        // ── Title ─────────────────────────────────────────
        doc
            .font("Helvetica-Bold")
            .fontSize(14)
            .text(
                "Appointments Report",
                PAGE_MARGIN_X,
                PAGE_MARGIN_TOP,
                { align: "center", width: COLS.reduce((s, c) => s + c.width, 0) }
            );

        let y = PAGE_MARGIN_TOP + 22;

        drawHeader(y);
        y += HEADER_HEIGHT;

        // ── Data rows ─────────────────────────────────────
        for (const [index, item] of formattedData.entries()) {

            // Page break
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

        // Wait for file write to complete
        await new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });
    }

    // ────────────────────────────────────────────────────
    // Upload To Supabase
    // ────────────────────────────────────────────────────
    const fileBuffer = fs.readFileSync(filePath);

    const mimeTypes = {
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        csv:  "text/csv",
        pdf:  "application/pdf"
    };

    const { error } = await supabase
        .storage
        .from("documents")
        .upload(
            bucketPath,
            fileBuffer,
            {
                contentType: mimeTypes[format],
                upsert: false
            }
        );

    // ── Conflict handling ──────────────────────────────
    if (error) {

        if (
            error.statusCode === "409" ||
            error.message?.includes("already exists")
        ) {

            const { data: existingFile } = supabase
                .storage
                .from("documents")
                .getPublicUrl(bucketPath);

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            return {
                success: true,
                already_exists: true,
                file_url: existingFile.publicUrl
            };
        }

        throw error;
    }

    // ── Public URL ─────────────────────────────────────
    const { data: publicData } = supabase
        .storage
        .from("documents")
        .getPublicUrl(bucketPath);

    // ── Cleanup temp file ──────────────────────────────
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return {
        success: true,
        already_exists: false,
        file_url: publicData.publicUrl
    };
};

export{
    pastAppointmentsService,
    downloadAppointmentsService
}