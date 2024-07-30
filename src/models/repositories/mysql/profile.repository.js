import BaseRepository from "../base.repository.js";
import Profile from "../../profile.model.js";
import Databases from "../../../dbs/init.databases.js";
const client = Databases.getClientFromMysql("shop")

export default new class ProfileRepository extends BaseRepository {
    constructor() {
        super(Profile)
    }

    async destroyProfileById({placeholderId, transaction}) {
        return await this.destroyById({placeholderId, transaction})
    }

    async destroyById({placeholderId, transaction}) {
        return super.destroyById({placeholderId, transaction});
    }
}