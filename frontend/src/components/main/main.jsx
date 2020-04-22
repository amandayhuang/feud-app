import React from "react";
import "./main.css";
import io from "socket.io-client";
import RoomForm from "../room/room_form";
import AnswerForm from "../answer/answer_form";
import HOST from "../../util/host"

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joinedRoomId: "",
      gameState: {},
    };
    this.socket = null;
    this.receiveGameState = this.receiveGameState.bind(this);
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
    });
  }

  receiveGameState(gameState) {
    this.setState({ gameState: gameState });
  }

  handleRoomJoin(action, roomId) {
    this.socket.emit(action, roomId); //action is 'join' or 'create'
    this.setState({ joinedRoomId: roomId });
  }

  handleAnswerSubmit(answer) {
    this.socket.emit("answer", answer, this.state.joinedRoomId);
  }

  render() {
    const joinedRoomId =
      this.state.joinedRoomId === ""
        ? "Not in a room"
        : this.state.joinedRoomId;
    const gameState = JSON.stringify(this.state.gameState);
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
        <div className="answer-form-container">
          <AnswerForm
            handleAnswerSubmit={(answer) => this.handleAnswerSubmit(answer)}
          />
        </div>
        <div>{gameState}</div>
      </div>
    );
  }
}

export default Main;
