import {Profile} from "../../mysql/association/account_profile.js";


export default class ProfileRepository extends Profile {
    static createProfile({account_id, phone_number, profile_alias, transaction = null}) {
        return this.create({
            account_id,
            phone_number,
            profile_alias
        }, {transaction})
    }
    static updateProfile({ Model, update }) {
        for (const [key, value] of Object.entries(update)) {
            Model[key] = value
        }

        return Model.save()
    }
    static findProfile({ findField, fieldValue, raw = false }) {
        return this.findOne({
            where: {
                [findField]: fieldValue
            }
        })
    }
    static findByProfileName(profile_name) {
        return this.findProfile({
            findField: "profile_name",
            fieldValue: profile_name
        })
    }
    static findByProfileAlias(profile_alias) {
        return this.findProfile({
            findField: "profile_alias",
            fieldValue: profile_alias
        })
    }
    static deleteProfile({ Model }) {
        return Model.destroy()
    }
    static deleteAllProfile({ account_id, transaction }) {
        return this.destroy({
            where: {account_id},
            transaction
        })
    }
}