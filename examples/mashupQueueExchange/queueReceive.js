#!/usr/bin/env node
var builder = require('../../src/Builder');

var server = {
    host: 'localhost',
    port: 5672,
    user: 'guest',
    pass: 'guest'
};

var queue = builder.queue('queue', server);

queue.receive(function (data, queueName) {
    builder.exchange('process.log', server).emit("exchange.start", queueName, false);
    console.log(data);
    builder.exchange('process.log', server).emit("exchange.finish", queueName, false);
});