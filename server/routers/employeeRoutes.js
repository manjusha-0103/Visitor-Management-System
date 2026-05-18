import express from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";

import { chekIsApprove,
    preSchedule
 } from "../contollers/employeeController.js";

const router = express.Router();


router.get("/is-approve/:appointment_id", chekIsApprove)
router.post("/preschedule", preSchedule)
export default router;

