import {ReasonPhrases, StatusCodes} from "http-status-codes";

class SuccessResponse {
    constructor({ service, statusCode, message, metadata }) {
        this.service = service || "unknown"
        this.statusCode = statusCode
        this.message = message
        this.metadata = metadata || {}
    }

    send(res) {
        return res.status(this.statusCode).json(this)
    }
}

class OKResponse extends SuccessResponse {
    constructor({service, message = ReasonPhrases.OK, metadata}) {
        super({
            service, message, metadata,
            statusCode: StatusCodes.OK
        });
    }
}

class CreatedResponse extends SuccessResponse {
    constructor({service, message = ReasonPhrases.CREATED, metadata}) {
        super({
            service, message, metadata,
            statusCode: StatusCodes.OK
        });
    }
}

export {
    OKResponse,
    CreatedResponse
}