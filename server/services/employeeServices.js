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

export{
    chekIsApproveService
}