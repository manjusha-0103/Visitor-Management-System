import express, { Router } from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";

import { getALLEmployees,
    getAllUsers,
    addEmployee
 } from "../contollers/superAdminController.js";

import { addEmployeeValidator } from "../validations/superAdminValidations.js";

const router = express.Router();
router.get('/employees', protect, authorize('super_admin'), getALLEmployees)
router.get('/users', protect, authorize('super_admin'), getAllUsers)
router.post('/add', protect, authorize('super_admin'), validate, addEmployeeValidator, addEmployee)

export default router;