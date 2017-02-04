#!/usr/bin/env node
var builder = require('../../src/Builder');

var server = {
    host: 'localhost',
    port: 5672,
    user: 'guest',
    pass: 'guest'
};

var queue = builder.queue('queue', server);

queue.emit({aaa: 1});
queue.emit({aaa: 2});
queue.emit({aaa: 3});