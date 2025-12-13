let bottoneUS;
let bottoneFH;
let bottoneBack;
let titolo;
let testoIntro;
let testiRettangoli = [];
let ritratti = []; // Array per le immagini dei rettangoli
let offsetY = [];  // Array per offset verticale dei ritratti
let offsetXimg = []; // Offset orizzontale per ogni ritratto

function preload() {
  // Carica le immagini dei ritratti
  ritratti.push(loadImage("ritratto1.png")); // Besenzoni
  ritratti.push(loadImage("ritratto2.png")); // Franchi
  ritratti.push(loadImage("ritratto3.png")); // Marozzi
  ritratti.push(loadImage("ritratto4.png")); // Preioni
  ritratti.push(loadImage("ritratto5.png")); // Soraruf
  ritratti.push(loadImage("ritratto6.png")); // Zanotto

  // Offset verticale (Y)
  offsetY.push(-25); // 1
  offsetY.push(-50); // 2
  offsetY.push(-25); // 3
  offsetY.push(-25); // 4
  offsetY.push(5);   // 5
  offsetY.push(-25); // 6

  // Offset orizzontale (X)
  offsetXimg.push(30); // 1
  offsetXimg.push(10); // 2 
  offsetXimg.push(30); // 3
  offsetXimg.push(20); // 4
  offsetXimg.push(20); // 5
  offsetXimg.push(-10); // 6
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
  background("#eaead8");
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
      fill('#bcbcab');
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
  titolo.position(25, 35);
  titolo.style('color', '#26231d');
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
  testoIntro.position(25, 100);
  testoIntro.style('color', '#26231d');
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
    '<span style="font-size: 19px;"><strong>Federica Besenzoni</strong></span><br><strong>Codice visualizzazione singola</strong><br>la libertà è Lorem ipsum dolor sit <br>amet, consectetur adipiscing elit.',
    '<span style="font-size: 19px;"><strong>Vittoria Franchi</strong></span><br><strong>Testi, codice pagine boh</strong><br>la libertà è Lorem ipsum dolor sit <br>amet, consectetur adipiscing elit.',
    '<span style="font-size: 19px;"><strong>Asia Marozzi</strong></span><br><strong>Codice visualizzazione generale</strong><br>la libertà è Lorem ipsum dolor sit <br>amet, consectetur adipiscing elit.',
    '<span style="font-size: 19px;"><strong>Aurora Preioni</strong></span><br><strong>Codice visualizzazione singola</strong><br>la libertà è Lorem ipsum dolor sit <br>amet, consectetur adipiscing elit.',
    '<span style="font-size: 19px;"><strong>Jasmin Soraruf</strong></span><br><strong>Illustrazioni, codice introduzione</strong><br>la libertà è Lorem ipsum dolor sit <br>amet, consectetur adipiscing elit.',
    '<span style="font-size: 19px;"><strong>Sheetal Zanotto</strong></span><br><strong>Codice introduzione</strong><br>la libertà è Lorem ipsum dolor sit <br>amet, consectetur adipiscing elit.'
  ];

  for (let i = 0; i < testiContent.length; i++) {
    let testo = createP(testiContent[i]);
    testo.style('color', '#26231d');
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

  bottoneFH = createButton('FH');
  applicaStiliBottone(bottoneFH, diametro);
  bottoneFH.mousePressed(() => { window.location.href = 'freedomhouse.html'; });

  bottoneUS = createButton('US');
  applicaStiliBottone(bottoneUS, diametro);
  bottoneUS.mousePressed(() => { window.location.href = 'us.html'; });

  bottoneBack = createButton('<');
  applicaStiliBottoneBack(bottoneBack, diametro);
  bottoneBack.mousePressed(() => { window.history.back(); });

  riposizionaElementiDOM();
}

function applicaStiliBottone(bottone, diametro) {
  bottone.style('width', diametro + 'px');
  bottone.style('height', diametro + 'px');
  bottone.style('border-radius', '50%');
  bottone.style('background-color', '#eaead8');
  bottone.style('color', '#26231d');
  bottone.style('border', '1px solid #26231d');
  bottone.style('text-align', 'center');
  bottone.style('line-height', diametro + 'px');
  bottone.style('font-size', '18px');
  bottone.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottone.style('cursor', 'pointer');
  bottone.style('z-index', '1000');
  bottone.style('position', 'absolute');
}

function applicaStiliBottoneBack(bottone, diametro) {
  bottone.style('width', diametro + 'px');
  bottone.style('height', diametro + 'px');
  bottone.style('border-radius', '50%');
  bottone.style('background-color', '#eaead8');
  bottone.style('color', '#26231d');
  bottone.style('border', '1px solid #26231d');
  bottone.style('display', 'flex');
  bottone.style('align-items', 'center');
  bottone.style('justify-content', 'center');
  bottone.style('font-size', '28px');
  bottone.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottone.style('cursor', 'pointer');
  bottone.style('z-index', '1000');
  bottone.style('position', 'absolute');
  bottone.style('padding', '0');
}

function riposizionaElementiDOM() {
  const diametro = 60;
  const yPos = 30;
  const gap = 20;

  let xFH = windowWidth - diametro - 25;
  let xUS = xFH - diametro - gap;
  let xBack = xUS - diametro - gap;

  titolo.position(25, 35);
  testoIntro.position(25, 100);
  bottoneFH.position(xFH, yPos);
  bottoneUS.position(xUS, yPos);
  bottoneBack.position(xBack, yPos);
}
