import BaseValidator from "../base.validator.js";
import {Model} from "sequelize";
import ProfileRepository from "../../models/repositories/profile/profile.repository.js";
import {BadRequestException} from "../../core/error.response.js";

export default new class ProfileValidator extends BaseValidator {
    constructor() {
        super()
    }


    async isDuplicate() {
        const profileNameFields = this.getField("profile_name")

        const profileModel = await ProfileRepository.findOneProfile({
            profile_name: profileNameFields
        })

        if (profileModel)
            throw new BadRequestException("Duplicate profile", this.constructor.name)

        return this
    }

    async isNotFound() {
        const profileNameFields = this.getField("profile_name")

        const profileModel = await ProfileRepository.findOneProfile({
            profile_name: profileNameFields
        })

        if (!profileModel)
            throw new BadRequestException("Profile not found", this.constructor.name)

        this.setModel(profileModel)
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