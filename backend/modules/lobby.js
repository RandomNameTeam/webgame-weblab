const {v4: uuidv4} = require("uuid");
const {Client} = require("../models/Client");
const {Lobby} = require("../models/Lobby");

let Players = []
let Lobbies = []

function isLobbyHasTwoPlayers() {
    return Players.length > 1;
}

function createLobby(client1, client2, io) {
    const id = uuidv4();
    client1.setLobbyId(id);
    client2.setLobbyId(id);
    Lobbies.push(new Lobby(client1, client2, id));
    io.emit("create-room", id);
    return id;
}

function isPlayer(name) {
    for (let i = 0; i < Players.length; i++) {
        if (name === Players[i]) {
            return true;
        }
    }

    return false;
}

function findRoom(s) { // return idRoom
    const rooms = s.rooms;
    let idRoom = rooms.values();
    let counter = 0;

    for (let room of rooms) {
        if (counter === 1) {
            idRoom = room;
            break;
        }
        counter++;
    }
    return idRoom;
}

function findLobby(idRoom) {
    for (let i = 0; i < Lobbies.length; i++) {
        if (Lobbies[i].id === idRoom) {
            return Lobbies[i];
        }
    }
    return null;
}

function findPlayerInRoom(sock, lobby) {
    for (let i = 0; i < lobby.clients.length; i++) {
        if (lobby.clients[i].socketId === sock.id) {
            return lobby.clients[i]
        }
    }
    return null;
}

function findEnemyInRoom(sock, lobby) {
    for (let i = 0; i < lobby.clients.length; i++) {
        if (lobby.clients[i].socketId !== sock.id) {
            return lobby.clients[i]
        }
    }
    return null;
}

function findOpponents(socket) {
    const roomId = findRoom(socket)
    const lobby = findLobby(roomId);
    const player = findPlayerInRoom(socket, lobby);
    const enemy = findEnemyInRoom(socket, lobby);

    return {player, enemy}
}
function getPlayersCount(){
    return Players.length
}
function getPlayer(id){
    if(id < 0) return Players[Players.length + id]
    return Players[id]
}
function popPlayer() {
    Players.pop()
}
function getPlayers() {
    return Players
}
function getLobbies(){
    return Lobbies
}
function addPlayer(name){
    Players.push(new Client(name))
}
module.exports = {
    isLobbyHasTwoPlayers, createLobby,
    isPlayer, findRoom, findLobby, findPlayerInRoom,
    findEnemyInRoom, findOpponents, getPlayer, popPlayer,
    getPlayersCount, getPlayers, getLobbies, addPlayer
}