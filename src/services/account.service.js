import * as bcrypt from "bcrypt"
import * as crypto from "node:crypto";
import pkg from "jsonwebtoken"
import AccountRepository from "../models/repositories/account/account.repository.js";
import {BadRequestException, NotFoundException} from "../core/error.response.js";
import Databases from "../dbs/init.databases.js";
import BaseService from "./base.service.js";
import ProfileService from "./profile.service.js";

import Profile from "../models/mysql/profile.model.js";
import AccountCache from "../models/repositories/account/account.cache.js";
import TokenCache from "../models/repositories/token/token.cache.js";

const { sign } = pkg


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


        const publicKey = crypto.randomBytes(16).toString("hex")
        const privateKey = crypto.randomBytes(16).toString("hex")

        const accessToken = sign({
            accountId: payload.account_id,
        }, publicKey, {
            expiresIn: "2 days"
        })

        const refreshToken = sign({
            accountId: payload.account_id,
        }, privateKey, {
            expiresIn: "5 days"
        })


        AccountCache.hSet({
            hKey: payload.account_id,
            fKey: payload.profile_alias,
            value: payload.value
        })

        TokenCache.set({
            key: payload.account_id,
            value: {
                publicKey,
                privateKey,
                refreshToken,
                refreshTokenUsed: []
            }
        })

        return {
            accountId: payload.account_id,
            publicKey,
            privateKey,
            accessToken,
            refreshToken
        }
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


            await AccountRepository.deleteAccount({
                Model: accountModel,
                transaction
            })
        })

        AccountCache.del({
            key: accountModel.account_id,
        })

        return "Success"
    }
    async updateAccount(request) {
        const accountModel = await this.validateAccount({
            request: {
                email: request.email
            },
            callback: data => {return data}
        })

        const { account } = request.update

        return await AccountRepository.updateAccount({
            Model: accountModel,
            update: account
        })
    }
    async validateAccount({ request, findField = "email", callback = null } = {}) {
        const fieldValue = request[findField]
        const foundAccount = await AccountRepository.findByField({
            fieldName: findField,
            fieldValue
        })


        if (!foundAccount)
            throw new NotFoundException("Not found account")

        return callback?.(foundAccount)
    }
    async validateDuplicate({ request, findField = "email", callback = null } = {}) {
        const fieldValue = request[findField]
        const foundAccount = await AccountRepository.findByField({
            fieldName: findField,
            fieldValue
        })

        if (foundAccount)
            throw new BadRequestException("Duplicate email")

        return callback?.(foundAccount)

    }
}