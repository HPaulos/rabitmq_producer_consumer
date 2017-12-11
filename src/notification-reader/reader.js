'use strict';

const amqp = require('amqplib/callback_api');
const logger = require('../logger.js')();
const eventEmitter = require('events').EventEmitter;

var that;

function Reader(url, exchangeName, exchangeType, messageHandler) {
    that = this;
    that.url = url;
    that.exchangeName = exchangeName;
    that.exchangeType = exchangeType;
    that.messageHandler = messageHandler;
}

Reader.prototype.start = () => {
    amqp.connect(that.url, onConnect);
};

function onConnect(err, connection) {
    if (err) { return logger.error(err); }
    connection.createChannel( onChannelCreated);
}

function onChannelCreated(err, channel) {
    if (err) { return logger.error(err); }

    channel.assertExchange(that.exchangeName, that.exchangeType, { durable: false });
    //queue will have automatically generated random name
    channel.assertQueue('', { exclusive: true }, (err, q) => {
        logger.info(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
        channel.bindQueue(q.queue, that.exchangeName, '');
        channel.consume(q.queue, that.messageHandler, { noAck: true });
    });
}

module.exports = Reader;
