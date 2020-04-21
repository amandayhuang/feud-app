const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  answer: {
    type: String,
    require: true,
  },

  points: {
    type: Number,
    required: true,
  },

  rank: {
    type: Number,
    required: true,
  },

  question_id: {
    type: Number,
    required: true,
  },
});

module.exports = Answer = mongoose.model("answers", AnswerSchema);