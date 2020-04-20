const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
   
    answer: {
        type: String,
        require: true
    },

    points: {
        type: Number,
        required: true
    },

    rank: {
        type: Number,
        required: true
    },

    question_id: {
        type: Schema.Types.ObjectId,
        ref: 'questions'
    },
});

module.exports = Answer = mongoose.model("Answer", AnswerSchema);