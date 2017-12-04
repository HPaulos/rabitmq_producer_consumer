(function () {
    'use strict';
    
    function Logger() {
    }

    Logger.prototype.info = (info) => {
        console.log(info);
    };

    Logger.prototype.error = (error) => {
        console.log(error);
    };

    module.exports = (arg) => { return new Logger(); };
})();
