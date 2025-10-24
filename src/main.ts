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

const undoButton = document.createElement("button") as HTMLButtonElement;
undoButton.id = "undoButton";
undoButton.innerHTML = "UNDO";
document.body.appendChild(undoButton);

const redoButton = document.createElement("button") as HTMLButtonElement;
redoButton.id = "redoButton";
redoButton.innerHTML = "REDO";
document.body.appendChild(redoButton);

canvas.width = 256;
canvas.height = 256;
canvas.style.position = "absolute";
canvas.style.left = "50px";
canvas.style.top = "150px";

document.body.appendChild(canvas);

ctx.fillStyle = "green";
ctx.fillRect(0, 0, 256, 256);

let isDrawing: boolean = false;
let x = 0;
let y = 0;

interface Point {
  x: number;
  y: number;
}

class LineCommand {
  constructor(public points: Point[]) {
  }

  display(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 1;
    const { x, y } = this.points[0]!;
    context.moveTo(x, y);
    for (const { x, y } of this.points) {
      context.lineTo(x, y);
    }
    context.stroke();
    context.closePath();
    //TODO: I think that this class just draws the line onto the canvas
    // now I have to implement class that adds points to the line and continues the drawing
    //Note: create class that is essentially one line it contains the methods to draw a line, then undo
    // and redo called these methods on each line to redraw them
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }
}

let commands: LineCommand[] = [];
let lineArr: Point[][] = [];
let pointArr: Point[] = [];
let redoArr: Point[][] = [];

let lineArrLastIndex = lineArr.length - 1;
let redoArrLastIndex = redoArr.length - 1;
let undoArr: Point[] = lineArr[lineArrLastIndex]!;
let newLine: LineCommand;

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
  ctx.stroke();

  for (let thisLine of lineArr) {
    for (let i = 0; i < thisLine.length - 1; i++) {
      let curPoint = thisLine[i];
      let nextPoint = thisLine[i + 1];

      if (curPoint && nextPoint) {
        drawLine(ctx, curPoint.x, curPoint.y, nextPoint.x, nextPoint.y);
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
undoButton.addEventListener("click", () => {
  lineArrLastIndex = lineArr.length - 1;
  undoArr = lineArr[lineArrLastIndex]!;
  redoArr.push(undoArr);

  //lineArr[lineArrLastIndex] = [];
  lineArr.splice(lineArrLastIndex, 1);
  //console.log("LinearrlastINdex: "+lineArrLastIndex);
  notify("drawing-changed");
});
redoButton.addEventListener("click", () => {
  if (redoArr.length > 0) {
    lineArrLastIndex = lineArr.length - 1;
    undoArr = lineArr[lineArrLastIndex]!;
    redoArrLastIndex = redoArr.length - 1;
    let redoLine: Point[] = redoArr[redoArrLastIndex]!;
    lineArr.push(redoLine);
    console.log(redoArrLastIndex);
    redoArr.splice(redoArrLastIndex, 1);
    notify("drawing-changed");
  }
});
canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;

  let newPoint: Point = { x: x, y: y };
  pointArr = [];
  pointArr.push(newPoint);
  lineArr.push(pointArr);
  newLine = new LineCommand(pointArr);
  commands.push(newLine);
  isDrawing = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    x = e.offsetX;
    y = e.offsetY;

    let newPoint: Point = { x: x, y: y };

    //pointArr.push(newPoint);
    newLine.drag(newPoint.x, newPoint.y);
    //notify("drawing-changed");
    newLine.display(ctx);
  }
});
/*
function printArr(sampleArr: point[]) {
  for (let pointElement of sampleArr) {
    console.log("X: " + pointElement.x + " Y: " + pointElement.y);
  }
}
  */

globalThis.addEventListener("mouseup", () => {
  if (isDrawing) {
    //notify("drawing-changed");
    newLine.display(ctx);
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
