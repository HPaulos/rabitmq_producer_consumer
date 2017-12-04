(function () {
    'use strict';

    const amqp = require('amqplib/callback_api');
    const logger = require('../logger.js')();

    var that;

    function Reader(url, queueName, messageHandler) {
        that = this;
        that.url = url;
        that.queueName = queueName;
        that.messageHandler = messageHandler;
    }

    Reader.prototype.start = () => {
        amqp.connect(that.url, onConnect);
    };

    function onConnect(err, connection) {
        if (err) { logger.error(err); return; }

        connection.createChannel((err, channel) => {
            if (err) { logger.error(err); return; }

            channel.assertQueue(that.queueName, { durable: false });
            channel.consume(that.queueName, that.messageHandler, { noAck: true });
        });
    }

    module.exports = Reader;
})();



