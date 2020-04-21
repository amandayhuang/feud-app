const express = require("express");
const app = express();
const mongoose = require("mongoose");
<<<<<<< HEAD
const db = require("./config/keys").mongoURI;
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const bodyParser = require('body-parser');
const Room = require('./room');
const Player = require("./player");
const Game = require("./game");

const player = new Player("Nazia");
const player2 = new Player("Amanda");
const newRoom = new Room("feud!", player);

newRoom.addPlayer(player2);
newRoom.game = new Game(newRoom.players);
=======
const db = require("./config/super_keys.js").mongoURI;
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/public"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "public", "index.html"));
  });
}
>>>>>>> master

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.log(err));


<<<<<<< HEAD
    socket.on('multiplyNum', (num) => {
        console.log(`Received message from client: ${num}. Returning new message`);
        socket.emit('message', num * 2);
    })
    
});

console.log(
  `${newRoom.roomName} is open and has one player ${newRoom.players[0].name}`
);

console.log(
    `${newRoom.players[1].name} is also playing`
);
console.log(
    `${newRoom.game.team1[0].name} is on team 1`
);
console.log(
    `${newRoom.game.team2[0].name} is on team 2`
);

//console.log(`${newRoom.game.currentQuestion.text} is the first question`);


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended:true }));

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));

=======
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
>>>>>>> master
