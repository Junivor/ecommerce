import * as crypto from "node:crypto";
import bcrypt from "bcrypt"

import BaseService from "./base.service.js";
import AccountRepository from "../models/repositories/account/account.repository.js";
import {BadRequestException, NotFoundException} from "../core/error.response.js";
import AccountService from "./account.service.js";
import OTPRepository from "../models/repositories/otp/otp.repository.js";
import KeyTokenService from "./keyToken.service.js";
import AuthService from "./auth.service.js";
import KeyTokenCache from "../models/repositories/keyToken/keyToken.cache.js";
import KeyTokenRepository from "../models/repositories/keyToken/keyToken.repository.js";


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

        await OTPRepository.createOTP({
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

        await OTPRepository.deleteOTP({otp_token: otp})

        return "Success"
    }
    async login({ email, password, res }) {
        const Auth = new AuthService(res)

        if (!email) throw new NotFoundException("Email not found")

        if (!password) throw new NotFoundException("Password not found")

        const foundAccount = await AccountRepository.findByEmail({email, raw: true})

        if (!foundAccount) throw new NotFoundException("Account not found")

        const isPasswordMatched = await bcrypt.compare(password, foundAccount.password)
        if (!isPasswordMatched)
            throw new BadRequestException("Password doesnt match")

        const { public_key, private_key } = KeyTokenService.createPubPriKey()
        const keyTokenResponse = KeyTokenService.createAccessRefreshToken({
            payload: {
                account_id: foundAccount.account_id
            },
            public_key,
            private_key
        })


        KeyTokenCache.set({
            key: foundAccount.account_id,
            value: keyTokenResponse
        })

        KeyTokenRepository.createKeyToken({
            account_id: foundAccount.account_id,
            public_key,
            private_key,
            refresh_token: keyTokenResponse.refresh_token,
        })

        Auth.setCookie(AuthService.KEYS.CLIENT, foundAccount.account_id)
        Auth.setCookie(AuthService.KEYS.ACCESS, keyTokenResponse.access_token)
        Auth.setCookie(AuthService.KEYS.REFRESH, keyTokenResponse.refresh_token)

        return keyTokenResponse
    }
    async logout({ cookies, res }) {
        const Auth = new AuthService(res)

        KeyTokenService.clearToken({
            account_id: cookies[AuthService.KEYS.CLIENT]
        })

        Auth.clearCookie()
    }
    async close() {}
    async refresh({ user, cookies, res }) {
        const Auth = new AuthService(res)

        const old_refresh_token = cookies[AuthService.KEYS.REFRESH]
        const {
            account_id
        } = user

        const {
            public_key,
            private_key
        } = await KeyTokenService.findPubPriKey({account_id})

        const keyTokenResponse = KeyTokenService.createAccessRefreshToken({
            payload: {
                account_id
            },
            public_key,
            private_key
        })

        console.log(keyTokenResponse)

        KeyTokenCache.set({
            key: account_id,
            value: keyTokenResponse
        })

        const returned= KeyTokenRepository.insertRefreshToken({
            account_id,
            old_token: old_refresh_token,
            new_token: keyTokenResponse.refresh_token,
            public_key,
            private_key
        })

        Auth.setCookie(AuthService.KEYS.ACCESS, keyTokenResponse.access_token)
        Auth.setCookie(AuthService.KEYS.REFRESH, keyTokenResponse.refresh_token)

        return returned
    }
}