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


let rooms = {};
io.on('connect', (socket) => {
    console.log("Connected to Socket yay! Socket id: " + socket.id);

    socket.on('create', (roomName, nickname) => {
        socket.join(roomName);
        socket.emit('receiveConsoleMessage', `You created room ${roomName}`);
        let newRoom = new Room(roomName);
        newRoom.addPlayer(nickname, socket.id);
        rooms[roomName] = newRoom;
    });

    socket.on('join', (roomName, nickname) => {
        socket.join(roomName);
        socket.emit('receiveConsoleMessage', `You joined room ${roomName}`);
    });

    socket.on('startGame', () => {

    })

    socket.on('answer', (answer, roomId) => {
        // socket.id === playerId
        // can use room receiveAnswer (or whatever) method here
        socket.emit('receiveConsoleMessage', `You answered ${answer}`);
        socket.to(roomId).emit('receiveConsoleMessage', `Someone answered ${answer}`);
    })
});

// set up dummy gameState object
const gameState = { };

// regularly update all rooms with the gameState
setInterval(() => {
    Object.keys(rooms).forEach(roomName => {
        const room = rooms[roomName];
        let newGameState = room.getGameState();
        io.to(room.roomName).emit('receiveConsoleMessage', `Here is your update for room ${room.roomName}`);
        io.to(room.roomName).emit('receiveConsoleMessage', `Players: ${room.players[0].name}`);
        io.to(room.roomName).emit('receiveGameState', gameState);
    })
}, 2000);

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));
