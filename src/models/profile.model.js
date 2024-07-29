import {DataTypes, Model} from "sequelize";
import Account from "./account.model.js";
import Databases from "../dbs/init.databases.js";
const sequelize = Databases.getClientFromMysql("shop")

export default class Profile extends Model{}

Profile.init({
    account_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Account,
            key: "id"
        }
    },
    profile_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "example_user"
    },
    profile_picture: {
        type: DataTypes.STRING,
        defaultValue: "user-example.jpg"
    },
    phone_number: {
        type: DataTypes.BIGINT,
        unique: true
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    sequelize,
    tableName: "Profiles",
    modelName: "Profile",
    timestamps: true
}).sync({ alter: true })
    .then().catch(console.error)

