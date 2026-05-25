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

router.post(
        "/check-in",
        upload.single("visitor_photo"), 
        validate, 
        checkInValidations,
        checkIn
    )
router.get("/departments", getAllDepartments)
router.get("/employees/:dept_id", getEmployees)
router.get("/visitor/:appointment_id",protect, authorize('super_admin', "user"), visitorInfo)



export default router;