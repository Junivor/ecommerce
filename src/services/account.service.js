import AccountRepository from "../models/repositories/mysql/account.repository.js";
import AccountValidator from "../validators/account/account.validator.js";
import {ConflictException} from "../core/error.response.js";
import Databases from "../dbs/init.databases.js";
import BaseService from "./base.service.js";
import ProfileService from "./profile.service.js";
import Account from "../models/account.model.js";

const client = Databases.getClientFromMysql("shop")



export default new class AccountService extends BaseService {
    constructor() {
        super()
    }

    async findAccount(request) {
        return (await AccountValidator
            .isRequestFieldEmpty(request)
            .isNotFound(request))
            .getModel()
    }

    async createAccount(request) {
        await AccountValidator
            .isRequestFieldEmpty(request)
            .isDuplicate(request)

        return client.transaction(async transaction => {
            try {
                const createdAccount = await AccountRepository.create(request, transaction)

                await ProfileService.createProfile({
                    account_id: createdAccount.id,
                    profile_name: createdAccount.username
                }, transaction)

                return createdAccount
            } catch(error) {
                throw new ConflictException(error, this.serviceName)
            }
        })

    }
    async removeAccount(request) {
        const accountModel = await this.findAccount(request)
        return client.transaction(async transaction => {
            const data = await ProfileService.destroyProfileById({
                placeholderId: {
                    account_id: accountModel.id
                }, transaction
            })
            await AccountRepository.destroyAccountById({
                placeholderId: {
                    id: accountModel.id
                }, transaction
            })
            return data
        })
    }
    async updateAccount(request) {
        const accountModel = await this.findAccount(request)
        const { username, ...rest } = request
        return await AccountRepository.updateAccount({
            model: accountModel, payload: rest
        })
    }
}