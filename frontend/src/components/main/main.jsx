import React from "react";
import "./main.css";
import io from "socket.io-client";
import RoomForm from "../room/room_form";
import Lobby from "../game/lobby";
import Game from "../game/game";
import SoloGame from "../game/solo_game";
import HOST from "../../util/host";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: "",
      gameState: {
        players: [],
      },
      roomErrors: "",
      gameErrors: "",
      otherAnswer: null,
      phase: "prelobby",
      gamePhase: "round",
    };
    this.socket = null;
    this.otherAnswerTimer = null;
    // this.startRoundTimer = null;
    this.receiveGameState = this.receiveGameState.bind(this);
    this.receiveRoomError = this.receiveRoomError.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.setPhase = this.setPhase.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
    this.receiveOtherAnswer = this.receiveOtherAnswer.bind(this);
    this.startNewRound = this.startNewRound.bind(this);
    this.endRound = this.endRound.bind(this);
    this.endGame = this.endGame.bind(this);
    this.pauseLightning = this.pauseLightning.bind(this);
    this.setGamePhase = this.setGamePhase.bind(this);
  }

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

  receiveRoomError(error) {
    this.setState({ roomErrors: error });
  }

  joinRoom(roomName) {
    this.setState({ roomName: roomName, roomErrors: "", phase: "lobby" });
  }

  setPhase(phase) {
    this.setState({ phase: phase });
  }

  setGamePhase(phase) {
    this.setState({ gamePhase: phase });
  }

  startNewRound() {
    // console.log("starting new round");
    this.setState({ gamePhase: "newRound" });
    setTimeout(() => {
      this.setState({ gamePhase: "round" });
      // console.log("returning to game");
    }, 5000);
  }

  endRound() {
    // console.log("ending round");
    this.setState({ gamePhase: "endRound" });
    setTimeout(() => {
      this.startNewRound();
      // console.log("in between rounds");
    }, 2000);
  }

  endGame() {
    // console.log("game over");
    this.setState({ gamePhase: "endGame" });
  }

  pauseLightning() {
    console.log("pausing lightning round");
    this.setState({ gamePhase: "pauseLightning" });
    setTimeout(() => {
      this.setState({ gamePhase: "round" });
      console.log("resuming lightning round");
    }, 1000);
  }

  receiveGameState(gameState) {
    this.setState({ gameState: gameState });
  }

  receiveOtherAnswer(playerId, answer) {
    if (this.otherAnswerTimer) {
      clearInterval(this.otherAnswerTimer);
    }
    this.otherAnswerTimer = setInterval(
      () => this.setState({ otherAnswer: null }),
      3000
    );
    this.setState({ otherAnswer: { playerId, answer } });
  }

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

  render() {
    const roomName = this.state.roomName === "" ? "" : this.state.roomName;
    const { gameState, roomErrors, phase, gamePhase, otherAnswer } = this.state;
    const playerId = this.socket ? this.socket.id : null;
    let prelobby, lobby, game;

    if (phase === "prelobby") {
      prelobby = (
        <>
          <img id="logo" src="images/logo.png" alt="Feuding Friends Logo" />
          <div className="room-form-container">
            <RoomForm
              handleRoomJoin={(action, roomName, nickname) =>
                this.handleRoomJoin(action, roomName, nickname)
              }
              handleStartSolo={() => this.handleStartSolo()}
            />
          </div>
          <div className="errors">{roomErrors}</div>
        </>
      );
    } else if (phase === "lobby") {
      lobby = (
        <div>
          <img id="logo" src="images/logo.png" alt="Feuding Friends Logo" />
          <h2 className="room-name">{roomName}</h2>
          <Lobby
            gameState={gameState}
            playerId={playerId}
            handleStartGame={() => this.handleStartGame()}
          />
        </div>
      );
    } else if (phase === "game") {
      game = (
        <div>
          <img
            id="logo-in-game"
            src="images/logo.png"
            alt="Feuding Friends Logo"
          />
          <h2 className="room-name in-game">{roomName}</h2>
          <Game
            gameState={gameState}
            playerId={playerId}
            handleAnswerSubmit={(answer) => this.handleAnswerSubmit(answer)}
            handleReset={() => this.handleReset()}
            gamePhase={gamePhase}
            otherAnswer={otherAnswer}
          />
        </div>
      );
    } else if (phase === "solo") {
      game = (
        <div>
          <img
            id="logo-in-game"
            src="images/logo.png"
            alt="Feuding Friends Logo"
          />
          <SoloGame
            gameState={gameState}
            gamePhase={gamePhase}
            handleAnswerSubmit={(answer) => this.handleAnswerSubmit(answer)}
            handleLeaveSolo={() => this.handleLeaveSolo()}
          />
        </div>
      );
    }

    return (
      <div className="main-container">
        {prelobby}
        {lobby}
        {game}
      </div>
    );
  }
}

export default Main;
