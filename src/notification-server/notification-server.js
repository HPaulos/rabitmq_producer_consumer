
'use strict';

const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const routes = require('./routes.js');
const logger = require('../logger.js')();

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
    logger.info('creating namespace %s...', namespace);
    var nsp = that.io.of('/' + namespace);
    that.namespaces[namespace] = nsp;

    nsp.on('connection', (socket) => {
        logger.info('connecting client to namespace...');

        socket.on('subscribe', (room) => {
            if (room) {
                logger.info('subscribing to room %s...', room);
                socket.join(room);
            }            
        });

        socket.on('unsubscribe', (room) => {
            logger.info('unsubscribing from room %s...', room);
            socket.leave(room);
        });
    });

    nsp.on('disconnect', () => {
        logger.info('disconnecting client...', room);
    });
};

NotificationServer.prototype.notify = (namespace, room, eventName, message) => {
    logger.info('sending to %s type message to %s namespace ', eventName, namespace | "");

    if (!namespace) {
        return that.io.emit(eventName, message);
    }

    var socket = that.namespaces[namespace];

    if (!socket) {
        return logger.error(namespace + ' namespace is not found.');
    }

    if (room) {
        socket.in(room).emit(eventName, message);
    } else {
        socket.emit(eventName, message);
    }

};

module.exports = NotificationServer;
