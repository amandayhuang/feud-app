const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const Question = require("../../models/Question");
// const validateQuestionInput = require("../../validation/question");

// router.get("/", (req, res) => {
//     Question.find()
//         .sort({ })
//         .then(questions => res.json(questions))
//         .catch(err => res.status(404).json({ noquestionsfound: "Questions not found" }));
// });

router.get("/:question_id", (req, res) => {
    debugger
    Question.findById(req.params.question_id) 
        .then(question => res.json(question))
        .catch(err =>
            res.status(404).json({ noquestionfound: "Question not found" })
        );
});




// router.get("/", (req, res) => {
//     res.json({ msg: "this is a question route" });
// });
module.exports = router;