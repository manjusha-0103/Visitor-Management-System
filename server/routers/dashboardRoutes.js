import express from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";
import { pastAppointments,
    
 } from "../contollers/dashboardController.js";

const router = express.Router();

router.get("/past",protect, authorize('super_admin', "receptionist"), pastAppointments)


export default router;