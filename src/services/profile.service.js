import BaseService from "./base.service.js";
import ProfileRepository from "../models/repositories/profile/profile.repository.js";
import {BadRequestException, NotFoundException} from "../core/error.response.js";
import ProfileCache from "../models/repositories/profile/profile.cache.js";
import AccountCache from "../models/repositories/account/account.cache.js";


export default new class ProfileService extends BaseService {
    async createProfile({account_id, profile_alias, phone_number = "000-000-100", transaction = null}) {
        if (!account_id)
            throw new NotFoundException("Account_id not found")

        if (!profile_alias)
            throw new NotFoundException("Profile alias not found")

        if (!phone_number)
            throw new NotFoundException("Phone number not found")

        await this.validateDuplicate({
            fieldValue: profile_alias,
        })

        const createdProfile = await ProfileRepository.createProfile({
            account_id, profile_alias, phone_number, transaction
        })


        if (!transaction) {
            AccountCache.hSet({
                hKey: createdProfile.account_id,
                fKey: createdProfile.profile_alias,
                value: createdProfile
            })
        }

        return createdProfile
    }
    async updateProfile({ profile_alias, update }) {
        const profileModel = await this.validateProfile({
            fieldValue: profile_alias,
            callback: data => {return data}
        })

        const modifiedProfile = await ProfileRepository.updateProfile({
            Model: profileModel,
            update
        })

        await ProfileCache.del({
            key: modifiedProfile.profile_alias
        })

        return ProfileCache.set({
            key: modifiedProfile.profile_alias,
            value: modifiedProfile
        })
    }
    async findProfile({profile_alias}) {
        const foundProfile = await ProfileRepository.findByProfileAlias(profile_alias)

        if (!foundProfile) {
            ProfileCache.set({
                key: profile_alias,
            })
            throw new NotFoundException("Profile not found")
        }

        return ProfileCache.set({
            key: profile_alias,
            value: foundProfile
        })
    }
    async deleteOneProfile({ profile_alias }) {
        const Model = await this.validateProfile({
            fieldValue: profile_alias,
            callback: data => {return data}
        })

        AccountCache.hDel({
            fKey: Model.profile_alias
        })

        return await ProfileRepository.deleteProfile({Model})
    }
    async deleteMultipleProfile({account_id, transaction}) {
        return await ProfileRepository.deleteAllProfile({account_id, transaction})
    }
    async validateProfile({findField = "profile_alias", fieldValue = "", callback}) {
        const foundProfile = await ProfileRepository.findByProfileAlias(fieldValue)

        if (!foundProfile)
            throw new NotFoundException("Profile not found")

        return callback?.(foundProfile)
    }
    async validateDuplicate({findField = "profile_alias", fieldValue = "", callback}) {
        const foundProfile = await ProfileRepository.findProfile({
            findField,
            fieldValue
        })

        if (foundProfile)
            throw new BadRequestException("Duplicate account")

        if (callback)
            return callback?.(foundProfile)
    }
}