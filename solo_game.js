const AnswerModel = require("./models/Answer");
const QuestionModel = require("./models/Question");
const fuzz = require('fuzzball');

class SoloGame {
    constructor(roomName, io) {
        this.visitedQs = [];
        this.round = 1;
        this.strikes = 0;
        this.correctAnswerCount = 0;
        this.mentionedAnswers = [];
        this.accumulatedPoints = 0;
        this.roundQuestion = {};
        this.roundAnswers = [];
        this.phase = "Round " + this.round;
        this.roomName = roomName;
        this.io = io;

        // this.resetRound();
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

        visitedQs.push(randomNum);

        return QuestionModel.find({
            id: randomNum
            // id: 1739 //for testing
        })
        .then(question => {
            return question[0];
        })

    }

    fetchAnswers(questionId) {
        return AnswerModel.find({
            question_id: questionId
        })
            .then(answers => {
                return answers;
            })
    }

    receiveAnswer(answer) {
        let isCorrect = false;
        answer = answer.toLowerCase();

        for (let i = 0; i < this.roundAnswers.length; i++) {
            const element = this.roundAnswers[i];
            const correctAnswer = element.answer.toLowerCase();

            let fuzz_ratio = fuzz.ratio(answer, correctAnswer);


            if ((fuzz_ratio >= 50) && !this.mentionedAnswers.includes(correctAnswer) && isCorrect === false) {
                this.mentionedAnswers.push(correctAnswer);
                this.correctAnswerCount++;
                this.accumulatedPoints += element.points;
                isCorrect = true;
                console.log("correct answer");
            }
        }

        if (isCorrect === false) {
            this.strikes++;
            console.log("incorrect answer");
        }

        this.isRoundOver();
        return isCorrect;
    }

    resetRound() {
        setTimeout(() => {
            this.correctAnswerCount = 0;
            // this.accumulatedPoints = 0;
            this.strikes = 0;
            this.round += 1;
            this.mentionedAnswers = [];
            this.io.to(this.roomName).emit('startNewRound');
            this.phase = "Round " + this.round;
            this.setQuestion().then(() => {
                this.setAnswers(this.roundQuestion.id)
            });
        }, 2000);
    }


    isRoundOver() {
        if (this.correctAnswerCount === this.roundAnswers.length) {
            this.resetRound();
            return true;
        } else if (this.strikes === 3) {
            this.resetRound();
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = SoloGame;
