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
    sendResponse(res, 200, user, "")
})

const updateMe = asyncHandler(async (req, res) => {
    const profile = await updateMeService(req.body, req.user.id)
    if(profile){
        sendResponse(res, 200, profile, "Data is updated successfully")
    }else{
        throw new  ApiError(400, 'Bad request')
    }
})


const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body)
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


export{
    getMe,
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    updateMe
}