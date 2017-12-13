const amqp = require('amqplib/callback_api');
const logger = require('../logger.js')();
const config = require('../../config/config.js');

var that;

function Publisher() {
    that = this;

    amqp.connect(config.rmqURL, (err, connection) => {
        connection.createChannel((err, channel) => {
            that.channel = channel;
        });
    });
}

Publisher.prototype.publish = (message) => {
    console.log("before publishing: ", message);
    that.channel.assertExchange(message.exchange.name, message.exchange.type, { durable: message.exchange.durable ? true : false });
    that.channel.publish(message.exchange.name, message.exchange.room, new Buffer(message.content));
};

module.exports = Publisher;