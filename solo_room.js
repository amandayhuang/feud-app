const SoloGame = require("./solo_game");

class SoloRoom {
    constructor(roomName, io) {
        this.roomName = roomName;
        this.io = io;
        this.game = {
            visitedQs: [],
            round: 1,
            strikes: 0,
            correctAnswerCount: 0,
            mentionedAnswers: [],
            accumulatedPoints: 0,
            roundQuestion: {},
            roundAnswers: [],
            phase: "Start a New Game"
        };
    }

    getGameState() {
        let answerBoard = [];
        for (let i = 0; i < this.game.roundAnswers.length; i++) {
            const element = this.game.roundAnswers[i];
            const newEle = {};
            newEle.answer = element.answer;
            newEle.rank = element.rank

            if (this.game.mentionedAnswers.includes(element.answer.toLowerCase()) || this.game.phase === 'Reveal') {
                newEle.isRevealed = true;
            } else {
                newEle.isRevealed = false;
            }

            answerBoard.push(newEle);
        }

        return {
            question: this.game.roundQuestion.text,
            roundPoints: this.game.accumulatedPoints,
            strikes: this.game.strikes,
            answerBoard: answerBoard,
            round: this.game.round,
            phase: this.game.phase
        };
    }

    createGame() {
        this.game = new SoloGame(this.roomName, this.io);
        this.game.setQuestion().then(() => {
            this.game.setAnswers(this.game.roundQuestion.id).then(() => { console.log('game created') });
        });
    }

}

module.exports = SoloRoom;