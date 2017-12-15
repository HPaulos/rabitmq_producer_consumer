module.exports = {
    namespaceToExchangeMap: {
        TaskList: 'TaskList',
        Task: 'Task'
    },
    exchanges: [
        {
            name: 'TaskList',
            type: 'fanout',
            options: {
                durable: true,
                autoDelete: true
            }
        },
        {
            name: 'Task',
            type: 'fanout',
            options: {
                durable: true,
                autoDelete: true
            }
        }
    ],
    notificationServerPortNumber: 3000,
    rmqURL: 'amqp://guest:guest@localhost',
};