import React from 'react';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: ''
        }
    }

    render() {
        const { question, answerBoard, scores, currentPlayer, strikes } = this.props.gameState;
        return (
            <div className="game-container">
                <div className="answer-board">
                    {JSON.stringify(answerBoard)}
                    {strikes}
                </div>
            </div>
        )
    }
}

export default Game;