// import { generateToken } from "../services/token.service.js"
import sendResponse from "../utils/sendResponse.js";
import ApiResponse from "../utils/ApiResponse.js";
// import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import { checkInService, 
    getAllDepartmentsService ,
    getEmployeesService,
    visitorInfoService
} from "../services/visitorService.js";
import { getIO } from "../config/socket.js";


const checkIn = asyncHandler(async (req, res) => {
    const appointment = await checkInService(req.body)

    console.log(appointment)

    if (appointment) {
        const io = getIO();

         io.emit("appointment_updated", {
            type: "walkin_created",
            data: appointment
        });
        
        sendResponse(
            res,
            200,
            appointment,
            "check-in successful"
        )
    } else {
        throw new ApiError(
            400,
            null,
            "check-in failed"
        )
    }
})

const getAllDepartments = asyncHandler(async(req, res)=>{
    const departments = await getAllDepartmentsService()
    sendResponse(res, 201, departments, "All Departments")
})

const getEmployees = asyncHandler(async (req, res) => {
    const {dept_id} = req.params
    const employees = await getEmployeesService(dept_id)
    sendResponse(res, 201, employees, "ALL Employees")
})

const visitorInfo = asyncHandler(async (req, res) => {
    const {appointment_id} = req.params
    const info = await visitorInfoService(appointment_id)
    sendResponse(res, 201, info, "Visitor info")
})

export{
    checkIn,
    getAllDepartments,
    getEmployees,
    visitorInfo
}