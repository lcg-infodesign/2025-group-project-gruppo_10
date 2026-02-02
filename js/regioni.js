// sketch pagina regione

// variabili globali
let data;
let dataParagrafi;
let torcia;
let regioneCorrente = 'Titolo';

// Font
let fontRegular, fontMedium, fontBold;

// Icone
let iconaAboutUs, iconaAboutFh, iconaHome, iconaLente, iconaClose;
let iconaArrLeft;

// Dimensioni
let graficoWidth, annoWidth;
let yBarra, altezzaMassimaBarra;
let incremento = 50;
let minTotalScore = 0;
let maxTotalScore = 100;

// Dimensioni box 
let boxX = 40;
let boxW; // boxW = graficoWidth * 0.3
let boxRightX; // boxRightX = graficoWidth - boxX - boxW
let boxY1 = 150;
let spacing = 40;
let boxRightH;
let toggleY = 142;
let boxY1Effettivo;
let toggleHeight = 40;

// Filtri status
let filtroF = true;
let filtroPF = true;
let filtroNF = true;
let bottoneF, bottonePF, bottoneNF;

// Filtri Countries/Territories
let filtroCountries = null; // null = nessun filtro, 'c' = solo countries, 't' = solo territories
let bottoneCountries, bottoneTerritories;

// Anni
let anniUnici = [];
let annoCorrente;
let scrollAccumulato = 0;
let pixelPerAnno = 200;
let progressoScroll = 0;
let areeAnni = [];
let xPosAnni, yPosAnni;

// Ricerca
let inputRicerca;
let suggerimentiDiv;
let paesiUniciGlobali = [];
let paesiRegioneCorrente = []
let suggerimentoSelezionato = -1;
let paeseCercato = null;

// Box
let paragrafiRegioni;
let boxInfoPaese;

// Interazione
let paesiConPosizioni = []; // Array per memorizzare posizioni dei pallini
let indiceHover = -1; // Indice del paese in hover (-1 = nessuno)
let areeTorce =[];

// Aggiungi dopo le altre variabili globali
let visualizzaGrafico = false; // false = testo, true = grafico
let bottoneSwitch;
let datiMediaAnni = []; // Array per memorizzare le medie per anno

function preload() {
  data = loadTable("../assets/FH_dataset.csv", "csv", "header"); // caricamento del dataset (con header)
  dataParagrafi = loadJSON("../assets/paragrafiRegione.json");
  torcia = loadImage("../img/torcia.png");
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

  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;

  boxW = graficoWidth * 0.3;
  boxRightX = graficoWidth - boxX - boxW;
  boxRightH = (windowHeight * 0.5 - 2 * spacing) / 3;
  
  let spacingToggleBox = 15; // Spazio ridotto tra toggle e box
  boxY1Effettivo = toggleY + toggleHeight + spacingToggleBox;

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
  anniUnici = [...new Set(anni)].sort((a, b) => b - a); 
  
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

  // bottoni
  creaBottoneStandard(margine, margine, iconaArrLeft, () => window.history.back()); // bottone per tornare all'introduzione
  creaBottoneStandard(width - diametro - margine, margine, iconaAboutFh, '../html/aboutFreedomHouse.html'); // bottone Freedom House in alto a destra
  creaBottoneStandard(width - (diametro * 2) - margine*3/2, margine, iconaAboutUs, '../html/aboutUs.html'); // bottone About Us a sinistra del primo
  
  calcolaNumMaxPaesiRegione();
  estraiPaesiRegioneCorrente();
  
  creaBottoniFiltro();
  creaBottoniCountriesTerritori();
  aggiornaContenutoBottoniCountriesTerritori();
  creaBoxInfoPaese();

  const larghezzaBarra = graficoWidth * 0.3;
  let elementiRicerca = creaBarraRicerca({
    xPos: graficoWidth * 0.67,
    yPos: 30,
    larghezza: larghezzaBarra,
    paesiUnici: paesiRegioneCorrente,
    callbackSelezionePaese: vaiAPaginaPaese,
    placeholder: 'Look up Country or Territory',
    zIndex: 1001,
    pathIcona: '../img/icone/search.png',
    pathIconaClose: '../img/icone/close.png'
  });
  
  inputRicerca = elementiRicerca.inputRicerca;
  suggerimentiDiv = elementiRicerca.suggerimentiDiv;
  
  elementiRicerca.bottoneCancella.elt.addEventListener('click', (e) => {
    // PRIMA esegui l'azione
    paeseCercato = null;
    elementiRicerca.inputRicerca.value('');
    let container = document.getElementById('containerPaeseCercato');
    if (container) {
      container.style.display = 'none';
    }

    aggiornaBoxInfoPaese(null);
    
    // POI ferma la propagazione
    e.stopPropagation();
    e.preventDefault();
  }, true);

  bottoneSwitch = { x: 0, y: 0, w: 70, h: 36 };
  calcolaMediaPerAnni();
}

function draw() {
  background(palette.nero);
  drawTitle();
  drawToggle();
  drawBoxes();
  
  if (datiFiltrati && datiFiltrati.length > 0) {
    disegnaGriglia();
    disegnaBarre();
    disegnaTorciaRegione();
    disegnaEtichetteHover();

    if (paeseCercato !== null) {
      // Se c'è un paese cercato, mostra sempre i suoi dati
      let rigaPaese = datiFiltrati.find(r => r.getString('Country/Territory') === paeseCercato);
      
      if (rigaPaese) {
        let paeseData = {
          nome: rigaPaese.getString('Country/Territory'),
          score: rigaPaese.getNum('TOTAL'),
          pr: rigaPaese.getNum('PR'),
          cl: rigaPaese.getNum('CL')
        };
        aggiornaBoxInfoPaese(paeseData);
      }
    } else if (indiceHover !== -1) {
      // Se non c'è paese cercato, usa l'hover
      let paeseHover = paesiConPosizioni.find(p => p.indice === indiceHover);
      if (paeseHover) {
        aggiornaBoxInfoPaese(paeseHover);
      }
    } else {
      // Nessun paese cercato e nessun hover
      aggiornaBoxInfoPaese(null);
    }
    
    // Aggiorna posizione container paese cercato
    aggiornaPosizioneContainerPaese();
  }
  
  // Disegna anno
  let risultatoAnno = disegnaEtichettaAnno(graficoWidth, annoWidth, fontRegular, anniUnici, annoCorrente, progressoScroll);
  areeAnni = risultatoAnno.areeAnni;
  xPosAnni = risultatoAnno.xPos;
  yPosAnni = risultatoAnno.yPos;
}

function drawTitle(){
  push();
  fill(palette.bianco);
  noStroke();
  textFont(fontMedium);
  textAlign(LEFT, BOTTOM);

  let dimensioneBase = 75;
  let dimensioneSpeciale = 62;

    if (regioneCorrente === 'Middle East') {
    textSize(dimensioneSpeciale);
      text(regioneCorrente, margine*2+diametro, margine+diametro+10); 
  } else {
    textSize(dimensioneBase);
    text(regioneCorrente, margine*2+diametro, margine+diametro+10); 
  }
  pop();
}

// BOTTONI FILTRO

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
  
  bottone.style('background', `${gradienteBordo}, linear-gradient(${colori[2] || palette.nero}, ${colori[2] || palette.nero})`);
  bottone.style('border-width', '2px');
  bottone.style('border-style', 'solid');
  bottone.style('background-clip', 'padding-box, border-box');
  bottone.style('background-origin', 'border-box'); 
  bottone.style('color', palette.nero);
  
  bottone.mousePressed(() => toggleFiltro(tipo));
  
  return bottone;
}

function creaBottoniFiltro() {
  const distanzaDalFondo = 100; 
  const margineInternoX = 0; 
  const distanzaTraBottoni = 40; 
  const altezzaBottone = 35; // Altezza stimata per il calcolo Y
  
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
  bottoneF = creaBottone('FREE', 0, 0, palette.coloriStatus['F'], 'F'); 
  bottonePF = creaBottone('PARTIALLY FREE', 0, 0, palette.coloriStatus['PF'], 'PF');
  bottoneNF = creaBottone('NOT FREE', 0, 0, palette.coloriStatus['NF'], 'NF');
   
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
    bottone.style('color', palette.nero);
  } else {
    bottone.style('background', 'transparent');
    bottone.style('opacity', '0.8');
    bottone.style('color', palette.bianco);
  }
}

// BOTTONI COUNTIRES/TERRITORIES

function creaBottoniCountriesTerritori() {
  // Parametri dei box
  let boxY1 = 142;
  let spacing = 20;
  
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
  
  // Stile base per entrambi i bottoni (palette.nero con bordo palette.bianco)
[bottoneCountries, bottoneTerritories].forEach(bottone => {
    bottone.style('cursor', 'pointer');
    bottone.style('border-radius', '30px');
    bottone.style('display', 'flex');
    bottone.style('align-items', 'center');
    bottone.style('justify-content', 'center');
    // Transizione per trasformazione, sfondo e colore testo
    bottone.style('transition', 'transform 0.2s ease, background 0.3s ease, color 0.3s ease, border 0.3s ease');
    bottone.style('z-index', '1001');

    bottone.mouseOver(() => bottone.style('transform', 'scale(1.03)'));
    bottone.mouseOut(() => bottone.style('transform', 'scale(1.0)'));
  });

  bottoneCountries.mousePressed(() => toggleFiltro('C'));
  bottoneTerritories.mousePressed(() => toggleFiltro('T'));

  // Stato iniziale
  aggiornaStileBottoneCountriesTerritori();
  aggiornaContenutoBottoniCountriesTerritori();
}

function toggleFiltro(tipo) {
  if (tipo === 'F') {
    filtroF = !filtroF;
    aggiornaStileBottone(bottoneF, filtroF, palette.coloriStatus['F']);
  } else if (tipo === 'PF') {
    filtroPF = !filtroPF;
    aggiornaStileBottone(bottonePF, filtroPF, palette.coloriStatus['PF']);
  } else if (tipo === 'NF') {
    filtroNF = !filtroNF;
    aggiornaStileBottone(bottoneNF, filtroNF, palette.coloriStatus['NF']);
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

function aggiornaStileBottoneCountriesTerritori() {
  // CONFIGURAZIONE
  const BG_ATTIVO = palette.nero;
  const BG_INATTIVO = palette.bianco;
  const BORDO = '1px solid ' + palette.bianco;

  // Bottone Countries
  if (filtroCountries === 'c') {
    bottoneCountries.style('background', BG_ATTIVO);
    bottoneCountries.style('border', BORDO);
  } else {
    bottoneCountries.style('background', BG_INATTIVO);
    bottoneCountries.style('border', BORDO);
  }

  // Bottone Territories
  if (filtroCountries === 't') {
    bottoneTerritories.style('background', BG_ATTIVO);
    bottoneTerritories.style('border', BORDO);
  } else {
    bottoneTerritories.style('background', BG_INATTIVO);
    bottoneTerritories.style('border', BORDO);
  }
}

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
  
  // Colore del testo in base allo stato del filtro: se attivo è palette.bianco, se inattivo è palette.nero
  const colorC = filtroCountries === 'c' ? palette.bianco : palette.nero;
  const colorT = filtroCountries === 't' ? palette.bianco : palette.nero;
  
  // 2. Genera il contenuto HTML per il bottone Countries
  let htmlCountries = `
    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
      <span style="
          color: ${colorC}; 
          font-family: 'NeueHaasDisplay', sans-serif; 
          font-weight: 400;
          font-size: 100px; 
          width: ${maxNumWidth};
          text-align: center;
          padding-right: 15px;
      ">${numCountries}</span>
      <div style="
          display: flex; 
          flex-direction: column;
          color: ${colorC};
          font-family: 'NeueHaasDisplay', sans-serif;
          font-weight: 500;
          font-size: 35px; 
          line-height: 1.2;
          align-items: flex-start;
      ">
          <span style="font-weight: bold;">N° Countries</span>
      </div>
    </div>
  `;
  
  // 3. Genera il contenuto HTML per il bottone Territories
  let htmlTerritories = `
    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
      <span style="
          color: ${colorT}; 
          font-family: 'NeueHaasDisplay', sans-serif; 
          font-weight: 400;
          font-size: 100px; 
          width: ${maxNumWidth};
          text-align: center;
          padding-right: 15px;
      ">${numTerritories}</span>
      <div style="
          display: flex; 
          flex-direction: column;
          color: ${colorT};
          font-family: 'NeueHaasDisplay', sans-serif;
          font-weight: 500;
          font-size: 35px; 
          line-height: 1.2;
          align-items: flex-start;
      ">
          <span style="font-weight: bold;">N° Territories</span>
          <span style="
          font-size: 13.5px; 
          font-weight: 400; 
          opacity: 0.6; 
          max-width: 200px;">
          ⁠non-sovereign areas and partially recognized or unrecognized states)</span>
      </div>
    </div>
  `;

  // 4. Inietta il contenuto nei bottoni HTML
  bottoneCountries.html(htmlCountries);
  bottoneTerritories.html(htmlTerritories);
}

// GESTIONE DATI
function cambiaAnno(nuovoIndice) {
  annoCorrente = anniUnici[nuovoIndice];
  filtraECalcolaDati(annoCorrente);
  
  // Aggiorna anche i conteggi Countries/Territories
  aggiornaContenutoBottoniCountriesTerritori();
  
  // Aggiorna l'URL se vuoi
  let urlParams = new URLSearchParams(window.location.search);
  urlParams.set('year', annoCorrente);
  window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
}

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

function estraiPaesiRegioneCorrente() {
  // 1. Filtra l'intera tabella 'data' per la regione corrente
  let righeRegione = data.getRows().filter(r => r.getString('Region') === regioneCorrente);
  
  // 2. Estrai i nomi di paesi/territori unici da queste righe
  let paesi = righeRegione.map(r => r.getString('Country/Territory'));
  
  // 3. Rimuovi i duplicati e ordina
  paesiRegioneCorrente = [...new Set(paesi)].sort();
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

// FUNZIONI GRAFICHE

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

function disegnaGriglia() {
  const puntiDiRiferimento = [0, 25, 50, 75, 100]; 
  let yPositions = []; // array per salvare le posizioni Y
  
  // 1. Ciclo per disegnare linee e numeri (0 e 100)
  for (let valore of puntiDiRiferimento) {
    let altezzaRelativa = map(valore, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
    let yLinea = yBarra - altezzaRelativa - incremento;
    yPositions.push(yLinea); // salva la posizione Y
    
    // Disegna la linea
    stroke(palette.bianco + 80);
    strokeWeight(1);
    noFill();
    line(graficoWidth*0.38, yLinea, graficoWidth*0.62, yLinea);
    
    // Disegna il valore (0 o 100)
    noStroke();
    fill(palette.bianco + 80); 
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
    fill(palette.bianco + 80);
    textSize(16);
    // Posiziona il testo poco sopra la linea del 100
    translate(graficoWidth*0.38, yLinea100 - 5); 
    textAlign(LEFT, BOTTOM);
    text("Total Score", 0, 0);
    pop();
  }
}

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
  
  let gradient = creaGradiente(xBarra, yCimaBarra, yBarra, larghezzaBarra, palette.coloriStatus[status]);
  drawingContext.fillStyle = gradient;
  rect(xBarra, yBarra, larghezzaBarra, -altezzaBarra - incremento);
  arc(xBarra + larghezzaBarra / 2, yCimaBarra, larghezzaBarra, larghezzaBarra, PI, TWO_PI);
  
  // Disegna il cerchio in cima
  fill(palette.bianco);
  ellipse(xBarra + larghezzaBarra/2, yCimaBarra, larghezzaBarra, larghezzaBarra);
  pop();
}

function disegnaBarre() {
  noStroke();
  
  // RESETTA l'array delle posizioni
  paesiConPosizioni = [];
  
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
      let nomePaese = paesiF[i].getString('Country/Territory');
      let opacita = 1;
      
      // Opacità per filtro Countries/Territories
      if (filtroCountries === 'c' && tipo === 'c') {
        opacita = 0.2;
      } else if (filtroCountries === 't' && tipo === 't') {
        opacita = 0.2;
      }
      
      // Opacità per paese cercato
      if (paeseCercato !== null && nomePaese !== paeseCercato) {
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
      let nomePaese = paesiPF[i].getString('Country/Territory');
      let opacita = 1;
      
      if (filtroCountries === 'c' && tipo === 'c') {
        opacita = 0.2;
      } else if (filtroCountries === 't' && tipo === 't') {
        opacita = 0.2;
      }

      if (paeseCercato !== null && nomePaese !== paeseCercato) {
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
      let nomePaese = paesiPF[i].getString('Country/Territory');
      let opacita = 1;
      
      if (filtroCountries === 'c' && tipo === 'c') {
        opacita = 0.2;
      } else if (filtroCountries === 't' && tipo === 't') {
        opacita = 0.2;
      }
      
      if (paeseCercato !== null && nomePaese !== paeseCercato) {
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

function disegnaTorciaRegione() {
  
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
  
  // TESTO NOME REGIONE SULLA TORCIA
  push();
  fill(palette.nero);
  noStroke();
  textFont(fontMedium);
  textAlign(CENTER, CENTER);
  
  // Dimensione del testo adattiva in base alla larghezza della torcia
  let dimensioneTesto = map(larghezzaTorcia, 100, 500, 16, 32);
  dimensioneTesto = constrain(dimensioneTesto, 16, 32);
  textSize(dimensioneTesto);
  
  // Posiziona il testo al centro della torcia, leggermente più in alto del centro
  let yTesto = yIniziaTorcia + altezzaTorcia * 0.27;
  
  // Ruota il testo di 90 gradi per allinearlo con la torcia verticale
  translate(centroSpazioX, yTesto);
  
  // Disegna il testo
  text(regioneCorrente, 0, 0);
  
  pop();
}

// CONTENUTO 

function drawBoxes() {
  let padding = 30;
  let interlinea = 22; 
  let raggio = 30;
  let testoLarghezza = boxW - (padding * 2);

  let smallText = "Questo è un testo introduttivo?";
  let paragrafo = getParagrafoCorrente();

  // --- 1. CALCOLO ALTEZZA DINAMICA BOX ---
  push();
  textSize(18);
  textFont(fontMedium);
  let smallTextH = calcolaAltezzaTesto(smallText, testoLarghezza, interlinea);
  
  textSize(16);
  textFont(fontRegular);
  let paragrafoH = calcolaAltezzaTesto(paragrafo, testoLarghezza, interlinea);
  pop();

  let gapTraTesti = 15;
  
  // ✅ CALCOLA ALTEZZA ESATTA DEL CONTENUTO
  let boxTestoH;
  if (visualizzaGrafico) {
    boxTestoH = windowHeight * 0.45;
  } else {
    // ✅ ALTEZZA ESATTA: padding + titolo + gap + paragrafo + padding
    boxTestoH = padding + smallTextH + gapTraTesti + paragrafoH + padding;
  }

  // --- 2. DISEGNO BOX SINISTRA ---
  strokeWeight(1);
  stroke(palette.bianco);
  fill(palette.nero);
  rect(boxX, boxY1Effettivo, boxW, boxTestoH, raggio);

  // Testo piccolo (Titolo)
  push();
  fill(palette.bianco);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(18);
  textFont(fontBold);
  textLeading(interlinea);
  text(smallText, boxX + padding, boxY1Effettivo + padding, testoLarghezza);
  pop();

  // CONTENUTO SWITCHABILE
  if (visualizzaGrafico) {
    disegnaGraficoMedia(boxX, boxY1Effettivo, boxW, boxTestoH, padding, smallTextH, gapTraTesti);
  } else {
    push();
    fill(palette.bianco);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    textFont(fontRegular);
    textLeading(interlinea);
    let paragrafoY = boxY1Effettivo + padding + smallTextH + gapTraTesti;
    text(paragrafo, boxX + padding, paragrafoY, testoLarghezza);
    pop();
  }
}

function calcolaAltezzaTesto(testo, maxWidth, leading) {
  let parole = testo.split(' ');
  let riga = '';
  let numeroRighe = 1;
  
  for (let n = 0; n < parole.length; n++) {
    let testRiga = riga + parole[n] + ' ';
    if (textWidth(testRiga) > maxWidth && n > 0) {
      riga = parole[n] + ' ';
      numeroRighe++;
    } else {
      riga = testRiga;
    }
  }
  return numeroRighe * leading;
}

function getParagrafoCorrente() {

  // Cerca la regione nel dataset
  let datiRegione = dataParagrafi[regioneCorrente];

  if (datiRegione) {
    // Cerca anno specifico
    if (datiRegione[annoCorrente]) {
      return datiRegione[annoCorrente];
    } 
  }

  return "Freedom in the World is Freedom House's flagship annual report, assessing the condition of political rights and civil liberties around the world.";
}

function creaBoxInfoPaese() {
  // ✅ CALCOLA LA DISTANZA TRA BARRA DI RICERCA E COUNTRIES
  let distanzaBarraCountries = 142 - 30 - 40*2; // boxY1(142) - yPosBarra(~30) - altezzaBarra(~40)
  // La barra di ricerca è a yPos=40, altezza ~40px → finisce a ~80px
  // Countries inizia a 142px → distanza = 142 - 80 = 62px circa
  
  // ✅ USA LA STESSA DISTANZA TRA TERRITORIES E INFO PAESE
  let distanzaTerritoriesInfo = distanzaBarraCountries;
  
  // Calcola posizioni
  let boxY1Local = 142; // Posizione Y di Countries
  let spacingLocal = 20; // Spacing tra Countries e Territories
  let boxRightHLocal = (windowHeight * 0.5 - 2 * spacingLocal) / 3;
  
  // Posizione Y di Territories
  let yTerritories = boxY1Local + boxRightHLocal + spacingLocal;
  
  // ✅ POSIZIONE Y INFO PAESE: dopo Territories + distanza corretta
  let yInizioInfoPaese = yTerritories + boxRightHLocal + distanzaTerritoriesInfo;
  
  // ✅ CALCOLA ALTEZZA DISPONIBILE FINO AL FONDO DELLA PAGINA
  let paddingDalFondo = 100; // Distanza dal fondo (dove iniziano i bottoni filtro)
  let altezzaInfoPaese = windowHeight - yInizioInfoPaese - paddingDalFondo;
  
  // Crea il div
  boxInfoPaese = createDiv('');
  
  // ✅ APPLICA POSIZIONE E DIMENSIONE CORRETTE
  boxInfoPaese.position(boxRightX, yInizioInfoPaese); 
  boxInfoPaese.size(boxW, altezzaInfoPaese);
  
  // Stile del box
  boxInfoPaese.style('border-radius', '30px');
  boxInfoPaese.style('background', palette.nero);
  boxInfoPaese.style('border', '1px solid ' + palette.bianco);
  boxInfoPaese.style('display', 'flex');
  boxInfoPaese.style('flex-direction', 'column');
  boxInfoPaese.style('align-items', 'center');
  boxInfoPaese.style('justify-content', 'center');
  boxInfoPaese.style('padding', '10px');
  boxInfoPaese.style('box-sizing', 'border-box');
  boxInfoPaese.style('z-index', '1001');
  boxInfoPaese.style('transition', 'all 0.3s ease');
  
  // Contenuto iniziale
  aggiornaBoxInfoPaese(null);
}

function aggiornaBoxInfoPaese(paeseData) {

  // Colori
  let colorPR = '#E0B8B8';
  let colorCL = '#B691C3';
  let colorEmpty = palette.grigio;

  if (!paeseData) {
    boxInfoPaese.html(`
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: ${palette.bianco};
        font-family: 'NeueHaasDisplay', sans-serif;
        font-size: 18px;
        opacity: 0.5;
      ">
        Hover over a country
      </div>
    `);
    return;
  }

  let nomePaese = paeseData.nome;
  let prScore = Math.round(paeseData.pr); // 0–100
  let clScore = Math.round(paeseData.cl);
  let totalScore = paeseData.score;

  if (prScore + clScore > 100) {
    clScore = 100 - prScore;
  }

  // Colore pallino
  function colorePallino(indice) {
    if (indice < prScore) return colorPR;
    if (indice < prScore + clScore) return colorCL;
    return colorEmpty;
  }

  // Griglia 10x10
  let htmlPallini = '';
  let diametroPallino = 17;
  let spazioPallini = 0.25;

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {

      // dal basso verso l’alto
      let indice = (9 - r) * 10 + c;

      htmlPallini += `
        <div style="
          width: ${diametroPallino}px;
          height: ${diametroPallino}px;
          border-radius: 50%;
          background-color: ${colorePallino(indice)};
          margin: ${spazioPallini}px;
        "></div>
      `;
    }
  }

  // HTML
  boxInfoPaese.html(`
    <div style="
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: 25px 25px;
      box-sizing: border-box;
    ">

      <div style="
        color: ${palette.bianco};
        font-family: 'NeueHaasDisplay', sans-serif;
        font-size: 36px;
        line-height: 1;
        font-weight: 500;
        margin-bottom: 25px;
      ">
        ${nomePaese}
      </div>

      <div style="
        display: flex;
        align-items: flex-start;
        gap: 15px;
        flex: 1;
      ">

      <!-- Pallini -->
      <div style="
          display: flex;
          flex-wrap: wrap;
          width: ${(diametroPallino + spazioPallini * 2) * 10}px;
          height: ${(diametroPallino + spazioPallini * 2) * 10}px;
        ">
          ${htmlPallini}
      </div>

      <!-- Legenda + Score -->
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: ${(diametroPallino + spazioPallini * 2) * 10}px;
      ">

        <!-- Badge in alto uno sotto l'altro con pallino -->
        <div style="display: flex; flex-direction: column; gap: 5px;">

          <!-- POLITICAL RIGHTS -->
          <div style="
            display: flex;
            align-items: center;
            gap: 5px;
            border: 0.8px solid ${palette.bianco};
            font-family: 'NeueHaasDisplay', sans-serif;
            border-radius: 15px;
            padding: 8px 10px;
            font-size: 14px;
            font-weight: 400;
            color: ${palette.bianco};
          ">
            <span style="
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: ${colorPR};  /* colore indicatore */
              display: inline-block;
            "></span>
            Political Rights
          </div>

          <!-- CIVIL LIBERTIES -->
          <div style="
            display: flex;
            align-items: center;
            gap: 5px;
            border: 0.8px solid ${palette.bianco};
            font-family: 'NeueHaasDisplay', sans-serif;
            border-radius: 15px;
            padding: 8px 10px;
            font-size: 14px;
            font-weight: 400;
            color: ${palette.bianco};
          ">
            <span style="
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: ${colorCL};
              display: inline-block;
            "></span>
            Civil Liberties
          </div>
        </div>

        <!-- Spazio tra badge e numero -->
        <div style="flex-grow: 1;"></div>

        <!-- Total score -->
        <div style="
          position: relative;  
          font-family: 'NeueHaasDisplay', sans-serif;
          font-size: 80px;
          line-height: 0.8;
          font-weight: 500; 
          color: ${palette.bianco};
        ">
          ${totalScore}
          <span style="
            position: absolute;
            font-size: 18px;
            font-weight: 400;
            align-self: flex-start;
          ">/100</span>
        </div>

        <div style="
          color: ${palette.bianco};
          font-family: 'NeueHaasDisplay', sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">TOTAL SCORE</div>

      </div>

        </div>
      </div>
    </div>
  `);
}

function creaBottoneSwitch() {
  bottoneSwitch = {
    x: 0,
    y: 0,
    w: 70,
    h: 36
  };
}

function drawToggle() {
  // Posizione del toggle
  let toggleW = 70;
  let toggleH = 36;
  
  let centroBox = boxX + boxW / 2;
  let toggleX = centroBox - toggleW / 2;
  let toggleY_center = toggleY + 20; 
  
  // Labels dinamiche

  let labelLeft = `About ${regioneCorrente}\nin ${annoCorrente}`; 
  let labelRight = "Average Score\n2013-2015";
  
  push();
  
  // --- SFONDO TOGGLE (BORDO) ---
  noFill();
  stroke(palette.bianco);
  strokeWeight(1);
  rect(toggleX, toggleY_center - toggleH/2, toggleW, toggleH, 30);
  
  // --- LABEL SINISTRA (Dinamica) ---
  noStroke();
  textFont(fontRegular);
  textSize(14);
  textAlign(RIGHT, CENTER); 
  textLeading(16); 
  
  if (!visualizzaGrafico) {
    fill(palette.bianco);
  } else {
    fill(150);
  }
  text(labelLeft, toggleX - 15, toggleY_center);
  
  // --- LABEL DESTRA ---
  textAlign(LEFT, CENTER);
  
  if (visualizzaGrafico) {
    fill(palette.bianco);
  } else {
    fill(150);
  }
  text(labelRight, toggleX + toggleW + 15, toggleY_center);
  
  // --- KNOB (PALLINO) ---
  fill(palette.bianco);
  noStroke();
  let knobX = (!visualizzaGrafico) ? toggleX + 18 : toggleX + toggleW - 18; // Leggermente aggiustato per estetica
  circle(knobX, toggleY_center, toggleH - 8);
  
  pop();
  
  let hitboxPadding = 120; // Aumentato leggermente perché la label ora potrebbe essere più lunga
  bottoneSwitch = {
    x: toggleX - hitboxPadding,
    y: toggleY_center - toggleH/2,
    w: toggleW + (hitboxPadding * 2),
    h: toggleH
  };
}

function aggiornaToggle(slider, labelText, labelChart, sliderWidth) {
  if (visualizzaGrafico) {
    // Modalità Chart - slider a destra
    let nuovaLeft = sliderWidth + 6; // 6px = margine dal bordo
    slider.style('left', nuovaLeft + 'px');
    labelText.style('color', palette.bianco); // Text diventa bianco
    labelChart.style('color', palette.nero); // Chart diventa nero (sopra lo slider)
  } else {
    // Modalità Text - slider a sinistra
    slider.style('left', '4px');
    labelText.style('color', palette.nero); // Text diventa nero (sopra lo slider)
    labelChart.style('color', palette.bianco); // Chart diventa bianco
  }
}

function aggiornaTestoBottone() {
  if (visualizzaGrafico) {
    bottoneSwitch.html('📊 Show Text');
  } else {
    bottoneSwitch.html('📈 Show Chart');
  }
}

function calcolaMediaPerAnni() {
  datiMediaAnni = [];
  
  // Filtra tutte le righe per la regione corrente
  let righeRegione = data.getRows().filter(r => r.getString('Region') === regioneCorrente);
  
  // Trova tutti gli anni unici
  let anniSet = new Set();
  righeRegione.forEach(r => anniSet.add(r.getNum('Edition')));
  let anni = [...anniSet].sort((a, b) => a - b);
  
  // Calcola la media per ogni anno
  anni.forEach(anno => {
    let righeAnno = righeRegione.filter(r => r.getNum('Edition') === anno);
    let somma = 0;
    let count = 0;
    
    righeAnno.forEach(r => {
      let total = r.getNum('TOTAL');
      if (!isNaN(total)) {
        somma += total;
        count++;
      }
    });
    
    if (count > 0) {
      datiMediaAnni.push({
        anno: anno,
        media: somma / count
      });
    }
  });
}

function disegnaGraficoMedia(boxX, boxY1, boxW, boxH, padding, smallTextH, gap) {
  if (datiMediaAnni.length === 0) return;
  
  let graficoX = boxX + padding;
  let graficoY = boxY1 + padding + smallTextH + gap;
  let graficoW = boxW - (padding * 2);
  let graficoH = boxH - padding * 2 - smallTextH - gap - 30; // Spazio ridotto per le etichette
  
  let numBarre = datiMediaAnni.length;
  let spazioBarra = graficoW / numBarre;
  let larghezzaBarra = spazioBarra * 0.4; // 40% dello spazio disponibile (più strette)
  let margineBarr = (spazioBarra - larghezzaBarra) / 2; // Centra la barra
  
  // Disegna le barre
  noStroke();
  
  for (let i = 0; i < datiMediaAnni.length; i++) {
    let media = datiMediaAnni[i].media;
    let anno = datiMediaAnni[i].anno;
    
    // Calcola la posizione X della barra
    let xBarra = graficoX + i * spazioBarra + margineBarr;
    
    // Calcola l'altezza della barra (da 0 a 100)
    let altezzaBarra = map(media, 0, 100, 0, graficoH);
    let yBaseBarra = graficoY + graficoH;
    let yCimaBarra = yBaseBarra - altezzaBarra;
    
    // Determina il colore in base alla media
    let colori;
    if (media >= 65) {
      colori = palette.coloriStatus['F'];
    } else if (media >= 35) {
      colori = palette.coloriStatus['PF'];
    } else {
      colori = palette.coloriStatus['NF'];
    }
    
    // Determina l'opacità in base all'anno corrente
    let opacita = (anno === annoCorrente) ? 1 : 0.3;
    
    // Disegna la barra con gradiente
    push();
    if (opacita < 1) {
      drawingContext.globalAlpha = opacita;
    }
    
    let gradient = creaGradiente(xBarra, yCimaBarra, yBaseBarra, larghezzaBarra, colori);
    drawingContext.fillStyle = gradient;
    
    // Rettangolo della barra
    rect(xBarra, yBaseBarra, larghezzaBarra, -altezzaBarra);
    
    // Semicerchio in cima
    arc(xBarra + larghezzaBarra / 2, yCimaBarra, larghezzaBarra, larghezzaBarra, PI, TWO_PI);
    
    // Pallino bianco in cima (stesso diametro della larghezza della barra)
    fill(palette.bianco);
    ellipse(xBarra + larghezzaBarra/2, yCimaBarra, larghezzaBarra, larghezzaBarra);
    pop();
    
    // Etichetta anno VERTICALE sotto la barra (INVERTITA)
    push();
    fill(palette.bianco);
    if (anno !== annoCorrente) {
      drawingContext.globalAlpha = 0.3;
    }
    noStroke();
    textAlign(CENTER, TOP);
    textSize(11);
    textFont(fontRegular);
    
    // Trasla e ruota per testo verticale INVERTITO
    let annoStr = anno.toString();
    translate(xBarra + larghezzaBarra/2, yBaseBarra + 5);
    rotate(-HALF_PI); // Ruota di -90 gradi (al contrario)
    textAlign(RIGHT, CENTER);
    text(annoStr, 0, 0);
    
    pop();
  }
  
  // Linee di riferimento orizzontali (0, 25, 50, 75, 100)
  push();
  stroke(palette.bianco + '40');
  strokeWeight(0.5);
  textSize(9);
  fill(palette.bianco + '80');
  noStroke();
  textAlign(RIGHT, CENTER);
  
  for (let valore of [0, 25, 50, 75, 100]) {
    let yLinea = map(valore, 0, 100, graficoY + graficoH, graficoY);
    
    stroke(palette.bianco + '60');
    line(graficoX, yLinea, graficoX + graficoW, yLinea);
    
    noStroke();
    text(valore, graficoX - 5, yLinea);
  }
  pop();
}

// BARRA DI RICERCA 

function aggiornaPosizioneContainerPaese() {
  if (paeseCercato === null) return;
  
  let container = document.getElementById('containerPaeseCercato');
  if (!container) return;
  
  // Trova il paese nell'array delle posizioni
  let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
  
  if (paese) {
    let offsetX = 10;
    container.style.left = (paese.centroPallinoX + paese.raggio + offsetX) + 'px';
    container.style.top = (paese.centroPallinoY - 15) + 'px';
    container.style.display = 'flex';
  } else {
    container.style.display = 'none';
  }
}

// CALLBACKS

function vaiAPaginaPaese(paese, inputRicerca, suggerimentiDiv) {
  // Imposta il paese cercato invece di reindirizzare
  paeseCercato = paese;
  suggerimentiDiv.style('display', 'none');
  inputRicerca.value('');
  
  // Mostra il nome del paese sopra la barra
  let container = document.getElementById('containerPaeseCercato');
  if (container) {
    container.style.display = 'flex';
    let nomeDiv = document.getElementById('nomePaeseCercato');
    if (nomeDiv) {
      nomeDiv.innerHTML = paese;
    }
  }
  
  // ✅ AGGIUNGI: Trova il paese nei dati e aggiorna il box info
  let rigaPaese = datiFiltrati.find(r => r.getString('Country/Territory') === paese);
  
  if (rigaPaese) {
    // Crea un oggetto con i dati del paese (come in paesiConPosizioni)
    let paeseData = {
      nome: rigaPaese.getString('Country/Territory'),
      score: rigaPaese.getNum('TOTAL'),
      pr: rigaPaese.getNum('PR'),
      cl: rigaPaese.getNum('CL')
    };
    
    // Aggiorna il box info
    aggiornaBoxInfoPaese(paeseData);
  }
}

// EVENTI MOUSE

function mouseMoved() {
  // Debug: stampa le aree degli anni
  if (frameCount % 60 === 0) {
    console.log("areeAnni:", areeAnni);
    console.log("xPosAnni:", xPosAnni, "yPosAnni:", yPosAnni);
  }

  // Hover sul toggle
  if (bottoneSwitch && 
      mouseX >= bottoneSwitch.x && 
      mouseX <= bottoneSwitch.x + bottoneSwitch.w &&
      mouseY >= bottoneSwitch.y && 
      mouseY <= bottoneSwitch.y + bottoneSwitch.h) {
    cursor(HAND);
    return;
  }
  
  // ✅ BLOCCA L'HOVER SE C'È UN FILTRO COUNTRIES/TERRITORIES ATTIVO
  if (filtroCountries !== null) {
    let hoverConsentito = false;
    
    // Controlla solo i paesi che corrispondono al filtro
    for (let i = paesiConPosizioni.length - 1; i >= 0; i--) {
      let barra = paesiConPosizioni[i];
      
      // Trova il tipo del paese (c o t)
      let rigaPaese = datiFiltrati.find(r => r.getString('Country/Territory') === barra.nome);
      if (!rigaPaese) continue;
      
      let tipoPaese = rigaPaese.getString('C/T');
      
      // Verifica se il paese corrisponde al filtro
      let corrispondeFiltro = false;
      if (filtroCountries === 'c' && tipoPaese === 't') {
        corrispondeFiltro = true; // Filtro Countries attivo, quindi mostra solo Territories
      } else if (filtroCountries === 't' && tipoPaese === 'c') {
        corrispondeFiltro = true; // Filtro Territories attivo, quindi mostra solo Countries
      }
      
      if (!corrispondeFiltro) continue; // Salta questo paese
      
      // Controlla hover sulla barra
      if (mouseX >= barra.x && 
          mouseX <= barra.x + barra.larghezza &&
          mouseY >= barra.y && 
          mouseY <= yBarra) {
        indiceHover = barra.indice;
        cursor(HAND);
        hoverConsentito = true;
        break;
      }
      
      // Controlla hover sul pallino
      let distanza = dist(mouseX, mouseY, barra.centroPallinoX, barra.centroPallinoY);
      if (distanza <= barra.raggio) {
        indiceHover = barra.indice;
        cursor(HAND);
        hoverConsentito = true;
        break;
      }
    }
    
    // Se non c'è hover consentito, controlla solo gli anni
    if (!hoverConsentito) {
      indiceHover = -1; // Reset hover
      let sopraAnno = isMouseSopraAnno(areeAnni, xPosAnni, yPosAnni, mouseX, mouseY);
      if (sopraAnno) {
        cursor(HAND);
      } else {
        cursor(ARROW);
      }
    }
    return; // ← IMPORTANTE: esci dalla funzione
  }
  
  // ✅ BLOCCA L'HOVER SE C'È UN PAESE CERCATO
  if (paeseCercato !== null) {
    // Controlla solo se il mouse è sopra il paese cercato
    let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
    
    if (paese) {
      // Verifica se il mouse è sopra la barra del paese cercato
      if (mouseX >= paese.x && 
          mouseX <= paese.x + paese.larghezza &&
          mouseY >= paese.y && 
          mouseY <= yBarra) {
        cursor(HAND);
        return;
      }
      
      // Verifica se il mouse è sopra il pallino del paese cercato
      let distanza = dist(mouseX, mouseY, paese.centroPallinoX, paese.centroPallinoY);
      if (distanza <= paese.raggio) {
        cursor(HAND);
        return;
      }
    }
    
    // Controlla solo gli anni
    let sopraAnno = isMouseSopraAnno(areeAnni, xPosAnni, yPosAnni, mouseX, mouseY);
    if (sopraAnno) {
      cursor(HAND);
      return;
    }
    
    // Altrimenti cursore normale
    cursor(ARROW);
    return;
  }
  
  // ✅ COMPORTAMENTO NORMALE (solo se NON c'è filtro e NON c'è paese cercato)
  // Reset
  let trovato = false;
  indiceHover = -1;
  let nuovaRegioneHover = null;
  
  // 1. PRIORITÀ: Controlla le barre
  for (let i = paesiConPosizioni.length - 1; i >= 0; i--) {
    let barra = paesiConPosizioni[i];
    
    if (mouseX >= barra.x && 
        mouseX <= barra.x + barra.larghezza &&
        mouseY >= barra.y && 
        mouseY <= yBarra) {
      indiceHover = barra.indice;
      cursor(HAND);
      return;
    }
    
    let distanza = dist(mouseX, mouseY, barra.centroPallinoX, barra.centroPallinoY);
    if (distanza <= barra.raggio) {
      indiceHover = barra.indice;
      cursor(HAND);
      return;
    }
  }
  
  // 2. Controlla le torce
  for (let area of areeTorce) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      regioneHover = area.regione;
      cursor(HAND);
      return;
    }
  }
  
  // 3. Controlla gli anni
  let sopraAnno = isMouseSopraAnno(areeAnni, xPosAnni, yPosAnni, mouseX, mouseY);
  
  if (sopraAnno) {
    cursor(HAND);
    return;
  }
  
  // 4. Nessun hover
  cursor(ARROW);
}

function mousePressed() {
  // Click sul toggle
  if (bottoneSwitch && 
      mouseX >= bottoneSwitch.x && 
      mouseX <= bottoneSwitch.x + bottoneSwitch.w &&
      mouseY >= bottoneSwitch.y && 
      mouseY <= bottoneSwitch.y + bottoneSwitch.h) {
    visualizzaGrafico = !visualizzaGrafico;
    return;
  }
  
  // Controlla se è stato cliccato su una torcia
  for (let area of areeTorce) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      vaiAPaginaRegione(area.regione);
      break;
    }
  }

  let indiceAnnoCliccato = verificaClickAnno(
    areeAnni,
    xPosAnni,
    yPosAnni,
    mouseX, 
    mouseY  
  );

  if (indiceAnnoCliccato !== null) {
    cambiaAnno(indiceAnnoCliccato);
    scrollAccumulato = indiceAnnoCliccato * pixelPerAnno;
    progressoScroll = 0;
  }
}

function mouseClicked() {
  // Se il click è sul container del paese cercato, non fare nulla
  let container = document.getElementById('containerPaeseCercato');
  if (container && container.style.display !== 'none') {
    let rect = container.getBoundingClientRect();
    if (mouseX >= rect.left && mouseX <= rect.right &&
        mouseY >= rect.top && mouseY <= rect.bottom) {
      return;
    }
  }
  
  // ✅ SE C'È UN FILTRO COUNTRIES/TERRITORIES, gestisci SOLO i paesi corrispondenti
  if (filtroCountries !== null) {
    for (let i = paesiConPosizioni.length - 1; i >= 0; i--) {
      let barra = paesiConPosizioni[i];
      
      // Trova il tipo del paese
      let rigaPaese = datiFiltrati.find(r => r.getString('Country/Territory') === barra.nome);
      if (!rigaPaese) continue;
      
      let tipoPaese = rigaPaese.getString('C/T');
      
      // Verifica se il paese corrisponde al filtro
      let corrispondeFiltro = false;
      if (filtroCountries === 'c' && tipoPaese === 't') {
        corrispondeFiltro = true;
      } else if (filtroCountries === 't' && tipoPaese === 'c') {
        corrispondeFiltro = true;
      }
      
      if (!corrispondeFiltro) continue;
      
      // Verifica click sulla barra
      if (mouseX >= barra.x && 
          mouseX <= barra.x + barra.larghezza &&
          mouseY >= barra.y && 
          mouseY <= yBarra) {
        
        const countryNameEncoded = encodeURIComponent(barra.nome);
        const destinazioneURL = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
        window.location.href = destinazioneURL;
        return;
      }
      
      // Verifica click sul pallino
      let distanza = dist(mouseX, mouseY, barra.centroPallinoX, barra.centroPallinoY);
      if (distanza < barra.raggio + 5) {
        const countryNameEncoded = encodeURIComponent(barra.nome);
        const destinazioneURL = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
        window.location.href = destinazioneURL;
        return;
      }
    }
    
    // Se clicchi altrove (non su paese consentito), non fare nulla
    return;
  }
  
  // SE C'È UN PAESE CERCATO, gestisci SOLO quello
  if (paeseCercato !== null) {
    let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
    
    if (paese) {
      // Verifica click sulla barra del paese cercato
      if (mouseX >= paese.x && 
          mouseX <= paese.x + paese.larghezza &&
          mouseY >= paese.y && 
          mouseY <= yBarra) {
        
        const countryNameEncoded = encodeURIComponent(paese.nome);
        const destinazioneURL = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
        window.location.href = destinazioneURL;
        return;
      }
      
      // Verifica click sul pallino del paese cercato
      let distanza = dist(mouseX, mouseY, paese.centroPallinoX, paese.centroPallinoY);
      if (distanza < paese.raggio + 5) {
        const countryNameEncoded = encodeURIComponent(paese.nome);
        const destinazioneURL = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
        window.location.href = destinazioneURL;
        return;
      }
    }
    
    // Se clicchi altrove (non sul paese cercato), non fare nulla
    return;
  }
  
  // COMPORTAMENTO NORMALE
  for (let i = paesiConPosizioni.length - 1; i >= 0; i--) {
    let barra = paesiConPosizioni[i];
    
    if (mouseX >= barra.x && 
        mouseX <= barra.x + barra.larghezza &&
        mouseY >= barra.y && 
        mouseY <= yBarra) {
      
      const countryNameEncoded = encodeURIComponent(barra.nome);
      const destinazioneURL = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
      window.location.href = destinazioneURL;
      return;
    }
    
    let distanza = dist(mouseX, mouseY, barra.centroPallinoX, barra.centroPallinoY);
    if (distanza < barra.raggio + 5) {
      const countryNameEncoded = encodeURIComponent(barra.nome);
      const destinazioneURL = `paese.html?country=${countryNameEncoded}&year=${annoCorrente}`;
      window.location.href = destinazioneURL;
      return;
    }
  }
}

function keyPressed() {
  let indiceCorrente = anniUnici.indexOf(annoCorrente);
  
  if (keyCode === DOWN_ARROW) {
    if (indiceCorrente < anniUnici.length - 1) {
      let nuovoIndice = indiceCorrente + 1;
      cambiaAnno(nuovoIndice);
      scrollAccumulato = nuovoIndice * pixelPerAnno;
      progressoScroll = 0;
    }
    return false;
  } 
  else if (keyCode === UP_ARROW) {
    if (indiceCorrente > 0) {
      let nuovoIndice = indiceCorrente - 1;
      cambiaAnno(nuovoIndice);
      scrollAccumulato = nuovoIndice * pixelPerAnno;
      progressoScroll = 0;
    }
    return false;
  }
}

function mouseWheel(event) {
  let risultato = gestioneMouseWheel(
    event,
    anniUnici,
    annoCorrente,
    scrollAccumulato,
    pixelPerAnno,
    progressoScroll,
    cambiaAnno
  );
  
  scrollAccumulato = risultato.scrollAccumulato;
  progressoScroll = risultato.progressoScroll;
  
  return false;
}

function disegnaEtichetteHover() {
  if (indiceHover === -1) return;
  
  let paeseHover = paesiConPosizioni.find(p => p.indice === indiceHover);
  if (!paeseHover) return;
  
  push();
  fill(palette.bianco);
  noStroke();
  textSize(20);
  textFont(fontMedium);
  textAlign(LEFT, CENTER);
  
  let offsetX = 15;
  text(paeseHover.nome, paeseHover.centroPallinoX + offsetX, paeseHover.centroPallinoY);
  
  pop();
}