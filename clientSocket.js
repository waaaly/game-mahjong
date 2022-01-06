const Room = require('./room')
const io = require('./server')
function Log(msg, arr) {
    console.log(msg, arr.length)
    arr.forEach(item => {
        console.log(item)
    })
}

function ClientSocket(cs, userList, roomList, io) {
    this.io = io;
    this.socket = cs;
    this.userList = userList;
    this.roomList = roomList;
    this.room = null;
    this.csocket = { id: cs.id };

    this.socket.on('disconnect', (e) => {
        userList.delete(cs.id)
        if (this.csocket.curPlayer) {
            this.room.leave(this.csocket.curPlayer)
            if (this.room.playerNum === 0) {
                this.roomList.delete(this.room)
            }
        }
        this.broadcast('bro-logout')
        Log('客户端断开，剩余人数：', this.userList.data)
        this.computeUser()
    });

    this.getProto = (ename) => {
        // let userList = this.computeUser();
        return {
            ename,
            socketId: this.socket.id,
            userList: this.userList,
            roomList: this.roomList,
            room: this.room,
            csocket: this.csocket,
            timestamp: Date.parse(new Date())
        }
    }
    this.computeUser = () => {
        // console.log(io)
        io.sockets.sockets.forEach(item => {
            // console.log(item,item.id,item.connected)
        })
    }
    this.emit = (type) => {
        let params = this.getProto(type)
        this.socket.emit(type, params)
    }
    this.broadcast = (type) => {
        let params = this.getProto(type)
        this.socket.broadcast.emit(type, params)
    }
    this.toRoom = (type, roomName) => {
        let room = this.roomList.findRoom(roomName)
        this.socket.to(roomName).emit('room-msg', {
            type, room, timestamp: Date.parse(new Date())
        })
    }
    this.sendRoom = (type, params) => {
        let room = this.roomList.findRoom(params.roomName)
        this.socket.to(params.roomName).emit('room-msg', {
            ...params,
            room,
            type,
            timestamp: Date.parse(new Date())
        })
    }
}

/**
 * 登录
 * @param {*} params 
 */
ClientSocket.prototype.login = function (params) {
    this.userList.add(this.socket.id)
    this.emit('login')
    this.broadcast('bro-login')
    this.computeUser()
    Log('客户端接入，当前人数：', this.userList.data)
}
/**
 * 客户端在房间内发送消息
 * @param {*} params 
 */
ClientSocket.prototype.sendRoomMsg = function (params) {
    this.sendRoom('send-room-msg', params)
}
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
}

/**
 * 加入房间
 * @param {*} params 
 * @returns 
 */
ClientSocket.prototype.enteryRoom = function (params) {
    if (!params.socketId || !params.roomName) {
        console.log('参数不正确', params)
        return
    }
    // 已经在房间内
    if (this.room !== null) {
        console.log('已经在房间内')
        return
    }
    // 满员
    if (this.room && this.room.isFull()) {
        console.log('该房间满员')
        return
    }

    this.room = this.roomList.findRoom(params.roomName)
    if (!this.room) {
        console.log('房间不存在')
        return
    }
    this.socket.join(this.room.name)

    this.csocket['curRoom'] = this.room.name
    this.csocket['curPlayer'] = this.room.join(params.socketId)
    if (this.room.isFull()) {
        this.toRoom(this.room.name)
    }
    this.emit('entery-room')
    this.toRoom('entery-room', params.roomName)
    console.log('加入房间', params.socketId, params.roomName)
}
/**
 * 摸牌
 * @param {*} params 
 */
ClientSocket.prototype.putInCard = function (params) {
    console.log('摸牌', params)
    let room = this.roomList.findRoom(params.roomName)
    if (!room) {
        console.log('房间不存在')
        return
    }
    room.addCard(params.player)
    this.room = room
    this.emit("put-in-card")
    this.toRoom("put-in-card", params.roomName)
}

/**
 * 出牌
 * @param {*} params 
 */
ClientSocket.prototype.putOutCard = function (params) {
    console.log('出牌', params)
    let room = this.roomList.findRoom(params.roomName)
    if (!room) {
        console.log('房间不存在')
        console.log(this.roomList)
        return
    }
    room.removeCard(params.player, params.card)
    room.changePlayer()
    room.actionQueue = []
    this.room = room
    this.emit("put-out-card")
    this.toRoom("put-out-card", params.roomName)
}

/**
 * 客户端的吃碰杠胡以及取消事件
 * @param {*} params 
 */
ClientSocket.prototype.actionCard = function (params) {
    console.log('action', params)
    let room = this.roomList.findRoom(params.roomName)
    if (!room) {
        console.log('房间不存在')
        console.log(this.roomList)
        return
    }
    room.actionQueue.push(params)
    if (room.actionQueue.length === room.playerArr.length - 1) {
        room.actionCardHandler()
        this.room = room
        this.emit("action-card")
        this.toRoom("action-card", params.roomName)
    }
}
/**
 * 重新开始
 */
ClientSocket.prototype.reGame = function (params) {
    let room = this.roomList.findRoom(params.roomName)
    if (!room) {
        console.log('房间不存在')
        console.log(this.roomList)
        return
    }
    room.restart()
    this.room = room
    this.emit("regame")
    this.toRoom("regame", params.roomName)
}
module.exports = ClientSocket
