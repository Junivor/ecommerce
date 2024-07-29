import BaseRepository from "../base.repository.js";
import Profile from "../../profile.model.js";
import generateRandomId from "../../../utils/generateRandomId.js";

export default new class ProfileRepository extends BaseRepository {
    constructor() {
        super(Profile)
    }
}