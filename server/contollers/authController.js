import { generateToken } from "../services/token.service.js"
import sendResponse from "../utils/sendResponse.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
// import redisClient from '../config/redis.js'
import { auditService } from "../services/audit.service.js";

import { userExistbyemailService,
    registerUserService,
    loginUserService,
    getMeService,
    changePasswordService,
    updateMeService
 } from "../services/auth.service.js";
import { sendEmail } from "../utils/mailer.js";
import { error } from "console";

const getMe = asyncHandler(async (req, res) => {
    // const responseData = await buildUserResponse(req.user)
    const user = await getMeService(req.user.id)
    // removed getMe debug log
    
    sendResponse(res, 200, user[0], "")
})

const updateMe = asyncHandler(async (req, res) => {
    const profile = await updateMeService(req.body, req.user, req.ip)
    
    if(profile){
        const audit_data = {
            "ip": req.ip,
            "action" : 'update_profile',
            "audit_record" :{
                "updated_by" : {
                    "email" :req.user.email,
                    "name" : `${req.user.first_name } ${req.user.last_name }`,
                    "phone" : req.user.phone
                },
                ...profile,
                "message" : "Data is updated successfully"
            },
        }

        await auditService(audit_data)
        sendResponse(res, 200, profile, "Data is updated successfully")
    }else{
        const audit_data = {
            "ip": req.ip,
            "action" : 'failed_update_profile',
            "audit_record" :{
                "updated_by" : {
                    "email" :req.user.email,
                    "name" : `${req.user.first_name } ${req.user.last_name }`,
                    "phone" : req.user.phone
                },
                ...req.body,
                "error": 'Bad request'
            }
        }
        await auditService(audit_data)
        throw new  ApiError(400, 'Bad request')
    }
})


const registerUser = asyncHandler(async (req, res) => {
    // removed request body debug log
    const { email, password } = req.body

    const userExists = await userExistbyemailService(email)
    if (userExists.length) {
        throw new ApiError(200, "Email already in use");
    }
    else {
        const user = await registerUserService(req.body)
        const token = generateToken(user.id, email, user.role)
        sendResponse(res, 201, user, "User registered successfully");
    }

})

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // CHECK USER
    const [userExists] = await userExistbyemailService(email);

    if (!userExists) {

        const audit_data = {
            "ip": req.ip,
            "action" : 'signin_failed',
            "audit_record" :{
                
                ...req.body,
                "error": "We couldn't find that account."
            },
        }

        await auditService(audit_data)

        throw new ApiError(
            401,
            "We couldn't find that account."
        );
    }

    // VALIDATE PASSWORD
    const user = await loginUserService(email, password, req.ip);

    if (!user) {
        const audit_data = {
            "ip": req.ip,
            "action" : 'signin_failed',
            "audit_record" :{
                
                ...req.body,
                "error": "Invalid credentials"
            },
        }

        await auditService(audit_data)
        throw new ApiError(
            401,
            "Invalid credentials"
        );
    }

    // GENERATE OTP
    const otp = generateOTP();

    // SAVE OTP
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

    // SEND EMAIL
    await sendEmail({
        to: email,
        subject: "Login Verification OTP",
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

                <h2>Login Verification</h2>

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

    const audit_data = {
        "ip": req.ip,
        "action" : 'signin',
        "audit_record" :{
            "updated_by" : {
                "email" :user.email,
                "name" : `${user.first_name } ${user.last_name }`,
                "phone" : user.phone,
                "last_login": user.last_login
            },
            ...user,
            
            
        },
    }

    await auditService(audit_data)

    // RETURN OTP REQUIRED
    sendResponse(
        res,
        200,
        {
            otpRequired: true,
            email
        },
        "OTP sent successfully"
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    });

    const audit_data = {
        "ip": req.ip,
        "action" : 'logout',
        "audit_record" :{
            "updated_by" : {
                "email" :req.user.email,
                "name" : `${req.user.first_name } ${req.user.last_name }`,
                "phone" : req.user.phone
            },
            "message" : "User logged out successfully"
        },
    }

    await auditService(audit_data)

    sendResponse(res, 200, {}, "User logged out successfully");
});

const changePassword = asyncHandler(async (req, res) => {
    const user = await changePasswordService(req.body, req.user, req.ip)
    if(user){
        const audit_data = {
            "ip": req.ip,
            "action" : 'change_password',
            "audit_record" :{
                "updated_by" : {
                    "email" :req.user.email,
                    "name" : `${req.user.first_name } ${req.user.last_name }`,
                    "phone" : req.user.phone
                },
                ...user,
                "message" : "Password Change"
            },
        }

        await auditService(audit_data)
        sendResponse(res, 200, user, "Password Change")
    }else{
        const audit_data = {
            "ip": req.ip,
            "action" : 'change_password_failed',
            "audit_record" :{
                "updated_by" : {
                    "email" :req.user.email,
                    "name" : `${req.user.first_name } ${req.user.last_name }`,
                    "phone" : req.user.phone
                },
                ...user,
                "message" : "Bad requests"
            },
        }
        await auditService(audit_data)
        throw new ApiError(400, "Bad request")
    }
})


const sendOtp = asyncHandler(async (req, res) => {

    const { email } = req.body;

    // CHECK USER
    const [userExist] =
        await userExistbyemailService(email);

    if (!userExist) {

        throw new ApiError(
            404,
            "User not found"
        );
    }

    // GENERATE OTP
    const otp =
        generateOTP();

    // SAVE OTP
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

    // SEND EMAIL
    await sendEmail({

        to: email,

        subject: "Resend OTP",

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

                <h2>
                    OTP Verification
                </h2>

                <p>
                    Your OTP is:
                </p>

                <h1 style="
                    letter-spacing:5px;
                    color:#8b1a30;
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
        "OTP resent successfully"
    );
});


// const verifyOtp = asyncHandler(async (req, res) => {
//     const {otp, email} = req.body

//     const result = await sql`

//         SELECT *

//         FROM email_otp

//         WHERE email = ${email}

//         AND otp = ${otp}

//         AND expires_at > NOW()

//         LIMIT 1
//     `;

//     if(result.length === 0){
        
        
//         throw new ApiError( 401, "OTP is invalid or Expired")
        
//     }
//     else{
//         sendResponse(res,200, result,"OTP is verified" )
//     }
// })

const verifyOtp = asyncHandler(async (req, res) => {

    const { otp, email } = req.body;

    // VERIFY OTP
    const result = await sql`

        SELECT *

        FROM email_otp

        WHERE email = ${email}

        AND otp = ${otp}

        AND expires_at > NOW()

        LIMIT 1

    `;

    if (result.length === 0) {

        throw new ApiError(
            401,
            "OTP is invalid or expired"
        );
    }

    // GET USER
    const [user] = await userExistbyemailService(email);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    // GENERATE TOKEN
    const token = generateToken(user.id);

    // COOKIE OPTIONS
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000
    };

    // SET COOKIE
    res.cookie("token", token, options);

    // DELETE OTP AFTER SUCCESS
    await sql`
        DELETE FROM email_otp
        WHERE email = ${email}
    `;

    // SUCCESS RESPONSE
    sendResponse(
        res,
        200,
        user,
        `Welcome back, ${user.first_name}`
    );
});



export{
    getMe,
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    updateMe,
    sendOtp,verifyOtp
}