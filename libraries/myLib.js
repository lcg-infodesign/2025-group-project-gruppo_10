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
};

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

/*
function creaBottoniFiltroStatus(config) {
  const {
    allineamento = 'destra',  // 'destra' o 'sinistra'
    xRiferimento,  // Punto di riferimento X (es. bordo destro del box)
    yBase,         // Y di partenza dal basso
    distanzaTraBottoni = 40,
    altezzaBottone = 35,
    spaziatura = 15,  // Spaziatura orizzontale tra bottoni (per allineamento orizzontale)
    callback,
    orientamento = 'verticale'  // 'verticale' o 'orizzontale'
  } = config;
  
  // Definizioni bottoni
  const bottoni = [
    { tipo: 'F', testo: 'FREE', colori: palette.coloriStatus['F'] },
    { tipo: 'PF', testo: 'PARTIALLY FREE', colori: palette.coloriStatus['PF'] },
    { tipo: 'NF', testo: 'NOT FREE', colori: palette.coloriStatus['NF'] }
  ];
  
  let bottoniCreati = {};
  let bottoneTmp = [];
  
  // 1. Crea bottoni temporanei per misurare larghezze
  bottoni.forEach(btn => {
    let b = createButton(btn.testo);
    b.style('padding', '4px 30px 2px 30px');
    b.style('font-size', orientamento === 'verticale' ? '20px' : '16px');
    b.style('font-weight', 'bold');
    b.style('visibility', 'hidden');
    b.position(0, 0);
    bottoneTmp.push({ btn: b, larghezza: 0, ...btn });
  });
  
  // Aspetta che il browser calcoli le dimensioni
  setTimeout(() => {
    bottoneTmp.forEach(item => {
      item.larghezza = item.btn.elt.offsetWidth;
    });
  }, 0);
  
  // 2. Calcola posizioni
  let posizioni = [];
  
  if (orientamento === 'verticale') {
    // VERTICALE (pagina regione)
    let yCorrente = yBase - altezzaBottone;
    
    // Ordine: NF, PF, F (dal basso verso l'alto)
    [bottoni[2], bottoni[1], bottoni[0]].forEach((btnInfo, index) => {
      let btnTmp = bottoneTmp.find(t => t.tipo === btnInfo.tipo);
      let xPos = allineamento === 'destra' 
        ? xRiferimento - btnTmp.larghezza 
        : xRiferimento;
      
      posizioni.push({
        ...btnInfo,
        x: xPos,
        y: yCorrente,
        larghezza: btnTmp.larghezza
      });
      
      yCorrente -= (altezzaBottone + distanzaTraBottoni);
    });
    
  } else {
    // ORIZZONTALE (pagina home)
    let larghezzaTotale = 0;
    bottoneTmp.forEach(item => {
      larghezzaTotale += item.larghezza;
    });
    larghezzaTotale += spaziatura * (bottoni.length - 1);
    
    let xCorrente = allineamento === 'destra'
      ? xRiferimento - larghezzaTotale
      : xRiferimento;
    
    bottoni.forEach(btnInfo => {
      let btnTmp = bottoneTmp.find(t => t.tipo === btnInfo.tipo);
      
      posizioni.push({
        ...btnInfo,
        x: xCorrente,
        y: yBase,
        larghezza: btnTmp.larghezza
      });
      
      xCorrente += btnTmp.larghezza + spaziatura;
    });
  }
  
  // 3. Rimuovi bottoni temporanei
  bottoneTmp.forEach(item => item.btn.remove());
  
  // 4. Crea bottoni reali
  posizioni.forEach(btnInfo => {
    let bottone = createButton(btnInfo.testo);
    bottone.position(btnInfo.x, btnInfo.y);
    
    let btnElt = bottone.elt;
    
    // Gradiente per il bordo
    let gradienteBordo;
    if (btnInfo.colori.length === 2) {
      gradienteBordo = `linear-gradient(to right, ${btnInfo.colori[0]})`;
    } else if (btnInfo.colori.length === 3) {
      gradienteBordo = `linear-gradient(45deg, ${btnInfo.colori[0]}, ${btnInfo.colori[1]})`;
    }
    
    // Stili base
    btnElt.style.padding = '4px 30px 2px 30px';
    btnElt.style.fontSize = orientamento === 'verticale' ? '20px' : '16px';
    btnElt.style.fontWeight = 'bold';
    btnElt.style.border = 'none';
    btnElt.style.cursor = 'pointer';
    btnElt.style.borderRadius = '25px';
    btnElt.style.zIndex = '1002';
    btnElt.style.transition = 'all 0.2s ease';
    
    // Sfondo iniziale con gradiente
    btnElt.style.background = `${gradienteBordo}, linear-gradient(${btnInfo.colori[2] || palette.nero}, ${btnInfo.colori[2] || palette.nero})`;
    btnElt.style.borderWidth = '1px';
    btnElt.style.borderStyle = 'solid';
    btnElt.style.backgroundClip = 'padding-box, border-box';
    btnElt.style.backgroundOrigin = 'border-box';
    btnElt.style.color = palette.nero;
    
    // Stato attivo/inattivo
    let attivo = true;
    
    // Funzione per aggiornare lo stile
    function aggiornaStile() {
      if (attivo) {
        btnElt.style.background = `${gradienteBordo}, linear-gradient(${btnInfo.colori[2] || palette.nero}, ${btnInfo.colori[2] || palette.nero})`;
        btnElt.style.backgroundClip = 'padding-box, border-box';
        btnElt.style.backgroundOrigin = 'border-box';
        btnElt.style.opacity = '1';
        btnElt.style.color = palette.nero;
      } else {
        btnElt.style.background = palette.nero;
        btnElt.style.border = '1px solid ' + palette.bianco;
        btnElt.style.opacity = '0.8';
        btnElt.style.color = palette.bianco;
      }
      btnElt.style.transform = 'scale(1.0)';
    }
    
    // Eventi hover
    btnElt.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
    });
    
    btnElt.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1.0)';
    });
    
    // Click event
    btnElt.addEventListener('click', function() {
      attivo = !attivo;
      aggiornaStile();
      if (callback) {
        callback(btnInfo.tipo, attivo);
      }
    });
    
    // Salva riferimento
    bottoniCreati[btnInfo.tipo] = {
      elemento: bottone,
      setAttivo: function(stato) {
        attivo = stato;
        aggiornaStile();
      },
      isAttivo: function() {
        return attivo;
      }
    };
  });
  
  return bottoniCreati;
}*/

// ANNI

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

function verificaClickAnno(areeAnni, xPosAnni, yPosAnni, mouseX, mouseY) {
  if (!areeAnni || areeAnni.length === 0) return null;
  
  let dx = mouseX - xPosAnni;
  let dy = mouseY - yPosAnni;
  let mouseXRuotato = -dy;
  let mouseYRuotato = dx;
  
  for (let area of areeAnni) {
    if (area.bounds) {
      let margine = 20;
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

function isMouseSopraAnno(areeAnni, xPosAnni, yPosAnni, mouseX, mouseY) {
  return verificaClickAnno(areeAnni, xPosAnni, yPosAnni, mouseX, mouseY) !== null;
}

// BARRA DI RICERCA
function creaBarraRicerca(config) {
  const {
    xPos,
    yPos,
    larghezza,
    paesiUnici,
    callbackSelezionePaese,
    placeholder = 'Look up Country or Territory',
    zIndex = 1000,
    pathIcona = 'img/icone/search.png'
  } = config;
  
  let containerRicerca = createDiv();
  containerRicerca.position(xPos, yPos);
  containerRicerca.style('position', 'absolute');
  containerRicerca.style('width', larghezza + 'px');
  containerRicerca.style('z-index', zIndex.toString());
  
  // Wrapper per input e icona
  let inputWrapper = createDiv();
  inputWrapper.parent(containerRicerca);
  inputWrapper.style('position', 'relative');
  inputWrapper.style('width', '100%');
  
  // Icona lente
  let iconaLente = createDiv();
  iconaLente.parent(inputWrapper);
  iconaLente.html(`
    <img src="${pathIcona}" width="25" height="25" style="display: block;">
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
  let inputRicerca = createInput('');
  inputRicerca.attribute('placeholder', placeholder);
  inputRicerca.parent(inputWrapper);
  inputRicerca.style('width', '100%');
  inputRicerca.style('padding', '20px 20px 18px 50px');
  inputRicerca.style('font-size', '20px');
  inputRicerca.style('border', '1px solid ' + palette.bianco);
  inputRicerca.style('border-radius', '30px');
  inputRicerca.style('background-color', palette.nero);
  inputRicerca.style('color', palette.bianco);
  inputRicerca.style('outline', 'none');
  inputRicerca.style('box-sizing', 'border-box');
  inputRicerca.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif');
  
  // Div suggerimenti
  let suggerimentiDiv = createDiv();
  suggerimentiDiv.parent(containerRicerca);
  suggerimentiDiv.style('position', 'absolute');
  suggerimentiDiv.style('top', '60px');
  suggerimentiDiv.style('width', '100%');
  suggerimentiDiv.style('max-height', '300px');
  suggerimentiDiv.style('overflow-y', 'auto');
  suggerimentiDiv.style('background-color', palette.nero);
  suggerimentiDiv.style('border', '1px solid ' + palette.bianco);
  suggerimentiDiv.style('border-radius', '30px');
  suggerimentiDiv.style('display', 'none');
  suggerimentiDiv.style('z-index', (zIndex + 1).toString());
  suggerimentiDiv.style('box-sizing', 'border-box');
  suggerimentiDiv.style('font-family', 'NeueHaasGrotDisp-55Roman, sans-serif');
  
  let suggerimentoSelezionato = -1;
  let mouseInRicerca = false;
  
  // Container per paese cercato (con nome e bottone cancella)
  let containerPaeseCercato = createDiv();
  containerPaeseCercato.id('containerPaeseCercato');
  containerPaeseCercato.style('position', 'absolute');
  containerPaeseCercato.style('display', 'none');
  containerPaeseCercato.style('align-items', 'center');
  containerPaeseCercato.style('gap', '6px');
  containerPaeseCercato.style('z-index', '9999');
  containerPaeseCercato.style('pointer-events', 'auto'); 
  
  let nomePaeseDiv = createDiv('');
  nomePaeseDiv.id('nomePaeseCercato');
  nomePaeseDiv.parent(containerPaeseCercato);
  nomePaeseDiv.style('color', palette.bianco);
  nomePaeseDiv.style('font-family', 'NeueHaasGrotDisp-65Medium, sans-serif');
  nomePaeseDiv.style('font-size', '20px');
  nomePaeseDiv.style('white-space', 'nowrap');
  
  let bottoneCancella = createButton('');  // ← Vuoto invece di '×'
  bottoneCancella.parent(containerPaeseCercato);
  bottoneCancella.style('width', '30px');
  bottoneCancella.style('height', '30px');
  bottoneCancella.style('border-radius', '50%');
  bottoneCancella.style('background-color', palette.nero);
  bottoneCancella.style('border', '1px solid ' + palette.bianco);
  bottoneCancella.style('cursor', 'pointer');
  bottoneCancella.style('display', 'flex');
  bottoneCancella.style('align-items', 'center');
  bottoneCancella.style('justify-content', 'center');
  bottoneCancella.style('padding', '0');
  bottoneCancella.style('z-index', '10000');
  bottoneCancella.style('position', 'relative');
  bottoneCancella.style('transition', 'all 0.2s ease');

  let pathClose = config.pathIconaClose || 'img/icone/close.png';  // Default per home
  bottoneCancella.html(`
    <img 
      src="${pathClose}" 
      id="iconaClose"
      style="
        width: 70%;
        height: 70%;
        object-fit: contain;
        filter: invert(0);
        transition: filter 0.2s ease;
      ">
  `);

  bottoneCancella.elt.addEventListener('mouseenter', () => {
    // Cambio sfondo e bordo
    bottoneCancella.elt.style.backgroundColor = palette.bianco;
    bottoneCancella.elt.style.borderColor = palette.nero;
    bottoneCancella.elt.style.transform = 'scale(1.15)';
    
    // Cambio icona
    let img = document.getElementById('iconaClose');
    if (img) {
      img.style.filter = 'invert(1)';
    }
  });

  bottoneCancella.elt.addEventListener('mouseleave', () => {
    // Torna normale
    bottoneCancella.elt.style.backgroundColor = palette.nero;
    bottoneCancella.elt.style.borderColor = palette.bianco;
    bottoneCancella.elt.style.transform = 'scale(1.0)';
    
    // Torna icona bianca
    let img = document.getElementById('iconaClose');
    if (img) {
      img.style.filter = 'invert(0)';
    }
  });
  
  // Funzione per mostrare i suggerimenti
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
          suggDiv.style('color', palette.bianco);
        }
      });
      
      suggDiv.mousePressed(() => {
        callbackSelezionePaese(paese, inputRicerca, suggerimentiDiv);
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
  
  // Eventi input
  inputRicerca.input(mostraSuggerimenti);
  inputRicerca.elt.addEventListener('focus', mostraSuggerimenti);
  inputRicerca.elt.addEventListener('blur', () => {
    setTimeout(() => {
      suggerimentiDiv.style('display', 'none');
      suggerimentoSelezionato = -1;
    }, 200);
  });
  
  // Gestione tasti
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
        callbackSelezionePaese(paese, inputRicerca, suggerimentiDiv);
      } else if (inputRicerca.value().trim() !== '') {
        let primoSuggerimento = suggerimentiDiv.elt.firstChild;
        if (primoSuggerimento) {
          callbackSelezionePaese(primoSuggerimento.textContent, inputRicerca, suggerimentiDiv);
        } else {
          callbackSelezionePaese(inputRicerca.value().trim(), inputRicerca, suggerimentiDiv);
        }
      }
    }
  });
  
  // Tracking mouse
  containerRicerca.elt.addEventListener('mouseenter', () => {
    mouseInRicerca = true;
  });
  
  containerRicerca.elt.addEventListener('mouseleave', () => {
    mouseInRicerca = false;
  });
  
  suggerimentiDiv.elt.addEventListener('mouseenter', () => {
    mouseInRicerca = true;
  });
  
  suggerimentiDiv.elt.addEventListener('mouseleave', () => {
    mouseInRicerca = false;
  });
  
  // Previeni scroll
  containerRicerca.elt.addEventListener('wheel', (e) => {
    e.stopPropagation();
  });
  
  suggerimentiDiv.elt.addEventListener('wheel', (e) => {
    e.stopPropagation();
  });
  
  // Ritorna oggetto con riferimenti
  return {
    inputRicerca,
    suggerimentiDiv,
    containerPaeseCercato,
    bottoneCancella,
    isMouseInRicerca: () => mouseInRicerca
  };
}