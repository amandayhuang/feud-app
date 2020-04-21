const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/public"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "public", "index.html"));
  });
}

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("Connected to Socket yay!" + socket.id);
  socket.emit("init", {});

  socket.on("multiplyNum", (num) => {
    console.log(`Received message from client: ${num}. Returning new message`);
    socket.emit("message", num * 2);
  });
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended:true }));

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));
