import bcrypt from "bcryptjs";
import sql from "../db/database.js";
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/mailer.js";
import { userExistbyemailService } from "./auth.service.js";
import { scheduleEvent } from "../config/googleCalender.js";

const chekIsApproveService = async (is_approve, appointment_id, ip) => {
  const [amp] = await sql`
    WITH updated AS (
      UPDATE "Appointments"
      SET 
        "is_approve" = ${is_approve},
        "is_rejected" = ${!is_approve}
      WHERE "id" = ${appointment_id}
      RETURNING *
    )

    SELECT 
      updated.*,

      u."first_name" AS employee_first_name,
      u."last_name" AS employee_last_name,
      u."email" AS employee_email,
      u."phone" AS employee_phone

    FROM updated
      LEFT JOIN "Employee" e 
        ON e."id" = updated."employee_id"

      LEFT JOIN "Users" u 
        ON u."id" = e."user_id"
  `;

  if (!amp) {
    const audit_data = {
        "ip": ip,
        "action" : 'checkin_approval_failed',
        "audit_record" :{
            "updated_by" : "employee",
            "approval_status" : is_approve,
            "appointment_id" : appointment_id,
            "message" : "Appointment not found"
        },
    }

    await auditService(audit_data)
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
    const audit_data = {
        "ip": ip,
        "action" : 'checkin_approval_failed',
        "audit_record" :{
            "updated_by" : {
              "email" :amp.employee_email,
              "name" : `${amp.employee_first_name } ${amp.employee_email }`,
              "phone" : amp.employee_phone
            },
            "approval_status" : is_approve,
            ...amp,
            "message" : "Visitor not found"
        },
    }

    await auditService(audit_data)
    throw new ApiError(404, "Visitor not found");
  }

  return { amp, visitor };
};

const preScheduleService = async ({ visitors, date_time, employee_email, login_user }, ip) => {
  let amp = [];
  let vs = [];

  const [employee] = await sql`
        SELE
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

  const preschedule_by = login_user? login_user: employee_email
  if (!employee) {
    const audit_data = {
        "ip": req.ip,
        "action" : 'preschedule_failed',
        "audit_record" :{
            "updated_by" : {
                "email" : preschedule_by,
                
            },
            ...visitors,
            date_time,
            employee_email,
            "message" : "Employee not found"
        },
    }

    await auditService(audit_data)
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

  const descriptions = `
    Visitor Details:

    ${visitors.map((visitor, index) => `
      Visitor ${index + 1}:

      Name: ${visitor.first_name} ${visitor.last_name}
      Email: ${visitor.email}
      Phone: ${visitor.phone}
      Company: ${visitor.company}
    `).join('\n')}
`;

  const event = {
    summary: 'Visitor Meeting',

    description: descriptions,

    startDateTime: new Date(date_time).toISOString(),

    endDateTime: new Date(
      new Date(date_time).getTime() + 30 * 60000
    ).toISOString(),

    attendees: [
      // Employee
      employee_email,

      // Visitors
      ...visitors.map(visitor => visitor.email),
    ],
  };
  const credentialID = login_user ? login_user : employee.user_id
  const response = await scheduleEvent(event, credentialID);

  return {
    amp,
    employee,
    vs,
    response
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


export const getGoogleCalendarStatusService = async (
    email
) => {
    const [emp] = await sql`
        SELECT
            u.id,
            u.email,
            u.google_calendar_connected
        FROM "Users" u
        WHERE u.email = ${email}
    `;
    // console.log(emp);
    

    return emp;
};


export {
  chekIsApproveService,
  preScheduleService,
  allSuperAdminService,
  employeeEsistService,
};
