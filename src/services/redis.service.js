import Ioredis from "../dbs/init.ioredis.js";
import BaseCache from "../models/repositories/base.cache.js";

export default new class RedisService extends BaseCache {
    constructor() {
        super({ PREFIX_KEY: "USER "})
    }

    readCache(form = "") {
        return (req, res, next) => {
            console.log(this.PREFIX_KEY)

            next()
        }
    }
}