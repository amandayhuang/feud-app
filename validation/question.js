// const Validator = require("validator");
// const validText = require("./valid-text");

// module.exports = function validateQuestionInput(data) {

//     let errors = {};

//     data.url = validText(data.url) ? data.url : "";
//     data.text = validText(data.text) ? data.text : "";
 

//     if (Validator.isEmpty(data.url)) {
//         errors.url = "URL field is required";
//     }



//     if (Validator.isEmpty(data.text)) {
//         errors.text = "Questions must have a text";
//     }

//     return {
//         errors,
//         isValid: Object.keys(errors).length === 0
//     };
// }