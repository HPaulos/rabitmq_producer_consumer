'use strict';

const config = require('./config/config.js');
const NotificationServer = require('./src/notification-service/notification-server');
const NotificationReader = require('./src/notification-reader/reader.js');
const logger = require('./src/logger.js')();

const portNumber = config.notificationServerPortNumber;
const notificationServer = new NotificationServer(portNumber);
notificationServer.start();

config.namespaceList.forEach((namespace) => {
    logger.info("setting up %s namespace", namespace);
    notificationServer.createNamespace(namespace);
});

const url = config.rmqURL;
const exchangeName = config.exchangeName;
const exchangeType = config.exchangeType;

const notificationReader = new NotificationReader(url, exchangeName, exchangeType, messageHandler);
notificationReader.start();


function messageHandler(message) {
    var type = message.properties.headers.type;
    var identifier = message.properties.headers.identifer;
    var payload = JSON.parse(message.content);
    notificationServer.notify(type, identifier, payload);
}
