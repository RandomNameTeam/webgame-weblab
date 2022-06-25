class CharacterEffects {
    constructor(scene,x,y,dir) {
        this.sprites = scene.add.sprite(x, y, "hero_effects")
            .setScale(5)
            .setFlipX(dir)

        this.stateMachine = {
            0: 1,
            1: 2,
            2: -1,
        }
        this.state = 2
        this.lastTime = 0
    }
    update(time, delta){
        if (time - this.lastTime > 500) {
            this.state = this.stateMachine[this.state]
            this.sprites.setFrame(this.state)
            this.lastTime = time
        }
    }

}
