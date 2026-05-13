import { validationResult } from "express-validator"
import ApiResponse from "../utils/ApiResponse.js"

const validate = (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors);
    

    if (!errors.isEmpty()) {
         const message = errors.array().map(err => err.msg).join(', ');
        return res.status(400).json(
            new ApiResponse(
                400,
                null,
                message
            )
        )
    }

    next()
}

export default validate