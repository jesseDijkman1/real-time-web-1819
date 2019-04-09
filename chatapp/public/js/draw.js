import socket from "./main.js"

const canvas = document.querySelector(".chat-display .chat-background");
const ctx = canvas.getContext("2d");

const chat = document.getElementById("chat");
const sizeTools = document.querySelectorAll("[data-size]");
const colorTools = document.querySelectorAll("[data-color]");
const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("change", () => {
  if (startBtn.checked) {
    chat.classList.add("drawing");
  } else {
    chat.classList.remove("drawing");
  }
})

const pen = {
  color: "black",
  size: "60"
}


function tools(){
  for (let i = 0; i < sizeTools.length; i++) {
    sizeTools[i].addEventListener("click", e => changeTool(e, sizeTools))
  }

  for (let i = 0; i < colorTools.length; i++) {
    colorTools[i].addEventListener("click", e => changeTool(e, colorTools))
  }
}

tools()


function changeTool(e, elements) {
  const tool = e.currentTarget;
  const type = Object.keys(tool.dataset)[0];
  const val = tool.dataset[Object.keys(tool.dataset)[0]]

  elements.forEach(el => {
    if (el.classList.contains("current")) {
      el.classList.remove("current")
    }
  })

  tool.classList.add("current");

  pen[type] = val;
}

// Dynamically change canvas width and height;
function canvasInit() {
  const w = canvas.parentElement.offsetWidth;
  const h = canvas.parentElement.offsetHeight;

  canvas.setAttribute("width", w);
  canvas.setAttribute("height", h);

  socket.emit("get all drawings", null)
}

canvasInit();

socket.on("all drawings", data => {
  data.forEach(d => draw(d.x, d.y, d.size, d.color))
})

// On resize update the canvas
window.addEventListener("resize", canvasInit);

function drawStart(e) {
  socket.emit("drawing", getProperties(e))
  console.log('oiajwef')
  window.addEventListener("mousemove", drawing);
}

function drawing(e) {
  socket.emit("drawing", getProperties(e))

  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", drawing)
  })
}



function getProperties(e) {
  const margins = {
    left: e.target.offsetLeft,
    top: e.target.offsetTop,
    width: e.target.offsetWidth,
    height: e.target.offsetHeight
  }

  const xPos = e.clientX - margins.left;
  const yPos = e.clientY - margins.top;
  return {x: xPos, y: yPos, size: pen.size, color: pen.color}
}

socket.on("display drawing", data => draw(data.x, data.y, data.size, data.color))

function draw(x, y, size, color) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

canvas.addEventListener("mousedown", drawStart)
canvas.addEventListener("mouseleave", () => {
  window.removeEventListener("mousemove", drawing)
})
