import * as mysql from "mysql2"
import Init from "./init.js";

console.log("INIT MYSQL")

export default class Mysql extends Init {
    static URIs = {}
    static registerURI(clientName = "", uri) {
        if (this.URIs[clientName])
            throw new Error("Existed")
        this.URIs[clientName] = uri
        return this.URIs
    }


    static CONNECT_STATUS = {
        CONNECTING: "enqueue",
        CONNECTED: "connect",
        DISCONNECTED: "end",
        ERROR: "error"
    }
    constructor({ TRACKING_MODE = false } = {}) {
        super({
            CONNECT_STATUS: {...Mysql.CONNECT_STATUS},
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
        const client = mysql.createConnection(uri)

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
        client.end()
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


Mysql.registerURI("master", `mysql://${process.env.MYSQL_MASTER_NAME}:${process.env.MYSQL_MASTER_PASSWORD}@${process.env.MYSQL_MASTER_HOST}:${process.env.MYSQL_MASTER_PORT}/${process.env.MYSQL_MASTER_DATABASE}`)
Mysql.registerURI("slave", `mysql://${process.env.MYSQL_SLAVE_NAME}:${process.env.MYSQL_SLAVE_PASSWORD}@${process.env.MYSQL_SLAVE_HOST}:${process.env.MYSQL_SLAVE_PORT}/${process.env.MYSQL_SLAVE_DATABASE}`)



