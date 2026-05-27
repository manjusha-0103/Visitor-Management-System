import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import sendResponse from "../utils/sendResponse.js";
import {
    chekIsApproveService,
    preScheduleService,
    allSuperAdminService,
    employeeEsistService
} from "../services/employeeServices.js";
import { getIO } from "../config/socket.js";
import { userExistbyemailService } from "../services/auth.service.js";
import { sendEmail } from "../utils/mailer.js";
import escapeHtml from "../utils/escapeHtml.js";

const sendEmailToSuperAdmin = asyncHandler(async (employee) => {
    const super_admin = await allSuperAdminService()
    for (let s of super_admin){

        await sendEmail({
            to: s.email,
            subject: "Appoiment Check-In Missed-use",
            html:`
                html
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

            <style>

            body{
                margin:0;
                padding:0;
                background:#f5f5f5;
                font-family:'Times New Roman', Times, serif;
                color:#222;
            }

            .container{
                max-width:620px;
                margin:40px auto;
                background:#ffffff;
                border-radius:12px;
                overflow:hidden;
                border:1px solid #e5e5e5;
            }

            .content{
                padding:35px;
                line-height:1.8;
                font-size:16px;
            }

            .alert-box{
                margin:25px 0;
                padding:18px 20px;
                background:#fef2f2;
                border-left:5px solid #dc2626;
                border-radius:8px;
                color:#991b1b;
            }

            .user-info{
                margin-top:20px;
                padding:18px 20px;
                background:#fafafa;
                border-radius:8px;
                border:1px solid #ececec;
            }

            .user-info p{
                margin:8px 0;
            }

            .warning{
                margin-top:25px;
                color:#b91c1c;
                font-weight:bold;
            }

            .footer{
                padding:20px;
                text-align:center;
                font-size:13px;
                color:#6b7280;
                border-top:1px solid #e5e7eb;
            }

            </style>
            </head>

            <body>

            <div class="container">

                <div class="content">

                    <p>Dear Super admin,</p>

                    <p>
                        We detected suspicious appointment activity associated with information on our platform.
                    </p>

                    <div class="alert-box">
                        Someone may be using his details to schedule appointments without your permission.
                    </div>

                    <p>The following information was used:</p>

                    <div class="user-info">

                        ${Object.values(employee).map(value => `

                            <p>${escapeHtml(value)}</p>

                        `).join('')}
                        
                    </div>
                    <p>
                        Regards,<br/>
                        VisitMi
                    </p>

                </div>

                <div class="footer">
                    Powered by Iravya
                </div>

            </div>

            </body>
            </html>
            `
        
        })
    }
    
})

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const chekIsApprove = asyncHandler(async (req, res) => {
    const is_approve = req.query.is_approve === "true"
    const { appointment_id } = req.params
    const appoinment = await chekIsApproveService(is_approve, appointment_id)
    res.send(`'
        <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>VisitMi Appointment Status</title>

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

            <link
                href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <style>
                * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                }

                body {
                
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #f7f5f1, #f1ece5);
                font-family:'Times New Roman';
                padding: 24px;
                color: #1f2937;
                }

                .card {
                width: 100%;
                max-width: 460px;
                background: #ffffff;
                border-radius: 32px;
                padding: 42px 34px;
                position: relative;
                overflow: hidden;
                border: 1px solid #ebe7df;
                box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
                }

                .brand {
                text-align: center;
                margin-bottom: 30px;
                }

                .brand h2 {
                ;
                font-size: 34px;
                font-weight: 400;
                color: #2f3b2f;
                letter-spacing: 0.5px;
                }

                .brand span {
                display: inline-block;
                margin-top: 4px;
                font-size: 13px;
                color: #9ca3af;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                }

                .top-line {
                position: absolute;
                top: 0;
                left: 24px;
                right: 24px;
                height: 5px;
                border-radius: 0 0 14px 14px;
                background: ${is_approve ? "#16a34a" : "#dc2626"};
                }

                .icon-wrap {
                width: 92px;
                height: 92px;
                margin: auto;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 28px;

                background: ${is_approve ? "#ecfdf3" : "#fef2f2"};
                box-shadow: 0 0 0 12px ${is_approve ? "#dcfce766" : "#fee2e255"
                    };
                }

                h1 {
                
                font-size: 38px;
                line-height: 1.15;
                text-align: center;
                margin-bottom: 16px;
                color: #111827;
                }

                .subtitle {
                text-align: center;
                color: #6b7280;
                font-size: 15px;
                line-height: 1.7;
                margin-bottom: 30px;
                }

                .visitor-card {
                background: #f9fafb;
                border: 1px solid #ece7df;
                border-radius: 22px;
                padding: 22px;
                margin-bottom: 28px;
                }

                .visitor-title {
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                color: #9ca3af;
                margin-bottom: 18px;
                }

                .info-row {
                display: flex;
                justify-content: space-between;
                gap: 16px;
                padding: 10px 0;
                border-bottom: 1px dashed #e5e7eb;
                }

                .info-row:last-child {
                border-bottom: none;
                padding-bottom: 0;
                }

                .label {
                color: #6b7280;
                font-size: 14px;
                }

                .value {
                color: #111827;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
                }

                .badge {
                width: fit-content;
                margin: auto;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 22px;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 700;
                letter-spacing: 0.08em;

                background: ${is_approve ? "#dcfce7" : "#fee2e2"};
                color: ${is_approve ? "#15803d" : "#b91c1c"};
                }

                .dot {
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: ${is_approve ? "#15803d" : "#b91c1c"};
                }

                .footer {
                margin-top: 36px;
                padding-top: 22px;
                border-top: 1px solid #ece7df;
                text-align: center;
                }

                .footer .company {
                
                font-size: 22px;
                color: #2f3b2f;
                margin-bottom: 4px;
                }

                .footer p {
                color: #9ca3af;
                font-size: 12px;
                letter-spacing: 0.05em;
                }

                @media (max-width: 520px) {
                .card {
                    padding: 36px 24px;
                }

                h1 {
                    font-size: 32px;
                }

                .info-row {
                    flex-direction: column;
                    gap: 6px;
                }

                .value {
                    text-align: left;
                }
                }
            </style>
            </head>

            <body>

            <div class="card">

                <div class="top-line"></div>

                <div class="brand">
                <h2>VisitMi</h2>
        
                </div>

                <div class="icon-wrap">

                ${is_approve
                        ? `
                    <svg width="44" height="44" fill="none" stroke="#16a34a"
                    stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" viewBox="0 0 24 24">

                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="8 12 11 15 16 9"/>

                    </svg>
                `
                        : `
                    <svg width="44" height="44" fill="none" stroke="#dc2626"
                    stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" viewBox="0 0 24 24">

                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>

                    </svg>
                `
                    }

                </div>

                <h1>
                Appointment <br />
                ${is_approve ? "Approved" : "Denied"}
                </h1>

                <p class="subtitle">
                Your response has been recorded successfully.
                ${is_approve
                        ? "The visitor has been notified about the approval."
                        : "The visitor has been notified about the denial."
                    }
                </p>

                <div class="visitor-card">

                <div class="visitor-title">
                    Visitor Information
                </div>

                <div class="info-row">
                    <div class="label">Full Name</div>
                    <div class="value">${escapeHtml(appoinment.visitor.full_name)}</div>
                </div>

                <div class="info-row">
                    <div class="label">Email</div>
                    <div class="value">${escapeHtml(appoinment.visitor.email)}</div>
                </div>

                <div class="info-row">
                    <div class="label">Phone</div>
                    <div class="value">${escapeHtml(appoinment.visitor.phone)}</div>
                </div>

                <div class="info-row">
                    <div class="label">Company</div>
                    <div class="value">${escapeHtml(appoinment.visitor.company)}</div>
                </div>

                <div class="info-row">
                    <div class="label">Position</div>
                    <div class="value">${escapeHtml(appoinment.visitor.position)}</div>
                </div>

                </div>

                <div class="badge">
                <span class="dot"></span>
                ${is_approve ? "APPROVED" : "DENIED"}
                </div>

                <div class="footer">
                <div class="company">VisitMi</div>
                <p>Powered by Iravya</p>
                </div>

            </div>

            </body>
            </html>
        
    `)
    
    const io = getIO();

    io.emit("appointment_updated", {
        type: is_approve ? "approved" : "denied",
        data: appoinment
    });
    // sendResponse(res, 200, appoinment, is_approve?"Approved Meet":"Deny Meet")

})




const sendOtp = asyncHandler(async (req, res) => {

    const { employee_email } = req.body;

    const userExist =
        await employeeEsistService(employee_email);

    if(userExist){

        const otp = generateOTP();

        await sql`

            INSERT INTO email_otp
            (
                email,
                otp,
                expires_at
            )

            VALUES
            (
                ${employee_email},
                ${otp},
                NOW() + INTERVAL '5 minutes'
            )

            ON CONFLICT (email)

            DO UPDATE SET
                otp = EXCLUDED.otp,
                expires_at = EXCLUDED.expires_at

        `;

        await sendEmail({
            to: employee_email,
            subject: "OTP for prescheduling appointment",
            html: `
                <div style="
                    font-family: Arial;
                    max-width:500px;
                    margin:auto;
                    padding:30px;
                    text-align:center;
                    border:1px solid #ddd;
                    border-radius:10px;
                ">

                    <h2>Email Verification</h2>

                    <p>Your OTP is:</p>

                    <h1 style="
                        letter-spacing:5px;
                        color:#2563eb;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        Valid for 5 minutes
                    </p>

                </div>
            `
        });

        sendResponse(
            res,
            200,
            [],
            "OTP sent successfully"
        );

    }
    else{

        await sendEmailToSuperAdmin(req.body);

        sendResponse(
            res,
            404,
            [],
            "Employee not exist"
        );
    }

});


const verifyOtp = asyncHandler(async (req, res) => {
    const {otp, email} = req.body

    const result = await sql`

        SELECT *

        FROM email_otp

        WHERE email = ${email}

        AND otp = ${otp}

        AND expires_at > NOW()

        LIMIT 1
    `;

    if(result.length === 0){
        const userExist = await employeeEsistService(email)
        
        await sendEmailToSuperAdmin({"full_name" : `${userExist.first_name} ${userExist.last_name}`,
        "email": userExist.email, "phone" : userExist.phone, "company" : userExist.company, "position": userExist.position})
        throw new ApiError( 401, "OTP is invalid or Expired")
        
    }
    else{
        sendResponse(res,200, result,"OTP is verified" )
    }
})


const preSchedule = asyncHandler(async (req, res) => {
    const { employee_email } = req.body;
    // removed debug log for employee_email
    
        const appoinment = await preScheduleService(req.body)
        if (appoinment) {
            const io = getIO();

            io.emit("appointment_updated", {
                type: "preschedule_created",
                data: appoinment
            });
            sendResponse(res, 200, appoinment, "Appointment schedule successfully")
        }
        
        else {
            throw new ApiError(400, "Failed to schedule")
        }
    

})


// const calenderStatus = asyncHandler(async (req, res) => {

// })

export {

    chekIsApprove,
    preSchedule,
    sendOtp,
    verifyOtp
}