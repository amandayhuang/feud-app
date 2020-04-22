import React from "react";

class RoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: "join",
      roomId: "",
      nickname: "",
      phase: "decision",
    };
    this.handleRoomJoin = this.handleRoomJoin.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.switchForm = this.switchForm.bind(this);
  }

  updateForm(field) {
    return (e) => {
      this.setState({ [field]: e.target.value });
    };
  }

  handleRoomJoin(e) {
    e.preventDefault();
    const { action, roomId, nickname } = this.state;
    this.props.handleRoomJoin(action, roomId, nickname);
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
      buttonText = "Join Room";
      otherButtonText = "Create Room";
    } else {
      buttonText = "Create Room";
      otherButtonText = "Join Room";
    }

    if (phase === "decision") {
      chooseForm = (
        <div>
          <button
            onClick={() => {
              this.setState({ phase: "decided", action: "join" });
            }}
          >
            JOIN ROOM
          </button>
          <button
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
          type="text"
          placeholder="Enter room code"
          value={this.state.roomId}
          onChange={this.updateForm("roomId")}
        ></input>
      );
      enterNickname = (
        <input
          type="text"
          placeholder="Nickname"
          value={this.state.nickname}
          onChange={this.updateForm("nickname")}
        ></input>
      );

      roomForm = (
        <>
          <form onSubmit={this.handleRoomJoin} className="room-form">
            {enterRoomCode}
            {enterNickname}
            <button type="submit">{buttonText}</button>
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
