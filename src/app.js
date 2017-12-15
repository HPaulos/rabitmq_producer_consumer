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

notificationServer.on('subscription', (namespace, room) => {
    console.log("Subsscription Event Fired for %s in %s room", namespace, room);
});

notificationServer.on('unsubscription', (namespace, room) => {
    console.log("UnSubsscription Event Fired for %s in %s room", namespace, room);
});

notificationServer.on('disconnection', () => {
    console.log("Disconnection Event Fired");
});

const url = config.rmqURL;
const notificationReader = new NotificationReader(url, config.exchanges, [messageHandler]);
notificationReader.start();

function messageHandler(message) {
    var namespace = message.fields.exchange;
    var room = message.fields.routingKey;
    var messageToBeSent = { headers: message.properties.headers, body: JSON.parse(message.content) };
    notificationServer.sendMessage(namespace, room, messageToBeSent);
}
