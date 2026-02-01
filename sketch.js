// variabili globali
let data;
let torcia;
let datiFiltrati;

// // variabili per bottoni
// let iconaAboutUs, iconaAboutFh, iconaHome, iconaLente, iconaClose; // icone generali
// let iconaArrUp, iconaArrDown, iconaArrLeft, iconaArrRight; // icone frecce

// Font
let fontRegular, fontMedium, fontBold;

// Icone
let iconaUs, iconaFh, iconaArrUp;

// Dimensioni
let graficoWidth, annoWidth;
let yBarra, altezzaMassimaBarra;
let incremento = 50;
let minTotalScore = 0;
let maxTotalScore = 100;

// Filtri status
let filtroF = true;
let filtroPF = true;
let filtroNF = true;
let bottoneF, bottonePF, bottoneNF;

// Anni
let anniUnici = [];
let annoCorrente;
let scrollAccumulato = 0;
let pixelPerAnno = 200;
let progressoScroll = 0;
let areeAnni = [];
let xPosAnni, yPosAnni;

// Ricerca
let paesiUnici = [];
let paeseCercato = null;
let elementiRicerca;

// Dati paesi e regioni
let paesiConPosizioni = [];
let maxPaesiPerRegione = {};
let regioneHover = null;
let areeTorce = [];
let areeRegioni = [];


function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  torcia = loadImage("img/torcia.png");
  
  fontRegular = loadFont("font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("font/NeueHaasDisplayBold.ttf");
  
  iconaUs = loadImage("img/icone/person.png");
  iconaFh = loadImage("img/icone/info.png");
  iconaArrUp = loadImage("img/icone/frecce/arrowup.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Dimensioni responsive
  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;
  altezzaMassimaBarra = height * 0.5;
  yBarra = height * 0.75;
  
  // Inizializza dati
  maxPaesiPerRegione = calcolaMaxPaesiPerRegione(data);
  paesiUnici = estraiPaesiUnici(data);
  anniUnici = estraiAnniUnici(data);
  annoCorrente = anniUnici.length > 0 ? anniUnici[0] : null;
  datiFiltrati = filtraDatiPerAnno(data, annoCorrente);
  
  // Crea interfaccia
  creaInterfaccia();
}

function draw() {
  background(palette.nero);
  
  if (datiFiltrati && datiFiltrati.length > 0) {
    // Disegna griglia
    disegnaGriglia(graficoWidth, yBarra, altezzaMassimaBarra, incremento, minTotalScore, maxTotalScore);
    
    // Disegna barre
    let risultatoBarre = disegnaBarre(
      datiFiltrati,
      filtroF,
      filtroPF,
      filtroNF,
      maxPaesiPerRegione,
      yBarra,
      altezzaMassimaBarra,
      incremento,
      minTotalScore,
      maxTotalScore,
      graficoWidth,
      regioneHover,
      paeseCercato
    );
    
    paesiConPosizioni = risultatoBarre.paesiConPosizioni;
    
    // Disegna torce ed etichette
    let risultatoTorce = disegnaTorceEEtichette(
      risultatoBarre.etchetteRegioni,
      torcia,
      maxPaesiPerRegione,
      yBarra,
      fontMedium,
      risultatoBarre.larghezzaBarra,
      regioneHover,
      paeseCercato,
      datiFiltrati
    );
    
    areeTorce = risultatoTorce.areeTorce;
    areeRegioni = risultatoTorce.areeRegioni;
    
    // Disegna anno
    let risultatoAnno = disegnaEtichettaAnno(graficoWidth, annoWidth, fontRegular, anniUnici, annoCorrente, progressoScroll);
    areeAnni = risultatoAnno.areeAnni;
    xPosAnni = risultatoAnno.xPos;
    yPosAnni = risultatoAnno.yPos;
    
    // Aggiorna posizione paese cercato
    aggiornaPosizioneContainerPaese(paeseCercato, paesiConPosizioni);
    
  } else {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(`Nessun dato trovato per l'anno ${annoCorrente}.`, width/2, height/2);
  }
}

// FUNZIONI DI SETUP
function creaInterfaccia() {
  // Bottoni navigazione
  creaBottoneStandard(margine, margine, iconaArrUp, 'html/intro.html');
  creaBottoneStandard(width - diametro - margine, margine, iconaFh, 'html/aboutFreedomHouse.html');
  creaBottoneStandard(width - (diametro * 2) - margine*3/2, margine, iconaUs, 'html/aboutUs.html');
  
  // Barra ricerca
  elementiRicerca = creaBarraRicerca(graficoWidth, paesiUnici, vaiAPaginaPaese);
  
  // Aggiungi evento al bottone cancella
  elementiRicerca.bottoneCancella.mousePressed(() => {
    paeseCercato = null;
    elementiRicerca.inputRicerca.value('');
    let container = document.getElementById('containerPaeseCercato');
    if (container) {
      container.style.display = 'none';
    }
  });
  
  // Bottoni filtro
  creaBottoniFiltro();
}

function creaBottoniFiltro() {
  let yPos = 50;
  let spaziatura = 15;
  
  // Crea bottoni temporanei per misurare
  bottoneF = creaBottoneFiltro('FREE', 0, yPos, palette.coloriStatus['F'], 'F', toggleFiltro);
  let larghezzaF = bottoneF.elt.offsetWidth;
  
  bottonePF = creaBottoneFiltro('PARTIALLY FREE', 0, yPos, palette.coloriStatus['PF'], 'PF', toggleFiltro);
  let larghezzaPF = bottonePF.elt.offsetWidth;
  
  bottoneNF = creaBottoneFiltro('NOT FREE', 0, yPos, palette.coloriStatus['NF'], 'NF', toggleFiltro);
  let larghezzaNF = bottoneNF.elt.offsetWidth;
  
  // Calcola posizione centrata
  let larghezzaTotaleBlocco = larghezzaF + larghezzaPF + larghezzaNF + (spaziatura * 2);
  let xInizio = graficoWidth - larghezzaTotaleBlocco - 75;
  
  // Riposiziona
  bottoneF.position(xInizio, yPos);
  
  let xPF = xInizio + larghezzaF + spaziatura;
  bottonePF.position(xPF, yPos);
  
  let xNF = xPF + larghezzaPF + spaziatura;
  bottoneNF.position(xNF, yPos);
}

// CALLBACKS
function toggleFiltro(tipo) {
  if (tipo === 'F') {
    filtroF = !filtroF;
    aggiornaStileBottoneFiltro(bottoneF, filtroF, palette.coloriStatus['F']);
  } else if (tipo === 'PF') {
    filtroPF = !filtroPF;
    aggiornaStileBottoneFiltro(bottonePF, filtroPF, palette.coloriStatus['PF']);
  } else if (tipo === 'NF') {
    filtroNF = !filtroNF;
    aggiornaStileBottoneFiltro(bottoneNF, filtroNF, palette.coloriStatus['NF']);
  }
}

function vaiAPaginaPaese(paese, inputRicerca, suggerimentiDiv) {
  paeseCercato = paese;
  suggerimentiDiv.style('display', 'none');
  inputRicerca.value('');
  
  let container = document.getElementById('containerPaeseCercato');
  if (container) {
    container.style.display = 'flex';
    let nomeDiv = document.getElementById('nomePaeseCercato');
    if (nomeDiv) {
      nomeDiv.innerHTML = paese;
    }
  }
}

function cambiaAnno(nuovoIndice) {
  if (nuovoIndice >= 0 && nuovoIndice < anniUnici.length) {
    annoCorrente = anniUnici[nuovoIndice];
    datiFiltrati = filtraDatiPerAnno(data, annoCorrente);
  }
}

function clickPaese(paese, anno) {
  const countryNameEncoded = encodeURIComponent(paese);
  window.location.href = `../html/paese.html?country=${countryNameEncoded}&year=${anno}`;
}

function clickRegione(regione, anno) {
  const regioneEncoded = encodeURIComponent(regione);
  // Se regioni.html è nella cartella html/
  window.location.href = `../html/regioni.html?region=${regioneEncoded}&year=${anno}`;
}

// EVENTI MOUSE
function mouseMoved() {
  // Blocca l'hover se il mouse è sopra la ricerca
  if (elementiRicerca.isMouseInRicerca()) {
    cursor(ARROW);
    return;
  }
  
  let risultato = gestioneMouseMoved(
    paeseCercato,
    paesiConPosizioni,
    datiFiltrati,
    areeRegioni,
    areeTorce,
    yBarra,
    altezzaMassimaBarra,
    incremento,
    minTotalScore,
    maxTotalScore
  );
  
  regioneHover = risultato.regioneHover;
  
  // Verifica se il mouse è sopra un anno
  let indiceAnnoHover = verificaClickAnno(areeAnni, xPosAnni, yPosAnni);
  
  if (indiceAnnoHover !== null) {
    cursor(HAND);
  } else {
    cursor(risultato.cursore);
  }
}

function mousePressed() {
  // Blocca i click se il mouse è sopra la ricerca
  if (elementiRicerca.isMouseInRicerca()) {
    return;
  }
  
  // Prima verifica se hai cliccato su un anno
  let indiceAnnoCliccato = verificaClickAnno(areeAnni, xPosAnni, yPosAnni);
  
  if (indiceAnnoCliccato !== null) {
    // Cambia anno
    cambiaAnno(indiceAnnoCliccato);
    
    // Aggiorna anche lo scroll accumulato per evitare salti
    scrollAccumulato = indiceAnnoCliccato * pixelPerAnno;
    progressoScroll = 0;
    
    return;
  }
  
  // Se non hai cliccato su un anno, procedi con il click normale
  gestioneMousePressed(
    paeseCercato,
    paesiConPosizioni,
    datiFiltrati,
    areeRegioni,
    areeTorce,
    yBarra,
    altezzaMassimaBarra,
    incremento,
    minTotalScore,
    maxTotalScore,
    annoCorrente,
    clickPaese,
    clickRegione
  );
}

function mouseWheel(event) {
  // Blocca lo scroll se il mouse è sopra la ricerca
  if (elementiRicerca.isMouseInRicerca()) {
    return true; // Permette lo scroll dei suggerimenti
  }
  
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

// funzione per cambiare anno con le frecce della tastiera
function keyPressed() {
  let indiceCorrente = anniUnici.indexOf(annoCorrente);
  
  if (keyCode === DOWN_ARROW) {
    // Freccia su: anno successivo
    if (indiceCorrente < anniUnici.length - 1) {
      let nuovoIndice = indiceCorrente + 1;
      cambiaAnno(nuovoIndice);
      
      // Aggiorna scroll per animazione fluida
      scrollAccumulato = nuovoIndice * pixelPerAnno;
      progressoScroll = 0;
    }
    return false; // Previene lo scroll della pagina
  } 
  else if (keyCode === UP_ARROW) {
    // Freccia giù: anno precedente
    if (indiceCorrente > 0) {
      let nuovoIndice = indiceCorrente - 1;
      cambiaAnno(nuovoIndice);
      
      // Aggiorna scroll per animazione fluida
      scrollAccumulato = nuovoIndice * pixelPerAnno;
      progressoScroll = 0;
    }
    return false; // Previene lo scroll della pagina
  }
}