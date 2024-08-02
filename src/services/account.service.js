import AccountRepository from "../models/repositories/account/account.repository.js";
import AccountValidator from "../validators/account/account.validator.js";
import {BadRequestException, NotFoundException} from "../core/error.response.js";
import Databases from "../dbs/init.databases.js";
import BaseService from "./base.service.js";
import ProfileService from "./profile.service.js";

import Profile from "../models/mysql/profile.model.js";
import AccountCache from "../models/repositories/account/account.cache.js";

const client = Databases.getClientFromMysql("shop")



export default new class AccountService extends BaseService {
    constructor() {
        super()
    }

    async findAccount({ username }) {
        const foundAccount = AccountRepository.findByUserName({
            username,
            include: Profile
        })


        if (!foundAccount) {
            AccountCache.set({
                key: username
            })
            throw new BadRequestException("Not found account")
        }

        AccountCache.set({
            key: username,
            value: foundAccount
        })

        return foundAccount
    }

    async createAccount(request) {
        await this.validateAccount({
            request,
            callback: AccountValidator.isDuplicate.bind(AccountValidator)
        })

        const payload = await client.transaction(async transaction => {
            try {
                const createdAccount = await AccountRepository.createAccount(request, transaction)

                const createdProfile = await ProfileService.createProfile({
                    account_id: createdAccount.account_id,
                    profile_alias: createdAccount.username
                }, transaction)


                return {
                    hKey: createdAccount.account_id,
                    fKey: createdProfile.profile_alias,
                    value: createdAccount
                }
            } catch(error) {
                throw new BadRequestException(error, this.constructor.name)
            }
        })

        AccountCache.hSet(payload)

        return payload
    }
    async deleteAccount(request) {
        const accountModel = await this.validateAccount({
            request,
            findField: "username",
            callback: data => {return data}
        })

        await client.transaction(async transaction => {
            await ProfileService.deleteMultipleProfile({
                account_id: accountModel.account_id,
                transaction
            })
            return await AccountRepository.deleteByAccountId({
                account_id: accountModel.account_id,
                transaction
            })
        })

        return AccountCache.del({
            key: accountModel.account_id,
        })
    }
    async updateAccount(request) {
        const accountModel = await this.validateAccount({
            request,
            findField: "username",
            callback: data => {return data}
        })

        const { account } = request.update

        return await AccountRepository.updateAccount(accountModel, account)
    }
    async validateAccount({ request, findField = "email", callback = null } = {}) {
        const fieldValue = request[findField]
        const foundAccount = await AccountRepository.findAccount({
            whereFields: {
                [findField]: fieldValue
            }
        })

        if (callback) {
            return callback(foundAccount)
        }

        AccountValidator.isNotFound(foundAccount)
    }
}