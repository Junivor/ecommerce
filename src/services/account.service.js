import AccountRepository from "../models/repositories/account/account.repository.js";
import AccountValidator from "../validators/account/account.validator.js";
import {BadRequestException} from "../core/error.response.js";
import Databases from "../dbs/init.databases.js";
import BaseService from "./base.service.js";
import ProfileService from "./profile.service.js";

import Profile from "../models/mysql/profile.model.js";

const client = Databases.getClientFromMysql("shop")



export default new class AccountService extends BaseService {
    constructor() {
        super()
    }

    async findAccount(request) {
        await AccountValidator.setFields(request)
            .validateRequestField()
            .isNotFound()

        return await AccountRepository.findByUserName({
            username: request.username,
            include: Profile
        })
    }

    async createAccount(request) {
        await AccountValidator.setFields(request)
            .validateRequestField()
            .isDuplicate()

        return await client.transaction(async transaction => {
            try {
                const createdAccount = await AccountRepository.createAccount(request, transaction)

                await ProfileService.createProfile({
                    account_id: createdAccount.account_id,
                    profile_name: createdAccount.username
                }, transaction)
                return createdAccount
            } catch(error) {
                throw new BadRequestException(error, this.constructor.name)
            }
        })

    }
    async deleteAccount(request) {

        await AccountValidator.setFields(request)
            .validateRequestField()
            .isNotFound()

        const validatedModel = AccountValidator.getModel()

        return await client.transaction(async transaction => {
            await ProfileService.deleteMultipleProfile({
                account_id: validatedModel.account_id,
                transaction
            })
            await AccountRepository.deleteByAccountId({
                account_id: validatedModel.account_id,
                transaction
            })
            return "Successfully"
        })
    }
    async updateAccount(request) {
        await AccountValidator
            .setFields(request)
            .validateRequestField()
            .isNotFound()

        const validatedModel = AccountValidator.getModel()
        const validatedFields = AccountValidator.getFields()
        const { account } = validatedFields.update

        return await AccountRepository.updateAccount(validatedModel, account)
    }
}