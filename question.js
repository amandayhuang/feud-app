const QuestionModel = require("./models/Question");


class Question {
    constructor(questionId) {
        console.log(questionId);
        return QuestionModel.find({
          id: questionId,
        })
          .then((question) => {
            // console.log("got qs")
              this.text = question[0].text;
              this.id = question[0].id;
              console.log(question[0].text);
        })
        //   .catch((err) => 
        //    {}
        //   );
        // console.log(newQuestion);
        // this.text = question[0].text;
        // this.id = question[0].id;
    }
}    

module.exports = Question;