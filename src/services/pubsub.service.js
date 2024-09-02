import Ioredis from "../dbs/init.ioredis.js";

export default new class RedisMessageService extends Ioredis {
    publish(channel = "", payload = {}) {
        const channelName = channel.toLowerCase()
        const publisher = this.getPublisher()

        publisher.publish(channelName, JSON.stringify(payload))

        return this
    }
    subscribe(channel, callback) {
        const channelName = channel.toLowerCase()
        const subscriber = this.getSubscriber()

        subscriber.subscribe(channelName)
        return !callback ? subscriber : subscriber.on('message', callback)
    }
}