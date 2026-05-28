import bcrypt from "bcryptjs";
import sql from "../db/database.js";
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/mailer.js";


const auditService = async (data) => {
    await sql`
        INSERT INTO "Audits"
        ("ip_address","audit_record", "action")
        VALUES(${data.ip}, ${data.audit_record}, ${data.action})
    `
}

export{
    auditService
}