import Profile from "../profile.model.js";
import Account from "../account.model.js";

Account.hasMany(Profile, { foreignKey: 'account_id' });
Profile.belongsTo(Account, { foreignKey: 'account_id' });

export { Account, Profile };