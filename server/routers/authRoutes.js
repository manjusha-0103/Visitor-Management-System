import express from "express";

import {protect} from "../middlewares/authmiddleware.js";

import { authorize } from "../middlewares/authoriseRoleMiddleware.js";

import validate from "../middlewares/validate.js";

import { registerUser,
    loginUser
 } from "../contollers/authController.js";

import { registerValidation,
    loginValidation
 } from "../validations/authValidations.js";

const router = express.Router();

router.post("/signup", validate, registerValidation, registerUser);
router.post("/signin", validate, loginValidation, loginUser)

export default router;