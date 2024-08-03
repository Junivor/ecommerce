import {DataTypes, Model} from "sequelize";
import Databases from "../../dbs/init.databases.js";

export default class Grant extends Model {}

const sequelize = Databases.getClientFromRedis("shop")

Grant.init({
    grant_id: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    grant_description: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
}, {
    sequelize,
    tableName: "Grants",
    modelName: "Grant",
    timestamps: true
}).sync({ alter: true }).catch(console.error)