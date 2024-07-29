import AccountRepository from "../models/repositories/mysql/account.repository.js";
import ProfileRepository from "../models/repositories/mysql/profile.repository.js";

export default new class AccountService {
    async find() {
        return await AccountRepository.all()
    }

    async findByEmail(email) {
        return await AccountRepository.findOneByEmail(email)
    }

    async create({ username, email, password }) {
        const foundUser = await this.findByEmail(email)
        if (foundUser) throw new Error("Duplicate email")


        const createdAccount = await AccountRepository.create({
            username, email, password
        })

        return await ProfileRepository.create({
            account_id: createdAccount.id,
            profile_name: createdAccount.username
        })
    }
}