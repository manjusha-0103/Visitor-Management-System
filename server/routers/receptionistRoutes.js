import express from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";
import { setPassId,
    checkOut,
    checkIsApprove
 } from "../contollers/receptionistController.js";


const router = express.Router();
router.put("/set-pass/:appointment_id",protect, authorize( "receptionist"), setPassId)
router.put("/check-out/:appointment_id", protect, authorize( "receptionist"), checkOut)
router.put("/is-approve/:appointment_id", protect, authorize( "receptionist"), checkIsApprove)
export default router;