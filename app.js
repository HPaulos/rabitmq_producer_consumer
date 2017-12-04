(function () {
    'use strict';

    const config = require('./config/config.js');
    const NotificationServer = require('./src/notification-service/notification-server');
    const NotificationReader = require('./src/notification-reader/reader.js');

    const portNumber = config.notificationServerPortNumber;
    const notificationServer = new NotificationServer(portNumber);
    notificationServer.start();

    config.namespaceList.forEach((namespace) => {
        notificationServer.createNamespace(namespace);
    });

    const url = config.rmqURL;
    const queueName = config.queueName;
    const notificationReader = new NotificationReader(url, queueName, messageHandler);
    notificationReader.start();

    function messageHandler(message) {
        var messageObject = JSON.parse(message.content);
        notificationServer.notify(messageObject.type, messageObject.id, messageObject);
    }
})();
