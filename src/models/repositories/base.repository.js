import {where} from "sequelize";

export default class BaseRepository {
    constructor(model) {
        this.model = model
    }

    async all () {
        return this.model.findAll()
    }
    async create(payload, transaction = null) {
        return transaction
            ? this.model.create(payload, {transaction})
            : this.model.create(payload)
    }
    async destroyById({placeholderId, transaction}) {
        return transaction
            ? this.model.destroy({where: {...placeholderId}}, {transaction})
            : this.model.delete({where: {...placeholderId}
        })
    }
    async updateModel({ model, payload }) {
        const updaterModel = model
        Object.keys(payload).forEach(key => {
            const keyWithoutPrefix = key.split("update_")[1]
            updaterModel[keyWithoutPrefix] = payload[key]
        })
        return await updaterModel.save()
    }
}