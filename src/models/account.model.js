import Databases from "../dbs/init.databases.js";
import {DataTypes, Model} from "sequelize";
import generateRandomId from "../utils/generateRandomId.js";

const sequelize = Databases.getClientFromMysql("shop")


export default class Account extends Model {}

Account.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
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

Account.beforeValidate((profile, options) => {
    profile.id = generateRandomId(16)
})