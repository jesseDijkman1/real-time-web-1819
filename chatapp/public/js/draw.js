const gameCanvas = document.querySelector("#game canvas");

const ctx = gameCanvas.getContext("2d");

function fixCanvas() {
  const w = gameCanvas.parentElement.offsetWidth;
  const h = gameCanvas.parentElement.offsetHeight;

  gameCanvas.setAttribute("width", w);
  gameCanvas.setAttribute("height", h);
}

fixCanvas()

let newDrawing;

function startDrawing(e) {
  const mouseX = e.pageX - e.currentTarget.offsetLeft;
  const mouseY = e.pageY - e.currentTarget.offsetTop;

  newDrawing = new Drawing(mouseX, mouseY, 40, "red");

  // test.start()
  console.log("started")

  gameCanvas.addEventListener("mousemove", painting)

  window.addEventListener("mouseup", endDrawing);
  gameCanvas.addEventListener("mouseleave", endDrawing);
}

function endDrawing(e) {
  gameCanvas.removeEventListener("mousemove", painting)

  // test.end()
}

function painting(e) {
  const mouseX = e.pageX - e.currentTarget.offsetLeft;
  const mouseY = e.pageY - e.currentTarget.offsetTop;

  newDrawing.setPoints(mouseX, mouseY)
  newDrawing.draw()
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
    this.points.push({x: mx, y: my})
  }

  draw() {
    ctx.strokeStyle = this.color;
    ctx.lineJoin = "round";
    ctx.lineWidth = this.size;

    for (let i = 0; i < this.points.length; i++) {
      ctx.beginPath();

      if (i == 0) {
        ctx.moveTo(this.x, this.y)
      } else {
        ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y)
      }

      ctx.lineTo(this.points[i].x, this.points[i].y)
      ctx.closePath()
      ctx.stroke()
    }


  }
}

gameCanvas.addEventListener("mousedown", startDrawing);
