import { generateToken } from "../services/token.service.js"
import sendResponse from "../utils/sendResponse.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
// import redisClient from '../config/redis.js'

import { userExistbyemailService,
    registerUserService,
    loginUserService,
    getMeService,
    changePasswordService,
    updateMeService
 } from "../services/auth.service.js";

const getMe = asyncHandler(async (req, res) => {
    // const responseData = await buildUserResponse(req.user)
    const user = await getMeService(req.user.id)
    // removed getMe debug log
    
    sendResponse(res, 200, user[0], "")
})

const updateMe = asyncHandler(async (req, res) => {
    const profile = await updateMeService(req.body, req.user.id, req.user.role)
    if(profile){
        sendResponse(res, 200, profile, "Data is updated successfully")
    }else{
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

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const userExists = await userExistbyemailService(email)
    if (!userExists.length) {
        throw new ApiError(401, "We couldn't find that account.")
    }
    const user = await loginUserService(email, password)
    // let responseData = await buildUserResponse(user)
    const token = generateToken(user.id)
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: "/",
        maxAge: 24 * 60 * 60 * 1000
    }
    res.cookie("token", token, options)
    // console.log("responseData",responseData);
    sendResponse(res, 200, user, `Welcome back, ${user.first_name}`)
})

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    });

    sendResponse(res, 200, {}, "User logged out successfully");
});

const changePassword = asyncHandler(async (req, res) => {
    const user = await changePasswordService(req.body, req.user.id)
    if(user){
        sendResponse(res, 200, user, "Password Change")
    }else{
        throw new ApiError(400, "Bad request")
    }
})


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const [userExist] =
        await userExistbyemailService(email);

    if(userExist){

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
            subject: "OTP for verification",
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

    }
    else{

        sendResponse(
            res,
            404,
            [],
            "User not exist"
        );
    }

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



export{
    getMe,
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    updateMe,
    sendOtp,verifyOtp
}