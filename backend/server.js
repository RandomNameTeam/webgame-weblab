const http = require('http');
const express = require('express');
const {v4: uuidv4} = require('uuid');
const socketio = require('socket.io');
const {Server} = require("socket.io");
const bodyParser = require('body-parser')
const {colours} = require("nodemon/lib/config/defaults");
const Console = require("console");

class Client{
    socketId;

    constructor(name) {
        this.name = name;
        this.lobbiId = -1;

    }

    getName(){
        return this.name;
    }

    getLobbiId(){
        return this.name;
    }

    setLobbiId(value){
        this.lobbiId = value;
    }

    setSocketId(value){
        this.socketId = value;
    }

    getSocketId(){
        return this.socketId;
    }
}

class Lobbi{
    constructor(client1, client2, id) {
        this.id = id;
        this.clients = [];
        this.clients.push(client1);
        this.clients.push(client2);
    }

    getId(){
        return this.id;
    }

    getClient(index){
        if (!Number.isInteger(index)){
            Console.log("Error don't have client with index " + index + " in this lobbi")
            return -1;
        } else if(index > -1 && index < this.clients.length) {
            Console.log("Error don't have client with index " + index + " in this lobbi")
            return -1;
        } else {
            return this.clients[index];
        }
    }
}


var Players = [];
var Lobbies = [];

function chekLobbiHasTwoPlayers(){
    if (Players.length <= 1){
        return false;
    }
    return true
}

function createLobbi(client1, client2){
    var id = uuidv4();
    client1.setLobbiId(id);
    client2.setLobbiId(id);
    Lobbies.push(new Lobbi(client1, client2, id));
    io.emit("create-room", id);
    return id;
}

function chekIsPlayer(name){
    for (var i = 0; i < Players.length; i++){
        if (name === Players[i]){
            return true;
        }
    }

    return false;
}


const app = express();

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
})

app.use(express.static("../public"));
app.use(express.static("../frontend"));

const httpServer = http.createServer(app);
const io = new Server(httpServer);

/*io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});*/

/*io.on('connection', (sock) =>{
    console.log("now it work");
    sock.join('-1', sock.id);
    io.to(sock.id).emit('something', 'rapusta2');
    io.to('-1').emit('something', 'kapusta');
})*/

io.on('connection', (sock) =>{
    console.log(sock.id);


    if (chekLobbiHasTwoPlayers()) {
        if (Players[Players.length - 2].lobbiId === -1) {
            Players[Players.length - 1].setSocketId(sock.id);
            var len = Players.length;

            var idRoom = createLobbi(Players[len - 2], Players[len - 1]);

            var p1Socket = io.sockets.sockets.get(Players[len - 1].getSocketId());
            var p2Socket = io.sockets.sockets.get(Players[len -2].getSocketId());

            p1Socket.join(idRoom);
            p2Socket.join(idRoom);

            console.log(io.to(idRoom).allSockets());
            io.to(idRoom).emit('created-room');
            //Players.slice(Players.length - 2, 2);// ??? <=====================================================
            Players.pop();
            Players.pop();
        } else {
            Players[len - 1].setSocketId(sock.id);
        }
    } else if (Players.length === 1){
        Players[Players.length - 1].setSocketId(sock.id);
    }
})

httpServer.on('error', (err) =>{
    console.log(err);
});

app.get('/', (req, res) =>{
    res.sendFile( "index.html");
})

app.post('/', urlencodedParser, (req, res) => {
    Players.push(new Client(req.body.name));
    if (chekIsPlayer(req.body.name)){
        res.sendFile("index.html");
    }

    res.sendFile("C:\\Users\\виктор\\Desktop\\webgame-weblab\\public\\WaitingLobbi.html")
})

app.get('/playrs', (req, res) =>{

    res.send(Players);
})
app.get('/lobbi', (req, res) =>{
    console.log(io.of("/").adapter.rooms);
    console.log(io.of("/my-namespace").adapter.sids);
    res.send(Lobbies);
})


httpServer.listen(8000, () =>{
    console.log('server is ready');
})

