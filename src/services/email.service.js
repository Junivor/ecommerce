import {createTransport} from "nodemailer"
import RedisMessageService from "./pubsub.service.js";

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

        RedisMessageService.subscribe("send-auth-alert", (channel, message) => {
            if (channel === "send-auth-alert") {
                this.sendMail({to: JSON.parse(message)})
            }
        })


    }

    getTransporter() {
        return this.transporter
    }

    sendMail({ to, subject, otp }) {
        console.log("imagine that this is real email...", to)
        /*const transporter = this.getTransporter()

        transporter.sendMail({
            from: '<sample@gmail.com>',
            to,
            subject: "Hello ✔",
            text: "Verify your account?",
            html: `
                <a href="http://localhost:3030/api/v1/auth/verify/${otp}">Click here to verify your account</a>
            `,
        })

        return "Sent success"*/
    }
}