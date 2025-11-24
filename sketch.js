let column;
let row;
let W;
let H;
let lineWidth = 3;
let solvedCells = [];
let level = 100;
let solveBtn;
let grid = [[0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]] //9x9 grid

function setup() {
  W = windowHeight-2
  H = windowHeight-2

  createCanvas(W, H);

  menu = createDiv();
  menu.style(
    "font-family:Arial, Helvetica, sans-seri; display:grid; flex-direction:column;grid-template-rows: 1fr 1fr 1fr;gap:200px;padding:100px 0px 100px 0px"
    
    )
  
  let myData = { key: 'level', value: level };
  localStorage.setItem(myData.key, myData.value);

  solveBtn = createButton('Solve');
  solveBtn.parent(menu)
  solveBtn.mousePressed(solve);
  solveBtn.style('border-radius:50px;border:1px solid black;color:orange;background-color:black;font-size:40px;cursor:pointer;box-shadow: 0px 0px 10px 1px white;margin-left:10px;padding:0px 50px 0px 50px;')
  
  
  resetBtn = createButton('Empty');
  resetBtn.parent(menu)
  resetBtn.mousePressed(empty)
  resetBtn.style('border-radius:50px;border:1px solid black;color:orange;background-color:black;font-size:40px;cursor:pointer;box-shadow: 0px 0px 10px 1px white;margin-left:10px')


  emptyBtn = createButton('Reset');
  emptyBtn.parent(menu)
  emptyBtn.mousePressed(rest)
  emptyBtn.style('border-radius:50px;border:1px solid black;color:orange;background-color:black;font-size:40px;cursor:pointer;box-shadow: 0px 0px 10px 1px white;margin-left:10px')
}

function getRandomInt(a, b) {
  // Ensure a and b are integers and a is less than b
  a = Math.ceil(a);
  b = Math.floor(b);

  // Generate a random number between a (inclusive) and b (exclusive)
  return Math.floor(Math.random() * (b+1 - a)) + a;
}

function drawGrid(){
  stroke(255)
  // strokeWeight(3)
  column = W/9; 
  row = H/9;
  for (let x = 0; x<=W; x=x+column){
  
    if (x/3 % column == 0 && x!=0){
      strokeWeight(lineWidth)
      stroke(255,0,0)
    }else{stroke(255);strokeWeight(lineWidth)}

    line(x, 0, x, H)
  }
  for (let y = 0; y<H; y=y+row){

    if (y/3 % row == 0 && y!=0 ){
      strokeWeight(lineWidth)
      stroke(255,0,0)

    }else{stroke(255);strokeWeight(lineWidth)}
  
    line(0, y, W, y)

  }
  stroke(255,0,0)
  line(0, row*6, W, row*6)
}
function currentGridCoords(){
  let x = mouseX;
  let y = mouseY;

  return [floor(x/column),floor(y/row)]
}

function hoverMouse(){
  const mx = currentGridCoords()[0]*column
  const my = currentGridCoords()[1]*row
  fill(25)
  noStroke() 
  rect(mx+floor(lineWidth/2), my+floor(lineWidth/2), column-lineWidth, row-lineWidth)
}

function isIn2DArray(array, item) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === item) {
        return true; // Item found in the 2D array
      }
    }
  }
  return false; // Item not found in the 2D array
}
function nGrid(){
  for (let i = 0; i<level; i++){
    let x = getRandomInt(0,8)
    let y = getRandomInt(0,8)
    let v = getRandomInt(1,9)
    if (Valid(v,x,y,grid)){
      grid[x][y] = v
    }
  }
  

  solve()

    for (let i = 0; i<9; i++){
      for (let j = 0; j<9; j++){
        const a = getRandomInt(0,1)
        if (a==0){
          grid[i][j] = 0;
        }
      }
    }
  }

  

nGrid()

function solve() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        for (let a = 1; a <= 9; a++) {
          if (Valid(a, i, j, grid)) {
            grid[i][j] = a;
            if (solve()) {
              return true; // Solution found
            }
            grid[i][j] = 0; // Reset the cell if no valid solution is found
          }
        }
        // unsolvable()
        return false; // No valid solution found for this cell
      }
    }
  }
  return true; // Sudoku puzzle solved
}


function highLIght(){
    for (let i = 0;i<grid.length;i++){
      for (let j = 0;j<grid[i].length;j++){
        if (grid[i][j] == 0){
          fill(0,255,0,25);
          rect(j*row,i*column,column,row);
          
        }
      }
    }
  
}



function numsCoords(){
  
  let coords = [];
  let a = floor(column/2);
  let b = floor(row/2);
  for (let x=1; x<=9; x=x+1){
    for (let y=1; y<=9; y=y+1){
      coords.push([a*(2*x-1),b*(2*y-1)])
    }
  }
  return coords
}

function drawNumbers(){
  let numCoord = numsCoords();
  for (let i = 0; i<grid.length; i++){
    for (let j = 0; j<grid[i].length; j++){
        let n = grid[i][j];
        fill(255)
        stroke(0)
        strokeWeight(0)
        textSize(20)
        let index = i+j*9
        if (n != 0){  
          text(str(n),numCoord[index][0], numCoord[index][1])
        }
    }
  }
}

function Valid(c, i, j, l) {
  // check if number c valid vertically and horizontally
  for (let I = 0; I<l.length; I++){
    for (let J = 0; J<l[I].length; J++){
      if ((c == l[i][J] && j!=J) || 
        ((c == l[I][j] && i!=I))) 
      {
        return false
      }
      
    }
  }

  // Check if number c is valid in the 3x3 subgrid
  const subGridRow = (Math.floor(i / 3) * 3);
  const subGridColumn = (Math.floor(j / 3) * 3);
  for (let x = subGridRow; x < subGridRow + 3; x++) {
    for (let y = subGridColumn; y < subGridColumn + 3; y++) {
      if (l[x][y] === c) {
        return false;
      }
    }
  }

  return true;
}

function removeN(){
  let coords = currentGridCoords();
  let x = coords[0];
  let y = coords[1]
  grid[y][x] = 0
}

function keyPressed(){
  let k = key
  if (ToASCII(k)<58 && 48<ToASCII(k) && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height){1
  let mCoords = currentGridCoords();
  let i = mCoords[0];
  let j = mCoords[1];
  
  
    grid[j][i] = k;
  }
  if (key === 's') {
    solve()
  }
  else if (key == 'r'){
    rest(

    )
  }
  else if (key == 'e'){
    empty()
  }
}


function mousePressed() {
  if (mouseButton === RIGHT) {
    removeN()
    console.log(1)
  }
}
function ToASCII(char) {
  let asciiValue = char.charCodeAt(0);
    return asciiValue;
  }
function rest(){
  nGrid()
}
function empty(){
  for (let i = 0; i<grid.length;i++){
    for (let j = 0; j<grid[i].length;j++){
      grid[i][j] = 0
    }
  }
}

function unsolvable(){
  message = createDiv()
  message.style('width:400px;height:400px;background-color:blue;position:absolute')
}

function draw() {
  background(0);
  drawGrid()
  hoverMouse()
  drawNumbers()
  highLIght()


}

document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});