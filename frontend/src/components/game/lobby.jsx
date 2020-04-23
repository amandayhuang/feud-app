import React from "react";

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: "",
    };
  }

  render() {
    const { players } = this.props.gameState;
    const { playerId, handleStartGame } = this.props;
    const playersList = players.map((player) => {
      if (player.id === playerId) {
        return (
          <li className="player-item" key={player.id}>
            <b>{player.name}</b>
          </li>
        );
      } else {
        return (
          <li className="player-item" key={player.id}>
            {player.name}
          </li>
        );
      }
    });
    return (
      <div className="lobby-player-container">
        <div className="players-list-container">
          <span className="lobby-title">Players in Lobby</span>
          <ul className="players-list">{playersList}</ul>
        </div>
        <button className="start-button" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    );
  }
}

export default Lobby;
