import React from 'react';

class AnswerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: '',
            timer: ''
        }
        this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.answerTimer = null;
        this.answerTimerLength = 100;
    }

    componentDidMount() {
        this.startTimer();
    }

    startTimer() {
        clearInterval(this.answerTimer);
        this.setState({ timer: this.answerTimerLength })
        this.answerTimer = setInterval(() => this.countdown(), 1000);
    }

    countdown() {
        let { timer } = this.state;
        timer --;
        if (timer === 0) {
            this.timerDone();
        } else {
            this.setState({ timer: timer});
        }
    }

    timerDone() {
        clearInterval(this.answerTimer);
        this.setState({ timer: 0 });
        this.handleAutoSubmit();
    }

    updateForm(field) {
        return (e) => {
            this.setState({ [field]: e.target.value })
        }
    }

    handleAutoSubmit() {
        const { answer } = this.state;
        this.props.handleAnswerSubmit(answer);
        this.setState({ answer: '' });
        this.startTimer();
    }

    handleAnswerSubmit(e) {
        e.preventDefault();
        const { answer } = this.state;
        this.props.handleAnswerSubmit(answer);
        this.setState({ answer: '' });
        this.startTimer();
    }

    render() {
        const { timer } = this.state;
        return (
            <>
                <form onSubmit={this.handleAnswerSubmit} className="answer-form">
                    <input type="text"
                        placeholder="Enter answer"
                        value={this.state.answer}
                        onChange={this.updateForm('answer')}>
                    </input>
                    <button type="submit">SUBMIT</button>
                </form>
                <h2 className="timer">{timer}</h2>
            </>
        )
    }
}

export default AnswerForm;