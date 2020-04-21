const express = require("express");
const router = express.Router();

const Answer = require("../models/Answer");
// const validateAnswerInput = require("../../validation/answer");

// router.get("/", (req, res) => {
//     Answer.find()
//         .sort({ })
//         .then(answers => res.json(answers))
//         .catch(err => res.status(404).json({ noanswersfound: "Answer not found" }));
// });

// router.get("/:answer_id", (req, res) => {
//     Answer.findById(req.params.question_id)
//         .then(answer => res.json(answer))
//         .catch(err =>
//             res.status(404).json({ noanswerfound: "No answer found with that ID" })
//         );
// });

router.get("/:question_id", (req, res) => {
  debugger;
  Answer.find({
    question_id: req.params.question_id,
  })
    .then((answers) => res.json(answers))
    .catch((err) =>
      res.status(404).json({ noanswerfound: "Answers not found for that question ID" })
    );
});

module.exports = router;