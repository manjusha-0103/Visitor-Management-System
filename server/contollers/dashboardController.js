import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import sendResponse from "../utils/sendResponse.js";
import { pastAppointmentsService } from "../services/dashboard.service.js";

const pastAppointments = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const {search = "",
        is_approve = null,
        is_preschedule = null,
        date = null
    } = req.query;

    const appointments = await pastAppointmentsService({
            page,
            limit,search,

        // Convert string -> boolean/null
        is_approve:
            is_approve === "true"
                ? true
                : is_approve === "false"
                ? false
                : null,

        is_preschedule:
            is_preschedule === "true"
                ? true
                : is_preschedule === "false"
                ? false
                : null,

        date
    })
    sendResponse(res, 201, appointments, "All appointments")
})


export{
    pastAppointments,
    pastAppointmentsService
}