import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"

const chekIsApproveService = async (is_approve, appointment_id) => {
    console.log(is_approve, appointment_id)
    const amp = await sql`
        UPDATE "Appointments"
        SET "is_approve" = ${is_approve}
        WHERE "id" = ${appointment_id}
        RETURNING *
    `

    return amp
}

const preScheduleService = async ({employee_email, visitors, date_time}) => {
    let amp  = []
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
    `
    let visitorexist;
    for(let v of visitors){
        visitorexist = await userExistbyemailService(v.email)
        if(visitorexist.length){
            let [ampp] = await sql`
                INSERT INTO "Appointments" ("employee_id", "visitor_id", "is_preschedule", "date_time")
                values(${employee.employee_id}, ${visitorexist[0].id}, 'true', ${date_time} )
                RETURNING *
            `
            amp.append(ampp)

        }
        else{
            visitor = await sql`
                INSERT INTO "Visitors" ("is_laptop", "laptop_make", "laptop_model", "laptop_serial_no", "is_vehicle", "vehicle_no", "position", "company","user_id")
                VALUES (${is_laptop}, ${make}, ${model}, ${serial_no}, ${is_vehicle}, ${vehicle_no}, ${position}, ${company}, ${user[0].id})
                RETURNING *
            `
            let [ampp] = await sql`
                INSERT INTO "Appointments" ("employee_id", "visitor_id", "is_preschedule", "date_time")
                values(${employee.employee_id}, ${visitorexist[0].id}, 'true', ${date_time} )
                RETURNING *
            `
            amp.append(ampp)
        }   
    }

    return {
        amp, employee, visitors
    }
}

export{
    chekIsApproveService
}