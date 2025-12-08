// variabili globali
let data;
let bottoneUS;
let bottoneFH;
let titolo; 
let riquadro1;
let riquadro2;

function preload() {
  // data = loadTable("assets/data.csv", "csv", "header"); // caricamento del dataset
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Crea i bottoni di navigazione e il titolo
  creaBottoniNavigazione();
  creaTitolo();
  creaRiquadri();
}

function draw() {
  background("#26231d");
}

// funzione per creare il titolo in alto a sinistra
function creaTitolo() {
  titolo = createElement('h1', 'Freedom House');
  titolo.position(25, 35);
  
  // Stile del titolo
  titolo.style('color', '#f0f0f0');
  titolo.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  titolo.style('font-size', '70px');
  titolo.style('margin', '0');
  titolo.style('padding', '0');
  titolo.style('line-height', '60px');
  titolo.style('z-index', '1000');
}

// funzione per creare i riquadri informativi
function creaRiquadri() {
  const margine = 25;
  const yInizio = 30 + 60 + 40; // titolo y + altezza titolo + spaziatura
  const spaziaturaRiquadri = 20;
  const altezzaRiquadro = 200;
  
  // Calcola la larghezza totale disponibile
  const larghezzaTotale = width - (margine * 2);
  // Calcola la larghezza di ogni riquadro (metà della larghezza totale meno la spaziatura)
  const larghezzaRiquadro = (larghezzaTotale - spaziaturaRiquadri) / 2;

  // --- Riquadro 1 ---
  riquadro1 = createDiv();
  riquadro1.position(margine, yInizio);
  
  // Stile del riquadro
  riquadro1.style('width', larghezzaRiquadro + 'px');
  riquadro1.style('height', 'auto'); // <-- lascia che si adatti al testo
  riquadro1.style('min-height', '50px');
  riquadro1.style('background-color', '#26231d');
  riquadro1.style('border', '2px solid #c76351');
  riquadro1.style('border-radius', '15px');
  riquadro1.style('padding', '20px');
  riquadro1.style('box-sizing', 'border-box');
  riquadro1.style('z-index', '1000');
  
  // Contenuto del riquadro
  riquadro1.html(`
    <p style="color: #eaead8; font-family: 'NeueHaasGrotDisp-55Roman', sans-serif; margin: 0; font-size: 14px; line-height: 1.6;">
      Freedom House was founded in 1941 by Wendell Willkie to counter the advance of Nazi Germany and raise public awareness about the threat it posed.
Today, Freedom House is an international non-governmental organization headquartered in Washington D.C., led by Gerardo Berthin and Annie Wilcox Boyajian. The organization sustains itself through funding which, as evident from public financial reports, comes 90% from the federal government of the United States of America. Despite this funding source, Freedom House's vision remains independent and its commitment to objectivity stays unwavering.
Over the years, FH has established itself as the leading American organization dedicated to supporting and defending democracy worldwide. Through accurate data and analysis, it systematically monitors the most urgent threats and, through its programs, promotes policies that strengthen democracy and protect human rights.
The organization's commitment is also reflected in its collaboration with activists who reinforce the credibility of its work and bring their concerns to prominent institutional spaces, such as the United Nations and the United States Congress. When necessary, Freedom House also strives to protect these individuals when they are persecuted for their ideas.

    </p>
  `);
  
  // --- Riquadro 2 ---
  riquadro2 = createDiv();
  riquadro2.position(margine + larghezzaRiquadro + spaziaturaRiquadri, yInizio);
  
  // Stile del riquadro
  riquadro2.style('width', larghezzaRiquadro + 'px');
  riquadro2.style('height', 'auto');
  riquadro2.style('min-height', '50px');
  riquadro2.style('background-color', '#26231d');
  riquadro2.style('border', '2px solid #75a099');
  riquadro2.style('border-radius', '15px');
  riquadro2.style('padding', '20px');
  riquadro2.style('box-sizing', 'border-box');
  riquadro2.style('z-index', '1000');
  
  // Contenuto del riquadro
  riquadro2.html(`
    <p style="color: #eaead8; font-family: 'NeueHaasGrotDisp-55Roman', sans-serif; margin: 0; font-size: 14px; line-height: 1.6;">
      The "Freedom in the World" report is produced annually by a team of approximately 60 specialists, including internal and external analysts, academic consultants, and human rights experts.
The methodology is not based on public opinion surveys, but rather on assessments conducted by regional experts who answer twenty-five questions for each country. The responses are then reviewed by a central FH committee to ensure consistency.
FH analyzes two macro-aspects: political rights, which concern citizens' participation in the political process and their ability to influence the government; and civil liberties, namely personal freedoms and individual rights that protect against abuses of political, social, and religious power. Each aspect is divided into sub-parameters evaluated through specific questions.
Each question receives a score from 0 to 4 based on the conditions observed during the reference period. The sum determines the total score: a maximum of 40 points for political rights and 60 for civil liberties. Each score range corresponds to a rating from 1 (most free) to 7 (least free). The final index is the average of the ratings for the two macro-aspects, classifying countries as Free, Partly Free, and Not Free. They can include countries with different scores.

    </p>
  `);
}

// funzione per creare i bottoni di navigazione in alto a destra
function creaBottoniNavigazione() {
  const diametroBottone = 60;
  const yPos = 30;
  const spaziaturaTraBottoni = 20;

  // Calcolo delle posizioni X
  let xFH = width - diametroBottone - 25;
  let xUS = xFH - diametroBottone - spaziaturaTraBottoni; 
  
  // --- Bottone Freedom House (FH) ---
  bottoneFH = createButton('FH');
  bottoneFH.position(xFH, yPos);
  
  // Stile del bottone
  bottoneFH.style('width', diametroBottone + 'px');
  bottoneFH.style('height', diametroBottone + 'px');
  bottoneFH.style('border-radius', '50%');
  bottoneFH.style('background-color', '#26231d'); 
  bottoneFH.style('color', '#f0f0f0');
  bottoneFH.style('border', '1px solid #f0f0f0');
  bottoneFH.style('text-align', 'center');
  bottoneFH.style('line-height', diametroBottone + 'px');
  bottoneFH.style('font-size', '18px');
  bottoneFH.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottoneFH.style('cursor', 'pointer');
  bottoneFH.style('z-index', '1000');
  
  // Link
  bottoneFH.mousePressed(() => {
    window.location.href = 'freedomhouse.html';
  });
  
  // --- Bottone USA (US) ---
  bottoneUS = createButton('US');
  bottoneUS.position(xUS, yPos);
  
  // Stile del bottone
  bottoneUS.style('width', diametroBottone + 'px');
  bottoneUS.style('height', diametroBottone + 'px');
  bottoneUS.style('border-radius', '50%'); 
  bottoneUS.style('background-color', '#26231d'); 
  bottoneUS.style('color', '#f0f0f0');
  bottoneUS.style('border', '1px solid #f0f0f0');
  bottoneUS.style('text-align', 'center');
  bottoneUS.style('line-height', diametroBottone + 'px'); 
  bottoneUS.style('font-size', '18px');
  bottoneUS.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottoneUS.style('cursor', 'pointer');
  bottoneUS.style('z-index', '1000');

  // Link
  bottoneUS.mousePressed(() => {
    window.location.href = 'us.html';
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Riposiziona gli elementi quando la finestra viene ridimensionata
  const diametroBottone = 60;
  const spaziaturaTraBottoni = 20;
  let xFH = width - diametroBottone - 25;
  let xUS = xFH - diametroBottone - spaziaturaTraBottoni;
  
  bottoneFH.position(xFH, 30);
  bottoneUS.position(xUS, 30);
}