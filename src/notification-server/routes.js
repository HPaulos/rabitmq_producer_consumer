'use strict';

const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');
const logger = require('../logger.js')();
const Publisher = require('../publisher/publisher');
const getRoomName = require('../mapper/room-mapper');
const getExchangeContextFromNameSpaceContext = require('../mapper/namespace-exchange-mapper');


router.use(bodyParser.json());
router.use(express.static(path.join(__dirname, '/public')));

var publisher = new Publisher();

router.get("/", (req, res) => {
    logger.info('serving index.html...');
    res.sendFile(__dirname + '/index.html');
});

router.post('/message', (req, res) => {
    let namespaceContext = { name: req.body.name, room: getRoomName(req.body) };
    let exchange = getExchangeContextFromNameSpaceContext(namespaceContext);
    var message = {
        content: req.body.content || "{}",
        exchange: {
            name: exchange.name,
            key: exchange.key,
            type: 'fanout',
            durable: true
        }
    };

    publisher.publish(message);
    console.log(message);
    res.sendStatus(200);
});

module.exports = router;
