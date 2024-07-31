import BaseValidator from "../base.validator.js";
import AccountRepository from "../../models/repositories/account/account.repository.js";
import {BadRequestException, NotFoundException} from "../../core/error.response.js";

export default new class AccountValidator extends BaseValidator {
    constructor() {
        super();
    }

    async isDuplicate() {
        const emailField = this.getField("email")
        const accountModel = await AccountRepository.findAccountByEmail(emailField)

        if (accountModel)
            throw new BadRequestException("Duplicate email", this.serviceName)

        return this
    }
    async isNotFound() {
        //if there are no account -> throw error
        const usernameField = this.getField("username")

        const accountModel = await AccountRepository.findAccountByUsername({
            username: usernameField
        })

        if (!accountModel) throw new NotFoundException("Account not found", this.serviceName)

        this.setModel(accountModel)
        return this
    }
    validateRequestField(request) {
        super.validateRequestField(request);
        return this
    }
    setFields(fields) {
        super.setFields(fields);
        return this
    }
    getField(name) {
        return super.getField(name);
    }
}