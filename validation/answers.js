// const Validator = require("validator");
// const validText = require("./valid-text");
// const ValidNumber = require("./valid-number");

// module.exports = function validateAnswerInput(data) {

//     let errors = {};

//     data.url = validText(data.url) ? data.url : "";
//     data.answer = validText(data.answer) ? data.answer : "";
//     data.questionId = validText(data.questionId) ? data.questionId : null;
//     data.rank = validText(data.rank) ? data.answer : "";
//     data.points = validText(data.points) ? data.points : "";

//     if (Validator.isEmpty(data.url)) {
//         errors.url = "URL field is required";
//     }


//     if (Validator.isEmpty(data.answer)) {
//         errors.answer = "Answer is required";
//     }

//     return {
//         errors,
//         isValid: Object.keys(errors).length === 0
//     };
// }