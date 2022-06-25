class Character {
    constructor(scene, x, y, dir, tint) {
        this.sprites = scene.add.sprite(x, y, tint)
            .setScale(0.5)
            .setFlipX(dir)

        // this.stateMachine = {
        //     0: [0, 1],
        //     1: [1, 0],
        //     2: [2, 3],
        //     3: [3, 4],
        //     4: [4, 5],
        //     5: [5, 0],
        //     6: [6, 6],
        //     7: [7, 8],
        //     8: [7, 9],
        //     9: [7, 0],
        // }
        this.stateMachine = {
            0: [0, 0],
            1: [1, 0],
            2: [1, 3],
            3: [1, 4],
            4: [1, 0],
            5: [0, 0],
            6: [2, 6],
            7: [2, 8],
            8: [2, 9],
            9: [2, 10],
            10: [2, 0],
        }
        this.state = 0
        this.lastTime = 0
        this.flag = false
        this.effects = new CharacterEffects(scene, x, y, dir);
    }

    update(time, delta) {
        this.sprites.setFrame(this.stateMachine[this.state][0])
        switch (this.state) {
            default:
            case 0:
            case 1:
                if (time - this.lastTime > 1000) this.flag = true
                break
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                if (time - this.lastTime > 200) this.flag = true
                break
            case 7:
                if (time - this.lastTime > 200) {
                    this.flag = true
                }
                this.sprites.setTint(0xff0000)
                break
            case 8:
                if (time - this.lastTime > 200) {
                    this.flag = true
                }
                this.sprites.setTint(0x000000)
                break
            case 9:
                if (time - this.lastTime > 200) {
                    this.flag = true
                }
                this.sprites.setTint(0xff0000)
                break
            case 10:
                if (time - this.lastTime > 200) {
                    this.flag = true
                }
                this.sprites.setTint(0xffffff)
                break

        }

        if (this.flag) {
            this.state = this.stateMachine[this.state][1]
            this.lastTime = time
            this.flag = false
        }
        this.effects.update(time, delta)


    }
}