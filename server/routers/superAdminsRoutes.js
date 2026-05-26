import express, { Router } from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";
import upload from "../utils/upload.js";

import { getALLEmployees,
    getAllUsers,
    addEmployee,
    addDepartment,
    updateEmployee,
    updateUser,
    deleteDeparment,
    deleteEmployee,
    addEmployees,
    getEmpbySearch
 } from "../contollers/superAdminController.js";

import { addEmployeeValidator} from "../validations/superAdminValidations.js";

const router = express.Router();
router.get('/employees',protect, authorize('super_admin', 'user'),  getALLEmployees) //protect, authorize('super_admin'),
router.get('/users', protect, authorize('super_admin'), getAllUsers)
router.post('/add', protect, authorize('super_admin', 'user'), validate, addEmployeeValidator, addEmployee)
router.post('/add-employees',  upload.single('file'), addEmployees) //protect, authorize('super_admin'),
router.post('/add-departmemt', protect, authorize('super_admin'), addDepartment)
router.put('/update-employee/:id', protect, authorize('super_admin'),updateEmployee)
router.put('/update-user/:id', protect, authorize('super_admin'), updateUser)
router.delete('/delete-dept/:id', protect,authorize('super_admin'),deleteDeparment)
router.delete('/delete-emp/:id', deleteEmployee)
router.get("/employee",getEmpbySearch)

export default router;