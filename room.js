class Room {
    constructor(roomName,initialPlayer){
        this.roomName = roomName;
        this.game = {};
        this.players = [initialPlayer];
    }

    addPlayer(player){
        this.players.push(player);
    }

}

module.exports = Room;