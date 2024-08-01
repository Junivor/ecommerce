import BaseRepository from "../base.repository.js";
import {Profile} from "../../mysql/association/account_profile.js";


export default new class ProfileRepository extends BaseRepository {
    constructor() {
        super(Profile)
    }

    createProfile(payload, transaction) {
        return super.createModel(payload, transaction);

    }
    findByProfileName({ profile_name }) {
        return super.findModel({
            whereFields: {profile_name},
        })
    }
    deleteProfileModel(Model) {
        return Model.destroy()
    }
    deleteByProfileName({profile_name}) {
        return super.deleteModel({
            whereFields: {profile_name},
        })
    }
    deleteProfileById({account_id, transaction}) {
        return super.deleteModel({
            whereFields: {account_id},
            transaction
        })
    }
}