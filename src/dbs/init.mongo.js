import mongoose, {Error} from "mongoose";
import Init from "./init.js";

console.log("INIT MONGO")

export default class Mongo extends Init{
    static URIs = {}
    static registerURI(clientName = "", uri) {
        if (this.URIs[clientName])
            throw new Error("Existed")
        this.URIs[clientName] = uri
        return this.URIs
    }

    static CONNECT_STATUS = {
        CONNECTING: "connecting",
        CONNECTED: "connected",
        DISCONNECTING: "disconnecting",
        DISCONNECTED: "disconnected",
        RECONNECTED: "reconnected",
        ERROR: "error"
    }

    constructor({ TRACKING_MODE = false } = {}) {
        super({
            CONNECT_STATUS: {...Mongo.CONNECT_STATUS},
            TRACKING_MODE
        })
    }


    setClient(clientName, client) {
        super.setClient(clientName, client);
    }
    setClientStatus(clientName, status) {
        return super.setClientStatus(clientName, status);
    }

    getInstance() {
        return super.getInstance();
    }
    getClient(clientName = "") {
        return super.getClient(clientName);
    }
    getClients() {
        return super.getClients();
    }
    getClientsName() {
        return super.getClientsName();
    }

    connect(clientName = "", uri) {
        const lowerCaseName = super.connect(clientName, uri)
        const client = mongoose.createConnection(uri)

        this.handleEventConnect(lowerCaseName, client)
        this.setClient(lowerCaseName, client)
        this.setClientStatus(lowerCaseName, this.CONNECT_STATUS.CONNECTED)
        return this
    }
    connectAll() {
        super.connectAll()
        return this
    }
    disconnect(clientName = "") {
        const lowerCaseName = super.disconnect(clientName);

        const client = this.getClient(lowerCaseName)
        client.close()
        this.getAllClientStatus()
        return this
    }

    handleEventConnect(clientName = "", client = {}) {
        super.handleEventConnect(clientName, client)
    }
    handleTimeoutError() {
        super.handleTimeoutError();
    }
    printClientStatusTable() {
        super.printClientStatusTable()
    }
}

Mongo.registerURI("local", `mongodb://${process.env.MONGO_LOCAL_HOST}:${process.env.MONGO_LOCAL_PORT}/${process.env.MONGO_DB_FIRST}`)
Mongo.registerURI("clone", `mongodb://${process.env.MONGO_LOCAL_HOST}:${process.env.MONGO_LOCAL_PORT}/${process.env.MONGO_DB_SECOND}`)

