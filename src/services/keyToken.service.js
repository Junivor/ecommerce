import * as crypto from "node:crypto";
import pkg from "jsonwebtoken"

import BaseService from "./base.service.js";
import KeyTokenRepository from "../models/repositories/keyToken/keyToken.repository.js";
import KeyTokenCache from "../models/repositories/keyToken/keyToken.cache.js";

const { sign, verify } = pkg
export default new class KeyTokenService extends BaseService {
    constructor() {
        super()
    }

    createPubPriKey(size = 16, encoding = "hex") {
        const publicKey = crypto.randomBytes(size).toString(encoding)
        const privateKey = crypto.randomBytes(size).toString(encoding)

        return {
            public_key: publicKey,
            private_key: privateKey
        }
    }
    createAccessRefreshToken({payload, public_key, private_key}) {
        const AT = sign(payload, public_key, {
            expiresIn: "2 days"
        })

        const RT = sign(payload, private_key, {
            expiresIn: "5 days"
        })

        return {
            access_token: AT,
            refresh_token: RT,
        }
    }
    findPublicKey({account_id}) {
        return KeyTokenRepository.findPublicKey({account_id})
    }
    findPubPriKey({ account_id }) {
        return KeyTokenRepository.findPubPriKey({account_id})
    }
    verifyToken(token, key) {
        return verify(token, key)
    }
    clearToken({account_id}) {
        KeyTokenRepository.clearKeyToken({account_id})
        KeyTokenCache.del({key: account_id})
    }
}