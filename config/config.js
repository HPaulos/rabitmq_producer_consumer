module.exports = {
    exchanges: [
        {
            name: 'TaskList',
            type: 'fanout',
            options: {
                durable: false
            }
        },
        {
            name: 'Task',
            type: 'fanout',
            options: {
                durable: false
            }
        }
    ],
    notificationServerPortNumber: 3000,
    rmqURL: 'amqp://guest:guest@localhost',
};