const Game = require("./game");
const Player = require("./player");
const mongoose = require("mongoose");
// const db = "mongodb+srv://devNaz:cQWAPKXRMQyaPCSn@cluster0-qcqag.mongodb.net/feud?retryWrites=true&w=majority";
const db = "mongodb://devNaz:cQWAPKXRMQyaPCSn@cluster0-shard-00-00-qcqag.mongodb.net:27017,cluster0-shard-00-01-qcqag.mongodb.net:27017,cluster0-shard-00-02-qcqag.mongodb.net:27017/feud?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.log(err));


const player1 = new Player("adam", 123);
const player2 = new Player("amanda", 124);
const player3 = new Player("Naz", 125);
const player4 = new Player("Jared", 126);

const game = new Game([player1, player2, player3, player4]);

// console.log(game.team1);
// console.log(game.team2);
game.setQuestion()
  .then(question => {
    game.setAnswers().then(() => {
        console.log(game.roundQuestion.text);
        console.log(game.roundAnswers);
        // console.log(`current team: ${game.currentTeam}`);
        console.log(`current player: ${game.currentPlayer.name} correctAnswers: ${game.correctAnswerCount} strikes: ${game.strikes}`);
        game.receiveAnswer("breasts");
        console.log(`current player: ${game.currentPlayer.name} correctAnswers: ${game.correctAnswerCount} strikes: ${game.strikes}`);
        game.receiveAnswer("butt");
        console.log(`current player: ${game.currentPlayer.name} correctAnswers: ${game.correctAnswerCount} strikes: ${game.strikes}`);
        game.receiveAnswer("back");
        console.log(`current player: ${game.currentPlayer.name} correctAnswers: ${game.correctAnswerCount} strikes: ${game.strikes}`);
        game.receiveAnswer("fewfew");
        console.log(`current player: ${game.currentPlayer.name} correctAnswers: ${game.correctAnswerCount} strikes: ${game.strikes}`);
        game.receiveAnswer("fewfew");
        console.log(`current player: ${game.currentPlayer.name} correctAnswers: ${game.correctAnswerCount} strikes: ${game.strikes}`);
        console.log(`team1points ${game.team1Points} team2points ${game.team2Points}`)
    })
  });

