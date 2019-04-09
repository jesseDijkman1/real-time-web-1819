import socket from "./main.js"

const canvas = document.querySelector(".chat-display .chat-background");
const ctx = canvas.getContext("2d");

// Dynamically change canvas width and height;
function canvasInit() {
  const w = canvas.parentElement.offsetWidth;
  const h = canvas.parentElement.offsetHeight;

  canvas.setAttribute("width", w);
  canvas.setAttribute("height", h);
}

canvasInit();

// On resize update the canvas
window.addEventListener("resize", canvasInit);

function drawStart(e) {
  socket.emit("drawing", getPositions(e))

  window.addEventListener("mousemove", drawing);
}

function drawing(e) {
  socket.emit("drawing", getPositions(e))

  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", drawing)
  })
}

function getPositions(e) {
  const margins = {
    left: e.target.offsetLeft,
    top: e.target.offsetTop,
    width: e.target.offsetWidth,
    height: e.target.offsetHeight
  }

  const xPos = e.clientX - margins.left;
  const yPos = e.clientY - margins.top;

  return {x: xPos, y: yPos}
}

socket.on("display drawing", data => draw(data.x, data.y))

function draw(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, 2 * Math.PI);
  ctx.stroke();
}

canvas.addEventListener("mousedown", drawStart)
canvas.addEventListener("mouseleave", () => {
  window.removeEventListener("mousemove", drawing)
})
