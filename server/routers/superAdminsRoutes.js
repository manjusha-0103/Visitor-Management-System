import express, { Router } from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";

import { getALLEmployees,
    getAllUsers,
    addEmployee,
    addDepartment,
    updateEmployee,
    updateUser
 } from "../contollers/superAdminController.js";

import { addEmployeeValidator} from "../validations/superAdminValidations.js";

const router = express.Router();
router.get('/employees', protect, authorize('super_admin'), getALLEmployees)
router.get('/users', protect, authorize('super_admin'), getAllUsers)
router.post('/add', protect, authorize('super_admin'), validate, addEmployeeValidator, addEmployee)
router.post('/add-departmemt', protect, authorize('super_admin'), addDepartment)
router.put('/update-employee/:id', protect, authorize('super_admin'),updateEmployee)
router.put('/update-user/:id', protect, authorize('super_admin'), updateUser)

export default router;