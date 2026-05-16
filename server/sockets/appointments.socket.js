// import sql from "../db/database.js";


// const getAppointments = (socket, io) => {

//     socket.on("get_preschedule_appoi", async ({ page = 1, limit = 10 }) => {

//         try {

//             const offset = (page - 1) * limit;

//             // Total Count
//             const [countResult] = await sql`
//                 SELECT COUNT(*) AS total
//                 FROM "Appointments" a
//                 WHERE
//                     a.date_time::date = CURRENT_DATE
//                     AND a.is_preschedule = true
//             `;

//             const total = Number(countResult.total);

//             // Fetch appointments
//             const amps = await sql`
//                 SELECT
//                     -- Appointment
//                     a.id AS appointment_id,
//                     a.created_at AS appointment_created_at,
//                     a.check_in,
//                     a.check_out,
//                     a.date_time,
//                     a.is_preschedule,
//                     a.is_approve,

//                     -- Employee
//                     e.id AS employee_id,
//                     e.position AS employee_position,
//                     e.department,

//                     -- Employee User
//                     eu.first_name AS employee_first_name,
//                     eu.last_name AS employee_last_name,
//                     eu.email AS employee_email,
//                     eu.phone AS employee_phone,

//                     -- Visitor
//                     v.id AS visitor_id,
//                     v.position AS visitor_position,
//                     v.company,
//                     v.is_laptop,
//                     v.laptop_make,
//                     v.laptop_model,
//                     v.laptop_serial_no,
//                     v.is_vehicle,
//                     v.vehicle_no,
//                     v.pass_id,

//                     -- Visitor User
//                     vu.first_name AS visitor_first_name,
//                     vu.last_name AS visitor_last_name,
//                     vu.email AS visitor_email,
//                     vu.phone AS visitor_phone

//                 FROM "Appointments" a

//                 JOIN "Employee" e
//                     ON e.id = a.employee_id

//                 JOIN "Visitors" v
//                     ON v.id = a.visitor_id

//                 JOIN "Users" eu
//                     ON eu.id = e.user_id

//                 JOIN "Users" vu
//                     ON vu.id = v.user_id

//                 WHERE
//                     a.date_time::date = CURRENT_DATE
//                     AND a.is_preschedule = true

//                 ORDER BY a.date_time DESC

//                 LIMIT ${limit}
//                 OFFSET ${offset}
//             `;

//             socket.emit("preschedule_appoi_response", {
//                 success: true,
//                 data: amps,

//                 pagination: {
//                     total,
//                     page,
//                     limit,
//                     totalPages: Math.ceil(total / limit),
//                     hasNextPage: page < Math.ceil(total / limit),
//                     hasPrevPage: page > 1
//                 }
//             });

//         } catch (error) {

//             console.error(error);

//             socket.emit("preschedule_appoi_response", {
//                 success: false,
//                 message: error.message
//             });
//         }
//     });

//     socket.on("get_current_check_in", async ({ page = 1, limit = 10 }) => {
//         try {

//             const offset = (page - 1) * limit;

//             // Total Count
//             const [countResult] = await sql`
//                 SELECT COUNT(*) AS total
//                 FROM "Appointments" a
//                 WHERE
//                     a.date_time::date = CURRENT_DATE
//                     AND a.is_preschedule = false
//             `;

//             const total = Number(countResult.total);

//             // Fetch appointments
//             const amps = await sql`
//                 SELECT
//                     -- Appointment
//                     a.id AS appointment_id,
//                     a.created_at AS appointment_created_at,
//                     a.check_in,
//                     a.check_out,
//                     a.date_time,
//                     a.is_preschedule,
//                     a.is_approve,

//                     -- Employee
//                     e.id AS employee_id,
//                     e.position AS employee_position,
//                     e.department,

//                     -- Employee User
//                     eu.first_name AS employee_first_name,
//                     eu.last_name AS employee_last_name,
//                     eu.email AS employee_email,
//                     eu.phone AS employee_phone,

//                     -- Visitor
//                     v.id AS visitor_id,
//                     v.position AS visitor_position,
//                     v.company,
//                     v.is_laptop,
//                     v.laptop_make,
//                     v.laptop_model,
//                     v.laptop_serial_no,
//                     v.is_vehicle,
//                     v.vehicle_no,
//                     v.pass_id,

//                     -- Visitor User
//                     vu.first_name AS visitor_first_name,
//                     vu.last_name AS visitor_last_name,
//                     vu.email AS visitor_email,
//                     vu.phone AS visitor_phone

//                 FROM "Appointments" a

//                 JOIN "Employee" e
//                     ON e.id = a.employee_id

//                 JOIN "Visitors" v
//                     ON v.id = a.visitor_id

//                 JOIN "Users" eu
//                     ON eu.id = e.user_id

//                 JOIN "Users" vu
//                     ON vu.id = v.user_id

//                 WHERE
//                     a.date_time::date = CURRENT_DATE
//                     AND a.is_preschedule = false

//                 ORDER BY a.date_time DESC

//                 LIMIT ${limit}
//                 OFFSET ${offset}
//             `;

//             socket.emit("checkin_appoi_response", {
//                 success: true,
//                 data: amps,

//                 pagination: {
//                     total,
//                     page,
//                     limit,
//                     totalPages: Math.ceil(total / limit),
//                     hasNextPage: page < Math.ceil(total / limit),
//                     hasPrevPage: page > 1
//                 }
//             });

//         } catch (error) {

//             console.error(error);

//             socket.emit("preschedule_appoi_response", {
//                 success: false,
//                 message: error.message
//             });
//         }
//     })

// };

// export{
//     getAppointments
// }