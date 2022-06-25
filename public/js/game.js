
const config = {
    width: 1600,
    height: 800,
    backgroundColor: 0x000000,
    antialias: false,
    antialiasGL: false,
    scene: [Scene1, Scene2],
    debug: false
}
let game
let socket
const startGame = () =>
{
    game = new Phaser.Game(config)
}
if(config.debug) startGame()
else {
    socket = io()
    socket.on('created-room', () => {
        console.log("hi i am here");
        // socket.emit('click');
        // socket.emit('server-update');
        startGame()
    })
}

