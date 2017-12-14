module.exports = {
    exchanges: [
        {
            name: 'task_list',
            type: 'fanout',
            options: {
                durable: false
            }
        },
        {
            name: 'task',
            type: 'fanout',
            options: {
                durable: false
            }
        }
    ],
    notificationServerPortNumber: 3000,
    rmqURL: 'amqp://guest:guest@localhost',
};