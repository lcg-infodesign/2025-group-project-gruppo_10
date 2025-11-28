// variabili globali
let data;

function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header"); // caricamento del dataset
}

function setup() {
createCanvas(windowWidth, windowHeight);
textFont('Helvetca Neue');
}

function draw() {
  background ("#282726");

  drawTitle();
  drawBoxes();
}

function drawTitle(){
  // Titolo grande "Africa"
  push();
  fill('#C8CABA');
  noStroke();
  textSize(100);
  textFont('Helvetica Neue');
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Titolo', 40, 20);
  pop();
}

function drawBoxes() {
  // BOX A SINISTRA 
  // Parametri dei box
  let boxX = 40;

  // Dimensioni box 
  let boxW = 350;
  let boxH1 = 150;   
  let boxH2 = 350;  

  // Posizionamento in verticale
  let boxY1 = 150;
  let boxY2 = boxY1 + boxH1 + 40;

  // Stile box
  fill('#282726');
  stroke(2);
  stroke('#C8CABA');
  let radius = 30;

  // primo box
  rect(boxX, boxY1, boxW, boxH1, radius);

  // secondo box
  rect(boxX, boxY2, boxW, boxH2, radius);

  // BOX A DESTRA 
  let boxRightX = width - boxX - boxW; // posizione x dal bordo destro
  
  // Dimensioni dei quattro box a destra (uguali ai box di sinistra)
  let totalHeightLeft = boxH1 + 40 + boxH2; // altezza box1 + spazio + altezza box2
  let bottomMarginLeft = height - (boxY2 + boxH2);

  let spacing = 20; // spazio tra i box
  let boxRightH = (totalHeightLeft - 3 * spacing) / 4;

  // Disegno dei quattro box impilati verticalmente
  for (let i = 0; i < 4; i++) {
    let y = boxY1 + i * (boxRightH + spacing);
    rect(boxRightX, y, boxW, boxRightH, radius);
  }
}
