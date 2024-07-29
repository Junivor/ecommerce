import { Error } from "mongoose";

export default class DatabaseValidatorTest {
    static _object = null;
    static _title = "";
    static _normalString = "";
    static _lowerCaseString = "";

    constructor({ initObject = {}, title = "", normalString = "", lowerCaseString = "" } = {}) {
        this.object = initObject;
        this.title = title;
        this.normalString = normalString;
        this.lowerCaseString = lowerCaseString;
    }

    isParamEmpty(...params) {
        if (!params.every(Boolean)) throw new Error("Some params are empty, check again");
        return this;
    }
    isEmpty() {
        if (!this.object[this.lowerCaseString]) throw new Error(`${this.title} not exist`);
        return this;
    }
    isDuplicate() {
        if (this.object[this.lowerCaseString]) throw new Error(`${this.title} already existed`);
        return this;
    }

    getObject() {
        return this.object;
    }
    getString() {
        return this.normalString;
    }
    getLowerCaseString() {
        return this.lowerCaseString;
    }
    setNormalString(string) {
        this.normalString = string;
        return this;
    }
    setLowerCaseString(string) {
        if (string) {
            this.lowerCaseString = string.toLowerCase();
        } else {
            this.lowerCaseString = this.normalString.toLowerCase();
        }
        return this;
    }

    static builder() {
        return this;
    }
    static build() {
        return new DatabaseValidator({
            title: this._title,
            initObject: this._object,
            normalString: this._normalString,
            lowerCaseString: this._lowerCaseString,
        });
    }
    static setObject(object) {
        this._object = object;
        return this;
    }
    static setTitle(title) {
        this._title = title;
        return this;
    }
    static setNormalString(string) {
        this._normalString = string;
        this.setLowerCaseString(this._normalString)
        return this;
    }
    static setLowerCaseString(string) {
        if (string) {
            this._lowerCaseString = string.toLowerCase();
        } else {
            this._lowerCaseString = this._normalString.toLowerCase();
        }
        return this;
    }
}

