import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import sendResponse from "../utils/sendResponse.js";
import { setPassIdService,
    checkOutService,
    chekIsApproveService
 } from "../services/receptionist.service.js";

import { getIO } from "../config/socket.js";



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

    const appointment = await checkOutService(appointment_id, req.user);
    if(appointment){
        const audit_data = {
            "ip": req.ip,
            "action" : 'checkout',
            "audit_record" :{
                "updated_by" : {
                    ...req.user,
                    
                },
                ...appointment,
                "message" : "Check-out set successfully"
            },
        }

        await auditService(audit_data)
        const io = getIO();

        io.emit("appointment_updated", {
            type: "checked_out",
            data: appoitment
        });

        sendResponse(
            res,
            200,
            appointment,
            "Check-out set successfully"
        );
    }
    else{
        const audit_data = {
            "ip": req.ip,
            "action" : 'checkout_failed',
            "audit_record" :{
                "updated_by" : {
                    ...req.user,
                    
                },
                appointment_id,
                "message" : "Bad request"
            },
        }

        await auditService(audit_data)
        throw new ApiError(400, "Bad request")
    }
 
})

const checkIsApprove = asyncHandler(async (req, res) => {

    const is_approve = req.body.is_approve //=== "true"
    // approval flag logging removed
    
    const {appointment_id} = req.params
    const appoinment = await chekIsApproveService(is_approve, appointment_id, req.user)
    const msg = is_approve? "Appointment approved successfully": "Appointment denied successfully"
    if(appoinment){
        const audit_data = {
            "ip": req.ip,
            "action" : 'checkin_approval',
            "audit_record" :{
                "updated_by" : {
                    ...req.user,
                    
                },
                ...appoinment,
                "message" : msg
            },
        }

        await auditService(audit_data)
        sendResponse(res, 200, appoinment, msg)
    }
    else{
        const audit_data = {
            "ip": req.ip,
            "action" : 'checkin_approval_failed',
            "audit_record" :{
                "updated_by" : {
                    ...req.user,
                    
                },
                appointment_id,
                "is_approve" :is_approve,
                "message" : "Bad request"
            },
        }
        await auditService(audit_data)
        throw new ApiError(400, "Bad request")
    }
})

export{
    setPassId,
    checkOut,
    checkIsApprove
}