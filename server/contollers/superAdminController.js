import { generateToken } from "../services/token.service.js"
import sendResponse from "../utils/sendResponse.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import XLSX from "xlsx";
import { getALLEmployeesservice,
    getAllUserService,
    addEmployeeService,
    addDepartmentService,
    updateEmployeeService,
    updateUserService
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

const addEmployees = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Excel file is required"
        });
    }

    // Read excel buffer
    const workbook = XLSX.read(req.file.buffer, {
        type: "buffer"
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const employees = XLSX.utils.sheet_to_json(worksheet);

    const results = [];

    for (const employee of employees) {

        try {

            const savedEmployee = await addEmployeeService(employee);

            results.push({
                email: employee.email,
                status: "success",
                data: savedEmployee
            });

        } catch (error) {

            results.push({
                email: employee.email,
                status: "failed",
                message: error.message
            });
        }
    }

    // res.status(200).json({
    //     success: true,
    //     total: employees.length,
    //     results
    // });

    sendResponse(res, 200, {total: employees.length,
        results}, "")
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

const addDepartment = asyncHandler(async (req, res) => {
    const department = await addDepartmentService(req.body)
    if(department){
        sendResponse(res, 200, department,"Added department")
    }
    else {
        throw new ApiError(400, 'Bad request')
    }
})

const updateEmployee = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const updatedEmployee = await updateEmployeeService(id, req.body);

    if(updatedEmployee){
        sendResponse(
            res,
            200,
            updatedEmployee,
            "Employee updated successfully"
        );
    }
    else{
        throw new ApiError(400, "Failed to update employee");
    }

});

const updateUser = asyncHandler(async (req, res) => {
    const {id} = req.params
    const user = await updateUserService(id, req.body)
    if(user){
        sendResponse(
            res,
            200,
            user,
            "User updated successfully"
        );
    }
    else{
        throw new ApiError(400, "Failed to update user");
    }

})




export{
    addEmployee,
    getALLEmployees,
    getAllUsers,
    addDepartment,
    updateEmployee,
    updateUser
    
}