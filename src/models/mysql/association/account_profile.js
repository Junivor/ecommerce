import Profile from "../profile.model.js";
import Account from "../account.model.js";

Account.hasOne(Profile, { foreignKey: 'account_id', onDelete: "CASCADE" });
Profile.belongsTo(Account, { foreignKey: 'account_id' });

export { Account, Profile };