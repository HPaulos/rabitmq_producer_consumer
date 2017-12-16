'use strict';
const getExchangeContextFromNameSpaceContext = require('../mapper/namespace-exchange-mapper');

var that;

function Subscriber(consumer) {
    that = this;
    that.consumer = consumer;
}

Subscriber.prototype.subscribeForMessage = function (context, handlers) {
    let exchange = getExchangeContextFromNameSpaceContext(context);
    that.consumer.subscribe(context, handlers);
};

module.exports = Subscriber;
