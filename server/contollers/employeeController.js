import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import sendResponse from "../utils/sendResponse.js";
import { chekIsApproveService,
    preScheduleService
 } from "../services/employeeServices.js";


const chekIsApprove= asyncHandler(async (req, res) => {
    const is_approve = req.query.is_approve === "true"
    const {appointment_id} = req.params
    const appoinment = await chekIsApproveService(is_approve, appointment_id)
    sendResponse(res, 200, appoinment, is_approve?"Approved Meet":"Deny Meet")
})  


const preSchedule = asyncHandler(async (req, res) => {
    const appoinment = await preScheduleService(req.body)
    if(appoinment){
        sendResponse(res, 200, appoinment, "Appointment schedule successfully")
    }
    else{
        throw new ApiError(400, "Failed to schedule")
    }
    
})

export{

    chekIsApprove,
    preSchedule
}