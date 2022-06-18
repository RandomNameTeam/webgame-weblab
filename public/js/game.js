
const config = {
    width: 1600,
    height: 800,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2]
}
let game

const startGame = () =>
{
    game = new Phaser.Game(config)
}
startGame()


const socket = io()
socket.on('created-room', () => {
    console.log("hi i am here");
    socket.emit('click');
    socket.emit('server-update');
    startGame()
})

socket.on('client-update', (selfHp, commandResours, enemyHp) =>{
    console.log("My hp: " + selfHp + " my commandResourse: " + commandResours + "enemyHp " + enemyHp);
})