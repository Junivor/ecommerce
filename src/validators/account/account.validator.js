import BaseValidator from "../base.validator.js";

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