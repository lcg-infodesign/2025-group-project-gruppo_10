let bottoneGr;
let bottoneFH;
let bottoneBack;
let tooltipFH;
let tooltipGr;
let titolo;
let testoIntro;
let testiRettangoli = [];
let ritratti = [];
let offsetY = [];
let offsetXimg = [];

function preload() {
  // Carica le immagini dei ritratti
  ritratti.push(loadImage("img/ritratti/ritratto1.png")); // Besenzoni
  ritratti.push(loadImage("img/ritratti/ritratto2.png")); // Franchi
  ritratti.push(loadImage("img/ritratti/ritratto3.png")); // Marozzi
  ritratti.push(loadImage("img/ritratti/ritratto4.png")); // Preioni
  ritratti.push(loadImage("img/ritratti/ritratto5.png")); // Soraruf
  ritratti.push(loadImage("img/ritratti/ritratto6.png")); // Zanotto

  // icone
  iconaGr = loadImage("img/icone/grafico-bianco.png");
  iconaFh = loadImage("img/icone/fh-bianco.png");

  // Offset verticale (Y)
  offsetY.push(-25);
  offsetY.push(-50);
  offsetY.push(-25);
  offsetY.push(-25);
  offsetY.push(5);
  offsetY.push(-25);

  // Offset orizzontale (X)
  offsetXimg.push(30);
  offsetXimg.push(10);
  offsetXimg.push(30);
  offsetXimg.push(20);
  offsetXimg.push(20);
  offsetXimg.push(-10);
}

function setup() {
  const margineTop = 320;
  const margineBottom = 100;
  const spaziaturaV = 240;
  const altezzaRett = 280;
  const numRighe = 2;
  
  const altezzaTotale = margineTop + (altezzaRett * numRighe) + (spaziaturaV * (numRighe - 1)) + margineBottom + 100;
  
  createCanvas(windowWidth, max(windowHeight, altezzaTotale));

  creaTitolo();
  creaTestoIntroduttivo();
  creaTestiRettangoli();
  creaBottoniNavigazione();
}

function draw() {
  background("#26231d"); // Sfondo nero
  disegnaRettangoli();
}

// --- DISEGNA RETTANGOLI ---
function disegnaRettangoli() {
  const numColonne = 3;
  const numRighe = 2;
  const raggio = 20;
  
  const margineTop = 320;
  const spaziaturaH = 230;
  const spaziaturaV = 240;
  const larghezzaRett = 245;
  const altezzaRett = 280;

  const larghezzaTotale = (larghezzaRett * numColonne) + (spaziaturaH * (numColonne - 1));
  const offsetX = (width - larghezzaTotale) / 2;
  
  noStroke();

  for (let riga = 0; riga < numRighe; riga++) {
    for (let colonna = 0; colonna < numColonne; colonna++) {
      let indice = riga * numColonne + colonna;
      let x = offsetX + (colonna * (larghezzaRett + spaziaturaH));
      let y = margineTop + (riga * (altezzaRett + spaziaturaV));

      // Rettangolo
      fill('#3d3a34'); // Colore più chiaro per contrasto su sfondo nero
      rect(x, y, larghezzaRett, altezzaRett, raggio);

      // Immagine ritratto
      if (ritratti[indice]) {
        push();
        beginClip();
        rect(x - 1000, y - 1000, larghezzaRett + 2000, altezzaRett + 1000, raggio);
        endClip();

        let img = ritratti[indice];
        let zoomFactor = 1.8;

        let offsetCentraturaX = offsetXimg[indice] || 30;
        let offsetCentraturaY = offsetY[indice] || -25;

        let rapportoImg = img.width / img.height;
        let rapportoRett = larghezzaRett / altezzaRett;
        let imgW, imgH;

        if (rapportoImg > rapportoRett) {
          imgH = altezzaRett * zoomFactor;
          imgW = imgH * rapportoImg;
        } else {
          imgW = larghezzaRett * zoomFactor;
          imgH = imgW / rapportoImg;
        }

        let imgX = x + (larghezzaRett - imgW) / 2 + offsetCentraturaX;
        let imgY = y + (altezzaRett - imgH) / 2 + offsetCentraturaY;

        image(img, imgX, imgY, imgW, imgH);
        pop();
      }

      // Testo sotto rettangolo
      if (testiRettangoli[indice]) {
        testiRettangoli[indice].position(x + 10, y + altezzaRett + 20);
      }
    }
  }
}

// --- RIDIMENSIONAMENTO ---
function windowResized() {
  const margineTop = 320;
  const margineBottom = 100;
  const spaziaturaV = 170;
  const altezzaRett = 280;
  const numRighe = 2;

  const altezzaTotale = margineTop + (altezzaRett * numRighe) + (spaziaturaV * (numRighe - 1)) + margineBottom + 100;

  resizeCanvas(windowWidth, max(windowHeight, altezzaTotale));
  riposizionaElementiDOM();
}

// --- TITOLO ---
function creaTitolo() {
  titolo = createElement('h1', 'About us');
  titolo.position(110, 35);
  titolo.style('color', '#eaead8'); // Testo bianco
  titolo.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  titolo.style('font-size', '70px');
  titolo.style('margin', '0');
  titolo.style('padding', '0');
  titolo.style('line-height', '60px');
  titolo.style('z-index', '1000');
  titolo.style('position', 'absolute');
}

// --- TESTO INTRODUTTIVO ---
function creaTestoIntroduttivo() {
  testoIntro = createP('We are a group of students at the Design department of Politecnico di Milano. We have chosen to address the theme of freedom and democracy in the world, concerned about the increasing cases of violations. Through this analysis, we want to inform and raise awareness so that we can contribute to change.');
  testoIntro.position(110, 100);
  testoIntro.style('color', '#eaead8'); // Testo bianco
  testoIntro.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  testoIntro.style('font-size', '17px');
  testoIntro.style('margin', '0');
  testoIntro.style('padding', '0');
  testoIntro.style('line-height', '24px');
  testoIntro.style('max-width', '1000px');
  testoIntro.style('z-index', '1000');
  testoIntro.style('position', 'absolute');
}

// --- TESTI SOTTO RETTANGOLI ---
function creaTestiRettangoli() {
  const testiContent = [
    '<span style="font-size: 19px;"><strong>Federica Besenzoni</strong></span>',
    '<span style="font-size: 19px;"><strong>Vittoria Franchi</strong></span>',
    '<span style="font-size: 19px;"><strong>Asia Marozzi</strong></span>',
    '<span style="font-size: 19px;"><strong>Aurora Preioni</strong></span>',
    '<span style="font-size: 19px;"><strong>Jasmin Soraruf</strong></span>',
    '<span style="font-size: 19px;"><strong>Sheetal Zanotto</strong></span>'
  ];

  for (let i = 0; i < testiContent.length; i++) {
    let testo = createP(testiContent[i]);
    testo.style('color', '#eaead8'); // Testo bianco
    testo.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
    testo.style('font-size', '17px');
    testo.style('margin', '0');
    testo.style('padding', '0');
    testo.style('line-height', '22px');
    testo.style('z-index', '1000');
    testo.style('position', 'absolute');
    testiRettangoli.push(testo);
  }
}

// --- BOTTONI ---
function creaBottoniNavigazione() {
  const diametro = 60;
  const yPos = 30;
  const margineDestro = 25;
  const gap = 20;
  const nero = '#26231d';
  const bianco = '#eaead8';

  // --- BOTTONE FREEDOMHOUSE CON ICONA ---
  let xFH = width - diametro - margineDestro;
  bottoneFH = createButton('');
  bottoneFH.position(xFH, yPos);
  
  const immagineFH = iconaFh.canvas.toDataURL();
  bottoneFH.html(`<img src="${immagineFH}" alt="FH" style="width: 80%; height: 80%; object-fit: contain;">`);

  bottoneFH.style('width', diametro + 'px');
  bottoneFH.style('height', diametro + 'px');
  bottoneFH.style('border-radius', '50%');
  bottoneFH.style('background-color', nero);
  bottoneFH.style('border', '1px solid ' + bianco);
  bottoneFH.style('cursor', 'pointer');
  bottoneFH.style('z-index', '1000');
  bottoneFH.style('position', 'absolute');
  bottoneFH.style('padding', '0');
  bottoneFH.style('display', 'flex');
  bottoneFH.style('align-items', 'center');
  bottoneFH.style('justify-content', 'center');
  
  tooltipFH = createDiv('About FreedomHouse');
  tooltipFH.style('display', 'none');
  tooltipFH.style('position', 'absolute');
  tooltipFH.style('background-color', bianco);
  tooltipFH.style('color', nero);
  tooltipFH.style('padding', '8px 12px');
  tooltipFH.style('border-radius', '16px'); 
  tooltipFH.style('font-family', 'NeueHaasDisplay, sans-serif');
  tooltipFH.style('font-size', '14px');
  tooltipFH.style('z-index', '1001');
  tooltipFH.style('white-space', 'nowrap');
  tooltipFH.style('pointer-events', 'none');

  bottoneFH.mouseOver(() => {
    tooltipFH.style('display', 'block');
    let larghezzaTooltip = tooltipFH.elt.offsetWidth;
    let xAllineatoDestra = xFH + diametro - larghezzaTooltip; // ← Allineato a destra
    let yTooltip = yPos + diametro + 10;
    tooltipFH.position(xAllineatoDestra, yTooltip);
  });

  bottoneFH.mouseOut(() => {
    tooltipFH.style('display', 'none');
  });

  bottoneFH.mousePressed(() => {
    window.location.href = 'freedomhouse.html';
  });

  // --- BOTTONE GRAFICO CON ICONA ---
  let xGr = xFH - diametro - gap;
  bottoneGr = createButton('');
  bottoneGr.position(xGr, yPos);
  
  const immagineGr = iconaGr.canvas.toDataURL();
  bottoneGr.html(`<img src="${immagineGr}" alt="GR" style="width: 80%; height: 80%; object-fit: contain;">`);

  bottoneGr.style('width', diametro + 'px');
  bottoneGr.style('height', diametro + 'px');
  bottoneGr.style('border-radius', '50%');
  bottoneGr.style('background-color', nero);
  bottoneGr.style('border', '1px solid ' + bianco);
  bottoneGr.style('cursor', 'pointer');
  bottoneGr.style('z-index', '1000');
  bottoneGr.style('position', 'absolute');
  bottoneGr.style('padding', '0');
  bottoneGr.style('display', 'flex');
  bottoneGr.style('align-items', 'center');
  bottoneGr.style('justify-content', 'center');
  
  tooltipGr = createDiv('Global Rankings');
  tooltipGr.style('display', 'none');
  tooltipGr.style('position', 'absolute');
  tooltipGr.style('background-color', bianco);
  tooltipGr.style('color', nero);
  tooltipGr.style('padding', '8px 12px');
  tooltipGr.style('border-radius', '16px'); 
  tooltipGr.style('font-family', 'NeueHaasDisplay, sans-serif');
  tooltipGr.style('font-size', '14px');
  tooltipGr.style('z-index', '1001');
  tooltipGr.style('white-space', 'nowrap');
  tooltipGr.style('pointer-events', 'none');

  bottoneGr.mouseOver(() => {
    tooltipGr.style('display', 'block');
    let larghezzaTooltip = tooltipGr.elt.offsetWidth;
    let xCentrato = xGr + (diametro - larghezzaTooltip) / 2; // ← Centrato
    let yTooltip = yPos + diametro + 10;
    tooltipGr.position(xCentrato, yTooltip);
  });

  bottoneGr.mouseOut(() => {
    tooltipGr.style('display', 'none');
  });

  bottoneGr.mousePressed(() => {
    window.location.href = 'index.html';
  });

  // --- BOTTONE BACK CON SVG ---
  creaBottoneBack(nero, bianco);
}

function creaBottoneBack(nero, bianco) {
  const diametroBottone = 60;
  const raggio = diametroBottone / 2;
  const xPos = 40;
  const yPos = 40;
  
  bottoneBack = createButton('');
  bottoneBack.position(xPos, yPos);
  
  bottoneBack.html(`
    <svg width="${raggio}" height="${raggio}" viewBox="0 0 24 24" fill="none" stroke="${bianco}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line> 
      <polyline points="12 5 5 12 12 19"></polyline> 
    </svg>
  `);
  
  bottoneBack.style('width', diametroBottone + 'px');
  bottoneBack.style('height', diametroBottone + 'px');
  bottoneBack.style('border-radius', '50%');
  bottoneBack.style('background-color', nero); // Sfondo nero
  bottoneBack.style('border', '1px solid ' + bianco); // Bordo bianco
  bottoneBack.style('display', 'flex');
  bottoneBack.style('align-items', 'center');
  bottoneBack.style('justify-content', 'center');
  bottoneBack.style('cursor', 'pointer');
  bottoneBack.style('z-index', '1002');
  bottoneBack.style('padding', '0');

  bottoneBack.mousePressed(() => {
    window.history.back();
  });
}

function riposizionaElementiDOM() {
  const diametro = 60;
  const yPos = 30;
  const gap = 20;
  const margineDestro = 25;

  let xFH = width - diametro - margineDestro;
  let xGr = xFH - diametro - gap;

  titolo.position(110, 35);
  testoIntro.position(110, 100);
  bottoneFH.position(xFH, yPos);
  bottoneGr.position(xGr, yPos);
  
  if (tooltipFH) {
    tooltipFH.style('display', 'none');
  }
  if (tooltipGr) {
    tooltipGr.style('display', 'none');
  }
}