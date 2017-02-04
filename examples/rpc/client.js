#!/usr/bin/env node
var builder = require('../../src/Builder');

var server = {
    host: 'localhost',
    port: 5672,
    user: 'guest',
    pass: 'guest'
};

var rpc = builder.rpc('rpc.hello', server);
rpc.call("Gonzalo", "Ayuso", function (data) {
    console.log(data);
});