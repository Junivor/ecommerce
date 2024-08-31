import BaseCache from "../base.cache.js";

export default new class KeyTokenCache extends BaseCache {
    constructor() {
        super({
            PREFIX_KEY: "TOKEN:USR"
        })
    }

    set({key = "", value = null, timeFormat = this.getTimeFormat(), time = this.getExpireTime()}) {
        return super.set({key, value, timeFormat, time})
    }

    get({key}) {
        return super.get({key});
    }

    del({key}) {
        return super.del({key});
    }
}