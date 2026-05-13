import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import  {createProxyMiddleware} from 'http-proxy-middleware'
import {globalErrorHandler} from "./middlewares/globalErrorHandler.js";
import authRoute from "./routers/authRoutes.js"

const app = express()

app.use(cors({
    origin: process.env.CLIENT_DEV_URL,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(globalErrorHandler);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


app.use('/api/v1/auth',authRoute)

export default app;