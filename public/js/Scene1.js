class Scene1 extends Phaser.Scene {

    constructor() {
        super("playGame");
    }

    preload() {
        this.load.path = "assets/"
        this.preloadBackground()
        this.load.spritesheet("button", "sprites/button.png", {
            frameWidth: 120,
            frameHeight: 101
        })
        this.load.bitmapFont("pixelFont",
            "font/MatchupPro.png",
            "font/MatchupPro.xml")
    }

    create() {
        this.createBackground()
        this.initUI()
    }

    preloadBackground() {
        this.load.image("bg_11", "sprites/BG/Layer_0011_0.png")
        this.load.image("bg_10", "sprites/BG/Layer_0010_1.png")
        this.load.image("bg_9", "sprites/BG/Layer_0009_2.png")
        this.load.image("bg_8", "sprites/BG/Layer_0008_3.png")
        this.load.image("bg_7", "sprites/BG/Layer_0007_Lights.png")
        this.load.image("bg_6", "sprites/BG/Layer_0006_4.png")
        this.load.image("bg_5", "sprites/BG/Layer_0005_5.png")
        this.load.image("bg_4", "sprites/BG/Layer_0004_Lights.png")
        this.load.image("bg_3", "sprites/BG/Layer_0003_6.png")
        this.load.image("bg_2", "sprites/BG/Layer_0002_7.png")
        this.load.image("bg_1", "sprites/BG/Layer_0001_8.png")
        this.load.image("bg_0", "sprites/BG/Layer_0000_9.png")
    }


    createBackground() {
        this.background = []
        for (let i = 11; i >= 0; i--) {
            let backgroundLayer = this.add.tileSprite(0, -350, game.config.width, game.config.height, "bg_" + i)
            backgroundLayer.setOrigin(0, 0)
                .setScale(1.5, 1.5)

            this.background.push(backgroundLayer)
        }

    }

    initUI() {
        this.createButton()
        this.hpRect = this.add.rectangle(20,40,300,30, 0xFF0000)
        this.hpRect.setOrigin(0,.5)
        this.hpScore = this.add.bitmapText(360, 43, "pixelFont", "100", 64)
        this.hpScore.setOrigin(0,.5)
        this.scoreLabel = this.add.bitmapText(20, 60, "pixelFont", "AP", 64)
    }

    createButton() {
        this.button = this.add.sprite(game.config.width / 2, game.config.height - 60, "button")
        this.button.setInteractive();
        this.button.on("pointerdown", this.buttonDown);
        this.button.on("pointerup", this.buttonUp);
    }

    buttonDown(pointer, localX, localY, event) {
        this.setFrame(1)
    }

    buttonUp(pointer, localX, localY, event) {
        this.setFrame(0)
        socket.emit('click');
    }

}