// variabili globali
let data;
let torcia;

// variabili per font
let fontRegular;
let fontMedium;
let fontBold;

// variabili per responsiveness
let graficoWidth;
let annoWidth;

// variabili per disegnare le barre
let altezzaMassimaBarra;
let yBarra;
let minTotalScore;
let maxTotalScore;
let incremento = 50;

// variabili per selezionare l'anno
let datiFiltrati;
let selettoreAnno; 
let annoCorrente;

// variabili per i filtri status
let filtroF = true;
let filtroPF = true;
let filtroNF = true;
let bottoneF, bottonePF, bottoneNF;

// variabili per la barra di ricerca
let inputRicerca;
let suggerimentiDiv;
let paesiUnici = [];
let suggerimentoSelezionato = -1;

// variabile per memorizzare il massimo numero di paesi per regione
let maxPaesiPerRegione = {};

// colori per status con gradienti
let coloriStatus = {
  'F': ["#c76351", "#d58d3e", "#26231d"], // Libero (Free)
  'PF': ["#e5c38f", "#cad181", "#26231d"], // Parzialmente Libero (Partially Free)
  'NF': ["#75a099", "#91a2a6", "#26231d"], // Non Libero (Not Free)
};

function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  torcia = loadImage("img/torcia.png");
  fontRegular = loadFont("font/NeueHaasGrotDisp-55Roman.otf");
  fontMedium = loadFont("font/NeueHaasGrotDisp-65Medium.otf");
  fontBold = loadFont("font/NeueHaasGrotDisp-75Bold.otf");
}

function setup() {
  // Crea il canvas con larghezza della finestra
  createCanvas(windowWidth, windowHeight);

  // variabili per responsiveness
  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;
  
  // variabili per disegnare le barre
  altezzaMassimaBarra = windowHeight * 0.5; 
  yBarra = windowHeight - windowHeight * 0.25; 
  
  // calcola il massimo numero di paesi per ogni regione
  calcolaMaxPaesiPerRegione();
  
  // estrai tutti i paesi unici dal dataset
  estraiPaesiUnici();
  
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
  
  // CREAZIONE BARRA RICERCA
  creaBarraRicerca();

  // crea i bottoni filtro per gli status
  creaBottoniFiltro();
}

// funzione per estrarre tutti i paesi unici dal dataset
function estraiPaesiUnici() {
  let paesi = data.getColumn('Country/Territory');
  paesiUnici = [...new Set(paesi)].sort();
}

// FUNZIONE MODIFICATA PER MIGLIORE VISIBILITÀ E POSIZIONAMENTO
function creaBarraRicerca() {
  const larghezzaBarra = graficoWidth*0.94;
  
  // Container principale per la ricerca
  let containerRicerca = createDiv();
  
  // CENTRAGGIO DELLA BARRA SOPRA IL GRAFICO (circa)
  let xPos = 30;
  let yPos = 30; 
  
  containerRicerca.position(xPos, yPos);
  containerRicerca.style('position', 'absolute'); // Assicura che sia posizionato correttamente sul DOM
  containerRicerca.style('width', larghezzaBarra + 'px');
  containerRicerca.style('z-index', '1000');
  
  // Input di ricerca
  inputRicerca = createInput('');
  inputRicerca.attribute('placeholder', 'LIBERTY ENLIGHTENING THE WORLD');
  inputRicerca.parent(containerRicerca);
  inputRicerca.style('width', '100%');
  inputRicerca.style('padding', '18px 20px');
  inputRicerca.style('font-size', '15px');
  inputRicerca.style('border', '1px solid #f0f0f0');
  inputRicerca.style('border-radius', '30px');
  inputRicerca.style('background-color', '#26231d');
  inputRicerca.style('color', '#f0f0f0');
  inputRicerca.style('outline', 'none');
  inputRicerca.style('box-sizing', 'border-box');
  
  // --- AGGIUNGI QUI LO STILE FONT PER LA BARRA DI RICERCA ---
  // Usiamo il nome del file del font Regular come font-family
  inputRicerca.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif'); 
  // O, se vuoi il Bold (ma sconsigliato per l'input):
  // inputRicerca.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  // --- FINE STILE FONT ---
  
  // Div per i suggerimenti
  suggerimentiDiv = createDiv();
  suggerimentiDiv.parent(containerRicerca);
  suggerimentiDiv.style('position', 'absolute');
  suggerimentiDiv.style('top', '50px');
  suggerimentiDiv.style('width', '100%');
  suggerimentiDiv.style('max-height', '300px');
  suggerimentiDiv.style('overflow-y', 'auto');
  suggerimentiDiv.style('background-color', '#26231d');
  suggerimentiDiv.style('border', '1px solid #f0f0f0');
  suggerimentiDiv.style('border-radius', '15px');
  suggerimentiDiv.style('display', 'none');
  suggerimentiDiv.style('z-index', '1001');
  suggerimentiDiv.style('box-sizing', 'border-box');
  
  // --- AGGIUNGI QUI LO STILE FONT PER I SUGGERIMENTI ---
  suggerimentiDiv.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif');
  // --- FINE STILE FONT ---
  
  // Eventi per l'input
  inputRicerca.input(mostraSuggerimenti);
  inputRicerca.elt.addEventListener('focus', mostraSuggerimenti);
  inputRicerca.elt.addEventListener('blur', () => {
    // Aggiungi un piccolo ritardo per permettere il click sul suggerimento
    setTimeout(() => {
      suggerimentiDiv.style('display', 'none');
      suggerimentoSelezionato = -1;
    }, 200);
  });
  
  // Gestione tasti freccia e invio
  inputRicerca.elt.addEventListener('keydown', (e) => {
    let suggerimenti = suggerimentiDiv.elt.children;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggerimentoSelezionato < suggerimenti.length - 1) {
        suggerimentoSelezionato++;
        aggiornaSelezioneSuggerimento(suggerimenti);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggerimentoSelezionato > 0) {
        suggerimentoSelezionato--;
        aggiornaSelezioneSuggerimento(suggerimenti);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggerimentoSelezionato >= 0 && suggerimenti[suggerimentoSelezionato]) {
        let paese = suggerimenti[suggerimentoSelezionato].textContent;
        // Chiama la funzione per navigare
        vaiAPaginaPaese(paese); 
      }
      // Se Invio viene premuto sull'input senza selezione, filtra per il valore corrente
      else if (inputRicerca.value().trim() !== '') {
          // Opzionale: Naviga al primo risultato o esegui una ricerca
          let primoSuggerimento = suggerimentiDiv.elt.firstChild;
          if (primoSuggerimento) {
               vaiAPaginaPaese(primoSuggerimento.textContent);
          } else {
               // Se non ci sono suggerimenti, prova a cercare esattamente ciò che è stato digitato
               vaiAPaginaPaese(inputRicerca.value().trim()); 
          }
      }
    }
  });
}

// funzione per mostrare i suggerimenti
function mostraSuggerimenti() {
  let query = inputRicerca.value().toLowerCase().trim();
  suggerimentiDiv.html('');
  suggerimentoSelezionato = -1;
  
  if (query === '') {
    suggerimentiDiv.style('display', 'none');
    return;
  }
  
  // Filtra i paesi che INIZIANO con la query (invece di contains)
  let paesiFiltrati = paesiUnici.filter(paese => 
    paese.toLowerCase().startsWith(query)
  );
  
  if (paesiFiltrati.length === 0) {
    suggerimentiDiv.style('display', 'none');
    return;
  }
  
  // Mostra massimo 8 suggerimenti
  paesiFiltrati.slice(0, 8).forEach((paese, index) => {
    let suggDiv = createDiv(paese);
    suggDiv.parent(suggerimentiDiv);
    suggDiv.style('padding', '12px 20px');
    suggDiv.style('cursor', 'pointer');
    suggDiv.style('color', '#f0f0f0');
    suggDiv.style('font-size', '15px');
    suggDiv.style('border-bottom', '1px solid #444');
    suggerimentiDiv.style('border-radius', '30px');
    suggerimentiDiv.style('top', '60px'); 
    suggDiv.attribute('data-index', index);
    
    // Hover effect
    suggDiv.mouseOver(() => {
      suggDiv.style('background-color', '#3a3a3a');
    });
    suggDiv.mouseOut(() => {
      if (suggerimentoSelezionato !== index) {
        suggDiv.style('background-color', 'transparent');
      }
    });
    
    // Click per andare alla pagina
    suggDiv.mousePressed(() => {
      vaiAPaginaPaese(paese); 
    });
  });
  
  suggerimentiDiv.style('display', 'block');
}

// funzione per aggiornare la selezione con le frecce
function aggiornaSelezioneSuggerimento(suggerimenti) {
  for (let i = 0; i < suggerimenti.length; i++) {
    if (i === suggerimentoSelezionato) {
      suggerimenti[i].style.backgroundColor = '#3a3a3a';
      // Scorrimento per visualizzare il suggerimento selezionato
      suggerimenti[i].scrollIntoView({ block: 'nearest' }); 
    } else {
      suggerimenti[i].style.backgroundColor = 'transparent';
    }
  }
}

// funzione per navigare alla pagina del paese
function vaiAPaginaPaese(paese) {
  // Codifica il nome del paese per l'URL
  let paeseEncoded = encodeURIComponent(paese);
  // Reindirizza alla pagina del paese, assumendo esista un file 'paese.html'
  window.location.href = `paese.html?country=${paeseEncoded}`; 
}

// calcola il massimo numero di paesi per ogni regione attraverso tutti gli anni e status
function calcolaMaxPaesiPerRegione() {
  // Struttura: {regione: {anno: {F: count, PF: count, NF: count}}}
  let conteggioCompleto = {};
  
  // Analizza tutti i dati
  for (let i = 0; i < data.getRowCount(); i++) {
    let riga = data.getRow(i);
    let regione = riga.getString('Region');
    let anno = riga.getNum('Edition');
    let status = riga.getString('Status');
    
    if (!conteggioCompleto[regione]) {
      conteggioCompleto[regione] = {};
    }
    if (!conteggioCompleto[regione][anno]) {
      conteggioCompleto[regione][anno] = {F: 0, PF: 0, NF: 0};
    }
    
    conteggioCompleto[regione][anno][status]++;
  }
  
  // Per ogni regione, trova il massimo tra tutti gli anni e tutti gli status
  maxPaesiPerRegione = {};
  for (let regione in conteggioCompleto) {
    let maxF = 0;
    let maxPF = 0;
    let maxNF = 0;
    
    for (let anno in conteggioCompleto[regione]) {
      maxF = max(maxF, conteggioCompleto[regione][anno].F);
      maxPF = max(maxPF, conteggioCompleto[regione][anno].PF);
      maxNF = max(maxNF, conteggioCompleto[regione][anno].NF);
    }
    
    // Il massimo assoluto per questa regione è il maggiore tra i tre status
    maxPaesiPerRegione[regione] = max(maxF, maxPF, maxNF);
  }
}

// funzione richiamata al cambio di selezione del menu
function filtraDatiPerAnno() { 
    annoCorrente = parseInt(selettoreAnno.value()); // aggiorna annoCorrente con il nuovo valore selezionato
    filtraECalcolaDati(annoCorrente); // ricalcola e ridisegna i dati per il nuovo anno
}

// funzione per creare un singolo bottone con stile
function creaBottone(testo, x, y, colori, tipo) {
  let bottone = createButton(testo);
  bottone.position(x, y);
  
  // AUMENTA IL PADDING PER INCLUDERE LO SPESSORE DEL BORDO SFUMATO
  // Il padding esterno deve essere aumentato del valore del bordo (es. 2px). 
  // Da '2px 30px' a '4px 32px' per mantenere lo spazio originale.
  bottone.style('padding', '4px 32px'); 
  bottone.style('font-size', '16px');
  bottone.style('font-weight', 'bold');
  
  // Rimuovi il bordo solido
  bottone.style('border', 'none'); 
  
  bottone.style('cursor', 'pointer');
  bottone.style('border-radius', '25px');
  bottone.style('z-index', '1002');
  
  // --- NUOVE PROPRIETÀ PER IL BORDO SFUMATO ---
  
  // 1. Definisci il Gradiente per il Bordo (Sfondo Esterno)
  let gradienteBordo;
  if (colori.length === 2) {
    // Se hai solo due colori, puoi creare un gradiente semplice per il bordo
    gradienteBordo = `linear-gradient(to right, ${colori[0]})`;
  } else if (colori.length === 3) {
    // Gradiente più complesso
    gradienteBordo = `linear-gradient(45deg, ${colori[0]}, ${colori[1]})`; 
  }
  
  // 2. Imposta lo Sfondo Totale (Bordo Sfumato + Colore Interno)
  // Utilizza background per applicare il gradiente del bordo E il colore di sfondo del bottone
  // Il colore interno è 'transparent' perché lo sfondo effettivo è un secondo livello
  bottone.style('background', `${gradienteBordo}, linear-gradient(${colori[2] || '#26231d'}, ${colori[2] || '#26231d'})`);
  
  // 3. Imposta la Dimensione del Bordo
  bottone.style('border-width', '2px');
  bottone.style('border-style', 'solid');
  
  // 4. Ritaglia lo Sfondo Interno
  // Lo sfondo (il colore del bottone) viene ritagliato per lasciare visibile solo il bordo sfumato.
  // padding-box: ritaglia lo sfondo interno fino all'area del padding (dove il testo è)
  // border-box: ritaglia lo sfondo esterno (il gradiente) fino al bordo dell'elemento
  bottone.style('background-clip', 'padding-box, border-box');
  
  // 5. Controlla l'origine degli sfondi
  bottone.style('background-origin', 'border-box'); 
  
  // Il colore del testo rimane il colore scuro
  bottone.style('color', '#26231d');
  
  bottone.mousePressed(() => toggleFiltro(tipo));
  
  return bottone;
}

// funzione per creare i bottoni filtro
function creaBottoniFiltro() {
  let yPos = 41.25; // Posizione Y fissa in alto
  let spaziatura = 10; // Spazio fisso tra i bottoni
  
  // --- FASE 1: Creazione e Misurazione (Posizione temporanea) ---
  // Creiamo i bottoni a una posizione temporanea (es. 0) per poter misurare la loro larghezza effettiva
  bottoneF = creaBottone('FREE', 0, yPos, coloriStatus['F'], 'F');
  let larghezzaF = bottoneF.elt.offsetWidth;
  
  bottonePF = creaBottone('PARTIALLY FREE', 0, yPos, coloriStatus['PF'], 'PF');
  let larghezzaPF = bottonePF.elt.offsetWidth;

  bottoneNF = creaBottone('NOT FREE', 0, yPos, coloriStatus['NF'], 'NF');
  let larghezzaNF = bottoneNF.elt.offsetWidth;
  
  // --- FASE 2: Calcolo della Larghezza Totale del Blocco ---
  let larghezzaTotaleBlocco = larghezzaF + larghezzaPF + larghezzaNF + (spaziatura * 2);

  // --- FASE 3: Calcolo della Posizione Iniziale (Centraggio) ---
  // Calcola il nuovo punto di partenza (xInizio) per centrare il blocco 
  // nell'area del grafico (graficoWidth)
  let xInizio = graficoWidth - larghezzaTotaleBlocco - 80;
  
  // --- FASE 4: Assegnazione della Posizione Finale (Ridisposizione) ---
  // Bottone FREE (Inizia dal punto centrato)
  bottoneF.position(xInizio, yPos);
  
  // Bottone PARTIALLY FREE (Inizia dopo larghezzaF + spaziatura)
  let xPF = xInizio + larghezzaF + spaziatura;
  bottonePF.position(xPF, yPos);

  // Bottone NOT FREE (Inizia dopo xPF + larghezzaPF + spaziatura)
  let xNF = xPF + larghezzaPF + spaziatura;
  bottoneNF.position(xNF, yPos);
}

// funzione per gestire il toggle dei filtri
function toggleFiltro(tipo) {
  if (tipo === 'F') {
    filtroF = !filtroF;
    aggiornaStileBottone(bottoneF, filtroF, coloriStatus['F']);
  } else if (tipo === 'PF') {
    filtroPF = !filtroPF;
    aggiornaStileBottone(bottonePF, filtroPF, coloriStatus['PF']);
  } else if (tipo === 'NF') {
    filtroNF = !filtroNF;
    aggiornaStileBottone(bottoneNF, filtroNF, coloriStatus['NF']);
  }
}

// funzione per aggiornare lo stile del bottone
function aggiornaStileBottone(bottone, attivo, colori) {
  // Crea il gradiente CSS
  let gradiente;
  if (colori.length === 2) {
    gradiente = `linear-gradient(to right, ${colori[0]}, ${colori[0]})`;
  } else if (colori.length === 3) {
    gradiente = `linear-gradient(to right, ${colori[0]}, ${colori[1]})`;
  }
  
  if (attivo) {
    bottone.style('background', gradiente);
    bottone.style('opacity', '1');
    bottone.style('color', '#26231d');
  } else {
    bottone.style('background', 'transparent');
    bottone.style('opacity', '0.8');
    bottone.style('color', '#f0f0f0');
  }
}


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
  }
}

// disegna la scala
function disegnaGriglia() {
  const puntiDiRiferimento = [0, 50, 100]; 

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

// funzione per disegnare una singola barra
function disegnaBarraSingola(xBarra, riga, larghezzaBarra) {
  let status = riga.getString('Status');
  let total = riga.getNum('TOTAL');
  let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
  let yCimaBarra = yBarra - altezzaBarra - incremento;

  // Applica il gradiente
  let gradient = creaGradiente(xBarra, yCimaBarra, yBarra, larghezzaBarra, coloriStatus[status]);
  drawingContext.fillStyle = gradient;
  rect(xBarra, yBarra, larghezzaBarra, -altezzaBarra - incremento);
  
  // Disegna il cerchio in cima
  push();
  fill("#f0f0f0");
  ellipse(xBarra + larghezzaBarra/2, yCimaBarra, larghezzaBarra, larghezzaBarra);
  pop();
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
  let margineFinale = margineIniziale;
  let spazioDisponibile = graficoWidth - margineIniziale - margineFinale; // usa graficoWidth invece di width

  // MODIFICATO: Calcola il totale di barre basato sui MASSIMI per regione
  let totaleBarre = 0;
  for (let regione of regioni) {
    totaleBarre += maxPaesiPerRegione[regione];
  }
  
  // Calcola la larghezza ottimale per barre e spazi
  let numeroGruppi = regioni.length;
  let spazioTraGruppi = min(50, spazioDisponibile * 0.1); // Massimo 100px o 10% dello spazio
  let spazioTotaleGruppi = spazioTraGruppi * (numeroGruppi - 1);
  let spazioPerBarre = spazioDisponibile - spazioTotaleGruppi;
  let larghezzaBarra = max(2, min(15, spazioPerBarre / totaleBarre)); // Tra 2 e 15 pixel
  
  // Array per salvare le posizioni delle etichette e delle torce
  let etchetteRegioni = [];
  
  let xCorrente = margineIniziale;
  
  // MODIFICATO: Calcola le posizioni usando il massimo per regione - Prima calcola le posizioni per le etichette
  for (let regione of regioni) {
    let larghezzaGruppo = maxPaesiPerRegione[regione] * larghezzaBarra;
    let centroGruppo = xCorrente + larghezzaGruppo / 2;
    etchetteRegioni.push({
      regione: regione, 
      x: centroGruppo,
      xInizio: xCorrente,
      larghezza: larghezzaGruppo
    });
    xCorrente += larghezzaGruppo + spazioTraGruppi;
  }
  
  // LIVELLO 1: Disegna prima tutti i paesi LIBERI (F) - sfondo
  if (filtroF) {
    xCorrente = margineIniziale;
    for (let regione of regioni) {
      let paesiInRegione = datiPerRegione[regione];
      let numPaesiF = paesiInRegione.filter(r => r.getString('Status') === 'F').length;
      let larghezzaTotaleF = numPaesiF * larghezzaBarra;
      let larghezzaTotaleGruppo = maxPaesiPerRegione[regione] * larghezzaBarra;
      let offsetCentraturaF = (larghezzaTotaleGruppo - larghezzaTotaleF) / 2;
      let contatoreF = 0;
      
      for (let i = 0; i < paesiInRegione.length; i++) {
        let riga = paesiInRegione[i];
        let status = riga.getString('Status');
        
        if (status === 'F') {
          let xBarra = xCorrente + offsetCentraturaF + contatoreF * larghezzaBarra;
          disegnaBarraSingola(xBarra, riga, larghezzaBarra);
          contatoreF++;
        }
      }
      
      // MODIFICATO: Avanza usando il massimo per regione
      xCorrente += maxPaesiPerRegione[regione] * larghezzaBarra + spazioTraGruppi;
    }
  }
  
  // LIVELLO 2: Disegna poi tutti i paesi PARZIALMENTE LIBERI (PF) - livello intermedio
  if (filtroPF) {
    xCorrente = margineIniziale;
    for (let regione of regioni) {
      let paesiInRegione = datiPerRegione[regione];
      let numPaesiPF = paesiInRegione.filter(r => r.getString('Status') === 'PF').length;
      let larghezzaTotalePF = numPaesiPF * larghezzaBarra;
      let larghezzaTotaleGruppo = maxPaesiPerRegione[regione] * larghezzaBarra;
      let offsetCentraturaPF = (larghezzaTotaleGruppo - larghezzaTotalePF) / 2;
      let contatorePF = 0;
      
      for (let i = 0; i < paesiInRegione.length; i++) {
        let riga = paesiInRegione[i];
        let status = riga.getString('Status');
        
        if (status === 'PF') {
          let xBarra = xCorrente + offsetCentraturaPF + contatorePF * larghezzaBarra;
          disegnaBarraSingola(xBarra, riga, larghezzaBarra);
          contatorePF++;
        }
      }
      
      xCorrente += maxPaesiPerRegione[regione] * larghezzaBarra + spazioTraGruppi;
    }
  }
  
  // LIVELLO 3: Disegna infine tutti i paesi NON LIBERI (NF) - livello superiore
  if (filtroNF) {
    xCorrente = margineIniziale;
    for (let regione of regioni) {
      let paesiInRegione = datiPerRegione[regione];
      let numPaesiNF = paesiInRegione.filter(r => r.getString('Status') === 'NF').length;
      let larghezzaTotaleNF = numPaesiNF * larghezzaBarra;
      let larghezzaTotaleGruppo = maxPaesiPerRegione[regione] * larghezzaBarra;
      let offsetCentraturaNF = (larghezzaTotaleGruppo - larghezzaTotaleNF) / 2;
      let contatoreNF = 0;
      
      for (let i = 0; i < paesiInRegione.length; i++) {
        let riga = paesiInRegione[i];
        let status = riga.getString('Status');
        
        if (status === 'NF') {
          let xBarra = xCorrente + offsetCentraturaNF + contatoreNF * larghezzaBarra;
          disegnaBarraSingola(xBarra, riga, larghezzaBarra);
          contatoreNF++;
        }
      }
      
      xCorrente += maxPaesiPerRegione[regione] * larghezzaBarra + spazioTraGruppi;
    }
  }
  
  // Disegna le torce sotto ogni regione, centrate con larghezza fissa basata sul massimo
  push();
  imageMode(CENTER);
  for (let regione of regioni) {
    // Usa la larghezza massima assoluta per la regione (calcolata in base a maxPaesiPerRegione)
    let larghezzaMassima = maxPaesiPerRegione[regione] * larghezzaBarra;
    
    // Trova il centro della regione dalle etichette
    let etichetta = etchetteRegioni.find(e => e.regione === regione);
    let centroRegione = etichetta.x;
    
    // Calcola l'altezza disponibile: da yBarra fino al fondo
    let yIniziaTorcia = yBarra;
    let altezzaTorcia = height - yIniziaTorcia;
    
    // Disegna l'immagine della torcia centrata con larghezza massima assoluta
    image(torcia, centroRegione, yIniziaTorcia + altezzaTorcia/2, larghezzaMassima*1.1, altezzaTorcia);
  }
  pop();
  
  // Disegna le etichette delle regioni alla fine (sopra tutti i livelli e sopra le torce)
push();
fill("#26231d"); // Sfondo scuro del canvas
noStroke();
textAlign(CENTER, CENTER);
// NOTA: Ho modificato fontBold in fontRegular in base alla tua preload, 
// ma se avevi un font 'Medium' specifico, sostituiscilo
textFont(fontMedium); 
textSize(20); // Riduci la dimensione per adattarla meglio
const altezzaEtichetta = 50; // Altezza massima della casella di testo
const yEtichetta = yBarra + 52; // Posizione Y del centro della casella

for (let etichetta of etchetteRegioni) {
    
    // 1. Calcola la larghezza della casella di testo basata sulla larghezza del gruppo
    // Usiamo la larghezza calcolata precedentemente per il gruppo di barre.
    const larghezzaCasella = etichetta.larghezza * 1.2; // 1.2 per un po' di margine
    
    // 2. Calcola la posizione X di inizio della casella per centrarla
    const xInizioCasella = etichetta.x - (larghezzaCasella / 2);

    // 3. Usa la funzione text() con quattro argomenti (x, y, larghezza, altezza)
    text(
        etichetta.regione, 
        xInizioCasella, 
        yEtichetta - (altezzaEtichetta / 2), // Regola Y per l'inizio del testo
        larghezzaCasella, 
        altezzaEtichetta
    );
}
pop();
}

function disegnaEtichettaAnno() {
  // 1. Sposta l'origine (0,0) nel punto di rotazione
  push(); 

  // Imposta lo stile del testo
  fill("#f0f0f0");
  textSize(annoWidth*1.3);
  textFont(fontRegular); 
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