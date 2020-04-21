import React from 'react';
import './main.css';
import io from 'socket.io-client';
import RoomForm from '../room/room_form';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinedRoomId: '',
            gameState: {}
        }
        this.socket = null;
        this.receiveGameState = this.receiveGameState.bind(this);
    }

    componentDidMount() {
        //the URL passed to io when setting this up needs to change based on environment
        this.socket = io("http://localhost:5000");
        this.socket.on('connect', (socket) => {
            console.log("Frontend connected! Socket id: " + this.socket.id);

            this.socket.on('receiveConsoleMessage', msg => {
                console.log(msg);
            });

            this.socket.on('receiveGameState', this.receiveGameState);
        });
    }

    receiveGameState(gameState) {
        this.setState({ gameState: gameState});
    }

    handleRoomJoin(roomId) {
        this.socket.emit('join', roomId);
        this.setState({ joinedRoomId: roomId})
    }

    render () {
        const joinedRoomId = this.state.joinedRoomId === '' ? 'Not in a room' : this.state.joinedRoomId;
        const gameState = JSON.stringify(this.state.gameState);
        return (
            <div className="main-container">
                <h1>Feuding Friends</h1>
                <h1>{joinedRoomId}</h1>
                <div className="room-form-container">
                    <RoomForm handleRoomJoin={(roomId) => this.handleRoomJoin(roomId)}/>
                </div>
                <div>
                    {gameState}
                </div>
            </div>
            
        )
    }
}

export default Main;