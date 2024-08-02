import Databases from "../../dbs/init.databases.js";
import {DataTypes, Model} from "sequelize";
import {generateRandomNumber} from "../../utils/utils.js";
import Role from "./role.model.js";

const sequelize = Databases.getClientFromMysql("shop")


export default class Account extends Model {}

Account.init({
    account_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        defaultValue: `user-${generateRandomNumber()}`
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // false -> request email to make this account active
    }
}, {
    sequelize,
    tableName: "Accounts",
    modelName: "Account",
    timestamps: true,
}).sync({alter: true})
    .then().catch(console.error)

