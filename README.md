<img src="https://github.com/amandayhuang/feud-app/blob/master/frontend/public/images/logo.png" width="200" height="100" />

Feuding Friends is an interpretation of the Family Feud game show. 
It is centered around competing with friends or playing solo for the highest amount of points through three rounds per game. 
 
[Live Link](https://feuding-friends.herokuapp.com/#/)

## Features
A user can create a room, join a room or choose to play solo.

<img width="1440" alt="Screen Shot 2020-05-14 at 9 52 02 AM" src="https://user-images.githubusercontent.com/55370959/81942815-98561e80-95c8-11ea-85b3-55fd4b2b45ac.png">
<img width="1440" alt="Screen Shot 2020-05-14 at 9 55 22 AM" src="https://user-images.githubusercontent.com/55370959/81943330-3b0e9d00-95c9-11ea-9365-d631fcc3f2b2.png">

Users wait in a lobby for everyone in their group to join.
<img width="958" alt="Screen Shot 2020-04-24 at 1 46 23 PM" src="https://user-images.githubusercontent.com/55370959/80241988-971d7b80-8632-11ea-95e8-55b52b06be68.png">

Users are divided into two teams and compete by answering trivia questions.
<img width="1440" alt="Screen Shot 2020-05-14 at 9 55 54 AM" src="https://user-images.githubusercontent.com/55370959/81943573-8cb72780-95c9-11ea-9815-db72edf72f68.png">
<img width="1440" alt="Screen Shot 2020-05-14 at 9 56 02 AM" src="https://user-images.githubusercontent.com/55370959/81943583-8f198180-95c9-11ea-86de-5a1f32eca61b.png">

The opposing team can steal a round if the team playing receives three strikes.
<img width="958" alt="Screen Shot 2020-04-24 at 1 58 11 PM" src="https://user-images.githubusercontent.com/55370959/80242813-fcbe3780-8633-11ea-8818-dc7604448906.png">
<img width="958" alt="Screen Shot 2020-04-24 at 1 58 23 PM" src="https://user-images.githubusercontent.com/55370959/80242855-0cd61700-8634-11ea-9142-0bc448dba494.png">

At the end of the three rounds, the winning team can nominate a player to play a lightning round. 
<img width="960" alt="Screen Shot 2020-04-24 at 1 59 43 PM" src="https://user-images.githubusercontent.com/55370959/80242885-1c556000-8634-11ea-889e-5beda1a2ee6d.png">

## Code Highlights
### Fuzzball
Implemented Fuzzball (Javascript library) to enable fuzzy matching between user input and correct answers. Set the threshold to 56 so that answers would match if similar to expected answer. 
```
const Question = require("./question");
const AnswerModel = require("./models/Answer");
const QuestionModel = require("./models/Question");
const fuzz = require('fuzzball');
const FUZZ_THRESHOLD = 56;
...

receiveAnswer(answer) {
        let isCorrect = false;
        answer = answer.toLowerCase();

        for (let i = 0; i < this.roundAnswers.length; i++) {
            const element = this.roundAnswers[i];
            const correctAnswer = element.answer.toLowerCase();
            
            let fuzz_ratio = fuzz.ratio(answer, correctAnswer);

            if(this.phase === 'Steal the Round!'){
                if ((fuzz_ratio >= FUZZ_THRESHOLD) && !this.mentionedAnswers.includes(correctAnswer) && isCorrect === false) {
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
                if ((fuzz_ratio >= FUZZ_THRESHOLD) && !this.mentionedAnswers.includes(correctAnswer) && isCorrect === false){
                    this.mentionedAnswers.push(correctAnswer);
                    this.correctAnswerCount ++;
                    this.accumulatedPoints += element.points;
                    isCorrect = true;
                    console.log("correct answer");
                }
            }
        }
        ...
```
### WebSockets
Implemented socket.io for live updates so that multiple users can play Feuding Friends concurrently.
```
...
import io from "socket.io-client";
import RoomForm from "../room/room_form";
import Lobby from "../game/lobby";
import Game from "../game/game";
import SoloGame from "../game/solo_game";
import HOST from "../../util/host";
...
componentDidMount() {
    this.socket = io(HOST);
    this.socket.on("connect", (socket) => {
      // console.log("Frontend connected! Socket id: " + this.socket.id);

      this.socket.on("receiveConsoleMessage", (msg) => {
        // console.log(msg);
      });

      this.socket.on("receiveGameState", this.receiveGameState);
      this.socket.on("receiveRoomError", this.receiveRoomError);
      this.socket.on("joinRoom", this.joinRoom);
      this.socket.on("setPhase", this.setPhase);
      this.socket.on("receiveOtherAnswer", this.receiveOtherAnswer);
      this.socket.on("startNewRound", this.startNewRound);
      this.socket.on("endRound", this.endRound);
      this.socket.on("endGame", this.endGame);
      this.socket.on("pauseLightning", this.pauseLightning);
      this.socket.on("setGamePhase", this.setGamePhase);
    });
  }
...
 handleRoomJoin(action, roomName, nickname) {
    this.socket.emit(action, roomName, nickname); //action is 'join' or 'create'
  }

  handleAnswerSubmit(answer) {
    this.socket.emit("answer", answer, this.state.roomName);
  }

  handleStartGame() {
    this.socket.emit("startGame", this.state.roomName);
  }

  handleStartSolo() {
    this.socket.emit("startSolo");
    this.setState({ roomName: this.socket.id });
  }

  handleLeaveSolo() {
    this.setPhase("prelobby");
    this.setState({ gameState: { players: [] } });
    this.socket.emit("leaveRoom", this.state.roomName);
  }

  handleReset() {
    let { roomName } = this.state;
    this.socket.emit("resetGame", roomName);
  }
 ...

```


## Technologies 
* Mongoose(MongoDB)
* Express
* Node.JS
* React / Redux
* CSS / HTML
* [socket.io](https://socket.io/)
* [SCRIBD](https://www.scribd.com/doc/298239829/Family-Feud-Question-Database)
* [FUZZBALL](https://www.npmjs.com/package/fuzzball#installation)

## Group Members
* Adam Moftah
* Amanda Huang
* Jared Meier
* Nazia Islam

