
import { body } from "express-validator"

const registerValidation = [
    body("first_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("First name must be at least 2 characters"),

    body("last_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Last name must be at least 2 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage("Password must contain at least one uppercase letter and one special character"),

    body("role")
        .optional()
        .isIn(["super_admin", "employee", "receptionist","visitor"])
        .withMessage("Invalid role"),

    // body("status")
    // .exists()
    // .withMessage("Status is required")
    // .custom((value) => {
    //     // Allows null, or specifically 'active' / 'inactive'
    //     if (value === null || ['active', 'inactive'].includes(value)) {
    //         return true;
    //     }
    //     throw new Error("Status must be 'active', 'inactive', or null");
    // })

]

const loginValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
]




export{
    registerValidation,
    loginValidation
}