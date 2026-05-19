import { generateToken } from "../services/token.service.js"
import sendResponse from "../utils/sendResponse.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import { analyticsHederDataService,
    analyticsGraphnService
 } from "../services/analytics.service.js";

const analyticsHederData = asyncHandler(async (req, res) => {
    const headerdata = await  analyticsHederDataService()
    sendResponse(res, 200, headerdata, "Header Data")
})

const analyticsGraphn = asyncHandler(async (req, res) => {
    const graphdata = await analyticsGraphnService(req.query)

    sendResponse(res, 200, graphdata, "Graph Data")
})

export{
    analyticsHederData,
    analyticsGraphn
}