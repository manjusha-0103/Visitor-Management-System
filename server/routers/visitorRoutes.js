import express from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";
import { checkIn, 
    getAllDepartments, 
    getEmployees,
    visitorInfo
 } from "../contollers/visitorController.js";
import { checkInValidations } from "../validations/visitorValidations.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/check-in",validate, checkInValidations,upload.single("visitor_photo"), checkIn)
router.get("/departments", getAllDepartments)
router.get("/employees/:dept_id", getEmployees)
router.get("/visitor/:appointment_id",protect, authorize('super_admin', "receptionist"), visitorInfo)



export default router;