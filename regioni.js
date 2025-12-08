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
let numMaxPaesiRegione; // numero massimo di paesi nella regione attraverso tutti gli anni

// VARIABILI per i filtri status
let filtroF = true;
let filtroPF = true;
let filtroNF = true;
let bottoneF, bottonePF, bottoneNF;

// VARIABILI per i filtri Countries/Territories
let filtroCountries = null; // null = nessun filtro, 'c' = solo countries, 't' = solo territories
let bottoneCountries, bottoneTerritories;

// Aggiungi dopo le altre variabili globali
let paesiConPosizioni = []; // Array per memorizzare posizioni dei pallini
let indiceHover = -1; // Indice del paese in hover (-1 = nessuno)

// VARIABILI per disegnare le barre
let altezzaMassimaBarra;
let yBarra;
let minTotalScore = 0;
let maxTotalScore = 100;
let incremento = 50;

// Aggiungi dopo le altre variabili globali
let boxInfoPaese; // Div per visualizzare info del paese in hover

// variabili per la barra di ricerca
let inputRicerca;
let suggerimentiDiv;
let paesiUnici = [];
let suggerimentoSelezionato = -1;

// variabili per i nuovi bottoni in alto a destra
let bottoneUS;
let bottoneFH;
let bottoneBack; // bottone per tornare indietro

// Aggiungi dopo le altre variabili globali
let paragrafiRegioni;

// colori
let nero ="#26231d";
let bianco = "#eaead8";

// colori per status con gradienti
let coloriStatus = {
  'F': ["#c76351", "#d58d3e", "#26231d"], // Libero (Free)
  'PF': ["#e5c38f", "#cad181", "#26231d"], // Parzialmente Libero (Partially Free)
  'NF': ["#75a099", "#91a2a6", "#26231d"], // Non Libero (Not Free)
};

function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  torcia = loadImage("img/torcia.png");
  fontRegular = loadFont("font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("font/NeueHaasDisplayBold.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // variabili per responsiveness
  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;
  
  // variabili per disegnare le barre
  altezzaMassimaBarra = windowHeight * 0.6; 
  yBarra = windowHeight * 0.72; 
  
  // Recupera la regione dall'URL
  const urlParams = new URLSearchParams(window.location.search);
  let regionFromURL = urlParams.get('region');
  
  // Decodifica e normalizza la regione
  if (regionFromURL) {
    regioneCorrente = decodeURIComponent(regionFromURL);
  } else {
    regioneCorrente = 'Regione non trovata';
  }
  
  // filtro i dati per anno
  let anni = data.getColumn('Edition').map(Number); 
  let anniUnici = [...new Set(anni)].sort((a, b) => b - a); 
  
  // crea l'elemento select
  selettoreAnno = createSelect(); 
  selettoreAnno.position(50, 100);
  selettoreAnno.style('padding', '8px');
  selettoreAnno.style('font-size', '16px');
  selettoreAnno.style('z-index', '1000');
  
    // NUOVA POSIZIONE: sotto i bottoni US e FH
  const diametroBottone = 60;
  const spaziaturaTraBottoni = 20;
  let xFH = width - diametroBottone - 25;
  let xUS = xFH - diametroBottone - spaziaturaTraBottoni;
  
  // Posiziona il selettore sotto il bottone US (più a sinistra)
  let xSelettore = xUS;
  let ySelettore = 30 + diametroBottone + 20; // 30 (yPos bottoni) + 60 (diametro) + 20 (spaziatura)
  
  selettoreAnno.position(xSelettore, ySelettore);
  selettoreAnno.style('padding', '8px');
  selettoreAnno.style('font-size', '16px');
  selettoreAnno.style('z-index', '1000');
  selettoreAnno.style('background-color', nero);
  selettoreAnno.style('color', bianco);
  selettoreAnno.style('border', '1px solid' + bianco);
  selettoreAnno.style('border-radius', '5px');
  selettoreAnno.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif');

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
  } else if (anniUnici.length > 0 && !isNaN(anniUnici[0])) {
    annoCorrente = anniUnici[0]; 
    selettoreAnno.selected(annoCorrente);
  } else {
    annoCorrente = null;
  }

  // associa una funzione di callback al cambio di selezione
  selettoreAnno.changed(filtraDatiPerAnno); 
  // filtra e calcola i dati iniziali
  filtraECalcolaDati(annoCorrente);
  
  // CALCOLA IL NUMERO MASSIMO DI PAESI NELLA REGIONE (attraverso tutti gli anni)
  calcolaNumMaxPaesiRegione();

  // AGGIUNGI QUESTA RIGA:
  estraiPaesiUnici();
  
  // CREA I BOTTONI FILTRO STATUS
  creaBottoniFiltro();

  creaBottoneBack();
  
  // CREA I BOTTONI FILTRO COUNTRIES/TERRITORIES
  creaBottoniCountriesTerritori();

  // CHIAMATA INIZIALE per popolare i div dei contatori
  aggiornaContenutoBottoniCountriesTerritori();

  // CREA IL BOX INFO PAESE (aggiungi questa riga)
  creaBoxInfoPaese();

  // CREAZIONE BARRA RICERCA
  creaBarraRicerca();

  // CHIAMA LA NUOVA FUNZIONE PER CREARE I BOTTONI DI NAVIGAZIONE
  creaBottoniNavigazione();

  // CREA LA STRUTTURA DEI PARAGRAFI (aggiungi dopo createCanvas)
  creaParagrafiRegioni();
}

// funzione per estrarre tutti i paesi unici dal dataset
function estraiPaesiUnici() {
  let paesi = data.getColumn('Country/Territory');
  paesiUnici = [...new Set(paesi)].sort();
}

// FUNZIONE MODIFICATA PER MIGLIORE VISIBILITÀ E POSIZIONAMENTO
function creaBarraRicerca() {
  const larghezzaBarra = graficoWidth * 0.3;
  
  // Container principale per la ricerca
  let containerRicerca = createDiv();
  
  // CENTRAGGIO DELLA BARRA SOPRA IL GRAFICO (circa)
  let xPos = graficoWidth *0.67;
  let yPos = 30; 
  
  containerRicerca.position(xPos, yPos);
  containerRicerca.style('position', 'absolute');
  containerRicerca.style('width', larghezzaBarra + 'px');
  containerRicerca.style('z-index', '1001');
  
  // Wrapper per input e icona
  let inputWrapper = createDiv();
  inputWrapper.parent(containerRicerca);
  inputWrapper.style('position', 'relative');
  inputWrapper.style('width', '100%');
  
  // Icona lente di ingrandimento (SVG)
  let iconaLente = createDiv();
  iconaLente.parent(inputWrapper);
  iconaLente.html(`
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${bianco}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="7"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  `);
  iconaLente.style('position', 'absolute');
  iconaLente.style('left', '20px');
  iconaLente.style('top', '50%');
  iconaLente.style('transform', 'translateY(-50%)');
  iconaLente.style('pointer-events', 'none');
  iconaLente.style('z-index', '1');
  iconaLente.style('display', 'flex');
  iconaLente.style('align-items', 'center');
  
  // Input di ricerca
  inputRicerca = createInput('');
  inputRicerca.attribute('placeholder', 'Look up Country or Territory');
  inputRicerca.parent(inputWrapper);
  inputRicerca.style('width', '100%');
  inputRicerca.style('padding', '20px 20px 18px 50px'); // Aumentato padding a sinistra per l'icona
  inputRicerca.style('font-size', '20px');
  inputRicerca.style('border', '1px solid' + bianco);
  inputRicerca.style('border-radius', '30px');
  inputRicerca.style('background-color', nero);
  inputRicerca.style('color', bianco);
  inputRicerca.style('outline', 'none');
  inputRicerca.style('box-sizing', 'border-box');
  inputRicerca.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif'); 
  
  // Div per i suggerimenti
  suggerimentiDiv = createDiv();
  suggerimentiDiv.parent(containerRicerca);
  suggerimentiDiv.style('position', 'absolute');
  suggerimentiDiv.style('top', '60px');
  suggerimentiDiv.style('width', '100%');
  suggerimentiDiv.style('max-height', '300px');
  suggerimentiDiv.style('overflow-y', 'auto');
  suggerimentiDiv.style('background-color', nero);
  suggerimentiDiv.style('border', '1px solid' + bianco);
  suggerimentiDiv.style('border-radius', '30px');
  suggerimentiDiv.style('display', 'none');
  suggerimentiDiv.style('z-index', '1001');
  suggerimentiDiv.style('box-sizing', 'border-box');
  suggerimentiDiv.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif');
  
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
    suggDiv.style('padding', '15px 20px 12px 20px');
    suggDiv.style('cursor', 'pointer');
    suggDiv.style('color', bianco);
    suggDiv.style('font-size', '18px');
    suggDiv.style('border-bottom', '1px solid #444');
    suggerimentiDiv.style('border-radius', '30px');
    suggerimentiDiv.style('top', '70px'); 
    suggDiv.attribute('data-index', index);
    suggDiv.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif'); 
    
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

// NUOVA FUNZIONE per calcolare il numero massimo di paesi nella regione
function calcolaNumMaxPaesiRegione() {
  if (!data || data.getRowCount() === 0) {
    numMaxPaesiRegione = 0;
    return;
  }
  
  // Ottieni tutti gli anni
  let anni = data.getColumn('Edition').map(Number);
  let anniUnici = [...new Set(anni)].filter(a => !isNaN(a));
  
  let maxPaesi = 0;
  
  // Per ogni anno, conta quanti paesi ci sono nella regione corrente
  for (let anno of anniUnici) {
    let paesiInAnno = data.getRows().filter(riga => {
      return riga.getNum('Edition') === anno && riga.getString('Region') === regioneCorrente;
    });
    
    if (paesiInAnno.length > maxPaesi) {
      maxPaesi = paesiInAnno.length;
    }
  }
  
  numMaxPaesiRegione = maxPaesi;
}

// FUNZIONE per creare un singolo bottone con stile
function creaBottone(testo, x, y, colori, tipo) {
  let bottone = createButton(testo);
  bottone.position(x, y);
  
  bottone.style('padding', '4px 32px 2px 32px'); 
  bottone.style('font-size', '20px');
  bottone.style('font-weight', 'bold');
  bottone.style('border', 'none'); 
  bottone.style('cursor', 'pointer');
  bottone.style('border-radius', '25px');
  bottone.style('z-index', '1002');
  
  // Gradiente per il bordo
  let gradienteBordo;
  if (colori.length === 2) {
    gradienteBordo = `linear-gradient(to right, ${colori[0]})`;
  } else if (colori.length === 3) {
    gradienteBordo = `linear-gradient(45deg, ${colori[0]}, ${colori[1]})`; 
  }
  
  bottone.style('background', `${gradienteBordo}, linear-gradient(${colori[2] || nero}, ${colori[2] || nero})`);
  bottone.style('border-width', '2px');
  bottone.style('border-style', 'solid');
  bottone.style('background-clip', 'padding-box, border-box');
  bottone.style('background-origin', 'border-box'); 
  bottone.style('color', nero);
  
  bottone.mousePressed(() => toggleFiltro(tipo));
  
  return bottone;
}

// NUOVA FUNZIONE per creare i bottoni filtro dentro il box
function creaBottoniFiltro() {
  // Posizione del box
  let boxX = 40; 
  let boxW = graficoWidth * 0.3;
  let boxY1 = 150;
  let boxH1 = windowHeight * 0.25;
  let distanza = 40; // distanza verticale tra i bottoni
  
  // Crea i bottoni in posizioni temporanee per misurare
  bottoneF = creaBottone('FREE', 0, 0, coloriStatus['F'], 'F'); 
  bottonePF = creaBottone('PARTIALLY FREE', 0, 0, coloriStatus['PF'], 'PF');
  bottoneNF = creaBottone('NOT FREE', 0, 0, coloriStatus['NF'], 'NF');
  
  
  // Calcola la posizione iniziale per centrare orizzontalmente nel box
  let xInizio = boxX + 30;
  
  // Altezza dei bottoni (stimata)
  let altezzaBottone = 35; // Approssimativa
  
  // Calcola la posizione Y per centrare verticalmente nel box
  let yBottoni = boxY1 + boxH1/2 - (altezzaBottone/3*2 + distanza);
  
  // Posiziona i bottoni
  bottoneF.position(xInizio, yBottoni);
  bottonePF.position(xInizio, yBottoni+distanza);
  bottoneNF.position(xInizio, yBottoni+distanza*2);
}

// NUOVA FUNZIONE per creare i bottoni filtro Countries/Territories
function creaBottoniCountriesTerritori() {
  // Parametri dei box
  let boxX = 40; 
  let boxW = graficoWidth * 0.3;
  let boxRightX = graficoWidth - boxX - boxW;
  let boxY1 = 150;
  let spacing = 20;
  let boxRightH = (windowHeight * 0.5 - 2 * spacing) / 3; 
  
  // Posizioni dei box
  let yBox1 = boxY1; 
  let yBox2 = boxY1 + boxRightH + spacing;
  
  // Crea i bottoni sovrapposti ai box
  bottoneCountries = createDiv('');
  bottoneTerritories = createDiv('');
  
  // Posizionamento e stile
  bottoneCountries.position(boxRightX, yBox1);
  bottoneCountries.size(boxW, boxRightH);
  
  bottoneTerritories.position(boxRightX, yBox2);
  bottoneTerritories.size(boxW, boxRightH);
  
  // Stile base per entrambi i bottoni (nero con bordo bianco)
  [bottoneCountries, bottoneTerritories].forEach(bottone => {
    bottone.style('cursor', 'pointer');
    bottone.style('border-radius', '30px');
    bottone.style('background', nero);
    bottone.style('display', 'flex');
    bottone.style('align-items', 'center');
    bottone.style('justify-content', 'center');
    bottone.style('transition', 'all 0.3s ease');
    bottone.style('border', '1px solid' + bianco);
    bottone.style('z-index', '1001');
  });
  
  // Aggiungi i gestori di click
  bottoneCountries.mousePressed(() => toggleFiltro('C'));
  bottoneTerritories.mousePressed(() => toggleFiltro('T'));
  
  // Inizializza lo stile
  aggiornaStileBottoneCountriesTerritori();
}

// FUNZIONE per gestire il toggle dei filtri
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
  } else if (tipo === 'C') {
    // Se clicco Countries
    if (filtroCountries === 'c') {
      filtroCountries = null;
    } else {
      filtroCountries = 'c';
    }
    // Aggiorna sia lo stile CSS che il contenuto HTML (colore del testo)
    aggiornaStileBottoneCountriesTerritori();
    aggiornaContenutoBottoniCountriesTerritori(); 
  } else if (tipo === 'T') {
    // Se clicco Territories
    if (filtroCountries === 't') {
      filtroCountries = null;
    } else {
      filtroCountries = 't';
    }
    // Aggiorna sia lo stile CSS che il contenuto HTML (colore del testo)
    aggiornaStileBottoneCountriesTerritori();
    aggiornaContenutoBottoniCountriesTerritori(); 
  }
}

// FUNZIONE per aggiornare lo stile del bottone
function aggiornaStileBottone(bottone, attivo, colori) {
  let gradiente;
  if (colori.length === 2) {
    gradiente = `linear-gradient(to right, ${colori[0]}, ${colori[0]})`;
  } else if (colori.length === 3) {
    gradiente = `linear-gradient(to right, ${colori[0]}, ${colori[1]})`;
  }
  
  if (attivo) {
    bottone.style('background', gradiente);
    bottone.style('opacity', '1');
    bottone.style('color', nero);
  } else {
    bottone.style('background', 'transparent');
    bottone.style('opacity', '0.8');
    bottone.style('color', bianco);
  }
}

// FUNZIONE per aggiornare lo stile dei bottoni Countries/Territories
function aggiornaStileBottoneCountriesTerritori() {
  // Colori di riferimento
  const COLORE_ATTIVO = bianco; // Bianco (sfondo attivo)
  const COLORE_INATTIVO = nero; // Nero (sfondo inattivo)
  const BORDO_ATTIVO = '1px solid' + nero; // Bordo nero quando attivo
  const BORDO_INATTIVO = '1px solid' + bianco; // Bordo bianco quando inattivo
  
  // Bottone Countries
  if (filtroCountries === 'c') {
    // Countries attivo: Sfondo bianco, bordo nero
    bottoneCountries.style('background', COLORE_ATTIVO);
    bottoneCountries.style('opacity', '1');
    bottoneCountries.style('border', BORDO_ATTIVO);
  } else {
    // Countries non attivo: Sfondo nero, bordo bianco, opacità per l'altro filtro
    bottoneCountries.style('background', COLORE_INATTIVO);
    bottoneCountries.style('opacity', filtroCountries === 't' ? '0.3' : '1');
    bottoneCountries.style('border', BORDO_INATTIVO);
  }
  
  // Bottone Territories
  if (filtroCountries === 't') {
    // Territories attivo: Sfondo bianco, bordo nero
    bottoneTerritories.style('background', COLORE_ATTIVO);
    bottoneTerritories.style('opacity', '1');
    bottoneTerritories.style('border', BORDO_ATTIVO);
  } else {
    // Territories non attivo: Sfondo nero, bordo bianco, opacità per l'altro filtro
    bottoneTerritories.style('background', COLORE_INATTIVO);
    bottoneTerritories.style('opacity', filtroCountries === 'c' ? '0.3' : '1');
    bottoneTerritories.style('border', BORDO_INATTIVO);
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

function draw() {
  background(nero);
  drawTitle();
  drawBoxes();
  
  if (datiFiltrati && datiFiltrati.length > 0) {
    disegnaGriglia();
    disegnaBarre();
    disegnaTorciaRegione();
    disegnaEtichetteHover();
    
    // AGGIUNGI QUESTA PARTE:
    // Aggiorna il box info in base all'hover
    if (indiceHover !== -1) {
      let paeseHover = paesiConPosizioni.find(p => p.indice === indiceHover);
      if (paeseHover) {
        aggiornaBoxInfoPaese(paeseHover);
      }
    } else {
      aggiornaBoxInfoPaese(null);
    }
  }
  
  disegnaEtichettaAnno();
}

function drawTitle(){
  push();
  fill(bianco);
  noStroke();
  textSize(80);
  textFont(fontMedium);
  textAlign(LEFT, TOP);
  text(regioneCorrente, 120, 35); 
  pop();
}

function drawBoxes() {
  // BOX A SINISTRA 
  let boxX = 40; 
  let boxW = graficoWidth * 0.3;
  let boxH1 = windowHeight * 0.25;
  let boxH2 = windowHeight * 0.45;
  
  // Posizionamento in verticale
  let boxY1 = 150;
  let boxY2 = boxY1 + boxH1 + 40;
  
  // Stile box
  strokeWeight(1);
  stroke(bianco);
  fill(nero);
  let radius = 30;
  
  // primo box a sinistra
  rect(boxX, boxY1, boxW, boxH1, radius);
  
  // secondo box a sinistra
  rect(boxX, boxY2, boxW, boxH2, radius);
  
  // AGGIUNGI IL TESTO DINAMICO NEL BOX IN BASSO A SINISTRA
  push();
  fill(bianco);
  noStroke();
  textSize(16);
  textFont(fontRegular);
  textAlign(LEFT, TOP);
  textLeading(20); // Spaziatura tra le righe
  
  // Ottieni il paragrafo corretto per regione e anno
  let paragrafo = getParagrafoCorrente();
  
  // Margini interni al box
  let padding = 30;
  let testoX = boxX + padding;
  let testoY = boxY2 + padding;
  let testoLarghezza = boxW - (padding * 2);
  
  // Disegna il testo con word wrap
  text(paragrafo, testoX, testoY, testoLarghezza);
  
  pop();
  
  // BOX A DESTRA 
  let boxRightX = graficoWidth - boxX - boxW;
  
  let totalHeightLeft = boxH1 + 40 + boxH2;
  let spacing = 20;
  let boxRightH = (totalHeightLeft - 2 * spacing) / 3;
}

// FUNZIONE per disegnare una singola barra
function disegnaBarraSingola(xBarra, riga, larghezzaBarra, opacita) {
  let status = riga.getString('Status');
  let total = riga.getNum('TOTAL');
  let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
  let yCimaBarra = yBarra - altezzaBarra - incremento;

  // Applica il gradiente con opacità
  push();
  if (opacita < 1) {
    drawingContext.globalAlpha = opacita;
  }
  
  let gradient = creaGradiente(xBarra, yCimaBarra, yBarra, larghezzaBarra, coloriStatus[status]);
  drawingContext.fillStyle = gradient;
  rect(xBarra, yBarra, larghezzaBarra, -altezzaBarra - incremento);
  arc(xBarra + larghezzaBarra / 2, yCimaBarra, larghezzaBarra, larghezzaBarra, PI, TWO_PI);
  
  // Disegna il cerchio in cima
  fill(bianco);
  ellipse(xBarra + larghezzaBarra/2, yCimaBarra, larghezzaBarra, larghezzaBarra);
  pop();
}

// FUNZIONE per disegnare le barre della regione con i tre livelli sovrapposti
function disegnaBarre() {
  noStroke();
  
  // RESETTA l'array delle posizioni
  paesiConPosizioni = [];
  
  // Parametri dei box per calcolare lo spazio centrale
  let boxX = 40; 
  let boxW = graficoWidth * 0.3;
  let boxRightX = graficoWidth - boxX - boxW;
  
  // Calcola lo spazio disponibile tra i box
  let spazioInizioX = boxX + boxW;
  let spazioFineX = boxRightX;
  let spazioLarghezza = spazioFineX - spazioInizioX;
  let centroSpazioX = spazioInizioX + spazioLarghezza / 2;
  
  // Calcola il numero totale di paesi SENZA filtri per mantenere le posizioni
  let numPaesi = datiFiltrati.length;
  
  if (numPaesi === 0) return;
  
  // Calcola la larghezza delle barre in base allo spazio disponibile
  let margine = 60;
  let spazioDisponibile = spazioLarghezza - (margine * 2);
  let larghezzaBarra = max(8, min(20, spazioDisponibile / numPaesi));
  
  // Calcola la larghezza totale del gruppo di barre
  let larghezzaTotaleGruppo = numPaesi * larghezzaBarra;
  
  // Calcola la posizione iniziale per centrare le barre
  let xInizioGruppo = centroSpazioX - larghezzaTotaleGruppo / 2;
  
  // Separa i dati per status
  let paesiF = datiFiltrati.filter(r => r.getString('Status') === 'F');
  let paesiPF = datiFiltrati.filter(r => r.getString('Status') === 'PF');
  let paesiNF = datiFiltrati.filter(r => r.getString('Status') === 'NF');
  
  let numF = paesiF.length;
  let numPF = paesiPF.length;
  let numNF = paesiNF.length;
  
  let indiceGlobale = 0; // Per tracciare l'indice globale
  
  // Array temporaneo per memorizzare le barre in ordine di disegno
  let barreInOrdine = [];
  
  // LIVELLO 1: Disegna prima tutti i paesi LIBERI (F)
  if (filtroF && numF > 0) {
    let larghezzaTotaleF = numF * larghezzaBarra;
    let offsetCentraturaF = (larghezzaTotaleGruppo - larghezzaTotaleF) / 2;
    
    for (let i = 0; i < numF; i++) {
      let xBarra = xInizioGruppo + offsetCentraturaF + i * larghezzaBarra;
      
      // Determina l'opacità in base al filtro Countries/Territories E all'hover
      let tipo = paesiF[i].getString('C/T');
      let opacita = 1;
      
      // Opacità per filtro Countries/Territories
      if (filtroCountries === 'c' && tipo === 't') {
        opacita = 0.2;
      } else if (filtroCountries === 't' && tipo === 'c') {
        opacita = 0.2;
      }
      
      // Opacità per hover (se c'è un hover attivo)
      if (indiceHover !== -1 && indiceHover !== indiceGlobale) {
        opacita = 0.2;
      }
      
      disegnaBarraSingola(xBarra, paesiF[i], larghezzaBarra, opacita);
      
      // Memorizza la posizione completa della barra per il rilevamento hover
      let total = paesiF[i].getNum('TOTAL');
      let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
      let yCimaBarra = yBarra - altezzaBarra - incremento;
      
      // Memorizza con coordinate complete della barra
      let barraDati = {
        x: xBarra,
        y: yCimaBarra,
        larghezza: larghezzaBarra,
        altezza: altezzaBarra + incremento,
        centroPallinoX: xBarra + larghezzaBarra/2,
        centroPallinoY: yCimaBarra,
        raggio: larghezzaBarra/2,
        nome: paesiF[i].getString('Country/Territory'),
        score: paesiF[i].getNum('TOTAL'),
        pr: paesiF[i].getNum('PR'),
        cl: paesiF[i].getNum('CL'),
        indice: indiceGlobale
      };
      
      barreInOrdine.push(barraDati);
      
      indiceGlobale++;
    }
  }
  
  // LIVELLO 2: Disegna poi tutti i paesi PARZIALMENTE LIBERI (PF)
  if (filtroPF && numPF > 0) {
    let larghezzaTotalePF = numPF * larghezzaBarra;
    let offsetCentraturaPF = (larghezzaTotaleGruppo - larghezzaTotalePF) / 2;
    
    for (let i = 0; i < numPF; i++) {
      let xBarra = xInizioGruppo + offsetCentraturaPF + i * larghezzaBarra;
      
      // Determina l'opacità in base al filtro Countries/Territories E all'hover
      let tipo = paesiPF[i].getString('C/T');
      let opacita = 1;
      
      if (filtroCountries === 'c' && tipo === 't') {
        opacita = 0.2;
      } else if (filtroCountries === 't' && tipo === 'c') {
        opacita = 0.2;
      }
      
      if (indiceHover !== -1 && indiceHover !== indiceGlobale) {
        opacita = 0.2;
      }
      
      disegnaBarraSingola(xBarra, paesiPF[i], larghezzaBarra, opacita);
      
      // Memorizza la posizione completa della barra
      let total = paesiPF[i].getNum('TOTAL');
      let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
      let yCimaBarra = yBarra - altezzaBarra - incremento;
      
      let barraDati = {
        x: xBarra,
        y: yCimaBarra,
        larghezza: larghezzaBarra,
        altezza: altezzaBarra + incremento,
        centroPallinoX: xBarra + larghezzaBarra/2,
        centroPallinoY: yCimaBarra,
        raggio: larghezzaBarra/2,
        nome: paesiPF[i].getString('Country/Territory'),
        score: paesiPF[i].getNum('TOTAL'),
        pr: paesiPF[i].getNum('PR'),
        cl: paesiPF[i].getNum('CL'),
        indice: indiceGlobale
      };
      
      barreInOrdine.push(barraDati);
      
      indiceGlobale++;
    }
  }
  
  // LIVELLO 3: Disegna infine tutti i paesi NON LIBERI (NF)
  if (filtroNF && numNF > 0) {
    let larghezzaTotaleNF = numNF * larghezzaBarra;
    let offsetCentraturaNF = (larghezzaTotaleGruppo - larghezzaTotaleNF) / 2;
    
    for (let i = 0; i < numNF; i++) {
      let xBarra = xInizioGruppo + offsetCentraturaNF + i * larghezzaBarra;
      
      // Determina l'opacità in base al filtro Countries/Territories E all'hover
      let tipo = paesiNF[i].getString('C/T');
      let opacita = 1;
      
      if (filtroCountries === 'c' && tipo === 't') {
        opacita = 0.2;
      } else if (filtroCountries === 't' && tipo === 'c') {
        opacita = 0.2;
      }
      
      if (indiceHover !== -1 && indiceHover !== indiceGlobale) {
        opacita = 0.2;
      }
      
      disegnaBarraSingola(xBarra, paesiNF[i], larghezzaBarra, opacita);
      
      // Memorizza la posizione completa della barra
      let total = paesiNF[i].getNum('TOTAL');
      let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
      let yCimaBarra = yBarra - altezzaBarra - incremento;
      
      let barraDati = {
        x: xBarra,
        y: yCimaBarra,
        larghezza: larghezzaBarra,
        altezza: altezzaBarra + incremento,
        centroPallinoX: xBarra + larghezzaBarra/2,
        centroPallinoY: yCimaBarra,
        raggio: larghezzaBarra/2,
        nome: paesiNF[i].getString('Country/Territory'),
        score: paesiNF[i].getNum('TOTAL'),
        pr: paesiNF[i].getNum('PR'),
        cl: paesiNF[i].getNum('CL'),
        indice: indiceGlobale
      };
      
      barreInOrdine.push(barraDati);
      
      indiceGlobale++;
    }
  }
  
  // Ora che abbiamo tutte le barre nell'ordine di disegno,
  // le copiamo in paesiConPosizioni (saranno controllate in ordine inverso per l'hover)
  paesiConPosizioni = barreInOrdine;
}

// FUNZIONE per disegnare la torcia della regione
function disegnaTorciaRegione() {
  // Parametri dei box
  let boxX = 40; 
  let boxW = graficoWidth * 0.3;
  let boxRightX = graficoWidth - boxX - boxW;
  
  // Calcola lo spazio disponibile tra i box
  let spazioInizioX = boxX + boxW;
  let spazioFineX = boxRightX;
  let spazioLarghezza = spazioFineX - spazioInizioX;
  let centroSpazioX = spazioInizioX + spazioLarghezza / 2;
  
  // Calcola l'altezza disponibile
  let yIniziaTorcia = yBarra;
  let altezzaTorcia = height - yIniziaTorcia;
  
  // Disegna la torcia centrata
  push();
  imageMode(CENTER);
  
  // Usa il numero MASSIMO di paesi nella regione per calcolare la larghezza
  // in modo che rimanga costante attraverso gli anni
  let margine = 60;
  let spazioDisponibile = spazioLarghezza - (margine * 2);
  let larghezzaBarra = max(8, min(20, spazioDisponibile / numMaxPaesiRegione));
  let larghezzaTorcia = numMaxPaesiRegione * larghezzaBarra;
  
  image(torcia, centroSpazioX, yIniziaTorcia + altezzaTorcia/2, larghezzaTorcia, altezzaTorcia);
  
  pop();
}

function disegnaEtichettaAnno() {
  push(); 

  // Imposta lo stile del testo
  fill(bianco);
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

// generare il contenuto HTML dei bottoni Countries e Territories
function aggiornaContenutoBottoniCountriesTerritori() {
  // 1. Conta i paesi (C) e i territori (T)
  let numCountries = 0;
  let numTerritories = 0;
  
  for (let i = 0; i < datiFiltrati.length; i++) {
    let tipo = datiFiltrati[i].getString('C/T');
    if (tipo === 'c') {
      numCountries++;
    } else if (tipo === 't') {
      numTerritories++;
    }
  }

  // Larghezza fissa per i numeri (centrati tra loro)
  let maxNumWidth = '120px'; 
  
  // Colore del testo in base allo stato del filtro
  // Se attivo è nero, se inattivo è bianco
  const colorC = filtroCountries === 'c' ? nero : bianco;
  const colorT = filtroCountries === 't' ? nero : bianco;
  
  // 2. Genera il contenuto HTML per il bottone Countries
  let htmlCountries = `
    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
      <span style="
          color: ${colorC}; 
          font-family: 'NeueHaasGrotDisp-65Medium', sans-serif; 
          font-size: 100px; 
          width: ${maxNumWidth};
          text-align: center;
          padding-right: 15px;
      ">${numCountries}</span>
      <div style="
          display: flex; 
          flex-direction: column;
          color: ${colorC};
          font-family: 'NeueHaasGrotDisp-55Roman', sans-serif;
          font-size: 35px; 
          line-height: 1.2;
          align-items: flex-start;
      ">
          <span style="font-weight: bold;">N°</span>
          <span>Countries</span>
      </div>
    </div>
  `;
  
  // 3. Genera il contenuto HTML per il bottone Territories
  let htmlTerritories = `
    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
      <span style="
          color: ${colorT}; 
          font-family: 'NeueHaasGrotDisp-75Bold', sans-serif; 
          font-size: 100px; 
          width: ${maxNumWidth};
          text-align: center;
          padding-right: 15px;
      ">${numTerritories}</span>
      <div style="
          display: flex; 
          flex-direction: column;
          color: ${colorT};
          font-family: 'NeueHaasGrotDisp-55Roman', sans-serif;
          font-size: 35px; 
          line-height: 1.2;
          align-items: flex-start;
      ">
          <span style="font-weight: bold;">N°</span>
          <span>Territories</span>
      </div>
    </div>
  `;

  // 4. Inietta il contenuto nei bottoni HTML
  bottoneCountries.html(htmlCountries);
  bottoneTerritories.html(htmlTerritories);
}

// disegnare le etichette dei paesi in hover
function disegnaEtichetteHover() {
  if (indiceHover === -1) return;
  
  let paeseHover = paesiConPosizioni.find(p => p.indice === indiceHover);
  if (!paeseHover) return;
  
  push();
  fill(bianco);
  noStroke();
  textSize(20);
  textFont(fontMedium);
  textAlign(LEFT, CENTER);
  
  let offsetX = 15;
  text(paeseHover.nome, paeseHover.centroPallinoX + offsetX, paeseHover.centroPallinoY);
  
  pop();
}

function mouseClicked() {
  // Controlla se il mouse è sopra qualche barra (in ordine inverso)
  for (let i = paesiConPosizioni.length - 1; i >= 0; i--) {
    let barra = paesiConPosizioni[i];
    
    // Controlla se il click è dentro la barra rettangolare
    if (mouseX >= barra.x && 
        mouseX <= barra.x + barra.larghezza &&
        mouseY >= barra.y && 
        mouseY <= yBarra) {
      
      const countryNameEncoded = encodeURIComponent(barra.nome);
      const destinazioneURL = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
      window.location.href = destinazioneURL;
      return;
    }
    
    // Se non è nella barra, controlla il pallino
    let distanza = dist(mouseX, mouseY, barra.centroPallinoX, barra.centroPallinoY);
    if (distanza < barra.raggio + 5) {
      const countryNameEncoded = encodeURIComponent(barra.nome);
      const destinazioneURL = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
      window.location.href = destinazioneURL;
      return;
    }
  }
}

function mouseMoved() {
  // Prima controlla le barre (in ordine inverso per dare priorità alle ultime disegnate)
  let trovato = false;
  
  // Scorri l'array al contrario per dare priorità alle barre in primo piano
  for (let i = paesiConPosizioni.length - 1; i >= 0; i--) {
    let barra = paesiConPosizioni[i];
    
    // Controlla se il mouse è dentro la barra rettangolare
    if (mouseX >= barra.x && 
        mouseX <= barra.x + barra.larghezza &&
        mouseY >= barra.y && 
        mouseY <= yBarra) {
      indiceHover = barra.indice;
      trovato = true;
      cursor(HAND);
      break;
    }
    
    // Se non è nella barra, controlla il pallino in cima
    let distanza = dist(mouseX, mouseY, barra.centroPallinoX, barra.centroPallinoY);
    if (distanza <= barra.raggio) {
      indiceHover = barra.indice;
      trovato = true;
      cursor(HAND);
      break;
    }
  }
  
  if (!trovato) {
    indiceHover = -1;
  }
  
  // Poi controlla le torce (codice esistente)
  let nuovaRegioneHover = null;
  
  for (let area of areeTorce) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      nuovaRegioneHover = area.regione;
      cursor(HAND);
      break;
    }
  }
  
  if (nuovaRegioneHover !== regioneHover) {
    regioneHover = nuovaRegioneHover;
  }
  
  if (regioneHover === null && indiceHover === -1) {
    cursor(ARROW);
  }
}

// NUOVA FUNZIONE per creare il box info paese (Modificata per allineare il fondo)
function creaBoxInfoPaese() {
  // --- Parametri di dimensione e posizione globali ---
  let boxX = 40; 
  let boxW = graficoWidth * 0.3;
  let boxRightX = graficoWidth - boxX - boxW; 
  
  let boxY1 = 150;
  let spacing = 40; // <-- Variabile da unificare se non è globale
  
  // --- Dimensioni dei box a sinistra (per il riferimento di allineamento) ---
  let boxH1 = windowHeight * 0.25; 
  let boxH2 = windowHeight * 0.45; 
  
  // --- Calcolo dell'altezza dei box a destra (che ora usano 'spacing') ---
  // Nota: ho dovuto ricalcolare boxRightH per usare 40 al posto di 20
  let boxRightH = (windowHeight * 0.5 - 2 * spacing) / 3;
  
  // --- Posizione Y di inizio del box a sinistra (riferimento) ---
  // BoxY2 è boxY1 + boxH1 + 40 (che ora è il nostro spacing)
  let boxY2 = boxY1 + boxH1 + spacing; 
  
  // --- Calcoli per il NUOVO box Info Paese ---
  
  // 1. Posizione Y di inizio (sotto Territories)
  let yInizioDestra = boxY1 + boxRightH + spacing + boxRightH + spacing;
  // yInizioDestra = [Inizio] + [H Countries] + [Spacing] + [H Territories] + [Spacing]
  
  // 2. Posizione Y di fine del box a sinistra (il nostro target)
  let yFineSinistra = boxY2 + boxH2; 
  
  // 3. Nuova Altezza del box Info Paese
  let nuovaAltezzaBox = yFineSinistra - yInizioDestra;
  
  // Crea il div
  boxInfoPaese = createDiv('');
  
  // APPLICA LA POSIZIONE E LA DIMENSIONE AGGIORNATE:
  boxInfoPaese.position(boxRightX, yInizioDestra); 
  boxInfoPaese.size(boxW, nuovaAltezzaBox); // Nuova altezza calcolata
  
  // Stile del box (rimane invariato)
  boxInfoPaese.style('border-radius', '30px');
  boxInfoPaese.style('background', nero);
  boxInfoPaese.style('border', '1px solid' + bianco);
  boxInfoPaese.style('display', 'flex');
  boxInfoPaese.style('flex-direction', 'column');
  boxInfoPaese.style('align-items', 'center');
  boxInfoPaese.style('justify-content', 'center');
  boxInfoPaese.style('padding', '10px');
  boxInfoPaese.style('box-sizing', 'border-box'); // Mantiene la dimensione fissa
  boxInfoPaese.style('z-index', '1001');
  boxInfoPaese.style('transition', 'all 0.3s ease');
  
  // Contenuto iniziale (vuoto o con placeholder)
  aggiornaBoxInfoPaese(null);
}

function aggiornaBoxInfoPaese(paeseData) {
  // Colore di sfondo del box
  const COLOR_BACKGROUND = nero; 

  // Colori fissi per PR e CL
  let colorPR = '#E0B8B8'; 
  let colorCL = '#B691C3'; 

  if (!paeseData) {
    // Blocco Placeholder (Nessun Paese Selezionato)
    boxInfoPaese.html(`
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: ${bianco};
        font-family: 'NeueHaasDisplay', sans-serif;
        font-weight: normal;                   
        font-size: 18px;
        opacity: 0.5;
      ">
        <span>Hover over a country</span>
      </div>
    `);
  } else {
    // 1. Recupera i dati e calcola il gradiente
    let prScore = paeseData.pr;
    let clScore = paeseData.cl;
    let totalScore = paeseData.score; 
    
    let prEnd = prScore; 
    let clEnd = prScore + clScore; 

    // Crea il gradiente conico
    let gradient = `conic-gradient(
      ${colorPR} 0% ${prEnd}%,
      ${colorCL} ${prEnd}% ${clEnd}%,
      ${COLOR_BACKGROUND} ${clEnd}% 100%
    )`;
    
    // 2. Genera il contenuto HTML del Paese Selezionato
    boxInfoPaese.html(`
      <div style="
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
      ">
        
        <div style="
          color: ${bianco};
          font-family: 'NeueHaasDisplay', sans-serif;
          font-weight: medium;                    
          font-size: 35px;
          line-height: 1;
          text-align: left;
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
        ">
          ${paeseData.nome}
        </div>
        
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          width: 100%;
          flex: 1;
        ">
          
          <div style="
            width: 180px;
            height: 180px;
            border-radius: 100%;
            background: ${gradient};
            box-shadow: inset 0 0 0 1px #f0f0f01a;
            flex-shrink: 0;
          "></div>
          
          <div style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 5px;
            height: 180px;
          ">
            
            <div style="
              background: ${colorPR};
              border-radius: 15px;
              padding: 3px 30px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="
                color: ${nero};
                font-family: 'NeueHaasDisplay', sans-serif;
                font-weight: medium;                     
                font-size: 14px;
              ">PR</span>
            </div>
            
            <div style="
              background: ${colorCL};
              border-radius: 15px;
              padding: 3px 30px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="
                color: ${nero};
                font-family: 'NeueHaasDisplay', sans-serif; 
                font-weight: medium;                        
                font-size: 14px;
              ">CL</span>
            </div>
            
            <div style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 5px;
              margin-top: 5px;
            ">
              <span style="
                color: ${bianco};
                font-family: 'NeueHaasDisplay', sans-serif; 
                font-weight: normal;                     
                font-size: 16px;
                line-height: 1.1;
              ">TOTAL<br>SCORE</span>
              
              <span style="
                color: ${bianco};
                font-family: 'NeueHaasDisplay', sans-serif; 
                font-weight: medium;                  
                font-size: 90px;
                line-height: 0.8;
              ">${totalScore}</span>
            </div>
          </div>
          
        </div>
      </div>
    `);
  }
}

// Funzione per gestire il click del mouse
function mousePressed() {
  // Controlla se è stato cliccato su una torcia
  for (let area of areeTorce) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      vaiAPaginaRegione(area.regione);
      break;
    }
  }
}

// funzione per creare i bottoni di navigazione in alto a destra
function creaBottoniNavigazione() {
  
  // Calcola il diametro del cerchio in base all'altezza della barra di ricerca
  // L'altezza della barra è data dal padding verticale (20px + 18px) + font-size (20px) + border (2px)
  // Utilizziamo 60px come riferimento di altezza/diametro (circa 20+20+18+2)
  const diametroBottone = 60;
  const raggio = diametroBottone / 2;
  
  // Posizionamento
  // L'area del grafico è graficoWidth, l'area dell'anno è annoWidth
  // Vogliamo posizionarli all'interno dell'area annoWidth o al confine con essa.
  // Usiamo graficoWidth come riferimento iniziale per l'area di destra.
  const margineDestro = 50; 
  const yPos = 30; // Stessa altezza verticale della barra di ricerca
  const spaziaturaTraBottoni = 20;

  // Calcolo della posizione X del secondo bottone (FH)
  let xFH = width - diametroBottone - 25;
  
  // Calcolo della posizione X del primo bottone (US)
  let xUS = xFH - diametroBottone - spaziaturaTraBottoni; 
  
  // --- Bottone Freedom House (FH) ---
  bottoneFH = createButton('FH');
  bottoneFH.position(xFH, yPos);
  
  // Stile del bottone
  bottoneFH.style('width', diametroBottone + 'px');
  bottoneFH.style('height', diametroBottone + 'px');
  bottoneFH.style('border-radius', '50%'); // Rende il bottone circolare
  bottoneFH.style('background-color', nero); 
  bottoneFH.style('color', bianco);
  bottoneFH.style('border', '1px solid' + bianco);
  bottoneFH.style('text-align', 'center');
  bottoneFH.style('line-height', diametroBottone + 'px'); // Centra il testo verticalmente
  bottoneFH.style('font-size', '18px');
  bottoneFH.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottoneFH.style('cursor', 'pointer');
  bottoneFH.style('z-index', '1000');
  
  // Link
  bottoneFH.mousePressed(() => {
    window.location.href = 'freedomhouse.html';
  });
  
  // --- Bottone USA (US) ---
  bottoneUS = createButton('US');
  bottoneUS.position(xUS, yPos);
  
  // Stile del bottone (uguale al precedente)
  bottoneUS.style('width', diametroBottone + 'px');
  bottoneUS.style('height', diametroBottone + 'px');
  bottoneUS.style('border-radius', '50%'); 
  bottoneUS.style('background-color', nero); 
  bottoneUS.style('color', bianco);
  bottoneUS.style('border', '1px solid' + bianco);
  bottoneUS.style('text-align', 'center');
  bottoneUS.style('line-height', diametroBottone + 'px'); 
  bottoneUS.style('font-size', '18px');
  bottoneUS.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottoneUS.style('cursor', 'pointer');
  bottoneUS.style('z-index', '1000');

  // Link
  bottoneUS.mousePressed(() => {
    window.location.href = 'us.html';
  });
}

function creaParagrafiRegioni() {
  paragrafiRegioni = {
    'Africa': {
      2025: "Despite growing geopolitical uncertainties and trade tensions, the region's economy is experiencing moderate growth, driven by declining inflation and improved fiscal and debt positioning. Ethiopia, Rwanda, and Tanzania stand out most prominently. However, there are many countries, fifteen to be exact, experiencing high inflation and interest payments that absorb 30% of government revenues. Political instability in the Horn of Africa is severe, with the harsh conflict in Sudan, Somalia, and Ethiopia. A violent attitude is expanding, and there have been numerous military coups during the year, which have generated significant fragility and concerns.",
      2024: "Africa has seen real GDP in moderate growth, with some national economies particularly brilliant such as Rwanda's, while others remain stagnant. On the political and democratic side, there are mixed dynamics and many cases of internet access blocking used as a control practice in contexts of political or electoral tension. The region has endured many wars and humanitarian crises: in Sudan, with clashes between government forces and militias, in Ethiopia, and in Congo. The number of displaced people that these situations have generated is very high.",
      2023: "Economic growth has been moderate, with real GDP increasing by 3.7%. Some economies in East Africa and certain Saharan states remain among the most dynamic in the world. However, several realities are failing to grow due to inequalities and structural fragilities. The region has seen several coups and military takeovers, such as in Niger and Gabon. Meanwhile, elections in some states, including Madagascar, Nigeria, and Zimbabwe, were characterized by violence, irregularities, and widespread distrust.",
      2022: "Sub-Saharan Africa grew by 3.8%, driven by the recovery of global trade after the 2020 downturn. The clash between Russia and Ukraine led to rising prices for many basic products and services. The region experienced significant political instability, which saw a coup d'état occur in Burkina Faso in January, and suffered from those that had taken place in previous years. The various coups were motivated by the inability of civilian governments to counter the jihadist threat and by growing popular distrust towards democratic institutions.",
      2021: "",
      2020: "",
      2019: "",
      2018: "",
      2017: "",
      2016: "",
      2015: "",
      2014: "",
      2013:"",
    },
    'Americas': {
      2025: "With the protectionist policies of newly elected Donald Trump, real GDP grew by 3.8%, although relations with Canada, Mexico, and China have deteriorated. The Latin American economy appears stable, albeit with some cases of stagnation, such as Colombia or Cuba. The relationship between the two Americas is instead highly precarious, given President Trump's strong opinions and decisions against illegal immigration and the southern part of the continent. Democracy has experienced a decline throughout the region, with authoritarian tendencies, attacks on civil liberties, and organized crime threatening security.",
      2024: "Latin America has experienced a decline on many fronts: weak institutions, growing organized crime, pressure on democracy, and the rule of law. Going against the trend is Venezuela, which has seen modest growth. The United States, however, concluded the year with solid growth, with real GDP increasing by 2.3%, and Donald Trump then won the elections toward the end of the year. In the South, elections and their methods have become less transparent. One case is Venezuela, which saw particular controversies following the elections and restrictions on the media.",
      2023: "Many Latin American economies have slowed down due to high inflation, weak global growth, and the tightening of financial conditions. The region continues to see its democracies under significant pressure, marked by fragile institutions, increasing polarization, and rising organized crime violence. Brazil stands out against this trend, having registered more solid growth and partial political stabilization. The United States ended the year with resilient growth, supported by strong consumption and investment. A growing polarization of public opinion and political thought is being noted.",
      2022: "The region had to contend with the consequences of the Russian invasion of Ukraine, with accumulated inflationary pressures. In the United States, inflation reached 8% and the Federal Reserve had to implement a restrictive monetary policy. Meanwhile, Latin America's growth experienced a slowdown after the previous year's acceleration. In Colombia, Gustavo Petro became the first left-wing president in the country's history to win with 50% of the votes during the June elections. Elections were also held in Brazil, won by Lula da Silva, characterized by violence and strong polarization. These victories occurred within a climate of growing inequality, poverty, and distrust.",
      2021: "",
      2020: "",
      2019: "",
      2018: "",
      2017: "",
      2016: "",
      2015: "",
      2014: "",
      2013:"",
    },
    'Asia': {
      2025: "A general but moderate slowdown in the region's economic growth is being observed. South Asia remains one of the fastest-growing regions, with strong domestic demand accelerating the process. Southeast Asia remains robust along with China. In terms of political relations, a discrete alignment of Japan and Korea toward the Beijing government is noted. The governmental positions of some states remain harsh, such as Myanmar, which still suffers from the 2021 coup, or Cambodia, whose democratic prospects are not hopeful. Japan and Taiwan constitute the only two democracies in the region, while South Korea's democracy, although vigorous, is less liberal.",
      2024: "Asia has registered solid, albeit differentiated, economic growth. China has led the region with exponential growth, and South Asia remains the subregion with the fastest growth rates. There have been several elections: in India, Pakistan, and Indonesia. In Bangladesh, growing authoritarianism led to an absence of opposition candidates. In South Korea, one of the states considered most stable, President Yoon Suk-yeol attempted to impose martial law on December 3rd, resulting in strong popular uprisings.",
      2023: "Economic growth has been robust, driven by India and Southeast Asia, while China has slowed down due to a real estate crisis and weak global demand. Japan and South Korea, conversely, saw moderate growth, hindered by inflation and weakening international relations. Many territorial disputes and strategic rivalries continued to dominate. The civil war in Myanmar was a tragically relevant event that exacerbated the humanitarian crisis and destabilized the area. In several countries, such as Hong Kong and Afghanistan, restrictions on press freedom and the curtailment of civil rights have suffocated the democratic state.",
      2022: "The region experienced uneven economic growth. China maintained moderate growth, slowed by strict 'zero-Covid' policies, while the government continued its strengthening of political control, with pressure on civil society and the media. In India, the economy showed signs of expansion while the political climate remained marked by intercommunal tensions and a progressive centralization of power. In Southeast Asia, countries like Myanmar imposed strict limitations on democratic freedoms. Vietnam and Cambodia, meanwhile, continued along authoritarian lines while recording strong economic growth.",
      2021: "",
      2020: "",
      2019: "",
      2018: "",
      2017: "",
      2016: "",
      2015: "",
      2014: "",
      2013:"",
    },
    'Eurasia': {
      2025: "The conflict between Ukraine and Russia, now in its fourth year, continues to weigh heavily on the region's economy and politics. Russia, although there were hopes with the Trump presidency, continues to be suffocated by sanctions that paralyze the financial sector. Military operations have severely strained the resources of both countries and their positions internationally, Ukraine with the EU and Russia with East Asia. Corruption in both countries is a serious and widespread problem. The extreme situation has made Zelensky's Ukrainian government more open to new options that were unacceptable until the previous year. Noteworthy is the meeting in Alaska between Trump and Putin to discuss a possible peace agreement in the most concrete form since the beginning of the conflict.",
      2024: "The war in Ukraine, now in its third year, has had continuous repercussions on the economy. The Russian economy has had to contend with heavy fiscal restrictions and excessive government spending. The rest of the region has experienced slow growth. Many states continue to have authoritarian governments that restrict communications, rights, and civil liberties. In Russia, sham presidential elections were held in March, where opponents had been approved by the Kremlin and the vote was influenced by military threats.",
      2023: "The year was marked by geopolitical tensions and widespread economic weakness: the conflict between Ukraine and Russia continues to influence the region, blocking trade, investment, and stability. The Russian economy registered slight growth, supported by the war economy. Strong pressure from the West has led the Kremlin to pivot towards Asia and the Middle East. Central Asian republics have benefited significantly from commercial activities and have taken on a growing role in the energy sector. Political tensions and humanitarian crises occurred in Armenia following the recapture of Nagorno-Karabakh.",
      2022: "It was a year marked by the Russian invasion of Ukraine, which destabilized pre-existing political, economic, and security balances. Many countries were damaged by international sanctions against Moscow: disruptions in energy supply chains and rising prices of gas and grain. Democratic space in Russia underwent further restriction through strong repression of opposition and independent media. Ukraine, despite the military offensive, showed strong institutional resilience and a strengthening of democratic sentiment. In the Caucasus, the conflict between Armenia and Azerbaijan remained unstable, with recurring tensions in Nagorno-Karabakh. In Kazakhstan, protests were handled harshly.",
      2021: "",
      2020: "",
      2019: "",
      2018: "",
      2017: "",
      2016: "",
      2015: "",
      2014: "",
      2013:"",
    },
    'Europe': {
      2025: "From an economic perspective, the EU has exceeded expectations in the first months of the year, recording a real GDP growth of 1.4% and declining inflation, albeit slowly. This improvement has been achieved through anticipated exports and investments, which have managed to counter trade tensions with the United States. A general tightening of policies has also been observed, with the advancement of many right-wing parties holding strong nationalist views. An example is Slovakia, which approved a constitutional amendment giving precedence to national law over EU law. This has also affected the state of democracy, with a slowdown in civil liberties and increased pressure on the media.",
      2024: "A modest GDP growth of 1% is recorded, with declining inflation and expansion at a moderate pace. However, economies that are sometimes stagnant, such as Germany's, and ones growing negatively, such as Estonia's, are emerging. A year that saw important elections: in the UK where the left-wing Labour Party won, and in Germany the AfD. Tariffs on Chinese electric vehicles were agreed upon, and the G7 agreed to use proceeds from Russian assets as collateral for loans to Ukraine. Many member states have far-right governments: Croatia, Finland, Italy, and Slovakia. Many of those that remain still have significant right-wing majorities.",
      2023: "A modest economic recovery is being registered, made possible only through a robust labor market, with growing employment and rising average wages. Inflation has begun to decline after peaking in previous years, thanks to falling energy prices and market stabilization. Measures have been approved to digitalize the economy and strengthen the single market, and the commitment to cutting emissions has been affirmed. However, many social fragilities remain unresolved, with many people at risk of poverty who are unable to cope with unforeseen expenses.",
      2022: "The EU had to contend with the consequences of the Russian invasion of Ukraine, with an energy crisis that eroded purchasing power and weighed on production. GDP grew by 2.7% against a backdrop of strong inflation at 8.3%. The atmosphere became more tense, with over two hundred measures taken against the Russian front and the declaration that Hungary could no longer be considered fully democratic. This assertion led to the freezing of EU funds towards it. Elections were also held in Italy, which saw the victory with 44% of the votes of Giorgia Meloni, leader of a far-right party.",
      2021: "",
      2020: "",
      2019: "",
      2018: "",
      2017: "",
      2016: "",
      2015: "",
      2014: "",
      2013:"",
    },
    'Middle East': {
      2025: "The economic outlook in the Middle East is moderately positive, with slight growth trends across North Africa, Afghanistan, and Pakistan, although conflicts, instability, and general displacement remain persistent challenges. The Israeli-Palestinian conflict is a source of great suffering in the region and has caused various tensions with neighboring states as well, such as the relationship between Israel and Iran. In Libya, the government controls the region, albeit with some instability, and is supported by Egypt and the United Arab Emirates. Government pressure on the media and journalists is intense and among the most concerning in the world, and there is no rule of law; rather, many complexities are observed.",
      2024: "Economic growth is slight, albeit present. Egypt's growth was particularly slowed, having suffered significant losses due to reduced traffic through the Suez Canal. The consequences of the painful clash between Israel and Palestine were severe: the war returned to Lebanon, supported by Iran, following an Israeli air offensive. Subsequently, the International Criminal Court issued arrest warrants for Prime Minister Netanyahu and Defense Minister Gallant for war crimes and crimes against humanity committed in the Gaza Strip. In Syria, the Assad regime collapsed.",
      2023: "It has been a year of significant instability, with economic growth slowed by oil production cuts, inflation, and the fragility of global markets. However, the Gulf monarchies demonstrate relative financial stability, resulting in limited progress in diversification. The most important and catastrophic event was the outbreak of the war between Hamas and Israel on October 7th. This event has redefined regional balances and reignited old tensions. Neighboring countries, including Lebanon, Syria, and Egypt, have suffered significant economic and social repercussions. Critical levels of civil liberties and democracy continue to be noted in the region, with authoritarian governments and pressure on media and opposition groups.",
      2022: "The post-pandemic recovery was characterized by rising energy prices, which weighed particularly on the Gulf monarchies. Otherwise, the region experienced persistent political tensions and fragile democracy. In Israel, political instability resulted in new elections and growing polarization. In Iran, protests following the death of Mahsa Amini revealed strong discontent with the regime and its restrictions on civil liberties. In Turkey, meanwhile, the weakening of democratic institutions continued, and Yemen and Syria were afflicted by conflicts and humanitarian crises.",
      2021: "",
      2020: "",
      2019: "",
      2018: "",
      2017: "",
      2016: "",
      2015: "",
      2014: "",
      2013:"",
    },
  };
}

function getParagrafoCorrente() {
  // Controlla se la regione esiste nella struttura
  if (paragrafiRegioni[regioneCorrente]) {
    // Prova a ottenere il paragrafo per l'anno specifico
    if (paragrafiRegioni[regioneCorrente][annoCorrente]) {
      return paragrafiRegioni[regioneCorrente][annoCorrente];
    }
    // Se non esiste l'anno, usa il default
    else if (paragrafiRegioni[regioneCorrente]['default']) {
      return paragrafiRegioni[regioneCorrente]['default'];
    }
  }
  
  // Fallback se la regione non esiste
  return "Freedom in the World is Freedom House's flagship annual report, assessing the condition of political rights and civil liberties around the world.";
}

function disegnaGriglia() {
  const puntiDiRiferimento = [0, 100]; 
  let yPositions = []; // array per salvare le posizioni Y
  
  // 1. Ciclo per disegnare linee e numeri (0 e 100)
  for (let valore of puntiDiRiferimento) {
    let altezzaRelativa = map(valore, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
    let yLinea = yBarra - altezzaRelativa - incremento;
    yPositions.push(yLinea); // salva la posizione Y
    
    // Disegna la linea
    stroke(bianco + 80);
    strokeWeight(1);
    noFill();
    line(graficoWidth*0.38, yLinea, graficoWidth*0.62, yLinea);
    
    // Disegna il valore (0 o 100)
    noStroke();
    fill(bianco + 80); 
    textAlign(RIGHT, CENTER);
    textSize(12);
    text(valore, graficoWidth*0.37, yLinea);
  }

  // 2. Disegna la scritta "Total Score" SOLO sopra la linea del 100
  // Assumiamo che 100 sia il secondo elemento nell'array puntiDiRiferimento,
  // quindi la sua posizione Y è yPositions[1].
  
  // Se l'array ha almeno due elementi e 100 è il secondo punto di riferimento
  if (yPositions.length > 1 && puntiDiRiferimento[1] === 100) {
    const yLinea100 = yPositions[1]; // Posizione Y della linea del 100
    
    push();
    fill(bianco + 80);
    textSize(16);
    // Posiziona il testo poco sopra la linea del 100
    translate(graficoWidth*0.38, yLinea100 - 5); 
    textAlign(LEFT, BOTTOM);
    text("Total Score", 0, 0);
    pop();
  }
}

// NUOVA FUNZIONE per creare il bottone "Torna Indietro"
function creaBottoneBack() {
  const diametroBottone = 60; // Stesso diametro dei bottoni US e FH
  const xPos = 40; // Allineato a sinistra
  const yPos = 40; // Stessa altezza del titolo regioneCorrente
  
  bottoneBack = createButton('←');
  bottoneBack.position(xPos, yPos);
  
  // Stile del bottone circolare (come US e FH)
  bottoneBack.style('width', diametroBottone + 'px');
  bottoneBack.style('height', diametroBottone + 'px');
  bottoneBack.style('border-radius', '50%'); // Rende il bottone circolare
  bottoneBack.style('background-color', nero);
  bottoneBack.style('color', bianco);
  bottoneBack.style('border', '1px solid' + bianco);
  bottoneBack.style('text-align', 'center');
  bottoneBack.style('line-height', diametroBottone + 'px'); // Centra la freccia verticalmente
  bottoneBack.style('font-size', '24px'); // Dimensione della freccia
  bottoneBack.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottoneBack.style('cursor', 'pointer');
  bottoneBack.style('z-index', '1002');
  bottoneBack.style('padding', '0'); // Rimuove padding per centrare meglio

  // Funzione per tornare alla pagina precedente nella cronologia del browser
  bottoneBack.mousePressed(() => {
    window.history.back();
  });
}