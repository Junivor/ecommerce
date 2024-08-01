import BaseCache from "../base.cache.js";

export default new class ProfileCache extends BaseCache {
    constructor() {
        super({
            PREFIX_KEY: "PR5",
            EXPIRE_TIME: 30 * 24 * 60 * 60 * 60 //1mo
        })
    }


    set({key, value, timeFormat, time}) {
        return super.set({key, value, timeFormat, time});
    }
    get(key) {
        return super.get(key);
    }
    del(key) {
        return super.del(key);
    }
}