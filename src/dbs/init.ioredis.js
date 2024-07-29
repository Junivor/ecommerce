import Redis from "ioredis"
import Init from "./init.js";
import {Error} from "mongoose";

export default class Ioredis extends Init {
    static URIs = {}
    static registerURI(clientName = "", uri) {
        if (this.URIs[clientName])
            throw new Error("Existed")
        this.URIs[clientName] = uri
        return this.URIs
    }

    static CONNECT_STATUS = {
        CONNECTING: "connect",
        CONNECTED: "ready",
        DISCONNECTED: "end",
        RECONNECTED: "reconnecting",
        ERROR: "error"
    }

    constructor({ TRACKING_MODE = false } = {}) {
        super({
            CONNECT_STATUS: {...Ioredis.CONNECT_STATUS},
            TRACKING_MODE
        })
    }

    setClient(clientName, client) {
        super.setClient(clientName, client);
    }
    setClientStatus(clientName, status) {
        return super.setClientStatus(clientName, status);
    }
    setRetryClient(clientName) {
        super.setRetryClient(clientName);
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
        const client = new Redis(uri, {retryStrategy: null})

        this.setClient(lowerCaseName, client)
        this.setRetryClient(clientName)
        this.handleEventConnect(lowerCaseName, client)
        return this
    }
    connectAll() {
        super.connectAll()
        return this
    }
    disconnect(clientName = "") {
        const lowerCaseName = super.disconnect(clientName);

        const client = this.getClient(lowerCaseName)
        client.quit().then()
        this.getAllClientStatus()
        return this
    }
    async retry(clientName, retryTime = 3, delay, error) {
        await super.retry(clientName, retryTime, delay, error)
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

Ioredis.registerURI("redis_zero", `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB_ZERO}`)
Ioredis.registerURI("redis_one", `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB_ONE}`)
Ioredis.registerURI("redis2_one", `redis://${process.env.REDIS_HOST}:6380/${process.env.REDIS_DB_ONE}`)

