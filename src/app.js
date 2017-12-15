'use strict';

const config = require('../config/config.js');
const NotificationServer = require('./notification-server/notification-server');
const NotificationReader = require('./consumer/consumer');
const logger = require('./logger.js')();
const Subscriber = require('./subscriber/subscriber');
const notificationServerPortNumber = config.notificationServerPortNumber;

const url = config.rmqURL;

//Consumer 
const notificationReader = new NotificationReader(url, config.exchanges, [messageHandler]);
notificationReader.start();
const subscriber = new Subscriber(notificationReader);

//Notification Service
const notificationServer = new NotificationServer(notificationServerPortNumber);

notificationServer.start();

config.exchanges.forEach((exchange) => {
    logger.info("setting up %s namespace", exchange.name);
    notificationServer.createNamespace(exchange.name);
});

notificationServer.on('subscription', (context) => {
    subscriber.subscribeForMessage(context, [messageHandler]);
    console.log("Subsscription Event Fired for %s in %s room", context);
});

notificationServer.on('unsubscription', (namespace, room) => {
    console.log("UnSubsscription Event Fired for %s in %s room", namespace, room);
});

notificationServer.on('disconnection', () => {
    console.log("Disconnection Event Fired");
});

function messageHandler(message) {
    var namespace = message.fields.exchange;
    var room = message.fields.routingKey;
    var messageToBeSent = { headers: message.properties.headers, body: JSON.parse(message.content) };
    console.log("The message from handlere before sending.........");
    notificationServer.sendMessage(namespace, room, messageToBeSent);
}
