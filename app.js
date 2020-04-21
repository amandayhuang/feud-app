const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const http = require('http').Server(app);
const io = require('socket.io')(http);

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));


let rooms = [];
io.on('connect', (socket) => {
    console.log("Connected to Socket yay! Socket id: " + socket.id);

    socket.on('join', (room) => {
        socket.join(room);
        io.to(room).emit('receiveConsoleMessage', `You joined room ${room}`);
        rooms.push(room);
    });
});

// set up dummy gameState object
const gameState = { players: ["player 1", "player 2"], score: 100 };

// regularly update all rooms with the gameState
setInterval(() => {
    rooms.forEach(room => {
        io.to(room).emit('receiveConsoleMessage', `Here is your update for room ${room}`);
        io.to(room).emit('receiveGameState', gameState);
    })
}, 2000);

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));