import DatabaseValidator from "../validators/database.validator.js";
import sleep from "../helpers/sleep.js";

export default class Init {
    constructor({ CONNECT_STATUS = {}, TRACKING_MODE = false} = {}) {
        this.validator = new DatabaseValidator()
        this.isConnectedAll = false
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
        this.databaseName = this.constructor.name
        this.RETRY_CLIENT = {}
        this.RETRY_CLIENTS_STATUS = {}
        this.RETRY_MAXIMUM = 10
        this.RETRY_PER_MS = 2500
        this.RETRY_FLAG = false
        this.connectAll()
    }

    setClient(clientName, client) {
        return this.clients[clientName] = client
    }
    setClientStatus(clientName, status) {
        this.CLIENTS_STATUS[clientName] = status
        return this
    }
    setIsAllConnected() {
        const allStatus = this.getAllClientStatus()
        this.isConnectedAll = Object.values(allStatus).find(status => status === this.CONNECT_STATUS.DISCONNECTED || status === this.CONNECT_STATUS.ERROR);
    }
    setRetryClient(clientName) {
        const clients = this.getRetryClients(clientName)
        if (!clients[clientName]) {
            clients[clientName] = 1
        } else {
            ++clients[clientName]
        }
    }
    setRetryClientStatus(clientName, status = false) {
        return this.RETRY_CLIENTS_STATUS[clientName] = status
    }
    setRetryFlag() {
        const retryClientsStatus = this.getRetryClientsStatus()
        this.RETRY_FLAG = new Set(Object.values(retryClientsStatus)).size <= 1
    }
    resetRetryClient(clientName) {
        const clients = this.getRetryClients(clientName)
        return clients[clientName] = 1
    }
    setSuccessRetry(clientName) {
        const isClientRetrying = this.getRetryClientStatus(clientName)
        if (!isClientRetrying) return;


        this.setRetryFlag()
        this.resetRetryClient(clientName)
        this.setRetryClientStatus(clientName)
    }
    setFailedRetry(clientName, error) {
        this.handleTimeoutError(clientName, error)
        this.resetRetryClient(clientName)
        this.resetRetryClient(clientName)
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
    getClientName(clientName = "") {
        return this.validator
            .setString(clientName)
            .getLowerCaseString()
    }
    getClientStatus(clientName = "") {
        const lowerCaseName = this.validator
            .isParamEmpty(clientName)
            .setString(clientName)
            .setTitle(clientName)
            .isExist()
            .getLowerCaseString()

        return this.CLIENTS_STATUS[lowerCaseName];
    }
    getAllClientStatus() {
        return this.CLIENTS_STATUS
    }
    getRetryClient(clientName) {
        return this.RETRY_CLIENT[clientName]
    }
    getRetryClients() {
        return this.RETRY_CLIENT
    }
    getRetryClientStatus(clientName) {
        return this.RETRY_CLIENTS_STATUS[clientName]
    }
    getRetryClientsStatus() {
        return this.RETRY_CLIENTS_STATUS
    }
    getMaximumRetry() {
        return this.RETRY_MAXIMUM
    }
    getRetryPerMs() {
        return this.RETRY_PER_MS
    }
    getRetryFlag() {
        return this.RETRY_FLAG
    }
    getClientURI(clientName = "") {
        const ClassName = this.constructor
        return ClassName.URIs[clientName];
    }

    connect(clientName = "", uri) {
        if (this.isConnectedAll) {
            console.log("Already connected")
            return
        }

        return this.validator
            .isParamEmpty(clientName, uri)
            .setString(clientName)
            .getLowerCaseString()
    }
    connectAll() {
        if (this.isConnectedAll) {
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
        this.setIsAllConnected()
    }
    disconnect(clientName = "") {
        return this.validator
            .isParamEmpty(clientName)
            .setString(clientName)
            .isEmpty()
            .isExist()
            .getLowerCaseString()
    }
    async retry(clientName, retryTime = 3, delay = 5000, error) {
        const RETRY_PER_SEC = this.getRetryPerMs()
        const isClientRetrying = this.getRetryClientStatus(clientName)
        const isRetry = this.getRetryFlag()

        await sleep(RETRY_PER_SEC)

        const URI = this.getClientURI(clientName)
        const retryCount = this.getRetryClient(clientName)

        if (isRetry) {
            console.log("All client retried")
            return
        }

        // one or more clients in the clients list retried success
        if (!isClientRetrying) {
            console.log(`client ${clientName} - retry success`)
            return
        }

        // one or more clients in the clients list retried failed
        if (retryTime < retryCount) {
            console.log("All client are but there are some still error")
            this.setFailedRetry(clientName, error)
        }

        console.log(`${clientName} - RETRY ${retryCount}`)
        await this.connect(clientName, URI)
        await this.retry(clientName, retryTime, delay, error)
    }


    handleEventConnect(clientName = "", client = {}) {
        const MAXIMUM_RETRY = this.getMaximumRetry()
        const DELAY_PER_RETRY = this.getRetryPerMs()
        const isClientRetrying = this.getRetryClientStatus(clientName)

        client.on(this.CONNECT_STATUS.CONNECTED, () => {
            console.log(`${this.databaseName} - ${clientName}: Connected!`)
            clearTimeout(this.timeoutId)

            this.setClientStatus(clientName, this.CONNECT_STATUS.CONNECTED)
            this.trackingDatabaseStatus()
            this.setSuccessRetry(clientName)
        })
        client.on(this.CONNECT_STATUS.DISCONNECTED, async () => {
            if (isClientRetrying) return
            this.setRetryClientStatus(clientName, true)

            console.log(`${this.databaseName} - ${clientName}: Disconnected, Bye bye`)
            this.setClientStatus(clientName, this.CONNECT_STATUS.DISCONNECTED)
            this.trackingDatabaseStatus()

            await this.retry(clientName, MAXIMUM_RETRY, DELAY_PER_RETRY, "Cant connect")
        })
        client.on(this.CONNECT_STATUS.DISCONNECTING, () => {
            console.log(`${this.databaseName} - ${clientName}: Disconnecting`)
            this.setClientStatus(clientName, this.CONNECT_STATUS.DISCONNECTING)
        })
        client.on(this.CONNECT_STATUS.RECONNECTED, async () => {
            console.log(`${this.databaseName} - ${clientName}: Reconnected!`);
            this.setClientStatus(clientName, this.CONNECT_STATUS.RECONNECTED)

        });
        client.on(this.CONNECT_STATUS.ERROR, async (error) => {
            if (isClientRetrying) return
            this.setRetryClientStatus(clientName, true)
            console.log(`${this.databaseName.toUpperCase()} ERROR AT ${clientName}: `, error)
        })
    }
    handleTimeoutError(clientName = "", message) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }

        this.timeoutId = setTimeout(() => {
            throw new Error(`${this.databaseName} > ${clientName} - CODE:${this.ERROR_MESSAGE.CODE} | MSG: ${this.ERROR_MESSAGE.MESSAGE.en} | MSG-LIB: ${message}`)
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