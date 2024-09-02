import AccountService from "../services/account.service.js";
import {CreatedResponse, OKResponse} from "../core/success.response.js";

export default class AccountController {
    static service = "Account"
    static async findOne(req, res, next) {
        new OKResponse({
            service: AccountController.service,
            metadata: await AccountService.findAccount(req.params)
        }).send(res)
    }
    static async create(req, res, next) {
        new CreatedResponse({
            service: AccountController.service,
            metadata: await AccountService.createAccount(req.body)
        }).send(res)
    }
    static async remove(req, res, next) {
        new OKResponse({
            service: AccountController.service,
            metadata: await AccountService.deleteAccount(req.body)
        }).send(res)
    }
    static async update(req, res, next) {
        return new OKResponse({
            service: AccountController.service,
            metadata: await AccountService.updateAccount(req.body)
        }).send(res)
    }
    static async getMe(req, res, next) {
        new OKResponse({
            service: AccountController.service,
            metadata: await AccountService.getMe({
                cookies: req.cookies
            })
        }).send(res)
    }

}