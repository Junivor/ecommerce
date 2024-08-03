import BaseCache from "../base.cache.js";

export default new class TokenCache extends BaseCache {
    constructor() {
        super({
            PREFIX_KEY: "USR_KEY"
        })
    }


    set({key = "", value = null, timeFormat = this.getTimeFormat(), time = this.getExpireTime()}) {
        return super.set({key, value, timeFormat, time});
    }

    get({key}) {
        return super.get({key});
    }
}