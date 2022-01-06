"use strict";

var Room = require('./room');

var io = require('./server');

function Log(msg, arr) {
  console.log(msg, arr.length);
  arr.forEach(function (item) {
    console.log(item);
  });
}

function ClientSocket(cs, userList, roomList, io) {
  var _this = this;

  this.io = io;
  this.socket = cs;
  this.userList = userList;
  this.roomList = roomList;
  this.room = null;
  this.csocket = {
    id: cs.id
  };
  this.socket.on('disconnect', function (e) {
    userList["delete"](cs.id);

    if (_this.csocket.curPlayer) {
      _this.room.leave(_this.csocket.curPlayer);

      if (_this.room.playerNum === 0) {
        _this.roomList["delete"](_this.room);
      }
    }

    _this.broadcast('bro-logout');

    Log('客户端断开，剩余人数：', _this.userList.data);

    _this.computeUser();
  });

  this.getProto = function (ename) {
    // let userList = this.computeUser();
    return {
      ename: ename,
      socketId: _this.socket.id,
      userList: _this.userList,
      roomList: _this.roomList,
      room: _this.room,
      csocket: _this.csocket,
      timestamp: Date.parse(new Date())
    };
  };

  this.computeUser = function () {
    // console.log(io)
    io.sockets.sockets.forEach(function (item) {// console.log(item,item.id,item.connected)
    });
  };

  this.emit = function (type) {
    var params = _this.getProto(type);

    _this.socket.emit(type, params);
  };

  this.broadcast = function (type) {
    var params = _this.getProto(type);

    _this.socket.broadcast.emit(type, params);
  };

  this.toRoom = function (type, roomName) {
    var room = _this.roomList.findRoom(roomName);

    _this.socket.to(roomName).emit('room-msg', {
      type: type,
      room: room,
      timestamp: Date.parse(new Date())
    });
  };
}

ClientSocket.prototype.login = function (params) {
  this.userList.add(this.socket.id);
  this.emit('login');
  this.broadcast('bro-login');
  this.computeUser();
  Log('客户端接入，当前人数：', this.userList.data);
};
/**
 * 创建房间
 * @param {*} params 
 * 
 */


ClientSocket.prototype.createRoom = function (params) {
  this.room = new Room(params);
  this.room.playerNum++;
  this.socket.join(this.room.name);
  this.csocket['curRoom'] = this.room.name;
  this.csocket['curPlayer'] = '1p';
  this.roomList.add(this.room);
  this.emit('create-room');
  this.broadcast('bro-create-room');
  console.log('创建房间成功，房间名：', params.roomName);
};
/**
 * 加入房间
 * @param {*} params 
 * @returns 
 */


ClientSocket.prototype.enteryRoom = function (params) {
  if (!params.socketId || !params.roomName) {
    console.log('参数不正确', params);
    return;
  } // 已经在房间内


  if (this.room !== null) {
    console.log('已经在房间内');
    return;
  } // 满员


  if (this.room && this.room.isFull()) {
    console.log('该房间满员');
    return;
  }

  this.room = this.roomList.findRoom(params.roomName);

  if (!this.room) {
    console.log('房间不存在');
    return;
  }

  this.socket.join(this.room.name);
  this.csocket['curRoom'] = this.room.name;
  this.csocket['curPlayer'] = this.room.join(params.socketId);

  if (this.room.isFull()) {
    this.toRoom(this.room.name);
  }

  this.emit('entery-room');
  this.toRoom('entery-room', params.roomName);
  console.log('加入房间', params.socketId, params.roomName);
};
/**
 * 摸牌
 * @param {*} params 
 */


ClientSocket.prototype.putInCard = function (params) {
  console.log('摸牌', params);
  var room = this.roomList.findRoom(params.roomName);

  if (!room) {
    console.log('房间不存在');
    return;
  }

  room.addCard(params.player);
  this.room = room;
  this.emit("put-in-card");
  this.toRoom("put-in-card", params.roomName);
};
/**
 * 出牌
 * @param {*} params 
 */


ClientSocket.prototype.putOutCard = function (params) {
  console.log('出牌', params);
  var room = this.roomList.findRoom(params.roomName);

  if (!room) {
    console.log('房间不存在');
    console.log(this.roomList);
    return;
  }

  room.removeCard(params.player, params.card);
  room.changePlayer();
  room.actionQueue = [];
  this.room = room;
  this.emit("put-out-card");
  this.toRoom("put-out-card", params.roomName);
};
/**
 * 客户端的吃碰杠胡以及取消事件
 * @param {*} params 
 */


ClientSocket.prototype.actionCard = function (params) {
  console.log('action', params);
  var room = this.roomList.findRoom(params.roomName);

  if (!room) {
    console.log('房间不存在');
    console.log(this.roomList);
    return;
  }

  room.actionQueue.push(params);

  if (room.actionQueue.length === room.playerArr.length - 1) {
    room.actionCardHandler();
    this.room = room;
    this.emit("action-card");
    this.toRoom("action-card", params.roomName);
  }
};

module.exports = ClientSocket;