const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/super_keys.js").mongoURI;
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const Room = require('./room');
const SoloRoom = require('./solo_room');

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
let roomsBySocket = {};
io.on('connect', (socket) => {
    console.log("Connected to Socket yay! Socket id: " + socket.id);

    socket.on('create', (roomName, nickname) => {
        if (rooms[roomName]) {
            socket.emit('receiveRoomError', 'Room already exists!');
        } else {
            socket.join(roomName);
            // socket.emit('receiveConsoleMessage', `You created room ${roomName}`);
            socket.emit('joinRoom', roomName);
            let newRoom = new Room(roomName, io);
            newRoom.addPlayer(nickname, socket.id);
            rooms[roomName] = newRoom;
            roomsBySocket[socket.id] = roomName;
        }     
    });

    socket.on('join', (roomName, nickname) => {
        if (rooms[roomName]) {
            socket.join(roomName);
            // socket.emit('receiveConsoleMessage', `You joined room ${roomName}`);
            socket.emit('joinRoom', roomName);
            rooms[roomName].addPlayer(nickname, socket.id);
            roomsBySocket[socket.id] = roomName;
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

    socket.on('startSolo', () => {
        console.log('Starting solo game');
        let roomName = socket.id;
        socket.join(roomName);
        let newRoom = new SoloRoom(roomName, io);
        rooms[roomName] = newRoom;
        newRoom.createGame();
        // socket.emit('receiveConsoleMessage', `You started a solo game`);
        socket.emit('setPhase', 'solo');
    })

    socket.on('leaveRoom', roomName => {
        socket.leave(roomName);
        delete rooms[roomName];
    })

    socket.on('resetGame', roomName => {
        io.to(roomName).emit('setPhase', "lobby");
        io.to(roomName).emit('setGamePhase', "round");
    })

    socket.on('disconnect', () => {
        let roomName = roomsBySocket[socket.id];
        delete roomsBySocket[socket.id];
        if (!io.sockets.adapter.rooms[roomName]) {
            console.log(`No more players in room, deleting ${roomName}`);
            delete rooms[roomName];
        }
    });

    socket.on('answer', (answer, roomName) => {
        if (rooms[roomName]) {
            rooms[roomName].game.receiveAnswer(answer);
            socket.to(roomName).emit('receiveOtherAnswer', socket.id, answer);
            // socket.emit('receiveConsoleMessage', `You answered ${answer}`);
            // socket.to(roomName).emit('receiveConsoleMessage', `Someone answered ${answer}`);
        }
    })
});

// regularly update all rooms with the gameState
setInterval(() => {
    Object.keys(rooms).forEach(roomName => {
        const room = rooms[roomName];
        if (room) {
            let newGameState = room.getGameState();
            io.to(room.roomName).emit('receiveGameState', newGameState);
            // io.to(room.roomName).emit('receiveConsoleMessage', 'Updating game state');
        }
    })
}, 200);

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));