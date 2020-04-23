import React from 'react';

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: ''
        }
    }

    render() {
        const { players } = this.props.gameState;
        const { playerId, handleStartGame } = this.props;
        const playersList = players.map(player => {
            if (player.id === playerId) {
                return (
                    <li key={player.id}>
                        <b>{player.name}</b>
                    </li>
                )
            } else {
                return (
                    <li key={player.id}>
                        {player.name}
                    </li>
                )
            }
        })
        return (
            <div className="lobby-player-container">
                Players in lobby:
                <ul>
                    {playersList}
                </ul>
                <button onClick={handleStartGame}>Start Game</button>
            </div>
        )
    }
}

export default Lobby;