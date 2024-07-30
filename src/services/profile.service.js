import BaseService from "./base.service.js";
import ProfileRepository from "../models/repositories/mysql/profile.repository.js";

export default new class ProfileService extends BaseService {
    async createProfile(request, transaction) {
        return ProfileRepository.create(request, transaction)
    }
    async destroyProfileById({placeholderId, transaction}) {
        return await ProfileRepository.destroyProfileById({placeholderId, transaction})
    }
}