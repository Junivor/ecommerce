import BaseService from "./base.service.js";
import ProfileRepository from "../models/repositories/profile/profile.repository.js";
import ProfileValidator from "../validators/profile/profile.validator.js";
import {BadRequestException, NotFoundException} from "../core/error.response.js";
import ProfileCache from "../models/repositories/profile/profile.cache.js";

export default new class ProfileService extends BaseService {
    async createProfile(request, transaction) {
        await this.validateProfile(request, data => {
            return ProfileValidator.isDuplicate(data)
        })

        const createdProfile = await ProfileRepository.createProfile(request, transaction)



        return ProfileCache.set({
            key: createdProfile.profile_name,
            value: createdProfile
        })
    }
    async updateProfile(request) {
        const profileModel = await this.validateProfile(request, data => {
            if (!data) throw new NotFoundException("Profile not found")
            return data
        })

        const validatedFields = ProfileValidator.getFields()
        const { profile_name, update } = validatedFields


        const modifiedProfile = await ProfileRepository.updateModel(profileModel, update)

        await ProfileCache.del(profile_name)

        return ProfileCache.set({
            key: modifiedProfile.profile_name,
            value: modifiedProfile
        })
    }
    async findProfile(request) {
        const profileNameField = ProfileValidator
            .setFields(request)
            .validateRequestField()
            .getField("profile_name")

        const cache = await ProfileCache.get(profileNameField)

        if (cache) {
            console.log("CACHE HIT")
            if (cache.data) {
                return cache.data
            } else {
                throw new NotFoundException(`Profile not found`)
            }
        }

        const foundProfile = await ProfileRepository.findByProfileName({
            profile_name: profileNameField
        })


        if (!foundProfile) {
            ProfileCache.set({
                key: profileNameField,
            })
            throw new NotFoundException("Profile not found")
        }

        return ProfileCache.set({
            key: profileNameField,
            value: foundProfile
        })
    }
    async deleteOneProfile(request) {
        const Model = await this.validateProfile(request, data => data)

        const profileNameField = ProfileValidator.getField("profile_name")


        ProfileCache.del(profileNameField)

        return await ProfileRepository.deleteProfileModel(Model)
    }
    async deleteMultipleProfile({account_id, transaction}) {
        return await ProfileRepository.deleteProfileById({account_id, transaction})
    }
    async validateProfile(request, callback) {
        const profileNameField = ProfileValidator
            .setFields(request)
            .validateRequestField()
            .getField("profile_name")

        const foundProfile = await ProfileRepository.findByProfileName({
            profile_name: profileNameField
        })

        if (callback)
            return callback(foundProfile)


        if (!foundProfile)
            throw new NotFoundException("Profile not found")
    }
}