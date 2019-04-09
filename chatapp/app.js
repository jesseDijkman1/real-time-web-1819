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

io.on('connection', function(socket){
  console.log('a user connected');
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
