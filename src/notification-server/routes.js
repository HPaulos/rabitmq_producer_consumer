'use strict';

const express = require("express");
const logger = require('../logger.js')();
const router = express.Router();
const bodyParser = require('body-parser');
const Publisher = require('../publisher/publisher');

router.use(bodyParser.json())
var publisher = new Publisher();


router.get("/", (req, res) => {
    logger.info('serving index.html...');
    res.sendFile(__dirname + '/index.html');
});

router.post('/message', (req, res) => {
    var message = {
        content: req.body.content || "{}",
        exchange: {
            room: req.body.id,
            name: req.body.type,
            type: 'fanout',
            durable: false
        }
    };

    publisher.publish(message);
    console.log(message);
    res.sendStatus(200);
});

module.exports = router;
