import React from 'react';
import './main.css';
import io from 'socket.io-client';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 10
        }
    }

    componentDidMount() {
        //the URL passed to io when setting this up needs to change based on environment
        this.socket = io("http://localhost:5000");
        this.socket.on('init', (socket) => {
            console.log("Frontend connected!" + this.socket.id);
            console.log(this.socket);
            console.log(`Sending message back to server: ${this.state.message}`);
            this.socket.emit('multiplyNum', this.state.message);
        });
        this.socket.on('message', (msg) => {
            console.log(`Receiving message from server: ${msg}`);
            this.setState({ message: msg})
        })
    }

    render () {
        const { message } = this.state;
        return (
            <div className="main-container">
                <h1>Family Feud</h1>
                <div>
                    <p>Game content goes here</p>
                    <p>Special message from our dearest server: {message}</p>
                </div>
            </div>
            
        )
    }
}

export default Main;