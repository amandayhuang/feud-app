const Player = require ('./player');
const Game = require("./game");

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
     this.game = new Game(this.players);
     this.game.setQuestion()
        .then(question => {
        this.game.setAnswers().then(() => {
            console.log(`the question is ${this.game.roundQuestion}`);
        })
    })
    }

}

module.exports = Room;