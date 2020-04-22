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
// empty players hash for testing player assignment
let players = {};
io.on('connect', (socket) => {
    console.log("Connected to Socket yay! Socket id: " + socket.id);

    socket.on('create', (room, nickname) => {
        socket.join(room);
        // add player using socketID to their room
        // can be replaced by room addPlayer method
        players[room] ? players[room].push(socket.id) : players[room] = [socket.id];
        socket.emit('receiveConsoleMessage', `You created room ${room}`);
        let newRoom = { [room]: new Room(room)};
        rooms.push(newRoom); //newRoom.roomName
        console.log(rooms);
    });

    socket.on('join', (room, nickname) => {
        socket.join(room);
        // add player using socketID to their room
        // can be replaced by room addPlayer method
        players[room] ? players[room].push(socket.id) : players[room] = [socket.id];
        socket.emit('receiveConsoleMessage', `You joined room ${room}`);
    });

    socket.on('answer', (answer, roomId) => {
        // socket.id === playerId
        // can use room receiveAnswer (or whatever) method here
        socket.emit('receiveConsoleMessage', `You answered ${answer}`)
        socket.to(roomId).emit('receiveConsoleMessage', `Someone answered ${answer}`)
    })
});

// set up dummy gameState object
const gameState = { players: ["player 1", "player 2"], score: 100 };

// regularly update all rooms with the gameState
setInterval(() => {
    rooms.forEach((roomObj, idx) => {
        const room = roomObj[Object.keys(rooms[idx])]; //maybe this is overly complicated!
        let newGameState = room.getGameState();
        io.to(room.roomName).emit('receiveConsoleMessage', `Here is your update for room ${room.roomName}`);
        io.to(room.roomName).emit('receiveGameState', gameState);
        players[room.roomName].forEach((playerId, idx) => {
            io.to(playerId).emit('receiveConsoleMessage', `You are player ${idx}`);
        })
    })
}, 2000);

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));
