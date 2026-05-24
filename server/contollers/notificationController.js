import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import sendResponse from "../utils/sendResponse.js";
import { processtBirthdayService } from "../services/notification.service.js";


const processtBirthday = async () => {

    const birthdayUsers = await processtBirthdayService()

    return birthdayUsers
}

export{
    processtBirthday
}