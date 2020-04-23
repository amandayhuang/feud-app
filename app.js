const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/super_keys.js").mongoURI;
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const Room = require('./room');

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
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
        if (rooms[roomName]) {
            socket.emit('receiveRoomError', 'Room already exists!');
        } else {
            socket.join(roomName);
            socket.emit('receiveConsoleMessage', `You created room ${roomName}`);
            socket.emit('joinRoom', roomName);
            let newRoom = new Room(roomName);
            newRoom.addPlayer(nickname, socket.id);
            rooms[roomName] = newRoom;
        }     
    });

    socket.on('join', (roomName, nickname) => {
        if (rooms[roomName]) {
            socket.join(roomName);
            socket.emit('receiveConsoleMessage', `You joined room ${roomName}`);
            socket.emit('joinRoom', roomName);
            rooms[roomName].addPlayer(nickname, socket.id);
        } else {
            socket.emit('receiveRoomError', 'Room does not exist!');
        }
    });

    socket.on('startGame', roomName => {
        console.log('Starting game')
        let room = rooms[roomName];
        room.createGame();
        io.to(roomName).emit('setPhase', 'game');
    })

    socket.on('answer', (answer, roomName) => {
        rooms[roomName].game.receiveAnswer(answer);
        socket.to(roomName).emit('receiveOtherAnswer', socket.id, answer);
        socket.emit('receiveConsoleMessage', `You answered ${answer}`);
        socket.to(roomName).emit('receiveConsoleMessage', `Someone answered ${answer}`);
    })
});

// regularly update all rooms with the gameState
setInterval(() => {
    Object.keys(rooms).forEach(roomName => {
        const room = rooms[roomName];
        let newGameState = room.getGameState();
        // io.to(room.roomName).emit('receiveConsoleMessage', `Here is your update for room ${room.roomName}`);
        io.to(room.roomName).emit('receiveGameState', newGameState);
    })
}, 1000);

const startNewRound = (roomName) => {
    io.to(roomName).emit('startNewRound');
}

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = startNewRound;

// const room = new Room("hello");
// const player1 = new Player("adam", 123);
// const player2 = new Player("amanda", 124);
// const player3 = new Player("Naz", 125);
// const player4 = new Player("Jared", 126);
// room.players = [player1, player2, player3, player4];
// console.log(room.roomName);




//   room.game.receiveAnswer("Back");
//   console.log(room.getGameState());
//   room.game.receiveAnswer("fnjnr");
//   console.log(room.getGameState());
//   room.game.receiveAnswer("fnjnr");
//   console.log(room.getGameState());