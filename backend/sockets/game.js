const {Server} = require("socket.io");
const {
    isLobbyHasTwoPlayers, createLobby,
    findRoom, findLobby, findPlayerInRoom,
    findEnemyInRoom, findOpponents, removePlayer, movePlayer,
    isInGame, inWaitingByUUID, removeLobby
} = require('../modules/lobby')

const {Client} = require('../models/Client');


const InitIO = (httpServer) => {
    const io = new Server(httpServer)

    const endGame = (socket) => {
        let idRoom = findRoom(socket);
        let lobby = findLobby(idRoom);
        let looser = findPlayerInRoom(socket,lobby);
        let winner = findEnemyInRoom(socket,lobby);
        removePlayer(looser)
        removePlayer(winner)
    }


    io.on('connection', (socket) => {
        //console.log(sock.id);

        socket.on('end-game', (id) => {
            const {player, enemy} = findOpponents(socket)
            if (player === null) {
                console.log("Player not found");
                return;
            }
            if (enemy === null) {
                console.log("Enemy not found");
                return;
            }

            console.log("game finished");
        })
        socket.on('click', async () => {
            let idRoom = findRoom(socket);
            let lobby = findLobby(idRoom);
            let player = findPlayerInRoom(socket, lobby);
            if (player === -1) {
                console.log("Player not found");
                return;
            }

            if (lobby == null) {
                console.log("Lobby not found");
                return -1;
            }

            player.setCommandResource(1);

        })

        socket.on('server-update', () => {
            const {player, enemy} = findOpponents(socket)
            if (player === null) {
                console.log("Player not found");
                return;
            }
            if (enemy === null) {
                console.log("Enemy not found");
                return;
            }
            let roomId = findRoom(socket);
            io.to(roomId).emit('client-update', player.getHp(), player.getCommandResource(), enemy.getHp());
        })

        socket.on('skills', (skill) => {
            const {player, enemy} = findOpponents(socket)
            if (player === null) {
                console.log("Player not found");
                return;
            }
            if (enemy === null) {
                console.log("Enemy not found");
                return;
            }

            if (skill === "Heal") {
                if (player.getCommandResource() >= 10) {
                    player.heal(10);
                    player.setCommandResource(-10);
                } else {
                    console.log("enough commandResource");
                }
                io.to(enemy.getSocketId()).emit("enemy-heal", 10);
            } else if (skill === "Damage") {
                if (player.getCommandResource() >= 10) {
                    enemy.damage(40);
                    player.setCommandResource(-10);
                    io.to(enemy.getSocketId()).emit("enemy-attack", 10);
                } else {
                    console.log("not enough commandResource");
                }

                if (enemy.getHp() <= 0) {
                    socket.emit('win');
                    io.sockets.sockets.get(enemy.getSocketId()).emit('death');
                    endGame(socket)
                }

            } else {
                console.log("is not skill: " + skill);
            }

        })

        socket.on('disconnect', () => {
            let roomId = findRoom(socket)
            if (roomId === null) return
            let lobby = findLobby(roomId)
            if (lobby === null) return
            let client = findPlayerInRoom(socket, lobby)
            removePlayer(client)
            if (client === null) return
            lobby.clients = lobby.clients.filter(function (e) {
                return e !== client;
            });
            if (lobby.clients.length === 0) {
                removeLobby(roomId)
                console.log('lobby deleted')
            }
        })

        socket.on('ready', (data) => {
            let client = isInGame(data['uuid'])
            console.log(`socket.on('ready'): uuid ${data['uuid']}`)
            if (client) {
                //disconnecting dead socket
                let old_socket = io.sockets.sockets.get(client.getSocketId())
                if (old_socket !== undefined) old_socket.disconnect(true);

                //connecting to room
                socket.join(client.lobbyId)
                client.setSocketId(socket.id)

                //response to client
                let bg = client.background
                let skin = client.numberForSkin
                socket.emit('created-room', {background: bg, skin: skin})
                return
            }
            client = inWaitingByUUID(data['uuid'])
            if (client) {

                let old_socket = io.sockets.sockets.get(client.getSocketId())
                if (old_socket !== undefined) old_socket.disconnect(true);

                client.setSocketId(socket.id)

                if (isLobbyHasTwoPlayers()) {
                    let p1 = movePlayer(client)
                    let p2 = movePlayer()

                    const roomId = createLobby(p2, p1, io)

                    const p1Socket = socket;
                    const p2Socket = io.sockets.sockets.get(p2.getSocketId());

                    p1.numberForSkin = Math.round(Math.random() % 2)
                    p2.numberForSkin = Math.abs(1 - p1.numberForSkin)
                    p1.background = p2.background = Math.round(Math.random() % 3)

                    p1Socket.join(roomId);
                    p2Socket.join(roomId);

                    console.log(io.to(roomId).allSockets());
                    let bg = Math.random() % 3;

                    p1Socket.emit('created-room', {background: bg, skin: p1.numberForSkin})
                    p2Socket.emit('created-room', {background: bg, skin: p2.numberForSkin})
                }
            } else {
                console.log(`uuid ${data['uuid']} not found`)
                socket.disconnect(true)
            }

        })
    })
}

module.exports = {InitIO}