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
        if (this.hp <= 0){

            return -1;
        }
        console.log(this.name + " get damage:" + value);
        return hp;

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

    setCommandResours(value){
        this.commandResours+= value;
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
            return player
        }
    }
    return -1;
}

function findEnemyInRoom(sock, lobbi){
    var enemy;
    for (var i =0; i < lobbi.clients.length; i++){
        if (lobbi.clients[i].socketId != sock.id){
            enemy = lobbi.clients[i];
            return enemy
        }
    }
    return -1;
}

io.on('end-game', (sockId) =>{
    var looser = findPlayerInRoom(io.sockets.sockets.get(sockId));
    var winner = findEnemyInRoom(io.sockets.sockets.get(sockId));
    console.log("Game Finished")
    io.to(looser.socketId).emit('death');
    io.to(winner.socketId).emit('win');
})


io.on('connection', (sock) =>{
    //console.log(sock.id);

    sock.on('end-game', (id) =>{
        var idRoom = findRoom(sock);
        var lobbi = findLobbi(idRoom);
        var player = findPlayerInRoom(sock, lobbi);
        var enemy = findEnemyInRoom(sock, lobbi);
        if (enemy === -1){
            console.log("Enemy dont search");
            return;
        }

        console.log("game finished");
    })
    sock.on('click', async () =>{

        var idRoom = findRoom(sock);
        var lobbi = findLobbi(idRoom);
        var player = findPlayerInRoom(sock, lobbi);
        if (player === -1){
            console.log("Player dont search");
            return;
        }

        if (lobbi == null){
            console.log("Lobbi not found");
            return -1;
        }

        player.setCommandResours(1);

    })

    sock.on('server-update', () =>{
        var idRoom = findRoom(sock);
        var lobbi = findLobbi(idRoom);
        var player = findPlayerInRoom(sock, lobbi);
        if (player === -1){
            console.log("Player dont search");
            return;
        }
        var enemy = findEnemyInRoom(sock, lobbi);
        if (enemy === -1){
            console.log("Enemy dont search");
            return;
        }
        io.to(idRoom).emit('client-update', player.getHp(), player.getCommandResourse(), enemy.getHp());
    })

    sock.on('skills', (skil) =>{
        var idRoom = findRoom(sock);
        var lobbi = findLobbi(idRoom);
        var player = findPlayerInRoom(sock, lobbi);
        var enemy = findEnemyInRoom(sock, lobbi);
        if (enemy === -1){
            console.log("Enemy dont search");
            return;
        }

        if (skil === "Heal"){
            if (player.commandResours >= 10){
                player.heal(10);
                player.setCommandResours(-10);
            } else {
                console.log("enough commandResource");
            }
        } else if (skil === "Damage"){
            if (player.commandResours >= 10){
                var sost = enemy.demage(100);
                player.setCommandResours(-10);
            } else {
                console.log("enough commandResource");
            }

            if (sost === -1){
                sock.emit('death');
                io.sockets.sockets.get(enemy.getSocketId()).emit('win');
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

    res.send(Lobbies);
})


httpServer.listen(8000, () =>{
    console.log('server is ready');
})

