import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import sendResponse from "../utils/sendResponse.js";
import { setPassIdService,
    checkOutService
 } from "../services/receptionist.service.js";

import { getIO } from "../config/socket.js";
import { chekIsApproveService } from "../services/employeeServices.js";
import { send } from "process";


const setPassId = asyncHandler(async (req, res) => {
    const {appointment_id} = req.params
    
    const appoitment = await setPassIdService(appointment_id, req.body)
    if(appoitment){
         const io = getIO();
         io.emit("appointment_updated", {
            type: "pass_id_set",
            data: appoitment
        });
        sendResponse(res, 200, appoitment, "Visitor ID is set to the appointment.")
    }else{
        throw new ApiError(400, "Failed to set")
    }
})

const checkOut = asyncHandler(async (req, res) => {
    const { appointment_id } = req.params;

    const appointment = await checkOutService(appointment_id);
    if(appointment){
         const io = getIO();

        io.emit("appointment_updated", {
            type: "checked_out",
            data: appoitment
        });
    }

    sendResponse(
        res,
        200,
        appointment,
        "Check-out set successfully"
    );
})

const checkIsApprove = asyncHandler(async (req, res) => {

    const is_approve = req.body.is_approve //=== "true"
    console.log("is_approve", req.body.is_approve);
    
    const {appointment_id} = req.params
    const appoinment = await chekIsApproveService(is_approve, appointment_id)
    const msg = is_approve? "Appointment approved successfully": "Appointment denied successfully"
    if(appoinment){sendResponse(res, 200, appoinment, msg)}
    else{throw new ApiError(400, "Bad request")}
})

export{
    setPassId,
    checkOut,
    checkIsApprove
}