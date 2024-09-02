import {OKResponse} from "../core/success.response.js";
import AccessService from "../services/access.service.js";

export default class AccessController {

    static async register(req, res, next) {
        new OKResponse({
            service: "Access",
            metadata: await AccessService.register(req.body)
        }).send(res)
    }
    static async verify(req, res, next) {
        new OKResponse({
            service: "Access",
            metadata: await AccessService.verify(req.params)
        }).send(res)
    }
    static async login(req, res, next) {
        new OKResponse({
            service: "Access",
            metadata: await AccessService.login({
                ...req.body,
                res
            })
        }).send(res)
    }
    static async logout(req, res, next) {
        new OKResponse({
            service: "Access",
            metadata: await AccessService.logout({...req, res})
        }).send(res)
    }
    static async forgotPassword(req, res, next) {
        new OKResponse({
            service: "Access",
            metadata: await AccessService.forgotPassword(req.body)
        }).send(res)
    }
    static async resetPassword(req, res, next) {
        new OKResponse({
            service: "Access",
            metadata: await  AccessService.resetPassword({
                ...req.query,
                ...req.body
            })
        }).send(res)
    }
    static async close(req, res, next) {}
    static async refresh(req, res, next) {
        new OKResponse({
            service: "Access",
            metadata: await AccessService.refresh({ user: req.user, cookies: req.cookies, res })
        }).send(res)
    }
}