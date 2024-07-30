import AccountService from "../services/account.service.js";
import {CreatedResponse, OKResponse} from "../core/success.response.js";
import {request} from "express";

export default class AccountController {
    static service = "Account"
    static async find(req, res, next) {
        new OKResponse({
            service: AccountController.service,
            metadata: await AccountService.find()
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
            metadata: await AccountService.removeAccount(req.body)
        }).send(res)
    }
    static async update(req, res, next) {
        return new OKResponse({
            service: AccountController.service,
            metadata: await AccountService.updateAccount(req.body)
        }).send(res)
    }
}