// variabili globali
let data;
let torcia;
let iconaUs;
let iconaFh;

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
let annoCorrente;
let anniUnici = [];
let scrollAccumulato = 0;
let pixelPerAnno = 200; // Quanti pixel di scroll per cambiare anno
let progressoScroll = 0; // Valore da 0 a 1 per l'animazione tra anni

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

// Aggiungi dopo le altre variabili globali
let paesiConPosizioni = []; // Array per memorizzare posizioni dei pallini
let indiceHover = -1; // Indice del paese in hover (-1 = nessuno)
let paeseCercato = null;

// variabile per memorizzare il massimo numero di paesi per regione
let maxPaesiPerRegione = {};

// variabili per l'interazione con le torce
let regioneHover = null;
let areeTorce = []; // Array per memorizzare le aree cliccabili delle torce
let areeRegioni = []; // Array per memorizzare le aree complete delle regioni (barre + torce)
let opacitaRegioni = {}; // Oggetto per memorizzare l'opacità di ogni regione
let velocitaTransizione = 0.1; // Velocità della transizione (0-1, più alto = più veloce)

// variabili per i nuovi bottoni in alto a destra
let bottoneUS;
let bottoneFH;
let bottoneCancella;
let bottoneIntro;
let tooltipIntro;
let tooltipUS;
let tooltipFH;

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
  // Crea il canvas con larghezza della finestra
  createCanvas(windowWidth, windowHeight);

  // variabili per responsiveness
  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;
  
  // variabili per disegnare le barre
  altezzaMassimaBarra = windowHeight * 0.5; 
  yBarra = windowHeight * 0.75; 
  
  // calcola il massimo numero di paesi per ogni regione
  calcolaMaxPaesiPerRegione();
  
  // estrai tutti i paesi unici dal dataset
  estraiPaesiUnici();
  
  // filtro i dati per anno
  // trova tutti gli anni unici presenti nella colonna 'Edition'
  let anni = data.getColumn('Edition').map(Number); 
  anniUnici = [...new Set(anni)].sort((a, b) => b - a); 
  
 // l'anno iniziale di default è impostato sul più recente
  if (anniUnici.length > 0 && !isNaN(anniUnici[0])) {
      annoCorrente = anniUnici[0]; 
  } else {
      annoCorrente = null;
  }

  // filtra e calcola i dati iniziali
  filtraECalcolaDati(annoCorrente); 
  
  // CREAZIONE BARRA RICERCA
  creaBarraRicerca();

  // crea i bottoni filtro per gli status
  creaBottoniFiltro();

  // CHIAMA LA NUOVA FUNZIONE PER CREARE I BOTTONI DI NAVIGAZIONE
  creaBottoniNavigazione();
}

// funzione per estrarre tutti i paesi unici dal dataset
function estraiPaesiUnici() {
  let paesi = data.getColumn('Country/Territory');
  paesiUnici = [...new Set(paesi)].sort();
}

// FUNZIONE MODIFICATA PER MIGLIORE VISIBILITÀ E POSIZIONAMENTO
function creaBarraRicerca() {

  const diametroBottoneIntro = 60; // Dalla creaBottoniNavigazione
  const margineSinistroIntro = 30; // Dalla creaBottoniNavigazione
  const spaziaturaDopoIntro = 20; // Aggiungi spazio dopo il bottone Intro

  const xPosInizioBarra = margineSinistroIntro + diametroBottoneIntro + spaziaturaDopoIntro; // Nuova X iniziale
  
  // La larghezza totale del contenitore deve essere ridotta
  const larghezzaSpazioUsato = xPosInizioBarra + (width - graficoWidth); // Larghezza usata per Intro + Anno/Navigazione
  const larghezzaBarra = graficoWidth - xPosInizioBarra - 50; // Calcola la nuova larghezza disponibile
  
  // Container principale per la ricerca
  let containerRicerca = createDiv();
  
  // CENTRAGGIO DELLA BARRA SOPRA IL GRAFICO (circa)
  let xPos = xPosInizioBarra; // Usa la nuova posizione calcolata
  let yPos = 30; 
  
  containerRicerca.position(xPos, yPos);

  
  containerRicerca.position(xPos, yPos);
  containerRicerca.style('position', 'absolute');
  containerRicerca.style('width', larghezzaBarra + 'px');
  containerRicerca.style('z-index', '1000');
  
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
  inputRicerca.style('padding', '20px 20px 18px 50px');
  inputRicerca.style('font-size', '20px');
  inputRicerca.style('border', '1px solid' + bianco);
  inputRicerca.style('border-radius', '30px');
  inputRicerca.style('background-color', nero);
  inputRicerca.style('color', bianco);
  inputRicerca.style('outline', 'none');
  inputRicerca.style('box-sizing', 'border-box');
  inputRicerca.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif'); 
  
  // RIMUOVI IL BOTTONE X DA QUI - lo creeremo separatamente
  
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
        vaiAPaginaPaese(paese); 
      }
      else if (inputRicerca.value().trim() !== '') {
          let primoSuggerimento = suggerimentiDiv.elt.firstChild;
          if (primoSuggerimento) {
               vaiAPaginaPaese(primoSuggerimento.textContent);
          } else {
               vaiAPaginaPaese(inputRicerca.value().trim()); 
          }
      }
    }
  });
  
  // CREA IL CONTAINER PER IL NOME DEL PAESE E IL BOTTONE X
  // Posizionato a destra della barra di ricerca
  let containerPaeseCercato = createDiv();
  containerPaeseCercato.id('containerPaeseCercato');
  containerPaeseCercato.style('position', 'absolute');
  containerPaeseCercato.style('display', 'none'); // Nascosto inizialmente
  containerPaeseCercato.style('align-items', 'center');
  containerPaeseCercato.style('gap', '6px');
  containerPaeseCercato.style('z-index', '1000');
  
  // Nome del paese
  let nomePaeseDiv = createDiv('');
  nomePaeseDiv.id('nomePaeseCercato');
  nomePaeseDiv.parent(containerPaeseCercato);
  nomePaeseDiv.style('color', bianco);
  nomePaeseDiv.style('font-family', 'NeueHaasGrotDisp-65Medium, sans-serif');
  nomePaeseDiv.style('font-size', '20px');
  nomePaeseDiv.style('white-space', 'nowrap');
  
  // Bottone X circolare
  bottoneCancella = createButton('×');
  bottoneCancella.parent(containerPaeseCercato);
  bottoneCancella.style('width', '30px');
  bottoneCancella.style('height', '30px');
  bottoneCancella.style('border-radius', '50%');
  bottoneCancella.style('background-color', nero);
  bottoneCancella.style('color', bianco);
  bottoneCancella.style('border', '1px solid' + bianco);
  bottoneCancella.style('cursor', 'pointer');
  bottoneCancella.style('font-size', '20px');
  bottoneCancella.style('display', 'flex');
  bottoneCancella.style('align-items', 'center');
  bottoneCancella.style('justify-content', 'center');
  bottoneCancella.style('padding', '0');
  bottoneCancella.style('line-height', '1');

  bottoneCancella.mousePressed(() => {
    paeseCercato = null;
    inputRicerca.value('');
    let container = document.getElementById('containerPaeseCercato');
    if (container) {
      container.style.display = 'none';
    }
  });
}

// funzione per aggiornare la posizione del container del paese cercato
function aggiornaPosizioneContainerPaese() {
  if (paeseCercato === null) return;
  
  let container = document.getElementById('containerPaeseCercato');
  if (!container) return;
  
  // Trova il paese cercato nell'array delle posizioni
  let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
  
  if (paese) {
    // Posiziona il container a destra della barra del paese
    let offsetX = 10;
    container.style.left = (paese.x + paese.raggio + offsetX) + 'px';
    container.style.top = (paese.y - 15) + 'px'; // Centrato verticalmente rispetto al pallino
    container.style.display = 'flex';
  } else {
    // Se il paese non è trovato (potrebbe essere filtrato), nascondi il container
    container.style.display = 'none';
  }
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

// funzione per filtrare il paese nella visualizzazione
function vaiAPaginaPaese(paese) {
  // Salva il paese cercato
  paeseCercato = paese;
  
  // Nascondi i suggerimenti
  suggerimentiDiv.style('display', 'none');
  
  // Pulisci l'input
  inputRicerca.value('');
  
  // Mostra il container con nome e bottone X
  let container = document.getElementById('containerPaeseCercato');
  if (container) {
    container.style.display = 'flex';
    
    // Aggiorna il nome del paese
    let nomeDiv = document.getElementById('nomePaeseCercato');
    if (nomeDiv) {
      nomeDiv.innerHTML = paese;
    }
  }
}

// funzione per navigare alla pagina della regione
function vaiAPaginaRegione(regione) {
  // Codifica il nome della regione per l'URL
  let regioneEncoded = encodeURIComponent(regione);
  // Reindirizza alla pagina della regione passando anche l'anno corrente
  window.location.href = `regioni.html?region=${regioneEncoded}&year=${annoCorrente}`; 
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

// funzione richiamata al cambio di anno tramite scroll
function cambiaAnno(nuovoIndice) { 
    if (nuovoIndice >= 0 && nuovoIndice < anniUnici.length) {
      annoCorrente = anniUnici[nuovoIndice];
      filtraECalcolaDati(annoCorrente); // ricalcola e ridisegna i dati per il nuovo anno
    }
}

// funzione per creare un singolo bottone
function creaBottone(testo, x, y, colori, tipo) {
  let bottone = createButton(testo);
  bottone.position(x, y);
  
  // AUMENTA IL PADDING PER INCLUDERE LO SPESSORE DEL BORDO SFUMATO
  // Il padding esterno deve essere aumentato del valore del bordo (es. 2px). 
  // Da '2px 30px' a '4px 32px' per mantenere lo spazio originale.
  bottone.style('padding', '4px 32px 2px 32px'); 
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
  bottone.style('color', nero);
  
  bottone.mousePressed(() => toggleFiltro(tipo));
  
  return bottone;
}

// funzione per creare i bottoni filtro
function creaBottoniFiltro() {
  let yPos = 47; // Posizione Y fissa in alto
  let spaziatura = 15; // Spazio fisso tra i bottoni
  
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
  let xInizio = graficoWidth - larghezzaTotaleBlocco - 75;
  
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
    bottone.style('color', nero);
  } else {
    bottone.style('background', 'transparent');
    bottone.style('opacity', '0.8');
    bottone.style('color', bianco);
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
  background(nero);

  if (datiFiltrati && datiFiltrati.length > 0) {
      disegnaGriglia();
      disegnaBarre();
      disegnaEtichettaAnno();
      disegnaEtichetteHover();
      aggiornaPosizioneContainerPaese();
  } else {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text(`Nessun dato trovato per l'anno ${annoCorrente}.`, windowWidth/2, height/2);
  }
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
    line(50, yLinea, graficoWidth - 50, yLinea);
    
    // Disegna il valore (0 o 100)
    noStroke();
    fill(bianco + 80); 
    textAlign(RIGHT, CENTER);
    textSize(12);
    text(valore, 40, yLinea);
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
    translate( 50, yLinea100 - 5); 
    textAlign(LEFT, BOTTOM);
    text("Total Score", 0, 0);
    pop();
  }
}

// funzione per disegnare una singola barra
function disegnaBarraSingola(xBarra, riga, larghezzaBarra, indice) {
  let status = riga.getString('Status');
  let total = riga.getNum('TOTAL');
  let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
  let yCimaBarra = yBarra - altezzaBarra - incremento;
  
  let nomePaese = riga.getString('Country/Territory');
  
  // Determina l'opacità in base alla ricerca
  push();
  if (paeseCercato !== null && nomePaese !== paeseCercato) {
    drawingContext.globalAlpha = 0.2; // Trasparenza per paesi non cercati
  }

  // Applica il gradiente
  let gradient = creaGradiente(xBarra, yCimaBarra, yBarra, larghezzaBarra, coloriStatus[status]);
  drawingContext.fillStyle = gradient;
  rect(xBarra, yBarra, larghezzaBarra, -altezzaBarra - incremento);
  arc(xBarra + larghezzaBarra / 2, yCimaBarra, larghezzaBarra, larghezzaBarra, PI, TWO_PI);
  
  // Disegna il cerchio in cima
  fill(bianco);
  ellipse(xBarra + larghezzaBarra/2, yCimaBarra, larghezzaBarra, larghezzaBarra);
  
  pop();
  
  // Salva la posizione del pallino
  paesiConPosizioni.push({
    indice: indice,
    nome: nomePaese,
    x: xBarra + larghezzaBarra/2,
    y: yCimaBarra,
    raggio: larghezzaBarra/2
  });
}

// costruzione delle barre raggruppate per regione con livelli sovrapposti
function disegnaBarre() { 
  noStroke();

  paesiConPosizioni = []; // Resetta l'array ad ogni frame

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
  let spazioDisponibile = graficoWidth - margineIniziale - margineFinale;

  // MODIFICATO: Calcola il totale di barre basato sui MASSIMI per regione
  let totaleBarre = 0;
  for (let regione of regioni) {
    totaleBarre += maxPaesiPerRegione[regione];
  }
  
  // Calcola la larghezza ottimale per barre e spazi
  let numeroGruppi = regioni.length;
  let spazioTraGruppi = min(50, spazioDisponibile * 0.1);
  let spazioTotaleGruppi = spazioTraGruppi * (numeroGruppi - 1);
  let spazioPerBarre = spazioDisponibile - spazioTotaleGruppi;
  let larghezzaBarra = max(2, min(15, spazioPerBarre / totaleBarre));
  
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
      // Determina l'opacità per questa regione
      push();
      if (regioneHover !== null && regioneHover !== regione) {
        drawingContext.globalAlpha = 0.3; // Trasparenza per regioni non in hover
      }
      
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
      
      pop();
      
      // MODIFICATO: Avanza usando il massimo per regione
      xCorrente += maxPaesiPerRegione[regione] * larghezzaBarra + spazioTraGruppi;
    }
  }
  
  // LIVELLO 2: Disegna poi tutti i paesi PARZIALMENTE LIBERI (PF) - livello intermedio
  if (filtroPF) {
    xCorrente = margineIniziale;
    for (let regione of regioni) {
      // Determina l'opacità per questa regione
      push();
      if (regioneHover !== null && regioneHover !== regione) {
        drawingContext.globalAlpha = 0.3; // Trasparenza per regioni non in hover
      }
      
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
      
      pop();
      
      xCorrente += maxPaesiPerRegione[regione] * larghezzaBarra + spazioTraGruppi;
    }
  }
  
  // LIVELLO 3: Disegna infine tutti i paesi NON LIBERI (NF) - livello superiore
  if (filtroNF) {
    xCorrente = margineIniziale;
    for (let regione of regioni) {
      // Determina l'opacità per questa regione
      push();
      if (regioneHover !== null && regioneHover !== regione) {
        drawingContext.globalAlpha = 0.3; // Trasparenza per regioni non in hover
      }
      
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
      
      pop();
      
      xCorrente += maxPaesiPerRegione[regione] * larghezzaBarra + spazioTraGruppi;
    }
  }
  
  // Resetta l'array delle aree torce
  areeTorce = [];
  
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
    
    // Determina l'opacità in base all'hover
    let opacita = 255;
   // --- NUOVA LOGICA: FORZA OPACITÀ QUANDO UN PAESE È CERCATO ---
    let regionePaeseCercato = null;
    if (paeseCercato !== null) {
        let rigaPaese = datiFiltrati.find(r => r.getString('Country/Territory') === paeseCercato);
        if (rigaPaese) {
            regionePaeseCercato = rigaPaese.getString('Region');
        }
        
        if (regionePaeseCercato !== null) {
            // Se la regione corrente NON è quella cercata, riduci l'opacità
            if (regione !== regionePaeseCercato) {
                opacita = 80; 
            }
            // Se è la regione cercata, opacita resta 255 (100%)
        }
    } 
    // --- FINE NUOVA LOGICA (se la ricerca NON è attiva, usa la logica di hover) ---
    else if (regioneHover !== null && regioneHover !== regione) {
      opacita = 80; // Trasparenza per le torce non in hover
    }
    
    // Applica l'opacità
    tint(255, opacita);
    
    // Disegna l'immagine della torcia centrata con larghezza massima assoluta
    image(torcia, centroRegione, yIniziaTorcia + altezzaTorcia/2, larghezzaMassima*1.15, altezzaTorcia);
    
    // Salva l'area cliccabile della torcia
    areeTorce.push({
      regione: regione,
      x: centroRegione - (larghezzaMassima*1.1)/2,
      y: yIniziaTorcia,
      w: larghezzaMassima*1.1,
      h: altezzaTorcia
    });
  }
  noTint(); // Rimuovi il tint per gli elementi successivi
  pop();
  
  // Salva le aree complete delle regioni (dall'inizio delle barre fino al fondo della torcia)
  areeRegioni = [];
  for (let etichetta of etchetteRegioni) {
    // Trova l'area della torcia corrispondente
    let areaTorcia = areeTorce.find(a => a.regione === etichetta.regione);
    
    if (areaTorcia) {
      // L'area della regione va dall'inizio delle barre (sopra) fino al fondo della torcia
      areeRegioni.push({
        regione: etichetta.regione,
        x: etichetta.xInizio,
        y: 150, // Dall'alto della finestra
        w: etichetta.larghezza,
        h: height // Fino in fondo
      });
    }
  }

  // Disegna le etichette delle regioni alla fine (sopra tutti i livelli e sopra le torce)
  push();
  fill(nero);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont(fontMedium); 
  textSize(20);
  const altezzaEtichetta = 50;
  const yEtichetta = yBarra + 52;

  for (let etichetta of etchetteRegioni) {
    const larghezzaCasella = etichetta.larghezza * 1.2;
    const xInizioCasella = etichetta.x - (larghezzaCasella / 2);

    text(
        etichetta.regione, 
        xInizioCasella, 
        yEtichetta - (altezzaEtichetta / 2),
        larghezzaCasella, 
        altezzaEtichetta
    );
  }
  pop();
}

function disegnaEtichettaAnno() {
  push(); 

  // Imposta lo stile del testo
  noStroke();
  textFont(fontRegular); 
  textAlign(CENTER, CENTER);
  
  // Calcolo della posizione base (punto di rotazione al centro)
  let xPos = graficoWidth + (annoWidth / 2); 
  let yPos = height / 2;
  
  translate(xPos, yPos);
  // Rotazione di 270 gradi (PI / 2 * 3)
  // L'asse X ora punta verso l'alto dello schermo.
  rotate(PI / 2 * 3); 
  
  // --- NUOVA LOGICA DI SPAZIATURA VERTICALE (sull'asse X ruotato) ---
  const spaziaturaFissaX = 400; 
  
  // *** INVERSIONE CHIAVE: Offset Globale Positivo ***
  // Quando progressoScroll va da 0 a 1, l'intero blocco si sposta 
  // di +spaziaturaFissaX, causando lo scorrimento verso il basso.
  let offsetGlobaleX = map(progressoScroll, 0, 1, 0, spaziaturaFissaX); // POSITIVO!
  
  // Calcola l'indice dell'anno corrente
  let indiceCorrente = anniUnici.indexOf(annoCorrente);
  
  // --- ANNO PRECEDENTE (Il più vecchio, esce in alto/sopra) ---
  if (indiceCorrente > 0) {
    let annoPrecedente = anniUnici[indiceCorrente - 1]; // Esempio: 2013 quando annoCorrente è 2014
    
    // Posizione di base: un "salto" SOPRA la posizione centrale (negativo sull'asse X ruotato)
    let baseXPrecedente = spaziaturaFissaX; 
    let finalXPrecedente = baseXPrecedente + offsetGlobaleX;
    
    // Dimensione e Opacità: si rimpicciolisce e sfuma (sta uscendo)
    let dimensionePrecedente = map(progressoScroll, 0, 1, annoWidth * 0.9, annoWidth * 0.7);
    let opacitaPrecedente = map(progressoScroll, 0, 1, 100, 70);
    
    fill(bianco + hex(floor(opacitaPrecedente), 2));
    textSize(dimensionePrecedente);
    text(annoPrecedente, finalXPrecedente, -30);
  }
  
  // --- ANNO CORRENTE (L'anno al centro, che transita) ---
  let baseXCorrente = 0; // Posizione centrale di partenza
  let finalXCorrente = baseXCorrente + offsetGlobaleX;

  // Dimensione e Opacità: transita da grande a piccolo
  let dimensioneCorrente = map(progressoScroll, 0, 1, annoWidth * 1.3, annoWidth * 0.9);
  let opacitaCorrente = map(progressoScroll, 0, 1, 255, 100);
  
  fill(bianco + hex(floor(opacitaCorrente), 2));
  textSize(dimensioneCorrente);
  text(annoCorrente, finalXCorrente, -30);
  
  // --- ANNO SUCCESSIVO (Il più recente, entra dal basso/sotto) ---
  if (indiceCorrente < anniUnici.length - 1) {
    let annoSuccessivo = anniUnici[indiceCorrente + 1]; // Esempio: 2015 quando annoCorrente è 2014
    
    // Posizione di base: un "salto" SOTTO la posizione centrale (positivo sull'asse X ruotato)
    let baseXSuccessivo = -spaziaturaFissaX;
    let finalXSuccessivo = baseXSuccessivo + offsetGlobaleX;
    
    // Dimensione e Opacità: resta piccolo e trasparente (sta aspettando di entrare)
    let dimensioneSuccessivo = map(progressoScroll, 0, 1, annoWidth * 0.7, annoWidth * 1.3); 
    let opacitaSuccessivo = map(progressoScroll, 0, 1, 70, 100);  

    fill(bianco + hex(floor(opacitaSuccessivo), 2));
    textSize(dimensioneSuccessivo);
    text(annoSuccessivo, finalXSuccessivo, -30);
  }

  pop();
}

// Funzione per gestire il movimento del mouse
function mouseMoved() {
  let nuovaRegioneHover = null;
  let cursoreDaMostrare = ARROW;
  
  // --- NUOVA LOGICA: BLOCCO INTERAZIONE CON RICERCA ATTIVA ---
  let regionePaeseCercato = null;
  if (paeseCercato !== null) {
      // Trova la regione del paese cercato
      let rigaPaese = datiFiltrati.find(r => r.getString('Country/Territory') === paeseCercato);
      if (rigaPaese) {
          regionePaeseCercato = rigaPaese.getString('Region');
      }
  }

  // Se un paese è cercato E la sua regione è stata trovata, saltiamo il normale calcolo dell'hover
  if (regionePaeseCercato !== null) {
      // In questo stato, non permettiamo l'hover su altre regioni/torce
      regioneHover = null; // Forza la disattivazione dell'hover generico
      cursor(ARROW); 
  }
  
  // PRIORITÀ 1: Controlla se il mouse è sopra il paese cercato
  if (paeseCercato !== null) {
    let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
    
    if (paese) {
      // Trova i dati completi della barra
      for (let i = 0; i < datiFiltrati.length; i++) {
        let riga = datiFiltrati[i];
        if (riga.getString('Country/Territory') === paeseCercato) {
          let total = riga.getNum('TOTAL');
          let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
          let yCimaBarra = yBarra - altezzaBarra - incremento;
          
          // Verifica se il mouse è dentro la barra rettangolare
          if (mouseX >= paese.x - paese.raggio && 
              mouseX <= paese.x + paese.raggio &&
              mouseY >= yCimaBarra && 
              mouseY <= yBarra) {
            cursor(HAND);
            return;
          }
          
          // Verifica se il mouse è sul pallino in cima
          let distanza = dist(mouseX, mouseY, paese.x, paese.y);
          if (distanza <= paese.raggio) {
            cursor(HAND);
            return;
          }
          
          break;
        }
      }
    }
  }
  // Se paeseCercato è attivo, l'hover sulla regione deve essere bloccato!
  if (regionePaeseCercato !== null) {
      // Se siamo qui, il mouse non è sul pallino del paese cercato.
      // Dobbiamo terminare la funzione per impedire la scansione delle aree regione/torce.
      cursor(ARROW); 
      return; 
  }
  
  // PRIORITÀ 2: Controlla le aree complete delle regioni (barre + torce)
  for (let area of areeRegioni) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      nuovaRegioneHover = area.regione;
      
      // Se il mouse è nell'area delle torce, mostra la mano
      let areaTorcia = areeTorce.find(a => a.regione === area.regione);
      if (areaTorcia && 
          mouseY >= areaTorcia.y && 
          mouseY <= areaTorcia.y + areaTorcia.h) {
        cursoreDaMostrare = HAND;
      }
      break;
    }
  }
  
  // Aggiorna regioneHover solo se è cambiata
  if (nuovaRegioneHover !== regioneHover) {
    regioneHover = nuovaRegioneHover;
  }
  
  // Imposta il cursore appropriato
  cursor(cursoreDaMostrare);
}

// Funzione per aggiornare gradualmente le opacità
function aggiornaOpacita(regioni) {
  for (let regione of regioni) {
    // Inizializza l'opacità se non esiste
    if (opacitaRegioni[regione] === undefined) {
      opacitaRegioni[regione] = 1.0;
    }
    
    // Determina l'opacità target
    let targetOpacita;
    if (regioneHover === null) {
      targetOpacita = 1.0; // Nessun hover: tutte visibili
    } else if (regioneHover === regione) {
      targetOpacita = 1.0; // Regione in hover: completamente visibile
    } else {
      targetOpacita = 0.3; // Altre regioni: trasparenti
    }
    
    // Interpola gradualmente verso il target
    opacitaRegioni[regione] = lerp(opacitaRegioni[regione], targetOpacita, velocitaTransizione);
  }
}

// Funzione per gestire il click del mouse
function mousePressed() {
  // PRIORITÀ 1: Controlla se è stato cliccato sul paese cercato
  if (paeseCercato !== null) {
    let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
    
    if (paese) {
      // Controlla se il click è sulla barra rettangolare
      // Trova i dati completi della barra
      for (let i = 0; i < datiFiltrati.length; i++) {
        let riga = datiFiltrati[i];
        if (riga.getString('Country/Territory') === paeseCercato) {
          let total = riga.getNum('TOTAL');
          let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
          let yCimaBarra = yBarra - altezzaBarra - incremento;
          
          // Verifica se il click è dentro la barra rettangolare
          if (mouseX >= paese.x - paese.raggio && 
              mouseX <= paese.x + paese.raggio &&
              mouseY >= yCimaBarra && 
              mouseY <= yBarra) {
            
            const countryNameEncoded = encodeURIComponent(paeseCercato);
            window.location.href = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
            return;
          }
          
          // Verifica se il click è sul pallino in cima
          let distanza = dist(mouseX, mouseY, paese.x, paese.y);
          if (distanza <= paese.raggio) {
            const countryNameEncoded = encodeURIComponent(paeseCercato);
            window.location.href = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
            return;
          }
          
          break;
        }
      }
    }
  }
  
  let regionePaeseCercato = null;
  if (paeseCercato !== null) {
      let rigaPaese = datiFiltrati.find(r => r.getString('Country/Territory') === paeseCercato);
      if (rigaPaese) {
          regionePaeseCercato = rigaPaese.getString('Region');
      }
      // Se il paese è cercato, impediamo i click sulle aree regione/torce.
      if (regionePaeseCercato !== null) {
          // Se arriviamo qui, il click non era sul pallino del paese cercato.
          // Torniamo per impedire il click sulle aree torcia.
          return;
      }
  }

  // PRIORITÀ 2: Controlla se è stato cliccato su un'area di una regione
  for (let area of areeRegioni) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      
      // Verifica che il click sia nell'area della torcia (sotto le barre)
      let areaTorcia = areeTorce.find(a => a.regione === area.regione);
      if (areaTorcia && 
          mouseY >= areaTorcia.y && 
          mouseY <= areaTorcia.y + areaTorcia.h) {
        vaiAPaginaRegione(area.regione);
      }
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
  const yPos = 30; // Stessa altezza verticale della barra di ricerca
  const spaziaturaTraBottoni = 20;

  // Variabile per la posizione Y comune dei tooltip (10px sotto il bottone)
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
  
  // --- 1. Bottone INTRO (Freccia) ---
  
  let xIntro = margineSinistro;
  bottoneIntro = createButton('');
  bottoneIntro.position(xIntro, yPos);
  
  // Inserimento SVG della freccia
  bottoneIntro.html(`
    <svg width="${raggio}" height="${raggio}" viewBox="0 0 24 24" fill="none" stroke="${bianco}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
  `);
  bottoneIntro.style('width', diametroBottone + 'px');
  bottoneIntro.style('height', diametroBottone + 'px');
  bottoneIntro.style('border-radius', '50%'); 
  bottoneIntro.style('background-color', nero); 
  bottoneIntro.style('border', '1px solid' + bianco);
  bottoneIntro.style('display', 'flex'); 
  bottoneIntro.style('align-items', 'center'); 
  bottoneIntro.style('justify-content', 'center'); 
  bottoneIntro.style('cursor', 'pointer');
  bottoneIntro.style('z-index', '1000');
  bottoneIntro.style('padding', '0');


  // --- CREAZIONE TOOLTIP INTRO ---
  tooltipIntro = createDiv('Back to Introduction');
  for (let key in stileTooltip) {
    tooltipIntro.style(key, stileTooltip[key]);
  }
  
  // --- GESTIONE HOVER INTRO (CENTRATO) ---
  bottoneIntro.mouseOver(() => {
      // 1. Rendi visibile temporaneamente per misurare la larghezza corretta
      tooltipIntro.style('display', 'block'); 
      
      // 2. Ricalcola la posizione X centrata in base alla larghezza misurata
      let larghezzaTooltip = tooltipIntro.elt.offsetWidth;
      // Posizione X: Inizio bottone + metà bottone - metà tooltip
      tooltipIntro.position(xIntro, yTooltip);
  });

  bottoneIntro.mouseOut(() => {
      tooltipIntro.style('display', 'none');
  });
  
  // Link
  bottoneIntro.mousePressed(() => {
    window.location.href = 'intro.html';
  });
  
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

// NUOVA FUNZIONE per disegnare le etichette dei paesi in hover
function disegnaEtichetteHover() {
  if (indiceHover === -1) return;
  
  // Trova il paese in hover
  let paeseHover = paesiConPosizioni.find(p => p.indice === indiceHover);
  if (!paeseHover) return;
  
  push();
  
  // Disegna il testo del nome del paese
  fill(bianco);
  noStroke();
  textSize(20);
  textFont(fontMedium);
  textAlign(LEFT, CENTER);
  
  // Posiziona il testo a destra del pallino
  let offsetX = 15;
  text(paeseHover.nome, paeseHover.x + offsetX, paeseHover.y);
  
  pop();
}

// funzione per disegnare l'etichetta del paese cercato
function disegnaEtichettaPaeseCercato() {
  if (paeseCercato === null) return;
  
  // Trova il paese cercato nell'array delle posizioni
  let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
  if (!paese) return;
  
  push();
  
  // Disegna il testo del nome del paese A SINISTRA del pallino
  fill(bianco);
  noStroke();
  textSize(20);
  textFont(fontMedium);
  textAlign(RIGHT, CENTER); // ALLINEAMENTO A DESTRA per posizionare a sinistra del pallino
  
  // Posiziona il testo a SINISTRA del pallino
  let offsetX = 15;
  text(paese.nome, paese.x - offsetX, paese.y);
  
  pop();
}

// Funzione per gestire lo scroll del mouse
function mouseWheel(event) {
  // Accumula lo scroll
  scrollAccumulato += event.delta;
  
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
    cambiaAnno(indiceAnno);
  }
  
  // Previeni lo scroll della pagina
  return false;
}