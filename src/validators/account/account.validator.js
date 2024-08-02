import BaseValidator from "../base.validator.js";
import AccountRepository from "../../models/repositories/account/account.repository.js";
import {BadRequestException, NotFoundException} from "../../core/error.response.js";

export default new class AccountValidator extends BaseValidator {
    constructor() {
        super({
            modelName: "Account"
        });
    }

    isDuplicate(model) {
        return super.isDuplicate(model)
    }
    isNotFound(model) {
        return super.isNotFound(model)
    }
}