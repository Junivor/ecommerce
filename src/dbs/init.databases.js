import DatabaseValidator from "../validators/database.validator.js";
import InitMongo from "./init.mongo.js";
import InitMysql from "./init.mysql.js";
import InitIoredis from "./init.ioredis.js";


export default class Databases {
    static databases = {}
    static validator = new DatabaseValidator(Databases.databases)

    static async registerDatabase(name = "", database) {
         const lowerCaseName = this.validator
             .setTitle(`database[${name}]`)
             .isParamEmpty(name, database)
             .setString(name)
             .isDuplicate()
             .getLowerCaseString()

        this.databases[lowerCaseName] = await new database
    }

    static getDatabase(databaseName = "") {
        const lowerCaseName = this.validator
            .setTitle(`database[${databaseName}]`)
            .isParamEmpty(databaseName)
            .setString(databaseName)
            .isExist()
            .getLowerCaseString()

        return Databases.databases[lowerCaseName]
    }

    static getClientFromMongo(clientName = "") {
        return this.getDatabase("mongo").getClient(clientName)
    }

    static getClientFromRedis(clientName = "") {
        return this.getDatabase("redis").getClient(clientName)
    }

    static getClientFromMysql(clientName = "") {
        return this.getDatabase("mysql").getClient(clientName)
    }

    static getClientFromRabbitMQ(clientName = "") {
        return this.getDatabase("rabbitmq").getClient(clientName)
    }

    static printDatabasesStatus() {
        Object.keys(this.databases).forEach(
            name => Databases.databases[name].printClientStatusTable()
        )
    }
}

await Databases.registerDatabase("mongo", InitMongo)
await Databases.registerDatabase("mysql", InitMysql)
await Databases.registerDatabase("redis", InitIoredis)
await Databases.registerDatabase("rabbitmq", InitRabbit)







