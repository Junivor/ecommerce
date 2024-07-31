import {CreatedResponse, OKResponse} from "../core/success.response.js";
import ProfileService from "../services/profile.service.js";

export default class ProfileController {
    static serviceName = "Profile"

    static async findOne(req, res, next) {
        new OKResponse({
            service: ProfileController.serviceName,
            metadata: await ProfileService.findProfile(req.params)
        }).send(res)
    }
    static async create(req, res, next) {
        new CreatedResponse({
            service: ProfileController.serviceName,
            metadata: await ProfileService.createProfile(req.body)
        }).send(res)
    }
    static async remove(req, res, next) {
        new OKResponse({
            service: ProfileController.serviceName,
            metadata: await ProfileService.deleteOneProfile(req.body)
        }).send(res)
    }
    static async update(req, res, next) {
        return new OKResponse({
            service: ProfileController.serviceName,
            metadata: await ProfileService.updateProfile(req.body)
        }).send(res)
    }

}