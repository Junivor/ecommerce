import {DataTypes, Model} from "sequelize";
import Databases from "../../dbs/init.databases.js";

export default class Role extends Model {}

const sequelize = Databases.getClientFromRedis("shop")

Role.init({
    role_id: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    role_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
}, {
    sequelize,
    tableName: "Roles",
    modelName: "Role",
    timestamps: true
}).sync({ alter: true }).catch(console.error)