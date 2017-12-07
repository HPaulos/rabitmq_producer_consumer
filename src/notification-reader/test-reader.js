(
    function () {
        const config = require('../../config/config.js');
        const NotificationReader = require('./reader.js');

        const url = config.rmqURL;
        const exchangeName = config.exchangeName, exchangeType = config.exchangeType;

        const messageHandler = function (msg) {
            console.log("Message with type: %s, identifier: %s, content: %s received",
                msg.properties.headers.type, msg.properties.headers.identifer, msg.content);
        };

        const notificationReader = new NotificationReader(url, exchangeName, exchangeType, messageHandler);
        notificationReader.start();
    }
)();
