'use strict';

const amqp = require('amqplib/callback_api');
const logger = require('../logger.js')();
const eventEmitter = require('events').EventEmitter;

var that;

function Consumer(url, exchanges, handlers) {
    that = this;
    that.url = url;
    that.exchanges = exchanges || [];
    that.handlers = handlers || [];
}

Consumer.prototype.start = () => {
    amqp.connect(that.url, (err, connection) => {
        if (err) { return logger.error(err); }

        connection.createChannel((err, channel) => {
            if (err) { return logger.error(err); }

            connectToExchanges(channel, that.exchanges, that.handlers);
        });
    });
};

function connectToExchanges(channel, exchanges, handlers) {
    exchanges.forEach(exchange => {
        channel.assertExchange(exchange.name, exchange.type, exchange.options);

        //queue will have automatically generated random name
        channel.assertQueue(null, { exclusive: true }, (err, q) => {
            logger.info(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

            channel.bindQueue(q.queue, exchange.name, '');

            handlers.forEach((handler) => {
                channel.consume(q.queue, handler, { noAck: true });
            });
        });

    });

}

module.exports = Consumer;
