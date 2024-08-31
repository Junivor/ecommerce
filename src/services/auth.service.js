import BaseService from "./base.service.js";
import {BadRequestException} from "../core/error.response.js";
import KeyTokenCache from "../models/repositories/keyToken/keyToken.cache.js";
import KeyTokenService from "./keyToken.service.js";

export default class AuthService extends BaseService {
    static KEYS = {
        ACCESS: "authorization",
        REFRESH: "x-rtoken-id",
        CLIENT: "x-client-id"
    }
    constructor(res) {
        super()
        this.res = res
        this.cookieKeys = []
    }

    setCookie(key, value) {
        this.cookieKeys.push(key)
        this.res.cookie(key, value)
        return this
    }


    delCookie(key) {
        this.clearCookie(key)
        this.cookieKeys.filter(cookieKeys => cookieKeys !== key)
        return this
    }

    clearCookie() {
        this.cookieKeys.forEach(this.res.clearCookie)
        this.cookieKeys = []
        return this
    }

    static async checkAuth(req, res, next) {
        const accessToken = req.cookies[AuthService.KEYS.ACCESS]
        const refreshToken = req.cookies[AuthService.KEYS.REFRESH]
        const clientId = req.cookies[AuthService.KEYS.CLIENT]

        // If one of these three empty
        if (!accessToken || !refreshToken || !clientId)
            throw new BadRequestException("Please log in again! [1]")

        const tokens = await KeyTokenCache.get({key: clientId})


        if (!tokens || !tokens.data) {
            throw new BadRequestException("Please log in again! [2]")
        }

        const {access_token, refresh_token} = tokens.data

        console.log({
            access_token,
            accessToken
        })

        // If there is no access token in redis cache
        if (!accessToken || !refreshToken)
            throw new BadRequestException("Something went wrong, please try again! [1]")

        // If access token in redis don't match with access token in cookie
        if (accessToken !== access_token)
            throw new BadRequestException("Something went wrong, please try again! [2]")

        // If refresh token in redis don't match with refresh token in cookie
        if (refreshToken !== refresh_token)
            throw new BadRequestException("Something went wrong, please try again! [3]")

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