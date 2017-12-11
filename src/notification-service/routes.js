'use strict';

const express = require("express");
const logger = require('../logger.js')();

const router = express.Router();

router.get("/", (req, res) => {
    logger.info('serving index.html...');
    res.sendFile(__dirname + '/index.html');
});

module.exports = router;
