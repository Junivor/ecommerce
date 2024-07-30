import BaseValidator from "../base.validator.js";
import AccountRepository from "../../models/repositories/mysql/account.repository.js";
import {BadRequestException} from "../../core/error.response.js";

export default new class AccountValidator extends BaseValidator {
    constructor() {
        super()
    }

    async isDuplicate(request) {
        const foundAccount = await AccountRepository.findByEmail(request.email)
        if (foundAccount) throw new BadRequestException("Duplicate account", this.serviceName)
        return this
    }

    async isNotFound(request) {
        const foundAccount = await AccountRepository.findByUserName(request.username)

        if (!foundAccount)
            throw new BadRequestException(`Request ${request.username} not found`, this.serviceName)
        this.setModel(foundAccount)
        return this
    }

    setModel(model = {}) {
        this.model = model
    }

    getModel() {
        return this.model
    }
}