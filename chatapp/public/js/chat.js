"use strict"

import socket from "./main.js";

const messagesContainer = document.querySelector("#chat .chat-messages");
const playerInfoContainer = document.querySelector("#chat .player-info");
const playerName = document.querySelector("#chat .player-name");
const playerInfoEditor = document.querySelector("#chat .player-info-form");
const newPlayerName = document.querySelector("#chat .player-info-form input[type=text]");

socket.on("set player name", updateName)

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
    // playerName.textContent = name;
  }

  togglePlayerEdit()
}

playerName.addEventListener("click", togglePlayerEdit)
playerInfoEditor.addEventListener("submit", newPlayerData)
