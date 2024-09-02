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
        this.publisher = this.initPublisher("redis_publisher")
        this.subscriber = this.initSubscriber("redis_subscriber")
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
    getPublisher() {
        return this.publisher
    }
    getSubscriber() {
        return this.subscriber
    }

    connect(clientName = "", uri) {
        const lowerCaseName = super.connect(clientName, uri)
        const client = new Redis(uri, {retryStrategy: null})

        this.validator.setString(clientName).setObject(client)
        this.setClient(lowerCaseName, client)
        this.setRetryClient(clientName)
        this.handleEventConnect(lowerCaseName, client)
        return this
    }
    initPublisher(pubName = "") {
        const clientName = pubName.toLowerCase()
        const publisher = new Redis()

        this.validator.setString(clientName).setObject(publisher)
        this.setClient(clientName, publisher)
        this.setRetryClient(clientName)
        this.handleEventConnect(clientName, publisher)

        return publisher
    }
    initSubscriber(subName = "") {
        const clientName = subName.toLowerCase()
        const subscriber = new Redis()

        this.validator.setString(clientName).setObject(subscriber)
        this.setClient(clientName, subscriber)
        this.setRetryClient(clientName)
        this.handleEventConnect(clientName, subscriber)

        return subscriber
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
        return super.handleEventConnect(clientName, client)
    }
    printClientStatusTable() {
        super.printClientStatusTable()
    }

}

Ioredis.registerURI("redis_other", `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`)

