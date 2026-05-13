import ApiResponse from "./ApiResponse.js";


const sendResponse = (res,statusCode,data,message) => {
    const response = new ApiResponse(statusCode,data,message);

    res.status(statusCode).json(response);
}

export default sendResponse;