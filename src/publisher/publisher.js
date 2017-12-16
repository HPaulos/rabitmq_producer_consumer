const amqp = require('amqplib/callback_api');
const logger = require('../logger.js')();
const config = require('../../config/config.js');

var that;

function Publisher() {
    that = this;
    that.channel = new Promise((resolve, reject) => {
        amqp.connect(config.rmqURL, (err, connection) => {
            if (err) { return reject(err).catch(that.logError); }

            connection.createChannel((err, channel) => {
                if (err) { return reject(err).catch(that.logError); }
                resolve(channel);
            });
        });
    });
}

Publisher.prototype.publish = async (message) => {
    let channel = await that.channel;
    channel.assertExchange(message.exchange.name, message.exchange.type, { durable: true ,autoDelete: true});
    console.log(message);
    channel.publish(message.exchange.name, message.exchange.key, new Buffer(message.content));
};

Publisher.prototype.logError = (error) => { 
    console.log(error);
};

module.exports = Publisher;