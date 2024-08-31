import {DataTypes, Model} from "sequelize";
import Databases from "../../dbs/init.databases.js";
import Account from "./account.model.js";

const sequelize = Databases.getClientFromMysql("shop")
export default class KeyToken extends Model {}


KeyToken.init({
    key_token_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    account_id: {
        type: DataTypes.UUID,
        references: {
            model: Account,
            key: "account_id"
        }
    },
    public_key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    private_key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    refresh_token_used: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    }
}, {
    sequelize,
    tableName: "KeyTokens",
    modelName: "KeyToken",
    timestamps: true

}).sync({ alter: true })
    .then().catch(console.error)