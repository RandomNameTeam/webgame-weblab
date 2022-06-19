class Lobby {
    constructor(client1, client2, id) {
        this.id = id;
        this.clients = [];
        this.clients.push(client1);
        this.clients.push(client2);
    }

    getId() {
        return this.id;
    }

    getClient(index) {
        if (!Number.isInteger(index)) {
            console.log("Error don't have client with index " + index + " in this lobbi")
            return -1;
        } else if (index > -1 && index < this.clients.length) {
            console.log("Error don't have client with index " + index + " in this lobbi")
            return -1;
        } else {
            return this.clients[index];
        }
    }
}

module.exports = {Lobby}