import React from 'react';
import AnswerForm from "../answer/answer_form";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: '',
            cheat: false,
        }
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
        allPlayers.forEach(player => {
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
                <li>
                    [ X ]
                </li>
            )
        };
        for (let i = 0; i < 3 - strikes; i++) {
            strikesList.push(
                <li>
                    [   ]
                </li>
            )
        }
        return strikesList.slice(0, 3);
    }

    createAnswerSection(handleAnswerSubmit, currentPlayer) {
        if (this.isMyTurn()) {
            return (
                <AnswerForm
                    handleAnswerSubmit={(answer) => handleAnswerSubmit(answer)}
                />
            )
        } else {
            return (
                <h3>{currentPlayer ? `${currentPlayer.name}'s turn!` : ''}</h3>
            )
        };
    }

    createOtherPlayerAnswerSection(otherAnswer) {
        if (otherAnswer) {
            if (otherAnswer.answer === "") {
                return (
                    <h3>{`${this.findPlayerById(otherAnswer.playerId).name} didn't answer!`}</h3>
                )
            } else {
                return (
                    <h3>{`${this.findPlayerById(otherAnswer.playerId).name} said ${otherAnswer.answer}!`}</h3>
                )
            }
        }
    }

    createAnswerList(answerBoard) {
        return answerBoard.map((answer, idx) => {
            if (this.state.cheat) {
                return (
                    <button>
                        {answer.answer}
                    </button>
                )
            } else {
                return (
                    <button>
                        {answer.isRevealed ? `${answer.answer}` : `${idx + 1}`}
                    </button>
                )
            }
        });
    }

    setContainers() {
        const { handleAnswerSubmit, gamePhase, otherAnswer } = this.props;
        const {
            question, answerBoard, roundPoints, strikes, phase,
            currentPlayer, teamNum,
            team1points, team2points
        } = this.props.gameState;

        const currentTeamText = teamNum ? `Team ${teamNum}` : '';
        
        const strikesList = this.createStrikesList(strikes);
        const answerSection = this.createAnswerSection(handleAnswerSubmit, currentPlayer);
        const otherPlayerAnswerSection = this.createOtherPlayerAnswerSection(otherAnswer);
        const answerList = this.createAnswerList(answerBoard);

        let gameContainer, newRoundContainer, emptyContainer, endGameContainer;
        switch (gamePhase) {
            case "round":
            case "endRound":
                gameContainer = (
                    <div className="game-container">
                        <div>Current phase: {phase}</div>
                        <div>Current team: {currentTeamText}</div>
                        <div>Round points: {roundPoints}</div>
                        Question: {question}
                        <div className="answer-board">
                            {answerList}
                        </div>
                        <div>{strikesList}</div>
                        <div className="answer-form-container">
                            { gamePhase === "round" ? answerSection : "" }
                        </div>
                        <div>
                            {otherPlayerAnswerSection}
                        </div>
                        <div>
                            <button onClick={() => this.toggleCheat()}>Toggle Cheat</button>
                        </div>
                    </div>
                );
                break;
            case "newRound":
                newRoundContainer = (
                    <div className="new-round-container">
                        <p>Starting {phase}...</p>
                        <p>Team 1 Points: {team1points}</p>
                        <p>Team 2 Points: {team2points}</p>
                    </div>
                );
                break;
            case "endGame":
                endGameContainer = (
                    <div className="new-round-container">
                        <p>Game over!</p>
                        <p>Team 1 Points: {team1points}</p>
                        <p>Team 2 Points: {team2points}</p>
                    </div>
                );
                break;
            default:
                emptyContainer = (<div>Loading...</div>)
        }
        return { gameContainer, newRoundContainer, emptyContainer, endGameContainer };
    }

    render() {
        const { gameContainer, newRoundContainer, emptyContainer, endGameContainer } = this.setContainers();
        
        return (
            <>
                { gameContainer }
                { newRoundContainer }
                { endGameContainer }
                { emptyContainer }
            </>
        )
    }
}

export default Game;