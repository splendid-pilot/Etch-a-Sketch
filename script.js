const DEFAULT_GRID_SIZE = 16;
const DEFAULT_COLOR = "#000";
const DEFAULT_MODE = "hover";

let currentGridSize = DEFAULT_GRID_SIZE;
let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let isDown = false;
let isInCanvas = false;
let showBorder = true;
let isEraser = false;
let prevColor = null;

const control = document.querySelector("#control");
const canvas = document.querySelector("#canvas");
const colorPicker = document.querySelector("#colorPicker");
const sizePara = document.querySelector("#size-p");
const sizeSlider = document.querySelector("#gridSize");
const rainbowBtn = document.querySelector("#rainbow-btn");
const grayscaleBtn = document.querySelector("#grayscale-btn");
const eraserBtn = document.querySelector("#eraser-btn");
const clearBtn = document.querySelector("#clear-btn");
const borderCbx = document.querySelector("#show-border");

const width = canvas.clientWidth;
const height = canvas.clientHeight;

function setUpGrid(count) {
  canvas.innerHTML = "";
  for (let i = 0; i < count; i++) {
    let row = document.createElement("div");
    row.classList.toggle("row");
    row.id = `row_${i}`;
    for (let j = 0; j < count; j++) {
      let div = document.createElement("div");
      div.id = `div_${i}_${j}`;
      div.style.width = `${width / count}px`;
      div.style.height = `${height / count}px`;
      div.classList.toggle("grid");
      if (showBorder) {
        div.classList.toggle("show-border");
      }
      row.appendChild(div);
    }
    canvas.appendChild(row);
  }
}

function resetActive() {
  document.querySelectorAll("button").forEach((node) => {
    if (node.classList.contains("active") && node.innerText !== "Clear") {
      node.classList.toggle("active");
    }
  });
}
function changeColor(node, color) {
  node.style.backgroundColor = color;
}
function resetGrid() {
  for (let row of canvas.children) {
    for (let grid of row.children) {
      grid.style.backgroundColor = "";
    }
  }
}
function setUpListener() {
  clearBtn.addEventListener("click", () => {
    resetGrid();
  });

  borderCbx.addEventListener("change", () => {
    for (let row of canvas.children) {
      for (let grid of row.children) {
        if (borderCbx.checked) {
          grid.style.border = "solid 1px black";
          showBorder = true;
        } else {
          grid.style.border = "none";
          showBorder = false;
        }
      }
    }
  });
  sizeSlider.addEventListener("input", () => {
    let value = sizeSlider.valueAsNumber;
    sizePara.innerHTML = `${value} &times; ${value}`;
  });

  sizeSlider.addEventListener("change", () => {
    let value = sizeSlider.valueAsNumber;
    setUpGrid(value);
  });

  colorPicker.addEventListener("change", () => {
    currentColor = colorPicker.value;
  });

  eraserBtn.addEventListener("click", () => {
    if (!isEraser) {
      prevColor = currentColor;
      currentColor = "#FFFFFF";
      isEraser = true;
    } else {
      isEraser = false;
      currentColor = prevColor;
    }
    resetActive();
    eraserBtn.classList.toggle("active");
  });

  //TODO: Implement rainbow mode
  rainbowBtn.addEventListener("click", () => {
    resetActive();
    currentColor = prevColor;
    isEraser = false;
    rainbowBtn.classList.toggle("active");
  });

  //TODO: Implement rainbow mode
  grayscaleBtn.addEventListener("click", () => {
    resetActive();
    isEraser = false;
    currentColor = prevColor;
    grayscaleBtn.classList.toggle("active");
  });

  canvas.addEventListener("mouseover", (event) => {
    let id = event.target.id;
    if (id.startsWith("div")) {
      if (isDown) {
        changeColor(document.querySelector(`#${id}`), currentColor);
      }
    }
  });

  canvas.addEventListener("mouseup", (event) => {
    let id = event.target.id;
    if (id.startsWith("div")) {
      isDown = false;
    }
  });

  canvas.addEventListener("mousedown", (event) => {
    let id = event.target.id;
    if (id.startsWith("div")) {
      isDown = true;
    }
  });

  canvas.addEventListener("mouseout", () => {
    isInCanvas = false;
  });

  document.addEventListener("mousedown", (event) => {
    if (isDown && !isInCanvas) {
      event.preventDefault();
    }
  });

  document.addEventListener("mousemove", (event) => {
    if (isDown && !isInCanvas) {
      event.preventDefault();
    }
  });

  document.addEventListener("mouseup", () => {
    isDown = false;
  });

  document.addEventListener("drag", (event) => {
    event.preventDefault();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setUpGrid(DEFAULT_GRID_SIZE);
  setUpListener();
});
