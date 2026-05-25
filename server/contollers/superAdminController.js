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
    updateUserService,
    deleteDeparmentService,
    deleteEmployeeService
 } from "../services/superAdmin.service.js";
import { request } from "http";
import fs from 'fs'
import csv from 'csv-parser'
import { Readable } from 'stream'
import { sendEmail } from "../utils/mailer.js";

const parseExcel = (buffer) => {

    const workbook = XLSX.read(buffer, {
        type: 'buffer'
    })

    const sheetName = workbook.SheetNames[0]

    const sheet = workbook.Sheets[sheetName]

    return XLSX.utils.sheet_to_json(sheet)
}

const parseCSV = async (buffer) => {

    return new Promise((resolve, reject) => {

        const results = []

        const stream = Readable.from(buffer)

        stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error))
    })
}

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
        throw new ApiError(400, 'File is required')
    }

    const fileBuffer = req.file.buffer

    const ext = req.file.originalname
        .split('.')
        .pop()
        .toLowerCase()

    let employees = []


    if (ext === 'csv') {

        employees = await parseCSV(fileBuffer)

    } else if (ext === 'xlsx' || ext === 'xls') {

        employees = parseExcel(fileBuffer)

    } else {

        throw new ApiError(
            400,
            'Only CSV or Excel files are allowed'
        )
    }

    const imported = []

    const failed = []


    for (const row of employees) {

        try {

            const {
                first_name,
                last_name,
                email,
                phone,
                role,
                birth_date,
                company,
                department,
                position
            } = row


            if (
                !first_name ||
                !last_name ||
                !email ||
                !department
            ) {

                failed.push({
                    row,
                    email,
                    reason: 'Required fields are missing'
                })

                continue
            }

            const [departmentData] = await sql`
                SELECT id, name
                FROM "Departments"
                WHERE LOWER(name) = LOWER(${department})
            `

            if (!departmentData) {

                failed.push({
                    row,
                    email,
                    reason: `Department "${department}" does not exist`
                })

                continue
            }

            const existingUser = await sql`
                SELECT id
                FROM "Users"
                WHERE LOWER(email) = LOWER(${email})
            `

            if (existingUser.length > 0) {

                failed.push({
                    row,
                    email,
                    reason: 'Email already exists'
                })

                continue
            }

            const formattedBirthDate = birth_date
                ? new Date(birth_date)
                    .toISOString()
                    .split('T')[0]
                : null

            const password =
                Math.random()
                    .toString(36)
                    .slice(-8)

            const hashedPassword =
                await bcrypt.hash(password, 10)


            await sql.begin(async (sql) => {

                const [user] = await sql`
                    INSERT INTO "Users"
                    (
                        "first_name",
                        "last_name",
                        "email",
                        "phone",
                        "role",
                        "password",
                        "birth_date"
                    )
                    VALUES
                    (
                        ${first_name},
                        ${last_name},
                        ${email},
                        ${phone || null},
                        ${role || 'user'},
                        ${hashedPassword},
                        ${birth_date || null}
                    )
                    RETURNING
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                    "phone",
                    "role",
                    "birth_date"
                `

                const [emp] = await sql`
                    INSERT INTO "Employee"
                    (
                        "company",
                        "department",
                        "position",
                        "user_id"
                    )
                    VALUES
                    (
                        ${company || null},
                        ${departmentData.id},
                        ${position || null},
                        ${user.id}
                    )
                    RETURNING *
                `

                if ((role || 'user') === 'user') {

                    await sendEmail({
                        to: email,
                        subject: 'Welcome to VisitMi | Account Creation',
                        html: `
                            <h2>Welcome ${first_name}</h2>

                            <p>
                                Thank you for registering with VMS.
                                Your account has been created successfully.
                            </p>

                            <p>
                                <b>Name:</b>
                                ${first_name} ${last_name}
                            </p>

                            <p>
                                <b>Email:</b>
                                ${email}
                            </p>

                            <p>
                                <b>Password:</b>
                                ${password}
                            </p>

                            <div>
                                <a href="${process.env.CLIENT_DEV_URL}">
                                    Signin to Your Account →
                                </a>
                            </div>
                        `
                    })
                }

                imported.push({
                    user,
                    employee: emp
                })
            })

        } catch (error) {

            failed.push({
                row,
                email: row.email || null,
                reason: error.message
            })
        }
    }

    const results = {
        total: employees.length,
        importedCount: imported.length,
        failedCount: failed.length,
        imported,
        failed
    }
    const message = failed.length === 0?`All records imported successfully`:`${imported.length} records imported successfully, and ${failed.length} failed.`
    sendResponse(
        res,
        200,
        results,
        message
    )
})

const deleteEmployee = asyncHandler(async (req, res) => {
    const {id} = req.params
    console.log(id);
    
    const employee = await deleteEmployeeService(id)
    if(employee){
        sendResponse(res, 200, employee, "Employee deleted successfully")
    }else{
        throw new ApiError(400, "Bad request")
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

const addDepartment = asyncHandler(async (req, res) => {
    const department = await addDepartmentService(req.body)
    if(department){
        sendResponse(res, 200, department,"Added department")
    }
    else {
        throw new ApiError(400, 'Bad request')
    }
})

const deleteDeparment = asyncHandler(async (req, res) => {
    const {id} = req.params
    const dept = await deleteDeparmentService(id)
    console.log(dept);
    
    if(dept){
        sendResponse(res, 200, dept, "Department deleted successfully")
    }else{
        throw new ApiError(400, "Bad Request")
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
    updateUser,
    deleteDeparment,
    deleteEmployee,
    addEmployees
    
}