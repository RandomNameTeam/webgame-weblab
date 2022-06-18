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

        this.load.image("healCard", "sprites/heal.png")
        this.load.image("damageCard", "sprites/damage.png")

        this.load.bitmapFont("pixelFont",
            "font/MatchupPro.png",
            "font/MatchupPro.xml")
    }

    create() {
        this.createBackground()
        this.initUI()

        this.timeElapsed = 0
        socket.on('client-update', (selfHp, commandResource, enemyHp)=>{
            this.updateUI(selfHp, commandResource, enemyHp)
            console.log("My hp: " + selfHp +
                " my commandResource: " + commandResource +
                "enemyHp " + enemyHp);
        })
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
            let backgroundLayer = this.add.tileSprite(0, -550, game.config.width, game.config.height, "bg_" + i)
            backgroundLayer.setOrigin(0, 0)
                .setScale(1.5, 1.5)

            this.background.push(backgroundLayer)
        }

    }

    initUI() {
        this.createButton()
        this.createCards()

        this.hpRect = this.add.rectangle(20, 40, 300, 30, 0xFF0000)
        this.hpRect.setOrigin(0, .5)
        this.hpScore = this.add.bitmapText(360, 43, "pixelFont", "100", 64)
        this.hpScore.setOrigin(0, .5)

        this.hpRectEnemy = this.add.rectangle(game.config.width - 20, 40, 300, 30, 0xFF0000)
        this.hpRectEnemy.setOrigin(1, .5)
        this.hpScoreEnemy = this.add.bitmapText(game.config.width - 360, 43, "pixelFont", "100", 64)
        this.hpScoreEnemy.setOrigin(1, .5)

        this.commandResourceScoreLabel = this.add.bitmapText(20, 90, "pixelFont", "AP", 48)
            .setOrigin(0, .5)
        this.commandResourceScore = this.add.bitmapText(82, 90, "pixelFont", "100", 56)
            .setOrigin(0, .5)
    }

    createCards() {
        this.healCard = this.add.image(300, game.config.height - 40, "healCard")
            .setOrigin(.5, 1)
            .setRotation(.2)
            .setScale(1.5, 1.5)
            .setInteractive()
            .on('pointerover', this.cardOver)
            .on('pointerout', this.cardOut)
            .on('pointerdown', this.cardDown)
            .setName('heal')
        this.damageCard = this.add.image(200, game.config.height - 40, "damageCard")
            .setOrigin(.5, 1)
            .setRotation(-.2)
            .setScale(1.5, 1.5)
            .setInteractive()
            .on('pointerover', this.cardOver)
            .on('pointerout', this.cardOut)
            .on('pointerdown', this.cardDown)
            .setName('damage')

        this.healCardCD = -10
        this.damageCardCD = -10
    }

    createButton() {
        this.button = this.add.sprite(game.config.width / 2, game.config.height - 100, "button")
            .setInteractive()
            .on("pointerdown", this.buttonDown)
            .on("pointerup", this.buttonUp)
    }

    updateUI(selfHp, commandResource, enemyHp) {

        this.hpScore.setText(selfHp)
            .setPosition(300 / 100 * selfHp + 60, 43)
        this.hpRect.setSize(300 / 100 * selfHp, this.hpRect.height)

        this.hpScoreEnemy.setText(enemyHp)
            .setPosition(game.config.width - (300 / 100 * enemyHp) - 60, 43)
        this.hpRectEnemy.setSize(300 / 100 * enemyHp, this.hpRectEnemy.height)
            .setOrigin(1, .5)

        this.commandResourceScore.setText(commandResource)
    }

    cardOver(pointer, localX, localY, event) {
        this.setScale(1.55, 1.55)
    }

    cardOut(pointer, localX, localY, event) {
        this.setScale(1.5, 1.5)
    }

    cardDown(pointer, localX, localY, event) {
        if (this.name === 'heal') {
            this.scene.healCardCD = 3000
            socket.emit('skills', 'Heal')
            console.log('heal')
        }
        if (this.name === 'damage') {
            this.scene.damageCardCD = 3000
            socket.emit('skills', 'Damage')
            console.log('damage')
        }

        this.disableInteractive()
    }

    buttonDown(pointer, localX, localY, event) {
        this.setFrame(1)
    }

    buttonUp(pointer, localX, localY, event) {
        this.setFrame(0)
        socket.emit('click');
    }

    update(time, delta) {
        this.timeElapsed += delta


        if (this.timeElapsed > 200) {
            socket.emit('server-update')
            this.timeElapsed = 0
        }

        if (this.healCardCD > 0) {
            this.healCardCD -= delta
            this.healCard.setAlpha(
                1 - (this.healCardCD / 5000),
                1 - (this.healCardCD / 5000),
                1 - (this.damageCardCD / 5000) + 0.4,
                1 - (this.damageCardCD / 5000) + 0.4)
            if (this.healCardCD <= 0) {
                this.healCard.setInteractive()
                    .emit('pointerover')
                this.healCard.emit('pointerout')
            }
        }
        if (this.damageCardCD > 0) {
            this.damageCardCD -= delta
            this.damageCard.setAlpha(
                1 - (this.damageCardCD / 5000),
                1 - (this.damageCardCD / 5000),
                1 - (this.damageCardCD / 5000) + 0.4,
                1 - (this.damageCardCD / 5000) + 0.4)
            if (this.damageCardCD <= 0) {
                this.damageCard.setInteractive()
                    .emit('pointerover')
                this.damageCard.emit('pointerout')
            }
        }

    }

}