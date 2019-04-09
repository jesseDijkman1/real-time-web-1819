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

io.on("connection", socket => {

  // First add the socket to the socket list to keep track of them all
  socketsList[socket.id] = {};

  console.log(socketsList)

  socket.on("new msg", val => {
    io.sockets.emit("display msg", val)
  })

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id)
    delete socketsList[socket.id]
  })
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
