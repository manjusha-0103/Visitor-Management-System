import bcrypt from "bcryptjs";
import sql from "../db/database.js";
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/mailer.js";
import { userExistbyemailService } from "./auth.service.js";
import { uploadFile } from "../config/uploadFile.js";
import { getBackendUrl } from "../config/runtimeUrls.js";
import escapeHtml from "../utils/escapeHtml.js";

const checkInService = async (
  {
    first_name,
    last_name,
    email,
    phone,
    position,
    is_laptop,
    company,
    make,
    model,
    serial_no,
    is_vehicle,
    vehicle_no,
    employee_id,
    purpose,
    loggedin_user
  },
  file,
  
) => {
  // console.log("loggedin_user", loggedin_user);
  const loggedInUserId = loggedin_user ?? null;
  
  const [visitorexist] = await userExistbyemailService(email);
  const date_time = new Date();
  const photo_url = await uploadFile(file, "visitor_photos");
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
        WHERE e.id = ${employee_id}
    `;
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }
  
  let appointment, visitor;
  
  if (visitorexist) {
    visitor = await sql`
        UPDATE "Visitors"
        SET "is_laptop" = ${is_laptop},
            "laptop_make" = ${make},
            "laptop_model" = ${model},
            "laptop_serial_no" = ${serial_no},
            "is_vehicle" = ${is_vehicle},
            "vehicle_no" = ${vehicle_no},
            "position" = ${position},
            "company" = ${company},
            "photo" = ${photo_url}
        WHERE "user_id" = ${visitorexist.id}
        RETURNING *
    `;

    
    
    
    appointment = await sql`
            INSERT INTO "Appointments" ("employee_id", "visitor_id", "check_in", "date_time","is_laptop", "make", "model", "serial_no", "is_vehicle", "vehicle_no", "visitor_company", "visitor_position", "visitor_img", "purpose", "schedule_by")
            values(${employee_id}, ${visitor[0].id}, ${date_time}, ${date_time}, ${is_laptop}, ${make}, ${model}, ${serial_no}, ${is_vehicle}, ${vehicle_no}, ${company}, ${position}, ${photo_url}, ${purpose}, ${loggedInUserId} )
            RETURNING *
        `;

    const backendUrl = getBackendUrl();

    await sendEmail({
      to: employee.email,
      subject: "Appoiment Check-In",
      html: `
                <p>Hi ${escapeHtml(employee.first_name)} ${escapeHtml(employee.last_name)}</p>
                <p>${escapeHtml(first_name)} ${escapeHtml(last_name)}(${escapeHtml(company)}) wants to meet</p>
                <p>Name: ${escapeHtml(first_name)} ${escapeHtml(last_name)}(${escapeHtml(company)})</p>
                <p>Email: ${escapeHtml(email)}</p>
                <p>Phone: ${escapeHtml(phone)}</p>
                <img src=${photo_url}>
                <div style="text-align:center; margin-top:25px;">


                <a href="${escapeHtml(backendUrl)}/api/v1/employee/is-approve/${appointment[0].id}?is_approve=true"
                style="
                    background:#10b981;
                    color:#fff;
                    text-decoration:none;
                    padding:12px 22px;
                    border-radius:6px;
                    margin-right:10px;
                    display:inline-block;
                    font-weight:bold;
                ">
                Approve
                </a>

                <a href="${escapeHtml(backendUrl)}/api/v1/employee/is-approve/${appointment[0].id}?is_approve=false"
                style="
                    background:#ef4444;
                    color:#fff;
                    text-decoration:none;
                    padding:12px 22px;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;
                ">
                Deny
                </a>

            </div>
                
            `,
    });

    return { visitorexist, visitor, appointment, employee };
  } else {
    const user = await sql`
            INSERT INTO "Users" ("email", "first_name", "last_name", "role", "phone")
            VALUES (${email}, ${first_name}, ${last_name}, ${"visitor"}, ${phone})
            RETURNING "id", "first_name", "last_name", "email", "role", "phone"
        `;
    // user logging removed
    console.log(user);
    
    const backendUrl = getBackendUrl();
    // if (!user || !user[0]) {
    //   throw new ApiError(500, "Failed to create user");
    // }

    // if (!visitor || !visitor[0]) {
    //   throw new ApiError(500, "Failed to create visitor");
    // }

    // if (!appointment || !appointment[0]) {
    //   throw new ApiError(500, "Failed to create appointment");
    // }

    visitor = await sql`
            INSERT INTO "Visitors" ("is_laptop", "laptop_make", "laptop_model", "laptop_serial_no", "is_vehicle", "vehicle_no", "position", "company","user_id", "photo")
            VALUES (${is_laptop}, ${make}, ${model}, ${serial_no}, ${is_vehicle}, ${vehicle_no}, ${position}, ${company}, ${user[0].id}, ${photo_url})
            RETURNING *
        `;
    // console.log(visitor)
    appointment = await sql`
            INSERT INTO "Appointments" ("employee_id", "visitor_id", "check_in", "date_time","is_laptop", "make", "model", "serial_no", "is_vehicle", "vehicle_no", "visitor_company", "visitor_position", "visitor_img", "schedule_by")
            values(${employee.employee_id}, ${visitor[0].id}, ${date_time}, ${date_time} ,${is_laptop}, ${make}, ${model}, ${serial_no}, ${is_vehicle}, ${vehicle_no}, ${company}, ${position}, ${photo_url}, ${loggedInUserId})
            RETURNING *
        `;
    

    await sendEmail({
      to: employee.email,
      subject: "Appoiment Check-In",
      html: `
                <p>Hi ${escapeHtml(employee.first_name)} ${escapeHtml(employee.last_name)}</p>
                <p>${escapeHtml(first_name)} ${escapeHtml(last_name)}(${escapeHtml(company)}) wants to meet</p>
                <p>Name: ${escapeHtml(first_name)} ${escapeHtml(last_name)}(${escapeHtml(company)})</p>
                <p>Email: ${escapeHtml(email)}</p>
                <p>Phone: ${escapeHtml(phone)}</p>
                <img src=${photo_url}>
                <div style="text-align:center; margin-top:25px;">

                <a href="${escapeHtml(backendUrl)}/api/v1/employee/is-approve/${appointment[0].id}?is_approve=true"
                style="
                    background:#10b981;
                    color:#fff;
                    text-decoration:none;
                    padding:12px 22px;
                    border-radius:6px;
                    margin-right:10px;
                    display:inline-block;
                    font-weight:bold;
                ">
                Approve
                </a>

                <a href="${escapeHtml(backendUrl)}/api/v1/employee/is-approve/${appointment[0].id}?is_approve=false"
                style="
                    background:#ef4444;
                    color:#fff;
                    text-decoration:none;
                    padding:12px 22px;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;
                ">
                Deny
                </a>

            </div>
                
            `,
    });

    return { user, visitor, appointment, employee };
  }
};

const getAllDepartmentsService = async () => {
  const dept = await sql`
        SELECT * FROM "Departments"
    `;
  return dept;
};

const getEmployeesService = async (dept_id) => {
  const emp = await sql`
        SELECT
            e.id,
            e.position,
            e.department,

            u.first_name,
            u.last_name,
            u.email,
            u.phone

        FROM "Employee" e

        JOIN "Users" u
            ON u.id = e.user_id

        WHERE e.department = ${dept_id}

        ORDER BY u.first_name ASC
    `;

  return emp;
};

const visitorInfoService = async (appointment_id) => {
  const visitor = await sql`
        SELECT 
            a.id AS appointment_id,
            a.created_at AS appointment_created_at,
            a.check_in,
            a.check_out,
            a.date_time,
            a.is_preschedule,
            a.is_approve,

            v.id AS visitor_id,
            a.visitor_position,
            a.visitor_company,
            a.is_laptop,
            a.make,
            a.model,
            a.serial_no,
            a.is_vehicle,
            a.vehicle_no,
            a.pass_id,

            u.first_name AS visitor_first_name,
            u.last_name AS visitor_last_name,
            u.email AS visitor_email,
            u.phone AS visitor_phone

        FROM "Appointments" a
        JOIN "Visitors" v
            ON v.id = a.visitor_id

        JOIN "Users" u
            ON u.id = v.user_id
        
        WHERE a.id = ${appointment_id}
    `;

  return visitor;
};

export {
  checkInService,
  getAllDepartmentsService,
  getEmployeesService,
  visitorInfoService,
};
