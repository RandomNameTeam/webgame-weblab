const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {Server} = require("socket.io");
const bodyParser = require('body-parser')
const {colours} = require("nodemon/lib/config/defaults");

class Player{
    constructor(name) {
        this.name = name;
    }
}

var players = [];


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
        players.push(new Player(name));
    })
})

httpServer.on('error', (err) =>{
    console.log(err);
});

app.get('/', (req, res) =>{
    res.sendFile( "index.html");
})

app.post('/', urlencodedParser, (req, res) => {
    players.push(new Player(req.body.name));
    res.sendFile("C:\\Users\\виктор\\Desktop\\webgame-weblab\\public\\index.html")
})

app.get('/playrs', (req, res) =>{
    res.send(players);
})


httpServer.listen(8000, () =>{
    console.log('server is ready');
})

