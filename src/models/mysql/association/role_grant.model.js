import Databases from "../../../dbs/init.databases.js";
import {DataTypes, Model} from "sequelize";
import Role from "../role.model.js";
import Grant from "../grant.model.js";

const sequelize = Databases.getClientFromMysql("shop")

export default class RoleGrant extends Model {}

RoleGrant.init({
    role_id: {
        type: DataTypes.UUID,
        references: {
            model: Role,
            key: "role_id"
        },
        primaryKey: true
    },
    grant_id: {
        type: DataTypes.UUID,
        references: {
            mode: Grant,
            key: "grant_id"
        },
        primaryKey: true
    }
}, {
    sequelize,
    tableName: "RolesGrants",
    modelName: "RoleGrant",
    timestamps: true,
}).sync({ alter: true }).catch(console.error)