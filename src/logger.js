(function () {
    'use strict';
    const winston = require('winston');
    winston.addColors({
        silly: 'magenta',
        debug: 'blue',
        verbose: 'cyan',
        info: 'green',
        warn: 'yellow',
        error: 'red'
    });

    function Logger() {
    }

    Logger.prototype.info = (...info) => {
        winston.info(...info);
    };

    Logger.prototype.error = (...error) => {
        winston.error(...error);
    };

    Logger.prototype.silly = (...message) => { 
        winston.silly(...message);
    };

    module.exports = (arg) => { return new Logger(); };
})();
