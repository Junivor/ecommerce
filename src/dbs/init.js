import DatabaseValidator from "../validator/database.validator.js";

export default class Init {
    constructor({ CONNECT_STATUS = {}, TRACKING_MODE = false} = {}) {
        this.validator = new DatabaseValidator()
        this.isConnected = false
        this.clients = {}
        this.CONNECT_STATUS = {
            CONNECTING: "connecting",
            CONNECTED: "connected",
            DISCONNECTING: "disconnecting",
            DISCONNECTED: "disconnected",
            RECONNECTED: "reconnected",
            ERROR: "error",
            ...CONNECT_STATUS
        }
        this.CLIENTS_STATUS = {}
        this.ERROR_MESSAGE = {
            CODE: -99,
            MESSAGE: {
                en: "Database error",
                vi: "Mongo loi roi ae oi"
            }
        }
        this.HANDLE_TIMEOUT_IN_MS=5000
        this.timeoutId = null;
        this.TRACKING_MODE = TRACKING_MODE
        this.connectAll()
        this.databaseName = this.constructor.name
    }

    setClient(clientName, client) {
        this.clients[clientName] = client
    }
    setClientStatus(clientName, status) {
        this.CLIENTS_STATUS[clientName] = status
        return this
    }
    setIsConnected(boolean) {
        this.isConnected = boolean
    }

    getInstance() {
        return this
    }
    getClient(clientName = "") {
        const lowerCaseName = this.validator
            .isParamEmpty(clientName)
            .setString(clientName)
            .setTitle(clientName)
            .isExist()
            .getLowerCaseString()


        return this.clients[lowerCaseName]
    }
    getClients() {
        return this.clients
    }
    getClientsName() {
        this.validator.isEmpty()

        return Object.keys(this.clients)
    }
    getAllClientStatus() {
        return this.CLIENTS_STATUS
    }

    connect(clientName = "", uri) {
        if (this.isConnected) {
            console.log("Already connected")
            return
        }

        return this.validator
            .isParamEmpty(clientName, uri)
            .setString(clientName)
            .isDuplicate()
            .getLowerCaseString()
    }
    connectAll() {
        if (this.isConnected) {
            console.log("Already connected")
            return this
        }

        // new Mongo() => CurrentClass = Mongo
        const CurrentClass = this.constructor

        Object.keys(CurrentClass.URIs).forEach(
            clientName => this.connect(clientName, CurrentClass.URIs[clientName])
        )

        const clients = this.getClients()
        this.validator.setObject(clients)
        this.setIsConnected(true)
    }
    disconnect(clientName = "") {
        return this.validator
            .isParamEmpty(clientName)
            .setString(clientName)
            .isEmpty()
            .isExist()
            .getLowerCaseString()
    }

    handleEventConnect(clientName = "", client = {}) {

        client.on(this.CONNECT_STATUS.CONNECTED, () => {
            console.log(`${this.databaseName} - ${clientName}: Connected!`)
            clearTimeout(this.timeoutId)
            this.setClientStatus(clientName, this.CONNECT_STATUS.CONNECTED)
            this.trackingDatabaseStatus()
        })
        client.on(this.CONNECT_STATUS.DISCONNECTED, () => {
            console.log(`${this.databaseName} - ${clientName}: Disconnected, Bye bye`)
            clearTimeout(this.timeoutId)
            this.setClientStatus(clientName, this.CONNECT_STATUS.DISCONNECTED)
            this.trackingDatabaseStatus()
        })
        client.on(this.CONNECT_STATUS.DISCONNECTING, () => {
            console.log(`${this.databaseName} - ${clientName}: Disconnecting`)
            this.setClientStatus(clientName, this.CONNECT_STATUS.DISCONNECTING)
        })
        client.on(this.CONNECT_STATUS.RECONNECTED, () => {
            console.log(`${this.databaseName} - ${clientName}: Reconnected!`);
            this.handleTimeoutError()
        });
        client.on(this.CONNECT_STATUS.ERROR, (error) => {
            console.log(`${this.databaseName.toUpperCase()} ERROR AT ${clientName}: `, error)
            this.handleTimeoutError()
        })
    }
    handleTimeoutError() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }

        this.timeoutId = setTimeout(() => {
            throw new Error(`${this.databaseName} - CODE:${this.ERROR_MESSAGE.CODE} | MSG: ${this.ERROR_MESSAGE.MESSAGE.en}`)
        }, this.HANDLE_TIMEOUT_IN_MS)
    }

    trackingDatabaseStatus() {
        if (!this.TRACKING_MODE) return
        const clientStatus = this.getAllClientStatus()
        console.log(clientStatus)

        return this
    }
    printClientStatusTable() {
        const clientStatus = this.getAllClientStatus()

        const rightLine = '='.repeat(10)
        const leftLine = '='.repeat(40);
        const title = this.constructor.name.replace("Init", "");
        const header = rightLine + title + leftLine
        const tableHeader = 'DATABASE'.padEnd(35) + 'STATUS';
        const separator = '-'.repeat(55);

        console.log(header)
        console.log(tableHeader);
        console.log(separator);

        Object.keys(clientStatus).forEach(name => {
            console.log(name.padEnd(35) + clientStatus[name]);
        });

        console.log(separator);

        return this
    }
}