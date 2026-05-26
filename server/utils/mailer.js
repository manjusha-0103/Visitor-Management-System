import nodemailer from "nodemailer";

// ─── Transporter (singleton) ──────────────────────────────────────────────────
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587),
    secure: (process.env.SMTP_SECURE || process.env.EMAIL_SECURE) === "true",
    auth: user && pass ? { user, pass } : undefined,
  });

  return transporter;
};

// ─── Send Email ───────────────────────────────────────────────────────────────
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = getTransporter();

    const fromAddress = process.env.SMTP_USER || process.env.EMAIL_USER || "no-reply@visitmi.local";

    const info = await transporter.sendMail({
      from: `"VisitMi App" <${fromAddress}>`,
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Email sending failed:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
