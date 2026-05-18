import express from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";
import { setPassId,
    checkOut,
    checkIsApprove
 } from "../contollers/receptionistController.js";


const router = express.Router();
router.put("/set-pass/:appointment_id",protect,  setPassId)
router.put("/check-out/:appointment_id", protect, checkOut)
router.put("/is-approve/:appointment_id", protect, checkIsApprove)
export default router;