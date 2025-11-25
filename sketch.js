// variabili globali
let data;
let torcia;

// variabili per font
let fontRegular;
let fontBold;

// variabili per responsiveness
let graficoWidth;
let annoWidth;

// variabili per disegnare le barre
let altezzaMassimaBarra;
let yBarra;
let minTotalScore;
let maxTotalScore;
let incremento = 20;

// variabili per selezionare l'anno
let datiFiltrati;
let selettoreAnno; 
let annoCorrente;

// colori per status con gradienti
let coloriStatus = {
  'F': ["#c76351", "#d58d3e", "#26231d"], // Libero (Free)
  'PF': ["#e5c38f", "#cad181", "#26231d"], // Parzialmente Libero (Partially Free)
  'NF': ["#75a099", "#26231d"], // Non Libero (Not Free)
};

function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header"); // caricamento del dataset
  torcia = loadImage("img/torcia.png"); // carimaneto dell'immagine della tocia di base
  fontRegular = loadFont("font/NeueHaasGrotDisp-55Roman.otf");
  fontBold = loadFont("font/NeueHaasGrotDisp-75Bold.otf");
}

function setup() {
  // Crea il canvas con larghezza della finestra
  createCanvas(windowWidth, windowHeight);

  // variabili per responsiveness
  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;
  
  // variabili per disegnare le barre
  altezzaMassimaBarra = windowHeight * 0.58; 
  yBarra = windowHeight - windowHeight * 0.22; 
  
  // filtro i dati per anno
  // trova tutti gli anni unici presenti nella colonna 'Edition'
  let anni = data.getColumn('Edition').map(Number); 
  let anniUnici = [...new Set(anni)].sort((a, b) => b - a); 
  
  // crea l'elemento select
  selettoreAnno = createSelect(); 
  selettoreAnno.position(50, 20); 
  selettoreAnno.style('padding', '8px');
  selettoreAnno.style('font-size', '16px');
  selettoreAnno.style('z-index', '1000');
  
  // aggiunge le opzioni al menu
  for (let anno of anniUnici) { 
    if (!isNaN(anno)) {
        selettoreAnno.option(anno);
    }
  }
  
  // l'anno iniziale di default è impostato sul più recente
  if (anniUnici.length > 0 && !isNaN(anniUnici[0])) {
      annoCorrente = anniUnici[0]; 
      selettoreAnno.selected(annoCorrente);
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
    annoCorrente = parseInt(selettoreAnno.value()); // aggiorna annoCorrente con il nuovo valore selezionato
    filtraECalcolaDati(annoCorrente); // ricalcola e ridisegna i dati per il nuovo anno
}

// funzione per creare gradienti verticali
function creaGradiente(x, yInizio, yFine, larghezza, colori) {
  let gradient = drawingContext.createLinearGradient(x, yInizio, x, yFine);
  
  if (colori.length === 2) {
    gradient.addColorStop(0, colori[0]);
    gradient.addColorStop(1, colori[1]);
  } else if (colori.length === 3) {
    gradient.addColorStop(0, colori[0]);
    gradient.addColorStop(0.4, colori[1]);
    gradient.addColorStop(1, colori[2]); 
  }
  
  return gradient;
}

// funzione che gestisce il filtro e il calcolo min/max
function filtraECalcolaDati(anno) { 
    if (data && data.getRowCount() > 0 && anno !== null) {
        // filtra le righe dove la colonna 'Edition' corrisponde all'anno selezionato
        datiFiltrati = data.getRows().filter(riga => {
            return riga.getNum('Edition') === anno; 
        });
    } else {
        datiFiltrati = [];
    }
    
    minTotalScore = 0; 
    maxTotalScore = 100;
}

function draw() {
  background("#26231d");

  if (datiFiltrati && datiFiltrati.length > 0) {
      disegnaGriglia();
      disegnaBarre();
      disegnaEtichettaAnno();
  } else {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text(`Nessun dato trovato per l'anno ${annoCorrente}.`, windowWidth/2, height/2);
      disegnaGriglia();
  }
}

// disegna la scala
function disegnaGriglia() {
  const puntiDiRiferimento = [0, 35, 70, 100]; 

  for (let valore of puntiDiRiferimento) {
    let altezzaRelativa = map(valore, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
    let yLinea = yBarra - altezzaRelativa - incremento;

    stroke("#f0f0f0");
    strokeWeight(1);
    noFill();
    line(50, yLinea, graficoWidth - 50, yLinea); // usa graficoWidth come limite destro
    
    noStroke();
    fill("#f0f0f0"); 
    textAlign(RIGHT, CENTER);
    text(valore, 40, yLinea);
  }
}

// costruzione delle barre raggruppate per regione con livelli sovrapposti
function disegnaBarre() { 
  noStroke();

  // Raggruppa i dati per regione
  let datiPerRegione = {};
  
  for (let riga of datiFiltrati) {
    let regione = riga.getString('Region');
    if (!datiPerRegione[regione]) {
      datiPerRegione[regione] = [];
    }
    datiPerRegione[regione].push(riga);
  }
  
  // Ordina le regioni alfabeticamente
  let regioni = Object.keys(datiPerRegione).sort();
  
  // Calcola larghezze dinamiche
  let margineIniziale = 80;
  let margineFinale = 50;
  let spazioDisponibile = graficoWidth - margineIniziale - margineFinale; // usa graficoWidth invece di width

  // Conta il numero totale di barre
  let totaleBarre = 0;
  for (let regione of regioni) {
    totaleBarre += datiPerRegione[regione].length;
  }
  
  // Calcola la larghezza ottimale per barre e spazi
  let numeroGruppi = regioni.length;
  let spazioTraGruppi = min(10, spazioDisponibile * 0.05); // Massimo 50px o 5% dello spazio
  let spazioTotaleGruppi = spazioTraGruppi * (numeroGruppi - 1);
  let spazioPerBarre = spazioDisponibile - spazioTotaleGruppi;
  let larghezzaBarra = max(2, min(15, spazioPerBarre / totaleBarre)); // Tra 5 e 15 pixel
  
  // Array per salvare le posizioni delle etichette
  let etchetteRegioni = [];
  
  let xCorrente = margineIniziale;
  
  // Prima calcola le posizioni per le etichette
  for (let regione of regioni) {
    let paesiInRegione = datiPerRegione[regione];
    let larghezzaGruppo = paesiInRegione.length * larghezzaBarra;
    let centroGruppo = xCorrente + larghezzaGruppo / 2;
    etchetteRegioni.push({regione: regione, x: centroGruppo});
    xCorrente += larghezzaGruppo + spazioTraGruppi;
  }
  
  // LIVELLO 1: Disegna prima tutti i paesi LIBERI (F) - sfondo
  xCorrente = margineIniziale;
  for (let regione of regioni) {
    let paesiInRegione = datiPerRegione[regione];
    let contatoreF = 0;
    
    for (let i = 0; i < paesiInRegione.length; i++) {
      let riga = paesiInRegione[i];
      let status = riga.getString('Status');
      
      if (status === 'F') {
        let total = riga.getNum('TOTAL');
        let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
        let xBarra = xCorrente + contatoreF * larghezzaBarra;
        let yCimaBarra = yBarra - altezzaBarra - incremento;

        // Applica il gradiente
        let gradient = creaGradiente(xBarra, yCimaBarra, yBarra, larghezzaBarra, coloriStatus[status]);
        drawingContext.fillStyle = gradient;
        rect(xBarra, yBarra, larghezzaBarra, -altezzaBarra-incremento);
        
        push();
        fill("#f0f0f0");
        ellipse(xBarra + larghezzaBarra/2, yCimaBarra, larghezzaBarra, larghezzaBarra);
        pop();
        contatoreF++;
      }
    }
    
    xCorrente += paesiInRegione.length * larghezzaBarra + spazioTraGruppi;
  }
  
  // LIVELLO 2: Disegna poi tutti i paesi PARZIALMENTE LIBERI (PF) - livello intermedio
  xCorrente = margineIniziale;
  for (let regione of regioni) {
    let paesiInRegione = datiPerRegione[regione];
    let contatorePF = 0;
    
    for (let i = 0; i < paesiInRegione.length; i++) {
      let riga = paesiInRegione[i];
      let status = riga.getString('Status');
      
      if (status === 'PF') {
        let total = riga.getNum('TOTAL');
        let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
        let xBarra = xCorrente + contatorePF * larghezzaBarra;
        let yCimaBarra = yBarra - altezzaBarra - 20;

        // Applica il gradiente
        let gradient = creaGradiente(xBarra, yCimaBarra, yBarra, larghezzaBarra, coloriStatus[status]);
        drawingContext.fillStyle = gradient;
        rect(xBarra, yBarra, larghezzaBarra, -altezzaBarra-20);
        
        push();
        fill("#f0f0f0");
        ellipse(xBarra + larghezzaBarra/2, yCimaBarra, larghezzaBarra, larghezzaBarra);
        pop();

        contatorePF++;
      }
    }
    
    xCorrente += paesiInRegione.length * larghezzaBarra + spazioTraGruppi;
  }
  
  // LIVELLO 3: Disegna infine tutti i paesi NON LIBERI (NF) - livello superiore
  xCorrente = margineIniziale;
  for (let regione of regioni) {
    let paesiInRegione = datiPerRegione[regione];
    let contatoreNF = 0;
    
    for (let i = 0; i < paesiInRegione.length; i++) {
      let riga = paesiInRegione[i];
      let status = riga.getString('Status');
      
      if (status === 'NF') {
        let total = riga.getNum('TOTAL');
        let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
        let xBarra = xCorrente + contatoreNF * larghezzaBarra;
        let yCimaBarra = yBarra - altezzaBarra - 20;

        // Applica il gradiente
        let gradient = creaGradiente(xBarra, yCimaBarra, yBarra, larghezzaBarra, coloriStatus[status]);
        drawingContext.fillStyle = gradient;
        rect(xBarra, yBarra, larghezzaBarra, -altezzaBarra-20);

        push();
        fill("#f0f0f0");
        ellipse(xBarra + larghezzaBarra/2, yCimaBarra, larghezzaBarra, larghezzaBarra);
        pop();

        contatoreNF++;
      }
    }
    
    xCorrente += paesiInRegione.length * larghezzaBarra + spazioTraGruppi;
  }
  
  // Disegna le etichette delle regioni alla fine (sopra tutti i livelli)
  push();
  fill("#f0f0f0");
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  for (let etichetta of etchetteRegioni) {
    text(etichetta.regione, etichetta.x, yBarra + 10);
  }
  pop();
}

function disegnaEtichettaAnno() {
  // 1. Sposta l'origine (0,0) nel punto di rotazione
  push(); 

  // Imposta lo stile del testo
  fill("#f0f0f0");
  textSize(annoWidth*1.3);
  textFont(fontBold); 
  textAlign(CENTER, CENTER); // Allinea il testo al centro
  noStroke();
  
  // Calcolo della posizione xPos per centrare il testo ruotato nell'area annoWidth (che inizia a graficoWidth)
  // xPos = Inizio area (graficoWidth) + metà larghezza area (annoWidth / 2)
  let xPos = graficoWidth + (annoWidth / 2); 
  let yPos = height / 2;
  
  translate(xPos, yPos);
  
  // 2. Ruota il sistema di coordinate di 90 gradi in senso orario.
  rotate(PI / 2 * 3);
  
  // 3. Disegna il testo all'origine traslata (che ora è xPos, yPos)
  text(annoCorrente, 0, -30); 

  pop(); // Ripristina il sistema di coordinate pre-esistente
}