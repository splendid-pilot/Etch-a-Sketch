const DEFAULT_GRID_SIZE = 16;
const DEFAULT_COLOR = "#000000";
const EMPTY_BACKGROUND = "#FEFEFE";
const DEFAULT_MODE = "color";

let currentSize = DEFAULT_GRID_SIZE;
let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let isMouseDown = false;
let isInCanvas = false;
let showBorder = true;
let darkenEnabled = true;

const canvas = document.querySelector("#canvas");
const colorPicker = document.querySelector("#colorPicker");
const sizePara = document.querySelector("#size-p");
const sizeSlider = document.querySelector("#gridSize");
const rainbowBtn = document.querySelector("#rainbow-btn");
const grayscaleBtn = document.querySelector("#grayscale-btn");
const colorBtn = document.querySelector("#color-btn");
const eraserBtn = document.querySelector("#eraser-btn");
const clearBtn = document.querySelector("#clear-btn");
const borderCbx = document.querySelector("#show-border");
const darkenCbx = document.querySelector("#darken");

const width = canvas.clientWidth;
const height = canvas.clientHeight;

function setupGrid(count) {
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
function setCurrentColor(newColor) {
  currentColor = newColor;
}
function setCurrentMode(newMode) {
  // resetGrid();
  activateButton(newMode);
  currentMode = newMode;
}

function setCurrentSize(newSize) {
  currentSize = newSize;
}

function changeSize(value) {
  setCurrentSize(value);
  updateSizeValue(value);
  reloadGrid();
}

function updateSizeValue(value) {
  sizePara.innerHTML = `${value} &times; ${value}`;
}

function reloadGrid() {
  clearGrid();
  setupGrid(currentSize);
}

function clearGrid() {
  canvas.innerHTML = "";
}

function changeColor(e) {
  if (e.type === "mouseover" && !isMouseDown) return;
  if (currentMode === "eraser") {
    e.target.style.backgroundColor = EMPTY_BACKGROUND;
    e.target.style.opacity = 1;
    return;
  }
  let color;
  if (currentMode === "rainbow") {
    const randomR = Math.floor(Math.random() * 256);
    const randomG = Math.floor(Math.random() * 256);
    const randomB = Math.floor(Math.random() * 256);
    color = `rgb(${randomR}, ${randomG}, ${randomB})`;
  } else if (currentMode === "color") {
    color = currentColor;
  } else if (currentMode == "grayscale") {
    const grayscaleValue = Math.floor(Math.random() * 256);
    const hexValue = grayscaleValue.toString(16).padStart(2, "0");
    const grayscaleColor = `#${hexValue}${hexValue}${hexValue}`;
    color = grayscaleColor;
  }
  if (darkenEnabled) {
    if (!e.target.style.backgroundColor) {
      e.target.style.opacity = 0.1;
    } else {
      opacityAsNumber = Number(e.target.style.opacity);
      if (opacityAsNumber < 1) {
        opacityAsNumber += 0.1;
        e.target.style.opacity = opacityAsNumber;
      }
    }
  } else {
    e.target.style.opacity = 1;
  }
  e.target.style.backgroundColor = color;
}

function resetGrid() {
  for (let row of canvas.children) {
    for (let grid of row.children) {
      grid.style.backgroundColor = "";
    }
  }
}

function activateButton(newMode) {
  if (currentMode === "rainbow") {
    rainbowBtn.classList.remove("active");
  } else if (currentMode === "color") {
    colorBtn.classList.remove("active");
  } else if (currentMode === "eraser") {
    eraserBtn.classList.remove("active");
  } else if (currentMode == "grayscale") {
    grayscaleBtn.classList.remove("active");
  }

  if (newMode === "rainbow") {
    rainbowBtn.classList.add("active");
  } else if (newMode === "color") {
    colorBtn.classList.add("active");
  } else if (newMode === "eraser") {
    eraserBtn.classList.add("active");
  } else if (newMode === "grayscale") {
    grayscaleBtn.classList.add("active");
  }
}

function setUpListener() {
  clearBtn.onclick = () => {
    resetGrid();
  };

  borderCbx.onchange = () => {
    for (let row of canvas.children) {
      for (let grid of row.children) {
        if (borderCbx.checked) {
          grid.classList.remove("no-border");
          showBorder = true;
        } else {
          grid.classList.toggle("no-border");
          showBorder = false;
        }
      }
    }
  };
  darkenCbx.onchange = () => (darkenEnabled = !darkenEnabled);

  sizeSlider.oninput = () => {
    let value = sizeSlider.valueAsNumber;
    sizePara.innerHTML = `${value} &times; ${value}`;
  };

  sizeSlider.onchange = (e) => setupGrid(e.target.valueAsNumber);
  colorPicker.onchange = (e) => setCurrentColor(e.target.value);
  eraserBtn.onclick = () => setCurrentMode("eraser");
  colorBtn.onclick = () => setCurrentMode("color");
  rainbowBtn.onclick = () => setCurrentMode("rainbow");
  grayscaleBtn.onclick = () => setCurrentMode("grayscale");

  canvas.onmouseover = (event) => {
    let id = event.target.id;
    if (id.startsWith("div")) {
      if (isMouseDown) {
        changeColor(event);
      }
    }
  };

  canvas.onmouseup = (event) => {
    let id = event.target.id;
    if (id.startsWith("div")) {
      isMouseDown = false;
    }
  };

  canvas.onmousedown = (event) => {
    let id = event.target.id;
    if (id.startsWith("div")) {
      isMouseDown = true;
    }
  };
  canvas.onmouseout = () => (isInCanvas = false);

  document.onmousedown = (event) => {
    if (isMouseDown && !isInCanvas) {
      event.preventDefault();
    }
  };

  document.onmousemove = (event) => {
    if (isMouseDown && !isInCanvas) {
      event.preventDefault();
    }
  };

  document.onmouseup = () => (isMouseDown = false);

  document.ondrag = (event) => event.preventDefault();
}

document.addEventListener("DOMContentLoaded", () => {
  setupGrid(DEFAULT_GRID_SIZE);
  setUpListener();
});
