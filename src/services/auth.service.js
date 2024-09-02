import BaseService from "./base.service.js";
import {BadRequestException} from "../core/error.response.js";
import KeyTokenCache from "../models/repositories/keyToken/keyToken.cache.js";
import KeyTokenService from "./keyToken.service.js";
import KeyTokenRepository from "../models/repositories/keyToken/keyToken.repository.js";
import RedisMessageService from "./pubsub.service.js"

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
        RedisMessageService.subscribe("clear-cookie-site", (channel, message) => {
            if (channel === 'clear-cookie-site') {
                console.log(`Clearing cookies from ${message}`)
                this.clearCookie()
            }
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

    clearCookie(res) {
        const keys = Object.keys(res ? res : this.cookies)
        keys.forEach(key => this.res.clearCookie(key))
    }


    async checkAuth(req, res, next) {
        const accessToken = req.cookies[AuthService.KEYS.ACCESS]
        const refreshToken = req.cookies[AuthService.KEYS.REFRESH]
        const clientId = req.cookies[AuthService.KEYS.CLIENT]

        console.log("refreshToken:::::", refreshToken)
        // If one of these three empty
        if (!accessToken || !refreshToken || !clientId)
            throw new BadRequestException("Please log in again! [1]")

        const tokens = await KeyTokenCache.get({key: clientId})
        const {refresh_token_used} = await KeyTokenRepository.findByAccountId({
            account_id: clientId,
            attributes: ['refresh_token_used'],
            raw: true
        })

        // If token in cache is empty
        if (!tokens || !tokens.data) {
            throw new BadRequestException("Please log in again! [2]")
        }

        const {access_token, refresh_token} = tokens.data

        // If there is no access token or refresh token in redis cache
        if (!accessToken || !refreshToken)
            throw new BadRequestException("Something went wrong, please try again! [1]")

        // If access token in redis don't match with access token in cookie
        if (accessToken !== access_token)
            throw new BadRequestException("Something went wrong, please try again! [2]")

        // If refresh token in redis don't match with refresh token in cookie
        if (refreshToken !== refresh_token)
            throw new BadRequestException("Something went wrong, please try again! [3]")


        if (refresh_token_used.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMWUyZDdkNmMtYzNkOC00MGMwLTgwZDUtMzUxNGJmMWQ0ZjM0IiwiaWF0IjoxNzI1MjcxMDg4LCJleHAiOjE3MjU3MDMwODh9.0_w-UZHtQWjOQfz0R46nhsFseoB-CUcBVjh40f0Wew4")) {
            RedisMessageService
                .publish("clear-key-token", {
                    account_id: clientId
                })
                .publish('send-auth-alert', {
                    account_id: clientId
                })
                .publish('clear-cookie-site', {
                    account_id: clientId
                })

            throw new BadRequestException("Something went wrong, please try again! [4]")
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