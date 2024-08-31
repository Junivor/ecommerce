import Role from "../role.model.js";
import Grant from "../grant.model.js";
import RoleGrant from "./role_grant.model.js";


Role.belongsToMany(Grant, { through: RoleGrant, foreignKey: "role_id" })
Grant.belongsToMany(Role, { through: RoleGrant, foreignKey: "grant_id" })