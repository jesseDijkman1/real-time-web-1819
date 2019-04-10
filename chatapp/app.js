"use strict"

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const port = 3000;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

class chatMessage {
  constructor(data, msg, author) {
    this.data = data;
    this.msg = msg;
    this.author = author;
    this.date = this.currentTime()
    this.obj = {};

    if (this.msg) {
      this.notification = this.inject()
    }

    this.obj["date"] = this.date
    this.obj["msg"] = this.notification
    // if (this.msg) {
    //   this.obj["msg"] = this.notification
    // }

    if (this.author) {
      this.obj["author"] = this.data
    }

    return this.obj
    // return {
    //   date: this.date,
    //   msg: this.notification
    // }
  }

  currentTime() {
    const fullDate = new Date(Date.now());
    const hour = fullDate.getHours();
    let minutes = fullDate.getMinutes().toString();

    if (minutes.length == 1) {
      minutes = `0${minutes}`
    }

    return `${hour}:${minutes}`

  }

  inject() {
    const rx = /\~(\d)/g;

    if (rx.test(this.msg)) {
      if (typeof this.data === "object") {
        this.msg = this.msg.replace(rx, (...args) => {
          const nr = parseInt(args[1]);

          return this.data[nr]
        })
      } else {
        this.msg = this.msg.replace(rx, (...args) => {
          if (args[1] != 0) {
            return ""
          } else {
            return this.data
          }
        })
      }
      return this.msg
    }
    return this.msg
  }

  addDate() {
    console.log("in date", this.notification)
  }
}

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

app.use(express.static("public"))

const socketsList = {};
const messagesData = [];
const availableIds = [];
const playersLimit = 5;

for (let i = 1; i <= playersLimit; i++) {
  availableIds.push(i);
}

function addSocket(s) {
  const id = availableIds.shift();

  socketsList[s.id] = {
    name: `Player ${id}`,
    id: id
  }
}

io.on("connection", socket => {
  // First add the socket to the socket list to keep track of them all
  addSocket(socket)
  const data = new chatMessage(socketsList[socket.id].name, "~0 joined the lobby");
  data.id = socket.id

  messagesData.push(data);
  io.emit("add new player", socketsList[socket.id].name, messagesData)

  socket.on("update player name", newName => {
    socketsList[socket.id].name = newName;
  })

  socket.on("new message", msg => {
    // const m = {msg: msg, author: socketsList[socket.id].name};
    console.log(msg)
    const data = new chatMessage(socketsList[socket.id].name, msg, true)
    console.log(data)
    data.id = socket.id
    messagesData.push(data);

    io.emit("display messages", data)
  });

  socket.on("disconnect", () => {
    const data = new chatMessage(socketsList[socket.id].name, "~0 left the lobby")
    data.id = socket.id

    socket.broadcast.emit("player left", data)

    // console.log(socketsList[socket.id])
    availableIds.push(socketsList[socket.id].id)
    delete socketsList[socket.id]
  })
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
