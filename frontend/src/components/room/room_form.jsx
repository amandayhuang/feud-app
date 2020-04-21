import React from 'react';

class RoomForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            form: 'join',
            roomId: ''
        }
        this.handleRoomJoin = this.handleRoomJoin.bind(this);
        this.updateForm = this.updateForm.bind(this);
    }

    updateForm(field) {
        return (e) => {
            this.setState({ [field]: e.target.value })
        }
    }

    handleRoomJoin(e) {
        e.preventDefault();
        const { roomId } = this.state;
        this.props.handleRoomJoin(roomId);
        this.setState({ roomId: ''});
    }

    render() {
        const { form } = this.state;
        const buttonText = form === 'join' ? "Join Room" : "Create Room";
        return (
            <form onSubmit={this.handleRoomJoin}>
                <input type="text"
                    placeholder="Enter room code"
                    value={this.state.roomId}
                    onChange={this.updateForm('roomId')}>
                </input>
                <button type="submit">{buttonText}</button>
            </form>
        )
    }
}

export default RoomForm;