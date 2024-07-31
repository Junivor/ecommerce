import {BadRequestException, NotFoundException} from "../core/error.response.js";

export default class BaseValidator {
    constructor({requestFields = {}} = {}) {
        this.Model = null
        this.fields = requestFields
        this.serviceName = this.constructor.name
    }

    async isDuplicate(){}
    async isNotFound(){}
    validateRequestField(fields) {
        const requestFields = fields ? fields : this.getFields()
        if (!requestFields || typeof requestFields !== 'object' || Object.keys(requestFields).length === 0) {
            throw new NotFoundException("No fields were found", this.serviceName);
        }

        function validateRecursively (current, path = [])  {
            for (const [key, value] of Object.entries(current)) {
                const currentPath = [...path, key];

                if (!value) {
                    throw new BadRequestException(`${currentPath.join('.')} field can't be null or empty`);
                }

                if (typeof value === 'object' && !Array.isArray(value)) {
                    validateRecursively(value, currentPath);
                }
            }
        }

        validateRecursively(requestFields);
        return this;
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