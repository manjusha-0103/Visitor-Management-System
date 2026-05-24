import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"


const processtBirthdayService = async () => {
    
    const users = await sql`
        SELECT 
            id,
            CONCAT(first_name, ' ', last_name) AS name
        FROM "Users"
        WHERE
            EXTRACT(DAY FROM birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
            AND
            EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    `
    return users
}

export{
    processtBirthdayService
}