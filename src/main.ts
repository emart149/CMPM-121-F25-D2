// deno-lint-ignore-file
// deno-lint-ignore-file prefer-const

import "./style.css";

document.body.innerHTML = `
`;

const titleElement = document.createElement("h1");
titleElement.innerHTML = "D2 Sticker Assignment";

document.body.appendChild(titleElement);

const canvas = document.createElement("canvas")!;
canvas.id = "canvasVar";
const ctx = canvas.getContext("2d")!;

const clearButton = document.createElement("button") as HTMLButtonElement;
clearButton.id = "clearButton";
clearButton.innerHTML = "Clear";
document.body.appendChild(clearButton);

canvas.width = 256;
canvas.height = 256;
canvas.style.position = "absolute";
canvas.style.left = "50px";

document.body.appendChild(canvas);

ctx.fillStyle = "green";
ctx.fillRect(0, 0, 256, 256);

let isDrawing: boolean = false;
let x = 0;
let y = 0;

interface point {
  x: number;
  y: number;
}

let lineArr: point[][] = [];
let pointArr: point[] = [];

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

function redraw() {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let thisLine of lineArr) {
    for (let i = 0; i < thisLine.length - 1; i++) {
      let curPoint = thisLine[i];
      let nextPoint = thisLine[i + 1];

      if (curPoint && nextPoint) {
        drawLine(
          ctx,
          curPoint.x,
          curPoint.y,
          nextPoint.x,
          nextPoint.y,
        );
      }
    }
  }
}

const bus = new EventTarget();

function notify(name: string) {
  bus.dispatchEvent(new Event(name));
}

bus.addEventListener("drawing-changed", redraw);

clearButton.addEventListener("click", () => {
  lineArr = [];
  pointArr = [];
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, 256, 256);
});

canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;

  let newPoint: point = { x: x, y: y };
  pointArr = [];
  pointArr.push(newPoint);
  lineArr.push(pointArr);
  notify("drawing-changed");
  isDrawing = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    x = e.offsetX;
    y = e.offsetY;

    let newPoint: point = { x: x, y: y };

    pointArr.push(newPoint);

    notify("drawing-changed");
  }
});

/*function printArr(sampleArr: point[]) {
  for (let pointElement of sampleArr) {
    console.log("X: " + pointElement.x + " Y: " + pointElement.y);
  }
} */

globalThis.addEventListener("mouseup", () => {
  if (isDrawing) {
    notify("drawing-changed");
    x = 0;
    y = 0;
    pointArr = [];
    isDrawing = false;
  }
});

//let testPoint1: point = { x: 29, y: 60 };
//let testPoint2: point = { x: 127, y: 201 };
//let testPoint3: point = { x: 207, y: 60 };

/*pointArr.push(testPoint1);
pointArr.push(testPoint2);
pointArr.push(testPoint3);

printArr(pointArr);

redraw(pointArr);*/

//how to do step 4:
//undo just deletes last element of line array, redo references buffer that stored the deleted
//line
//(Note: make buffer big enough to store muliple lines)
// maybe makeinterface for each line stored
