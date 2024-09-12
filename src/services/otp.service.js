import * as crypto from "node:crypto";

import BaseService from "./base.service.js";
import OTPRepository from "../models/repositories/otp/otp.repository.js";
import {NotFoundException} from "../core/error.response.js";

export default new class OtpService extends BaseService {
    constructor() {
        super()
    }

    async createOTP({ email }) {
        const OTP = crypto.randomBytes(16).toString("hex")
        return await OTPRepository.createOTP({
            otp_token: OTP,
            otp_email: email,
        })

    }
    async verify({ otp }) {
        if (!otp)
            throw new NotFoundException("OTP not found")

        const OTPModel = await OTPRepository.findOTP({
            otp_token: otp
        })

        if (!OTPModel)
            throw new NotFoundException("OTP not found, verify again")


        await OTPRepository.deleteOTP({otp_token: otp})

        return OTPModel.otp_email
    }
}