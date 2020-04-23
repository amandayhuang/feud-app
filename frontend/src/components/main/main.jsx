import React from "react";
import "./main.css";
import io from "socket.io-client";
import RoomForm from "../room/room_form";
import Lobby from "../game/lobby";
import Game from "../game/game";
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
      phase: "prelobby",
    };
    this.socket = null;
    this.receiveGameState = this.receiveGameState.bind(this);
    this.receiveRoomError = this.receiveRoomError.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.setPhase = this.setPhase.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
  }

  componentDidMount() {
    //the URL passed to io when setting this up needs to change based on environment
    this.socket = io(HOST);
    this.socket.on("connect", (socket) => {
      console.log("Frontend connected! Socket id: " + this.socket.id);

      this.socket.on("receiveConsoleMessage", (msg) => {
        console.log(msg);
      });

      this.socket.on("receiveGameState", this.receiveGameState);
      this.socket.on("receiveRoomError", this.receiveRoomError);
      this.socket.on("joinRoom", this.joinRoom);
      this.socket.on("setPhase", this.setPhase);
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

  receiveGameState(gameState) {
    this.setState({ gameState: gameState });
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

  render() {
    const roomName = this.state.roomName === "" ? "" : this.state.roomName;
    const { gameState, roomErrors, phase } = this.state;
    const playerId = this.socket ? this.socket.id : null;
    let prelobby, lobby, game;

    if (phase === "prelobby") {
      prelobby = (
        <>
          <div className="room-form-container">
            <RoomForm
              handleRoomJoin={(action, roomName, nickname) =>
                this.handleRoomJoin(action, roomName, nickname)
              }
            />
          </div>
          <div>{roomErrors}</div>
        </>
      );
    } else if (phase === "lobby") {
      lobby = (
        <div>
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
          <Game
            gameState={gameState}
            playerId={playerId}
            handleAnswerSubmit={(answer) => this.handleAnswerSubmit(answer)}
          />
        </div>
      );
    }

    return (
      <div className="main-container">
        <img id="logo" src="logo.svg" />
        <h2>{roomName}</h2>
        {prelobby}
        {lobby}
        {game}
      </div>
    );
  }
}

export default Main;
