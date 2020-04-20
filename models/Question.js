const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    id: {
        type: Number,
        required: true
    },

    text: {
        type: String,
        required: true
    },

    

});

module.exports = Question = mongoose.model("questions", QuestionSchema);
