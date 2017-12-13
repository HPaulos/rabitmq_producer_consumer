'use strict';

const config = require('../config/config.js');
const NotificationServer = require('./notification-server/notification-server');
const NotificationReader = require('./consumer/consumer');
const logger = require('./logger.js')();

const portNumber = config.notificationServerPortNumber;
const notificationServer = new NotificationServer(portNumber);
notificationServer.start();

config.exchanges.forEach((exchange) => {
    logger.info("setting up %s namespace", exchange.name);
    notificationServer.createNamespace(exchange.name);
});

const url = config.rmqURL;

const notificationReader = new NotificationReader(url, config.exchanges, [messageHandler]);
notificationReader.start();

function messageHandler(message) {
    var namespace = message.fields.exchange;
    var room = message.fields.routingKey;
    var eventName = message.properties.headers.type || 'unspecified';
    var message = JSON.parse(message.content);
    notificationServer.notify(namespace, room, eventName, message);
}
