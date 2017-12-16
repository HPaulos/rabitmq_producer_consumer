'use strict';

const amqp = require('amqplib/callback_api');
const EventEmitter = require('events').EventEmitter;

const logger = require('../logger.js')();
const util = require('util');

var that;

util.inherits(Consumer, EventEmitter);

function Consumer(url, exchanges) {
    that = this;
    that.url = url;
    that.exchanges = exchanges || [];
}

Consumer.prototype.start = () => {
    that.connection = new Promise((resolve, reject) => {
        amqp.connect(that.url, (err, connection) => {
            if (err) { reject(err).catch((err) => logger.error(err)); }
            resolve(connection);
        });
    });
};

Consumer.prototype.subscribe = async (exchangeContext, handlers) => {
    let aConnection = await that.connection;

    let exchange = that.getExchangeConfig(exchangeContext.name);
    let routingKey = exchangeContext.key;
    
    aConnection.createChannel((err, channel) => {
        channel.assertExchange(exchange.name, exchange.type, exchange.options);

        //queue will have automatically generated random name
        channel.assertQueue(null, { exclusive: true }, (err, q) => {
            channel.bindQueue(q.queue, exchange.name);
            
            handlers.forEach((handler) => {
                channel.consume(q.queue, handler, { noAck: true });
            });
        });
    });
};

Consumer.prototype.getExchangeConfig = (name) => {
    let found;
    
    for (let exchange of that.exchanges) {
        if (exchange.name === name) {
            found = exchange;
            break;
        }
    };
    
    return found;
};

module.exports = Consumer;
