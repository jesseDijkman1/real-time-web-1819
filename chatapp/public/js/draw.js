import socket from "./main.js";

const gameCanvas = document.querySelector("#game canvas");
const gameOptions = document.querySelectorAll("#game .game-options .options input");

const penSettings = {
  color: "red",
  size: 25
}

function init() {
  for (let i = 0; i < gameOptions.length; i++) {
    gameOptions[i].addEventListener("change", changePen)
  }
}
init()



const ctx = gameCanvas.getContext("2d");

function fixCanvas() {
  const w = gameCanvas.parentElement.offsetWidth;
  const h = gameCanvas.parentElement.offsetHeight;

  gameCanvas.setAttribute("width", w);
  gameCanvas.setAttribute("height", h);
}

fixCanvas()

let isDrawing = false;
let newDrawing;

socket.on("add new player 2", data => {
  if (data.length) {
    data.forEach(d => {
      newDrawing = new Drawing(d[0].x, d[0].y, d[0].size, d[0].color)

      d.forEach(d2 => {
        newDrawing.setPoints(d2.x, d2.y)
        newDrawing.draw()
      })
    })
  //   newDrawing = new Drawing(data[0].x, data[0].y, data[0].size, data[0].color)
  //
  //   for (let i = 0; i < data.length; i++) {
  //     newDrawing.setPoints(data[i].x, data[i].y)
  //     newDrawing.draw()
  //   }
  }
})

function startDrawing(e) {
  const mouseX = e.pageX - e.currentTarget.offsetLeft;
  const mouseY = e.pageY - e.currentTarget.offsetTop;

  isDrawing = true;

  console.log(penSettings)
  newDrawing = new Drawing(mouseX, mouseY, penSettings.size, penSettings.color);

  socket.emit("started drawing", {x: mouseX, y: mouseY, size: penSettings.size, color: penSettings.color})
  // test.start()
  console.log("started")

  gameCanvas.addEventListener("mousemove", painting)

  window.addEventListener("mouseup", endDrawing);
  gameCanvas.addEventListener("mouseleave", endDrawing);
}

function endDrawing(e) {

  gameCanvas.removeEventListener("mousemove", painting)

  if (isDrawing) {
    socket.emit("ended drawing")
  }

  isDrawing = false;
}

function painting(e) {
  const mouseX = e.pageX - e.currentTarget.offsetLeft;
  const mouseY = e.pageY - e.currentTarget.offsetTop;

  const data = newDrawing.setPoints(mouseX, mouseY)
  newDrawing.draw()

  socket.emit("save point data", data)
}



class Drawing {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.points = [];
  }

  setPoints(mx, my) {
    // const point = {x: mx, y: my};
    this.points.push({x: mx, y: my})

    return {x: mx, y: my, color: this.color, size: this.size};
  }

  draw() {
    ctx.strokeStyle = this.color;
    ctx.lineJoin = "round";
    ctx.lineWidth = this.size;

    this.points.forEach((p, i, a) => {
      ctx.beginPath();

      if (i == 0) {
        ctx.moveTo(this.x, this.y)
      } else {
        ctx.moveTo(a[i - 1].x, a[i - 1].y)
      }

      ctx.lineTo(p.x, p.y)
      ctx.closePath()
      ctx.stroke()
    })
  }
}

socket.on("init drawing", data => {
  newDrawing = new Drawing(data.x, data.y, data.size, data.color);
})

socket.on("show drawing", data => {
  newDrawing.setPoints(data.x, data.y)
  newDrawing.draw()
})

function changePen(e) {
  const val = e.target.value;
  const type = e.target.dataset["name"];

  if (type !== "controls") {
    penSettings[type] = val
  } else {
    
  }

}

gameCanvas.addEventListener("mousedown", startDrawing);
