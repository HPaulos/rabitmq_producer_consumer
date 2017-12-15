'use strict';

const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');
const logger = require('../logger.js')();
const Publisher = require('../publisher/publisher');
const contextMapper = require('../mapper/context-mapper');

router.use(bodyParser.json());
router.use(express.static(path.join(__dirname, '/public')));

var publisher = new Publisher();

router.get("/", (req, res) => {
    logger.info('serving index.html...');
    res.sendFile(__dirname + '/index.html');
});

router.post('/message', (req, res) => {
    var message = {
        content: req.body.content || "{}",
        exchange: {
            room: contextMapper(req.body),
            name: req.body.name,
            type: 'fanout',
            durable: false
        }
    };

    publisher.publish(message);
    console.log(message);
    res.sendStatus(200);
});

module.exports = router;
