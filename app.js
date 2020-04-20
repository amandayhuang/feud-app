const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const questions = require("./routes/questions");
const answers = require("./routes/answers");
// const Question = require("./models/Question")
// const bodyParser = require('body-parser');
// const passport = require("passport");






mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!')
})
    

// app.use(passport.initialize());
// require("./config/passport")(passport);

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());



app.use("/api/questions", questions);
app.use("/api/answers", answers);
    






const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));