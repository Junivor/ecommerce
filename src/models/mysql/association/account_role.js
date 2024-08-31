import Account from "../account.model.js";
import Role from "../role.model.js";
import AccountRoles from "./account_role.model.js";

Account.belongsToMany(Role,{ through: AccountRoles, foreignKey: "account_id" })
Role.belongsToMany(Account, { through: AccountRoles, foreignKey: "role_id" })