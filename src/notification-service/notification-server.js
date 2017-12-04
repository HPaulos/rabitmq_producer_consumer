
(function () {
    'use strict';

    const express = require('express');
    const socketIo = require('socket.io');
    const http = require('http');
    const routes = require('./routes.js');

    var that;

    function NotificationServer(portNumber) {
        that = this;
        that.portNumber = portNumber;
        that.namespaces = {};
    }

    NotificationServer.prototype.start = () => {
        that.app = express();
        that.httpServer = http.createServer(that.app);
        that.io = socketIo(that.httpServer);

        that.app.use(routes);
        that.httpServer.listen(that.portNumber, () => { });
    };

    NotificationServer.prototype.createNamespace = (namespace) => {
        var nsp = that.io.of('/' + namespace);
        nsp.on('connection', (socket) => { that.namespaces[namespace] = socket; });
    };

    NotificationServer.prototype.notify = (namespace, eventName, message) => {
        var socket = that.namespaces[namespace];
        socket.emit(eventName, message);
    };

    module.exports = NotificationServer;
})();
