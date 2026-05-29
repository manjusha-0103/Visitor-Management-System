import sql from "../db/database.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { auditService } from "./audit.service.js";

const setPassIdService = async (appointment_id, data) => {
  const { pass_id } = data;
  const [amp] = await sql`
        UPDATE "Appointments" 
        SET "pass_id" = ${pass_id}
        WHERE id = ${appointment_id}
        RETURNING *
    `;

  if (!amp) {
    throw new ApiError(404, "Appointment not found");
  }

  return amp;
};

const checkOutService = asyncHandler(async (appointment_id, user) => {
  const date_time = new Date();

  const [amp] = await sql`
        UPDATE "Appointments" 
        SET "check_out" = ${date_time}
        WHERE id = ${appointment_id}
        RETURNING *
    `;

  if (!amp) {
    const audit_data = {
        "ip": req.ip,
        "action" : 'checkout_failed',
        "audit_record" :{
            "updated_by" : {
                ...user,
                
            },
            appointment_id,
            "message" : "Appointment not found"
        },
    }

    await auditService(audit_data)
    throw new ApiError(404, "Appointment not found");
  }

  return amp;
});

const chekIsApproveService = async (is_approve, appointment_id, ip, user) => {
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
            "updated_by" : {
              ...user
            },
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
              ...user
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

export { setPassIdService, 
  checkOutService,
  chekIsApproveService
};
