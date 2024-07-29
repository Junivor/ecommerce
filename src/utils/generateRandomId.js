import * as crypto from "node:crypto";

export default function generateRandomId(size = 16) {
    return crypto.randomBytes(size).toString("hex")
}