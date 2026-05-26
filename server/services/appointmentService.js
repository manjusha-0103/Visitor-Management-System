import sql from "../db/database.js";

// export const getAppointmentsService = async ({
//   type,
//   page = 1,
//   limit = 10,
// }) => {

//   const offset = (page - 1) * limit;

//   let whereClause;

//   const today = sql`
//     DATE(NOW() AT TIME ZONE 'Asia/Kolkata')
//   `;

//   const appointmentDate = sql`
//     DATE(a.date_time AT TIME ZONE 'Asia/Kolkata')
//   `;

//   // ─────────────────────────────
//   // TYPE CONDITIONS
//   // ─────────────────────────────

//   if (type === "walkin") {
//     whereClause = sql`
//       ${appointmentDate} = ${today}
//       AND a.is_preschedule = false
//     `;
//   }

//   else if (type === "prescheduled") {
//     whereClause = sql`
//       ${appointmentDate} >= ${today}
//       AND a.is_preschedule = true
//     `;
//   }

//   else if (type === "past") {
//     whereClause = sql`
//       ${appointmentDate} < ${today}
//     `;
//   }

//   else {
//     throw new Error("Invalid appointment type");
//   }

//   // ─────────────────────────────
//   // COUNT
//   // ─────────────────────────────

//   const [countResult] = await sql`
//     SELECT COUNT(*) AS total
//     FROM "Appointments" a
//     WHERE ${whereClause}
//   `;

//   const total = Number(countResult.total);

//   // ─────────────────────────────
//   // DATA
//   // ─────────────────────────────

//   const data = await sql`
//     SELECT
//       -- Appointment
//       a.id AS appointment_id,
//       a.created_at AS appointment_created_at,
//       a.check_in,
//       a.check_out,
//       a.date_time,
//       a.is_preschedule,
//       a.is_approve,
//       a.pass_id,

//       -- Employee
//       e.id AS employee_id,
//       e.position AS employee_position,
//       e.department,

//       -- Employee User
//       eu.first_name AS employee_first_name,
//       eu.last_name AS employee_last_name,
//       eu.email AS employee_email,
//       eu.phone AS employee_phone,

//       -- Visitor
//       v.id AS visitor_id,
//       v.position AS visitor_position,
//       v.company,
//       v.is_laptop,
//       v.laptop_make,
//       v.laptop_model,
//       v.laptop_serial_no,
//       v.is_vehicle,
//       v.vehicle_no,

//       -- Visitor User
//       vu.first_name AS visitor_first_name,
//       vu.last_name AS visitor_last_name,
//       vu.email AS visitor_email,
//       vu.phone AS visitor_phone

//     FROM "Appointments" a

//     JOIN "Employee" e
//       ON e.id = a.employee_id

//     JOIN "Visitors" v
//       ON v.id = a.visitor_id

//     JOIN "Users" eu
//       ON eu.id = e.user_id

//     JOIN "Users" vu
//       ON vu.id = v.user_id

//     WHERE ${whereClause}

//     ORDER BY a.date_time DESC

//     LIMIT ${limit}
//     OFFSET ${offset}
//   `;

//   return {
//     data,

//     pagination: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//       hasNextPage: page < Math.ceil(total / limit),
//       hasPrevPage: page > 1,
//     },
//   };
// };

export const getAppointmentsService = async ({
  type,
  page = 1,
  limit = 10,
  search = "",
  is_approve = null,
  is_preschedule = null,
  date = null,
}) => {
  const offset = (page - 1) * limit;

  const today = sql`
    DATE(NOW() AT TIME ZONE 'Asia/Kolkata')
  `;

  const appointmentDate = sql`
    DATE(a.date_time AT TIME ZONE 'Asia/Kolkata')
  `;

  let whereClause = sql`1=1`;
  let orderClause = sql`a.date_time ASC`;

  // -------------------
  // TYPE FILTER
  // -------------------
  if (type === "walkin") {
    whereClause = sql`
      ${whereClause}
      AND ${appointmentDate} = ${today}
      AND a.is_preschedule = false
    `;
    orderClause = sql`a.created_at DESC`;
  }

  if (type === "all") {
    whereClause = sql`
      ${whereClause}
      AND ${appointmentDate} = ${today}
    `;
  }

  if (type === "prescheduled") {
    whereClause = sql`
      ${whereClause}
      AND ${appointmentDate} >= ${today}
      AND a.is_preschedule = true
    `;
  }

  if (type === "past") {
    whereClause = sql`
      ${whereClause}
      AND ${appointmentDate} < ${today}
    `;
  }

  // -------------------
  // SEARCH (COMMON)
  // -------------------
  if (search) {
    whereClause = sql`
      ${whereClause}
      AND (
        eu.email ILIKE ${`%${search}%`}
        OR eu.first_name ILIKE ${`%${search}%`}
        OR eu.last_name ILIKE ${`%${search}%`}
        OR vu.email ILIKE ${`%${search}%`}
        OR vu.first_name ILIKE ${`%${search}%`}
        OR vu.last_name ILIKE ${`%${search}%`}
        OR v.company ILIKE ${`%${search}%`}
      )
    `;
  }

  // -------------------
  // FILTERS (ONLY APPLY IF PASSED)
  // -------------------
  if (is_approve !== null) {
    whereClause = sql`
      ${whereClause}
      AND a.is_approve = ${is_approve}
    `;
  }

  if (is_preschedule !== null) {
    whereClause = sql`
      ${whereClause}
      AND a.is_preschedule = ${is_preschedule}
    `;
  }

  if (date) {
    whereClause = sql`
      ${whereClause}
      AND a.date_time::date = ${date}
    `;
  }

  // -------------------
  // DATA QUERY
  // -------------------
  const data = await sql`
    SELECT
    -- Appointment
      a.id AS appointment_id,
      a.created_at AS appointment_created_at,
      a.check_in,
      a.check_out,
      a.date_time,
      a.is_preschedule,
      a.is_approve,
      a.is_rejected,
      a.pass_id,
      a.visitor_img,

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

      -- Visitor User
      vu.first_name AS visitor_first_name,
      vu.last_name AS visitor_last_name,
      vu.email AS visitor_email,
      vu.phone AS visitor_phone
    FROM "Appointments" a
    JOIN "Employee" e ON e.id = a.employee_id
    JOIN "Visitors" v ON v.id = a.visitor_id
    JOIN "Users" eu ON eu.id = e.user_id
    JOIN "Users" vu ON vu.id = v.user_id
    WHERE ${whereClause}
    ORDER BY ${orderClause}
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const [countResult] = await sql`
    SELECT COUNT(*) AS total
    FROM "Appointments" a
    JOIN "Employee" e ON e.id = a.employee_id
    JOIN "Visitors" v ON v.id = a.visitor_id
    JOIN "Users" eu ON eu.id = e.user_id
    JOIN "Users" vu ON vu.id = v.user_id
    WHERE ${whereClause}
  `;

  const total = Number(countResult.total);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};
