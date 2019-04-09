// import * as draw from "./modules/draw.js"

const socket = io();

export default socket;

// Present a pop-up when the user tries to refresh or leave
window.onbeforeunload = () => "Are you sure?"






console.log("Still working")
// const msgInput = document.getElementById("msg-input");
// const msgForm = document.querySelector(".chat-form form");
// const chatContainer = document.querySelector(".chat-display .chat-messages");
//
// // Display the new msg('s)
// socket.on("display msg", (msg, msgId) => {
//   const newMsgEl = document.createElement("LI");
//   const newMsgTxt = document.createTextNode(msg);
//   newMsgEl.appendChild(newMsgTxt);
//
//   if (socket.id == msgId) {
//     newMsgEl.classList.add("myMsg")
//   }
//   chatContainer.appendChild(newMsgEl)
// })
//
//
// function submitMsg(e) {
//   e.preventDefault() // Prevent page refresh
//
//   const msgVal = msgInput.value;
//
//   socket.emit("new msg", msgVal);
//
//   // Reset the msg msgInput
//   msgInput.value = ""
// }
//
// msgForm.addEventListener("submit", submitMsg);
//
