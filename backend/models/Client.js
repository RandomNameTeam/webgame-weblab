class Client {
    socketId;
    hp = 100;
    commandResource = 0;
    maxCommandResource = 100;
    maxHp = 100;

    constructor(name) {
        this.name = name;
        this.lobbyId = null;

    }

    damage(value){
        this.hp -= value;
        console.log(this.name + " get damage:" + value);

    }

    heal(value){
        this.hp += value;
        if (this.hp > this.maxHp){
            this.hp = this.maxHp;
            return;
        }
        console.log(this.name + " healing on " + value + " hp:" + this.hp);

    }

    setCommandResource(value){
        this.commandResource+= value;
        if (this.commandResource > this.maxCommandResource){
            this.commandResource = this.maxCommandResource;
        }
    }

    getName(){
        return this.name;
    }

    getHp(){
        return this.hp;
    }

    getCommandResource(){
        return this.commandResource;
    }

    getLobbyId(){
        return this.lobbyId;
    }

    setLobbyId(value){
        this.lobbyId = value;
    }
    setSocketId(value){
        this.socketId = value;
    }

    getSocketId(){
        return this.socketId;
    }
}

module.exports = {Client}