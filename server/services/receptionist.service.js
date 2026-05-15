import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { assign } from "nodemailer/lib/shared/index.js"
import asyncHandler from "../utils/asyncHandler.js"


const setPassIdService = async (appointment_id, data) => {
    const {pass_id} = data
    const amp = await sql `
        UPDATE "Appointments" 
        SET "pass_id" = ${pass_id}
        WHERE id = ${appointment_id}
        RETURNING *
    `
    return amp
}

const checkOutService = asyncHandler(async (appointment_id) => {
    // const 
    // const amp = await sql `
    //     UPDATE "Appointments" 
    //     SET "check_out" = ${pass_id}
    //     WHERE id = ${appointment_id}
    //     RETURNING *
    // `
    // return amp
    
})

export{
    setPassIdService,
    checkOutService
}