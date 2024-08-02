import BaseService from "./base.service.js";
import ProfileRepository from "../models/repositories/profile/profile.repository.js";
import ProfileValidator from "../validators/profile/profile.validator.js";
import {NotFoundException} from "../core/error.response.js";
import ProfileCache from "../models/repositories/profile/profile.cache.js";
import AccountCache from "../models/repositories/account/account.cache.js";


export default new class ProfileService extends BaseService {
    async createProfile(request, transaction) {
        await this.validateProfile({
            request,
            callback: ProfileValidator.isDuplicate.bind(ProfileValidator)
        })

        const createdProfile = await ProfileRepository.createProfile(request, transaction)


        if (!transaction) {
            AccountCache.hSet({
                hKey: request.account_id,
                fKey: createdProfile.profile_alias,
                value: createdProfile
            })
        }

        return createdProfile
    }
    async updateProfile(request) {
        const profileModel = await this.validateProfile(request)

        const validatedFields = ProfileValidator.getFields()
        const { profile_alias, update } = validatedFields


        const modifiedProfile = await ProfileRepository.updateModel(profileModel, update)

        await ProfileCache.del({
            key: profile_alias
        })

        return ProfileCache.set({
            key: modifiedProfile.profile_alias,
            value: modifiedProfile
        })
    }
    async findProfile(request) {
        const profileAliasField = request.profile_alias

        const foundProfile = await ProfileRepository.findByProfileName({
            profile_alias: profileAliasField
        })


        if (!foundProfile) {
            ProfileCache.set({
                key: profileAliasField,
            })
            throw new NotFoundException("Profile not found")
        }

        return ProfileCache.set({
            key: profileAliasField,
            value: foundProfile
        })
    }
    async deleteOneProfile(request) {
        const Model = await this.validateProfile({
            request,
            callback: data => {return data}
        })

        AccountCache.hDel({
            fKey: Model.profile_alias
        })

        return await ProfileRepository.deleteProfileModel(Model)
    }
    async deleteMultipleProfile({account_id, transaction}) {

        return await ProfileRepository.deleteProfileById({account_id, transaction})
    }
    async validateProfile({request, findField = "profile_alias", callback}) {
        const fieldValue = request[findField]

        const foundProfile = await ProfileRepository.findModel({
            whereFields: {
                [findField]: fieldValue
            }
        })

        if (callback)
            return callback(foundProfile)


        if (!foundProfile)
            throw new NotFoundException("Profile not found")
    }
}