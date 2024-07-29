import AccountService from "../services/account.service.js";

export default class AccountController {
    static async find(req, res, next) {
        const data = await AccountService.find()
        return res.status(200).json(data)
    }
    static async findByEmail(req, res, next) {
        const data = await AccountService.findByEmail(req.body.email)
        return res.status(200).json(data)
    }
    static async create(req, res, next) {
        const data = await AccountService.create(req.body)
        return res.status(200).json(data)
    }
}