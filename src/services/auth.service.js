import BaseService from "./base.service.js";
import {BadRequestException} from "../core/error.response.js";
import KeyTokenCache from "../models/repositories/keyToken/keyToken.cache.js";
import KeyTokenService from "./keyToken.service.js";
import KeyTokenRepository from "../models/repositories/keyToken/keyToken.repository.js";
import BrokerService from "./broker.service.js";

export default new class AuthService extends BaseService {
    static KEYS = {
        ACCESS: "authorization",
        REFRESH: "x-rtoken-id",
        CLIENT: "x-client-id"
    }

    constructor() {
        super()
        this.res = {}
        this.cookies = {}
        this.KEYS = {
            ACCESS: "authorization",
            REFRESH: "x-rtoken-id",
            CLIENT: "x-client-id"
        }

        BrokerService.createPublisher({
            exchangeKey: "auth",
            type: "fanout"
        })
    }
    getKeys() {
        return this.KEYS
    }
    setRes(res) {
        this.res = res
        return this
    }
    setReqCookies(cookies) {
        this.cookies = cookies
        return this
    }
    setCookie(key, value) {
        this.res.cookie(key, value)
        return this
    }
    delCookie(key) {
        this.res.clearCookie(key)
        return this
    }
    clearCookie() {
        const keys = Object.keys(this.cookies)
        keys.forEach(key => this.res.clearCookie(key))
    }


    async checkAuth(req, res, next) {
        this.setRes(res).setReqCookies(req.cookies)

        const accessToken = req.cookies[AuthService.KEYS.ACCESS]
        const refreshToken = req.cookies[AuthService.KEYS.REFRESH]
        const clientId = req.cookies[AuthService.KEYS.CLIENT]

        // If one of these three empty
        if (!accessToken || !refreshToken || !clientId) {
            throw new BadRequestException("Authentication required. Please log in.")
        }

        const tokens = await KeyTokenCache.get({key: clientId})
        const {refresh_token_used} = await KeyTokenRepository.findByAccountId({
            account_id: clientId,
            attributes: ['refresh_token_used'],
            raw: true
        })

        // If token in cache is empty
        if (!tokens || !tokens.data) {
            throw new BadRequestException("Session expired. Please log in again.")
        }

        const {access_token, refresh_token} = tokens.data

        if (!access_token || !refresh_token) {
            throw new BadRequestException("Authentication error. Please try logging in again.")
        }

        // If there is no access token or refresh token in redis cache
        if (!accessToken || !refreshToken)
            throw new BadRequestException("Session mismatch detected. please try again! [1]")

        // If access and refresh token in redis don't match with access and refresh token in cookie
        if (accessToken !== access_token || refreshToken !== refresh_token)
            throw new BadRequestException("Something went wrong, please try again! [2]")




        if (refresh_token_used.includes(refresh_token)) {
            await BrokerService.sendMessage({
                exchangeKey: "auth",
                message: {
                    account_id: clientId
                }
            })
            this.clearCookie()
            throw new BadRequestException("Potential security issue detected. Please try again!")
        }


        const {public_key} = await KeyTokenService.findPublicKey({
            account_id: clientId
        })

        const decoded = KeyTokenService.verifyToken(accessToken, public_key)

        req.user = {
            account_id: decoded.account_id
        }

        return next()
    }

}