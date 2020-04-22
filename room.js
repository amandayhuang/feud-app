class Room {
    constructor(roomName,initialPlayer={}){
        this.roomName = roomName;
        this.game = {};
        this.players = [initialPlayer];
    }

    addPlayer(player){
        this.players.push(player);
    }

    getGameState(){
        //refers to this.game 
        // team scores
        // current players 
    }

    createGame(){
        
    }


}

module.exports = Room;