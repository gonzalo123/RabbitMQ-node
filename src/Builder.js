var defaults = {
    queue: {
        queue: {
            passive: false,
            durable: true,
            exclusive: false,
            autoDelete: false,
            nowait: false
        },
        consumer: {
            noLocal: false,
            noAck: false,
            exclusive: false,
            nowait: false
        }
    },
    exchange: {
        exchange: {
            passive: false,
            durable: true,
            autoDelete: true,
            internal: false,
            nowait: false,
        },
        queue: {
            passive: false,
            durable: true,
            exclusive: false,
            autoDelete: true,
            nowait: false,
        },
        consumer: {
            noLocal: false,
            noAck: false,
            exclusive: false,
            nowait: false,
        },
    },
    rpc: {
        queue: {
            passive: false,
            durable: true,
            exclusive: false,
            autoDelete: true,
            nowait: false,
        },
        consumer: {
            noLocal: false,
            noAck: false,
            exclusive: false,
            nowait: false,
        },
    }
};

module.exports = {
    queue: function (name, server) {
        var conf = defaults['queue'];
        conf['server'] = server;
        return require('./Queue')(name, conf);
    },
    exchange: function (name, server) {
        var conf = defaults['exchange'];
        conf['server'] = server;
        return require('./Exchange')(name, conf);
    },
    rpc: function (name, server) {
        var conf = defaults['rpc'];
        conf['server'] = server;
        return require('./RPC')(name, conf);
    }
};