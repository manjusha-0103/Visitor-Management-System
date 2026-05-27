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

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = asyncHandler(async (req, res) => {

    const { email } = req.body;

    

        const otp = generateOTP();

        await sql`

            INSERT INTO email_otp
            (
                email,
                otp,
                expires_at
            )

            VALUES
            (
                ${email},
                ${otp},
                NOW() + INTERVAL '5 minutes'
            )

            ON CONFLICT (email)

            DO UPDATE SET
                otp = EXCLUDED.otp,
                expires_at = EXCLUDED.expires_at

        `;

        await sendEmail({
            to: email,
            subject: "OTP for check-in appointment",
            html: `
                <div style="
                    font-family: Arial;
                    max-width:500px;
                    margin:auto;
                    padding:30px;
                    text-align:center;
                    border:1px solid #ddd;
                    border-radius:10px;
                ">

                    <h2>Email Verification</h2>

                    <p>Your OTP is:</p>

                    <h1 style="
                        letter-spacing:5px;
                        color:#2563eb;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        Valid for 5 minutes
                    </p>

                </div>
            `
        });

        sendResponse(
            res,
            200,
            [],
            "OTP sent successfully"
        );
});


const verifyOtp = asyncHandler(async (req, res) => {
    const {otp, email} = req.body

    const result = await sql`

        SELECT *

        FROM email_otp

        WHERE email = ${email}

        AND otp = ${otp}

        AND expires_at > NOW()

        LIMIT 1
    `;

    if(result.length === 0){
        
        throw new ApiError( 401, "OTP is invalid or Expired")
        
    }
    else{
        sendResponse(res,200, result,"OTP is verified" )
    }
})


const checkIn = asyncHandler(async (req, res) => {
    // file info logged in dev only previously; removed for production
    const appointment = await checkInService(req.body, req.file)
    // appointment info removed from logs

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
    verifyOtp,
    sendOtp,
    visitorInfo
}