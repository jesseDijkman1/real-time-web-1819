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
