import DatabaseValidator from "../validator/database.validator.js";
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

        return Databases.databases[lowerCaseName]
    }

    static printDatabasesStatus() {
        Object.keys(this.databases).forEach(
            name => Databases.databases[name].printClientStatusTable()
        )
    }
}






Databases.registerDatabase("mongo", new InitMongo())
Databases.registerDatabase("mysql", new InitMysql())
Databases.registerDatabase("redis", new InitIoredis())


