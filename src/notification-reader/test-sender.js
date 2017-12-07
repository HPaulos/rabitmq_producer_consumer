(
    function () {
        const amqp = require('amqplib/callback_api');
        const logger = require('../logger.js')();
        const config = require('../../config/config.js');

        amqp.connect(config.rmqURL, function (err, conn) {
            conn.createChannel(function (err, ch) {
                var ex = config.exchangeName;
                var exchangeType = config.exchangeType;
                ch.assertExchange(ex, exchangeType, { durable: false });
                readInput(ch, ex);
            });
        });

        function readInput(ch, ex) {
            const readline = require('readline');
            var type, identifer, message;
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            console.log(' [x] Use ctrl c to stop it');
            rl.question('Enter message type(namespace): ', (answer) => {
                type = answer;
                rl.question('Enter message identifier(event name): ', (answer) => {
                    identifer = answer;
                    rl.question('Enter message: ', (answer) => {
                        var msg = { message: answer };
                        var options = { headers: { type: type, identifer: identifer } };
                        ch.publish(ex, '', new Buffer(JSON.stringify(msg)), options);
                        process.stdout.write("\u001b[2J\u001b[0;0H");
                        console.log(" [x] Sent %s with options [%s]", JSON.stringify(msg.message), JSON.stringify(options));
                        readInput();
                    });
                });
            });

        }

    }
)();
