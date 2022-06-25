class Scene2 extends Phaser.Scene {
    constructor() {
        super("endGame")
    }

    preload() {
        this.load.path = "assets/"
        this.load.bitmapFont("pixelFont",
            "font/MatchupPro.png",
            "font/MatchupPro.xml")
        this.load.spritesheet("button", "sprites/button.png", {
            frameWidth: 120,
            frameHeight: 101
        })
    }

    initUI(data) {
        this.createButton()
        this.resultsLabel = this.add.bitmapText(game.config.width / 2, game.config.height / 2, "pixelFont", data['state']+"!", 120)
            .setOrigin(.5, .5)
        this.tryAgainLabel = this.add.bitmapText(game.config.width / 2, (game.config.height / 2) +180, "pixelFont", "Go next!!!", 72)
            .setOrigin(.5, .5)
    }
    createButton() {
        this.button = this.add.sprite(game.config.width / 2, game.config.height - 100, "button")
            .setInteractive()
            .on("pointerdown", this.buttonDown)
            .on("pointerup", this.buttonUp)
    }

    buttonDown(pointer, localX, localY, event) {
        this.setFrame(1)
    }

    buttonUp(pointer, localX, localY, event) {
        this.setFrame(0)
        window.location.href = "/leave";
    }

    create(data) {
        this.initUI(data)
    }
}