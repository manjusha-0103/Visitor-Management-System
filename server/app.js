import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import authRoute from "./routers/authRoutes.js";
import visitorRoutes from "./routers/visitorRoutes.js";
import employeeRoutes from "./routers/employeeRoutes.js";
import dashboardRoutes from "./routers/dashboardRoutes.js";
import receptionistRoutes from "./routers/receptionistRoutes.js";
import appointmentRoutes from "./routers/appointmentRoutes.js";
import analyticsRoutes from "./routers/analyticsRoutes.js";
import superAdminsRoutes from "./routers/superAdminsRoutes.js";
import { getAllowedOrigins } from "./config/runtimeUrls.js";
import { oauth2Client } from "./config/googleCalender.js";
import fs from 'fs'
import sendResponse from "./utils/sendResponse.js";
import sql from "./db/database.js";

const app = express();
const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/visitors", visitorRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/receptionist", receptionistRoutes);
app.use("/api/v1/super-admin", superAdminsRoutes);
app.use("/api/v1/analytics", analyticsRoutes);


app.get('/', (req, res) => {
  const {email} = req.query;

  console.log("akjfdsf",email);
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
    state: email
  });

  res.redirect(authUrl);
});

app.get('/api/auth/google/callback', async (req, res) => {
  let url = 'http://localhost:5173/employee';
  // isSuccess = false;
  try {
    const code = req.query.code;
    const email = req.query.state;

    const { tokens } = await oauth2Client.getToken(code);

 const [employee] = await sql`
      SELECT e.id
      FROM "Employee" e
      JOIN "Users" u ON u.id = e.user_id
      WHERE u.email = ${email}
    `;

    if (!employee) {
      throw new Error("Employee not found");
    }


    await sql`
      UPDATE "Employee"
      SET
        google_access_token = ${tokens.access_token},
        google_refresh_token = ${tokens.refresh_token},
        google_token_expiry = ${tokens.expiry_date},
        google_calendar_connected = ${true}
      WHERE id = ${employee.id}
    `;

    // oauth2Client.setCredentials(tokens);
    // fs.writeFileSync('tokens.json', JSON.stringify(tokens));

    // console.log(tokens);

    // isSuccess = true
    // res.redirect(`http://localhost:5173/employee`)

    // sendResponse(res, 200, null, "token created.")

  } catch (err) {
    console.error(err);
    // isSuccess = false
    // res.send('OAuth failed');
  }finally {
    res.redirect(`${url}`)
    // res.redirect(`${url}?isSuccess=${isSuccess}`)
  }
});


app.use(globalErrorHandler);

export default app;
