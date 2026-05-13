import asyncHandler from "../utils/asyncHandler.js"

export const authorize = (...roles) => {
    return asyncHandler(async (req, res, next) => {

        const userRole = req.user.role.toLowerCase()

        const allowedRoles = roles.map(role => role.toLowerCase())

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied. You don't have permission"
            })
        }

        next()
    })
}