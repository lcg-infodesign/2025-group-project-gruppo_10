// variabili globali
let data;

function preload() {
  data = loadTable("assets/data.csv", "csv", "header"); // caricamento del dataset
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
