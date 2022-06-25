const config = {
    width: 1600,
    height: 800,
    backgroundColor: 0x000000,
    antialias: false,
    antialiasGL: false,
    scene: [Scene1, Scene2],
    debug: false,
    background_data: null,
    skin_data: null,
}
let game
let socket
const startGame = (data) => {
    config.background_data = data.background
    config.skin_data = data.skin
    game = new Phaser.Game(config)
    document.querySelector("html").style.animationPlayState = "paused"
}
if (config.debug) startGame()
else {
    socket = io()
    socket.on('created-room', (data) => {
        console.log("hi i am here");
        // socket.emit('click');
        // socket.emit('server-update');
        startGame(data)
    })
    socket.on('disconnect', (reason)=>{
        window.location.href = "/leave";
    })
    console.log(document.cookie)
    let uuid = document.cookie
        .split('; ')
        .find(row => row.startsWith('uuid='))
        ?.split('=')[1];
    socket.emit('ready', {'uuid': uuid})
}

