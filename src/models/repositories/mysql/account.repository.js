import BaseRepository from "../base.repository.js";
import Account from "../../account.model.js";


export default new class AccountRepository extends BaseRepository {
    constructor() {
        super(Account)
    }

    async findByEmail(email = "") {
        return await Account.findOne({
            where: {email},
            raw: true
        })
    }
    async findByUserName(username = "") {
        return await this.model.findOne({
            where: {username: username},
        })
    }

    async destroyAccountById({placeholderId, transaction}) {
        return this.destroyById({placeholderId, transaction})
    }
    async updateAccount({ model, payload }) {
        return this.updateModel({model, payload})
    }

    async updateModel({model, payload}) {
        return super.updateModel({model, payload});
    }

    async destroyById({placeholderId, transaction}) {
        return super.destroyById({placeholderId, transaction});
    }

}