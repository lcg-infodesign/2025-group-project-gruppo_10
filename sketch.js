// sketch pagina home

// variabili globali
let data;
let torcia;
let datiFiltrati;

// Font
let fontRegular, fontMedium, fontBold;

// Icone
let iconaUs, iconaFh, iconaArrUp, iconaClose;

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
  iconaClose = loadImage("img/icone/close.png");
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
  frameRate(30);
  
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
      risultatoBarre.etichetteRegioni,
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
    fill(palette.bianco);
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
  
  const margineSinistroIntro = 30;
  const spaziaturaDopoIntro = 20;
  const xPosInizioBarra = margineSinistroIntro + diametro + spaziaturaDopoIntro;
  const larghezzaBarra = graficoWidth - xPosInizioBarra - 50;
  
  elementiRicerca = creaBarraRicerca({
    xPos: xPosInizioBarra,
    yPos: 30,
    larghezza: larghezzaBarra,
    paesiUnici: paesiUnici,
    callbackSelezionePaese: vaiAPaginaPaese,
    placeholder: 'Look up Country or Territory',
    zIndex: 1000
  });
  
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

// BOTTONI FILTRO

function creaBottoneFiltro(testo, x, y, colori, tipo, callback) {
  let bottone = createButton(testo);
  bottone.position(x, y);
  
  bottone.style('padding', '4px 30px 2px 30px');
  bottone.style('font-size', '16px');
  bottone.style('font-weight', 'bold');
  bottone.style('border', 'none');
  bottone.style('cursor', 'pointer');
  bottone.style('border-radius', '25px');
  bottone.style('z-index', '1002');
  
  let gradienteBordo;
  if (colori.length === 2) {
    gradienteBordo = `linear-gradient(to right, ${colori[0]})`;
  } else if (colori.length === 3) {
    gradienteBordo = `linear-gradient(45deg, ${colori[0]}, ${colori[1]})`;
  }
  
  bottone.style('background', `${gradienteBordo}, linear-gradient(${colori[2] || palette.nero}, ${colori[2] || palette.nero})`);
  bottone.style('border-width', '1px');
  bottone.style('border-style', 'solid');
  bottone.style('background-clip', 'padding-box, border-box');
  bottone.style('background-origin', 'border-box');
  bottone.style('color', palette.nero);
  
  bottone.mousePressed(() => callback(tipo));
  
  bottone.mouseOver(() => {
    bottone.style('background', palette.bianco);
    bottone.style('border', '1px solid ' + palette.nero);
    bottone.style('color', palette.nero);
    bottone.style('transform', 'scale(1.1)'); 
    bottone.style('transition', 'all 0.2s');
  });
  
  bottone.mouseOut(() => {
    bottone.style('background', `${gradienteBordo}, linear-gradient(${colori[2] || palette.nero}, ${colori[2] || palette.nero})`);
    bottone.style('border-width', '1px');
    bottone.style('border-style', 'solid');
    bottone.style('background-clip', 'padding-box, border-box');
    bottone.style('background-origin', 'border-box');
    bottone.style('color', palette.nero);
    bottone.style('transform', 'scale(1.1)'); 
  });
  
  return bottone;
}

function aggiornaStileBottoneFiltro(bottone, attivo, colori) {
  let btnElt = bottone.elt;
  
  let gradienteBordo;
  if (colori.length === 2) {
    gradienteBordo = `linear-gradient(to right, ${colori[0]})`;
  } else if (colori.length === 3) {
    gradienteBordo = `linear-gradient(45deg, ${colori[0]}, ${colori[1]})`;
  }
  
  if (attivo) {
    // ✅ STATO ATTIVO: Gradiente colorato
    btnElt.style.background = `${gradienteBordo}, linear-gradient(${colori[2] || palette.nero}, ${colori[2] || palette.nero})`;
    btnElt.style.backgroundClip = 'padding-box, border-box';
    btnElt.style.backgroundOrigin = 'border-box';
    btnElt.style.borderWidth = '1px';
    btnElt.style.borderStyle = 'solid';
    btnElt.style.opacity = '1';
    btnElt.style.color = palette.nero;
    
  } else {
    // ✅ STATO INATTIVO: Nero con bordo bianco
    btnElt.style.background = palette.nero;
    btnElt.style.border = '1px solid ' + palette.bianco;
    btnElt.style.opacity = '0.8';
    btnElt.style.color = palette.bianco;
    btnElt.style.backgroundClip = 'border-box';
    btnElt.style.backgroundOrigin = 'border-box';
  }
  
  // Reset scale
  btnElt.style.transform = 'scale(1.0)';
}

// GESTIONE DATI

function estraiAnniUnici(data) {
  let anni = data.getColumn('Edition').map(Number);
  return [...new Set(anni)].sort((a, b) => b - a);
}

function filtraDatiPerAnno(data, anno) {
  if (data && data.getRowCount() > 0 && anno !== null) {
    return data.getRows().filter(riga => {
      return riga.getNum('Edition') === anno;
    });
  }
  return [];
}

function estraiPaesiUnici(data) {
  let paesi = data.getColumn('Country/Territory');
  return [...new Set(paesi)].sort();
}

function calcolaMaxPaesiPerRegione(data) {
  let conteggioCompleto = {};
  
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
  
  let maxPaesiPerRegione = {};
  for (let regione in conteggioCompleto) {
    let maxF = 0;
    let maxPF = 0;
    let maxNF = 0;
    
    for (let anno in conteggioCompleto[regione]) {
      maxF = Math.max(maxF, conteggioCompleto[regione][anno].F);
      maxPF = Math.max(maxPF, conteggioCompleto[regione][anno].PF);
      maxNF = Math.max(maxNF, conteggioCompleto[regione][anno].NF);
    }
    
    maxPaesiPerRegione[regione] = Math.max(maxF, maxPF, maxNF);
  }
  
  return maxPaesiPerRegione;
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

function disegnaGriglia(graficoWidth, yBarra, altezzaMassimaBarra, incremento, minTotalScore, maxTotalScore) {
  const puntiDiRiferimento = [0, 25, 50, 75, 100];
  let yPositions = [];
  
  for (let valore of puntiDiRiferimento) {
    let altezzaRelativa = map(valore, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
    let yLinea = yBarra - altezzaRelativa - incremento;
    yPositions.push(yLinea);
    
    stroke(palette.bianco + '80');
    strokeWeight(1);
    noFill();
    line(50, yLinea, graficoWidth - 50, yLinea);
    
    noStroke();
    fill(palette.bianco + '80');
    textAlign(RIGHT, CENTER);
    textSize(12);
    text(valore, 40, yLinea);
  }
  
  if (yPositions.length > 1 && puntiDiRiferimento[4] === 100) {
    const yLinea100 = yPositions[4];
    
    push();
    fill(palette.bianco + '80');
    textSize(16);
    translate(50, yLinea100 - 5);
    textAlign(LEFT, BOTTOM);
    text("Total Score", 0, 0);
    pop();
  }
}

function disegnaBarraSingola(xBarra, riga, larghezzaBarra, yBarra, altezzaMassimaBarra, incremento, minTotalScore, maxTotalScore, paeseCercato, paesiConPosizioni) {
  let status = riga.getString('Status');
  let total = riga.getNum('TOTAL');
  let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
  let yCimaBarra = yBarra - altezzaBarra - incremento;
  let nomePaese = riga.getString('Country/Territory');
  
  push();
  if (paeseCercato !== null && nomePaese !== paeseCercato) {
    drawingContext.globalAlpha = 0.2;
  }
  
  let gradient = creaGradiente(xBarra, yCimaBarra, yBarra, larghezzaBarra, palette.coloriStatus[status]);
  drawingContext.fillStyle = gradient;
  rect(xBarra, yBarra, larghezzaBarra, -altezzaBarra - incremento);
  arc(xBarra + larghezzaBarra / 2, yCimaBarra, larghezzaBarra, larghezzaBarra, PI, TWO_PI);
  
  fill(palette.bianco);
  ellipse(xBarra + larghezzaBarra/2, yCimaBarra, larghezzaBarra, larghezzaBarra);
  
  pop();
  
  paesiConPosizioni.push({
    nome: nomePaese,
    x: xBarra + larghezzaBarra/2,
    y: yCimaBarra,
    raggio: larghezzaBarra/2
  });
}

function disegnaBarre(datiFiltrati, filtroF, filtroPF, filtroNF, maxPaesiPerRegione, yBarra, altezzaMassimaBarra, incremento, minTotalScore, maxTotalScore, graficoWidth, regioneHover, paeseCercato) {
  noStroke();
  let paesiConPosizioni = [];
  
  let datiPerRegione = {};
  for (let riga of datiFiltrati) {
    let regione = riga.getString('Region');
    if (!datiPerRegione[regione]) {
      datiPerRegione[regione] = [];
    }
    datiPerRegione[regione].push(riga);
  }
  
  let regioni = Object.keys(datiPerRegione).sort();
  
  let margineIniziale = 80;
  let margineFinale = margineIniziale;
  let spazioDisponibile = graficoWidth - margineIniziale - margineFinale;
  
  let totaleBarre = 0;
  for (let regione of regioni) {
    totaleBarre += maxPaesiPerRegione[regione];
  }
  
  let numeroGruppi = regioni.length;
  let spazioTraGruppi = min(50, spazioDisponibile * 0.1);
  let spazioTotaleGruppi = spazioTraGruppi * (numeroGruppi - 1);
  let spazioPerBarre = spazioDisponibile - spazioTotaleGruppi;
  let larghezzaBarra = max(2, min(15, spazioPerBarre / totaleBarre));
  
  let etichetteRegioni = [];
  let xCorrente = margineIniziale;
  
  for (let regione of regioni) {
    let larghezzaGruppo = maxPaesiPerRegione[regione] * larghezzaBarra;
    let centroGruppo = xCorrente + larghezzaGruppo / 2;
    etichetteRegioni.push({
      regione: regione,
      x: centroGruppo,
      xInizio: xCorrente,
      larghezza: larghezzaGruppo
    });
    xCorrente += larghezzaGruppo + spazioTraGruppi;
  }
  
  // LIVELLO 1: Paesi LIBERI (F)
  if (filtroF) {
    xCorrente = margineIniziale;
    for (let regione of regioni) {
      push();
      if (regioneHover !== null && regioneHover !== regione) {
        drawingContext.globalAlpha = 0.3;
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
          disegnaBarraSingola(xBarra, riga, larghezzaBarra, yBarra, altezzaMassimaBarra, incremento, minTotalScore, maxTotalScore, paeseCercato, paesiConPosizioni);
          contatoreF++;
        }
      }
      
      pop();
      xCorrente += maxPaesiPerRegione[regione] * larghezzaBarra + spazioTraGruppi;
    }
  }
  
  // LIVELLO 2: Paesi PARZIALMENTE LIBERI (PF)
  if (filtroPF) {
    xCorrente = margineIniziale;
    for (let regione of regioni) {
      push();
      if (regioneHover !== null && regioneHover !== regione) {
        drawingContext.globalAlpha = 0.3;
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
          disegnaBarraSingola(xBarra, riga, larghezzaBarra, yBarra, altezzaMassimaBarra, incremento, minTotalScore, maxTotalScore, paeseCercato, paesiConPosizioni);
          contatorePF++;
        }
      }
      
      pop();
      xCorrente += maxPaesiPerRegione[regione] * larghezzaBarra + spazioTraGruppi;
    }
  }
  
  // LIVELLO 3: Paesi NON LIBERI (NF)
  if (filtroNF) {
    xCorrente = margineIniziale;
    for (let regione of regioni) {
      push();
      if (regioneHover !== null && regioneHover !== regione) {
        drawingContext.globalAlpha = 0.3;
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
          disegnaBarraSingola(xBarra, riga, larghezzaBarra, yBarra, altezzaMassimaBarra, incremento, minTotalScore, maxTotalScore, paeseCercato, paesiConPosizioni);
          contatoreNF++;
        }
      }
      
      pop();
      xCorrente += maxPaesiPerRegione[regione] * larghezzaBarra + spazioTraGruppi;
    }
  }
  
  return { etichetteRegioni, paesiConPosizioni, larghezzaBarra };
}

function disegnaTorceEEtichette(etichetteRegioni, torcia, maxPaesiPerRegione, yBarra, font, larghezzaBarra, regioneHover, paeseCercato, datiFiltrati) {
  let areeTorce = [];
  let areeRegioni = [];
  
  // Disegna le torce
  push();
  imageMode(CENTER);
  for (let etichetta of etichetteRegioni) {
    let larghezzaMassima = maxPaesiPerRegione[etichetta.regione] * larghezzaBarra;
    let centroRegione = etichetta.x;
    
    let yIniziaTorcia = yBarra;
    let altezzaTorcia = height - yIniziaTorcia;
    
    let opacita = 255;
    let regionePaeseCercato = null;
    if (paeseCercato !== null) {
      let rigaPaese = datiFiltrati.find(r => r.getString('Country/Territory') === paeseCercato);
      if (rigaPaese) {
        regionePaeseCercato = rigaPaese.getString('Region');
      }
      
      if (regionePaeseCercato !== null) {
        if (etichetta.regione !== regionePaeseCercato) {
          opacita = 80;
        }
      }
    } else if (regioneHover !== null && regioneHover !== etichetta.regione) {
      opacita = 80;
    }
    
    tint(255, opacita);
    image(torcia, centroRegione, yIniziaTorcia + altezzaTorcia/2, larghezzaMassima*1.15, altezzaTorcia);
    
    areeTorce.push({
      regione: etichetta.regione,
      x: centroRegione - (larghezzaMassima*1.1)/2,
      y: yIniziaTorcia,
      w: larghezzaMassima*1.1,
      h: altezzaTorcia
    });
  }
  noTint();
  pop();
  
  // Salva le aree complete delle regioni
  for (let etichetta of etichetteRegioni) {
    let areaTorcia = areeTorce.find(a => a.regione === etichetta.regione);
    
    if (areaTorcia) {
      areeRegioni.push({
        regione: etichetta.regione,
        x: etichetta.xInizio,
        y: 150,
        w: etichetta.larghezza,
        h: height
      });
    }
  }
  
  // Disegna le etichette delle regioni
  push();
  fill(palette.nero);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(20);
  textLeading(20);
  const altezzaEtichetta = 50;
  const yEtichetta = yBarra + 55;
  
  for (let etichetta of etichetteRegioni) {
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
  
  return { areeTorce, areeRegioni };
}

// BARRA DI RICERCA

function aggiornaPosizioneContainerPaese(paeseCercato, paesiConPosizioni) {
  if (paeseCercato === null) return;
  
  let container = document.getElementById('containerPaeseCercato');
  if (!container) return;
  
  let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
  
  if (paese) {
    let offsetX = 10;
    container.style.left = (paese.x + paese.raggio + offsetX) + 'px';
    container.style.top = (paese.y - 15) + 'px';
    container.style.display = 'flex';
  } else {
    container.style.display = 'none';
  }
}

// GESTIONE INTERAZIONI MOUSE

function gestioneMouseMoved(paeseCercato, paesiConPosizioni, datiFiltrati, areeRegioni, areeTorce, yBarra, altezzaMassimaBarra, incremento, minTotalScore, maxTotalScore) {
  let nuovaRegioneHover = null;
  let cursoreDaMostrare = ARROW;
  
  let regionePaeseCercato = null;
  if (paeseCercato !== null) {
    let rigaPaese = datiFiltrati.find(r => r.getString('Country/Territory') === paeseCercato);
    if (rigaPaese) {
      regionePaeseCercato = rigaPaese.getString('Region');
    }
  }
  
  if (regionePaeseCercato !== null) {
    return { regioneHover: null, cursore: ARROW };
  }
  
  if (paeseCercato !== null) {
    let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
    
    if (paese) {
      for (let i = 0; i < datiFiltrati.length; i++) {
        let riga = datiFiltrati[i];
        if (riga.getString('Country/Territory') === paeseCercato) {
          let total = riga.getNum('TOTAL');
          let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
          let yCimaBarra = yBarra - altezzaBarra - incremento;
          
          if (mouseX >= paese.x - paese.raggio &&
              mouseX <= paese.x + paese.raggio &&
              mouseY >= yCimaBarra &&
              mouseY <= yBarra) {
            return { regioneHover: null, cursore: HAND };
          }
          
          let distanza = dist(mouseX, mouseY, paese.x, paese.y);
          if (distanza <= paese.raggio) {
            return { regioneHover: null, cursore: HAND };
          }
          
          break;
        }
      }
    }
  }
  
  if (regionePaeseCercato !== null) {
    return { regioneHover: null, cursore: ARROW };
  }
  
  for (let area of areeRegioni) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      nuovaRegioneHover = area.regione;
      
      let areaTorcia = areeTorce.find(a => a.regione === area.regione);
      if (areaTorcia &&
          mouseY >= areaTorcia.y &&
          mouseY <= areaTorcia.y + areaTorcia.h) {
        cursoreDaMostrare = HAND;
      } else {
        cursoreDaMostrare = HAND;
      }
      break;
    }
  }
  
  return { regioneHover: nuovaRegioneHover, cursore: cursoreDaMostrare };
}

function gestioneMousePressed(paeseCercato, paesiConPosizioni, datiFiltrati, areeRegioni, areeTorce, yBarra, altezzaMassimaBarra, incremento, minTotalScore, maxTotalScore, annoCorrente, callbackPaese, callbackRegione) {
  if (paeseCercato !== null) {
    let paese = paesiConPosizioni.find(p => p.nome === paeseCercato);
    
    if (paese) {
      for (let i = 0; i < datiFiltrati.length; i++) {
        let riga = datiFiltrati[i];
        if (riga.getString('Country/Territory') === paeseCercato) {
          let total = riga.getNum('TOTAL');
          let altezzaBarra = map(total, minTotalScore, maxTotalScore, 0, altezzaMassimaBarra);
          let yCimaBarra = yBarra - altezzaBarra - incremento;
          
          if (mouseX >= paese.x - paese.raggio &&
              mouseX <= paese.x + paese.raggio &&
              mouseY >= yCimaBarra &&
              mouseY <= yBarra) {
            callbackPaese(paeseCercato, annoCorrente);
            return true;
          }
          
          let distanza = dist(mouseX, mouseY, paese.x, paese.y);
          if (distanza <= paese.raggio) {
            callbackPaese(paeseCercato, annoCorrente);
            return true;
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
    if (regionePaeseCercato !== null) {
      return true;
    }
  }
  
  for (let area of areeRegioni) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      callbackRegione(area.regione, annoCorrente);
      return true;
    }
  }
  
  return false;
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
  window.location.href = `../html/regioni.html?region=${regioneEncoded}&year=${anno}`;
}

// EVENTI MOUSE

function mouseMoved() {
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
  
  // ✅ AGGIUNGI mouseX e mouseY
  let indiceAnnoHover = verificaClickAnno(
    areeAnni, 
    xPosAnni, 
    yPosAnni,
    mouseX,    // ← AGGIUNGI
    mouseY     // ← AGGIUNGI
  );
  
  if (indiceAnnoHover !== null) {
    cursor(HAND);
  } else {
    cursor(risultato.cursore);
  }
}

function mousePressed() {
  // Se il click è sul container del paese cercato, non fare nulla
  let container = document.getElementById('containerPaeseCercato');
  if (container && container.style.display !== 'none') {
    let rect = container.getBoundingClientRect();
    if (mouseX >= rect.left && mouseX <= rect.right &&
        mouseY >= rect.top && mouseY <= rect.bottom) {
      return;
    }
  }
  
  if (elementiRicerca.isMouseInRicerca()) {
    return;
  }
  
  let indiceAnnoCliccato = verificaClickAnno(areeAnni, xPosAnni, yPosAnni, mouseX, mouseY);
  
  if (indiceAnnoCliccato !== null) {
    cambiaAnno(indiceAnnoCliccato);
    scrollAccumulato = indiceAnnoCliccato * pixelPerAnno;
    progressoScroll = 0;
    return;
  }
  
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
  if (elementiRicerca.isMouseInRicerca()) {
    return true;
  }
  
  // ✅ Chiamata alla funzione della LIBRERIA
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