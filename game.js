const Question = require("./question");
const AnswerModel = require("./models/Answer");

class Game {
    constructor(players) {
        this.visitedQs = [];
        this.players = players;
        this.team1 = []
        this.team2 = []
        this.team1Score = 0
        this.team2Score = 0
        this.round = 1
        this.roundPoints = 0
        this.currentTeam = this.team1
        this.currentPlayer = this.team1[0];
        this.currentQuestion = { id: 0, text: '' }
        this.strikes = 0
        for (var i = 0; i < players.length; i++) {
            let player = players[i];
            if (i % 2 === 0) {
                this.team1.push(player);
            } else {
                this.team2.push(player);
            }
        }
    //    this.fetchQuestion(this.visitedQs).then(question => this.currentQuestionId = question.id);
    }

    fetchQuestion(visitedQs) {
        let randomNum = Math.floor(Math.random() * Math.floor(3923));
        while (visitedQs.includes(randomNum)) {
          randomNum = Math.floor(Math.random() * Math.floor(3923));
        }

        return new Question(randomNum);
    }

    fetchAnswers(questionId) {
         return AnswerModel.find({
           question_id: questionId,
         }).then((answers) => 
            (answers) 
         )
    }


    switchTeams() {
        if (this.currentTeam === this.team1) {
            this.currentTeam = this.team2;
        } else {
            this.currentTeam = team1;
        }
    }

    switchTurns() {
        
    }

    receiveAnswer(answer){
        // check if answer exists for current question
        // refer to fetchAnswers 
        //update points if valid answer
    }

    resetRound () {
        
    }


}

module.exports = Game;