import React from "react";
import AnswerForm from "../answer/answer_form";

class SoloGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: "",
            cheat: false,
        };
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
                    <img id="strike" src="images/strike.png" />
                </li>
            );
        }
        for (let i = 0; i < 3 - strikes; i++) {
            strikesList.push(
                <li>
                    <img id="unstrike" src="images/strike.png" />
                </li>
            );
        }
        return strikesList.slice(0, 3);
    }

    createAnswerSection(handleAnswerSubmit) {
        return (
            <AnswerForm
                handleAnswerSubmit={(answer) => handleAnswerSubmit(answer)}
            />
        );
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
        const { handleAnswerSubmit, gamePhase } = this.props;
        const {
            question,
            answerBoard,
            roundPoints,
            strikes,
            phase,
        } = this.props.gameState;
        
        let strikesList, answerSection, answerList;
        if (answerBoard) {
            strikesList = this.createStrikesList(strikes);
            answerSection = this.createAnswerSection(handleAnswerSubmit);
            answerList = this.createAnswerList(answerBoard);
        }

        let gameContainer, newRoundContainer, emptyContainer, endGameContainer;
        switch (gamePhase) {
            case "round":
            case "endRound":
            case "pauseLightning":
                gameContainer = (
                    <div className="game-container">
                        <div className="round-info">
                            <div className="game-phase">{phase}</div>
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
                            <button className="leave-game-button" onClick={() => this.props.handleLeaveSolo()}>LEAVE GAME</button>
                            <button className="cheat-button" onClick={() => this.toggleCheat()}>CHEAT</button>
                        </div>
                    </div>  
                );
                break;
            case "newRound":
                newRoundContainer = (
                    <div className="round-change-container">
                        <h1>Starting {phase}...</h1>
                        <div className="team-container">
                            <h1>Score</h1>
                            <div className="round-sum-points">
                                {roundPoints}
                            </div>
                        </div>
                    </div>
                );
                break;
            case "endGame":
                endGameContainer = (
                    <div className="round-change-container end-game">
                        <h1>Game Over!</h1>
                        <div className={`team-container`}>
                            <h1>Score</h1>
                            <div className="round-sum-points">
                                {roundPoints}
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
        // console.log(this.props.gameState);
        const {
            gameContainer,
            newRoundContainer,
            emptyContainer,
            endGameContainer,
        } = this.setContainers();
        
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

export default SoloGame;
