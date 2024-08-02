import BaseCache from "../base.cache.js";
import ProfileCache from "../profile/profile.cache.js";

export default new class AccountCache extends BaseCache {
    constructor() {
        super({
            PREFIX_KEY: "USR",
            EXPIRE_TIME: 30 * 24 * 60 * 60 * 60 //1mo
        })
    }




    set({key = "", value = null, timeFormat = this.getTimeFormat(), time = this.getExpireTime()}) {
        return super.set({key, value, timeFormat, time});
    }
    get({key}) {
        return super.get({key});
    }
    del({key}) {
        return super.del({key});
    }
    TTL({key}) {
        return super.TTL({key});
    }

    hSet({hKey = "", fKey = "", value = null, time = this.getExpireTime()}) {
        const PROFILE_PREFIX_KEY = ProfileCache.PREFIX_KEY
        const hKeyFull = `${this.PREFIX_KEY}:${hKey}`

        this.client.hset(hKeyFull, `${PROFILE_PREFIX_KEY}:${fKey}`, JSON.stringify({
            data: value
        }))

        this.expire({
            key: hKeyFull,
            expireTime: time
        })

        return hKey
    }

    hDel({hKey = "", fKey = ""}) {
        const PROFILE_PREFIX_KEY = ProfileCache.PREFIX_KEY
        const hKeyFull = `USR:04ac6181-0270-454f-917f-16be6afaf088`

        return this.client.hdel(hKeyFull, `${PROFILE_PREFIX_KEY}:${fKey}`)
    }
}