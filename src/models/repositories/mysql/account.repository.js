import BaseRepository from "../base.repository.js";
import Account from "../../account.model.js";

export default new class AccountRepository extends BaseRepository {
    constructor() {
        super(Account)
    }

    async findOneByEmail(email = "") {
        return await Account.findOne({
            where: {email}
        })
    }
}