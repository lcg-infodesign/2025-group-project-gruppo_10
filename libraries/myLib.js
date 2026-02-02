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

// BOTTONI

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
  
  let bottoneCancella = createButton('');
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

  let pathClose = config.pathIconaClose || 'img/icone/close.png';
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
    bottoneCancella.elt.style.backgroundColor = palette.bianco;
    bottoneCancella.elt.style.borderColor = palette.nero;
    bottoneCancella.elt.style.transform = 'scale(1.15)';
    
    let img = document.getElementById('iconaClose');
    if (img) {
      img.style.filter = 'invert(1)';
    }
  });

  bottoneCancella.elt.addEventListener('mouseleave', () => {
    bottoneCancella.elt.style.backgroundColor = palette.nero;
    bottoneCancella.elt.style.borderColor = palette.bianco;
    bottoneCancella.elt.style.transform = 'scale(1.0)';
    
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
  
  // Tracking mouse corretto includendo containerPaeseCercato
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
  
  // Tracking per containerPaeseCercato
  containerPaeseCercato.elt.addEventListener('mouseenter', () => {
    mouseInRicerca = true;
  });
  
  containerPaeseCercato.elt.addEventListener('mouseleave', () => {
    mouseInRicerca = false;
  });
  
  // Rimuovi stopPropagation per permettere lo scroll della pagina
  suggerimentiDiv.elt.addEventListener('wheel', (e) => {
    e.stopPropagation();
  });
  
  return {
    inputRicerca,
    suggerimentiDiv,
    containerPaeseCercato,
    bottoneCancella,
    isMouseInRicerca: () => mouseInRicerca
  };
}

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