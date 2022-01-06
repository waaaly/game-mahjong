"use strict";

var express = require('express');

var app = new express();
app.use(express["static"](__dirname));

var http = require('http');

var server = http.createServer(app, {
  cors: {
    origin: "*"
  }
});
server.listen('912');

var io = require("socket.io")(server);

var ClientSocket = require("./clientSocket");

var userList = require('./user');

var roomList = require('./roomManager');

io.on('connection', function (cs) {
  var socket = new ClientSocket(cs, userList, roomList, io);
  cs.on('login', function (data) {
    socket.login(data);
  });
  cs.on('create-room', function (data) {
    socket.createRoom(data);
  });
  cs.on('entery-room', function (data) {
    socket.enteryRoom(data);
  });
  cs.on('deal-card', function (data) {
    socket.dealCard(data);
  });
  cs.on('put-in-card', function (data) {
    socket.putInCard(data);
  });
  cs.on('put-out-card', function (data) {
    socket.putOutCard(data);
  });
  cs.on('action-card', function (data) {
    socket.actionCard(data);
  });
});
console.log('服务启动成功：http://192.168.91.3:912');