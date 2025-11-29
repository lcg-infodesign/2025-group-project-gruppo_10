// variabili globali
let data;
let torcia;
let regioneCorrente = 'Titolo';

// variabili per font
let fontRegular;
let fontMedium;
let fontBold;

// variabili per responsiveness
let graficoWidth;
let annoWidth;

// variabili per selezionare l'anno
let datiFiltrati;
let selettoreAnno; 
let annoCorrente;

function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  torcia = loadImage("img/torcia.png");
  fontRegular = loadFont("font/NeueHaasGrotDisp-55Roman.otf");
  fontMedium = loadFont("font/NeueHaasGrotDisp-65Medium.otf");
  fontBold = loadFont("font/NeueHaasGrotDisp-75Bold.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // variabili per responsiveness
  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;
  
  // Recupera la regione dall'URL
  const urlParams = new URLSearchParams(window.location.search);
  let regionFromURL = urlParams.get('region');
  
  // Decodifica e normalizza la regione
  if (regionFromURL) {
    regioneCorrente = decodeURIComponent(regionFromURL);
    console.log("Regione ricevuta dall'URL:", regioneCorrente);
  } else {
    regioneCorrente = 'Regione non trovata';
  }
  
  // filtro i dati per anno
  // trova tutti gli anni unici presenti nella colonna 'Edition'
  let anni = data.getColumn('Edition').map(Number); 
  let anniUnici = [...new Set(anni)].sort((a, b) => b - a); 
  
  // crea l'elemento select
  selettoreAnno = createSelect(); 
  selettoreAnno.position(50, 100);
  selettoreAnno.style('padding', '8px');
  selettoreAnno.style('font-size', '16px');
  selettoreAnno.style('z-index', '1000');
  
  // aggiunge le opzioni al menu
  for (let anno of anniUnici) { 
    if (!isNaN(anno)) {
      selettoreAnno.option(anno);
    }
  }
  
  // Recupera l'anno dall'URL se presente, altrimenti usa il più recente
  let annoFromURL = urlParams.get('year');
  
  if (annoFromURL && !isNaN(parseInt(annoFromURL))) {
    annoCorrente = parseInt(annoFromURL);
    selettoreAnno.selected(annoCorrente);
    console.log("Anno ricevuto dall'URL:", annoCorrente);
  } else if (anniUnici.length > 0 && !isNaN(anniUnici[0])) {
    annoCorrente = anniUnici[0]; 
    selettoreAnno.selected(annoCorrente);
    console.log("Anno di default:", annoCorrente);
  } else {
    annoCorrente = null;
  }

  // associa una funzione di callback al cambio di selezione
  selettoreAnno.changed(filtraDatiPerAnno); 
  // filtra e calcola i dati iniziali
  filtraECalcolaDati(annoCorrente); 
}

// funzione richiamata al cambio di selezione del menu
function filtraDatiPerAnno() { 
  annoCorrente = parseInt(selettoreAnno.value()); 
  filtraECalcolaDati(annoCorrente); 
}

// funzione che gestisce il filtro
function filtraECalcolaDati(anno) { 
  if (data && data.getRowCount() > 0 && anno !== null) {
    // filtra le righe dove la colonna 'Edition' corrisponde all'anno selezionato
    // E filtra anche per la regione corrente
    datiFiltrati = data.getRows().filter(riga => {
      return riga.getNum('Edition') === anno && riga.getString('Region') === regioneCorrente; 
    });
  } else {
    datiFiltrati = [];
  }
}

function draw() {
  background("#26231d");
  drawTitle();
  drawBoxes();
  disegnaEtichettaAnno();
}

function drawTitle(){
  push();
  fill('#f0f0f0');
  noStroke();
  textSize(100);
  textFont(fontMedium);
  textAlign(LEFT, TOP);
  text(regioneCorrente, 40, 20); 
  pop();
}

function drawBoxes() {
  // BOX A SINISTRA 
  // Parametri dei box con proporzionalità mantenuta
  let boxX = 40; 
  let boxW = graficoWidth * 0.3; // Proporzionale all'area del grafico
  let boxH1 = windowHeight * 0.15; // Proporzionale all'altezza della finestra  
  let boxH2 = windowHeight * 0.35; // Proporzionale all'altezza della finestra
  
  // Posizionamento in verticale
  let boxY1 = 150;
  let boxY2 = boxY1 + boxH1 + 40;
  
  // Stile box
  strokeWeight(2);
  stroke('#f0f0f0');
  fill('#26231d');
  let radius = 30;
  
  // primo box
  rect(boxX, boxY1, boxW, boxH1, radius);
  
  // secondo box
  rect(boxX, boxY2, boxW, boxH2, radius);
  
  // BOX A DESTRA 
  let boxRightX = graficoWidth - boxX - boxW; // posizione x dal bordo destro dell'area grafico
  
  // Dimensioni dei quattro box a destra (proporzionali)
  let totalHeightLeft = boxH1 + 40 + boxH2; // altezza box1 + spazio + altezza box2
  let spacing = 20; // spazio tra i box
  let boxRightH = (totalHeightLeft - 2 * spacing) / 3; // Diviso per 3 box
  
  // Disegno dei tre box impilati verticalmente
  for (let i = 0; i < 3; i++) {
    let y = boxY1 + i * (boxRightH + spacing);
    rect(boxRightX, y, boxW, boxRightH, radius);
  }
}

function disegnaEtichettaAnno() {
  // Identica alla funzione in sketch.js
  push(); 

  // Imposta lo stile del testo
  fill("#f0f0f0");
  textSize(annoWidth * 1.3);
  textFont(fontRegular); 
  textAlign(CENTER, CENTER);
  noStroke();
  
  // Calcolo della posizione xPos per centrare il testo ruotato nell'area annoWidth
  let xPos = graficoWidth + (annoWidth / 2); 
  let yPos = height / 2;
  
  translate(xPos, yPos);
  
  // Ruota il sistema di coordinate di 90 gradi in senso orario
  rotate(PI / 2 * 3);
  
  // Disegna il testo all'origine traslata
  text(annoCorrente, 0, -30); 

  pop();
}