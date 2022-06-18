const http = require('http');
const express = require('express');
const Console = require("console");
const {v4: uuidv4} = require('uuid');
const socketio = require('socket.io');
const {Server} = require("socket.io");
const bodyParser = require('body-parser')
const {colours} = require("nodemon/lib/config/defaults");
const path = require("path");


class Client{
    socketId;
    hp = 100;
    commandResours = 0;
    maxCommandResourse = 100;
    maxHp = 100;

    constructor(name) {
        this.name = name;
        this.lobbiId = -1;

    }

    demage(value){
        this.hp -= value;
        if (this.hp < 0){
            console.log(this.name + " died");
            return;
        }
        console.log(this.name + " get damage:" + value);
        return;

    }

    heal(value){
        this.hp += value;
        if (this.hp > this.maxHp){
            this.hp = this.maxHp;
            return;
        }
        console.log(this.name + " healing on " + value + " hp:" + this.hp);
        return
    }

    setCommandResours(){
        this.commandResours++;
        if (this.commandResours > this.maxCommandResourse){
            this.commandResours = this.maxCommandResourse;
            return;
        }
        return
        console.log(this.name + " " + this.commandResours);
    }

    getName(){
        return this.name;
    }

    getHp(){
        return this.hp;
    }

    getCommandResourse(){
        return this.commandResours;
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

app.set('views', "../frontend")
app.set('view engine', 'ejs')

const httpServer = http.createServer(app);
const io = new Server(httpServer);

function findRoom(s){ // return idRoom
    var rooms =  s.rooms;
    var idRoom = rooms.values();
    var counter = 0;

    for (let room of rooms){
        if (counter === 1){
            idRoom = room;
            break;
        }
        counter++;
    }
    return idRoom;
}

function findLobbi(idRoom){
    var lobbi;
    for (var i = 0; i < Lobbies.length; i++){
        if (Lobbies[i].id == idRoom){
            lobbi = Lobbies[i];
            console.log(lobbi);
            return lobbi;
        }
    }
    return lobbi;
}

function findPlayerInRoom(sock, lobbi){
    var player;
    for (var i =0; i < lobbi.clients.length; i++){
        if (lobbi.clients[i].socketId === sock.id){
            player = lobbi.clients[i];
            return enemy
        }
    }
    return player;
}

function findEnemyInRoom(sock, lobbi){
    var enemy;
    for (var i =0; i < lobbi.clients.length; i++){
        if (lobbi.clients[i].socketId !== sock.id){
            enemy = lobbi.clients[i];
            return enemy;
        }
    }
    return enemy;
}


io.on('connection', (sock) =>{
    console.log(sock.id);
    sock.on('click', async () =>{

        var idRoom = findRoom(sock);
        var lobbi = findLobbi(idRoom);
        var player = findPlayerInRoom(sock, lobbi, false);

        if (lobbi == null){
            console.log("Lobbi not found");
            return -1;
        }

        player.setCommandResours();

    })

    sock.on('server-update', () =>{
        var idRoom = findRoom(sock);
        var lobbi = findLobbi(idRoom);
        var player = findPlayerInRoom(sock, lobbi);
        var enemy = findEnemyInRoom(sock, enemy);
        io.to(idRoom).emit('client-update', player.getHp(), player.getCommandResourse(), enemy.getHp());
    })

    sock.on('skills', (skil) =>{
        var idRoom = findRoom(sock);
        var lobbi = findLobbi(idRoom);
        var player = findPlayerInRoom(sock, lobbi);

        if (skil === "Heal"){
            if (player.commandResours >= 10){
                player.heal(10);
                player.setCommandResours(-10);
            } else {
                console.log("enough commandResource");
            }
        } else if (skil === "Damage"){
            if (player.commandResours >= 10){
                player.demage(10);
                player.setCommandResours(-10);
            } else {
                console.log("enough commandResource");
            }

        } else {
            console.log("is not skill: " + skil);
        }

    })


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
    res.render('index');
})

app.post('/', urlencodedParser, (req, res) => {
    Players.push(new Client(req.body.name));
    if (chekIsPlayer(req.body.name)){
        res.sendFile("index.html");
    }

    res.render('gameLobby')
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

