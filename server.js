// const { Socket } = require("dgram");
const moment = require('moment');
const express = require("express");
const app = express();
const path = require('path');

const http = require("http");
const {Server} = require('socket.io');
const ACTIONS = require("./src/Actions");

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("build"));

app.use((req,res,next) =>{
    res.sendFile(path.join(__dirname,'build','index.html'));
})

const userSocketMap = {};

function formatMessage(username,text){
    return{
        username,
        text,
        time: moment().format('h:mm a'),
    }
}

function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) =>{
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    });
}

function getCurrentUser(id){
    return userSocketMap[id];
}

io.on("connection",(socket)=>{
    // console.log("socket connected", socket.id);

    socket.on(ACTIONS.JOIN, ({roomId, username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);

        clients.forEach(({socketId}) => {
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId: socket.id,
            });
        });


    });

    socket.on(ACTIONS.CODE_CHANGE, ({roomId,code}) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on(ACTIONS.SYNC_CODE, ({socketId,code}) => {
        socket.to(socketId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on("chatMessage", ({msg,roomId}) => {
        // console.log('message ',msg);
        // console.log('room id ',roomId);

        const user = getCurrentUser(socket.id);
        // console.log("user", user);
        io.to(roomId).emit("message", formatMessage(user,msg));
    });

    
    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];

        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        // console.log(userSocketMap[socket.id]);

        delete userSocketMap[socket.id];
        socket.leave();

    });

});

const PORT = 3456 || process.env.PORT;

server.listen(PORT,()=> console.log("server is running"));


