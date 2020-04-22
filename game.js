const Question = require("./question");
const AnswerModel = require("./models/Answer");
const QuestionModel = require("./models/Question");

class Game {
    constructor(players) {
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
    //    this.fetchQuestion(this.visitedQs).then(question => this.currentQuestionId = question.id);

    fetchQuestion(visitedQs) {
        let randomNum = Math.floor(Math.random() * Math.floor(3923));
        while (visitedQs.includes(randomNum)) {
          randomNum = Math.floor(Math.random() * Math.floor(3923));
        }

        return QuestionModel.find({
            id: randomNum
            // id: 3072 //for testing
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

  fetchAnswers(questionId) {
    return AnswerModel.find({
      question_id: questionId,
    }).then((answers) => answers);
  }

    switchTeams() {
        if (this.currentTeam === this.team1) {
            this.currentTeam = this.team2;
            this.currentPlayer = this.team2[0];
        } else {
            this.currentTeam = this.team1;
            this.currentPlayer = this.team1[0];
        }
    }

    switchTurns() {
       let index = this.currentTeam.indexOf(this.currentPlayer);
        this.currentPlayer = this.currentTeam[(index + 1) % this.currentTeam.length];
    }

    receiveAnswer(answer) {
        let team = this.currentTeam === this.team1 ? "team1" : "team2";
        let isCorrect = false;
        let isDupe = false;
        answer = answer.toLowerCase();

        for (let i = 0; i < this.roundAnswers.length; i++) {
            const element = this.roundAnswers[i];
            const correctAnswer = element.answer.toLowerCase();
            if (answer === correctAnswer && !this.mentionedAnswers.includes(answer)){
                this.mentionedAnswers.push(answer);
               
                this.correctAnswerCount ++;
                this.accumulatedPoints += element.points;
                isCorrect = true;
                console.log("correct answer");
            }
            else if(this.mentionedAnswers.includes(answer)){
                isDupe = true;
            }
        }

        if(isCorrect === false && isDupe === false){
            this.strikes ++;
            console.log("incorrect answer");
        }

        this.switchTurns();
        this.isRoundOver();
        return isCorrect;
    }


    stealRound() {
        // start on this once sure all other logic is working 
        //logic for when a team gets 3 strikes current team will be switched and currentPlayer is asked the question 
        //being asked in currentRound, and if they get it right they get accumulatedPoints of that round 
        // and either way if wrong or right a new round will be started after. 
    }

    // resetRound() {
    //     if (isRoundOver() && !this.isGameOver()) {
    //         this.switchTeams();

    //     }
    // }

    isGameOver() {
        if (this.round === 3) {
            return true;
        } else {
            return false;
        }

    }

    isRoundOver() {
        if (this.correctAnswerCount === this.roundAnswers.length) {
            this.correctAnswerCount = 0;
            this.strikes = 0;
            this.round += 1;
            if(this.currentTeam === this.team1){
                this.team1Points += this.accumulatedPoints;
            }else{
                this.team2Points += this.accumulatedPoints;
            }
            this.accumulatedPoints = 0;
            this.switchTeams();
            this.setQuestion().then(() => {
                this.setAnswers(this.roundQuestion.id)
            })
            return true;
        } else if (this.strikes === 3){
            this.correctAnswerCount = 0;
            this.strikes = 0;
            this.round += 1;
            this.accumulatedPoints = 0;
            this.switchTeams();
            this.setQuestion().then(() => {
                this.setAnswers(this.roundQuestion.id)
            })
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = Game;
