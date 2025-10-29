// deno-lint-ignore-file prefer-const

import "./style.css";

document.body.innerHTML = `
`;

const titleElement = document.createElement("h1");
titleElement.innerHTML = "D2 Sticker Assignment";

document.body.appendChild(titleElement);

let canvas = document.createElement("canvas")!;
canvas.id = "canvasVar";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d")!;
/*
let canvasCreate = document.createElement("canvas")!;
canvasCreate.id = "canvasVar";
document.body.appendChild(canvasCreate);
const canvas = document.getElementById("canvasVar") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
//???what is DOM and why do I need to attach???*/

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

const thickButton = document.createElement("button") as HTMLButtonElement;
thickButton.id = "thickButton";
thickButton.innerHTML = "THICK";
document.body.appendChild(thickButton);
let thicknessValue = 1;
const thinButton = document.createElement("button") as HTMLButtonElement;
thinButton.id = "thinButton";
thinButton.innerHTML = "THIN";
document.body.appendChild(thinButton);

canvas.width = 256;
canvas.height = 256;
canvas.style.position = "absolute";
canvas.style.left = "50px";
canvas.style.top = "150px";

ctx.fillStyle = "green";
ctx.fillRect(0, 0, 256, 256);

let isDrawing: boolean = false;
let mouseState: boolean = false;
let x = 0;
let y = 0;

interface Point {
  x: number;
  y: number;
}

let mainCursor = null;
let markerSize = "20px serif";
class cursor {
  constructor(inX: number, inY: number) {
    this.cursorX = inX;
    this.cursorY = inY;
  }
  cursorX: number;
  cursorY: number;
  draw(context: CanvasRenderingContext2D) {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 256, 256);
    context.font = markerSize;
    ctx.fillStyle = "black";

    context.fillText(".", this.cursorX - 3, this.cursorY + 2);
    console.log("x: " + this.cursorX + "Y: " + this.cursorY);
    if (isDrawing) {
      console.log(isDrawing);
      //this.draw(context);
    }
  }
}
class LineCommand {
  constructor(public points: Point[], public thickness: number) {
  }

  display(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = this.thickness;
    const { x, y } = this.points[0]!;
    context.moveTo(x, y);
    for (const { x, y } of this.points) {
      context.lineTo(x, y);
    }
    context.stroke();
    context.closePath();
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }
}

let commands: LineCommand[] = [];
let pointArr: Point[] = [];
let redoArr: LineCommand[] = [];

let commandsLastIndex = commands.length - 1;

let redoArrLastIndex = redoArr.length - 1;
let undoArr: LineCommand;
let newLine: LineCommand;

thickButton.addEventListener("click", () => {
  thicknessValue = 5;
  markerSize = "50px serif";
});

thinButton.addEventListener("click", () => {
  thicknessValue = .3;
  markerSize = "15px serif";
});

clearButton.addEventListener("click", () => {
  commands = [];
  pointArr = [];
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, 256, 256);
});
undoButton.addEventListener("click", () => {
  if (commands.length > 0) {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 256, 256);
    commandsLastIndex = commands.length - 1;
    undoArr = commands[commandsLastIndex]!;
    redoArr.push(undoArr);
    commands.splice(commandsLastIndex, 1);

    drawCommands(commands);
    console.log("commandsArrlen: " + commands.length);
    //notify("drawing-changed");
  }
});

redoButton.addEventListener("click", () => {
  if (redoArr.length > 0) {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 256, 256);
    commandsLastIndex = commands.length - 1;
    undoArr = commands[commandsLastIndex]!;
    redoArrLastIndex = redoArr.length - 1;

    console.log("redoLinelastind: " + redoArrLastIndex);

    let redoLine: LineCommand = redoArr[redoArrLastIndex]!;
    commands.push(redoLine);

    redoArr.splice(redoArrLastIndex, 1);
    drawCommands(commands);
  }
});
canvas.addEventListener("tool-moved", () => {
  canvas.style.cursor = "none";
});
canvas.addEventListener("mouseenter", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  ctx.fillStyle = "black";
  mainCursor = new cursor(x, y);
  mouseState = true;

  canvas.dispatchEvent(new Event("tool-moved"));
});
canvas.addEventListener("mouseout", () => {
  mouseState = false;
  console.log("mouseOut");
});

canvas.addEventListener("mousedown", () => {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, 256, 256);
  drawCommands(commands);
  /*pointArr = [];
  pointArr.push(newPoint);
  lineArr.push(pointArr);*/
  newLine = new LineCommand(pointArr, thicknessValue);
  commands.push(newLine);
  isDrawing = true;
  mouseState = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    x = e.offsetX;
    y = e.offsetY;

    newLine.drag(x, y);
    newLine.display(ctx);
  } else if (mouseState) {
    x = e.offsetX;
    y = e.offsetY;
    mainCursor = new cursor(x, y);
    mainCursor.draw(ctx);
    drawCommands(commands);
  }
});

globalThis.addEventListener("mouseup", () => {
  if (isDrawing) {
    mainCursor = null;
    newLine.display(ctx);
    x = 0;
    y = 0;
    pointArr = [];
    isDrawing = false;
    mouseState = true;
  }
});

function drawCommands(comArr: LineCommand[]) {
  for (let elements of comArr) {
    elements.display(ctx);
  }
}

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
