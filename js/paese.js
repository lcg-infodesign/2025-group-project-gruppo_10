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

// TOTAL CATEGORIE [A,B,C,D,E,F,G]-->positivi
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
const diametroPallino = 44;

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
    "Do the people have the right to organize in different political parties\nor other competitivepolitical groupings of their choice, and is the system free\nof undue obstacles to the rise and fall of these competing parties or groupings?",
    "Is there a realistic opportunity for the opposition to increase\nits support or gain power through elections?",
    "Are the people's political choices free from domination by forces that are external\nto the political sphere, or by political forces that employ extrapolitical means?",
    "Do various segments of the population (including ethnic, racial, religious, gender,\nLGBT+, and other relevant groups) have full political rights and electoral opportunities?"
  ],
  // Functioning of government
  [
    "Do the freely elected head of government and national legislative\nrepresentatives determine the policies of the government?",
    "Are safeguards against official corruption strong and effective?",
    "Does the government operate with openness and transparency?",
  ],
  // Add A
  [
  "For traditional monarchies that have no parties or electoral process,\ndoes the system provide for genuine, meaningful consultation with the people\n encourage public discussion of policy choices, and allow the right to petition the ruler?"
  ],
  // Freedom of expression and belief
  [
    "Are there free and independent media?",
    "Are individuals free to practice and express their religious faith\nor nonbelief in public and private?",
    "Is there academic freedom, and is the educational system free\nfrom extensive political indoctrination?",
    "Are individuals free to express their personal views on political or other sensitive\ntopics without fear of surveillance or retribution?"
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
    "Do individuals enjoy freedom of movement, including the ability to change\ntheir place of residence, employment, or education?",
    "Are individuals able to exercise the right to own property and establish\nprivate businesses without undue interference from state or nonstate actors?",
    "Do individuals enjoy personal social freedoms, including choice of marriage\npartner and size of family, protection from domestic violence,\nand control over appearance?",
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

  animT += 0.01; 

  fill(palette.bianco);
  textFont(fontBold);

  // Total Score
  textSize(72);
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  text("Total: " + punteggioTotale, 560, 130);

  drawPalliniGrigi();
  updateHoverCategory();
  checkLegendHover();
  drawAddQOverlay();
  drawSidePanel();
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

    let startX = 80;
    let startY = 150; 

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
let lineY = startY + grigliaAltezza -15;
stroke(palette.bianco);
strokeWeight(2);
line(60,lineY, 60+grigliaLarghezza,lineY);

//scritta 0
noStroke();
fill(palette.bianco);
textAlign(LEFT,CENTER);
textSize(18);
text("0",40,lineY-3);

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
function updateHoverCategory() {
  // Se c'è una categoria selezionata con il click,
  // l'hover non deve più cambiare nulla.
  if (selectedCatIndex !== null) {
    hoveredCatIndex = null;
    cursor(ARROW);
    return;
  }
  hoveredCatIndex = null;
  let cursorChanged = false;

  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      let d = dist(logicalMouseX, logicalMouseY, p.x, p.y);
      if (d < diametroPallino / 2) {
        hoveredCatIndex = p.catIndex;
        cursor(HAND);
        cursorChanged = true;
        break;
      }
    }
  }
  
  // Controlla anche i pallini negativi
  if (!cursorChanged) {
    for (let p of palliniInfo) {
      if (p.type === "neg") {
        let d = dist(logicalMouseX, logicalMouseY, p.x, p.y);
        if (d < diametroPallino / 2) {
          cursor(HAND);
          cursorChanged = true;
          break;
        }
      }
    }
  }
  
  if (!cursorChanged) {
    cursor(ARROW);
  }
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
    // nessuna categoria cliccata: mostro la legenda normale
   backDetailArea = null;
    drawLegenda();
  } else {
    // c'è una categoria cliccata: mostro il pannello di dettaglio
    drawCategoryPanel(selectedCatIndex);
  }
}

//DISEGNO LA LEGENDA 
function drawLegenda() {
  let x0 = 575;   // posizione X della legenda
  let y0 = 260;   // posizione Y della legenda
  let passo = 20; // distanza verticale tra le righe
  let dimCerchio = 16;
  let numerino = 870;
  let massimo = numerino+2;
  let categoriaSpazio = 600;

  let valA = int(totaliCategorie[0]);
  let valB = int(totaliCategorie[1]);
  let valC = int(totaliCategorie[2]);
  let valD = int(totaliCategorie[4]);
  let valE = int(totaliCategorie[5]);
  let valF = int(totaliCategorie[6]);
  let valG = int(totaliCategorie[7]);

  let xx = 560;
  let yy = 240;
  let w  = 350;
  let h  = 330;

  legendHitAreas = [] //svuoto l'array 

  //SE VOGLIO METTERE UN BORDO palette.bianco 
  // sfondo del box
  noFill();
  stroke(palette.bianco);
  strokeWeight(1);
  rect(xx, yy, w, h, 18); 


  noStroke();
  fill(palette.bianco);
  textFont(fontBold);
  textSize(20);
  text("Political Rights", x0, y0);

  // 1) Electoral Process
  noStroke();
  fill(coloriLegenda.electoralProcess);
  circle(x0+8, y0 + 35, dimCerchio);
  fill(palette.bianco);
  textFont(fontRegular);
  textSize(14);
  text("Electoral Process", categoriaSpazio, y0 + passo + 10);
  textFont(fontBold);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(valA, numerino, y0 + passo + 8);
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  textSize(10);
  text("/"+ maxCategorie[0],massimo, y0 + passo + 13)

  legendHitAreas.push({
    x: x0,          // da sinistra del box
    y: y0 + 20,     // inizio riga A (aggiusta se serve)
    w: 350,         // larghezza area cliccabile
    h: 24,          // altezza riga
    catIndex: 0     // categoria A
  });
  

  // 2) Political pluralism
  fill(coloriLegenda.politicalPluralism);
  circle(x0+8, y0 + 55, dimCerchio);
  fill(palette.bianco);
  textFont(fontRegular);
  textSize(14);
  text("Political pluralism and participation", categoriaSpazio, y0 + passo*2 + 10);
  textFont(fontBold);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(valB, numerino, y0 + passo + 28);
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  textSize(10);
  text("/"+ maxCategorie[1],massimo, y0 + passo + 33)

legendHitAreas.push({
    x: x0,
    y: y0 + 40,   // riga più in basso
    w: 350,
    h: 24,
    catIndex: 1   // categoria B
  });

  // 3) Functioning of government
  fill(coloriLegenda.functioningGovernment);
  circle(x0+8, y0 + 75, dimCerchio);
  fill(palette.bianco);
  textFont(fontRegular);
  textSize(14);
  text("Functioning of government", categoriaSpazio, y0 + passo*3 + 10);
  textFont(fontBold);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(valC, numerino, y0 + passo + 48)
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  textSize(10);
  text("/" + maxCategorie[2],massimo, y0 + passo + 53)

  legendHitAreas.push({
    x: x0,
    y: y0 + 60,
    w: 350,
    h: 24,
    catIndex: 2   // categoria C
  });

  // 4) Add Q

  let valQ = int(addQVal);   
  let maxQ = 4; // massimo teorico Add Q
  // Add Q è concettualmente NEGATIVO → lo trasformo
  let valQneg = -valQ;

  stroke(coloriLegenda.addQ);
  strokeWeight(2);
  noFill();
  circle(x0+8, y0 + 95, dimCerchio);

  noStroke();
  fill(palette.bianco);
  textFont(fontBold);
  textSize(16);
  fill("#C51A1A")
  textAlign(RIGHT, TOP);
  text(valQneg, numerino, y0 + passo+68);
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  textSize(10);
  text("/" + "-"+maxQ,massimo, y0 + passo + 73)

 noStroke();
  fill("#C51A1A");
  textFont(fontRegular);
  textSize(14);
  text("Additional Discretionary Question B:\nsubtracts points from other parameters", categoriaSpazio, y0 + passo*4 + 10);

  legendHitAreas.push({
    x: x0,
    y: y0 + 80,   // aggiusta un po' se non combacia perfettamente
    w: 350,
    h: 48,
    catIndex: 8   // corrisponde al pannello AddQ
  });

  //AddA
let anno = int(annoSelezionato);
if (anno >= 2013 && anno <= 2017) {

  fill(coloriLegenda.addA);
  noStroke();
  circle(x0+8, y0+135, dimCerchio);

  fill(palette.bianco);
  textFont(fontRegular);
  textSize(14);
  fill(palette.bianco);
  text("Additional Discretionary Question A:\nadds points over 100", categoriaSpazio, y0 + passo*6 + 10);
  let maxA = 4;
  let valAc = int(addAVal);
  textFont(fontBold);
  textSize(16);
  fill(palette.bianco);
  textAlign(RIGHT, TOP);
  text(valAc, numerino, y0 + passo+108);
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  textSize(10);
  text("/" + maxA,massimo, y0 + passo + 113)

  legendHitAreas.push({
      x: x0,
      y: y0 + 120,   // altezza riga AddA
      w: 350,
      h: 48,
      catIndex: 3    // categoria 3 = Additional Answer
    });
  }

  //SPAZIO//
  let yLib = y0 + passo*6 +55;

  textFont(fontBold);
  fill(palette.bianco);
  textSize(20);
  text("Civil Liberties", x0, yLib+10);

  // 5) Freedom Expression
  fill(coloriLegenda.freedomExpression);
  circle(x0+8, yLib + 45, dimCerchio);
  fill(palette.bianco);
  textFont(fontRegular);
  textSize(14);
  text("Freedom of expression and belief", categoriaSpazio, yLib + passo + 20);

  textSize(16);
  fill(palette.bianco);
  textFont(fontBold);
  textAlign(RIGHT, TOP);
  text(valD, numerino, yLib + passo+19);
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  textSize(10);
  text("/" + maxCategorie[4],massimo, yLib + passo+24)

  legendHitAreas.push({
    x: x0,
    y: yLib + 30,
    w: 350,
    h: 24,
    catIndex: 4
  });

  // 6) Associational rights
  fill(coloriLegenda.associationalRights);
  circle(x0+8, yLib + 65, dimCerchio);
  fill(palette.bianco);
  textFont(fontRegular);
  textSize(14);
  text("Associational and organizational right", categoriaSpazio, yLib + passo*2 + 20);
  textSize(16);
  fill(palette.bianco);
  textFont(fontBold);
  textAlign(RIGHT, TOP);
  text(valE, numerino, yLib + passo+39);
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  textSize(10);
  text("/" + maxCategorie[5],massimo, yLib + passo+44)

  legendHitAreas.push({
    x: x0,
    y: yLib + 50,
    w: 350,
    h: 24,
    catIndex: 5
  });

  // 7) Rule of Law
  fill(coloriLegenda.ruleOfLaw);
  circle(x0+8, yLib + 85, dimCerchio);
  fill(palette.bianco);
  textFont(fontRegular);
  textSize(14);
  text("Rule of Law", categoriaSpazio, yLib + passo*3 + 20);
  
  textSize(16);
  fill(palette.bianco);
  textFont(fontBold);
  textAlign(RIGHT, TOP);
  text(valF, numerino, yLib + passo+59);
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  textSize(10);
  text("/" + maxCategorie[6],massimo, yLib + passo+64)

  legendHitAreas.push({
    x: x0,
    y: yLib + 70,
    w: 350,
    h: 24,
    catIndex: 6
  });

  // 8) Personal Autonomy
  fill(coloriLegenda.personalAutonomy);
  circle(x0+8, yLib + 105, dimCerchio);
  fill(palette.bianco);
  textFont(fontRegular);
  textSize(14);
  text("Personal autonomy and individual rights", categoriaSpazio, yLib + passo*4 + 20);
  textSize(16);
  fill(palette.bianco);
  textFont(fontBold);
  textAlign(RIGHT, TOP);
  text(valG, numerino, yLib + passo+79);
  textAlign(LEFT, TOP);
  textFont(fontRegular);
  textSize(10);
  text("/" + maxCategorie[7],massimo, yLib + passo+84)

  legendHitAreas.push({
    x: x0,
    y: yLib + 90,
    w: 350,
    h: 24,
    catIndex: 7
  });

}

// FUNZIONE DISEGNA PANNELLO DOMANDE 
function drawCategoryPanel(catIndex) {
  // Configurazione base fissa
  let x0 = 560; // X di partenza
  let y0 = 240; // Y di partenza (dove inizia il pannello)
  
  // Variabili di misurazione
  let paddingLeft = 30;   // Padding a sinistra per titolo e pallini
  let paddingRight = 30;  // Padding a destra per il testo più lungo (AUMENTATO per la X)
  let palliniSpazioTotale = 16 * 4; 
  let palliniOffset = 95;   
  let maxTextWidth = 0; 
  
  // --- A. VARIABILI DI CALCOLO ALTEZZA & TEXTWIDTH ---
  
  let titoloAltezza = 20;  
  let titoloMargine = 20;  
  let dopoTitolo = 20;     
  let lineHeight = 20;     
  let gap = 20;            
  let paddingBottom = 0;  // Aumentato per coerenza
  
  // Inizializzazione font per la misurazione
  textFont(fontRegular);
  textSize(14); 

  // Iniziamo il calcolo dell'altezza necessaria (h)
  let h = 0;
  
  // 1. Larghezza del Titolo (inclusa la X)
  textFont(fontBold);
  textSize(20);
  let titolo = panelTitles[catIndex] || "Category details";
  
  // Larghezza del titolo + spazio per la 'X' sul lato destro
  // (La 'X' ha bisogno di circa 30px, la usiamo come offset dal bordo destro)
  maxTextWidth = textWidth(titolo) + paddingLeft + 30; 
  
  // 2. Altezza iniziale (Titolo + Spazi)
  h += titoloMargine + titoloAltezza + dopoTitolo;
  
  // 3. Calcolo Altezza e Larghezza Massima delle DOMANDE
  textFont(fontRegular);
  textSize(14);
  let questions = panelQuestions[catIndex] || [];
  
  for (let qi = 0; qi < questions.length; qi++) {
      let q = questions[qi];
      let righe = q.split("\n");
      
      for (let r of righe) {
          let currentLineWidth = textWidth(r);
          let totalQuestionWidth = palliniOffset + currentLineWidth + paddingRight;
          
          if (totalQuestionWidth > maxTextWidth) {
              maxTextWidth = totalQuestionWidth;
          }
      }
      
      h += (righe.length * lineHeight) + gap;
  }
  
  // 4. Larghezza finale del pannello (w)
  let w = maxTextWidth + paddingLeft; 
  
  // 5. Altezza finale
  h += paddingBottom;

  // --- B. DEFINIZIONE E DISEGNO DEL PANNELLO DINAMICO ---
  
  noFill();
  stroke(palette.bianco);
  strokeWeight(1.5);
  rect(x0, y0, w, h, 18); // h e w ORA SONO DINAMICHE
  noStroke();

  // --- C. DISEGNO CONTENUTO INTERNO ---
  
  // 1. Titolo
  textFont(fontBold);
  textSize(20);
  fill(palette.bianco);
  let currentY = y0 + titoloMargine; 
  text(titolo, x0 + paddingLeft, currentY); 

  // --- D. BOTTONE 'X' (CLOSE) ---
  
  let xBtn = x0 + w - paddingRight; // X a destra, all'interno del padding
  let yBtn = y0 + titoloMargine + titoloAltezza / 2; // Y allineata al centro del titolo
  let btnSize = 16; // Dimensione della 'X'

  // Imposta l'area cliccabile per la 'X'
  backDetailArea = { 
    x: xBtn - btnSize / 2, // Centro X della 'X'
    y: yBtn - btnSize / 2, // Centro Y della 'X'
    w: btnSize * 1.5,      // Area più gepalette.nerosa per il click
    h: btnSize * 1.5
  };

  // Disegno della 'X'
  push(); // Salviamo lo stato attuale per il simbolo 'X'
  translate(xBtn, yBtn);
  fill(palette.bianco);
  stroke(palette.bianco);
  strokeWeight(2);
  
  // Disegna le due linee della 'X'
  line(-btnSize / 2, -btnSize / 2, btnSize / 2, btnSize / 2); // Diagonale \
  line(btnSize / 2, -btnSize / 2, -btnSize / 2, btnSize / 2); // Diagonale /
  
  pop(); // Ripristina lo stato
  
  // --- E. DOMANDE E PALLINI ---
  
  currentY += titoloAltezza + dopoTitolo; 
  
  textFont(fontRegular);
  textSize(14);

  let palliniRaggio = 6; 
  let palliniSpazio = 16;
  let palliniStartX = x0 + paddingLeft; 
  let textX = x0 + palliniOffset; 

  for (let qi = 0; qi < questions.length; qi++) {
    let q = questions[qi];
    let score = 0;

    // Calcolo del punteggio (omesso per brevità, ma identico al tuo originale)
    if (catIndex === 8) {
        score = int(constrain(addQVal, 0, 4));
    } else {
        if (questionScores[catIndex] && questionScores[catIndex][qi] != null) {
            score = questionScores[catIndex][qi];
        }
        score = int(constrain(score, 0, 4));
    }

    let righe = q.split("\n");
    noStroke();
    let palliniY0 = currentY + 6; 

    // Disegno dei 4 pallini 
    for (let i = 0; i < 4; i++) {
        // ... Logica colori ...
        if (i < score) {
            if (catIndex === 8) {
                fill("#C51A1A");
            } else {
                let baseCol = coloriCategorie[catIndex];
                let c = color(baseCol); 
                c.setAlpha(255); 
                fill(c);
            }
        } else {
            fill(palette.grigio);
        }

        let palliniX0 = palliniStartX + i * palliniSpazio;
        circle(palliniX0, palliniY0, palliniRaggio * 2);
    }

    // Disegno ogni riga di testo
    fill(palette.bianco);
    noStroke();
    for (let r of righe) {
        text(r, textX, currentY);
        currentY += lineHeight;
    }

    // Gap tra una domanda e la successiva
    currentY += gap;
  }
}

//FUNZIONE ADDQ (domanda negativa)
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

//FUNZIONE PUNTEGGIO TOTALE + ARRAY CON I VALORI DELLE CATEGORIE 
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

  // 3) click sulla LEGENDA (solo se la legenda è visibile)
 if (selectedCatIndex === null) {
    for (let area of legendHitAreas) {
      if (
        mx >= area.x && 
        mx <= area.x + area.w &&
        my >= area.y &&
        my <= area.y + area.h
      ) {
        if (selectedCatIndex === area.catIndex) {
          selectedCatIndex = null;
        } else {
          selectedCatIndex = area.catIndex;
        }
        return;
      }
    }
  }

  if (backDetailArea) {
  if (
    mx >= backDetailArea.x &&
    mx <= backDetailArea.x + backDetailArea.w &&
    my >= backDetailArea.y &&
    my <= backDetailArea.y + backDetailArea.h
  ) {
    selectedCatIndex = null; // torna alla legenda
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