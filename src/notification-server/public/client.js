var namespaces = {};

function connectAndSubscribe(url, context, onMessageReceived) {
    var namespace = io.connect(url + "/" + context.name);
    namespaces[context.name] = namespace;
    namespace.emit('subscribe', context.id);

    namespace.on('message', onMessageReceived);

    return namespace;
}

function unsubscribe(context) {
    var namespace = namespaces[context.name];
    namespace.disconnect();
}