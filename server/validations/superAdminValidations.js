import { body } from "express-validator";

export const addEmployeeValidator = [
    
    body("first_name")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 characters"),

    body("last_name")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 2 })
        .withMessage("Last name must be at least 2 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone("en-IN")
        .withMessage("Invalid Indian phone number"),

    body("company")
        .trim()
        .notEmpty()
        .withMessage("Company name is required"),

    body("department")
        .notEmpty()
        .withMessage("Department is required")
        .isUUID()
        .withMessage("Department must be a valid UUID"),

    body("position")
        .trim()
        .notEmpty()
        .withMessage("Position is required"),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["employee", "visitor", "user", "super_admin"])
        .withMessage("Invalid role")
];