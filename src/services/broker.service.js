import BaseService from "./base.service.js";
import amqplib from "amqplib";

export default new class BrokerService extends BaseService {
    constructor() {
        super()
        this.EXCHANGE_PREFIX_KEY = "exchange"
        this.QUEUE_PREFIX_KEY = "queue"
        this.client = null
        this.channel = null
    }

    async connect() {
        const connection = await amqplib.connect("amqp://localhost:5672")
        this.client = connection
        this.channel = await connection.createChannel()

        return this
    }
    async disconnect() {
        await this.client.close()
    }
    assertExchange({exchangeKey, type, option = {durable: true}} = {}) {
        if (!type) throw Error("Type not found")
        const channel = this.getChannel()
        const exchangeName = `${this.EXCHANGE_PREFIX_KEY}:${exchangeKey}`.toLowerCase()
        channel.assertExchange(exchangeName, type, option)
        return this
    }
    assertQueue({name, option = {exclusive: true}} = {}) {
        if (!name) throw Error("Queue name not found")
        const channel = this.getChannel()
        const queueName = `${this.QUEUE_PREFIX_KEY}:${name}`.toLowerCase()
        channel.assertQueue(queueName, option)
        return this
    }
    bindQueue({key: {exchange = "", queue = ""}, routingKey = ""} = {}) {
        if (!exchange) throw Error("Exchange name not found")
        if (!queue) throw Error("Queue key name found")

        const channel = this.getChannel()
        const queueName = `${this.QUEUE_PREFIX_KEY}:${queue}`.toLowerCase()
        const exchangeName = `${this.EXCHANGE_PREFIX_KEY}:${exchange}`.toLowerCase()

        channel.bindQueue(queueName, exchangeName, routingKey);

        return this
    }
    publishMessage({exchangeKey, routingKey = "", message} = {}) {
        if (!exchangeKey) throw Error("Exchange name not found")


        const channel = this.getChannel()
        const exchangeName = `${this.EXCHANGE_PREFIX_KEY}:${exchangeKey}`.toLowerCase()
        channel.publish(exchangeName, routingKey, Buffer.from(message));
        return this
    }
    async createPublisher({ exchangeKey = "", type = ""} = {}) {
        if (!type) throw Error("Type not found")

        await this.connect()
        this.assertExchange({exchangeKey, type})

    }
    async createConsumer({key: {exchange = "", queue = ""}, type = "", routingKey = "", callback}) {
        if (!type) throw Error("Type not found")
        await this.connect()
        this.assertExchange({exchangeKey: exchange, type})
            .assertQueue({name: queue})
            .bindQueue({key: {exchange, queue}, routingKey})
            .consumeMessage({name: queue, callback})
    }
    async sendMessage({ exchangeKey = "", routingKey = "", message = ""} = {}) {
        this.publishMessage({
            exchangeKey, routingKey, message
        })
    }
    consumeMessage({name, option = {noAck: true}, callback} = {}) {
        if (!name) throw Error("Binding name key not found")
        const channel = this.getChannel()
        const queueName = `${this.QUEUE_PREFIX_KEY}:${name}`.toLowerCase()

        channel.consume(queueName, msg => {
            if (msg !== null) {
                const decoded = msg.content.toString()
                callback?.(decoded)
            }
        }, option);
    }

    getChannel() {
        return this.channel
    }
}