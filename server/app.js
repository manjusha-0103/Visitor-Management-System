import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import  {createProxyMiddleware} from 'http-proxy-middleware'
import {globalErrorHandler} from "./middlewares/globalErrorHandler.js";
import authRoute from "./routers/authRoutes.js"
import visitorRoutes from "./routers/visitorRoutes.js"
import employeeRoutes from "./routers/employeeRoutes.js"
import dashboardRoutes from "./routers/dashboardRoutes.js"
import receptionistRoutes from "./routers/receptionistRoutes.js"
import appointmentRoutes from "./routers/appointmentRoutes.js"
import analyticsRoutes from "./routers/analyticsRoutes.js"
import superAdminsRoutes from "./routers/superAdminsRoutes.js"

const app = express()

app.use(cors({
    origin: process.env.CLIENT_DEV_URL,
    credentials: true
}))
app.use(express.json());
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(globalErrorHandler);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


app.use('/api/v1/auth',authRoute)
app.use('/api/v1/visitors',visitorRoutes)
app.use('/api/v1/employee', employeeRoutes)
app.use('/api/v1/dashboard',dashboardRoutes)
app.use('/api/v1/appointments',appointmentRoutes)
app.use('/api/v1/receptionist', receptionistRoutes)
app.use('/api/v1/super-admin', superAdminsRoutes)
app.use('/api/v1/analytics', analyticsRoutes)

app.use(globalErrorHandler);

export default app;