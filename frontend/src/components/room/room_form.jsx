import React from 'react';

class RoomForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            action: 'join',
            roomId: '',
            nickname: ''
        }
        this.handleRoomJoin = this.handleRoomJoin.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.switchForm = this.switchForm.bind(this);
    }

    updateForm(field) {
        return (e) => {
            this.setState({ [field]: e.target.value })
        }
    }

    handleRoomJoin(e) {
        e.preventDefault();
        const { action, roomId, nickname } = this.state;
        this.props.handleRoomJoin(action, roomId, nickname);
        this.setState({ roomId: '', nickname: ''});
    }

    switchForm() {
        const newForm = this.state.action === 'join' ? 'create' : 'join';
        this.setState({ action: newForm});
    }

    render() {
        const { action } = this.state;
        let buttonText, otherButtonText = '';
        if (action === 'join') {
            buttonText = "Join Room";
            otherButtonText = "Create Room"
        }  else {
            buttonText = "Create Room";
            otherButtonText = "Join Room"
        }
        return (
            <>
                <form onSubmit={this.handleRoomJoin} className="room-form">
                    <input type="text"
                        placeholder="Enter room code"
                        value={this.state.roomId}
                        onChange={this.updateForm('roomId')}>
                    </input>
                    <input type="text"
                        placeholder="Nickname"
                        value={this.state.nickname}
                        onChange={this.updateForm('nickname')}>
                    </input>
                    <button type="submit">{buttonText}</button>
                </form>
                <button onClick={this.switchForm}>Or {otherButtonText}...</button>
            </>
        )
    }
}

export default RoomForm;