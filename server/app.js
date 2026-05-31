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
import { log } from "console";

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
app.set('trust proxy', true);
app.use('/uploads', express.static('uploads'));

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


app.get('/test', (req, res) => {
console.log(req.ip);

    // const ip =
    //     req.headers['x-forwarded-for']?.split(',') 
    const ip = req.ip

    const userAgent = req.get('User-Agent') || 'Unknown';

    res.json({
        ip,
        userAgent
    });
});

app.get('/', (req, res) => {
  const { email, redirect } = req.query;

  console.log("akjfdsf", email);

  const state = JSON.stringify({
    email,
    redirect,
  });

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
    state
  });

  res.redirect(authUrl);
});

app.get('/api/auth/google/callback', async (req, res) => {
  let url = 'http://localhost:5173', status = 'failed';
  let redirectPath = "";
  try {
    const code = req.query.code;
    const parsedState = JSON.parse(req.query.state);

const email = parsedState.email;
redirectPath = parsedState.redirect;

    const { tokens } = await oauth2Client.getToken(code);

    const [user] = await sql`
      SELECT id
      FROM "Users"
      WHERE email = ${email}
    `;

    if (!user) {
      throw new Error('User not found');
    }

    await sql`
  UPDATE "Users"
  SET
    google_access_token = ${tokens.access_token},
    google_token_expiry = ${tokens.expiry_date},
    google_calendar_connected = ${true},
    google_refresh_token = COALESCE(
      ${tokens.refresh_token},
      google_refresh_token
    )
  WHERE id = ${user.id}
`;

    status = 'success'
  } catch (err) {
    console.error(err);
    status = 'failed'
    // res.send('OAuth failed');
  } finally {
    // res.redirect(`${url}`)
    res.redirect(`${url}${redirectPath}?status=${status}`)
  }
});


app.use(globalErrorHandler);

export default app;
