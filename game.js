const Question = require("./question");
const AnswerModel = require("./models/Answer");
const QuestionModel = require("./models/Question");
const fuzz = require('fuzzball');

class Game {
    constructor(players, roomName, io) {
        this.visitedQs = [];
        this.players = players;
        this.team1 = [];
        this.team2 = [];
        this.team1Points = 0;
        this.team2Points = 0;
        this.round = 1;
        this.strikes = 0;
        this.correctAnswerCount = 0;
        this.mentionedAnswers = [];
        this.accumulatedPoints = 0;
        this.roundQuestion = {};
        this.roundAnswers = [];
        this.phase = "Round "+this.round;
        for (var i = 0; i < players.length; i++) {
            let player = players[i];
            if (i % 2 === 0) {
                this.team1.push(player);
            } else {
                this.team2.push(player);
            }
        }
        this.currentTeam = this.team1;
        this.currentPlayer = this.team1[0];
        this.teamNum = 1;
        this.roomName = roomName;
        this.io = io;

        this.lightningRoundCount = 0;
    }
    
    setQuestion() {
        return this.fetchQuestion(this.visitedQs)
            .then(question => {
                this.roundQuestion = question;
            })
    }

    setAnswers() {
        return this.fetchAnswers(this.roundQuestion.id)
            .then(answers => {
                this.roundAnswers = answers;
            })
    }

    fetchQuestion(visitedQs) {
        let randomNum = Math.floor(Math.random() * Math.floor(3923));
        while (visitedQs.includes(randomNum)) {
          randomNum = Math.floor(Math.random() * Math.floor(3923));
        }

        return QuestionModel.find({
            id: randomNum
            // id: 1739 //for testing
        })
        .then(question => {
            return question[0];
        })
        // .catch(errors => console.log(errors))
        // mongoQ.exec((err, question) => {
        //     console.log(err);
        // });

        // return mongoQ;
        
    }

    fetchAnswers(questionId) {
        return AnswerModel.find({
           question_id: questionId
        })
        .then(answers => {
            return answers;
        })
    }

    switchTeams() {
        if (this.teamNum === 1) {
            this.currentTeam = this.team2;
            this.teamNum = 2;
            this.currentPlayer = this.team2[0];
        } else {
            this.currentTeam = this.team1;
            this.currentPlayer = this.team1[0];
            this.teamNum = 1;
        }
    }

    switchTurns() {
       let index = this.currentTeam.indexOf(this.currentPlayer);
        this.currentPlayer = this.currentTeam[(index + 1) % this.currentTeam.length];
    }

    receiveAnswer(answer) {
        let isCorrect = false;
        answer = answer.toLowerCase();

        for (let i = 0; i < this.roundAnswers.length; i++) {
            const element = this.roundAnswers[i];
            const correctAnswer = element.answer.toLowerCase();
            
            let fuzz_ratio = fuzz.ratio(answer, correctAnswer);

            if(this.phase === 'Steal the Round!'){
                if ((fuzz_ratio >= 50) && !this.mentionedAnswers.includes(correctAnswer) && isCorrect === false) {
                    this.mentionedAnswers.push(correctAnswer);
                    this.accumulatedPoints += element.points;
                    if (this.teamNum === 1) {
                        this.team1Points += this.accumulatedPoints;
                    } else {
                        this.team2Points += this.accumulatedPoints;
                    }  
                    console.log("correct answer");
                    isCorrect = true;
                }
            }else{
                if ((fuzz_ratio >= 50) && !this.mentionedAnswers.includes(correctAnswer) && isCorrect === false){
                    this.mentionedAnswers.push(correctAnswer);
                    this.correctAnswerCount ++;
                    this.accumulatedPoints += element.points;
                    isCorrect = true;
                    console.log("correct answer");
                }
            }
        }

        if(isCorrect === false){
            this.strikes ++;
            console.log("incorrect answer");
        }

        if(this.phase === 'Steal the Round!' && isCorrect === false){
            if (this.teamNum === 1) {
                this.team2Points += this.accumulatedPoints;
            } else {
                this.team1Points += this.accumulatedPoints;
            } 
            this.resetRound();
        }
        else if (this.phase === 'Steal the Round!' && isCorrect === true) {
            this.resetRound();
        }
        else if (this.phase === 'Lightning Round'){
            this.islightningRoundOver();
        }
        else{
            this.switchTurns();
            this.isRoundOver();
        }
        return isCorrect;
    }

    lightningRound() {
        this.io.to(this.roomName).emit('endround');
        this.phase = 'Lightning Round';
        if (this.team1Points > this.team2Points) {
            this.currentTeam = this.team1;
            this.teamNum = 1;
            this.currentPlayer = this.team1[0];
        } else {
            this.currentPlayer = this.team2[0];
            this.teamNum = 2;
            this.currentTeam = this.team2;
        }
        this.correctAnswerCount = 0;
        this.accumulatedPoints = 0;
        this.strikes = 0;
        this.round += 1;
        this.mentionedAnswers = [];
        this.setQuestion().then(() => {
            this.setAnswers(this.roundQuestion.id)
        });
    }

    islightningRoundOver() {
        if (this.lightningRoundCount === 4) {
            if (this.teamNum === 1) {
                this.team1Points += this.accumulatedPoints;
            } else {
                this.team2Points += this.accumulatedPoints;
            }
            this.accumulatedPoints = 0;
            this.io.to(this.roomName).emit('endGame');
            this.phase = 'Game Over';
        } else {
            this.lightningRoundCount++;
            this.mentionedAnswers = [];
            this.setQuestion().then(() => {
                this.setAnswers(this.roundQuestion.id)
            });
        }
    }

    stealRound() {
    this.phase = "Steal the Round!";
    this.switchTeams();
    }

    resetRound() {
        if(this.phase !== 'Steal the Round!'){
            this.switchTeams();
        }
        if(this.isGameOver()){
            setTimeout(() => {
                this.lightningRound();
            }, 2000);
        }else{
            this.io.to(this.roomName).emit('endRound');
            setTimeout(() => {
                this.correctAnswerCount = 0;
                this.accumulatedPoints = 0;
                this.strikes = 0;
                this.round += 1;
                this.mentionedAnswers = [];
                this.phase = "Round " + this.round;
                this.setQuestion().then(() => {
                    this.setAnswers(this.roundQuestion.id)
                });
            }, 2000);
        }
    }

    isGameOver() {
        if (this.round === 3) {
            return true;
        } else {
            return false;
        }

    }

    isRoundOver() {
        if (this.correctAnswerCount === this.roundAnswers.length) {
            if(this.teamNum === 1){
                this.team1Points += this.accumulatedPoints;
            }else{
                this.team2Points += this.accumulatedPoints;
            }
            this.resetRound();
            return true;
        } else if (this.strikes === 3){
            this.stealRound();
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = Game;
