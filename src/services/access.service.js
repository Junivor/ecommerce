import bcrypt from "bcrypt"

import BaseService from "./base.service.js";
import AccountRepository from "../models/repositories/account/account.repository.js";
import {BadRequestException, NotFoundException} from "../core/error.response.js";
import AccountService from "./account.service.js";
import KeyTokenService from "./keyToken.service.js";
import AuthService from "./auth.service.js";
import KeyTokenCache from "../models/repositories/keyToken/keyToken.cache.js";
import KeyTokenRepository from "../models/repositories/keyToken/keyToken.repository.js";
import OtpService from "./otp.service.js";
import RedisMessageService from "./pubsub.service.js";
import EmailService from "./email.service.js";
import sleep from "../helpers/sleep.js";


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

       /* EmailService.sendMail({
            to: "sample@gmail.com",
            otp: OTP
        })
        */
        return await OtpService.createOTP({email})

    }
    async verify({ otp }) {
        const email = await OtpService.verify({otp})

        await this.validateAccount({email}, AccountModel => {
            AccountRepository.setActivateAccount({Model: AccountModel})
        })

        return "Success"
    }
    async login({ email, password, res }) {
        if (!email) throw new NotFoundException("Email not found")

        if (!password) throw new NotFoundException("Password not found")

        const AccountModel = await this.validateAccount({email}, AccountModel => {return AccountModel})

        const isPasswordMatched = await bcrypt.compare(password, AccountModel.password)
        if (!isPasswordMatched)
            throw new BadRequestException("Password doesnt match")

        const { public_key, private_key } = KeyTokenService.createPubPriKey()
        const keyTokenResponse = KeyTokenService.createAccessRefreshToken({
            payload: {
                account_id: AccountModel.account_id
            },
            public_key,
            private_key
        })


        KeyTokenCache.set({
            key: AccountModel.account_id,
            value: keyTokenResponse
        })

        await KeyTokenRepository.createKeyToken({
            account_id: AccountModel.account_id,
            public_key,
            private_key,
            refresh_token: keyTokenResponse.refresh_token,
        })

        const { CLIENT, ACCESS, REFRESH } = AuthService.getKeys()
        AuthService.setRes(res)
            .setCookie(CLIENT, AccountModel.account_id)
            .setCookie(ACCESS, keyTokenResponse.access_token)
            .setCookie(REFRESH, keyTokenResponse.refresh_token)

        return keyTokenResponse
    }
    async logout({ cookies, res }) {
        const clientId = cookies[AuthService.KEYS.CLIENT]
        KeyTokenService.clearToken({
            account_id: clientId
        })
        AuthService
            .setRes(res)
            .setReqCookies(cookies)
            .clearCookie()
    }
    async forgotPassword({ email }) {
        await this.validateAccount({email})

        /*EmailService.sendMail({
            to: "sample@gmail.com",
            otp: OTP
        })*/


        return await OtpService.createOTP({email})
    }
    async resetPassword({ token: otp, update }) {
        const {password, confirmPassword} = update
        if (!password)
            throw new NotFoundException("Password not found")

        if (!confirmPassword)
            throw new NotFoundException("Confirm password not found")

        if (password !== confirmPassword)
            throw new BadRequestException("Confirm password not match")

        const email = await OtpService.verify({otp})
        const AccountModel = await AccountRepository.findByEmail({email})

        const hashedPassword = await bcrypt.hash(password, 10)

        return AccountRepository.updateAccount({
            Model: AccountModel,
            update: {password: hashedPassword}
        })
    }
    async refresh({ user, cookies, res }) {
        const {
            account_id
        } = user
        const old_refresh_token = cookies[AuthService.KEYS.REFRESH]

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

        AuthService.setRes(res)
            .setCookie(AuthService.KEYS.ACCESS, keyTokenResponse.access_token)
            .setCookie(AuthService.KEYS.REFRESH, keyTokenResponse.refresh_token)

        return returned
    }
    async validateAccount(field, callback) {
        const AccountModel = await AccountRepository.findByFieldTest({
            field
        })

        if (!AccountModel)
            throw new NotFoundException("Account not found")

        return callback?.(AccountModel)
    }
}