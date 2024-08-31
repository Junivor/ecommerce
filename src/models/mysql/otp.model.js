import {DataTypes, Model} from "sequelize";
import Databases from "../../dbs/init.databases.js";

export default class OTP extends Model {}
const sequelize = Databases.getClientFromMysql("shop")

OTP.init({
    otp_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp_token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    /*tokenExpires: {
        type: DataTypes.DATE,
        defaultValue: Date.now() + 5 * 60 * 1000
    }*/
}, {
    sequelize,
    tableName: "OTPs",
    modelName: "OTP",
    timestamps: true
}).sync({alter: true})
    .then().catch(console.error)
