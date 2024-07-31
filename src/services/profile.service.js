import BaseService from "./base.service.js";
import ProfileRepository from "../models/repositories/profile/profile.repository.js";
import ProfileValidator from "../validators/profile/profile.validator.js";
import ProfileCache from "../models/repositories/profile/profile.cache.js";

export default new class ProfileService extends BaseService {
    async createProfile(request, transaction) {
        await ProfileValidator
            .setFields(request)
            .validateRequestField()
            .isDuplicate()

        return await ProfileRepository.createProfile(request, transaction)
    }
    async updateProfile(request) {
        await ProfileValidator
            .setFields(request)
            .validateRequestField()
            .isNotFound()

        const validateProfile = ProfileValidator.getModel()
        const validatedFields = ProfileValidator.getFields()
        const { update } = validatedFields

        return ProfileRepository.updateModel(validateProfile, update)
    }
    async findProfile(request) {
        ProfileValidator
            .setFields(request)
            .validateRequestField()

        const profileName = ProfileValidator.getField("profile_name")

        const cache = await ProfileCache.get(profileName)

        if (cache) return cache


        const profileModel = (await ProfileValidator.isNotFound()).getModel()

        ProfileCache.set({
            key: profileName,
            value: profileModel
        })

        return profileModel
    }
    async deleteOneProfile(request) {
        await ProfileValidator
            .setFields(request)
            .validateRequestField()
            .isNotFound()

        const validatedModel = ProfileValidator.getModel()
        return await ProfileRepository.deleteProfileModel(validatedModel)
    }
    async deleteMultipleProfile({account_id, transaction}) {
        return await ProfileRepository.deleteProfileById({account_id, transaction})
    }
}