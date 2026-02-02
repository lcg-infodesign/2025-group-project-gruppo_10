// variabili globali
let data;

// variabili per font
let fontRegular, fontMedium, fontBold;

// variabili per bottoni
let iconaAboutUs, iconaAboutFh, iconaHome, iconaLente, iconaClose; // icone generali
let iconaArrLeft; // icone frecce

// variabili per responsiveness
let graficoWidth;
let annoWidth;
let BASE_W = 1280; // larghezza di riferimento 
let BASE_H = 665; // altezza di riferimento
let scaleFactor = 1; // fattore di scala corrente
let lastScaleFactor = -1; // per capire se la scala è cambiata
let logicalMouseX = 0; // mouse "nello spazio logico"
let logicalMouseY = 0;

let countrySlug = "";   // nome normalizzato senza maiuscole e spazi
let countryName = "";   // il nome leggibile che poi vogliamo scrivere nella pagina come titolo

// CREO UN ARRAY PER CONTENERE GLI ANNI 
let anniDisponibili = []; //array con tutti gli anni disponibili 
let annoSelezionato = "" //anno selezionionato 
let yearSelect; //oggetti select che appare 

// TOTAL SCORE
let punteggioTotale = 0; 

// TOTAL CATEGORIE [A,B,C,D,E,F,G]--> positivi
let totaliCategorie = [0,0,0,0,0,0,0,0];
let maxCategorie = [12, 16, 12, 4, 16, 12, 16, 16];

let questionColumns = [ // per ogni categoria mi associa le colonne del mio dataset che contengono i valori delle domande 
  ["Question A1", "Question A2", "Question A3"], // 0:A
  ["Question B1", "Question B2", "Question B3", "Question B4"], // 1:B
  ["Question C1", "Question C2", "Question C3"],  // 2:C
  ["Add A"],   //Add A 
  ["Question D1", "Question D2", "Question D3", "Question D4"], // 4:D
  ["Question E1", "Question E2", "Question E3"], // 5:E
  ["Question F1", "Question F2", "Question F3", "Question F4"], // 6:F
  ["Question G1", "Question G2", "Question G3", "Question G4"]  // 7:G
];

let questionScores = []; // contiene il punteggio da 0 a 4 di ciascuna Domanda 

// COLORI CATEGORIE 
let coloriCategorie = [];

// valore AddQ (positivo nel CSV, ma negativo nella realtà)
let addQVal = 0;
let addAVal = 0;
// info di tutti i pallini (per sapere coordinate e categoria)
let palliniInfo = [];
// per l'animazione di lampeggio
let animT = 0;
const diametroPallino = 48;

//VARIABILE HOVER PER CATEGORIA 
let hoveredCatIndex = null; 
//VARIABILE CATEGORIA CLICCATA 
let selectedCatIndex = null;

let legendHitAreas = []; // zone cliccabili della legenda
// variabili per selezionare l'anno
let datiFiltrati;
let scrollAccumulato = 0;
let pixelPerAnno = 200; // Quanti pixel di scroll per cambiare anno
let progressoScroll = 0; // Valore da 0 a 1 per l'animazione tra anni

coloriLegenda= {
  electoralProcess: "#D9D97A",
  politicalPluralism: "#6A8AA9",
  functioningGovernment: "#0F3C63",
  addQ: "#C51A1A",
  addA: "#1f863fff", 
  freedomExpression: "#C47929",
  associationalRights: "#9C6EBF",
  ruleOfLaw: "#A4B2B8",
  personalAutonomy: "#C0655A"
}

const whiteHover = palette.bianco; //bianco solito

//VARIABILI PER REGOLARE MEGLIO L'HOVER 
let hoveredLegendCatIndex = null;
let hoveredPalliniCatIndex = null;

//VARIABILI TITOLO (7 parametri)
let panelTitles = [
  "Electoral process",
  "Political pluralism and participation",
  "Functioning of government",
  "Additional Answer",
  "Freedom of expression and belief",
  "Associational and organizational rights",
  "Rule of Law",
  "Personal autonomy and individual rights",
  "Additional Discretionary Question B" 
];

//per  ogni categoria del mio array creo un array con le domande 
let panelQuestions = [
  [ //Electoral process
    "Was the current head of government or other chief national\nauthority elected through free and fair elections? ",
    "Were the current national legislative representatives elected\nthrough free and fair elections?",
    "Are the electoral laws and framework fair, and are they implemented\nimpartially by the relevant election management bodies? ",
  ],
  //Political pluralism and participation
  [
    "Do the people have the right to organize in different political parties or other\ncompetitivepolitical groupings of their choice, and is the system free of undue\nobstacles to the rise and fall of these competing parties or groupings?",
    "Is there a realistic opportunity for the opposition to increase\nits support or gain power through elections?",
    "Are the people's political choices free from domination\nby forces that are external to the political sphere,\nor by political forces that employ extrapolitical means?",
    "Do various segments of the population (including ethnic, racial,\nreligious, gender, LGBT+, and other relevant groups)\nhave full political rights and electoral opportunities?"
  ],
  // Functioning of government
  [
    "Do the freely elected head of government\nand national legislative representatives determine\nthe policies of the government?",
    "Are safeguards against official corruption strong and effective?",
    "Does the government operate with openness and transparency?",
  ],
  // Add A
  [
  "For traditional monarchies that have no parties or electoral process,\ndoes the system provide for genuine, meaningful consultation\nwith the people encourage public discussion of policy choices,\nand allow the right to petition the ruler?"
  ],
  // Freedom of expression and belief
  [
    "Are there free and independent media?",
    "Are individuals free to practice and express their religious faith\nor nonbelief in public and private?",
    "Is there academic freedom, and is the educational system free\nfrom extensive political indoctrination?",
    "Are individuals free to express their personal views on political\nor other sensitive topics without fear of surveillance or retribution?"
  ],
  // Associational and organizational rights
  [
    "Is there freedom of assembly?",
    "Is there freedom for nongovernmental organizations, particularly those\nthat are engaged in human rights -and governance- related work?",
    "Is there freedom for trade unions and similar\nprofessional or labor organizations?",
  ],
  // Rule of Law
  [
    "Is there an independent judiciary?",
    "Does due process prevail in civil and criminal matters?",
    "Is there protection from the illegitimate use of physical force\nand freedom from war and insurgencies?",
    "Do laws, policies, and practices guarantee equal treatment\nof various segments of the population?"
  ],
  // Personal autonomy and individual rights
  [
    "Do individuals enjoy freedom of movement, including the ability\nto change their place of residence, employment, or education?",
    "Are individuals able to exercise the right to own property and establish\nprivate businesses without undue interference\nfrom state or nonstate actors?",
    "Do individuals enjoy personal social freedoms, including choice\nof marriage partner and size of family, protection from domestic violence,\nand control over appearance?",
    "Do individuals enjoy equality of opportunity and freedom\nfrom economic exploitation?"
  ],
  //Additional Discretionary Question B
  [
    "Is the government or occupying power deliberately changing the ethnic\ncomposition of a country or territory so as to destroy a culture\nor tip the political balance in favor of another group?"
  ]
];

function preload() {
  data = loadTable("../assets/FH_dataset.csv", "csv", "header"); // caricamento del dataset (con header)
  // font
  fontRegular = loadFont("../font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("../font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("../font/NeueHaasDisplayBold.ttf");
  // icone
  iconaAboutUs = loadImage("../img/icone/person.png");
  iconaAboutFh = loadImage("../img/icone/info.png");
  iconaArrLeft = loadImage("../img/icone/frecce/arrowleft.png");
  iconaClose = loadImage("../img/icone/close.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleFactor = min(windowWidth / BASE_W, windowHeight / BASE_H);

  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;


  let margine = 30;

  let urlParams = getURLParams();
  
  // DECODIFICA il parametro country
  let countryFromURL = urlParams.country || "";
  countrySlug = countryFromURL ? decodeURIComponent(countryFromURL) : "";
  countrySlug = normalizeCountryName(countrySlug);

  if (countrySlug === "") {
    countryName = "Nessun paese selezionato";
    console.warn("Parametro ?country mancante nell'URL");
    return; 
  }

  // cerco nel CSV la riga che ha lo stesso slug
  let found = false; 
  anniDisponibili = [];

  for (let i = 0; i < data.getRowCount(); i++) {
    let countryCSV = data.getString(i, "Country/Territory").trim();
    let csvSlug = normalizeCountryName(countryCSV);
    let edition = data.getString(i, "Edition").trim();

    if (csvSlug === countrySlug) {
      if (!found) {
        countryName = countryCSV;
        found = true;
      }
      if (!anniDisponibili.includes(edition)) {
        anniDisponibili.push(edition); 
      }
    }
  }
  
  if (!found) {
    countryName = "Paese non trovato (" + countrySlug + ")";
    console.warn("Nessun dato trovato per lo slug:", countrySlug);
    return; // IMPORTANTE: esci se non trovi il paese
  }
  
  // Leggi l'anno dall'URL
  let yearFromURL = urlParams.year || "";
  console.log("Anno dall'URL:", yearFromURL);
  
  // SE HO TROVATO GLI ANNI
  if (anniDisponibili.length > 0) {
    anniDisponibili.sort((a, b) => int(b) - int(a));
    
    // Usa l'anno dall'URL se disponibile e valido
    if (yearFromURL && anniDisponibili.includes(yearFromURL)) {
      annoSelezionato = yearFromURL;
    } else {
      annoSelezionato = anniDisponibili[0];
    }
    
    console.log("Anno selezionato:", annoSelezionato);

    // Calcola subito i punteggi
    aggiornaPunteggioTotale();

    // Crea il select per l'anno
    yearSelect = createSelect();


    yearSelect.selected(annoSelezionato);

    yearSelect.changed(() => {
      annoSelezionato = yearSelect.value();
      aggiornaPunteggioTotale();
    });
    yearIndex = anniDisponibili.indexOf(annoSelezionato);

  }
  
  // bottoni
  creaBottoneStandard(margine, margine, iconaArrLeft, () => window.history.back()); // bottone per tornare indietro
  creaBottoneStandard(width - diametro - margine, margine, iconaAboutFh, '../html/aboutFreedomHouse.html'); // bottone Freedom House in alto a destra
  creaBottoneStandard(width - (diametro * 2) - margine*3/2, margine, iconaAboutUs, '../html/AboutUs.html'); // bottone About Us a sinistra del primo
}

function draw() {
  background(palette.nero);

    drawTitle();

    scaleFactor = min(windowWidth / BASE_W, windowHeight / BASE_H);
    let translateX = (width - BASE_W * scaleFactor) / 2;
    let translateY = (height - BASE_H * scaleFactor) / 2;
    
    // Ricalcola logicalMouseX e logicalMouseY tenendo conto della traslazione
    logicalMouseX = (mouseX - translateX) / scaleFactor;
    logicalMouseY = (mouseY - translateY) / scaleFactor;

    push();

    // La traslazione che devi compensare nel mouse
    translate(translateX, translateY);
    scale(scaleFactor);  

  animT += 0.04; 

  fill(palette.bianco);
  textFont(fontBold);

  

  drawPalliniGrigi();
  updateHoverCategory();
  checkLegendHover();
  drawAddQOverlay();
  drawSidePanel();
  drawTotalScore();
  pop();
  disegnaEtichettaAnno();
}

// FUNZIONE PER NORMALIZZARE I NOMI 
function normalizeCountryName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ""); // tiene solo lettere e numeri
}

//FUNZIONE PER CAPIRE LA POSIZIONE DEL NOSTRO CURSORE 
function pointInRect(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

// DISEGNA I PALLINI 
function drawPalliniGrigi(){
    //VARIABILI 
    let pallini = 100; //definisco il numero dei pallini 
    let colonne = 10; //numero colonne 
    let righeQuadrato = 10; //numero righe 

    let diametro = diametroPallino; //diametro di ogni pallino 
    let spazio = 1; //spazio vuoto tra due pallini 

    let grigliaLarghezza = colonne*diametro + (colonne-1)*spazio; //calcolo la larghezza che occuperanno i pallini 
    let grigliaAltezza = righeQuadrato*diametro + (righeQuadrato-1)*spazio; //calcolo l'altezza occupata 

    //se si deve cambiare la posizione del quadrato di pallini !!!
    let startX = 60;
    let startY = 140; 

    palliniInfo = [];

  coloriCategorie = [
    color("#D9D97A"),// A
    color("#6A8AA9"),// B
    color( "#0F3C63"),// C
    color("#1f863fff"), // 3: Add A  
    color("#C47929"),// D
    color("#9C6EBF"),// E
    color( "#A4B2B8"),// F
    color("#C0655A")   // G
  ];

    noStroke();

    let indicePallino = 0; //parto dal basso a sinistra 

    // se c'è una categoria selezionata uso quella, altrimenti uso l'hover
    let activeCatIndex = (selectedCatIndex !== null) ? selectedCatIndex : hoveredCatIndex;
    let hasActive = (activeCatIndex !== null);

    //ciclo che genera i pallini 
    for (let r=0; r<righeQuadrato; r++) { //indice di riga
      for(let c=0; c<colonne; c++) { //indice di colonna
        let x = startX + c*(diametro+spazio);
        let y = startY + (righeQuadrato - 1 - r) * (diametro + spazio);

        let catIndex = categoriaPerIndice(indicePallino);
        let rCerchio = diametroPallino;  // niente hover di grandezza

      if (catIndex === null) { // nessuna categoria: pallino palette.grigio
        fill(palette.grigio);
      } else { // c'è una categoria, quindi pallini colorati
        let baseCol = coloriCategorie[catIndex];
        let cCol = color(baseCol);

        // se esiste una categoria "attiva" (hover o click)
        // e questo pallino NON è di quella categoria --> lo spengo
        if (hasActive && catIndex !== activeCatIndex) {
          cCol.setAlpha(90);   // opaco
        } else {
          cCol.setAlpha(255);  // pieno
        }
        fill(cCol);
      }

      noStroke();
      circle(x, y, rCerchio);

      palliniInfo.push({ //salvo tutte le info legate al pallino
        index: indicePallino,
        x: x,
        y: y,
        catIndex: catIndex,
        type: "pos" //pos per i positivi, neg negativi 
      });

      indicePallino++; // passo al pallino successivo
    }
  } 
//LINEA DEI PUNTEGGI NEGATIVI inserita solo quando il punteggio totale è negativo 
if(punteggioTotale<0) {
    
//inserisco la LINEA BIANCA di separazione 
let lineY = startY + grigliaAltezza -20;
stroke(palette.bianco);
strokeWeight(2);
line(30,lineY, 60+grigliaLarghezza,lineY);

//scritta 0
noStroke();
fill(palette.bianco);
textAlign(LEFT,CENTER);
textSize(18);
text("0",15,lineY-3);

//10 PALLINI NEGATIVI 
let distanzaLineaPallini = 27;  // distanza verticale tra linea e riga extra
let yExtra = lineY + distanzaLineaPallini; // centro dei pallini della riga extra

fill(0);
noStroke();

for (let c = 0; c < colonne; c++) { //uso solo c
  let x = startX + c * (diametro + spazio);
  
  circle(x, yExtra, diametroPallino);

  //faccio la stessa cosa di prima, associo pallino a degli elementi fissi per riconoscerlo 
  //gli associo le sue caratteristiche 
  palliniInfo.push({
    index: indicePallino,
    x: x,
    y: yExtra,
    catIndex: null,  // nessuna categoria
    type: "neg"      // pallini sotto lo zero
  });
indicePallino++;
  }
};
}

// FUNZIONE HOVER PER CATEGORIA
//funzione che aggiorna quale categoria è in hover 
  // Se c'è una categoria selezionata con il click,
  // l'hover non deve più cambiare nulla.
  function updateHoverCategory() {
  if (selectedCatIndex !== null) {
    hoveredPalliniCatIndex = null; //--> in modalità selezione mi elimina l'hover
    return;
  }
 //se non c'è nessuna seleione attiva, per dafaul metti nessuna categoria in hover 
  hoveredPalliniCatIndex = null;

  // hover sui pallini positivi
  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      let d = dist(logicalMouseX, logicalMouseY, p.x, p.y);
      if (d < diametroPallino / 2) {
        hoveredPalliniCatIndex = p.catIndex;
        break;
      }
    }
  }

  // se non ho hover sui positivi, controllo i negativi (AddQ = 8)
  if (hoveredPalliniCatIndex === null) {
    for (let p of palliniInfo) {
      if (p.type === "neg") {
        let d = dist(logicalMouseX, logicalMouseY, p.x, p.y);
        if (d < diametroPallino / 2) {
          hoveredPalliniCatIndex = 8;
          break;
        }
      }
    }
  }

  // hover “globale” = legenda ha priorità sui pallini
  hoveredCatIndex = (hoveredLegendCatIndex !== null) ? hoveredLegendCatIndex : hoveredPalliniCatIndex;

  // cursore
  if (hoveredCatIndex !== null) cursor(HAND); //cambia il cursore a manina
  else cursor(ARROW);
}

// Controlla hover sulla legenda
function checkLegendHover() {
  if (selectedCatIndex !== null) return;
  
  let mx = logicalMouseX;
  let my = logicalMouseY;
  
  for (let area of legendHitAreas) {
    if (mx >= area.x && mx <= area.x + area.w && my >= area.y && my <= area.y + area.h) {
      cursor(HAND);
      return;
    }
  }
}

//LEGENDA O DOMANDE --> mi gestisce quale delle due funzioni attivare  
function drawSidePanel() {
  if (selectedCatIndex === null) {

    // stato normale → legenda
    backDetailArea = null;
    drawLegenda();

  } else {

    // stato dettaglio → cursore normale OVUNQUE
    cursor(ARROW);              // ← QUESTA È LA CHIAVE
    drawCategoryPanel(selectedCatIndex);

  }
}

//DISEGNO LA LEGENDA 
function drawLegenda() {

  //COSTANTE ANNI --> per addA che compare solo fino al 2017
  const anno = int(annoSelezionato);
  const showAddA = (anno >= 2013 && anno <= 2017);

  //definisco delle costanti per la mia legenda 
  const x = 540;
  const y = 120;
  const w = 570;
  const h = 270;

  legendHitAreas = [];
  hoveredLegendCatIndex = null;
  
  //definsico un bordo 
  noFill();
  stroke(palette.bianco);
  strokeWeight(1);
  rect(x, y, w, h, 30); // 22 = raggio angoli
  noStroke();

  //inserisco un padding per separare scritte e bordo bianco 
  const padX = w * 0.04;  
  const padY = h * 0.18;  

  //definisco variabili per le colonne 
  const colGap = w * 0.04;
  const colW = (w - padX * 2 - colGap) / 2;

  const leftX  = x + padX;
  const rightX = x + padX + colW + colGap;
  const topY   = y + padY;

  //scrivo i titoli delle due categorie 
  fill(palette.bianco);
  noStroke();
  textFont(fontBold || fontRegular);
  textSize(18);
  textAlign(LEFT, BOTTOM);
  text("Political Rights", leftX,  y + padY - 10);
  text("Civil Liberties",  rightX, y + padY - 10);

//cambia gli a capo del mio testo quando cambi ail layout della legenda
const labelFunctioning = showAddA
  ? "Functioning of government"
  : "Functioning\nof government";

const labelPluralism = showAddA
? "Political pluralism and participation"
: "Political pluralism\nand participation";

const labelAddQ = showAddA
?"Additional Question: subtracts points"
: "Additional Question:\nsubtracts points";

  const leftItems = [
  { label: "Electoral Process", color: coloriLegenda.electoralProcess, addQ: false, catIndex: 0},
  { label: labelPluralism, color: coloriLegenda.politicalPluralism, addQ: false, catIndex: 1},
  { label: labelFunctioning, color: coloriLegenda.functioningGovernment, addQ: false, catIndex: 2},
  { label: labelAddQ, color: coloriLegenda.addQ, addQ: true, catIndex:8} // speciale: cerchio vuoto bordo rosso
];

//inserisco AddA solo per gli anni specifici 
if (showAddA) {
  leftItems.push({
    label: "Additional Answer:adds points over 100",
    color: coloriLegenda.addA,
    addQ: false,
    catIndex: 3
  });
}
const pillTextSize = showAddA ? 12 : 14;

const labelFreedom = showAddA 
? "Freedom of expression and belief"
: "Freedom of expression\nand belief";

const labelAss = showAddA 
? "Associational and organizational rights"
: "Associational and\norganizational rights";

const labelPersonal = showAddA
? "Personal autonomy and individual rights"
: "Personal autonomy\nand individual rights";


const rightItems = [
  { label: labelFreedom, color: coloriLegenda.freedomExpression, catIndex: 4},
  { label: labelAss, color: coloriLegenda.associationalRights, catIndex: 5},
  { label: "Rule of Law", color: coloriLegenda.ruleOfLaw, catIndex: 6 },
  { label: labelPersonal, color: coloriLegenda.personalAutonomy, catIndex: 7}
];

//definisco un numero di righe comune 
const rows = max(leftItems.length, rightItems.length);

//VARIABILI DELLE MIE PILLOLE 
  // quanto spazio verticale ho per le pillole (sotto i titoli)
  const bottomPad = h * 0.06;
  const availableH = (y + h) - bottomPad - topY;

  // spazio tra pillole --> dipende da AddA
  const pillGap = showAddA ? availableH * 0.03 : availableH * 0.05;

  // altezza pillola calcolata per far stare "rows" righe
  const pillH = (availableH - (rows - 1) * pillGap) / rows;
  const dotR     = pillH * 0.26;   // raggio del cerchio
  const innerPad = pillH * 0.50;   // distanza dal bordo sinistro

//PRIMA COLONNA 
//CICLO ripeti il mio codice per tutti gli elementi inseriti nella mia "cartella"
for (let i = 0; i < rows; i++) {
  const it = leftItems[i];
  if (!it) continue;   // se non esiste, non disegno nulla

  // posizione verticale della pillola i-esima
  //La pillola parte da topY e scende di un tot ogni volta
  let py = topY + i * (pillH + pillGap);
  let pillX = leftX;
  let pillY = py;

  let hoverByMouse = pointInRect(logicalMouseX, logicalMouseY, pillX, pillY, colW, pillH);
let hoverByPallini = (hoveredPalliniCatIndex !== null && hoveredPalliniCatIndex === it.catIndex);
let isHover = (selectedCatIndex === null) && (hoverByMouse || hoverByPallini);

legendHitAreas.push({ x: pillX, y: pillY, w: colW, h: pillH, catIndex: it.catIndex });
if (isHover) hoveredLegendCatIndex = it.catIndex;

  //SCALA IN HOVER ingrandendo un pochetto 
  let scaleHover = isHover ? 1.08 : 1; // ← quanto cresce (1.05–1.1 va benissimo)
  // centro della pillola
  let cx = pillX + colW / 2;
  let cy = pillY + pillH / 2;

  //hover solo se non c'è selezione 
  
push();
translate(cx, cy);
scale(scaleHover);
translate(-cx, -cy);

if (isHover) {
  fill(whiteHover);
  stroke(whiteHover);
} else {
  noFill();
  stroke(palette.bianco);
}
strokeWeight(1);
rect(pillX, pillY, colW, pillH, pillH * 0.45);
noStroke();

  // coordinate icona
  let iconX = pillX + innerPad;
  let iconY = pillY + pillH / 2;

  // ICONE:
  if (it.addQ) {
    // AddQ: cerchio vuoto con SOLO bordo rosso
    noFill();
    stroke(it.color);
    strokeWeight(4);
    circle(iconX, iconY, dotR * 2);
    noStroke();
  } else {
    // tutte le altre: cerchio pieno
    fill(it.color);
    noStroke();
    circle(iconX, iconY, dotR * 2);
  }

  // TESTO
  fill(isHover ? palette.nero : palette.bianco);
  
  textFont(fontRegular);
  textSize(pillTextSize);
  textAlign(LEFT, CENTER);

  let textX = pillX + innerPad + dotR * 2.2;
  text(it.label, textX, iconY);

  pop();
}
//SECONDA COLONNA, STESSO CICLO FOR 
for (let i = 0; i < rows; i++) {
  const it = rightItems[i];
  if (!it) continue;

  let py = topY + i * (pillH + pillGap);
  let pillX = rightX;
  let pillY = py;

  let hoverByMouse = pointInRect(logicalMouseX, logicalMouseY, pillX, pillY, colW, pillH);
let hoverByPallini = (hoveredPalliniCatIndex !== null && hoveredPalliniCatIndex === it.catIndex);
let isHover = (selectedCatIndex === null) && (hoverByMouse || hoverByPallini);
  legendHitAreas.push({ x: pillX, y: pillY, w: colW, h: pillH, catIndex: it.catIndex });

  if (isHover) hoveredLegendCatIndex = it.catIndex;
let scaleHover = isHover ? 1.08 : 1;

let cx = pillX + colW / 2;
let cy = pillY + pillH / 2;

push();
translate(cx, cy);
scale(scaleHover);
translate(-cx, -cy);

if (isHover) {
  fill(whiteHover);
  stroke(whiteHover);
} else {
  noFill();
  stroke(palette.bianco);
}
strokeWeight(1);
rect(pillX, pillY, colW, pillH, pillH * 0.45);
noStroke();

  let iconX = pillX + innerPad;
  let iconY = pillY + pillH / 2;

  fill(it.color);
  noStroke();
  circle(iconX, iconY, dotR * 2);

  fill(isHover ? palette.nero : palette.bianco);
  textFont(fontRegular);
  textSize(pillTextSize);
  textAlign(LEFT, CENTER);

  let textX = pillX + innerPad + dotR * 2.2;
  text(it.label, textX, iconY);

  pop();
}

//BOX ACCANTO LAVORO DI FEDE 
const boxW = 290;
const boxH = 220;
const boxX = 820;   // distanza dal numero
const boxY = 400;

noFill();
stroke(255);
strokeWeight(1);
rect(boxX, boxY, boxW, boxH, 18);
noStroke();

  }

//FUNZIONE PER DISEGNARE IL TOTAL SCORE 
function drawTotalScore() {
//TOTAL SCORE 
const x = 540;
  const y = 120;
  const w = 570;
  const h = 270;
// inserimento degli elementi legati al total score sotto la legenda 
const scoreRightX = x + w * 0.32;  // sposta tutto il blocco a dx/sx
const scoreBaseY  = y + h + 170;   // distanza sotto la legenda

//  testo e "numero cifre"
const scoreVal = int(punteggioTotale);
const scoreStr = str(scoreVal);

// cifre = lunghezza del numero senza il segno "-"
const digits = str(abs(scoreVal)).length;

// 2) layout che cambia per 1/2/3 cifre
let bigSize, slashDY, slashDX, labelDY1, labelDY2;

if (digits === 1) {
  bigSize  = 140;   // dimensione numero 
  slashDX  = 10;    // /100 distanza
  slashDY  = 0.52;  // quanto sale /100 
  labelDY1 = 0.2;  // TOTAL SCORE (sotto)
  labelDY2 = 0.30;  // IN 2024 (sotto)
} else if (digits === 2) {
  bigSize  = 140;
  slashDX  = 10;
  slashDY  = 0.52;
  labelDY1 = 0.2;
  labelDY2 = 0.30;
} else { // 3 cifre (es. 100)
  bigSize  = 110;   
  slashDX  = 6;     
  slashDY  = 0.49; 
  labelDY1 = 0.255;  
  labelDY2 = 0.382;
}

// 3) disegno
push();
fill(palette.bianco);
noStroke();

// NUMERO GRANDE (allineato a destra)
textFont(fontMedium);
textSize(bigSize);
textAlign(RIGHT, BASELINE);
text(scoreStr, scoreRightX, scoreBaseY);

// /100 (in alto a destra del numero)
textFont(fontRegular);
textSize(26);
textAlign(LEFT, BASELINE);

const slashX = scoreRightX + slashDX;
const slashY = scoreBaseY - bigSize * slashDY;
text("/100", slashX, slashY);

// LABELS sotto
textAlign(RIGHT, BASELINE);

textFont(fontBold);
textSize(16);
text("TOTAL SCORE", scoreRightX, scoreBaseY + bigSize * labelDY1);

textFont(fontRegular);
textSize(14);
text("IN " + annoSelezionato, scoreRightX, scoreBaseY + bigSize * labelDY2);

pop();
}

// FUNZIONE PUNTEGGIO CATEGORIA (stile TOTAL SCORE)
function drawCategoryScore(catIndex) {

  // POSIZIONE (stesso riferimento di drawTotalScore) 
  const x = 540;
  const y = 120;
  const w = 570;
  const hLegend = 270;

  // stessa base del total score
  const scoreBaseY = y + hLegend + 170;

  // POSIZIONE ORIZZONTALE DEL BLOCCO CATEGORIA (MANOPOLA)
  // spostalo a destra/sinistra se vuoi
  const catRightX = x + w * 0.78;

  // --- BLOCCO 2: PRENDO VALORE + MASSIMO ---
  let val = 0;
  let maxVal = 0;

  // categorie 0..7
  if (catIndex >= 0 && catIndex <= 7) {
    val = int(totaliCategorie[catIndex] || 0);
    maxVal = int(maxCategorie[catIndex] || 0);
  }

  // AddQ (indice 8) -> scala 0..4
  if (catIndex === 8) {
    val = int(constrain(addQVal, 0, 4));
    maxVal = 4;
  }

  // --- BLOCCO 3: COLORE (numero grande in colore categoria) ---
  let numCol;
  if (catIndex === 8) {
    numCol = color("#C51A1A");
  } else {
    numCol = color(coloriCategorie[catIndex]);
  }

  // --- BLOCCO 4: LAYOUT DINAMICO (come total score: 1/2 cifre vs 3 cifre) ---
  const digits = str(abs(val)).length;

  let bigSize, slashDY, slashDX, labelDY1, labelDY2;

  if (digits === 1) {
    bigSize  = 140;
    slashDX  = 10;
    slashDY  = 0.52;
    labelDY1 = 0.20;
    labelDY2 = 0.30;
  } else if (digits === 2) {
    bigSize  = 140;
    slashDX  = 10;
    slashDY  = 0.52;
    labelDY1 = 0.20;
    labelDY2 = 0.30;
  } else {
    bigSize  = 110;
    slashDX  = 6;
    slashDY  = 0.49;
    labelDY1 = 0.255;
    labelDY2 = 0.382;
  }

  // DISEGNO (stessa gerarchia del total score) 
  push();
  noStroke();

  // NUMERO GRANDE (colorato)
  fill(numCol);
  textFont(fontMedium || fontBold);
  textSize(bigSize);
  textAlign(RIGHT, BASELINE);
  text(str(val), catRightX, scoreBaseY);

  // "/max" (bianco)
  fill(palette.bianco);
  textFont(fontRegular);
  textSize(26);
  textAlign(LEFT, BASELINE);

  const slashX = catRightX + slashDX;
  const slashY = scoreBaseY - bigSize * slashDY;
  text("/" + str(maxVal), slashX, slashY);

  // LABELS sotto (bianco, come total score)
  textAlign(RIGHT, BASELINE);

  textFont(fontBold);
  textSize(16);
  text("CATEGORY SCORE", catRightX, scoreBaseY + bigSize * labelDY1);

  textFont(fontRegular);
  textSize(14);
  text("IN " + annoSelezionato, catRightX, scoreBaseY + bigSize * labelDY2);

  pop();
}

// FUNZIONE DOMANDE: disegna il nuvo pannello che compare con un click 
function drawCategoryPanel(catIndex) {

// BLOCCO CONFIGURAZIONE BASE (stile legenda)
// box IDENTICO alla legenda (stessa X/Y e stessa larghezza)
  let x0 = 540; 
  let y0 = 120; 
  let w  = 570; 
  let r  = 30;

  // padding interni uguali
  let paddingLeft   = 24;
  let paddingRight  = 24;
  let paddingBottom = 20;

  // layout “header” identico alla legenda
  const padY = 270 * 0.18;  // uso la stessa proporzione della legenda
  const headerBaselineY = y0 + padY - 10; // stessa Y dei titoli legenda

  // tipografia domande
  let lineHeight = 18; 
  let textSizeQ  = 14;

  // distanza tra header e inizio contenuto
  let gapAfterTitle = 22;
  let gapBetweenQuestions = 14;  

  // pallini
  let palliniOffset  = 100;
  let palliniRaggio  = 8;
  let palliniSpazio  = 18;

  // contenuti
  let titolo = panelTitles[catIndex] || "Category details";
  let questions = panelQuestions[catIndex] || [];

 
  // BLOCCO CALCOLO ALTEZZA DINAMICA (h cambia con le domande)

  // 1) calcolo quante righe totali di testo ho (considerando \n)
  let totalLines = 0;
  for (let q of questions) {
    totalLines += q.split("\n").length;
  }

  // 2) altezza del blocco domande = righe * lineHeight
  let questionsTextH = totalLines * lineHeight;
  let gapsH = max(0, questions.length - 1) * gapBetweenQuestions;


  // 3) calcolo top del contenuto 
  let contentTop = headerBaselineY + gapAfterTitle;

  // 4) altezza totale = distanza dall’inizio box a contentTop + testo + paddingBottom
  let h = (contentTop - y0) + questionsTextH + gapsH + paddingBottom; 

  // BLOCCO DISEGNO BOX + TITOLO

  // BOX
  noFill();
  stroke(palette.bianco);
  strokeWeight(1);
  rect(x0, y0, w, h, r);
  noStroke();

  // TITOLO (stesso stile e posizione della legenda)
  fill(palette.bianco);
  noStroke();
  textFont(fontBold);
  textSize(18);
  textAlign(LEFT, BOTTOM);
  text(titolo, x0 + paddingLeft, headerBaselineY);

 
    // BLOCCO BOTTONE CLOSE (immagine, allineata bene)

  let btnSize = 46;      // <-- più grande (cambia qui la dimensione base)
  let closePad = 18;     // <-- gap dal bordo interno del box (cambia qui il "bel gap")

  // posizione: ancorata all'angolo alto-destro del BOX
  let xBtn = x0 + w - closePad - btnSize+5;
  let yBtn = y0 + closePad-10;

  // area cliccabile (un po' più grande dell'icona)
  backDetailArea = {
    x: xBtn - 8,
    y: yBtn - 8,
    w: btnSize + 16,
    h: btnSize + 16
  };

  // hover
  let hoverClose = pointInRect(
    logicalMouseX, logicalMouseY,
    backDetailArea.x, backDetailArea.y, backDetailArea.w, backDetailArea.h
  );

  // cursore: torna normale di default, mano solo sulla X
  if (hoverClose) cursor(HAND);

  // scale hover
  let hoverScale = hoverClose ? 1.12 : 1.0;
  let drawSize = btnSize * hoverScale;

  // centra il disegno quando cresce (così NON si sposta)
  let dx = (drawSize - btnSize) / 2;
  let dy = (drawSize - btnSize) / 2;

  imageMode(CORNER);
  image(iconaClose, xBtn - dx, yBtn - dy, drawSize, drawSize);


  // BLOCCO DISEGNO DOMANDE + PALLINI (pallini sulla prima riga)

  textFont(fontRegular);
  textSize(textSizeQ);
  fill(palette.bianco);
  noStroke();

 
  textAlign(LEFT, TOP);

  let palliniStartX = x0 + paddingLeft;
  let textX = x0 + palliniOffset;

  let currentY = contentTop;

  for (let qi = 0; qi < questions.length; qi++) {

    let q = questions[qi];

    // punteggio
    let score = 0;
    if (catIndex === 8) {
      score = int(constrain(addQVal, 0, 4));
    } else if (questionScores[catIndex]) {
      score = int(constrain(questionScores[catIndex][qi] || 0, 0, 4));
    }

    // righe della domanda
    let righe = q.split("\n");

    // PALLINI ALLINEATI ALLA PRIMA RIGA:
    // currentY è il TOP della prima riga => centro pallino = currentY + lineHeight/2
    let palliniY0 = currentY + lineHeight / 2 ; //ATTENZIONE MENO TRE ME LO ALLINEA BENE 

    // disegno pallini
    for (let i = 0; i < 4; i++) {

      if (i < score) {
        if (catIndex === 8) {
          fill("#C51A1A");
        } else {
          let c = color(coloriCategorie[catIndex]);
          c.setAlpha(255);
          fill(c);
        }
      } else {
        fill(palette.grigio);
      }

      let px = palliniStartX + i * palliniSpazio +6 ;
      circle(px, palliniY0 -3, palliniRaggio * 2);
    }

    // testo (tutte le righe)
    fill(palette.bianco);
    for (let riga of righe) {
      text(riga, textX, currentY);
      currentY += lineHeight;
    }

    // gap fisso tra domande (se vuoi più aria, aumenta di poco)
    currentY += gapBetweenQuestions; 
  }

drawCategoryScore(catIndex);
}
  
// FUNZIONE ADDQ (domanda negativa)
function drawAddQOverlay() {
  let n = int(addQVal);   //valore addQ convertito con int in intero per sicurezza
  if (n <= 0) return;  // se è zero o negativo, non faccio nulla

  // political rights: sono le prime tre categorie, da 0 a 2
  let maxCatPR = 2;

  //ANIMAZIONE 
  let alphaInner = map(cos(animT), -1, 1, 0, 255);
  //variabile globale che incremento ad ogni frame nel draw 
  //cos oscilla sempre tra -1 e 1
  //oscillazione che viene mappata in un opacità 

  let colpiti = 0; //quanti pallini fanno questa cosa?

  let targets = [];

  // prendo gli ULTIMI pallini colorati

  // 1) raccolgo tutti i pallini positivi con categoria (quindi solo quelli colorati)
  let colored = [];
  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      colored.push(p);
    }
  }

  // 2) li ordino per indice crescente (0,1,2,...)
  colored.sort((a, b) => a.index - b.index);

  // 3) prendo gli ultimi n (partendo dalla fine dell’array)
  for (let i = colored.length - 1; i >= 0 && targets.length < n; i--) {
    targets.push(colored[i]);
  }

  //Negativi (sotto la linea)
  for (let p of palliniInfo) {
  if (p.type === "neg") {
    targets.push(p);
    }
  }

  //applico l'effetto con l'ordine delle regole di sopra 
  for (let p of targets) {
    if (colpiti >= n) break; 
  //se ho già cerchiato il numero di pallini giusto, ok 
  //se no procedo a fare anche quetso pallino 

   let rCerchio = diametroPallino;
    
    noStroke();
    fill(0);                      // stesso colore del background
    circle(p.x, p.y, rCerchio);


    //INTERNO di un pallino con bordo rosso 
   if (p.type === "pos" && p.catIndex !== null) {
    // pallino positivo: recupero il colore della categoria
    let baseCol = coloriCategorie[p.catIndex];
    let c = color(baseCol);   // 
    c.setAlpha(alphaInner);   // ok, non tocca l’originale
    fill(c);
    c.setAlpha(alphaInner);

    
    noStroke();
    fill(c);
    circle(p.x, p.y, rCerchio);

    //pallino negativo sotto la linea 
  } else if (p.type === "neg") {
    // pallino negativo
    let c = color("#C51A1A");
    noStroke();
    fill(c);
    circle(p.x, p.y, rCerchio);
  }

  //BORDO ROSSO FISSO
  noFill(); //vuoto
  stroke(197, 26, 26);   // rosso pieno
  strokeWeight(5);
  circle(p.x, p.y, rCerchio );  // anello più grande


  colpiti++;
}

// ripristino stato
noStroke();
  }

// FUNZIONE PUNTEGGIO TOTALE + ARRAY CON I VALORI DELLE CATEGORIE 
function aggiornaPunteggioTotale(){ //e anche categorie 
  punteggioTotale = 0; //azzero la mia variabile per sicurezza 

  //ciclo 
  for (let i=0; i<data.getRowCount(); i++){
    let countryCSV = data.getString(i,"Country/Territory").trim();
    let csvSlug = normalizeCountryName(countryCSV);
    let edition = data.getString(i,"Edition").trim();

    // stesso paese + stesso anno
    if (csvSlug === countrySlug && edition === annoSelezionato) {
      punteggioTotale = data.getNum(i, "TOTAL"); //ATTENZIONE ALLO SPAZIO ALLA FINE 
      
      totaliCategorie[0] = data.getNum(i, "Total A");
      totaliCategorie[1] = data.getNum(i, "Total B");
      totaliCategorie[2] = data.getNum(i, "Total C");

      // leggo Add A come stringa
      let addAStr = data.getString(i, "Add A").trim();
      // se è vuoto o N/A --> lo considero 0
      if (addAStr === "" || addAStr.toUpperCase() === "N/A") {
      addAVal = 0;
      } else {
      addAVal = float(addAStr);   // converto a numero
      if (isNaN(addAVal)) addAVal = 0;
      }
      totaliCategorie[3] = addAVal;

      totaliCategorie[4] = data.getNum(i, "Total D");
      totaliCategorie[5] = data.getNum(i, "Total E");
      totaliCategorie[6] = data.getNum(i, "Total F");
      totaliCategorie[7] = data.getNum(i, "Total G");

      //leggo anche la domanda aggiuntiva 
      // leggo Add Q come stringa
      let addQStr = data.getString(i, "Add Q").trim();

      // se è vuoto o N/A --> 0
      if (addQStr === "" || addQStr.toUpperCase() === "N/A") {
      addQVal = 0;
      } else {
      addQVal = float(addQStr);
      if (isNaN(addQVal)) addQVal = 0;
      }

      //AGGIUNGO CHE OLTRE AI TOTALI LEGGO ANCHE I PUNTEGGI DELLE SINGOLE DOMANDE 
       questionScores = []; // svuoto
         for (let k = 0; k < questionColumns.length; k++) { //scorriamo tutte le categorie 
        let cols = questionColumns[k]; //cols è l'elenco dei nomi di colonna CSV
        questionScores[k] = []; //array che conterrà i punteggi delle domande in quella categoria 

      if (!cols) continue; //se cols è vuoto, quella categoria non ha domande, vado avanti 

        for (let q = 0; q < cols.length; q++) {
          let colName = cols[q]; //nome colonna (Question A)
          let valStr = data.getString(i, colName).trim(); //prende la stringa del CSV 

          let val;
          if (valStr === "" || valStr.toUpperCase() === "N/A") { //se è vuota o ha scritte strane prende 0
            val = 0;
          } else {
            val = float(valStr); //converte in numero 
            if (isNaN(val)) val = 0;
          }

          questionScores[k][q] = val; // memorizza il punteggio 
        }
      }

      break; // mi fermo: ho trovato la riga giusta
    }
  }
};

function categoriaPerIndice(indicePallino) {
  let somma = 0;//variabile somma, terrà la somma dei pallini precedenti (pallini già usati fino ad ora)

  for (let k = 0; k < totaliCategorie.length; k++) { //ciclo for per le 7 categorie
    let puntiCat = int(totaliCategorie[k]); // mi assicuro che sia intero e positivo
    if (puntiCat < 0) puntiCat = 0; //per ora considero solo i +, se è negativo lo fisso a 0


    //se l'indice è dentro l'intervallo di quella categoria 
    if (indicePallino <somma+puntiCat){ //somma pallini già usati, puntiCat pallini di questa categoria 
      return k;
    }
    somma+=puntiCat;//altrimenti passa alla categoria successiva 
}
return null;
};

// SE CLICCO IL MOUSE
function mousePressed() {
  let mx = logicalMouseX; 
  let my = logicalMouseY;;


  // SE SONO NEL DETTAGLIO E CLICCO LA X → CHIUDO
  if (selectedCatIndex !== null && backDetailArea) {
  if (pointInRect(logicalMouseX, logicalMouseY,
                  backDetailArea.x, backDetailArea.y,
                  backDetailArea.w, backDetailArea.h)) {
    selectedCatIndex = null;
    backDetailArea = null;
    return;
  }
}

  // controllo se ho cliccato su un pallino "positivo" con categoria
  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      // Usa mx e my (che sono già nello spazio corretto)
      let d = dist(mx, my, p.x, p.y); 
      if (d < diametroPallino / 2) {
        // se clicco sulla stessa categoria già selezionata: la "disattivo"
        if (selectedCatIndex === p.catIndex) {
          selectedCatIndex = null;
        } else {
          // altrimenti seleziono questa categoria
          selectedCatIndex = p.catIndex;
        }
        return; // ho gestito il click, posso uscire dalla funzione
      }
    }
  }

for (let p of palliniInfo) { //PALLINI NEGATIVI 
    if (p.type === "neg") {
      let d = dist(mx, my, p.x, p.y);
      if (d < diametroPallino / 2) {
        // AddQ è indice 8
        if (selectedCatIndex === 8) {
          selectedCatIndex = null;
        } else {
          selectedCatIndex = 8;
        }
        return;
      }
    }
  }

//CLICCARE SULLA LEGENDA 
 for (let area of legendHitAreas) {
    if (pointInRect(mx, my, area.x, area.y, area.w, area.h)) {
      if (selectedCatIndex === area.catIndex) selectedCatIndex = null;
      else selectedCatIndex = area.catIndex;
      return;
    }
  }

  
}

function drawTitle(){
  push();
  fill(palette.bianco);
  noStroke();
  textSize(65);
  textFont(fontMedium);
  textAlign(LEFT, BOTTOM);
  text(countryName, margine*2+diametro, margine+diametro+10); 
  pop();
}

function mouseWheel(event) {
  if (!anniDisponibili.length) return false;

  // Accumula lo scroll
  scrollAccumulato += event.delta;
  
  // Limita lo scroll ai limiti degli anni
  let scrollMin = 0;
  let scrollMax = (anniDisponibili.length - 1) * pixelPerAnno;
  scrollAccumulato = constrain(scrollAccumulato, scrollMin, scrollMax);
  
  // Calcola l'indice dell'anno e il progresso
  let indiceEsatto = scrollAccumulato / pixelPerAnno;
  let nuovoYearIndex = floor(indiceEsatto);
  progressoScroll = indiceEsatto - nuovoYearIndex; // Valore tra 0 e 1
  
  // Limita l'indice tra 0 e il numero massimo di anni
  nuovoYearIndex = constrain(nuovoYearIndex, 0, anniDisponibili.length - 1);
  
  // Se l'anno è cambiato, aggiorna
  if (anniDisponibili[nuovoYearIndex] !== annoSelezionato) {
    yearIndex = nuovoYearIndex;
    annoSelezionato = anniDisponibili[yearIndex];
    yearSelect?.selected(annoSelezionato);
    aggiornaPunteggioTotale();
  }

  return false; // Blocca lo scroll della pagina
}

function disegnaEtichettaAnno() {
  push(); 

  noStroke();
  textFont(fontRegular); 
  textAlign(CENTER, CENTER);
  
  // CALCOLO POSIZIONE COME NEL CODICE REGIONE
  let xPos = graficoWidth + (annoWidth / 2); 
  let yPos = height / 2;
  
  translate(xPos, yPos);
  rotate(PI / 2 * 3); 
  
  const spaziaturaFissaX = 400; 
  let offsetGlobaleX = map(progressoScroll, 0, 1, 0, spaziaturaFissaX);
  
  // Calcola l'indice dell'anno corrente
  let indiceCorrente = anniDisponibili.indexOf(annoSelezionato);
  
  // ANNO PRECEDENTE
  if (indiceCorrente > 0) {
    let annoPrecedente = anniDisponibili[indiceCorrente - 1];
    let baseXPrecedente = spaziaturaFissaX; 
    let finalXPrecedente = baseXPrecedente + offsetGlobaleX;
    
    // USA annoWidth INVECE DI VALORI FISSI
    let dimensionePrecedente = map(progressoScroll, 0, 1, annoWidth * 0.9, annoWidth * 0.7);
    let opacitaPrecedente = map(progressoScroll, 0, 1, 100, 70);
    
    fill(palette.bianco + hex(floor(opacitaPrecedente), 2));
    textSize(dimensionePrecedente);
    text(annoPrecedente, finalXPrecedente, -30);
  }
  
  // ANNO CORRENTE
  let baseXCorrente = 0;
  let finalXCorrente = baseXCorrente + offsetGlobaleX;

  // USA annoWidth INVECE DI VALORI FISSI
  let dimensioneCorrente = map(progressoScroll, 0, 1, annoWidth * 1.3, annoWidth * 0.9);
  let opacitaCorrente = map(progressoScroll, 0, 1, 255, 100);
  
  fill(palette.bianco + hex(floor(opacitaCorrente), 2));
  textSize(dimensioneCorrente);
  text(annoSelezionato, finalXCorrente, -30);
  
  // ANNO SUCCESSIVO
  if (indiceCorrente < anniDisponibili.length - 1) {
    let annoSuccessivo = anniDisponibili[indiceCorrente + 1];
    let baseXSuccessivo = -spaziaturaFissaX;
    let finalXSuccessivo = baseXSuccessivo + offsetGlobaleX;
    
    // USA annoWidth INVECE DI VALORI FISSI
    let dimensioneSuccessivo = map(progressoScroll, 0, 1, annoWidth * 0.7, annoWidth * 1.3); 
    let opacitaSuccessivo = map(progressoScroll, 0, 1, 70, 100);  

    fill(palette.bianco + hex(floor(opacitaSuccessivo), 2));
    textSize(dimensioneSuccessivo);
    text(annoSuccessivo, finalXSuccessivo, -30);
  }

  pop();
}