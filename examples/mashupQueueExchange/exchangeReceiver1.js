#!/usr/bin/env node
var builder = require('../../src/Builder');

var server = {
    host: 'localhost',
    port: 5672,
    user: 'guest',
    pass: 'guest'
};

var exchange = builder.exchange('process.log', server);

exchange.receive("exchange.start", function (routingKey, data) {
    console.log(routingKey, data);
});