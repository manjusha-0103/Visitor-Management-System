import { generateToken } from "../services/token.service.js"
import sendResponse from "../utils/sendResponse.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import { getALLEmployeesservice,
    getAllUserService,
    addEmployeeService
 } from "../services/superAdmin.service.js";

const addEmployee = asyncHandler(async (req, res) => {
    const employee = await addEmployeeService(req.body)

    if(employee){
        sendResponse(res, 200, employee, "Added employee successfully")
    }
    else{
        throw new ApiError(400, 'Bad request')
    }
})

const getALLEmployees = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const {search = "", department= null} = req.query;
    const employees = await getALLEmployeesservice({page, limit, search, department})
    sendResponse(res, 201, employees, "All employess")
})

const getAllUsers = asyncHandler(async(req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const {search = "",role } = req.query;
    const users = await getAllUserService({page, limit, search, role})
    sendResponse(res, 201, users, "All Users")
})

export{
    addEmployee,
    getALLEmployees,
    getAllUsers,
    
}