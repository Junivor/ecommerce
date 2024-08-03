import {OKResponse} from "../core/success.response.js";
import AccessService from "../services/access.service.js";

export default class AccessController {
    static serviceName = "Access"

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
    static async login(req, res, next) {}
    static async logout(req, res, next) {}
    static async close(req, res, next) {}
}