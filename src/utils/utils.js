import * as crypto from "node:crypto";

function getIdValue(obj) {
    const key = Object.keys(obj).find(k => k.toLowerCase().endsWith('id'));
    return key ? obj[key] : undefined;
}

function generateRandomNumber() {
    return Date.now()
}

export {
    getIdValue,
    generateRandomNumber
}