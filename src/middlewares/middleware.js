import {BadRequestException, NotFoundException} from "../core/error.response.js";
import ProfileCache from "../models/repositories/profile/profile.cache.js";
import {OKResponse} from "../core/success.response.js";

export default class Middleware {
    static serviceName = "Middleware"
    static CACHE = {
        PROFILE: "profile",
        ACCOUNT: "account"
    }
    static CACHE_REGISTERED = {}
    static registerCache(cacheName, cache) {
        if (this.CACHE_REGISTERED[cacheName])
            throw new Error("Already existed")

        return this.CACHE_REGISTERED[cacheName] = cache
    }
    static getCache(clientName) {
        const client = this.CACHE_REGISTERED[clientName]
        if (!client)
            throw new Error("Cache not found")

        return client
    }

    static readCache(from = "") {
        if (!from) throw new NotFoundException("This field cant be empty")
        return async (req, res, next) => {
            const profileNameField = req.params.profile_name
            const client = this.getCache(from.toLowerCase())

            const receivedCache = await client.get(profileNameField)

            if (!receivedCache) {
                client.set({
                    key: profileNameField
                })
                throw new NotFoundException(`Profile not found`, this.serviceName)
            } 
           return new OKResponse({
               service: this.serviceName,
               message: "GET from cache",
               metadata: receivedCache.data
           }).send(res)
        }
    }

    static async validateParams(req, res, next) {
        const requestFields = {
            ...req.body,
            ...req.params,
            ...req.query
        }

        if (!requestFields || typeof requestFields !== 'object' || Object.keys(requestFields).length === 0) {
            throw new NotFoundException("No fields were found", Middleware.serviceName);
        }

        function validateRecursively (current, path = [])  {
            for (const [key, value] of Object.entries(current)) {
                const currentPath = [...path, key];

                if (!value) {
                    throw new BadRequestException(`${currentPath.join('.')} field can't be null or empty`);
                }

                if (typeof value === 'object' && !Array.isArray(value)) {
                    validateRecursively(value, currentPath);
                }
            }
        }

        validateRecursively(requestFields);
        return next();
    }
}

Middleware.registerCache(Middleware.CACHE.PROFILE, ProfileCache)