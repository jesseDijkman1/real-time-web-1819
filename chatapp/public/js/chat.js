import socket from "./main.js";

const messagesContainer = document.querySelector("#chat .chat-messages");
const message = document.querySelector("#chat .chat-form input[type=text]");
const messageForm = document.querySelector("#chat .chat-form");
const playerInfoContainer = document.querySelector("#chat .player-info");
const playerName = document.querySelector("#chat .player-name");
const playerInfoEditor = document.querySelector("#chat .player-info-form");
const newPlayerName = document.querySelector("#chat .player-info-form input[type=text]");

class msg {
  constructor(data) {
    this.author = data.author || undefined;
    this.date = data.date;
    this.msg = data.msg;
    this.id = data.id;
    this.el = this.createElements()
  }

  createElements(date, msg) {
    const msgContainer = document.createElement("LI");
    const dateEl = document.createElement("SMALL");
    const msgEl = document.createElement("P");

    if (this.author) {
      const authorEl = document.createElement("SMALL")

      authorEl.appendChild(document.createTextNode(this.author));

      authorEl.classList.add("msg-author")

      msgContainer.appendChild(authorEl);
    }

    dateEl.appendChild(document.createTextNode(this.date));
    dateEl.classList.add("msg-date")
    msgEl.appendChild(document.createTextNode(this.msg));
    msgEl.classList.add("msg-content")

    msgContainer.appendChild(dateEl);
    msgContainer.appendChild(msgEl);

    if (socket.id === this.id) {
      console.log("check out")
      msgContainer.className = "chat-msg my-msg"
    } else {
      msgContainer.className = "chat-msg"
    }

    return msgContainer;
  }

  player() {
    this.el.classList.add("player")

    return this.el
  }

  game() {
    this.el.classList.add("game")

    return this.el
  }

  lobby() {
    this.el.classList.add("lobby")

    return this.el
  }
}

// Set the player name on load
socket.on("add new player", (name, data) => {
  updateName(name);

  data.forEach(d => {
    console.log(d)
    const keys = Object.keys(d);

    if (keys.includes("author")) {
      const msgElement = new msg(d).player();

      messagesContainer.appendChild(msgElement);
    } else if (keys.includes("game")) {
      const msgElement = new msg(d).game();

      messagesContainer.appendChild(msgElement);
    } else {
      const msgElement = new msg(d).lobby();

      messagesContainer.appendChild(msgElement);
    }


  })
});

socket.on("player left", data => {

  // chatNotification(data);
  const msgElement = new msg(data).lobby();

  messagesContainer.appendChild(msgElement);
});

// ============================
// |      Player info         |
// ============================

function updateName(name) {
  playerName.textContent = name;
}

function togglePlayerEdit() {
  playerInfoContainer.classList.toggle("editing");
}

function newPlayerData(e) {
  e.preventDefault();
  const name = newPlayerName.value;

  if (name !== playerName.textContent && name.length > 0) {
    socket.emit("update player name", name);

    updateName(name);
  }

  togglePlayerEdit();
}

playerName.addEventListener("click", togglePlayerEdit);
playerInfoEditor.addEventListener("submit", newPlayerData);

// =========================
// |         Chat          |
// =========================

socket.on("display messages", displayMessages)


function newMessage(e) {
  e.preventDefault();

  const msg = checkMessage(message.value);

  if (msg.length > 0) {
    socket.emit("new message", msg)
  }

  resetMsgForm()
}

function checkMessage(m) {
  const splitted = m.split(/\s+/);
  const cleaned = splitted.filter(s => s.length > 0);

  return cleaned.join(" ")
}

function resetMsgForm() {
  message.value = ""
}

function displayMessages(data) {
  // console.log(msgs)
  // msgs.forEach(m => {
    const msgElement = new msg(data).player();

    messagesContainer.appendChild(msgElement);
  // })

}

messageForm.addEventListener("submit", newMessage);
