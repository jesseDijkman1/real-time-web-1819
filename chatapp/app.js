const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const port = 3000;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static("public"))

app.get("/", (req, res) => {
  console.log("hello world")
  // res.sendFile("index.html")
})

server.listen(port, () => console.log(`Listening to port: ${port}`));
