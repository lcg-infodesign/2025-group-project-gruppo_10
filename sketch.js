let bottoneUS;
let bottoneFH;
let titolo;
let testoIntro;
let testiRettangoli = [];

function preload() {
}

function setup() {
  // Calcola l'altezza totale necessaria per contenere tutti i rettangoli
  const margineTop = 250;
  const margineBottom = 100;
  const spaziaturaV = 200;
  const altezzaRett = 300;
  const numRighe = 2;
  
  const altezzaTotale = margineTop + (altezzaRett * numRighe) + (spaziaturaV * (numRighe - 1)) + margineBottom;
  
  // Crea la canvas con altezza sufficiente per tutti i contenuti
  createCanvas(windowWidth, max(windowHeight, altezzaTotale));

  // Crea gli elementi HTML
  creaTitolo();
  creaTestoIntroduttivo();
  creaTestiRettangoli();
  creaBottoniNavigazione();
}

function draw() {
  // Sfondo (colore #eaead8)
  background("#eaead8");
  
  // Disegna i sei rettangoli
  disegnaRettangoli();
}

// --- DISEGNA RETTANGOLI ---

function disegnaRettangoli() {
  const numColonne = 3;
  const numRighe = 2;
  const raggio = 20; // raggio degli angoli arrotondati
  
  // Margini uguali a quelli del titolo e bottoni
  const margineTop = 250; // spazio per titolo + testo introduttivo
  const margineBottom = 100; // margine inferiore (equivalente a titolo + bottoni)
  const margineSx = 25; // uguale al margine del titolo
  const margineDx = 25; // uguale al margine dei bottoni
  
   // Spaziatura tra i rettangoli
  const spaziaturaH = 250; // spaziatura orizzontale aumentata
  const spaziaturaV = 170; // spaziatura verticale aumentata
  
  // Dimensioni fisse dei rettangoli (più piccoli)
  const larghezzaRett = 240; // larghezza fissa
  const altezzaRett = 270; // altezza fissa (maggiore della larghezza)
  
  // Calcola la larghezza totale necessaria per centrare i rettangoli
  const larghezzaTotale = (larghezzaRett * numColonne) + (spaziaturaH * (numColonne - 1));
  const offsetX = (width - larghezzaTotale) / 2;
  
  // Disegna i rettangoli
  fill('#bcbcabff');
  noStroke();
  
  for (let riga = 0; riga < numRighe; riga++) {
    for (let colonna = 0; colonna < numColonne; colonna++) {
      let x = offsetX + (colonna * (larghezzaRett + spaziaturaH));
      let y = margineTop + (riga * (altezzaRett + spaziaturaV));
      
      // Disegna il rettangolo
      rect(x, y, larghezzaRett, altezzaRett, raggio);
      
      // Aggiorna posizione del testo sotto il rettangolo
      let indice = riga * numColonne + colonna;
      if (testiRettangoli[indice]) {
        testiRettangoli[indice].style('left', (x + 10) + 'px');
        testiRettangoli[indice].style('top',  (y + altezzaRett + 20) + 'px');
      }
    }
  }
}

// --- GESTIONE RIDIMENSIONAMENTO ---
function windowResized() {
  // Calcola l'altezza necessaria
  const margineTop = 250;
  const margineBottom = 100;
  const spaziaturaV = 200;
  const altezzaRett = 300;
  const numRighe = 2;
  
  const altezzaTotale = margineTop + (altezzaRett * numRighe) + (spaziaturaV * (numRighe - 1)) + margineBottom;
  
  resizeCanvas(windowWidth, max(windowHeight, altezzaTotale));
  riposizionaElementiDOM();
}

// --- TITOLO ---
function creaTitolo() {
  titolo = createElement('h1', 'About us');
  titolo.position(25, 35);
  
  // Stili
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
  testoIntro = createP('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.');
  testoIntro.position(25, 110);
  
  // Stili
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

// --- TESTI SOTTO I RETTANGOLI ---
function creaTestiRettangoli() {
  const testiContent = [
    '<strong>Federica Besenzoni</strong><br>Ruolo<br>la libertà è',
    '<strong>Vittoria Franchi</strong><br>Ruolo<br>la libertà è',
    '<strong>Asia Marozzi</strong><br>Ruolo<br>la libertà è',
    '<strong>Aurora Preioni</strong><br>Ruolo<br>la libertà è',
    '<strong>Jasmin Soraruf</strong><br>Ruolo<br>la libertà è',
    '<strong>Sheetal Zanotto</strong><br>Ruolo<br>la libertà è'
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

// --- BOTTONI DI NAVIGAZIONE ---
function creaBottoniNavigazione() {
  const diametro = 60;
  
  // --- Bottone FH ---
  bottoneFH = createButton('FH');
  applicaStiliBottone(bottoneFH, diametro);
  bottoneFH.mousePressed(() => {
    window.location.href = 'freedomhouse.html';
  });

  // --- Bottone US ---
  bottoneUS = createButton('US');
  applicaStiliBottone(bottoneUS, diametro);
  bottoneUS.mousePressed(() => {
    window.location.href = 'us.html';
  });
  
  riposizionaElementiDOM();
}

// Funzione helper per applicare gli stili ai bottoni
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

// Funzione dedicata al riposizionamento di tutti gli elementi DOM
function riposizionaElementiDOM() {
  const diametro = 60;
  const yPos = 30;
  const gap = 20;

  // Calcolo delle posizioni in base alla larghezza corrente della finestra
  let xFH = windowWidth - diametro - 25;
  let xUS = xFH - diametro - gap;

  // Riposiziona il titolo
  titolo.position(25, 35);
  
  // Riposiziona il testo introduttivo
  testoIntro.position(25, 110);
  
  // Riposiziona i bottoni
  bottoneFH.position(xFH, yPos);
  bottoneUS.position(xUS, yPos);
}