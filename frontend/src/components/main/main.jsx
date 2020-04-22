import React from "react";
import "./main.css";
import io from "socket.io-client";
import RoomForm from "../room/room_form";
import AnswerForm from "../answer/answer_form";
import Lobby from "../game/lobby";
import Game from "../game/game";
import HOST from "../../util/host";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joinedRoomId: "",
      gameState: {
        players: [],
      },
      roomErrors: "",
    };
    this.socket = null;
    this.receiveGameState = this.receiveGameState.bind(this);
    this.receiveRoomError = this.receiveRoomError.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
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
    });
  }

  receiveRoomError(error) {
    this.setState({ roomErrors: error });
  }

  joinRoom(roomId) {
    this.setState({ joinedRoomId: roomId, roomErrors: "" });
  }

  receiveGameState(gameState) {
    this.setState({ gameState: gameState });
  }

  handleRoomJoin(action, roomId, nickname) {
    this.socket.emit(action, roomId, nickname); //action is 'join' or 'create'
  }

  handleAnswerSubmit(answer) {
    this.socket.emit("answer", answer, this.state.joinedRoomId);
  }

  render() {
    const joinedRoomId =
      this.state.joinedRoomId === ""
        ? "Not in a room"
        : this.state.joinedRoomId;
    const { gameState, roomErrors } = this.state;
    const playerId = this.socket ? this.socket.id : null;
    return (
      <div className="main-container">
        <h1>Feuding Friends</h1>
        <h2>{joinedRoomId}</h2>
        <div className="room-form-container">
          <RoomForm
            handleRoomJoin={(action, roomId, nickname) =>
              this.handleRoomJoin(action, roomId, nickname)
            }
          />
        </div>
        <div>{roomErrors}</div>
        <div className="answer-form-container">
          <AnswerForm
            handleAnswerSubmit={(answer) => this.handleAnswerSubmit(answer)}
          />
        </div>
        <div>
          <Lobby gameState={gameState} playerId={playerId} />
        </div>
        <div>
          <Game gameState={gameState} />
        </div>
      </div>
    );
  }
}

export default Main;
