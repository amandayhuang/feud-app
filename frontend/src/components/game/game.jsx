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

    // isMyTeamsTurn() {
    //     const { }
    // }

    toggleCheat() {
        const cheat = this.state.cheat;
        this.setState({ cheat: !cheat });
    }

    render() {
        const { handleAnswerSubmit, gamePhase, otherAnswer } = this.props;
        const { 
            question, answerBoard, roundPoints, strikes, phase,
            currentPlayer, teamNum,
            team1points, team2points
        } = this.props.gameState;
        
        let answerSection;
        if (this.isMyTurn()) {
            answerSection = (
                <AnswerForm
                    handleAnswerSubmit={(answer) => handleAnswerSubmit(answer)}
                />
        )} else {
            answerSection = (
                <h3>{currentPlayer ? `${currentPlayer.name}'s turn!` : ''}</h3>
            )
        };

        let otherPlayerAnswerSection;
        if (otherAnswer) {
            otherPlayerAnswerSection = (
                <h3>{`${this.findPlayerById(otherAnswer.playerId).name} said ${otherAnswer.answer}!`}</h3>
            )
        }

        const currentTeamText = teamNum ? `Team ${teamNum}` : '';

        const answerList = answerBoard.map(answer => {
            if (this.state.cheat) {
                return (
                    <button>
                        {answer.answer}
                    </button>
                )
            } else {
                return (
                    <button>
                        {answer.isRevealed ? `${answer.answer}` : ' '}
                    </button> 
                )
            }
        });

        let gameContainer, newRoundContainer, emptyContainer, endGameContainer;
        switch (gamePhase) {
            case "round":
                gameContainer = (
                    <div className="game-container">
                        <div>Current phase: {phase}</div>
                        <div>Current team: {currentTeamText}</div>
                        <div>Round points: {roundPoints}</div>
                        Question: {question}
                        <div className="answer-board">
                            {answerList}
                        </div>
                        <div>Strikes: {strikes}</div>
                        <div className="answer-form-container">
                            {answerSection}
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
                        <p>Starting new round shortly...</p>
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