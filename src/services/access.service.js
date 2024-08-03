import * as crypto from "node:crypto";
import BaseService from "./base.service.js";
import AccountRepository from "../models/repositories/account/account.repository.js";
import {BadRequestException, NotFoundException} from "../core/error.response.js";
import AccountService from "./account.service.js";
import EmailService from "./email.service.js";
import OTPRepository from "../models/repositories/otp/otp.repository.js";


export default new class AccessService extends BaseService {
    constructor() {
        super()
    }

    async register({ email, password, confirmPassword }) {
        if (!email)
            throw new NotFoundException("Email not found")

        if (!password)
            throw new NotFoundException("Password not found")

        if (!confirmPassword)
            throw new NotFoundException("Confirm password not found")

        if (password !== confirmPassword)
            throw new BadRequestException("Confirm password not match")

        const foundAccount = await AccountRepository.findByEmail({email})

        if (foundAccount)
            throw new BadRequestException("Duplicate email")


        const createdAccount = AccountService.createAccount({
            email, password
        })

        const OTP = crypto.randomBytes(16).toString("hex")

        OTPRepository.createOTP({
            otp_token: OTP,
            otp_email: email
        })


        /*EmailService.sendMail({
            to: "sample@gmail.com",
            otp: OTP
        })*/

        return createdAccount
    }
    async verify({ otp }) {
        if (!otp)
            throw new NotFoundException("OTP not found")

        const OTPModel = await OTPRepository.findOTP({
            otp_token: otp
        })

        if (!OTPModel)
            throw NotFoundException("OTP not found, verify again")

        const AccountModel = await AccountRepository.findByEmail({
            email: OTPModel.otp_email
        })

        if (!AccountModel)
            throw new NotFoundException("Account not found, please try again")

        AccountRepository.setActivatedAccount({Model: AccountModel})

        OTPRepository.deleteOTP({ otp_token: otp })

        return "Success"
    }
    async login({ email, password }) {

    }
    async logout() {}
    async close() {}
}