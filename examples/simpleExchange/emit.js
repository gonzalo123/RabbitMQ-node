#!/usr/bin/env node
var builder = require('../../src/Builder');

var server = {
    host: 'localhost',
    port: 5672,
    user: 'guest',
    pass: 'guest'
};

var exchange = builder.exchange('process.log', server);

exchange.emit("xxx.log", "aaaa");
exchange.emit("xxx.log", ["11", "aaaa"]);
exchange.emit("yyy.log", "aaaa");