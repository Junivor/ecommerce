import DatabaseValidator from "../validators/database.validator.js";
import InitMongo from "./init.mongo.js";
import InitMysql from "./init.mysql.js";
import InitIoredis from "./init.ioredis.js";


export default class Databases {
    static databases = {}
    static validator = new DatabaseValidator(Databases.databases)

    static registerDatabase(name = "", database) {
         const lowerCaseName = this.validator
             .setTitle(`database[${name}]`)
             .isParamEmpty(name, database)
             .setString(name)
             .isDuplicate()
             .getLowerCaseString()

        this.databases[lowerCaseName] = database
    }

    static getDatabase(databaseName = "") {
        const lowerCaseName = this.validator
            .setTitle(`database[${databaseName}]`)
            .isParamEmpty(databaseName)
            .setString(databaseName)
            .isExist()
            .getLowerCaseString()

        return new Databases.databases[lowerCaseName]
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

    static printDatabasesStatus() {
        Object.keys(this.databases).forEach(
            name => Databases.databases[name].printClientStatusTable()
        )
    }
}






Databases.registerDatabase("mongo", InitMongo)
Databases.registerDatabase("mysql", InitMysql)
Databases.registerDatabase("redis", InitIoredis)


