import express from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";
import { checkIn, getAllDepartments, getEmployees } from "../contollers/visitorController.js";
import { checkInValidations } from "../validations/visitorValidations.js";

const router = express.Router();

router.post("/check-in",validate, checkInValidations, checkIn)
router.get("/departments", getAllDepartments)
router.get("/employees/:dept_id", getEmployees)



export default router;