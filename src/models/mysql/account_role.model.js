import {DataTypes, Model} from "sequelize";
import Account from "./account.model.js";
import Role from "./role.model.js";
import Databases from "../../dbs/init.databases.js";

const sequelize = Databases.getClientFromMysql("shop")

export default class AccountRole extends Model {}

AccountRole.init({
    account_id: {
        type: DataTypes.UUID,
        references: {
            model: Account,
            key: 'account_id'
        },
        primaryKey: true
    },
    role_id: {
        type: DataTypes.UUID,
        references: {
            model: Role,
            key: 'role_id'
        },
        primaryKey: true
    }
}, {
    sequelize,
    tableName: "AccountsRoles",
    modelName: "AccountRole"
})