const http = require('http');
const express = require('express');
const {v4: uuidv4} = require('uuid');
const socketio = require('socket.io');
const {Server} = require("socket.io");
const bodyParser = require('body-parser')
const {colours} = require("nodemon/lib/config/defaults");
const Console = require("console");

class Client{
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
}

class Lobbi{
    constructor(client1, client2, id) {
        this.id = id;
        this.clients = [];
        this.clients.push(client1.getName());
        this.clients.push(client2.getName());
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

function chekEmptyLobbi(){
    if (Players.length <= 1){
        return;
    }
    if (Players[Players.length - 2].lobbiId === -1){
        createLobbi(Players[Players.length - 2], Players[Players.length - 1]);
    }
}

function createLobbi(client1, client2){
    var id = uuidv4();
    client1.setLobbiId(id);
    client2.setLobbiId(id);
    Lobbies.push(new Lobbi(client1, client2, id));
}


const app = express();

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
})

app.use(express.static("C:\\Users\\виктор\\Desktop\\webgame-weblab\\public\\"));
app.use(express.static("C:\\Users\\виктор\\Desktop\\webgame-weblab\\frontend\\"));

const httpServer = http.createServer(app);
const io = new Server(httpServer);
console.log(io.path());

io.on('connection', (sock) =>{
    sock.on('Registred', (name) =>{
        console.log(name);
        players.push(new Client(name));
    })
})

httpServer.on('error', (err) =>{
    console.log(err);
});

app.get('/', (req, res) =>{
    res.sendFile( "index.html");
})

app.post('/', urlencodedParser, (req, res) => {
    Players.push(new Client(req.body.name));
    chekEmptyLobbi();
    res.sendFile("C:\\Users\\виктор\\Desktop\\webgame-weblab\\public\\index.html")
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

