"use strict";

const socket = io();

const msgInput = document.getElementById("msg-input");
const msgForm = document.querySelector(".chat-form form");

function submitMsg(e) {
  e.preventDefault() // Prevent page refresh

  const msgVal = msgInput.value;

  console.log("submitted", msgInput.value)

  // Reset the msg msgInput
  msgInput.value = ""
}

msgForm.addEventListener("submit", submitMsg);
