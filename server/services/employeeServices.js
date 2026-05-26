import bcrypt from "bcryptjs";
import sql from "../db/database.js";
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/mailer.js";
import { userExistbyemailService } from "./auth.service.js";

const chekIsApproveService = async (is_approve, appointment_id) => {
  const [amp] = await sql`
        UPDATE "Appointments"
        SET 
            "is_approve" = ${is_approve},
            "is_rejected" = ${!is_approve}
        WHERE "id" = ${appointment_id}
        RETURNING *
    `;

  if (!amp) {
    throw new ApiError(404, "Appointment not found");
  }

  const [visitor] = await sql`
        SELECT 
            CONCAT(u.first_name, ' ', u.last_name) AS full_name,
            u.email,
            u.phone,
            v.company,
            v.position
        FROM "Users" u
        JOIN "Visitors" v
            ON v.user_id = u.id
        WHERE  v.id = ${amp.visitor_id}
    `;

  if (!visitor) {
    throw new ApiError(404, "Visitor not found");
  }

  return { amp, visitor };
};

const preScheduleService = async ({ visitors, date_time, employee_email }) => {
  let amp = [];
  let vs = [];

  const [employee] = await sql`
        SELECT
            e.id AS employee_id,
            e.user_id,
            e.department,
            e.position,

            u.id AS user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone
        FROM "Employee" e
        JOIN "Users" u
            ON u.id = e.user_id
        WHERE u.email = ${employee_email}
    `;

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  for (let v of visitors) {
    const visitorexist = await userExistbyemailService(v.email);

    // visitorexist logging removed

    // Existing visitor
    if (visitorexist.length) {
      let [existingVisitor] = await sql`
                SELECT * FROM "Visitors"
                WHERE "user_id" = ${visitorexist[0].id}
            `;

      if (!existingVisitor) {
        const [createdVisitor] = await sql`
                    INSERT INTO "Visitors"
                    ("position", "company", "user_id")
                    VALUES (
                        ${v.position},
                        ${v.company},
                        ${visitorexist[0].id}
                    )
                    RETURNING *
                `;
        existingVisitor = createdVisitor;
      }

      let [ampp] = await sql`
                INSERT INTO "Appointments"
                ("employee_id", "visitor_id", "is_preschedule", "date_time", "is_approve", "visitor_company", "visitor_position")
                VALUES (
                    ${employee.employee_id},
                    ${existingVisitor.id},
                    ${true},
                    ${date_time},
                    'true',
                    ${v.company},
                    ${v.position}
                )
                RETURNING *
            `;

      amp.push(ampp);

      vs.push(existingVisitor);
    } else {
      // Create user
      const [user] = await sql`
                INSERT INTO "Users"
                ("email", "first_name", "last_name", "role", "phone")
                VALUES (
                    ${v.email},
                    ${v.first_name},
                    ${v.last_name},
                    ${"visitor"},
                    ${v.phone}
                )
                RETURNING
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                    "role",
                    "phone"
            `;

      // Create visitor
      const [visitor] = await sql`
                INSERT INTO "Visitors"
                ("position", "company", "user_id")
                VALUES (
                    ${v.position},
                    ${v.company},
                    ${user.id}
                )
                RETURNING *
            `;

      // Create appointment
      let [ampp] = await sql`
                INSERT INTO "Appointments"
                ("employee_id", "visitor_id", "is_preschedule", "date_time","is_approve", "visitor_company", "visitor_position")
                VALUES (
                    ${employee.employee_id},
                    ${visitor.id},
                    ${true},
                    ${date_time},
                    'true',
                    ${v.company},
                    ${v.position}
                )
                RETURNING *
            `;

      amp.push(ampp);

      // FIXED HERE
      vs.push(visitor);
    }
  }

  return {
    amp,
    employee,
    vs,
  };
};

const employeeEsistService = async (email) => {
  const [emp] = await sql`
        SELECT 
            u.*,
            e.*
        
        FROM "Users" u
        JOIN "Employee" e
            ON e.user_id = u.id
        WHERE u.email = ${email} AND u.role = 'employee'
    `;
  return emp;
};

const allSuperAdminService = async () => {
  const super_admin = await sql`
        SELECT * FROM "Users"
        WHERE role = 'super_admin'
    `;
  return super_admin;
};
export {
  chekIsApproveService,
  preScheduleService,
  allSuperAdminService,
  employeeEsistService,
};
