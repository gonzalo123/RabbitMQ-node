var amqp = require('amqplib/callback_api');

var Exchange = function (name, conf) {
    return {
        emit: function (routingKey, data, close = true) {
            amqp.connect(`amqp://${conf.server.user}:${conf.server.pass}@${conf.server.host}:${conf.server.port}`, function (err, conn) {
                conn.createChannel(function (err, ch) {
                    var msg = JSON.stringify(data);
                    ch.assertExchange(name, 'topic', conf.exchange);
                    ch.publish(name, routingKey, new Buffer(msg));
                });
                if (close) {
                    setTimeout(function () {
                        conn.close();
                        process.exit(0)
                    }, 500);
                }
            });
        },
        receive: function (bindingKey, callback) {
            amqp.connect(`amqp://${conf.server.user}:${conf.server.pass}@${conf.server.host}:${conf.server.port}`, function (err, conn) {
                conn.createChannel(function (err, ch) {
                    ch.assertExchange(name, 'topic', conf.exchange);
                    console.log(new Date().toString() + ' Exchange ' + name + ' initialized');
                    ch.assertQueue('', conf.queue, function (err, q) {

                        ch.bindQueue(q.queue, name, bindingKey);

                        ch.consume(q.queue, function (msg) {
                            console.log(new Date().toString(), name, ":", msg.fields.routingKey, "::", msg.content.toString());
                            if (callback) {
                                callback(msg.fields.routingKey, JSON.parse(msg.content.toString()))
                            }
                            if (conf.consumer.noAck === false) {
                                ch.ack(msg);
                            }
                        }, conf.consumer);
                    });
                });
            });
        }
    };
};

module.exports = Exchange;