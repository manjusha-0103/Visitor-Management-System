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

    const appointments = await pastAppointmentsService({
            page,
            limit
    })
    sendResponse(res, 201, appointments, "All appointments")
})


export{
    pastAppointments,
    pastAppointmentsService
}