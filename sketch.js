let data;
let bottoneUS;
let bottoneFH;
let titolo;

function preload() {
  data = loadTable("assets/data.csv", "csv", "header"); 
}

function setup() {
  // Crea la canvas a schermo intero
  createCanvas(windowWidth, windowHeight);

  // Crea gli elementi HTML
  creaTitolo();
  creaBottoniNavigazione();
}

function draw() {
  // Sfondo (colore #eaead8)
  background("#eaead8");
  
  // Qui andrebbe il tuo codice di disegno p5.js
}

// --- GESTIONE RIDIMENSIONAMENTO ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Chiama una funzione dedicata per riposizionare gli elementi DOM
  riposizionaElementiDOM();
}

// --- TITOLO ---
function creaTitolo() {
  titolo = createElement('h1', 'Freedom House');
  titolo.position(25, 35); // Posizione iniziale
  
  // Stili
  titolo.style('color', '#26231d');
  titolo.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  titolo.style('font-size', '70px');
  titolo.style('margin', '0');
  titolo.style('padding', '0');
  titolo.style('line-height', '60px');
  titolo.style('z-index', '1000');
}

// --- BOTTONI DI NAVIGAZIONE ---
function creaBottoniNavigazione() {
  const diametro = 60;
  const yPos = 30;
  
  // --- Bottone FH ---
  bottoneFH = createButton('FH');
  bottoneFH.style('width', diametro + 'px');
  bottoneFH.style('height', diametro + 'px');
  // ... (tutti gli stili restanti)
  bottoneFH.style('border-radius', '50%');
  bottoneFH.style('background-color', '#eaead8');
  bottoneFH.style('color', '#26231d');
  bottoneFH.style('border', '1px solid #26231d');
  bottoneFH.style('text-align', 'center');
  bottoneFH.style('line-height', diametro + 'px');
  bottoneFH.style('font-size', '18px');
  bottoneFH.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottoneFH.style('cursor', 'pointer');
  bottoneFH.style('z-index', '1000');
  
  bottoneFH.mousePressed(() => {
    window.location.href = 'freedomhouse.html';
  });

  // --- Bottone US ---
  bottoneUS = createButton('US');
  bottoneUS.style('width', diametro + 'px');
  bottoneUS.style('height', diametro + 'px');
  // ... (tutti gli stili restanti)
  bottoneUS.style('border-radius', '50%');
  bottoneUS.style('background-color', '#eaead8');
  bottoneUS.style('color', '#26231d');
  bottoneUS.style('border', '1px solid #26231d');
  bottoneUS.style('text-align', 'center');
  bottoneUS.style('line-height', diametro + 'px');
  bottoneUS.style('font-size', '18px');
  bottoneUS.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottoneUS.style('cursor', 'pointer');
  bottoneUS.style('z-index', '1000');

  bottoneUS.mousePressed(() => {
    window.location.href = 'us.html';
  });
  
  // Chiamiamo la funzione di riposizionamento subito per impostare la posizione iniziale
  riposizionaElementiDOM();
}

// Funzione dedicata al riposizionamento di tutti gli elementi DOM
function riposizionaElementiDOM() {
  const diametro = 60;
  const yPos = 30;
  const gap = 20;

  // Calcolo delle posizioni in base alla larghezza corrente della canvas (width)
  let xFH = width - diametro - 25;
  let xUS = xFH - diametro - gap;

  // Riposiziona il titolo (anche se la sua posizione (25, 35) non cambia con width, 
  // è buona norma gestirlo qui se dovesse mai dipendere da windowWidth)
  titolo.position(25, 35); 
  
  // Riposiziona i bottoni
  bottoneFH.position(xFH, yPos);
  bottoneUS.position(xUS, yPos);
}