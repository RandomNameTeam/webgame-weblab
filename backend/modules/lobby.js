const {v4: uuidv4} = require("uuid");
const {Client} = require("../models/Client");
const {Lobby} = require("../models/Lobby");

let inWaiting = []
let Lobbies = []
let inGame = []

function isLobbyHasTwoPlayers() {
    return inWaiting.length > 1;
}

function createLobby(client1, client2, io) {
    const id = uuidv4();
    client1.setLobbyId(id);
    client2.setLobbyId(id);
    Lobbies.push(new Lobby(client1, client2, id));
    return id;
}

function inWaitingByUUID(uuid) {
    for (let i = 0; i < inWaiting.length; i++) {
        if (uuid === inWaiting[i].id) {
            return inWaiting[i];
        }
    }

    return false;
}

function isInGame(uuid) {
    for (let i = 0; i < inGame.length; i++) {
        if (uuid === inGame[i].id) {
            return inGame[i];
        }
    }
    return false;
}

function findRoom(s) { // return idRoom
    var rooms = s.rooms;
    var idRoom = rooms.values();
    var counter = 0;

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
function removeLobby(idRoom) {
    Lobbies = Lobbies.filter(function (e) {
        return e.id !== idRoom;
    });
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
    if (lobby === null) return {lobby, lobby}
    const player = findPlayerInRoom(socket, lobby);
    const enemy = findEnemyInRoom(socket, lobby);

    return {player, enemy}
}

function getPlayersCount() {
    return inWaiting.length
}

function getPlayer(id) {
    if (id < 0) return inWaiting[inWaiting.length + id]
    return inWaiting[id]
}

function inWaitingByName(name) {
    for (let i = 0; i < inWaiting.length; i++) {
        if (inWaiting[i].getName() === name) {
            return inWaiting[i];
        }
    }
    return false;
}

function movePlayer(client = false) {

    if (client) {
        inWaiting = inWaiting.filter(function (e) {
            return e !== client;
        });
    } else client = inWaiting.pop()
    inGame.push(client)
    return client
}
function removePlayer(client){
    inWaiting = inWaiting.filter(function (e) {
        return e !== client;
    });
    inGame = inGame.filter(function (e) {
        return e !== client;
    });
}

function getPlayers() {
    return inWaiting
}

function getLobbies() {
    return Lobbies
}

function addPlayer(name) {
    let client = new Client(name, uuidv4())
    inWaiting.push(client)
    return client.id
}

module.exports = {
    isLobbyHasTwoPlayers,
    createLobby,
    inWaitingByUUID,
    findRoom,
    findLobby,
    findPlayerInRoom,
    findEnemyInRoom,
    findOpponents,
    getPlayer,
    movePlayer,
    getPlayersCount,
    getPlayers,
    getLobbies,
    addPlayer,
    inWaitingByName,
    isInGame,
    removeLobby,
    removePlayer
}