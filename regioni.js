// variabili globali
let data;
let torcia;
let iconaUs;
let iconaFh;
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
let numMaxPaesiRegione = 0; // numero massimo di paesi nella regione attraverso tutti gli anni

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
let paesiUniciGlobali = [];
let paesiRegioneCorrente = []
let suggerimentoSelezionato = -1;

// variabili per i nuovi bottoni in alto a destra
let bottoneUS;
let bottoneFH;
let bottoneBack; // bottone per tornare indietro
let tooltipUS;
let tooltipFH;

// Aggiungi dopo le altre variabili globali
let paragrafiRegioni;

// scroll
let scrollAccumulato = 0;
let pixelPerAnno = 200; // Quanti pixel di scroll per cambiare anno
let progressoScroll = 0; // Valore da 0 a 1 per l'animazione tra anni

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
  // font
  fontRegular = loadFont("font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("font/NeueHaasDisplayBold.ttf");
  // icone
  iconaUs = loadImage("img/icone/us-bianco.png");
  iconaFh = loadImage("img/icone/fh-bianco.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;
  
  altezzaMassimaBarra = windowHeight * 0.6; 
  yBarra = windowHeight * 0.72; 
  
  // Recupera la regione dall'URL
  const urlParams = new URLSearchParams(window.location.search);
  let regionFromURL = urlParams.get('region');
  
  if (regionFromURL) {
    regioneCorrente = decodeURIComponent(regionFromURL);
  } else {
    regioneCorrente = 'Regione non trovata';
  }
  
  // Trova tutti gli anni unici
  let anni = data.getColumn('Edition').map(Number); 
  let anniUnici = [...new Set(anni)].sort((a, b) => b - a); 
  
  // RIMUOVI TUTTO IL CODICE DEL SELETTORE ANNO (createSelect, position, style, ecc.)
  // E usa invece:
  
  // Recupera l'anno dall'URL se presente, altrimenti usa il più recente
  let annoFromURL = urlParams.get('year');
  
  if (annoFromURL && !isNaN(parseInt(annoFromURL))) {
    annoCorrente = parseInt(annoFromURL);
  } else if (anniUnici.length > 0 && !isNaN(anniUnici[0])) {
    annoCorrente = anniUnici[0]; 
  } else {
    annoCorrente = null;
  }

  // Filtra e calcola i dati iniziali
  filtraECalcolaDati(annoCorrente);
  
  calcolaNumMaxPaesiRegione();
  estraiPaesiRegioneCorrente();
  
  creaBottoniFiltro();
  creaBottoneBack();
  creaBottoniCountriesTerritori();
  aggiornaContenutoBottoniCountriesTerritori();
  creaBoxInfoPaese();
  creaBarraRicerca();
  creaBottoniNavigazione();
  creaParagrafiRegioni();
}

// Funzione modificata per estrarre solo i paesi della regione corrente
function estraiPaesiRegioneCorrente() {
  // 1. Filtra l'intera tabella 'data' per la regione corrente
  let righeRegione = data.getRows().filter(r => r.getString('Region') === regioneCorrente);
  
  // 2. Estrai i nomi di paesi/territori unici da queste righe
  let paesi = righeRegione.map(r => r.getString('Country/Territory'));
  
  // 3. Rimuovi i duplicati e ordina
  paesiRegioneCorrente = [...new Set(paesi)].sort();
}

// FUNZIONE MODIFICATA PER MIGLIORE VISIBILITÀ E POSIZIONAMENTO
function creaBarraRicerca() {
  const larghezzaBarra = graficoWidth * 0.3;
  
  // Container principale per la ricerca
  let containerRicerca = createDiv();
  
  // CENTRAGGIO DELLA BARRA SOPRA IL GRAFICO (circa)
  let xPos = graficoWidth *0.67;
  let yPos = 40; 
  
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

// funzione per mostrare i suggerimenti (MODIFICATA)
function mostraSuggerimenti() {
  let query = inputRicerca.value().toLowerCase().trim();
  suggerimentiDiv.html('');
  suggerimentoSelezionato = -1;
  
  if (query === '') {
    suggerimentiDiv.style('display', 'none');
    return;
  }
  
  // 🎯 UTILIZZA paesiRegioneCorrente INVECE DI paesiUnici GLOBALE
  // Ciò assicura che vengano visualizzati solo i paesi della regione corrente.
  let paesiSorgente = paesiRegioneCorrente; 
  
  // Filtra i paesi che INIZIANO con la query
  let paesiFiltrati = paesiSorgente.filter(paese => 
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

function calcolaNumMaxPaesiRegione() {
  numMaxPaesiRegione = 0; // Importante resettare se fosse chiamata più volte
  
  // 1. Filtra l'intera tabella 'data' (tutti gli anni) solo per la regione corrente
  let righeRegione = data.getRows().filter(r => r.getString('Region') === regioneCorrente);
  
  if (righeRegione.length === 0) {
    return;
  }
  
  // 2. Trova tutti gli anni unici presenti in questa regione
  let anniRegione = [...new Set(righeRegione.map(r => r.getString('Edition')))];
  
  // 3. Calcola il conteggio massimo di paesi in un singolo anno per questa regione
  let maxConteggio = 0;
  
  for (let anno of anniRegione) {
    // Conta quanti paesi ci sono in quell'anno specifico e regione
    let conteggioAnno = righeRegione.filter(r => r.getString('Edition') === anno).length;
    
    if (conteggioAnno > maxConteggio) {
      maxConteggio = conteggioAnno;
    }
  }
  
  // 4. Imposta la variabile globale
  numMaxPaesiRegione = maxConteggio;
  
  // *** DEBUGGING AGGIUNTIVO ***
  console.log(`Regione: ${regioneCorrente}, Max Paesi Trovati: ${numMaxPaesiRegione}`);
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

// NUOVA FUNZIONE per creare i bottoni filtro dentro il box (ALLINEAMENTO AL BORDO DESTRO DEL BOX TESTO)
function creaBottoniFiltro() {
  // --- Variabili di Layout ---
  
  const distanzaDalFondo = 100; 
  const margineInternoX = 0; 
  const distanzaTraBottoni = 40; 
  const altezzaBottone = 35; // Altezza stimata per il calcolo Y
  
  // *** Variabili geometriche necessarie (da definire globalmente o ricalcolare) ***
  // Posizione X del bordo sinistro del box di testo (assumiamo 40, come bottoneBack)
  const boxX = 40; 
  // Larghezza del box di testo (assumiamo 30% del grafico come riferimento)
  const boxW = graficoWidth * 0.3; 
  
  // 1. Calcolo la posizione X del BORDO DESTRO DEL CONTENITORE SUPERIORE
  const xBordoDestroContenitore = boxX + boxW;
  
  // 2. Calcolo la posizione X del BORDO DESTRO DESIDERATO per i bottoni
  // Sottraiamo il margine interno
  const xBordoDestro = xBordoDestroContenitore - margineInternoX; 
  
  
  // --- Calcolo della Posizione Y (Dal Basso) ---
  let yFondo = windowHeight - distanzaDalFondo;
  let yBottoneNF = yFondo - altezzaBottone;
  let yBottonePF = yBottoneNF - distanzaTraBottoni;
  let yBottoneF = yBottonePF - distanzaTraBottoni;

  // --- 3. Creazione dei Bottoni ---
  bottoneF = creaBottone('FREE', 0, 0, coloriStatus['F'], 'F'); 
  bottonePF = creaBottone('PARTIALLY FREE', 0, 0, coloriStatus['PF'], 'PF');
  bottoneNF = creaBottone('NOT FREE', 0, 0, coloriStatus['NF'], 'NF');
  
  
  // --- 4. Posizionamento Finale (Allineamento a Destra del Box Testo) ---
  
  // Calcolo per il bottone FREE:
  // Posizione X = Bordo destro desiderato - Larghezza effettiva del bottone
  let xBottoneF = xBordoDestro - bottoneF.size().width;
  bottoneF.position(xBottoneF, yBottoneF);
  
  // Calcolo per il bottone PARTIALLY FREE:
  let xBottonePF = xBordoDestro - bottonePF.size().width;
  bottonePF.position(xBottonePF, yBottonePF);
  
  // Calcolo per il bottone NOT FREE:
  let xBottoneNF = xBordoDestro - bottoneNF.size().width;
  bottoneNF.position(xBottoneNF, yBottoneNF);
}

// NUOVA FUNZIONE per creare i bottoni filtro Countries/Territories
function creaBottoniCountriesTerritori() {
  // Parametri dei box
  let boxX = 40; 
  let boxW = graficoWidth * 0.3;
  let boxRightX = graficoWidth - boxX - boxW;
  let boxY1 = 142;
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
  textFont(fontMedium);
  textAlign(LEFT, TOP);

  let dimensioneBase = 75;
  let dimensioneSpeciale = 62;

    if (regioneCorrente === 'Middle East') {
    textSize(dimensioneSpeciale);
      text(regioneCorrente, 120, 45); 
  } else {
    textSize(dimensioneBase);
    text(regioneCorrente, 120, 38); 
  }
  pop();
}

function drawBoxes() {
  // BOX A SINISTRA 
  let boxX = 40; 
  let boxW = graficoWidth * 0.3;
  
  // Posizionamento in verticale - BOX TESTO SOPRA
  let boxY1 = 150; // Subito sotto il titolo
  
  // Stile box
  strokeWeight(1);
  stroke(bianco);
  fill(nero);
  let radius = 30;
  
  // CALCOLA L'ALTEZZA DEL TESTO
  push();
  textSize(16);
  textFont(fontRegular);
  textLeading(20);
  
  // Ottieni il paragrafo corretto per regione e anno
  let paragrafo = getParagrafoCorrente();
  
  // Margini interni al box
  let padding = 30;
  let testoLarghezza = boxW - (padding * 2);
  
  // Crea un elemento di testo temporaneo per calcolare l'altezza
  let righe = paragrafo.split(' ');
  let linea = '';
  let lineCount = 0;
  
  for (let i = 0; i < righe.length; i++) {
    let testLinea = linea + righe[i] + ' ';
    let larghezzaTest = textWidth(testLinea);
    
    if (larghezzaTest > testoLarghezza && i > 0) {
      lineCount++;
      linea = righe[i] + ' ';
    } else {
      linea = testLinea;
    }
  }
  lineCount++; // Aggiungi l'ultima riga
  
  // Calcola l'altezza necessaria basata sul numero di righe
  let altezzaTesto = lineCount * 20; // 20 è il textLeading
  let boxTestoH = altezzaTesto + (padding * 2); // Aggiungi padding sopra e sotto
  
  pop();
  
  // Disegna il box del testo con altezza dinamica
  rect(boxX, boxY1, boxW, boxTestoH, radius);
  
  // DISEGNA IL TESTO NEL BOX
  push();
  fill(bianco);
  noStroke();
  textSize(16);
  textFont(fontRegular);
  textAlign(LEFT, TOP);
  textLeading(20);
  
  let testoX = boxX + padding;
  let testoY = boxY1 + padding;
  
  text(paragrafo, testoX, testoY, testoLarghezza);
  pop();
  
  // SECONDO BOX A SINISTRA (bottoni filtro status)
  let boxY2 = boxY1 + boxTestoH + 40; // Sotto il box del testo
  let boxH2 = windowHeight * 0.25;
  
  // BOX A DESTRA 
  let boxRightX = graficoWidth - boxX - boxW;
  
  let totalHeightLeft = boxTestoH + 40 + boxH2;
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
  
  if (regioneCorrente === 'Africa') {
     image(torcia, centroSpazioX, yIniziaTorcia + altezzaTorcia/2, larghezzaTorcia*0.8, altezzaTorcia);
  } else {
      image(torcia, centroSpazioX, yIniziaTorcia + altezzaTorcia/2, larghezzaTorcia, altezzaTorcia);
  }
  
  pop();
}

function disegnaEtichettaAnno() {
  push(); 

  noStroke();
  textFont(fontRegular); 
  textAlign(CENTER, CENTER);
  
  // Ottieni gli anni unici
  let anni = data.getColumn('Edition').map(Number); 
  let anniUnici = [...new Set(anni)].sort((a, b) => b - a);
  
  // Calcolo della posizione base
  let xPos = graficoWidth + (annoWidth / 2); 
  let yPos = height / 2;
  
  translate(xPos, yPos);
  rotate(PI / 2 * 3); 
  
  const spaziaturaFissaX = 400; 
  let offsetGlobaleX = map(progressoScroll, 0, 1, 0, spaziaturaFissaX);
  
  // Calcola l'indice dell'anno corrente
  let indiceCorrente = anniUnici.indexOf(annoCorrente);
  
  // ANNO PRECEDENTE
  if (indiceCorrente > 0) {
    let annoPrecedente = anniUnici[indiceCorrente - 1];
    let baseXPrecedente = spaziaturaFissaX; 
    let finalXPrecedente = baseXPrecedente + offsetGlobaleX;
    
    let dimensionePrecedente = map(progressoScroll, 0, 1, annoWidth * 0.9, annoWidth * 0.7);
    let opacitaPrecedente = map(progressoScroll, 0, 1, 100, 70);
    
    fill(bianco + hex(floor(opacitaPrecedente), 2));
    textSize(dimensionePrecedente);
    text(annoPrecedente, finalXPrecedente, -30);
  }
  
  // ANNO CORRENTE
  let baseXCorrente = 0;
  let finalXCorrente = baseXCorrente + offsetGlobaleX;

  let dimensioneCorrente = map(progressoScroll, 0, 1, annoWidth * 1.3, annoWidth * 0.9);
  let opacitaCorrente = map(progressoScroll, 0, 1, 255, 100);
  
  fill(bianco + hex(floor(opacitaCorrente), 2));
  textSize(dimensioneCorrente);
  text(annoCorrente, finalXCorrente, -30);
  
  // ANNO SUCCESSIVO
  if (indiceCorrente < anniUnici.length - 1) {
    let annoSuccessivo = anniUnici[indiceCorrente + 1];
    let baseXSuccessivo = -spaziaturaFissaX;
    let finalXSuccessivo = baseXSuccessivo + offsetGlobaleX;
    
    let dimensioneSuccessivo = map(progressoScroll, 0, 1, annoWidth * 0.7, annoWidth * 1.3); 
    let opacitaSuccessivo = map(progressoScroll, 0, 1, 70, 100);  

    fill(bianco + hex(floor(opacitaSuccessivo), 2));
    textSize(dimensioneSuccessivo);
    text(annoSuccessivo, finalXSuccessivo, -30);
  }

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
  const diametroBottone = 60;
  const raggio = diametroBottone / 2;
  
  // Posizionamento
  const margineDestro = 25; // Margine dal bordo destro
  const margineSinistro = 30; // Margine dal bordo sinistro
  const yPos = 40; // Stessa altezza verticale della barra di ricerca
  const spaziaturaTraBottoni = 20;

  // Variabile per la posizione Y comune dei tooltip (5px sotto il bottone)
  const yTooltip = yPos + diametroBottone + 10; 

  const biancoOpaco = 'rgba(234, 234, 216, 0.8)';
  
  // --- Stili CSS comuni per tutti i tooltip (AGGIORNATO BORDER-RADIUS) ---
  const stileTooltip = {
    'position': 'absolute',
    'background-color': biancoOpaco,
    'color': nero,
    'padding': '5px 10px 3px 10px',
    'border-radius': '15px', 
    'font-size': '14px',
    'font-family': 'NeueHaasDisplay, sans-serif', 
    'font-weight': 'normal',
    'white-space': 'nowrap',
    'z-index': '1003',
    'display': 'none' // Nascosto di default
  };

// --- 2. Bottone FH (Freedom House) ---

  let xFH = width - diametroBottone - margineDestro; 
  bottoneFH = createButton(''); // Rimosso 'FH'
  bottoneFH.position(xFH, yPos);
  
  // *** INSERIMENTO DELL'IMMAGINE FH ***
  // Trasforma l'oggetto p5.Image in una stringa base64 per usarlo nel tag <img>
  const immagineFH = iconaFh.canvas.toDataURL();
  bottoneFH.html(`<img src="${immagineFH}" alt="FH" style="width: 80%; height: 80%; object-fit: contain;">`); // Dimensioni 70% per un look più pulito

  // Stili del bottone (adattati per l'immagine)
  bottoneFH.style('width', diametroBottone + 'px');
  bottoneFH.style('height', diametroBottone + 'px');
  bottoneFH.style('border-radius', '50%'); 
  bottoneFH.style('background-color', nero); 
  bottoneFH.style('border', '1px solid' + bianco);
  bottoneFH.style('cursor', 'pointer');
  bottoneFH.style('z-index', '1000');
  bottoneFH.style('padding', '0');
  // Aggiunti per centrare l'immagine
  bottoneFH.style('display', 'flex'); 
  bottoneFH.style('align-items', 'center'); 
  bottoneFH.style('justify-content', 'center'); 
  
  // --- CREAZIONE TOOLTIP FH ---
  tooltipFH = createDiv('About FreedomHouse');
  for (let key in stileTooltip) {
    tooltipFH.style(key, stileTooltip[key]);
  }

  // --- GESTIONE HOVER FH (ALLINEATO A DESTRA) ---
  bottoneFH.mouseOver(() => {
      tooltipFH.style('display', 'block');
      let larghezzaTooltip = tooltipFH.elt.offsetWidth;
      
      // Posizione X: Bordo destro del bottone - Larghezza del tooltip
      let xAllineatoDestra = xFH + diametroBottone - larghezzaTooltip; 
      tooltipFH.position(xAllineatoDestra, yTooltip);
  });

  bottoneFH.mouseOut(() => {
      tooltipFH.style('display', 'none');
  });

  // Link
  bottoneFH.mousePressed(() => {
    window.location.href = 'freedomhouse.html';
  });
  
  // --- 3. Bottone ABOUT US
  
  let xUS = xFH - diametroBottone - spaziaturaTraBottoni; 
  bottoneUS = createButton('');
  bottoneUS.position(xUS, yPos);
  
  // *** INSERIMENTO DELL'IMMAGINE US ***
  // Trasforma l'oggetto p5.Image in una stringa base64 per usarlo nel tag <img>
  const immagineUS = iconaUs.canvas.toDataURL();
  bottoneUS.html(`<img src="${immagineUS}" alt="US" style="width: 80%; height: 80%; object-fit: contain;">`); // Dimensioni 70% per un look più pulito

  // Stili del bottone (adattati per l'immagine)
  bottoneUS.style('width', diametroBottone + 'px');
  bottoneUS.style('height', diametroBottone + 'px');
  bottoneUS.style('border-radius', '50%'); 
  bottoneUS.style('background-color', nero);
  bottoneUS.style('border', '1px solid' + bianco);
  bottoneUS.style('cursor', 'pointer');
  bottoneUS.style('z-index', '1000');
  bottoneUS.style('padding', '0');
  // Aggiunti per centrare l'immagine
  bottoneUS.style('display', 'flex'); 
  bottoneUS.style('align-items', 'center'); 
  bottoneUS.style('justify-content', 'center'); 
  
  // --- CREAZIONE TOOLTIP US ---
  tooltipUS = createDiv('About Us');
  for (let key in stileTooltip) {
    tooltipUS.style(key, stileTooltip[key]);
  }

  // --- GESTIONE HOVER US (CENTRATO) ---
  bottoneUS.mouseOver(() => {
      tooltipUS.style('display', 'block');
      let larghezzaTooltip = tooltipUS.elt.offsetWidth;
      // Posizione X: Inizio bottone + metà bottone - metà tooltip
      tooltipUS.position(xUS + diametroBottone / 2 - larghezzaTooltip / 2, yTooltip);
  });

  bottoneUS.mouseOut(() => {
      tooltipUS.style('display', 'none');
  });

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
      2021: "The economic trend was undoubtedly complex and uneven, still recovering from the pandemic, but it nonetheless showed signs of recovery: an increase in the prices of raw materials such as oil, gas, and copper. This condition particularly favored exporting states like Nigeria, Angola, and Congo. The region experienced a highly unstable political situation that saw numerous coups d'état. In Mali, the transitional government was overthrown again by the military, followed by similar events in Guinea and Sudan. Tunisia also saw several upheavals, despite being considered a rare example of democracy in the Arab-African world for years.",
      2020: "Due to the pandemic, the continent suffered a sharp economic slowdown, with severe declines in key sectors such as tourism, trade, and remittances. Falling oil prices hit exporting countries like Nigeria and Angola hard. Politically, the continent saw a general institutional tightening: several governments used the health emergency to limit protests and civil liberties. In Ethiopia, the postponement of elections and the escalation of the Tigray conflict led to a deterioration of democracy in the state. In Tanzania and Uganda, elections were held in a climate of low transparency and strong pressure on the opposition.",
      2019: "The region began the year with popular uprisings in Algeria and Sudan, leading to the resignations of President Bouteflika and the overthrow of al-Bashir. In August, the African Continental Free Trade Area came into effect, aiming to eliminate trade barriers and create the largest free-trade area. Ethiopian Prime Minister Abiy Ahmed received the Nobel Peace Prize for resolving the twenty-year border conflict with Eritrea. Elections in Nigeria, South Africa, and other countries provided democratic opportunities, but persistent issues of corruption, inequality, and weak governance limited civil liberties and institutional effectiveness.",
      2018: "The economy was supported by a recovery in commodity prices and new investments, but hampered by political instability, structural inequalities, and vulnerability to external shocks. Politically, the continent experienced significant tensions: in the Democratic Republic of Congo, presidential elections were postponed, raising doubts about democratic transparency, while conflicts and repression continued in Cameroon and South Sudan. A positive signal came from Ethiopia, where Prime Minister Abiy Ahmed implemented reforms, released political prisoners, and opened dialogue with Eritrea. However, in many countries restrictions on media and opposition increased.",
      2017: "The region recorded moderate economic growth, supported by recovering commodity prices but still uneven across different areas. Politically, many countries showed authoritarian tightening, with contested elections and repression of the opposition, as in Kenya and Cameroon. Conflicts continued in South Sudan and Libya, undermining institutional stability. A positive signal came from Zimbabwe with the end of Mugabe’s regime, although without immediate democratic progress. Overall, civil liberties and political participation remained fragile.",
      2016: "Africa recorded weak economic growth due to falling commodity prices, with many countries forced to implement spending cuts and fiscal reforms. Politically, in Gambia, President Jammeh initially refused to accept electoral defeat, triggering an institutional crisis resolved through regional pressure. In South Sudan, the civil war continued, worsening the humanitarian crisis, while in Zimbabwe, Mugabe consolidated power despite growing internal tensions. Several countries saw attempts to amend constitutions to extend presidential terms, and repression of opposition and independent media increased in nations such as Ethiopia and Burundi.",
      2015: "The region experienced significant economic slowdown caused by the collapse of commodity prices, severely affecting oil- and mineral-dependent economies such as Nigeria and Angola. Politically, Nigeria witnessed a historic democratic transition with the election of Muhammadu Buhari, while continuing to combat Boko Haram in the northeast. In Burundi, President Nkurunziza’s decision to run for a third term sparked violence and a failed coup attempt, causing a refugee exodus. In South Sudan, the civil war continued, worsening the humanitarian crisis, and several countries saw attempts to extend presidential terms through controversial constitutional amendments accompanied by repression of opposition.",
      2014: "Africa recorded slowed economic growth due to falling commodity prices, while the Ebola epidemic in West Africa devastated Guinea, Liberia, and Sierra Leone, causing thousands of deaths and damaging local economies. Politically, in Nigeria, Boko Haram intensified terrorist attacks, including the kidnapping of over 270 schoolgirls in Chibok, while the government faced criticism for ineffective crisis management. In Burkina Faso, a popular uprising overthrew President Compaoré after 27 years in power, marking a rare successful civil mobilization. In South Africa, elections confirmed the ANC in power but with growing discontent over corruption and inequalities under President Zuma. In several countries, repression against opposition and attempts to extend presidential terms through controversial constitutional amendments continued.",
      2013: "During the year, Africa registered sustained economic growth driven by investments in infrastructure and natural resources, but with persistent inequalities and vulnerability to external shocks. Politically, in Kenya elections brought victory to Uhuru Kenyatta despite being indicted by the International Criminal Court, while the terrorist attack on Nairobi's Westgate shopping mall caused over 60 casualties. In Mali, a French military intervention repelled jihadists who controlled the north of the country, allowing elections and a gradual return to stability. In Zimbabwe, Mugabe was re-elected in elections considered fraudulent by the opposition and international observers, further consolidating his power after 33 years. In the Central African Republic, a violent crisis erupted with sectarian clashes between Seleka and anti-Balaka groups that caused thousands of deaths and massive displacements.",
    },
    'Americas': {
      2025: "With the protectionist policies of newly elected Donald Trump, real GDP grew by 3.8%, although relations with Canada, Mexico, and China have deteriorated. The Latin American economy appears stable, albeit with some cases of stagnation, such as Colombia or Cuba. The relationship between the two Americas is instead highly precarious, given President Trump's strong opinions and decisions against illegal immigration and the southern part of the continent. Democracy has experienced a decline throughout the region, with authoritarian tendencies, attacks on civil liberties, and organized crime threatening security.",
      2024: "Latin America has experienced a decline on many fronts: weak institutions, growing organized crime, pressure on democracy, and the rule of law. Going against the trend is Venezuela, which has seen modest growth. The United States, however, concluded the year with solid growth, with real GDP increasing by 2.3%, and Donald Trump then won the elections toward the end of the year. In the South, elections and their methods have become less transparent. One case is Venezuela, which saw particular controversies following the elections and restrictions on the media.",
      2023: "Many Latin American economies have slowed down due to high inflation, weak global growth, and the tightening of financial conditions. The region continues to see its democracies under significant pressure, marked by fragile institutions, increasing polarization, and rising organized crime violence. Brazil stands out against this trend, having registered more solid growth and partial political stabilization. The United States ended the year with resilient growth, supported by strong consumption and investment. A growing polarization of public opinion and political thought is being noted.",
      2022: "The region had to contend with the consequences of the Russian invasion of Ukraine, with accumulated inflationary pressures. In the United States, inflation reached 8% and the Federal Reserve had to implement a restrictive monetary policy. Meanwhile, Latin America's growth experienced a slowdown after the previous year's acceleration. In Colombia, Gustavo Petro became the first left-wing president in the country's history to win with 50% of the votes during the June elections. Elections were also held in Brazil, won by Lula da Silva, characterized by violence and strong polarization. These victories occurred within a climate of growing inequality, poverty, and distrust.",
      2021: "In Latin America, there was a modest post-pandemic economic recovery, but persistent structural challenges remain regarding the rising unemployment rate and the levels of poverty and inequality. On January 6th, the attack on the Capitol in Washington D.C. took place by supporters of Donald Trump, two months after the presidential elections that saw his rival, Joe Biden, win. In Brazil, there were several protests against the far-right administration of Bolsonaro. He was criticized for underestimating the pandemic, which caused the highest number of losses in the country worldwide.",
      2020: "The region experienced a sharp economic recession: Latin America’s GDP hit historic lows due to widespread business closures, the collapse of tourism, and falling demand for raw materials. Argentina and Brazil faced high public debt and inflation. Even the northern part of the region, including the United States, experienced economic contraction, followed by fiscal and monetary interventions. These conditions increased poverty rates, generating widespread hardship and political radicalization. Additionally, in the United States, the tragic killing of George Floyd brought attention to the issue of racial discrimination.",
      2019: "The US economy avoided recession for the entire decade, reaching historically low unemployment rates. However, trade tensions with China caused significant slowdowns with global repercussions. In December, President Trump was impeached by the House of Representatives. Latin America experienced massive protests: in Chile, a subway fare increase triggered violent demonstrations; in Ecuador and Colombia, there was dissent against austerity and corruption policies. In Brazil, Amazon wildfires reached record levels, causing widespread disruption.",
      2018: "The Americas experienced uneven economic growth: the United States benefited from expansionary fiscal policies, while Latin America registered a weak and fragmented recovery, with trade tensions under the Trump administration adding to uncertainty. Politically, the continent was marked by the rise of populist and polarizing leaderships: Bolsonaro in Brazil pushed an authoritarian right-wing turn, López Obrador in Mexico broke with traditional elites, and Maduro in Venezuela worsened the crisis with a reelection considered illegitimate by the international community.",
      2017: "The Americas saw uneven economic recovery: the United States experienced moderate growth and low unemployment, while Latin America showed signs of emerging from recession but with variable performance. Politically, in Venezuela, Maduro convened a controversial Constituent Assembly, worsening the crisis and triggering a massive migration exodus, while in Brazil, the Lava Jato investigations shook the political class, resulting in the conviction of former President Lula. In the United States, Trump took a protectionist turn, threatening agreements such as NAFTA. In several Latin American countries, tensions emerged between executive and judicial powers, with increasing pressure on media and civil society.",
      2016: "Moderate and uneven economic growth was recorded, with the United States recovering after the 2008 crisis and Latin America still slowed by falling commodity prices. Politically, Donald Trump’s election in the US marked a populist shift with strong nationalist tones and institutional tensions. In Brazil, the political crisis and the Petrobras scandal continued to undermine trust in institutions. In Venezuela, the economic and social situation worsened, aggravating political instability. The continent showed increasing polarization and a general weakening of civil liberties and democratic quality in several countries.",
      2015: "The Americas showed slowed economic growth, with the United States experiencing moderate recovery while Latin America faced recession, particularly in Brazil, hit by political crises and corruption. Politically, the US and Cuba restored diplomatic relations after more than fifty years, marking a historic shift in hemispheric relations. In Venezuela, the economic crisis worsened as the opposition won parliamentary elections, triggering an institutional confrontation with Maduro. In Brazil, the Lava Jato scandal overwhelmed President Dilma Rousseff and much of the political class, while in Argentina, Mauricio Macri’s election marked the end of the Kirchner era with a liberal shift.",
      2014: "The Americas experienced moderate economic growth, with the United States in steady recovery while Latin America slowed, particularly Brazil and Argentina, affected by inflation and deficits. Politically, in the United States, the midterm elections gave Congress to the Republicans, increasing legislative gridlock under Obama. In Venezuela, the economic crisis worsened with mass protests against Maduro, leading to violent repression and arrests of opposition leaders. In Mexico, the disappearance of 43 students in Ayotzinapa sparked national outrage, highlighting links between organized crime, corruption, and state institutions. In Brazil, Dilma Rousseff was narrowly re-elected amid growing polarization, while the first Petrobras scandals began to shake Brazilian politics.",
      2013: "During the year, they registered moderate economic growth, with the United States in gradual recovery while Latin America showed a slowdown, particularly in Brazil where mass protests challenged public spending and corruption. Politically, in Venezuela the death of Hugo Chávez led to the contested election of Nicolás Maduro amid growing polarization and economic deterioration. In the United States, the scandal of Edward Snowden's revelations about NSA mass surveillance shook the debate on privacy and national security, damaging relations with European and Latin American allies. In Brazil, over one million people took to the streets during the June protests against corruption, public transport, and spending on the World Cup, marking a turning point in the country's politics. In Mexico, new president Peña Nieto launched ambitious economic reforms but drug trafficking-related violence remained high.",
    },
    'Asia': {
      2025: "A general but moderate slowdown in the region's economic growth is being observed. South Asia remains one of the fastest-growing regions, with strong domestic demand accelerating the process. Southeast Asia remains robust along with China. In terms of political relations, a discrete alignment of Japan and Korea toward the Beijing government is noted. The governmental positions of some states remain harsh, such as Myanmar, which still suffers from the 2021 coup, or Cambodia, whose democratic prospects are not hopeful. Japan and Taiwan constitute the only two democracies in the region, while South Korea's democracy, although vigorous, is less liberal.",
      2024: "Asia has registered solid, albeit differentiated, economic growth. China has led the region with exponential growth, and South Asia remains the subregion with the fastest growth rates. There have been several elections: in India, Pakistan, and Indonesia. In Bangladesh, growing authoritarianism led to an absence of opposition candidates. In South Korea, one of the states considered most stable, President Yoon Suk-yeol attempted to impose martial law on December 3rd, resulting in strong popular uprisings.",
      2023: "Economic growth has been robust, driven by India and Southeast Asia, while China has slowed down due to a real estate crisis and weak global demand. Japan and South Korea, conversely, saw moderate growth, hindered by inflation and weakening international relations. Many territorial disputes and strategic rivalries continued to dominate. The civil war in Myanmar was a tragically relevant event that exacerbated the humanitarian crisis and destabilized the area. In several countries, such as Hong Kong and Afghanistan, restrictions on press freedom and the curtailment of civil rights have suffocated the democratic state.",
      2022: "The region experienced uneven economic growth. China maintained moderate growth, slowed by strict 'zero-Covid' policies, while the government continued its strengthening of political control, with pressure on civil society and the media. In India, the economy showed signs of expansion while the political climate remained marked by intercommunal tensions and a progressive centralization of power. In Southeast Asia, countries like Myanmar imposed strict limitations on democratic freedoms. Vietnam and Cambodia, meanwhile, continued along authoritarian lines while recording strong economic growth.",
      2021: "For the region, it was a year of profound economic divergences and a tense political context. The recovery from the pandemic was uneven: China, while maintaining a good growth rate, saw its expansion slow down. India experienced a more decisive recovery driven by an increase in domestic demand and investments. The Chinese Communist Party further tightened its control over society and institutions. One of the most dramatic events of the year was the military coup that took place in Myanmar in February. Nevertheless, some democracies, such as Japan and South Korea, managed to show resilience.",
      2020: "The pandemic caused a sharp slowdown in the economic development of some economies, although countries like China and Vietnam managed to maintain positive growth. Many countries in South and Southeast Asia experienced significant contraction due to the collapse of tourism and rising unemployment. Politically, the region showed a clear authoritarian tightening: in China, the imposition of the National Security Law drastically reduced political freedoms and democratic space. In India, internal tensions increased, affecting NGOs and media. In the Philippines, the government expanded security powers, further limiting press freedom.",
      2019: "The region’s economy showed mixed signals, with India’s growth slowing and persistent problems in unemployment and stagnating agricultural incomes. In Hong Kong, the largest protests in the city’s history shook it for months, beginning in the summer against an extradition law to mainland China and evolving into broader demands for democracy. The protests involved up to 2 million participants. In India, Modi and the BJP won the national elections in April with an enhanced majority, despite controversies over demonetization, unemployment, and economic policies.",
      2018: "The region showed solid economic growth driven by China and India, despite global trade tensions and slowing international demand, but internal inequalities and sectoral dependence represented structural limits for many countries. Politically, the continent saw a strengthening of authoritarian leaderships: in China, Xi Jinping abolished presidential term limits, consolidating the Communist Party's power; in Cambodia, elections took place without real opposition; and in Myanmar, persecution of the Rohingya continued. In India, Modi’s government strengthened a nationalist agenda, increasing religious tensions and pressure on media and opposition.",
      2017: "Asia maintained robust growth driven by China and India, despite vulnerabilities related to debt and exports in some Southeast Asian economies. In China, Xi Jinping consolidated power by strengthening state control, while in the Philippines, Duterte continued the war on drugs with thousands of extrajudicial killings. In Myanmar, the Rohingya crisis escalated with mass persecutions and refugees fleeing to neighboring countries, and in Cambodia, Hun Sen dissolved the main opposition party, intensifying repression. In India, Modi promoted economic reforms but reinforced a Hindu nationalist agenda, increasing interreligious tensions and pressure on critical voices.",
      2016: "Asia maintained robust growth driven by China and India, despite vulnerabilities related to debt and exports in some Southeast Asian economies. In China, Xi Jinping consolidated power by strengthening state control over the economy and society. In the Philippines, Duterte continued the controversial war on drugs with thousands of extrajudicial killings, while in Myanmar, the Rohingya crisis escalated with mass persecutions. In Cambodia, Hun Sen dissolved the main opposition party, intensifying political repression, and in India, Modi reinforced a Hindu nationalist agenda, increasing interreligious tensions and pressure on critical voices.",
      2015: "Asia maintained solid but slowing economic growth, with China recording its lowest growth rate in 25 years, causing turbulence in global markets. Politically, in Myanmar, elections led to the historic victory of Aung San Suu Kyi’s National League for Democracy, marking a democratic transition after decades of military rule. In China, Xi Jinping further consolidated power through anti-corruption campaigns and increased control over society and media. In the Philippines, the electoral campaign intensified, leading to Duterte’s election in 2016, while in Thailand, the military junta in power since 2014 continued to limit political freedoms and postpone the return to democracy.",
      2014: "Asia maintained robust but slowing economic growth, with China recording its slowest expansion since 1990 and India showing signs of recovery under the new Modi government. Politically, in India, elections brought a landslide victory for Modi’s BJP, promising economic reforms and a Hindu nationalist agenda. In Thailand, a military coup in May overthrew the elected government, establishing a junta that suspended the constitution and repressed dissent. In Hong Kong, the 'Umbrella Movement' saw months of pro-democracy protests against Beijing’s restrictions on the Chief Executive elections, ending without significant concessions. In the Philippines, tensions persisted in the south with Islamic separatist groups, while in Pakistan, the Taliban attack on the Peshawar school caused over 140 deaths, mostly students.",
      2013: "Asia maintained solid economic growth, with China registering a transition toward a more balanced development model and India facing slowdowns and inflationary pressures. Politically, in Cina Xi Jinping became president, launching a vast anti-corruption campaign that targeted thousands of officials, consolidating the Communist Party's control. In Bangladesh, the collapse of Rana Plaza caused over 1,100 deaths, exposing inhuman conditions in the textile industry, while political violence between the government and Islamist opposition shook the country. In Cambodia, elections saw a contested victory by Hun Sen amid accusations of fraud, followed by opposition protests suppressed by police. In Myanmar, the government pursued timid democratic reforms but violence erupted against the Rohingya Muslim minority, while in Pakistan elections brought Nawaz Sharif to power in a historic democratic transition between civilian governments.",
    },
    'Eurasia': {
      2025: "The conflict between Ukraine and Russia, now in its fourth year, continues to weigh heavily on the region's economy and politics. Russia, although there were hopes with the Trump presidency, continues to be suffocated by sanctions that paralyze the financial sector. Military operations have severely strained the resources of both countries and their positions internationally, Ukraine with the EU and Russia with East Asia. Corruption in both countries is a serious and widespread problem. The extreme situation has made Zelensky's Ukrainian government more open to new options that were unacceptable until the previous year. Noteworthy is the meeting in Alaska between Trump and Putin to discuss a possible peace agreement in the most concrete form since the beginning of the conflict.",
      2024: "The war in Ukraine, now in its third year, has had continuous repercussions on the economy. The Russian economy has had to contend with heavy fiscal restrictions and excessive government spending. The rest of the region has experienced slow growth. Many states continue to have authoritarian governments that restrict communications, rights, and civil liberties. In Russia, sham presidential elections were held in March, where opponents had been approved by the Kremlin and the vote was influenced by military threats.",
      2023: "The year was marked by geopolitical tensions and widespread economic weakness: the conflict between Ukraine and Russia continues to influence the region, blocking trade, investment, and stability. The Russian economy registered slight growth, supported by the war economy. Strong pressure from the West has led the Kremlin to pivot towards Asia and the Middle East. Central Asian republics have benefited significantly from commercial activities and have taken on a growing role in the energy sector. Political tensions and humanitarian crises occurred in Armenia following the recapture of Nagorno-Karabakh.",
      2022: "It was a year marked by the Russian invasion of Ukraine, which destabilized pre-existing political, economic, and security balances. Many countries were damaged by international sanctions against Moscow: disruptions in energy supply chains and rising prices of gas and grain. Democratic space in Russia underwent further restriction through strong repression of opposition and independent media. Ukraine, despite the military offensive, showed strong institutional resilience and a strengthening of democratic sentiment. In the Caucasus, the conflict between Armenia and Azerbaijan remained unstable, with recurring tensions in Nagorno-Karabakh. In Kazakhstan, protests were handled harshly.",
      2021: "The weight of the pandemic on Russia's economic performance was among the lowest in the world. The recovery was supported by a rise in energy and raw material prices. Many other Central Asian republics struggled more to recover. Parliamentary elections were then held in Russia, but they were characterized by the exclusion of the opposition and strong media control. In Belarus, Lukashenko intensified domestic repression following the 2020 protests. There was also a further tightening of governments in the authoritarian regimes of Tajikistan and Turkmenistan.",
      2020: "Russia faced a significant recession due to the pandemic, collapsing domestic demand, and falling oil prices. Moscow’s economic difficulties also impacted other Central Asian republics, which depend heavily on migrant workers. In the Caucasus, the economic crisis combined with political instability, worsening living conditions. Constitutional reforms were enacted, allowing Putin to potentially remain in power until 2036, consolidating executive authority. In the autumn, the conflict between Armenia and Azerbaijan erupted again, causing hundreds of casualties and a redistribution of territorial control.",
      2019: "In Kazakhstan, Nazarbayev resigned in March after nearly thirty years in power, executing a transition that kept him in charge of the Security Council with limited legitimacy. The Russian economy remained stagnant due to Western sanctions. Central Asia experienced economic growth largely driven by Chinese investment and Russian economic influence. In Moscow, protests erupted in the summer against the exclusion of opposition candidates from local elections, which were met with violent repression. Authoritarian dominance remained the norm across the region, with limited democratic space.",
      2018: "The region recorded moderate economic growth, driven by rising energy prices that benefited Russia and Central Asia, though Western sanctions continued to hinder investment and innovation in the Russian economy. Politically, the year marked the consolidation of authoritarian regimes: Putin strengthened Kremlin control with his reelection, while Erdoğan in Turkey established a hyper-presidential system, reducing democratic checks and balances. Belarus and the Central Asian republics continued repressive practices against opposition and civil society. The only positive exception was Armenia, where the 'Velvet Revolution' brought a more democratic government.",
      2017: "Eurasia showed moderate economic growth, mainly supported by rising energy prices benefiting Russia and Central Asia. Politically, Russia consolidated internal control ahead of the presidential elections, with growing pressure on opposition and independent media. In Turkey, the constitutional referendum strengthened President Erdoğan’s powers, weakening democratic checks and balances. Authoritarian regimes remained dominant in Central Asia, with limited space for political dissent. In the Caucasus, unresolved tensions between Armenia and Azerbaijan continued to affect regional stability. In Belarus, restrictions on civil liberties and political participation persisted.",
      2016: "Eurasia experienced moderate economic growth, mainly driven by energy prices and Russia’s exports. In Russia, the government strengthened control over opposition and media, while in Turkey, the failed coup led to large-scale repression, arrests of opponents, and limitations on civil liberties. Authoritarian regimes in Central Asia maintained control over civil society and media, and in the Caucasus, tensions between Armenia and Azerbaijan continued to affect regional stability. In Belarus, political freedoms remained severely restricted.",
      2015: "Eurasia recorded economic contraction, with Russia heavily affected by falling oil prices and Western sanctions related to the annexation of Crimea, entering recession. Politically, Russia intensified its military intervention in Syria to support Assad, consolidating regional influence and challenging the West. In Turkey, parliamentary elections strengthened Erdoğan after an initially uncertain result, while the conflict with Kurds in the southeast resumed. In Ukraine, the Donbass conflict continued despite the Minsk agreements, with a devastated economy and persistent tensions with Russia. In the Central Asian republics, authoritarian practices continued, with controlled elections and repression against opposition and civil society.",
      2014: "The region experienced a sharp economic contraction, with Russia hit by falling oil prices and Western sanctions imposed after the annexation of Crimea, entering a recession. Politically, the year was dominated by the Ukraine crisis: Russia annexed Crimea in March and supported separatists in Donbass, triggering the most serious conflict in Europe since the Balkans war. In Turkey, Erdoğan was elected president for the first time through direct elections, initiating power centralization and increasing pressure on media and opposition. In Azerbaijan, Ilham Aliyev consolidated an authoritarian regime with elections considered fraudulent, while in Central Asia, republics like Uzbekistan and Turkmenistan maintained repressive systems with personality cults and total control over civil society.",
      2013: "Eurasia registered slowed economic growth, with Russia still dependent on energy exports but showing signs of structural stagnation and lack of reforms. Politically, in Russia Putin has intensified repression against opposition groups and NGOs with laws on 'foreign agents' and against 'LGBT propaganda,' while the 2011-2012 protests were crushed through arrests and intimidation. In Ukraine, President Yanukovych refused to sign the association agreement with the EU under Russian pressure, triggering the Euromaidan protests in Kyiv that would culminate in his downfall in 2014. In Turkey, the Gezi Park protests represented the greatest challenge to Erdoğan's government, violently repressed and followed by growing restrictions on media and freedom of expression. In Armenia and Georgia, political tensions continued between pro-Western and pro-Russian forces, while Central Asian republics maintained strongly authoritarian regimes.",
    },
    'Europe': {
      2025: "From an economic perspective, the EU has exceeded expectations in the first months of the year, recording a real GDP growth of 1.4% and declining inflation, albeit slowly. This improvement has been achieved through anticipated exports and investments, which have managed to counter trade tensions with the United States. A general tightening of policies has also been observed, with the advancement of many right-wing parties holding strong nationalist views. An example is Slovakia, which approved a constitutional amendment giving precedence to national law over EU law. This has also affected the state of democracy, with a slowdown in civil liberties and increased pressure on the media.",
      2024: "A modest GDP growth of 1% is recorded, with declining inflation and expansion at a moderate pace. However, economies that are sometimes stagnant, such as Germany's, and ones growing negatively, such as Estonia's, are emerging. A year that saw important elections: in the UK where the left-wing Labour Party won, and in Germany the AfD. Tariffs on Chinese electric vehicles were agreed upon, and the G7 agreed to use proceeds from Russian assets as collateral for loans to Ukraine. Many member states have far-right governments: Croatia, Finland, Italy, and Slovakia. Many of those that remain still have significant right-wing majorities.",
      2023: "A modest economic recovery is being registered, made possible only through a robust labor market, with growing employment and rising average wages. Inflation has begun to decline after peaking in previous years, thanks to falling energy prices and market stabilization. Measures have been approved to digitalize the economy and strengthen the single market, and the commitment to cutting emissions has been affirmed. However, many social fragilities remain unresolved, with many people at risk of poverty who are unable to cope with unforeseen expenses.",
      2022: "The EU had to contend with the consequences of the Russian invasion of Ukraine, with an energy crisis that eroded purchasing power and weighed on production. GDP grew by 2.7% against a backdrop of strong inflation at 8.3%. The atmosphere became more tense, with over two hundred measures taken against the Russian front and the declaration that Hungary could no longer be considered fully democratic. This assertion led to the freezing of EU funds towards it. Elections were also held in Italy, which saw the victory with 44% of the votes of Giorgia Meloni, leader of a far-right party.",
      2021: "It was a year of slow recovery following the pandemic; GDP resumed growth, overcoming the 0.2% decline. A strong vaccination campaign against COVID-19 was then supported. In Germany, Angela Merkel finished her chancellorship after sixteen years in office. Tensions between the EU and some member states, notably Poland and Hungary, continued regarding the rule of law. These countries were challenged over measures concerning press freedom, judicial independence, and LGBTQ rights. Relations with the United Kingdom following Brexit and with Russia were also strained, the latter due to the concentration of military troops on the border with Ukraine.",
      2020: "The region was particularly affected by the COVID-19 pandemic, which had repercussions on both the economic and political sectors. Economically, the region experienced the worst recession since World War II: GDP collapsed, and sectors such as tourism and transportation suffered severe damage. Politically, existing dynamics accelerated. Many governments strengthened their executive powers, sparking debates over the constitutional limits of the state of emergency. Hungary and Poland took the opportunity to further consolidate control over the judiciary, media, and democratic institutions.",
      2019: "The EU economy recorded moderate growth of around 1.5%, slowed compared to previous years due to trade uncertainties caused by Brexit. The May elections saw a high turnout of 50.6%, with significant support for Eurosceptic and nationalist parties. Italy experienced political uncertainty with the government crisis that led to the fall of the Conte I government. In Poland, judicial reforms continued to raise concerns about the rule of law, while Orbán’s Hungary maintained its illiberal policies.",
      2018: "During this year, the region recorded moderate economic growth, with GDP slowing compared to the previous year due to declining global demand and early uncertainties related to Brexit. Nevertheless, the economy continued to be supported by consumption and investment, and inflation remained contained. Politically, the continent saw a strong consolidation of nationalist and populist movements. In Italy, the Lega–Five Star Movement government was formed, while in Hungary Viktor Orbán strengthened his illiberal model. In Germany, the rise of the AfD complicated the stability of the governing coalition.",
      2017: "Europe recorded a solid economic recovery, supported by consumption, investment, and exports, with a gradual reduction in unemployment. Politically, the year was marked by decisive elections: in France, Emmanuel Macron’s victory contained the far-right’s advance and boosted European integration. In Germany, Angela Merkel secured a new mandate, but with a more fragmented parliament and the entry of the AfD. In several Central and Eastern European countries, particularly Poland and Hungary, reforms continued that weakened judicial independence and media freedom. The management of migration flows remained a central issue, fueling political tensions and nationalist rhetoric.",
      2016: "Europe experienced moderate but uncertain economic growth, affected by financial tensions and the consequences of the migration crisis. Politically, the year was marked by the Brexit referendum, which confirmed the United Kingdom’s exit from the EU and opened a period of significant political instability. Populist and nationalist movements advanced in several countries, fueling Euroscepticism and polarization. In Central and Eastern Europe, particularly in Hungary and Poland, pressures on the media and judiciary increased. The management of migration flows heightened divisions among member states and strained principles of solidarity and rights protection.",
      2015: "The EU faced a slow and fragile economic recovery, with the Greek debt crisis reaching its peak, leading to dramatic negotiations and a third bailout package. Politically, the continent was marked by the migration crisis, with over a million refugees arriving mainly from Syria, Iraq, and Afghanistan, fueling tensions among member states and strengthening anti-immigration parties. In several Eastern European countries, such as Poland and Hungary, Eurosceptic governments emerged, initiating reforms to limit judicial and media independence. The terrorist attacks in Paris in January and November intensified debates on security and integration, while in Ukraine the conflict in Donbass continued despite the Minsk agreements.",
      2014: "A weak and uneven economic recovery was recorded, with the eurozone growing just 0.9% while high unemployment persisted, especially in southern countries. Politically, the year was dominated by the Ukraine crisis, with Russia’s annexation of Crimea and the outbreak of the conflict in Donbass, leading to Western sanctions against Moscow and renewed East-West tensions. The European Parliament elections saw a significant advance of Eurosceptic and populist parties in several member states, reflecting growing distrust of EU institutions. In Scotland, the independence referendum ended with a 'no' victory but highlighted deep territorial divisions. In Spain, Catalonia held a non-binding referendum on independence despite Madrid’s opposition, fueling constitutional tensions.",
      2013: "During the year, Europe continued to face the consequences of the eurozone crisis, with recession in many southern countries, high youth unemployment, and austerity policies that fueled social tensions. Politically, Cyprus requested a financial bailout with unprecedented measures that affected bank depositors, while in Greece the coalition government pursued controversial reforms under pressure from the troika. In Italy, Monti's technocratic government was replaced by a fragile coalition led by Letta, amid growing distrust toward traditional politics. In several countries, protest movements against austerity emerged, while Eurosceptic and anti-establishment parties gained support. In Turkey, the Gezi Park protests in Istanbul represented the largest wave of dissent against Erdoğan, forcibly suppressed and followed by growing restrictions on civil liberties.",
    },
    'Middle East': {
      2025: "The economic outlook in the Middle East is moderately positive, with slight growth trends across North Africa, Afghanistan, and Pakistan, although conflicts, instability, and general displacement remain persistent challenges. The Israeli-Palestinian conflict is a source of great suffering in the region and has caused various tensions with neighboring states as well, such as the relationship between Israel and Iran. In Libya, the government controls the region, albeit with some instability, and is supported by Egypt and the United Arab Emirates. Government pressure on the media and journalists is intense and among the most concerning in the world, and there is no rule of law; rather, many complexities are observed.",
      2024: "Economic growth is slight, albeit present. Egypt's growth was particularly slowed, having suffered significant losses due to reduced traffic through the Suez Canal. The consequences of the painful clash between Israel and Palestine were severe: the war returned to Lebanon, supported by Iran, following an Israeli air offensive. Subsequently, the International Criminal Court issued arrest warrants for Prime Minister Netanyahu and Defense Minister Gallant for war crimes and crimes against humanity committed in the Gaza Strip. In Syria, the Assad regime collapsed.",
      2023: "It has been a year of significant instability, with economic growth slowed by oil production cuts, inflation, and the fragility of global markets. However, the Gulf monarchies demonstrate relative financial stability, resulting in limited progress in diversification. The most important and catastrophic event was the outbreak of the war between Hamas and Israel on October 7th. This event has redefined regional balances and reignited old tensions. Neighboring countries, including Lebanon, Syria, and Egypt, have suffered significant economic and social repercussions. Critical levels of civil liberties and democracy continue to be noted in the region, with authoritarian governments and pressure on media and opposition groups.",
      2022: "The post-pandemic recovery was characterized by rising energy prices, which weighed particularly on the Gulf monarchies. Otherwise, the region experienced persistent political tensions and fragile democracy. In Israel, political instability resulted in new elections and growing polarization. In Iran, protests following the death of Mahsa Amini revealed strong discontent with the regime and its restrictions on civil liberties. In Turkey, meanwhile, the weakening of democratic institutions continued, and Yemen and Syria were afflicted by conflicts and humanitarian crises.",
      2021: "The economic trend, slowed down by COVID, continued to be stagnant, with some situations of severe difficulty. The response to the pandemic was heterogeneous: some countries were capable of an efficient vaccination campaign, while others, such as Yemen and Syria, had to contend with a weak healthcare system. In August, the total withdrawal of US and NATO troops from Afghanistan took place, followed by the swift return to power of the Taliban. Furthermore, the Abraham Accords strengthened relations between Israel and the United Arab Emirates, and the blockade of Qatar ended in January, resulting in the opening of borders.",
      2020: "The region was hit by the COVID-19 pandemic, which exacerbated existing fractures in many countries. The collapse in global energy demand weighed heavily on oil-dependent economies such as Iraq, Iran, and Saudi Arabia. Meanwhile, the economies of Jordan, Lebanon, and Egypt suffered from the paralysis of tourism. Ongoing tensions and conflicts deteriorated further: in Syria, the war continued, and the country faced one of the worst economic crises in its history. In Yemen, the civil war persisted with enormous humanitarian costs. In Iran, there were internal protests and increasing international isolation.",
      2019: "In Algeria and Sudan, mass protests led to the fall of long-standing leaders. In Lebanon and Iraq, millions of citizens protested against endemic corruption, austerity, and sectarianism, resulting in the resignations of Prime Ministers Hariri and Mahdi. In Israel, Netanyahu faced two inconclusive elections and a corruption indictment. Tensions between the US and Iran escalated with attacks on tankers in the Gulf and Saudi facilities. Syria, meanwhile, saw a consolidation of Russian influence and an expansion of the Russian presence.",
      2018: "The economic context was uneven, with some countries, such as Saudi Arabia and the UAE, supported by recovering oil prices, while others, like Yemen and Syria, remained paralyzed by conflicts. Structural difficulties, from unemployment to energy dependence, continued to slow regional growth. Politically, there was a consolidation of authoritarian leaderships, such as Mohammed bin Salman in Saudi Arabia. In Iran, there were several protests against the economic crisis and government repression. Wars in Syria and Yemen continued to erode any prospects for growth.",
      2017: "The region experienced an unstable economy, influenced by low oil prices that affected Gulf countries, prompting Saudi Arabia and the UAE to continue economic diversification reforms. Politically, the year was dominated by the Gulf diplomatic crisis, with Qatar’s isolation by Saudi Arabia and its allies, deepening regional divisions. In Syria, Assad’s regime consolidated territorial control with Russian and Iranian support, while in Iraq, the defeat of ISIS opened new sectarian tensions. In Saudi Arabia, Mohammed bin Salman launched social reforms but also repressed dissent, and in Turkey, Erdoğan strengthened the presidential system following the constitutional referendum.",
      2016: "The Middle East suffered economically from low oil prices, prompting Gulf countries to adopt austerity measures and reforms to reduce dependence on hydrocarbons. In Syria, Assad’s forces retook Aleppo with Russian support, marking a turning point in the conflict, while in Iraq, the offensive to reclaim Mosul from ISIS began. In Turkey, the attempted coup in July triggered widespread repression with mass arrests of journalists and opponents, accelerating Erdoğan’s authoritarian shift. In Yemen, the civil war continued to cause a severe humanitarian crisis, and in Saudi Arabia, Vision 2030 promised reforms while maintaining strict restrictions on civil liberties and human rights.",
      2015: "The Middle East continued to suffer economically from the collapse of oil prices, forcing Gulf countries into budget deficits and initial public spending cuts. Politically, the war in Syria intensified with Russian military intervention supporting Assad, shifting the balance of the conflict. ISIS consolidated control over vast territories in Syria and Iraq, perpetrating violence of mass and terrorist attacks, including in Europe. In Yemen, civil war erupted with Saudi military intervention against Houthi rebels, causing a severe humanitarian crisis. The nuclear agreement with Iran (JCPOA) represented a significant diplomatic moment but heightened regional tensions with Saudi Arabia and Israel.",
      2014: "During the year, the Middle East faced severe economic turbulence, with falling oil prices affecting exporters and conflicts devastating the economies of Syria, Iraq, and Yemen. Politically, the year was dominated by the rapid expansion of ISIS, which conquered vast territories in Iraq and Syria, proclaimed a caliphate, and triggered a US-led international coalition. In Syria, the civil war intensified with increasing fragmentation among rebel and jihadist groups, while in Iraq, the Baghdad government lost control of large northern areas. In Egypt, al-Sisi consolidated power after the presidential election, intensifying repression against the Muslim Brotherhood and dissidents. In Libya, institutional collapse led to the formation of two rival governments, while in Yemen tensions between the government and Houthi rebels escalated into open conflict toward the end of the year.",
      2013: "The Middle East continued to suffer economically from regional conflicts and political instability, with rising unemployment and inflation that aggravated social tensions. Politically, in Egypt the army overthrew President Morsi of the Muslim Brotherhood in a coup in July, followed by violent repression that caused hundreds of deaths in Rabaa Square. In Syria, the civil war intensified with the use of chemical weapons by Assad's regime in Ghouta, while jihadist groups like al-Nusra and ISIS acquired greater influence among the rebels. In Iraq, sectarian terrorist attacks increased with thousands of casualties, signaling the return of instability after the withdrawal of American troops. In Lebanon, spillovers from the Syrian conflict fueled sectarian tensions, while in Bahrain repression against the Shia opposition continued following the 2011 protests.",
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
  const puntiDiRiferimento = [0, 25, 50, 75, 100]; 
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
  if (yPositions.length > 1 && puntiDiRiferimento[4] === 100) {
    const yLinea100 = yPositions[4]; // Posizione Y della linea del 100
    
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
  const raggio = diametroBottone / 2; // Necessario per l'SVG
  const xPos = 40; // Allineato a sinistra
  const yPos = 40; 
  
  bottoneBack = createButton(''); // L'HTML viene impostato dall'SVG
  bottoneBack.position(xPos, yPos);
  
  // --- Contenuto SVG Freccia Sinistra (RIGA MANCANTE INCLUSA) ---
bottoneBack.html(`
    <svg width="${raggio}" height="${raggio}" viewBox="0 0 24 24" fill="none" stroke="${bianco}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line> 
      <polyline points="12 5 5 12 12 19"></polyline> 
    </svg>
  `);
  
  // --- Stile del bottone circolare (come US e FH) ---
  bottoneBack.style('width', diametroBottone + 'px');
  bottoneBack.style('height', diametroBottone + 'px');
  bottoneBack.style('border-radius', '50%'); 
  bottoneBack.style('background-color', nero);
  bottoneBack.style('border', '1px solid' + bianco);
  bottoneBack.style('display', 'flex'); 
  bottoneBack.style('align-items', 'center'); 
  bottoneBack.style('justify-content', 'center'); 
  bottoneBack.style('cursor', 'pointer');
  bottoneBack.style('z-index', '1002');
  bottoneBack.style('padding', '0'); 

  // Funzione per tornare alla pagina precedente nella cronologia del browser
  bottoneBack.mousePressed(() => {
    window.history.back();
  });
}

function mouseWheel(event) {
  // Accumula lo scroll
  scrollAccumulato += event.delta;
  
  // Ottieni gli anni unici
  let anni = data.getColumn('Edition').map(Number); 
  let anniUnici = [...new Set(anni)].sort((a, b) => b - a);
  
  // Limita lo scroll ai limiti degli anni
  let scrollMin = 0;
  let scrollMax = (anniUnici.length - 1) * pixelPerAnno;
  scrollAccumulato = constrain(scrollAccumulato, scrollMin, scrollMax);
  
  // Calcola l'indice dell'anno e il progresso
  let indiceEsatto = scrollAccumulato / pixelPerAnno;
  let indiceAnno = floor(indiceEsatto);
  progressoScroll = indiceEsatto - indiceAnno; // Valore tra 0 e 1
  
  // Limita l'indice tra 0 e il numero massimo di anni
  indiceAnno = constrain(indiceAnno, 0, anniUnici.length - 1);
  
  // Se l'anno è cambiato, aggiorna
  if (anniUnici[indiceAnno] !== annoCorrente) {
    annoCorrente = anniUnici[indiceAnno];
    filtraECalcolaDati(annoCorrente);
    aggiornaContenutoBottoniCountriesTerritori(); // Aggiorna i contatori
  }
    // Previeni lo scroll della pagina
  return false;
}