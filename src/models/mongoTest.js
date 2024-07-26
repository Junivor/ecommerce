import Databases from "../dbs/init.databases.js";
import {Schema} from "mongoose";

const redis = Databases.getDatabase("redis")
const mongodb = Databases.getDatabase("mongo")
const client = mongodb.getClient("local")
const redisClient = redis.getClient("redis_zero")
const KEY = "MONGO_MODEL"

async function set(key, data) {
    await redisClient.set(key, JSON.stringify(data))
}

async function exists(key) {
    return await redisClient.exists(key)
}

const startup_log = new Schema(
    {
        hostname: String,
        startTime: Date,
        startTimeLocal: String,
        cmdLine: Object,
        pid: Number,
        buildinfo: Object
    },
    {
        collection: 'startup_log'
    }
);


const MODEL_MONGO = client.model('startup_log', startup_log);

if (await exists(KEY)) {
    console.log("CACHE ZERO HIT")
} else {
    console.log("CACHE ZERO MISS")
    const results = await MODEL_MONGO.find({}).lean().exec()
    await set(KEY, results)
}




export default MODEL_MONGO