import {BadRequestException, NotFoundException} from "../core/error.response.js";

export default class BaseValidator {
    constructor({modelName = ""} = {}) {
        this.modelName = modelName
    }

    async isDuplicate(model){

        if (model)
            throw new Error(`${this.modelName} is exists`)
    }
    async isNotFound(model){
        if (!model) {
            throw new Error(`${this.modelName} not found`)
        }
    }
    setFields(fields) {
        this.fields = fields
        return this
    }
    getField(name) {
        return this.fields[name]
    }
    getFields() {
        return this.fields
    }
    setModel(Model) {
        this.Model = Model
    }n
    getModel() {
        const Model = this.Model
        this.setModel(null)
        return Model
    }
}