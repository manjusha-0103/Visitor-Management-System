import { body } from "express-validator"

const checkInValidations = [
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
    body("position")
        .notEmpty()
        .withMessage("Position is required"),

    body("company")
        .notEmpty()
        .withMessage("Company is required"),

    body("employee_id")
        .notEmpty()
        .withMessage("Employee ID is required"),

    body("is_laptop")
        .isBoolean()
        .withMessage("is_laptop must be boolean"),

    body("is_vehicle")
        .isBoolean()
        .withMessage("is_vehicle must be boolean"),

    body("make")
        .optional({ nullable: true })
        .isString()
        .withMessage("Laptop make must be string"),

    body("model")
        .optional({ nullable: true })
        .isString()
        .withMessage("Laptop model must be string"),

    body("serial_no")
        .optional({ nullable: true })
        .isString()
        .withMessage("Serial number must be string"),

    body("vehicle_no")
        .optional({ nullable: true })
        .isString()
        .withMessage("Vehicle number must be string")
]

export{
    checkInValidations
}