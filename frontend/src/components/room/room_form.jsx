import React from "react";
import { removeNonAlpha } from "../../util/string_validation";

class RoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: "join",
      roomId: "",
      nickname: "",
      phase: "decision",
    };
    this.roomCodeMaxLength = 5;
    this.nicknameMaxLength = 8;
    this.handleRoomJoin = this.handleRoomJoin.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.switchForm = this.switchForm.bind(this);
  }

  updateForm(field) {
    return (e) => {
      const value = removeNonAlpha(e.target.value);
      this.setState({ [field]: value });
    };
  }

  handleRoomJoin(e) {
    e.preventDefault();
    const { action, roomId, nickname } = this.state;
    this.props.handleRoomJoin(action, roomId.toUpperCase(), nickname);
    this.setState({ roomId: "", nickname: "" });
  }

  switchForm() {
    const newForm = this.state.action === "join" ? "create" : "join";
    this.setState({ action: newForm });
  }

  render() {
    const { action, phase } = this.state;
    let buttonText,
      otherButtonText = "";
    let chooseForm, enterRoomCode, enterNickname, roomForm;

    if (action === "join") {
      buttonText = "JOIN ROOM";
      otherButtonText = "CREATE ROOM";
    } else {
      buttonText = "CREATE ROOM";
      otherButtonText = "JOIN ROOM";
    }

    if (phase === "decision") {
      chooseForm = (
        <div>
          <button
            className="landing-buttons"
            onClick={() => {
              this.setState({ phase: "decided", action: "join" });
            }}
          >
            JOIN ROOM
          </button>
          <button
            className="landing-buttons"
            onClick={() => {
              this.setState({ phase: "decided", action: "create" });
            }}
          >
            CREATE ROOM
          </button>
        </div>
      );
    } else if (phase === "decided") {
      enterRoomCode = (
        <input
          className="room-form-input"
          type="text"
          placeholder="Enter room code"
          value={this.state.roomId.toUpperCase()}
          onChange={this.updateForm("roomId")}
          maxLength={this.roomCodeMaxLength}
        ></input>
      );
      enterNickname = (
        <input
          className="room-form-input"
          type="text"
          placeholder="Nickname"
          value={this.state.nickname}
          onChange={this.updateForm("nickname")}
          maxLength={this.nicknameMaxLength}
        ></input>
      );

      roomForm = (
        <>
          <form onSubmit={this.handleRoomJoin} className="room-form">
            {enterRoomCode}
            {enterNickname}
            <button className="form-submit-button" type="submit">
              {buttonText}
            </button>
          </form>
          <button onClick={this.switchForm}>Or {otherButtonText}...</button>
        </>
      );
    }

    return (
      <>
        {chooseForm}
        {roomForm}
      </>
    );
  }
}

export default RoomForm;
