import Databases from "../dbs/init.databases.js";

const redis = Databases.getDatabase("redis")
const mysql = Databases.getDatabase("mysql")
const client = mysql.getClient("master")
const redisClient = redis.getClient("redis_one")
const KEY = "MYSQL_MODEL"
async function set(key, data) {
    await redisClient.set(key, JSON.stringify(data))
}

async function exists(key) {
    return await redisClient.exists(key)
}

const results = client.query('SELECT variable, value, set_time, set_by FROM sys_config', (error, results) => {
    if (error) throw error;
    return results
});

if (await exists(KEY)) {
    console.log("CACHE ONE HIT")
} else {
    console.log("CACHE ONE MISS")
    await set(KEY, results)
}


const MODEL_MYSQL = ""
export default MODEL_MYSQL