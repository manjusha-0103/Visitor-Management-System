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


const setPassId = asyncHandler(async (req, res) => {
    const {appointment_id} = req.params
    
    const appoitment = await setPassIdService(appointment_id, req.body)
    if(appoitment){
        sendResponse(res, 200, appoitment, "Set PassID")
    }else{
        throw new ApiError(400, "Failed to set")
    }
})

const checkOut = asyncHandler(async (req, res) => {
    const { appointment_id } = req.params;

    const appointment = await checkOutService(appointment_id);

    sendResponse(
        res,
        200,
        appointment,
        "Check-out set successfully"
    );
})

export{
    setPassId,
    checkOut
}