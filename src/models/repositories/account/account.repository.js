import BaseRepository from "../base.repository.js";
import {Account} from "../../mysql/association/account_profile.js";


export default new class AccountRepository extends BaseRepository {
    constructor() {
        super(Account)
    }

    createAccount(payload, transaction = null) {
        return super.createModel(payload, transaction);
    }
    updateAccount(Model, update) {
        return super.updateModel(Model, update)
    }
    findAccountByEmail(email, include) {
        return super.findModel({
            whereFields: {email},
            include
        })
    }
    findAccountByUsername({username, include}) {
        return super.findModel({
            whereFields: {username},
            include
        })
    }
    deleteAccountById({account_id, transaction}) {
        return super.deleteModel({
            whereFields: {account_id},
            transaction
        })
    }

}