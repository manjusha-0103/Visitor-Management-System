import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Iravya App" <${process.env.EMAIL_USER}>`,
            to,   // Nodemailer accepts array directly
            subject,
            html
        })

        console.log("Email sent:", info.messageId)

    } catch (error) {
        console.error("Email error:", error)
        throw new Error("Email sending failed")
    }
}