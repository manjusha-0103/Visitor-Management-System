import express from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";

import { chekIsApprove,
    preSchedule,
    sendOtp,
    verifyOtp,
    getGoogleCalendarStatus
    // calenderStatus
 } from "../contollers/employeeController.js";

const router = express.Router();


router.get("/is-approve/:appointment_id", chekIsApprove)
router.post("/preschedule", preSchedule)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp);
router.get(
    "/google-calendar-status",
    getGoogleCalendarStatus
);
// router.get("/calender-status", calenderStatus)
export default router;

