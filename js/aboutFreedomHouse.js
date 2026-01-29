// variabili globali
let data;

// variabili per font
let fontRegular, fontMedium, fontBold;

// variabili per bottoni
let iconaAboutUs, iconaAboutFh, iconaHome, iconaLente, iconaClose; // icone generali
let iconaArrLeft; // icone frecce

function preload() {
  data = loadTable("../assets/FH_dataset.csv", "csv", "header"); // caricamento del dataset (con header)
  torcia = loadImage("../img/torcia.png");
  // font
  fontRegular = loadFont("../font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("../font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("../font/NeueHaasDisplayBold.ttf");
  // icone
  iconaHome = loadImage("../img/icone/home.png");
  iconaAboutUs = loadImage("../img/icone/person.png");
  iconaArrLeft = loadImage("../img/icone/frecce/arrowleft.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // crea il canvas con larghezza della finestra

  let margine = 30;
  let d = 60;

  // bottoni
  creaBottoneStandard(margine, margine, iconaArrLeft, () => window.history.back()); // bottone per tornare indietro
  creaBottoneStandard(width - diametro - margine, margine, iconaHome, '../index.html'); // bottone Freedom House in alto a destra
  creaBottoneStandard(width - (diametro * 2) - margine*3/2, margine, iconaAboutUs, '../html/aboutUs.html'); // bottone About Us a sinistra del primo
}

function draw() {
  background(palette.nero);
}