import express from "express";

import { protect } from "../middlewares/authmiddleware.js";

import { authorize } from "../middlewares/authoriseRoleMiddleware.js";

import validate from "../middlewares/validate.js";

import {
    getMe,
    registerUser,
    loginUser,
    logoutUser
} from "../contollers/authController.js";

import {
    registerValidation,
    loginValidation
} from "../validations/authValidations.js";

const router = express.Router();

router.get("/me", protect, getMe)
router.post("/signup", validate, registerValidation, registerUser);
router.post("/signin", validate, loginValidation, loginUser)
router.post("/signout", protect, logoutUser);

export default router;