module.exports = {
    notificationServerPortNumber: 3000,
    exchangeName: 'hello',
    exchangeType: 'fanout',
    rmqURL: 'amqp://guest:guest@localhost',
    namespaceList: ['patient_milestone_update', 'patient_added']
};