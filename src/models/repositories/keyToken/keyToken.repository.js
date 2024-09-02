import KeyToken from "../../mysql/keyToken.model.js";
import {NotFoundException} from "../../../core/error.response.js";

export default class KeyTokenRepository extends KeyToken {
        static createKeyToken({account_id, public_key, private_key, refresh_token}) {
            return this.create({
                account_id,
                public_key,
                private_key,
                refresh_token
            })
        }
        static async insertRefreshToken({ account_id, old_token, new_token, public_key, private_key }) {
            return this.findOne({
                where: {account_id}
            }).then(async keyToken => {
                if (!keyToken)
                    throw new NotFoundException("Key token not found")

                return await keyToken.update({
                    refresh_token_used: [...keyToken.refresh_token_used, old_token],
                    refresh_token: new_token,
                    public_key,
                    private_key,
                }, {where: {account_id}})
            })
        }
        static clearKeyToken({ account_id }) {
            return this.destroy({
                where: {account_id}
            })
        }
        static findByAccountId({ account_id, attributes = ['*'], raw = false }) {
            return this.findOne({
                where: {account_id},
                attributes,
                raw
            })
        }
        static findPublicKey({ account_id }) {
            return this.findOne({
                where: {account_id},
                attributes: ["public_key"],
                raw: true
            })
        }
        static findPubPriKey({ account_id }) {
            return this.findOne({
                where: {account_id},
                attributes: ["public_key", "private_key"],
                raw: true
            })
        }
}