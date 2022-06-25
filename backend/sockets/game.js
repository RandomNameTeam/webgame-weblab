const {Server} = require("socket.io");
const {
    isLobbyHasTwoPlayers, createLobby,
    findRoom, findLobby, findPlayerInRoom,
    findEnemyInRoom, findOpponents, getPlayer, popPlayer,
    getPlayersCount, findPlayerByName
} = require('../modules/lobby')

const {Client} = require('../models/Client');


const InitIO = (httpServer) => {
    const io = new Server(httpServer)


    io.on('end-game', (sockId) => {
        let looser = findPlayerInRoom(io.sockets.sockets.get(sockId));
        let winner = findEnemyInRoom(io.sockets.sockets.get(sockId));
        console.log("Game Finished")
        io.to(looser.getSocketId()).emit('loose', looser.name);
        io.to(winner.getSocketId()).emit('win');
    })


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
            console.log('click emitted')
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
                    enemy.damage(10);
                    player.setCommandResource(-10);
                    io.to(enemy.getSocketId()).emit("enemy-attack", 10);
                } else {
                    console.log("not enough commandResource");
                }

                if (enemy.getHp() <= 0) {
                    socket.emit('win');
                    io.sockets.sockets.get(enemy.getSocketId()).emit('death');
                }

            } else {
                console.log("is not skill: " + skill);
            }

        })


        if (isLobbyHasTwoPlayers()) {
            if (getPlayer(-2).getLobbyId() === null) {
                getPlayer(-1).setSocketId(socket.id)

                const idRoom = createLobby(getPlayer(-2), getPlayer(-1), io)

                const p1Socket = io.sockets.sockets.get(getPlayer(-1).getSocketId());
                const p2Socket = io.sockets.sockets.get(getPlayer(-2).getSocketId());

                p1Socket.join(idRoom);
                p2Socket.join(idRoom);

                console.log(io.to(idRoom).allSockets());
                io.to(idRoom).emit('created-room');
                //Players.slice(Players.length - 2, 2);// ??? <=====================================================
                popPlayer();
                popPlayer();
            } else {
                getPlayer(-1).setSocketId(socket.id);
            }
        } else if (getPlayersCount() === 1) {
            getPlayer(-1).setSocketId(socket.id);
        }
    })
}

module.exports = {InitIO}