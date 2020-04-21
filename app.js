const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/super_keys.js").mongoURI;
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const Room = require('./room');
const Game = require("./game");

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


let rooms = [];
io.on('connect', (socket) => {
    console.log("Connected to Socket yay! Socket id: " + socket.id);

    socket.on('join', (room) => {
        socket.join(room);
        io.to(room).emit('receiveConsoleMessage', `You joined room ${room}`);
        let newRoom = new Room(room);
        rooms.push(newRoom); //newRoom.roomName
    });
});

// set up dummy gameState object
const gameState = { players: ["player 1", "player 2"], score: 100 };



// regularly update all rooms with the gameState
setInterval(() => {
    rooms.forEach(room => {
        let newGameState = room.getGameState();
        io.to(room.roomName).emit('receiveConsoleMessage', `Here is your update for room ${room.roomName}`);
        io.to(room.roomName).emit('receiveGameState', gameState);
    })
}, 2000);

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));
