// variabili globali

// variabili per font
let fontRegular, fontMedium, fontBold;

// variabili per bottoni
let iconaArrDown; // icone frecce

function preload() {
  // font
  fontRegular = loadFont("../font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("../font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("../font/NeueHaasDisplayBold.ttf");
  // icone
  iconaArrDown = loadImage("../img/icone/frecce/arrowdown.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // crea il canvas con larghezza della finestra

  // bottoni
  creaBottoneStandard(windowWidth/2, windowHeight/2, iconaArrDown, '../index.html'); // bottone per scendere alla home
}

function draw() {
  background(palette.nero);
}