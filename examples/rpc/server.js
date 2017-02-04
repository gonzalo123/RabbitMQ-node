#!/usr/bin/env node
var builder = require('../../src/Builder');

var server = {
    host: 'localhost',
    port: 5672,
    user: 'guest',
    pass: 'guest'
};

var rpc = builder.rpc('rpc.hello', server);

rpc.server(function (name, surname) {
    builder.exchange('process.log', server).emit("rpc.start", 'rpc.hello', false);
    var out = "Hello " + name + " " + surname;
    builder.exchange('process.log', server).emit("rpc.finish", 'rpc.hello', false);

    return out;
});