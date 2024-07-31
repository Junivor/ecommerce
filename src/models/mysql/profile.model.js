import {DataTypes, Model} from "sequelize";
import Databases from "../../dbs/init.databases.js";
import Account from "./account.model.js";
const sequelize = Databases.getClientFromMysql("shop")

export default class Profile extends Model{}

Profile.init({
    account_id: {
        type: DataTypes.UUID,
        references: {
            model: Account,
            key: "account_id"
        }
    },
    profile_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "example_user"
    },
    profile_picture: {
        type: DataTypes.STRING,
        defaultValue: "account-example.jpg"
    },
    phone_number: {
        type: DataTypes.STRING,
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

