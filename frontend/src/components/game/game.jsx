import React from "react";
import AnswerForm from "../answer/answer_form";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: "",
      cheat: false,
    };
  }

  isMyTurn() {
    const { currentPlayer } = this.props.gameState;
    const { playerId } = this.props;
    if (currentPlayer && currentPlayer.id === playerId) {
      return true;
    } else {
      return false;
    }
  }

  findPlayerById(playerId) {
    const { team1players, team2players } = this.props.gameState;
    const allPlayers = team1players.concat(team2players);
    let playerFound;
    allPlayers.forEach((player) => {
      if (player.id === playerId) playerFound = player;
    });
    return playerFound;
  }

  toggleCheat() {
    const cheat = this.state.cheat;
    this.setState({ cheat: !cheat });
  }

  createStrikesList(strikes) {
    const strikesList = [];
    for (let i = 0; i < strikes; i++) {
      strikesList.push(
        <li key={i}>
          <img id="strike" src="images/strike.png" alt="" />
        </li>
      );
    }
    for (let i = 0; i < 3 - strikes; i++) {
      strikesList.push(
        <li key={i}>
          <img id="unstrike" src="images/strike.png" alt="" />
        </li>
      );
    }
    return strikesList.slice(0, 3);
  }

  createAnswerSection(handleAnswerSubmit, currentPlayer) {
    if (this.isMyTurn()) {
      return (
        <AnswerForm
          handleAnswerSubmit={(answer) => handleAnswerSubmit(answer)}
        />
      );
    } else {
      return (
        <h3 className="current-player">
          {currentPlayer ? `${currentPlayer.name}'s turn!` : ""}
        </h3>
      );
    }
  }

  createOtherPlayerAnswerSection(otherAnswer) {
    if (otherAnswer) {
      if (otherAnswer.answer === "") {
        return (
          <h3>{`${
            this.findPlayerById(otherAnswer.playerId).name
          } didn't answer!`}</h3>
        );
      } else {
        return (
          <h3>{`${this.findPlayerById(otherAnswer.playerId).name} said ${
            otherAnswer.answer
          }!`}</h3>
        );
      }
    }
  }

  createAnswerList(answerBoard) {
    return answerBoard.map((answer, idx) => {
      if (this.state.cheat) {
        return <li key={idx}>{answer.answer}</li>;
      } else {
        return (
          <li key={idx}>
            {answer.isRevealed ? `${answer.answer}` : `${idx + 1}`}
          </li>
        );
      }
    });
  }

  setContainers() {
    const { handleAnswerSubmit, gamePhase, otherAnswer } = this.props;
    const {
      question,
      answerBoard,
      roundPoints,
      strikes,
      phase,
      currentPlayer,
      teamNum,
      team1points,
      team2points,
      team1players,
      team2players
    } = this.props.gameState;

    const currentTeamText = teamNum ? `Team ${teamNum}` : "";

    const strikesList = this.createStrikesList(strikes);
    const answerSection = this.createAnswerSection(
      handleAnswerSubmit,
      currentPlayer
    );
    const otherPlayerAnswerSection = this.createOtherPlayerAnswerSection(
      otherAnswer
    );
    const answerList = this.createAnswerList(answerBoard);
    const team1List = team1players.map(player => {
        return (
            <li key={player.id}>
                {player.name}
            </li>
        )
    })
    const team2List = team2players.map(player => {
        return (
            <li key={player.id}>
                {player.name}
            </li>
        )
    })

    let gameContainer, newRoundContainer, emptyContainer, endGameContainer;
    switch (gamePhase) {
      case "round":
      case "endRound":
      case "pauseLightning":
        gameContainer = (
          <div className="game-container">
            <div className="round-info">
                <div className="game-phase">{phase}</div>
                <div className="team-name">{currentTeamText} is up!</div>
            </div>
            <div className="question">
              <h1>{question}</h1>
            </div>
            <div className="round-points">{roundPoints}</div>
            <div className="answer-board">
              <ul>{answerList}</ul>
              <ul className="strikes-list">{strikesList}</ul>
            </div>
            <div className="answer-form-container">
              {gamePhase === "round" ? answerSection : ""}
            </div>
            <div className="other-answers">{otherPlayerAnswerSection}</div>
            <div>
              <button onClick={() => this.toggleCheat()}></button>
            </div>
          </div>
        );
        break;
      case "newRound":
        newRoundContainer = (
          <div className="round-change-container">
            <h1>Starting {phase}...</h1>
            <div className="team-container">
                <h1>Team 1</h1>
                <ul>
                    {team1List}
                </ul>
                <div className="round-sum-points">
                     {team1points}
                </div>
            </div>
            <div className="team-container">
                <h1>Team 2</h1>
                <ul>
                    {team2List}
                </ul>
                <div className="round-sum-points">
                    {team2points}
                </div>
            </div>
          </div>
        );
        break;
      case "endGame":
        endGameContainer = (
          <div className="round-change-container end-game">
            <h1>Game Over!</h1>
            <div className={`team-container ${team1points > team2points ? 'winner' : ''}`}>
                <h1>Team 1</h1>
                <ul>
                    {team1List}
                </ul>
                <div className="round-sum-points">
                     {team1points}
                </div>
                <div className={`winner-text ${team1points > team2points ? '' : 'hidden'}`}>
                    <h1>WINNER!</h1>
                </div>
            </div>
            <div className={`team-container ${team2points > team1points ? 'winner' : ''}`}>
                <h1>Team 2</h1>
                <ul>
                    {team2List}
                </ul>
                <div className="round-sum-points">
                     {team2points}
                </div>
                <div className={`winner-text ${team2points > team1points ? '' : 'hidden'}`}>
                    <h1>WINNER!</h1>
                </div>
            </div>
          </div>
        );
        break;
      default:
        emptyContainer = <div>Loading...</div>;
    }
    return {
      gameContainer,
      newRoundContainer,
      emptyContainer,
      endGameContainer,
    };
  }

  render() {
    const {
      gameContainer,
      newRoundContainer,
      emptyContainer,
      endGameContainer,
    } = this.setContainers();
    // debugger
    return (
      <>
        {gameContainer}
        {newRoundContainer}
        {endGameContainer}
        {emptyContainer}
      </>
    );
  }
}

export default Game;
