

const express =  require('express')
const app = new express()
app.use(express.static(__dirname))

const http = require('http')
const server = http.createServer(app,{
    cors:{
        origin:"*"
    }
})
server.listen('912')


const io =  require("socket.io")(server)
const ClientSocket = require("./clientSocket")
const userList = require('./user')
const roomList = require('./roomManager')

io.on('connection',(cs)=>{
    
    const socket = new ClientSocket(cs,userList,roomList,io)

    cs.on('login',data=>{socket.login(data)})

    cs.on('create-room',data=>{socket.createRoom(data)})

    cs.on('entery-room',data=>{socket.enteryRoom(data)})

    cs.on('deal-card',data=>{socket.dealCard(data)})
    
    cs.on('put-in-card',data=>{socket.putInCard(data)})

    cs.on('put-out-card',data=>{socket.putOutCard(data)})

    cs.on('action-card',data=>{socket.actionCard(data)})

    cs.on('send-room-msg',data=>{socket.sendRoomMsg(data)})

    cs.on('regame',data=>{socket.reGame(data)})
})
console.log('服务启动成功：http://192.168.91.3:912')
