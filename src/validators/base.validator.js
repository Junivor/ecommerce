import {NotFoundException} from "../core/error.response.js";

export default class BaseValidator {
    constructor({ requestFields = {}} = {}) {
        this.model = null
        this.serviceName = this.constructor.name
    }

    isRequestFieldEmpty(request) {
        for (const requestKey in request)
            if (!request[requestKey])
                throw new NotFoundException(`Field ${requestKey} cant be empty`)

        return this
    }
    isPathEmpty() {

    }
    isQueryEmpty() {

    }

    setModel(model = {}) {
        this.model = model
    }

    getModel() {
        return this.model
    }
}