import Ioredis from "../../dbs/init.ioredis.js";
import {BadRequestException} from "../../core/error.response.js";
import BaseValidator from "../../validators/base.validator.js";
import {RAND_NUMBER} from "../../utils/constant.js";

export default class BaseCache extends Ioredis {
    constructor({PREFIX_KEY = "", EXPIRE_TIME = 10000, TIME_FORMAT = "EX"} = {}) {
        super()
        this.PREFIX_KEY = PREFIX_KEY.toUpperCase()
        this.EXPIRE_TIME = EXPIRE_TIME * RAND_NUMBER
        this.TIME_FORMAT = TIME_FORMAT.toUpperCase()
        this.client = this.getClient("redis_zero")
        this.validator = new BaseValidator()
    }

    setPrefixKey(key) {
        this.validator.validateRequestField({key})

        if (typeof key !== "string" )
            throw new BadRequestException("Invalid datatype")

        this.PREFIX_KEY = key
    }
    setTimeFormat(value = "") {
        this.validator.validateRequestField({value})


        if (typeof value !== "string" )
            throw new BadRequestException("Invalid datatype")

        return this.TIME_FORMAT = value.toUpperCase()
    }
    setExpireTime(value) {
        if (!value)
            throw new BadRequestException("This field cant be empty")

        if (typeof value !== "number")
            throw new BadRequestException("Invalid datatype")

        this.EXPIRE_TIME = value * RAND_NUMBER
    }

    getPrefixKey() {
        return this.PREFIX_KEY
    }
    getTimeFormat() {
        return this.TIME_FORMAT
    }
    getExpireTime() {
        return this.EXPIRE_TIME
    }

    set({key = "", value = null, timeFormat = this.getTimeFormat() , time = this.getExpireTime()}) {
        const PREFIX_KEY = this.getPrefixKey()
        console.log(`SET: ${PREFIX_KEY}:${key}`)

        this.client.set(`${PREFIX_KEY}:${key}`, JSON.stringify(value), timeFormat, time)
        return value
    }
    get(key) {
        const PREFIX_KEY = this.getPrefixKey()
        this.validator.validateRequestField({key})

        return this.client
            .get(`${PREFIX_KEY}:${key}`)
            .then(JSON.parse)
    }
    del(key) {
        return this.set({
            key
        })
    }

}