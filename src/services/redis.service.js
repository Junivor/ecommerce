import Ioredis from "../dbs/init.ioredis.js";

export default new class RedisService extends Ioredis {
    constructor() {
        super()
        this.client = this.getClient("redis_zero")
        this.TTL = {
            EX: 5000, //ms
            PX: 5000, //secs
        }

        this.USER_KEY_PERFIX = "usr"
    }

    setTTL(timestamp, value = 5000) {
        if (!timestamp) throw new Error("Invalid value, empty")
        this.TTL[timestamp] = value
    }
    getTTL(timestamp) {
        return this.TTL[timestamp]
    }

    async setCache(key = "", value) {
        await this.client.set(key, JSON.stringify(value))
    }

    async getCache(key = "") {
        return JSON.parse(await this.client.get(key))
    }

    getUserKeyPrefix() {
        return this.USER_KEY_PERFIX
    }
}