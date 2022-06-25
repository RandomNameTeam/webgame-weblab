class Scene1 extends Phaser.Scene {


    constructor() {
        super("playGame")
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
        this.load.spritesheet("hero", "sprites/hero.png", {
            frameWidth: 98,
            frameHeight: 48
        })
        this.load.spritesheet("hero_effects", "sprites/hero_effects.png", {
            frameWidth: 98,
            frameHeight: 48
        })

        this.load.bitmapFont("pixelFont",
            "font/MatchupPro.png",
            "font/MatchupPro.xml")
    }

    create() {
        this.createBackground()
        this.hero = new Character(this,game.config.width / 2 - 100, game.config.height / 2 + 100, false)
        this.enemy = new Character(this,game.config.width / 2 + 100, game.config.height / 2 + 100, true, 0xaa0000)
        this.initUI()
        this.timeElapsed = 0
        this.skillsCoolDown = 3000 // ms
        this.transittionDuration = 4000 // ms
        this.transittionDurationElapsed = 0 // ms
        this.commandResource = 0

        if (!config.debug) this.socketsInit()


    }

    socketsInit() {
        socket.on('client-update', (selfHp, commandResource, enemyHp) => {
            this.updateUI(selfHp, commandResource, enemyHp)
            console.log("My hp: " + selfHp +
                " my commandResource: " + commandResource +
                "enemyHp " + enemyHp);
        })
        socket.on('death', () => {
            console.log("defeat")
            this.scene.transition({
                target: "endGame",
                data: {
                    state: 'defeat'
                },
                duration: this.transittionDuration,
                remove: true,
                moveBelow: true,
                onUpdate: this.transitionUpdate,
                onUpdateScope: this,
                sleep: true
            })
            this.hero.state = 6
        })
        socket.on('win', () => {
            console.log("victory")
            this.scene.transition({
                target: "endGame",
                data: {
                    state: 'victory'
                },
                duration: this.transittionDuration,
                remove: true,
                moveBelow: true,
                onUpdate: this.transitionUpdate,
                onUpdateScope: this,
                sleep: true
            })
            this.enemy.state = 6
        })
        socket.on('enemy-heal', (value) =>{
            console.log("enemy healind on " + value);
            this.enemy.effects.state = 0
        })
        socket.on('enemy-attack', (value) =>{
            console.log("enemy ataked on " + value);
            this.enemy.state = 2
            this.hero.state = 7
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

        this.blackscreen = this.add.rectangle(0, 0, game.config.width * 2, game.config.height * 2, 0x000000)
        this.blackscreen.setAlpha(0)

        this.createButton()
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

        this.commandResource = commandResource
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
        if (!config.debug) if (this.scene.commandResource < 10) return

        if (this.name === 'heal') {
            console.log('heal')
            this.scene.hero.effects.state = 0
            this.scene.healCardCD = this.scene.skillsCoolDown
            if (!config.debug) socket.emit('skills', 'Heal')
        }
        if (this.name === 'damage') {
            console.log('damage')
            this.scene.damageCardCD = this.scene.skillsCoolDown
            if (!config.debug) socket.emit('skills', 'Damage')
            this.scene.hero.state = 2
            this.scene.enemy.state = 7
        }

        this.disableInteractive()
    }

    buttonDown(pointer, localX, localY, event) {
        this.setFrame(1)
    }

    buttonUp(pointer, localX, localY, event) {
        this.setFrame(0)
        if (!config.debug) socket.emit('click');
        console.log('click')
    }

    uiUpdate(time, delta) {
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

    serverUpdate(time, delta) {

        this.timeElapsed += delta

        if (this.timeElapsed > 200) {
            if (!config.debug) socket.emit('server-update')
            this.timeElapsed = 0
        }
    }

    update(time, delta) {

        this.serverUpdate(time, delta)
        this.uiUpdate(time, delta)

        this.hero.update(time, delta)
        this.enemy.update(time, delta)

    }

    transitionUpdate() {
        this.transittionDurationElapsed += 20
        let alpha = (this.transittionDurationElapsed / this.transittionDuration)
        this.blackscreen.setAlpha(alpha)
    }
}