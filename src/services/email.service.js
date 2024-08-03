import {createTransport} from "nodemailer"

export default new class EmailService {
    constructor() {
        this.transporter = createTransport({
            host: process.env.AWS_SMTP_HOST,
            port: process.env.AWS_SMTP_PORT,
            auth: {
                user: process.env.AWS_SMTP_USER,
                pass: process.env.AWS_SMTP_PASS
            }
        })
    }

    getTransporter() {
        return this.transporter
    }

    sendMail({ to, subject, otp }) {
        const transporter = this.getTransporter()

        transporter.sendMail({
            from: '<sample@gmail.com>',
            to,
            subject: "Hello ✔",
            text: "Verify your account?",
            html: `
                <a href="http://localhost:3030/api/v1/auth/verify/${otp}">Click here to verify your account</a>
            `,
        })

        return "Sent success"
    }
}