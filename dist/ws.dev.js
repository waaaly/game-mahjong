"use strict";

var ws = require('socket-io');

var wss = new ws.Server({
  port: 912
});
var userList = [];

function cerateUser() {
  wss.clients.forEach(function (item, index) {});
}

wss.on('connection', function (ws) {
  wss.clients.forEach(function (item, index) {
    console.log(item.id, index);
  });
});
console.log('ws 启动成功：ws://192.168.91.3:912');