/*
https://youtu.be/cGh5yd0YZL4
https://editor.p5js.org/AosagiHeron/sketches/nHcqXeo3p


動画からの変更点
coordsFlippable関数の引数を増やしました。
動画内では(disk,x,y)という3個の引数でしたが、暗黙的にgBoardを
参照してしまっており良くなかったので、boardという引数を増やしました。

Changes from the video
The arguments of the coordsFlippable function have been increased.
In the video, there were three arguments, (disk,x,y),
but it implicitly depends on gBoard, which was not good.
so I added the argument "board".
*/

let gBoard = [
  [0,0,0,0,0,0,0,0,],
  [0,0,0,0,0,0,0,0,],
  [0,0,0,0,0,0,0,0,],
  [0,0,0,1,2,0,0,0,],
  [0,0,0,2,1,0,0,0,],
  [0,0,0,0,0,0,0,0,],
  [0,0,0,0,0,0,0,0,],
  [0,0,0,0,0,0,0,0,],
];

let rayToCoords = (x,y, a,b) => {
  let areaContains = (x,y) => x>=0 && x<8 && y>=0 && y<8;
  let coords = [];
  while(areaContains(x,y)) {
    coords.push([x,y]);
    x += a;
    y += b;
  }
  return coords;
}

let coordsToDisks = (coords, board) => coords.map(c => board[c[1]][c[0]]);

let nFlippable = (disk, vec) => {
  if (vec.length <= 2 || vec[0] !== 0) return 0;
  for(let i=1; i<vec.length; i++) {
    if (vec[i] === 0) {
      return 0;
    } else if (vec[i] === disk) {
      return i-1;
    }
  }
}

let coordsFlippable = (disk, x, y, board) => [...new Array(8).keys()]
  .map(n => [round(cos(n*PI/4)), round(sin(n*PI/4))])
  .map(way => rayToCoords(x,y,way[0],way[1]))
  .map(coords => coords.slice(
      1, 1+nFlippable(disk, coordsToDisks(coords, board))))
  .flat();

function setup() {
  createCanvas(480,480);
}

function draw() {
  background(102,153,0);
  stroke(34,51,0);
  strokeWeight(3);
  noFill();

  for(let y=0; y<8; y++) {
    for(let x=0; x<8; x++) {
      let d = gBoard[y][x];
      if (d === 0) noFill();
      if (d === 1) fill(0);
      if (d === 2) fill(255);
      let w = width/8;
      circle(w*x+w/2, w*y+w/2, w);
    }
  }
}

function mousePressed() {
  let w = width/8;
  let x = floor(mouseX/w);
  let y = floor(mouseY/w);

  let coords = coordsFlippable(1, x,y, gBoard);
  if (coords.length === 0) return;

  for(let c of [...coords, [x,y]]) gBoard[c[1]][c[0]] = 1;

  let xyProduct = [];
  for(let y=0; y<8; y++) for(let x=0; x<8; x++) xyProduct.push([x,y]);

  let bestXyfFirst = xyProduct
    .map(xy => [...xy, coordsFlippable(2, ...xy, gBoard).length])
    .filter(xyf => xyf[2] !== 0)
    .sort( (xyfA,xyfB) => xyfB[2] - xyfA[2]);
  if (bestXyfFirst.length === 0) return;

  let xyf = bestXyfFirst[0];
  for(let c of [...coordsFlippable(2, xyf[0], xyf[1], gBoard), [xyf[0], xyf[1]]]) {
    gBoard[c[1]][c[0]] = 2;
  }
}
