const Player = require ('./player');

class Room {
    constructor(roomName){
        this.roomName = roomName;
        this.game = {};
        this.players = [];
    }

    addPlayer(nickname, playerId){
        this.players.push( new Player(nickname, playerId));
    }

    getGameState(){
        //refers to this.game 
        // team scores
        // current players 
        return ({
            players: this.players,
        })
    }

    createGame(){
        
    }


}

module.exports = Room;