import * as bcrypt from "bcrypt"
import AccountRepository from "../models/repositories/account/account.repository.js";
import {BadRequestException, NotFoundException} from "../core/error.response.js";
import Databases from "../dbs/init.databases.js";
import BaseService from "./base.service.js";
import ProfileService from "./profile.service.js";

import Profile from "../models/mysql/profile.model.js";
import AccountCache from "../models/repositories/account/account.cache.js";
import AuthService from "./auth.service.js";


const client = Databases.getClientFromMysql("shop")



export default new class AccountService extends BaseService {
    constructor() {
        super()
    }

    async findAccount({ username }) {
        const foundAccount = await AccountRepository.findByUserName({
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
    async getMe({ cookies }) {
        const clientId = cookies[AuthService.KEYS.CLIENT]
        const accountCache = await AccountCache.get({key: clientId})

        if (accountCache) return accountCache

        const AccountModel = await AccountRepository.findById({account_id: clientId})


        if (!AccountModel) {
            AccountCache.set({
                key: clientId,
                value: null
            })
            throw new NotFoundException("Account not found!")
        }

        AccountCache.set({
            key: clientId,
            value: AccountModel
        })

        return AccountModel
    }
    async createAccount({ email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10)

        const payload = await client.transaction(async transaction => {
            try {
                const createdAccount = await AccountRepository.createAccount({
                    email,
                    password: hashedPassword,
                    transaction
                })

                const createdProfile = await ProfileService.createProfile({
                    account_id: createdAccount.account_id,
                    profile_alias: createdAccount.username,
                    transaction
                })


                return {
                    account_id: createdAccount.account_id,
                    profile_alias: createdProfile.profile_alias,
                    value: createdAccount
                }
            } catch(error) {
                throw new BadRequestException(error, this.constructor.name)
            }
        })


        AccountCache.hSet({
            hKey: payload.account_id,
            fKey: payload.profile_alias,
            value: payload.value
        })

        return payload
    }
    async deleteAccount({ username }) {
        const AccountModel = await this.validateAccount({username}, AccountModel => {return AccountModel})


        await client.transaction(async transaction => {
            await ProfileService.deleteMultipleProfile({
                account_id: AccountModel.account_id,
                transaction
            })


            await AccountRepository.deleteAccount({
                Model: AccountModel,
                transaction
            })
        })

        AccountCache.del({
            key: AccountModel.account_id,
        })

        return "Success"
    }
    async updateAccount({ email, update }) {
        const AccountModel = await this.validateAccount(email, AccountModel => {return AccountModel})

        const { account } = update

        return await AccountRepository.updateAccount({
            Model: AccountModel,
            update: account
        })
    }
    async validateAccount(field, callback) {
        const foundAccount = await AccountRepository.findByField({field})

        if (!foundAccount)
            throw new NotFoundException("Not found account")

        return callback?.(foundAccount)
    }
}