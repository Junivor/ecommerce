import {Sequelize} from 'sequelize';
import Init from "./init.js";
import {ConnectionString} from "connection-string";

console.log("INIT MYSQL")

export default class Mysql extends Init {
    static URIs = {}
    static registerURI(type = "", clientName = "", uri) {
        if (!this.URIs[type]) {
            this.URIs[type] = {}; // Initialize the type if it doesn't exist
        }

        if (this.URIs[type][clientName]) {
            throw new Error("Existed");
        }

        this.URIs[type][clientName] = uri;
        return this.URIs;
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

    ping() {
        console.log("pong")
    }

    setClient(clientName, client) {
        return super.setClient(clientName, client);
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

    connect(clientName ) {
        const write = new ConnectionString(Mysql.URIs["write"]["master"])
        const read = Object.values(Mysql.URIs["read"]).map(uri => {
            const converted = new ConnectionString(uri)
            return {
                username: converted.user,
                password: converted.password,
                host: converted.hostname,
                port: converted.port,
                database: converted.path[0],
            }
        })

        const client = new Sequelize(null, null, null, {
            dialect: "mysql",
            replication: {
              write: {
                  username: write.user,
                  password: write.password,
                  host: write.hostname,
                  port: write.port,
                  database: write.path[0],
              },
              read
            },
            pool: {
                max: 5,
                idle: 10000,
            },
            retry: 5,
            define: {
                timestamps: false,
            }
        })

        this.setClient(clientName, client)
        this.validator.setString(clientName).setObject(client)
        this.handleEventConnect(clientName, client)

    }
    connectAll() {
        return this.connect("shop")
    }
    disconnect(clientName = "") {
        const lowerCaseName = super.disconnect(clientName);

        const client = this.getClient(lowerCaseName)
        client.end()
        this.getAllClientStatus()
        return this
    }
    async retry(clientName, retryTime = 3, delay, error) {
        await super.retry(clientName, retryTime, delay, error)
    }


    handleEventConnect(clientName, client = {}) {
        const MAX_RETRY = this.getMaximumRetry()
        const RETRY_PER_MS = this.getRetryPerMs()

        client.authenticate()
            .then(() => {
                console.log("Mysql connected")
                this.setRetryClient(clientName)
                this.setSuccessRetry(clientName)
                this.setClientStatus(clientName, this.CONNECT_STATUS.CONNECTED)
            })
            .catch(async (error) => {
                const isClientRetrying = this.getRetryClientStatus(clientName)
                if (isClientRetrying) return
                this.setRetryClientStatus(clientName, true)
                this.setClientStatus(clientName, this.CONNECT_STATUS.ERROR)

                await this.retry(clientName, MAX_RETRY, RETRY_PER_MS, error)
            })
    }
    handleTimeoutError(clientName, message) {
        super.handleTimeoutError(clientName, message);
    }

    printClientStatusTable() {
        super.printClientStatusTable()
    }
}


Mysql.registerURI("write", "master", `mysql://${process.env.MYSQL_MASTER_USERNAME}:${process.env.MYSQL_MASTER_PASSWORD}@${process.env.MYSQL_MASTER_HOST}:${process.env.MYSQL_MASTER_PORT}/${process.env.MYSQL_MASTER_DATABASE}`)
Mysql.registerURI("read", "slave_1", `mysql://${process.env.MYSQL_SLAVE_USERNAME}:${process.env.MYSQL_SLAVE_PASSWORD}@${process.env.MYSQL_SLAVE_HOST}:${process.env.MYSQL_SLAVE_PORT}/${process.env.MYSQL_SLAVE_DATABASE}`)



