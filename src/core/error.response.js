import {ReasonPhrases, StatusCodes} from "http-status-codes";

class ErrorResponse extends Error {
    constructor({message, statusCode, service}) {
        super(message)
        this.statusCode = statusCode
        this.service = service?.replace("Service", "")
    }
}

class NotFoundException extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, service = "") {
        super({
            message, service,
            statusCode: StatusCodes.NOT_FOUND
        })
    }
}

class BadRequestException extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, service = "") {
        super({
            message, service,
            statusCode: StatusCodes.BAD_REQUEST,
        })
    }
}

class ConflictException extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, service = "") {
        super({
            message, service,
            statusCode: StatusCodes.BAD_REQUEST
        })
    }
}

export {
    NotFoundException,
    BadRequestException,
    ConflictException
}