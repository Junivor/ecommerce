import {Error} from "mongoose";

console.log("VALIDATOR")


export default class DatabaseValidator {
    constructor(initObject = {}) {
        this.objects = initObject
        this.title = ""
        this.normalString = ""
        this.lowerCaseString = ""
    }

    isParamEmpty(...params) {
        if (!params.every(Boolean)) throw new Error("Some params are empty, check again")
        return this
    }
    isEmpty() {
        const objects = this.getObjects()

        if (!Boolean(Object.keys(objects).length)) throw new Error("Empty")
        else return this
    }
    isDuplicate() {
        const object = this.getObject()

        if (Boolean(object))
            throw new Error(`${this.title} already existed`)
        return this
    }
    isExist() {
        const object = this.getObject()

        if (Boolean(object)) return this
        else throw new Error(`${this.title} is not exist`)
    }

    getObject() {
        const objects = this.getObjects()
        const lowerCaseString = this.getLowerCaseString()

        return objects[lowerCaseString]
    }
    getObjects() {
        return this.objects
    }
    setObject(object) {
        this.objects = object
        return this
    }

    getString() {
        return this.normalString
    }
    getLowerCaseString() {
        return this.lowerCaseString
    }
    setTitle(string) {
        this.title = string
        return this
    }
    setString(string) {
        this.normalString = string
        this.setLowerCaseString()
        return this
    }
    setLowerCaseString(string) {
        if (string) {
            this.lowerCaseString = string.toLowerCase()
        } else {
            const normalString = this.getString()
            this.lowerCaseString = normalString.toLowerCase()
        }
        return this
    }
}

