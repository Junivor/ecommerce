import BaseValidator from "../base.validator.js";
import {BadRequestException} from "../../core/error.response.js";

export default new class ProfileValidator extends BaseValidator {
    constructor() {
        super()
    }


    async isDuplicate(model) {
        if (model)
            throw new BadRequestException("Duplicate profile", this.constructor.name)
        return this
    }

    async isNotFound(model) {
        if (!model)
            throw new BadRequestException("Profile not found", this.constructor.name)
        return this
    }
    validateRequestField(fields) {
        super.validateRequestField(fields);
        return this
    }
    setFields(fields) {
        super.setFields(fields);
        return this
    }
    getField(name) {
        return super.getField(name);
    }
    getFields() {
        return super.getFields();
    }
    setModel(Model) {
        super.setModel(Model);
    }
    getModel() {
        return super.getModel();
    }
}