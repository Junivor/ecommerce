import generateRandomId from "../../utils/generateRandomId.js";

export default class BaseRepository {
    constructor(model) {
        this.model = model
    }

    async all () {
        return this.model.findAll()
    }

    async create(payload) {
        return this.model.create(payload)
    }
}