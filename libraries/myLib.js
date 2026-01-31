// libreria personale 
// elementi ricorrenti per le pagine

// variabili globali
let margine = 30;
let diametro = 60;

// palette
const palette = {
  nero: "#26231d",
  bianco: "#eaead8",
  grigio: "#454340ff",
  coloriStatus: {
    'F': ["#c76351", "#d58d3e", "#26231d"],
    'PF': ["#e5c38f", "#cad181", "#26231d"],
    'NF': ["#75a099", "#91a2a6", "#26231d"]
  },
  coloriLegenda: {
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
};

// testi
function titolo(){
  
}

// bottoni di navigazione

// Crea un bottone standard circolare di navigazione
function creaBottoneStandard(x, y, img, url) {
  let btn = createButton('');
  btn.position(x, y);
  
  btn.style('width', diametro + 'px');
  btn.style('height', diametro + 'px');
  btn.style('border-radius', '50%');
  btn.style('background-color', palette.nero);
  btn.style('border', '1px solid ' + palette.bianco);
  btn.style('display', 'flex');
  btn.style('align-items', 'center');
  btn.style('justify-content', 'center');
  btn.style('cursor', 'pointer');
  btn.style('z-index', '1000');
  
  if (img) {
    const imgData = img.canvas.toDataURL();
    btn.html(`<img src="${imgData}" style="width:70%; height:70%; object-fit:contain;">`);
  }
  
  btn.mousePressed(() => {
    if (typeof url === 'function') {
      url();
    } else {
      window.location.href = url;
    }
  });
  
  btn.mouseOver(() => {
    btn.style('background-color', palette.bianco);
    btn.style('border', '1px solid ' + palette.nero);
    btn.style('transform', 'scale(1.1)');
    btn.style('transition', 'all 0.2s');
    let imgElt = btn.elt.querySelector('img');
    if (imgElt) imgElt.style.filter = 'invert(100%)';
  });
  
  btn.mouseOut(() => {
    btn.style('background-color', palette.nero);
    btn.style('border', '1px solid ' + palette.bianco);
    btn.style('transform', 'scale(1.0)');
    let imgElt = btn.elt.querySelector('img');
    if (imgElt) imgElt.style.filter = 'invert(0%)';
  });
  
  return btn;
}

// Crea un bottone filtro status con gradiente
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
  
  // Click
  bottone.mousePressed(() => callback(tipo));
  
  // interazione all'hover
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

// Aggiorna lo stile del bottone filtro
function aggiornaStileBottoneFiltro(bottone, attivo, colori) {
  let gradiente;
  let gradienteBordo;
  
  if (colori.length === 2) {
    gradiente = `linear-gradient(to right, ${colori[0]}, ${colori[0]})`;
    gradienteBordo = `linear-gradient(to right, ${colori[0]})`;
  } else if (colori.length === 3) {
    gradiente = `linear-gradient(to right, ${colori[0]}, ${colori[1]})`;
    gradienteBordo = `linear-gradient(45deg, ${colori[0]}, ${colori[1]})`;
  }
  
  if (attivo) {
    // Stato attivo: mostra il gradiente
    bottone.style('background', `${gradienteBordo}, linear-gradient(${colori[2] || palette.nero}, ${colori[2] || palette.nero})`);
    bottone.style('background-clip', 'padding-box, border-box');
    bottone.style('background-origin', 'border-box');
    bottone.style('opacity', '1');
    bottone.style('color', palette.nero);
    
    // Ricrea gli eventi hover per lo stato attivo
    bottone.elt.onmouseenter = () => {
      bottone.style('background', palette.bianco);
      bottone.style('border', '1px solid ' + palette.nero);
      bottone.style('transform', 'scale(1.05)');
      bottone.style('transition', 'all 0.2s');
    };
    
    bottone.elt.onmouseleave = () => {
      bottone.style('background', `${gradienteBordo}, linear-gradient(${colori[2] || palette.nero}, ${colori[2] || palette.nero})`);
      bottone.style('background-clip', 'padding-box, border-box');
      bottone.style('background-origin', 'border-box');
      bottone.style('border-width', '1px');
      bottone.style('border-style', 'solid');
      bottone.style('transform', 'scale(1.0)');
    };
  } else {
    // Stato inattivo: sfondo trasparente
    bottone.style('background', 'transparent');
    bottone.style('opacity', '0.8');
    bottone.style('color', palette.bianco);
    bottone.style('border', '1px solid ' + palette.bianco);
    
    // Ricrea gli eventi hover per lo stato inattivo
    bottone.elt.onmouseenter = () => {
      bottone.style('background', palette.bianco);
      bottone.style('color', palette.nero);
      bottone.style('border', '2px solid ' + palette.nero);
      bottone.style('transform', 'scale(1.05)');
      bottone.style('transition', 'all 0.2s');
      bottone.style('opacity', '1');
    };
    
    bottone.elt.onmouseleave = () => {
      bottone.style('background', 'transparent');
      bottone.style('color', palette.bianco);
      bottone.style('border', '1px solid ' + palette.bianco);
      bottone.style('transform', 'scale(1.0)');
      bottone.style('opacity', '0.8');
    };
  }
}


// GESTIONE ANNI

// Estrae e ordina gli anni unici dal dataset
function estraiAnniUnici(data) {
  let anni = data.getColumn('Edition').map(Number);
  return [...new Set(anni)].sort((a, b) => b - a);
}

// Filtra i dati per un anno specifico
function filtraDatiPerAnno(data, anno) {
  if (data && data.getRowCount() > 0 && anno !== null) {
    return data.getRows().filter(riga => {
      return riga.getNum('Edition') === anno;
    });
  }
  return [];
}


// GESTIONE PAESI

// Estrae tutti i paesi unici dal dataset
function estraiPaesiUnici(data) {
  let paesi = data.getColumn('Country/Territory');
  return [...new Set(paesi)].sort();
}


// CALCOLO MASSIMI PER REGIONE

// Calcola il massimo numero di paesi per ogni regione attraverso tutti gli anni e status
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

// Crea un gradiente
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

// Disegna la griglia con i valori di riferimento
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

// Disegna una singola barra
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

// Disegna le barre raggruppate per regione
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
  
  let etchetteRegioni = [];
  let xCorrente = margineIniziale;
  
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
  
  return { etchetteRegioni, paesiConPosizioni, larghezzaBarra };
}

// Disegna le torce e le etichette delle regioni
function disegnaTorceEEtichette(etchetteRegioni, torcia, maxPaesiPerRegione, yBarra, font, larghezzaBarra, regioneHover, paeseCercato, datiFiltrati) {
  let areeTorce = [];
  let areeRegioni = [];
  
  // Disegna le torce
  push();
  imageMode(CENTER);
  for (let etichetta of etchetteRegioni) {
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
  for (let etichetta of etchetteRegioni) {
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
  
  return { areeTorce, areeRegioni };
}


// GESTIONE ANNI

// Disegna l'etichetta dell'anno verticale
function disegnaEtichettaAnno(graficoWidth, annoWidth, fontRegular, anniUnici, annoCorrente, progressoScroll) {
  push();
  
  noStroke();
  textFont(fontRegular);
  textAlign(CENTER, CENTER);
  
  let xPos = graficoWidth + (annoWidth / 2);
  let yPos = height / 2;
  
  translate(xPos, yPos);
  rotate(PI / 2 * 3);
  
  const spaziaturaFissaX = 400;
  let offsetGlobaleX = map(progressoScroll, 0, 1, 0, spaziaturaFissaX);
  let indiceCorrente = anniUnici.indexOf(annoCorrente);
  
  let areeAnni = [];
  
  // Anno precedente
  if (indiceCorrente > 0) {
    let annoPrecedente = anniUnici[indiceCorrente - 1];
    let baseXPrecedente = spaziaturaFissaX;
    let finalXPrecedente = baseXPrecedente + offsetGlobaleX;
    let dimensionePrecedente = map(progressoScroll, 0, 1, annoWidth * 0.9, annoWidth * 0.7);
    let opacitaPrecedente = map(progressoScroll, 0, 1, 100, 70);
    
    fill(palette.bianco + hex(floor(opacitaPrecedente), 2));
    textSize(dimensionePrecedente);
    text(annoPrecedente, finalXPrecedente, -30);
    
    // Calcola area cliccabile (ruotata)
    let bounds = fontRegular.textBounds(annoPrecedente.toString(), finalXPrecedente, -30, dimensionePrecedente);
    areeAnni.push({
      anno: annoPrecedente,
      indice: indiceCorrente - 1,
      bounds: bounds,
      x: finalXPrecedente,
      y: -30
    });
  }
  
  // Anno corrente
  let baseXCorrente = 0;
  let finalXCorrente = baseXCorrente + offsetGlobaleX;
  let dimensioneCorrente = map(progressoScroll, 0, 1, annoWidth * 1.3, annoWidth * 0.9);
  let opacitaCorrente = map(progressoScroll, 0, 1, 255, 100);
  
  fill(palette.bianco + hex(floor(opacitaCorrente), 2));
  textSize(dimensioneCorrente);
  text(annoCorrente, finalXCorrente, -30);
  
  let bounds = fontRegular.textBounds(annoCorrente.toString(), finalXCorrente, -30, dimensioneCorrente);
  areeAnni.push({
    anno: annoCorrente,
    indice: indiceCorrente,
    bounds: bounds,
    x: finalXCorrente,
    y: -30
  });
  
  // Anno successivo
  if (indiceCorrente < anniUnici.length - 1) {
    let annoSuccessivo = anniUnici[indiceCorrente + 1];
    let baseXSuccessivo = -spaziaturaFissaX;
    let finalXSuccessivo = baseXSuccessivo + offsetGlobaleX;
    let dimensioneSuccessivo = map(progressoScroll, 0, 1, annoWidth * 0.7, annoWidth * 1.3);
    let opacitaSuccessivo = map(progressoScroll, 0, 1, 70, 100);
    
    fill(palette.bianco + hex(floor(opacitaSuccessivo), 2));
    textSize(dimensioneSuccessivo);
    text(annoSuccessivo, finalXSuccessivo, -30);
    
    let bounds = fontRegular.textBounds(annoSuccessivo.toString(), finalXSuccessivo, -30, dimensioneSuccessivo);
    areeAnni.push({
      anno: annoSuccessivo,
      indice: indiceCorrente + 1,
      bounds: bounds,
      x: finalXSuccessivo,
      y: -30
    });
  }
  
  pop();
  
  return { areeAnni, xPos, yPos };
}

// Verifica se il click è su un anno e restituisce l'indice
function verificaClickAnno(areeAnni, xPosAnni, yPosAnni) {
  if (!areeAnni || areeAnni.length === 0) return null;
  
  // Trasforma le coordinate del mouse nello spazio ruotato
  let dx = mouseX - xPosAnni;
  let dy = mouseY - yPosAnni;
  
  // Rotazione inversa CORRETTA (dato che abbiamo ruotato di PI/2*3, che è -PI/2)
  let mouseXRuotato = -dy;  // INVERTITO
  let mouseYRuotato = dx;   // INVERTITO
  
  // Verifica ogni area anno
  for (let area of areeAnni) {
    if (area.bounds) {
      let margine = 20; // Margine extra per rendere il click più facile
      if (mouseXRuotato >= area.bounds.x - margine &&
          mouseXRuotato <= area.bounds.x + area.bounds.w + margine &&
          mouseYRuotato >= area.bounds.y - margine &&
          mouseYRuotato <= area.bounds.y + area.bounds.h + margine) {
        return area.indice;
      }
    }
  }
  
  return null;
}

// Gestisce lo scroll del mouse per cambiare anno
function gestioneMouseWheel(event, anniUnici, annoCorrente, scrollAccumulato, pixelPerAnno, progressoScroll, callbackCambiaAnno) {
  scrollAccumulato += event.delta;
  
  let scrollMin = 0;
  let scrollMax = (anniUnici.length - 1) * pixelPerAnno;
  scrollAccumulato = constrain(scrollAccumulato, scrollMin, scrollMax);
  
  let indiceEsatto = scrollAccumulato / pixelPerAnno;
  let indiceAnno = floor(indiceEsatto);
  progressoScroll = indiceEsatto - indiceAnno;
  
  indiceAnno = constrain(indiceAnno, 0, anniUnici.length - 1);
  
  if (anniUnici[indiceAnno] !== annoCorrente) {
    callbackCambiaAnno(indiceAnno);
  }
  
  return { scrollAccumulato, progressoScroll };
}


// BARRA DI RICERCA

// Crea la barra di ricerca completa
function creaBarraRicerca(graficoWidth, paesiUnici, callbackVaiAPaese) {
  const margineSinistroIntro = 30;
  const spaziaturaDopoIntro = 20;
  const xPosInizioBarra = margineSinistroIntro + diametro + spaziaturaDopoIntro;
  const larghezzaBarra = graficoWidth - xPosInizioBarra - 50;
  
  let containerRicerca = createDiv();
  let xPos = xPosInizioBarra;
  let yPos = 30;
  
  containerRicerca.position(xPos, yPos);
  containerRicerca.style('position', 'absolute');
  containerRicerca.style('width', larghezzaBarra + 'px');
  containerRicerca.style('z-index', '1000');
  
  let inputWrapper = createDiv();
  inputWrapper.parent(containerRicerca);
  inputWrapper.style('position', 'relative');
  inputWrapper.style('width', '100%');
  
  let iconaLente = createDiv();
  iconaLente.parent(inputWrapper);
  iconaLente.html(`
    <img src="img/icone/search.png" width="25" height="25" style="display: block;">
  `);
  iconaLente.style('position', 'absolute');
  iconaLente.style('left', '20px');
  iconaLente.style('top', '50%');
  iconaLente.style('transform', 'translateY(-50%)');
  iconaLente.style('pointer-events', 'none');
  iconaLente.style('z-index', '1');
  iconaLente.style('display', 'flex');
  iconaLente.style('align-items', 'center');
  
  let inputRicerca = createInput('');
  inputRicerca.attribute('placeholder', 'Look up Country or Territory');
  inputRicerca.parent(inputWrapper);
  inputRicerca.style('width', '100%');
  inputRicerca.style('padding', '20px 20px 18px 50px');
  inputRicerca.style('font-size', '20px');
  inputRicerca.style('border', '1px solid' + palette.bianco);
  inputRicerca.style('border-radius', '30px');
  inputRicerca.style('background-color', palette.nero);
  inputRicerca.style('color', palette.bianco);
  inputRicerca.style('outline', 'none');
  inputRicerca.style('box-sizing', 'border-box');
  inputRicerca.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif');
  
  let suggerimentiDiv = createDiv();
  suggerimentiDiv.parent(containerRicerca);
  suggerimentiDiv.style('position', 'absolute');
  suggerimentiDiv.style('top', '60px');
  suggerimentiDiv.style('width', '100%');
  suggerimentiDiv.style('max-height', '300px');
  suggerimentiDiv.style('overflow-y', 'auto');
  suggerimentiDiv.style('background-color', palette.nero);
  suggerimentiDiv.style('border', '1px solid' + palette.bianco);
  suggerimentiDiv.style('border-radius', '30px');
  suggerimentiDiv.style('display', 'none');
  suggerimentiDiv.style('z-index', '1001');
  suggerimentiDiv.style('box-sizing', 'border-box');
  suggerimentiDiv.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif');
  
  let suggerimentoSelezionato = -1;
  
  function mostraSuggerimenti() {
    let query = inputRicerca.value().toLowerCase().trim();
    suggerimentiDiv.html('');
    suggerimentoSelezionato = -1;
    
    if (query === '') {
      suggerimentiDiv.style('display', 'none');
      return;
    }
    
    let paesiFiltrati = paesiUnici.filter(paese =>
      paese.toLowerCase().startsWith(query)
    );
    
    if (paesiFiltrati.length === 0) {
      suggerimentiDiv.style('display', 'none');
      return;
    }
    
    paesiFiltrati.slice(0, 8).forEach((paese, index) => {
      let suggDiv = createDiv(paese);
      suggDiv.parent(suggerimentiDiv);
      suggDiv.style('padding', '15px 20px 12px 20px');
      suggDiv.style('cursor', 'pointer');
      suggDiv.style('color', palette.bianco);
      suggDiv.style('font-size', '18px');
      suggDiv.style('border-bottom', '1px solid #444');
      suggDiv.attribute('data-index', index);
      suggDiv.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif');
      
      suggDiv.mouseOver(() => {
        suggDiv.style('background-color', palette.bianco);
        suggDiv.style('color', palette.nero);
      });
      suggDiv.mouseOut(() => {
        if (suggerimentoSelezionato !== index) {
          suggDiv.style('background-color', palette.nero);
          suggDiv.style('color', palette.nero);
        }
      });
      
      suggDiv.mousePressed(() => {
        callbackVaiAPaese(paese, inputRicerca, suggerimentiDiv);
      });
    });
    
    suggerimentiDiv.style('display', 'block');
    suggerimentiDiv.style('border-radius', '30px');
    suggerimentiDiv.style('top', '70px');
  }
  
  function aggiornaSelezioneSuggerimento(suggerimenti) {
    for (let i = 0; i < suggerimenti.length; i++) {
      if (i === suggerimentoSelezionato) {
        suggerimenti[i].style.backgroundColor = '#3a3a3a';
        suggerimenti[i].scrollIntoView({ block: 'nearest' });
      } else {
        suggerimenti[i].style.backgroundColor = 'transparent';
      }
    }
  }
  
  inputRicerca.input(mostraSuggerimenti);
  inputRicerca.elt.addEventListener('focus', mostraSuggerimenti);
  inputRicerca.elt.addEventListener('blur', () => {
    setTimeout(() => {
      suggerimentiDiv.style('display', 'none');
      suggerimentoSelezionato = -1;
    }, 200);
  });
  
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
        callbackVaiAPaese(paese, inputRicerca, suggerimentiDiv);
      } else if (inputRicerca.value().trim() !== '') {
        let primoSuggerimento = suggerimentiDiv.elt.firstChild;
        if (primoSuggerimento) {
          callbackVaiAPaese(primoSuggerimento.textContent, inputRicerca, suggerimentiDiv);
        } else {
          callbackVaiAPaese(inputRicerca.value().trim(), inputRicerca, suggerimentiDiv);
        }
      }
    }
  });
  
  let containerPaeseCercato = createDiv();
  containerPaeseCercato.id('containerPaeseCercato');
  containerPaeseCercato.style('position', 'absolute');
  containerPaeseCercato.style('display', 'none');
  containerPaeseCercato.style('align-items', 'center');
  containerPaeseCercato.style('gap', '6px');
  containerPaeseCercato.style('z-index', '1000');
  
  let nomePaeseDiv = createDiv('');
  nomePaeseDiv.id('nomePaeseCercato');
  nomePaeseDiv.parent(containerPaeseCercato);
  nomePaeseDiv.style('color', palette.bianco);
  nomePaeseDiv.style('font-family', 'NeueHaasGrotDisp-65Medium, sans-serif');
  nomePaeseDiv.style('font-size', '20px');
  nomePaeseDiv.style('white-space', 'nowrap');
  
  let bottoneCancella = createButton('×');
  bottoneCancella.parent(containerPaeseCercato);
  bottoneCancella.style('width', '30px');
  bottoneCancella.style('height', '30px');
  bottoneCancella.style('border-radius', '50%');
  bottoneCancella.style('background-color', palette.nero);
  bottoneCancella.style('color', palette.bianco);
  bottoneCancella.style('border', '1px solid' + palette.bianco);
  bottoneCancella.style('cursor', 'pointer');
  bottoneCancella.style('font-size', '20px');
  bottoneCancella.style('display', 'flex');
  bottoneCancella.style('align-items', 'center');
  bottoneCancella.style('justify-content', 'center');
  bottoneCancella.style('padding', '0');
  bottoneCancella.style('line-height', '1');
  
    // Variabile per tracciare se il mouse è sopra l'area di ricerca
  let mouseInRicerca = false;
  
  // Traccia quando il mouse entra nell'area di ricerca
  containerRicerca.elt.addEventListener('mouseenter', () => {
    mouseInRicerca = true;
  });
  
  containerRicerca.elt.addEventListener('mouseleave', () => {
    mouseInRicerca = false;
  });
  
  // Traccia anche per i suggerimenti
  suggerimentiDiv.elt.addEventListener('mouseenter', () => {
    mouseInRicerca = true;
  });
  
  suggerimentiDiv.elt.addEventListener('mouseleave', () => {
    mouseInRicerca = false;
  });
  
  // Blocca lo scroll quando il mouse è sopra l'area di ricerca
  containerRicerca.elt.addEventListener('wheel', (e) => {
    e.stopPropagation();
  });
  
  suggerimentiDiv.elt.addEventListener('wheel', (e) => {
    e.stopPropagation();
  });
  
  return { 
    inputRicerca, 
    suggerimentiDiv, 
    containerPaeseCercato, 
    bottoneCancella,
    isMouseInRicerca: () => mouseInRicerca  // Funzione per controllare lo stato
  };
}

// Aggiorna la posizione del container del paese cercato
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

// Gestisce il movimento del mouse per hover
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
  
  // MODIFICA QUI: Controlla l'intera area della regione
  for (let area of areeRegioni) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      nuovaRegioneHover = area.regione;
      
      // Controlla se sei anche sopra la torcia per mostrare HAND
      let areaTorcia = areeTorce.find(a => a.regione === area.regione);
      if (areaTorcia &&
          mouseY >= areaTorcia.y &&
          mouseY <= areaTorcia.y + areaTorcia.h) {
        cursoreDaMostrare = HAND;
      } else {
        // Sei sulle colonne, mostra comunque HAND
        cursoreDaMostrare = HAND;
      }
      break;
    }
  }
  
  return { regioneHover: nuovaRegioneHover, cursore: cursoreDaMostrare };
}

// Gestisce il click del mouse
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
  
  // MODIFICA QUI: Controlla prima l'intera area della regione (colonne + torcia)
  for (let area of areeRegioni) {
    if (mouseX >= area.x && mouseX <= area.x + area.w &&
        mouseY >= area.y && mouseY <= area.y + area.h) {
      callbackRegione(area.regione, annoCorrente);
      return true;
    }
  }
  
  return false;
}