const Player = require ('./player');
const Game = require("./game");

class Room {
    constructor(roomName){
        this.roomName = roomName;
        this.game = {
            visitedQs: [],
            players : [],
            team1 : [],
            team2 : [],
            team1Points : 0,
            team2Points : 0,
            round : 1,
            strikes : 0,
            correctAnswerCount : 0,
            mentionedAnswers : [],
            accumulatedPoints : 0,
            roundQuestion : {},
            roundAnswers : [],
            phase : "empty_game",
            teamNum: 0
        };
        this.players = [];
    }

    addPlayer(nickname, playerId){
        this.players.push( new Player(nickname, playerId));
    }

    getGameState(){
        let answerBoard = [];
        for (let i = 0; i < this.game.roundAnswers.length; i++) {
            const element = this.game.roundAnswers[i];
            const newEle = {};
            newEle.answer = element.answer;
            newEle.rank = element.rank
            
            if(this.game.mentionedAnswers.includes(element.answer.toLowerCase())){
                newEle.isRevealed = true;
            }else{
                newEle.isRevealed = false;
            }

            answerBoard.push(newEle);
        }
        
        return {
          players: this.players,
          team1players: this.game.team1,
          team2players: this.game.team2,
          currentTeam: this.game.currentTeam,
          question: this.game.roundQuestion.text,
          team1points: this.game.team1Points,
          team2points: this.game.team2Points,
          roundPoints: this.game.accumulatedPoints,
          currentPlayer: this.game.currentPlayer,
          strikes: this.game.strikes,
          answerBoard: answerBoard,
          round: this.game.round,
          phase: this.game.phase,
          teamNum: this.game.teamNum
        };
    }

    // createGame(){
    //  this.game = new Game(this.players);
    //  return this.game.setQuestion()
    //     .then(question => {
    //     this.game.setAnswers().then(() => {
    //         console.log(`the question is ${this.game.roundAnswers}`);
    //     })
    // })
    // }

    // createGame(){
    //     this.game = new Game(this.players);
    //     return this.game.setQuestion()
    //     .then(() => {
    //         // console.log(this.game.roundQuestion);
    //         this.game.setAnswers(this.game.roundQuestion.id);
    //     }
    //     )
    // }

}

module.exports = Room;