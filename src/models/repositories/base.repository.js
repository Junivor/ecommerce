import {where} from "sequelize";

export default class BaseRepository {
    constructor(Model) {
        this.Model = Model
        this.cachedModelData = null
    }

    createModel(payload, transaction = null) {
        return !transaction
            ? this.Model.create(payload)
            : this.Model.create(payload, {transaction})
    }
    updateModel(Model, payload) {
        for (const [key, value] of Object.entries(payload)) {
            Model[key] = value
        }

        return Model.save()
    }
    findModel({ whereFields = {}, include } = {}) {
        const foundModel = this.Model.findOne({
            where: {...whereFields},
            include
        })

        this.setCacheModelData(foundModel)
        return foundModel
    }
    deleteModel({ whereFields = {}, transaction = null } = {}) {
        return this.Model.destroy({
            where: {...whereFields}
        }, transaction)
    }
    setCacheModelData(modelData) {
        return this.cachedModelData = modelData
    }
    getCacheModelData() {
        return this.cachedModelData
    }

    get(id) {

    }
    set(id) {

    }
}