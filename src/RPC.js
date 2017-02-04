var amqp = require('amqplib/callback_api');

var RPC = function (name, conf) {
    var generateUuid = function () {
        return Math.random().toString() +
            Math.random().toString() +
            Math.random().toString();
    };

    return {
        call: function () {
            var params = [];
            for (i = 0; i < arguments.length - 1; i++) {
                params.push(arguments[i]);
            }
            var callback = arguments[arguments.length - 1];

            amqp.connect(`amqp://${conf.server.user}:${conf.server.pass}@${conf.server.host}:${conf.server.port}`, function (err, conn) {
                conn.createChannel(function (err, ch) {
                    ch.assertQueue('', conf.queue, function (err, q) {
                        var corr = generateUuid();

                        ch.consume(q.queue, function (msg) {
                            if (msg.properties.correlationId == corr) {
                                callback(JSON.parse(msg.content.toString()));
                                setTimeout(function () {
                                    conn.close();
                                    process.exit(0)
                                }, 500);
                            }
                        }, conf.consumer);
                        ch.sendToQueue(name,
                            new Buffer(JSON.stringify(params)),
                            {correlationId: corr, replyTo: q.queue});
                    });
                });
            });
        },
        server: function (callback) {
            amqp.connect(`amqp://${conf.server.user}:${conf.server.pass}@${conf.server.host}:${conf.server.port}`, function (err, conn) {
                conn.createChannel(function (err, ch) {
                    ch.assertQueue(name, conf.queue);
                    console.log(new Date().toString() + ' RPC ' + name + ' initialized');
                    ch.prefetch(1);
                    ch.consume(name, function reply(msg) {
                        console.log(new Date().toString(), msg.fields.routingKey, " :: ", msg.content.toString());
                        var response = JSON.stringify(callback.apply(this, JSON.parse(msg.content.toString())));
                        ch.sendToQueue(msg.properties.replyTo,
                            new Buffer(response),
                            {correlationId: msg.properties.correlationId});

                        ch.ack(msg);

                    }, conf.consumer);
                });
            });
        }
    };
};

module.exports = RPC;