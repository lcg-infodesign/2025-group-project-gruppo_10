// variabili globali
let data;

// variabili per font
let fontRegular, fontMedium, fontBold;

function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header"); // caricamento del dataset (con header)
  torcia = loadImage("img/torcia.png");
  // font
  fontRegular = loadFont("font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("font/NeueHaasDisplayBold.ttf");
  // icone
  iconaUs = loadImage("img/icone/us-bianco.png");
  iconaFh = loadImage("img/icone/fh-bianco.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // crea il canvas con larghezza della finestra
}

function draw() {
  background(palette.nero);
}
