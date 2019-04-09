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

io.on("connection", socket => {

  // First add the socket to the socket list to keep track of them all
  socketsList[socket.id] = {};



  socket.on("new msg", val => {
    io.sockets.emit("display msg", val)
  })

  socket.on("get all drawings", () => {
    socket.emit("all drawings", pixelPositions)
  })

  socket.on("drawing", data => {
    pixelPositions.push(data);

    io.sockets.emit("display drawing", data)
  })

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id)
    delete socketsList[socket.id]
  })
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
