import React from 'react';

class AnswerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: ''
        }
        this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
        this.updateForm = this.updateForm.bind(this);
    }

    updateForm(field) {
        return (e) => {
            this.setState({ [field]: e.target.value })
        }
    }

    handleAnswerSubmit(e) {
        e.preventDefault();
        const { answer } = this.state;
        this.props.handleAnswerSubmit(answer);
        this.setState({ answer: '' });
    }

    render() {
        return (
            <form onSubmit={this.handleAnswerSubmit} className="answer-form">
                <input type="text"
                    placeholder="Enter answer"
                    value={this.state.answer}
                    onChange={this.updateForm('answer')}>
                </input>
                <button type="submit">Submit</button>
            </form>
        )
    }
}

export default AnswerForm;