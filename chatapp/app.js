"use strict"

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const port = 3000;

const app = express();
const server = http.Server(app);
const io = socketIO(server);



app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

app.use(express.static("public"))

const socketsList = {};
const pixelPositions = [];
let count = 0;

function addSocket(s) {
  socketsList[s.id] = {};

  const index = Object.keys(socketsList).indexOf(s.id);

  socketsList[s.id].name = `Player ${index}`;
}

io.on("connection", socket => {

  // First add the socket to the socket list to keep track of them all
  addSocket(socket)

  console.log(socketsList)
  socket.emit("set player name", socketsList[socket.id].name)

  socket.on("update player name", newName => {
    socketsList[socket.id].name = newName;
  })

  socket.on("disconnect", () => {
    delete socketsList[socket.id]
  })
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
