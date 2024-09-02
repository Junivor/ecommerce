import Ioredis from "../../dbs/init.ioredis.js";
import {BadRequestException} from "../../core/error.response.js";
import {RAND_NUMBER} from "../../utils/constant.js";

export default class BaseCache extends Ioredis {
    constructor({PREFIX_KEY = "", EXPIRE_TIME = 10000, TIME_FORMAT = "EX"} = {}) {
        super()
        this.PREFIX_KEY = PREFIX_KEY.toUpperCase()
        this.EXPIRE_TIME = EXPIRE_TIME * RAND_NUMBER
        this.TIME_FORMAT = TIME_FORMAT.toUpperCase()
        this.client = this.getClient("redis_other")
        this.KEY_STATUS = {
            EXIT: 1,
            NOT_EXIT: 0,
        }
    }
    setPrefixKey(key) {

        if (typeof key !== "string" )
            throw new BadRequestException("Invalid datatype")

        this.PREFIX_KEY = key
    }
    setTimeFormat(value = "") {


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
        try {
            const PREFIX_KEY = this.getPrefixKey()
            console.log(`SET: ${PREFIX_KEY}:${key}`)
            console.log(`DATA: ${value}`)

            this.client.set(`${PREFIX_KEY}:${key}`, JSON.stringify({
                data: value
            }), timeFormat, time)
            return value
        } catch (error) {
            console.error(error)
        }
    }
    get({key}) {
        const PREFIX_KEY = this.getPrefixKey()

        return this.client
            .get(`${PREFIX_KEY}:${key}`)
            .then(JSON.parse)
    }
    del({key}) {
        return this.set({
            key
        })
    }
    TTL({key}) {
        return this.client.TTL(key)
    }
    expire({key, expireTime}) {
        return this.client.expire(`${this.PREFIX_KEY}:${key}`, expireTime)
    }
    hSet({hKey = "", fKey = "", value = null, timeFormat = this.getTimeFormat() , time = this.getExpireTime()}) {}

}