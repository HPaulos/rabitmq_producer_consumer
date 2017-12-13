module.exports = {
    exchanges: [
        {
            name: 'hello',
            type: 'fanout',
            options: {
                durable: false
            }
        },
        {
            name: 'hello2',
            type: 'fanout',
            options: {
                durable: false
            }
        }
    ],
    notificationServerPortNumber: 3000,
    exchangeName: 'hello',
    exchangeType: 'fanout',
    rmqURL: 'amqp://guest:guest@localhost',
    namespaceList: ['patient_milestone_update', 'patient_added']
};