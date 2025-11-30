let data; //variabile che contiene il mio csv
//font 
let mioFont; 
let mioFontBold;

let textColor;
let countrySlug = "";   // nome normalizzato (no maiuscole e spazi)
let countryName = "";   // il nome leggibile che poi vogliamo scrivere nella pagina come titolo

//CREO UN ARRAY PER CONTENERE GLI ANNI 
let anniDisponibili = []; //array con tutti gli anni disponibili 
let annoSelezionato = "" //anno selezionionato 
let yearSelect; //oggetti select che appare 

//FRECCETTA FINTA MENU A TENDINA 
let arrowSpan; // per la freccia finta

//TOTAL SCORE
let punteggioTotale = 0; 

//TOTAL CATEGORIE [A,B,C,D,E,F,G]-->positivi
let totaliCategorie = [0,0,0,0,0,0,0,0];
let maxCategorie = [12, 16, 12, 4, 16, 12, 16, 16];

//leganda colori 
let coloriLegenda = {
  electoralProcess: "#D9D97A",
  politicalPluralism: "#6A8AA9",
  functioningGovernment: "#0F3C63",
  addQ: "#C51A1A",
  addA: "#1f863fff", 
  freedomExpression: "#C47929",
  associationalRights: "#9C6EBF",
  ruleOfLaw: "#A4B2B8",
  personalAutonomy: "#C0655A"
};
//COLORI CATEGORIE 
let coloriCategorie = [];

//valore AddQ (positivo nel CSV, ma negativo nella realtà)
let addQVal = 0;
let addAVal = 0;
// info di tutti i pallini (per sapere coordinate e categoria)
let palliniInfo = [];
// per l'animazione di lampeggio
let animT = 0;
const diametroPallino = 44;

//VARIABILE HOVER PER CATEGORIA 
let hoveredCatIndex = null; 

// CARICO LE COSE 
function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  mioFont = loadFont("fonts/OpenSans-Regular.ttf");
  mioFontBold = loadFont("fonts/OpenSans-Bold.ttf");
}

//FUNZIONE PER NORMALIZZARE I NOMI 
//slug --> versione ripulita dei nomi dei paesi, più facile da usare e non crea errori 
function normalizeCountryName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ""); // tiene solo lettere e numeri
}

//DISEGNA I PALLINI 
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

    let hovering = (hoveredCatIndex !== null); //capisco se c'è una categoria in hover 

    //ciclo che genera i pallini 
    for (let r=0; r<righeQuadrato; r++) { //indice di riga
      for(let c=0; c<colonne; c++) { //indice di colonna
        let x = startX + c*(diametro+spazio);
        let y = startY + (righeQuadrato - 1 - r) * (diametro + spazio);

      let catIndex = categoriaPerIndice(indicePallino);
      let rCerchio = diametroPallino;  // niente hover di grandezza

  if (catIndex === null) { // nessuna categoria: pallino grigio
  fill(60);
} else {
  // pallini colorati: se una categoria è in hover
  let baseCol = coloriCategorie[catIndex];
  let cCol = color(baseCol);

  if (hovering && catIndex !== hoveredCatIndex) {
    // altri pallini di altre categorie: "spenti"
    cCol.setAlpha(90);
  } else {
    // categoria sotto il mouse, oppure nessun hover
    cCol.setAlpha(255);
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

//inserisco la LINEA BIANCA di separazione 
let lineY = startY + grigliaAltezza -15;
stroke(textColor);
strokeWeight(2);
line(60,lineY, 60+grigliaLarghezza,lineY);

//scritta 0
noStroke();
fill(textColor);
textAlign(LEFT,CENTER);
textSize(18);
text("0",40,lineY-3);

//10 PALLINI NEGATIVI 
let distanzaLineaPallini = 27;  // distanza verticale tra linea e riga extra
let yExtra = lineY + distanzaLineaPallini; // centro dei pallini della riga extra

fill(60);
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

//FUNZIONE HOVER PER CATEGORIA (mi aiuta per quella sotto)
function updateHoverCategory() {
  hoveredCatIndex = null; //nessuna categoria in hover

  for (let p of palliniInfo) {
    // considero solo i pallini positivi e con categoria (no grigi, no negativi)
    if (p.type === "pos" && p.catIndex !== null) {
      let d = dist(mouseX, mouseY, p.x, p.y);
      if (d < diametroPallino / 2) {
        hoveredCatIndex = p.catIndex; // salvo la categoria
        break; // mi basta il primo
      }
    }
  }
}


//DISEGNO LA LEGENDA 
function drawLegenda() {
  let x0 = 575;   // posizione X della legenda
  let y0 = 270;   // posizione Y della legenda
  let passo = 20; // distanza verticale tra le righe
  let dimCerchio = 16;

  let valA = int(totaliCategorie[0]);
  let valB = int(totaliCategorie[1]);
  let valC = int(totaliCategorie[2]);
  let valD = int(totaliCategorie[4]);
  let valE = int(totaliCategorie[5]);
  let valF = int(totaliCategorie[6]);
  let valG = int(totaliCategorie[7]);

  fill(textColor);
  textFont(mioFontBold);
  textSize(20);
  text("Political Rights", x0, y0);

  // 1) Electoral Process
  fill(coloriLegenda.electoralProcess);
  circle(x0+8, y0 + 28, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Electoral Process", x0 + 70, y0 + passo + 6);
  textFont(mioFontBold);
  textSize(12);
  text(valA + "/" + maxCategorie[0], x0 + passo, y0 + passo + 6)
  

  // 2) Political pluralism
  fill(coloriLegenda.politicalPluralism);
  circle(x0+8, y0 + 48, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Political pluralism and participation", x0 + 70, y0 + passo*2 + 6);
  textFont(mioFontBold);
  textSize(12);
  text(valB + "/" + maxCategorie[1], x0 + passo, y0 + passo*2 + 6)

  // 3) Functioning of government
  fill(coloriLegenda.functioningGovernment);
  circle(x0+8, y0 + 68, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Functioning of government", x0 + 70, y0 + passo*3 + 6);
  textFont(mioFontBold);
  textSize(12);
  text(valC + "/" + maxCategorie[2], x0 + passo, y0 + passo*3 + 6)


  // 4) Add Q

  let valQ = int(addQVal);   
  let maxQ = 4; // massimo teorico Add Q
  // Add Q è concettualmente NEGATIVO → lo trasformo
  let valQneg = -valQ;

  stroke(coloriLegenda.addQ);
  strokeWeight(2);
  noFill();
  circle(x0+8, y0 + 88, dimCerchio);

  noStroke();
  fill(textColor);
  textFont(mioFontBold);
  textSize(12);
  fill("#C51A1A")
  text(valQneg + "/" + "-"+maxQ, x0 + passo, y0 + passo*4 + 6);

 noStroke();
  fill("#C51A1A");
  textFont(mioFont);
  textSize(14);
  text("Additional Question: sottrae punti agli altri parametri", x0 + 70, y0 + passo*4 + 6);

//AddA
  fill(coloriLegenda.addA);
  noStroke();
  circle(x0+8, y0 + 108, dimCerchio);

  fill(textColor);
  textFont(mioFont);
  textSize(14);
  fill("#1f863fff");
  text("Additional Answer: aggiunge punti oltre i 100", x0 + 70, y0 + passo*5 + 6);
  let maxA = 4;
  let valAc = int(addAVal);
  fill(textColor);
  textFont(mioFontBold);
  textSize(12);
  fill("#1f863fff");
  text(valAc + "/" + maxA, x0 + passo, y0 + passo*5 + 6);


  //SPAZIO//
  let yLib = y0 + passo*6 +20;

  textFont(mioFontBold);
  fill(textColor);
  textSize(20);
  text("Civil Liberties", x0, yLib+10);

  // 5) Freedom Expression
  fill(coloriLegenda.freedomExpression);
  circle(x0+8, yLib + 38, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Freedom of expression and belief", x0 + 70, yLib + passo + 16);
  textFont(mioFontBold);
  textSize(12);
  text(valD + "/" + maxCategorie[4], x0 + passo, yLib + passo + 16);

  // 6) Associational rights
  fill(coloriLegenda.associationalRights);
  circle(x0+8, yLib + 58, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Associational and organizational right", x0 + 70, yLib + passo*2 + 16);
  textFont(mioFontBold);
  textSize(12);
  text(valE + "/" + maxCategorie[5], x0 + passo, yLib + passo*2 + 16);

  // 7) Rule of Law
  fill(coloriLegenda.ruleOfLaw);
  circle(x0+8, yLib + 78, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Rule of Law", x0 + 70, yLib + passo*3 + 16);
  textFont(mioFontBold);
  textSize(12);
  text(valF + "/" + maxCategorie[6], x0 + passo, yLib + passo*3 + 16);


  // 8) Personal Autonomy
  fill(coloriLegenda.personalAutonomy);
  circle(x0+8, yLib + 98, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Personal autonomy and individual rights", x0 + 70, yLib + passo*4 + 16);
  textFont(mioFontBold);
  textSize(12);
  text(valG + "/" + maxCategorie[7], x0 + passo, yLib + passo*4 + 16);


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

  for (let p of palliniInfo) { //for tutti i pallini, scorro ogni elemento 
    //ogni p è un oggetto con le caratteristiche che gli ho dato sopra 

  //1-I pallini di Political Rights 
   if (p.type === "pos" && p.catIndex !== null && p.catIndex <= 3)  {
      //escludo i pallini vuoti (!== vuol dire diverso, quindi non nullo)
      //tengolo solo quelli di political rights 
      // questo pallino è di Political Rights
      targets.push(p);
    }
  }

  //2-Civil Liberties
  for (let p of palliniInfo) {
   if (p.type === "pos" && p.catIndex !== null && p.catIndex >= 4 && p.catIndex <= 7) {
    targets.push(p);
    }
  }

  //3- Negativi (sotto la linea)
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
    let c = color(baseCol);
    c.setAlpha(alphaInner);

    
    noStroke();
    fill(c);
    circle(p.x, p.y, rCerchio);

    //pallino negativo sotto la linea 
  } else if (p.type === "neg") {
    // pallino negativo: magari lo lasci grigio ma che lampeggia un po'
    let c = color(60, 60, 60, alphaInner);
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
      punteggioTotale = data.getNum(i, "TOTAL "); //ATTENZIONE ALLO SPAZIO ALLA FINE 
      
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
      
      break; // mi fermo, ho trovato la riga giusta

      //ogni volta che trovo la linea giusta, oltre a bloccarmi il punteggio totale
      //mi salva anche i punteggi di tutte le categorie 
  }
}
};

//creo una funzione di supporto che dopo aver asseganto i valori ai pallini
//mi dice di un pallino a che categoria appartiene 
//"dimmi che numero di pallino sei, ti dirò a che categoria appartieni"
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

//spiegazione breve con esempio 
//PALLINO 0
//all'inizio la somma è 0
//k=0 --> A, puntiCat = 3
//indicePallino <somma+puntiCat --> 0<0+3 --> pallino 0 appartiene a A


function setup() {
  createCanvas(windowWidth, windowHeight);

  //caratteristiche generali dei testi 
  textColor = color(232, 233, 214);
  textFont(mioFont);
  textSize(16);
  fill(textColor);

  let urlParams = getURLParams();          // funzione di p5 che restitusice un oggetto con i parametri dell'URL
  countrySlug = urlParams.country || "";   // mi prende il valore dopo country= e lo mette nella stringa vuota 

  // se non c'è proprio il parametro, metto un messaggio d errore 
  if (countrySlug === "") {
    countryName = "Nessun paese selezionato";
    console.warn("Parametro ?country mancante nell'URL");
    return; 
  }

  //Cerco nel CSV la riga che ha lo stesso slug
  let found = false; 
  anniDisponibili= []; //svuoto l'array per sicurezza 

  //scorri tutte le righe del CSV
  //per ogni riga: prendi il valore della colonna "Country/Territory"
  //lo normalizzi 
  //lo confronti con countrySlug 
  //se combaciano ho trovato il paese 
  for (let i = 0; i < data.getRowCount(); i++) {
    let countryCSV = data.getString(i, "Country/Territory").trim(); //prendo il nome della riga i della colonna "country/territory" (trim togli egli spazi)
    let csvSlug = normalizeCountryName(countryCSV); //trasfromo il nome in uno slug (minusco e senza spazi) --> uso la mia funzione spiegata prima 
    let edition = data.getString(i,"Edition").trim(); //prendo l'anno 

    if (csvSlug === countrySlug) { //confronto lo slug CSV con lo slug preso dall'URL
      if (!found) {
        countryName = countryCSV; //salvo il nome leggibile 
        found = true; //metto per ricordarmi che l'ho trovata 
      }

      if (!anniDisponibili.includes(edition)) { //se l'anno non è ancora nell'array, lo aggiungo 
        anniDisponibili.push(edition); 
      }
    }
  }
  //SE NON TROVO NULLA, messaggio di errore 
  if (!found) {
    countryName = "Paese non trovato (" + countrySlug + ")";
    console.warn("Nessun dato trovato per lo slug:", countrySlug);
  }
  //SE HO TROVATO GLI ANNI
  if (anniDisponibili.length > 0) { //>0, almeno un elemento dentro 
    anniDisponibili.sort((a, b) => int(b) - int(a)); //ordino gli anni in ordine decrescente 
    annoSelezionato = anniDisponibili[0]; //metto come anno selezionato di default quello più recente 

     aggiornaPunteggioTotale(); //calcola subito 

    yearSelect = createSelect(); //crea la tendina, elemento p5
    yearSelect.position(750, 125); //posizione del menù a tendina 

    for (let y of anniDisponibili) { //per ogni elemento delll'array aggiungo un elemento al menu
      yearSelect.option(y);
    }

    yearSelect.selected(annoSelezionato); //imposto come anno selezionato quello scelto prima 

    yearSelect.style('background-color', '#050505');
    yearSelect.style('color', '#E8E9D6');
    yearSelect.style('border', '1px solid #E8E9D6');
    yearSelect.style('padding', '1px 35px');
    yearSelect.style('font-family', 'Open Sans, sans-serif');
    yearSelect.style('font-size', '55px');
    yearSelect.style('border-radius', '18px');
    yearSelect.style('outline', 'none');

    // tolgo la freccia nativa del browser
    yearSelect.style('appearance', 'none');
    yearSelect.style('-webkit-appearance', 'none');
    yearSelect.style('-moz-appearance', 'none');

    // aumento il padding a destra per far posto alla freccia finta
    yearSelect.style('padding', '6px 60px 6px 24px');

    // creo una freccia finta "▾"
    arrowSpan = createSpan('▾');
    arrowSpan.style('position', 'absolute');
    arrowSpan.style('pointer-events', 'none'); // così il click passa al select
    arrowSpan.style('color', '#E8E9D6');
    arrowSpan.style('font-family', 'Open Sans, sans-serif');
    arrowSpan.style('font-size', '62px'); // stessa dimensione del numero

    yearSelect.changed(() => { //quando cambi scelta 
      annoSelezionato = yearSelect.value(); //aggiorno la variabile con il valore dell'array scelto 
       aggiornaPunteggioTotale();
    });
    posizionaFreccia();  //aggiungo una mia freccetta 
  }
}

function posizionaFreccia() {
  if (!yearSelect || !arrowSpan) return;

  // prendo le coordinate reali del select nella pagina
  let rect = yearSelect.elt.getBoundingClientRect();
  let selX = rect.left;
  let selY = rect.top;
  let selW = rect.width;

  // posiziono la freccia un po' dentro dal bordo destro
  arrowSpan.position(selX + selW - 55, selY + 4);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // se la finestra cambia, riposiziono la freccia
  posizionaFreccia();
}

function draw() {
  background(0);

  animT += 0.01; 

  fill(textColor);
  textFont(mioFontBold);

  // NOME DELLO STATO 
  textSize(50);
  textAlign(LEFT, TOP);
  text(countryName, 60,40);

  //TOTAL 
  textSize(72);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  text("Total", 560, 110);

  //TOTAL SCORE 
  //:
  textSize(72);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  text(":",980, 105);
  //punteggio 
  textSize(92);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  text(punteggioTotale,1020, 95);

  updateHoverCategory(); //capisco dove sta il mouse 

 drawPalliniGrigi();

 drawAddQOverlay();

 drawLegenda();
}

