import {Account} from "../../mysql/association/account_profile.js";


export default class AccountRepository extends Account {
    static createAccount({ email, password,  transaction = null}) {
        return this.create({
            email, password
        }, {transaction})
    }
    static updateAccount({Model, update}) {
        const UpdatedModel = Model

        for (const [key, value] of Object.entries(update)) {
            Model[key] = value
        }

        return UpdatedModel.save()
    }
    static setActivatedAccount({ Model }) {
        this.updateAccount({
            Model, update: {
                activated: true
            }
        })
    }
    static findByField({fieldName, fieldValue, include = null, raw = false}) {
        return this.findOne({
            where: {
                [fieldName]: fieldValue
            },
            include,
            raw
        })
    }
    static findByUserName({username, include, raw}) {
        return this.findByField({
            fieldName: "username",
            fieldValue: username,
            include, raw
        })
    }
    static findByEmail({email, include, raw}) {
        return this.findByField({
            fieldName: "email",
            fieldValue: email,
            include, raw
        })
    }
    static deleteAccount({Model, transaction}) {
        return Model.destroy({transaction})
    }
}