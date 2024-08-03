import Databases from "../../dbs/init.databases.js";
import {Schema} from "mongoose";

const client = Databases.getClientFromMongo("shop")


const OTPSchema = new Schema({
    otp_token: { type: String, required: true },
    otp_email: { type: String, required: true },
    otp_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    expireAt: {
        type: Date,
        default: Date.now,
        // expires: 60, // Documents will expire after 60 seconds
    },
}, {
    collection: "OTPs",
    timestamps: true,
})


export const OTP = client.model("OTP", OTPSchema)

