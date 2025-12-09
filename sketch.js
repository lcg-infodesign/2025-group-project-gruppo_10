// variabili globali
let data;
let bottoneUS;
let bottoneFH;
let titolo; 
let riquadro1;
let riquadro2;
let riquadro3;
let riquadro4;
let titoloVerticale;
let titoloVerticale2;
let titoloVerticale3;
let titoloVerticale4;

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
  titolo.style('color', '#eaead8');
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
  const larghezzaTitoloVerticale1 = 40; // spazio per il primo titolo verticale
  const larghezzaTitoloVerticale2 = 40; // spazio per il secondo titolo verticale
  const spaziaturaTitoloVerticale = 20;

  // Calcola la larghezza totale disponibile
  const larghezzaTotale = width - (margine * 2);
  // Calcola la larghezza di ogni riquadro
  const larghezzaRiquadro1 = (larghezzaTotale - spaziaturaRiquadri - spaziaturaTitoloVerticale * 4 - larghezzaTitoloVerticale1 - larghezzaTitoloVerticale2) / 2;
  const larghezzaRiquadro2 = (larghezzaTotale - spaziaturaRiquadri - spaziaturaTitoloVerticale * 4 - larghezzaTitoloVerticale1 - larghezzaTitoloVerticale2) / 2;

  // --- Riquadro 1 ---
  riquadro1 = createDiv();
  riquadro1.position(margine, yInizio);
  
  // Stile del riquadro
  riquadro1.style('width', larghezzaRiquadro1 + 'px');
  riquadro1.style('height', 'auto');
  riquadro1.style('min-height', '50px');
  riquadro1.style('background-color', '#26231d');
  riquadro1.style('border', '2px solid #c76351');
  riquadro1.style('border-radius', '15px');
  riquadro1.style('padding', '20px');
  riquadro1.style('box-sizing', 'border-box');
  riquadro1.style('z-index', '1000');
  
  // Contenuto del riquadro
  riquadro1.html(`
    <p style="color: #eaead8; font-family: 'NeueHaasGrotDisp-55Roman', sans-serif; margin: 0; font-size: 18px; line-height: 1.4;">
      Freedom House was founded in 1941 by Wendell Willkie to counter the advance of Nazi Germany and raise public awareness about 
      the threat it posed. Today, Freedom House is an international non-governmental organization headquartered in Washington D.C., 
      led by Gerardo Berthin and Annie Wilcox Boyajian. The organization sustains itself through funding which, as evident from 
      public financial reports, comes 90% from the federal government of the United States of America. Despite this funding source, 
      Freedom House's vision remains independent and its commitment to objectivity stays unwavering.
      Over the years, FH has established itself as the leading American organization dedicated to supporting and defending democracy 
      worldwide. Through accurate data and analysis, it systematically monitors the most urgent threats and, through its programs, 
      promotes policies that strengthen democracy and protect human rights.
      The organization's commitment is also reflected in its collaboration with activists who reinforce the credibility of its work 
      and bring their concerns to prominent institutional spaces, such as the United Nations and the United States Congress. When 
      necessary, Freedom House also strives to protect these individuals when they are persecuted for their ideas.
    </p>
  `);
  
  // --- Primo Titolo Verticale ---
  titoloVerticale = createDiv('About');
  const xTitoloVerticale = margine + larghezzaRiquadro1 + spaziaturaTitoloVerticale;
  const yTitoloVerticale = yInizio + 5;
  titoloVerticale.position(xTitoloVerticale, yTitoloVerticale);
  
  // Stile del titolo verticale
  titoloVerticale.style('width', larghezzaTitoloVerticale1 + 'px');
  titoloVerticale.style('height', 'auto');
  titoloVerticale.style('display', 'flex');
  titoloVerticale.style('align-items', 'flex-start');
  titoloVerticale.style('justify-content', 'center');
  titoloVerticale.style('color', '#c76351');
  titoloVerticale.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  titoloVerticale.style('font-size', '50px');
  titoloVerticale.style('writing-mode', 'vertical-rl');
  titoloVerticale.style('text-orientation', 'mixed');
  titoloVerticale.style('letter-spacing', '4px');
  titoloVerticale.style('z-index', '1000');
  
  // --- Riquadro 2 ---
  riquadro2 = createDiv();
  const xRiquadro2 = margine + larghezzaRiquadro1 + spaziaturaTitoloVerticale + larghezzaTitoloVerticale1 + spaziaturaTitoloVerticale + spaziaturaRiquadri;
  riquadro2.position(xRiquadro2, yInizio);
  
  // Stile del riquadro
  riquadro2.style('width', larghezzaRiquadro2 + 'px');
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
    <p style="color: #eaead8; font-family: 'NeueHaasGrotDisp-55Roman', sans-serif; margin: 0; font-size: 18px; line-height: 1.4;">
      The "Freedom in the World" report is produced annually by a team of approximately 60 specialists, 
      including internal and external analysts, academic consultants, and human rights experts.
      The methodology is not based on public opinion surveys, but rather on assessments conducted by 
      regional experts who answer twenty-five questions for each country. The responses are then reviewed 
      by a central FH committee to ensure consistency.
      FH analyzes two macro-aspects: political rights, which concern citizens' participation in the political 
      process and their ability to influence the government; and civil liberties, namely personal freedoms and 
      individual rights that protect against abuses of political, social, and religious power. Each aspect is 
      divided into sub-parameters evaluated through specific questions.
      Each question receives a score from 0 to 4 based on the conditions observed during the reference period. 
      The sum determines the total score: a maximum of 40 points for political rights and 60 for civil liberties. 
      Each score range corresponds to a rating from 1 (most free) to 7 (least free). The final index is the average of 
      the ratings for the two macro-aspects, classifying countries as Free, Partly Free, and Not Free—categories that prove 
      vague as they can include countries with vastly different scores
    </p>
  `);
  
  // --- Secondo Titolo Verticale ---
  titoloVerticale2 = createDiv('Methodology');
  const xTitoloVerticale2 = xRiquadro2 + larghezzaRiquadro2 + spaziaturaTitoloVerticale;
  const yTitoloVerticale2 = yInizio + 5;
  titoloVerticale2.position(xTitoloVerticale2, yTitoloVerticale2);
  
  // Stile del secondo titolo verticale
  titoloVerticale2.style('width', larghezzaTitoloVerticale2 + 'px');
  titoloVerticale2.style('height', 'auto');
  titoloVerticale2.style('display', 'flex');
  titoloVerticale2.style('align-items', 'flex-start');
  titoloVerticale2.style('justify-content', 'center');
  titoloVerticale2.style('color', '#75a099');
  titoloVerticale2.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  titoloVerticale2.style('font-size', '50px');
  titoloVerticale2.style('writing-mode', 'vertical-rl');
  titoloVerticale2.style('text-orientation', 'mixed');
  titoloVerticale2.style('letter-spacing', '4px');
  titoloVerticale2.style('z-index', '1000');
  
  // --- Riquadro 3 ---
  const spaziaturaVerticale = 20;
  const altezzaRiquadro1 = riquadro1.elt.offsetHeight; // ottiene l'altezza effettiva del riquadro1
  const yRiquadro3 = yInizio + altezzaRiquadro1 + spaziaturaVerticale;
  
  riquadro3 = createDiv();
  riquadro3.position(margine, yRiquadro3);
  
  // Stile del riquadro
  riquadro3.style('width', larghezzaRiquadro1 + 'px');
  riquadro3.style('height', 'auto');
  riquadro3.style('min-height', '50px');
  riquadro3.style('background-color', '#26231d');
  riquadro3.style('border', '2px solid #e5c38f');
  riquadro3.style('border-radius', '15px');
  riquadro3.style('padding', '20px');
  riquadro3.style('box-sizing', 'border-box');
  riquadro3.style('z-index', '1000');
  
  // Contenuto del riquadro
  riquadro3.html(`
    <p style="color: #eaead8; font-family: 'NeueHaasGrotDisp-55Roman', sans-serif; margin: 0; font-size: 18px; line-height: 1.4;">
      Freedom House does not specifically calculate how democratic a state is, but rather focuses on measuring the degree of freedom 
      in each country. Assessing the state of democracy in a country is complex, partly because citizens' opinions vary and even 
      experts' assessments can be subjective on certain aspects. Nevertheless, various analyses agree on the significant differences 
      among political institutions and on the distinction between more and less democratic countries.
      Freedom House adopts a narrow distinction of democracy, separating it into electoral and liberal. The more general classification 
      divides countries between non-democratic ones and those where democracy is electoral.
      Countries are further classified as Free, Partly Free, and Not Free. In the first category, citizens enjoy full political rights and 
     civil liberties, elections are free, the press is independent, and the rule of law is upheld. In the second, freedoms are guaranteed 
     but with significant limitations: corruption, pressure on the media, and elections that are not fully transparent. Finally, in the most 
     restrictive category, political rights and civil liberties are severely repressed, regimes are authoritarian, with an absence of free 
     elections and widespread censorship.
    </p>
  `);
  
  // --- Terzo Titolo Verticale ---
  titoloVerticale3 = createDiv('Classification');
  const xTitoloVerticale3 = margine + larghezzaRiquadro1 + spaziaturaTitoloVerticale;
  const yTitoloVerticale3 = yRiquadro3 + 5;
  titoloVerticale3.position(xTitoloVerticale3, yTitoloVerticale3);
  
  // Stile del terzo titolo verticale
  titoloVerticale3.style('width', larghezzaTitoloVerticale1 + 'px');
  titoloVerticale3.style('height', 'auto');
  titoloVerticale3.style('display', 'flex');
  titoloVerticale3.style('align-items', 'flex-start');
  titoloVerticale3.style('justify-content', 'center');
  titoloVerticale3.style('color', '#e5c38f');
  titoloVerticale3.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  titoloVerticale3.style('font-size', '50px');
  titoloVerticale3.style('writing-mode', 'vertical-rl');
  titoloVerticale3.style('text-orientation', 'mixed');
  titoloVerticale3.style('letter-spacing', '4px');
  titoloVerticale3.style('z-index', '1000');
  
  // --- Riquadro 4 ---
  riquadro4 = createDiv();
  const xRiquadro4 = margine + larghezzaRiquadro1 + spaziaturaTitoloVerticale + larghezzaTitoloVerticale1 + spaziaturaTitoloVerticale + spaziaturaRiquadri;
  riquadro4.position(xRiquadro4, yRiquadro3);
  
  // Stile del riquadro
  riquadro4.style('width', larghezzaRiquadro2 + 'px');
  riquadro4.style('height', 'auto');
  riquadro4.style('min-height', '50px');
  riquadro4.style('background-color', '#26231d');
  riquadro4.style('border', '2px solid #d58d3e');
  riquadro4.style('border-radius', '15px');
  riquadro4.style('padding', '20px');
  riquadro4.style('box-sizing', 'border-box');
  riquadro4.style('z-index', '1000');
  
  // Contenuto del riquadro
  riquadro4.html(`
    <div style="color: #eaead8; font-family: 'NeueHaasGrotDisp-55Roman', sans-serif; font-size: 17px; line-height: 1.6;">
      <p style="margin: 0 0 10px 0;"><strong style="font-family: 'NeueHaasGrotDisp-75Bold', sans-serif; font-size: 17px;">POLITICAL RIGHTS</strong></p>
      <p style="margin: 0 0 5px 0;">A. Electoral Process</strong></p>
      <p style="margin: 0 0 5px 0;">B. Political Pluralism & Participation</strong></p>
      <p style="margin: 0 0 5px 0;">C. Functioning of Government</strong></p>
      <p style="margin: 0 0 5px 0;">Additional Discretionary Political Rights Question</strong></p>
      <ul style="margin: 0 0 5px 0; padding-left: 20px;">
        <li>Is the government or occupying power deliberately changing the ethnic composition of a country or territory so as to destroy a culture or tip the political balance in favor of another group?</li>
      </ul>
      <p style="margin: 0 0 5px 0;"><strong style="font-family: 'NeueHaasGrotDisp-75Bold', sans-serif; font-size: 17px;">CIVIL LIBERTIES</strong></p>
      <p style="margin: 0 0 5px 0;">D. Freedom of Expression & Belief</strong></p>
      <p style="margin: 0 0 5px 0;">E. Associational & Organizational Rights</strong></p>
      <p style="margin: 0 0 5px 0;">F. Rule of Law</strong></p>
      <p style="margin: 0 0 5px 0;">G. Personal Autonomy & Individual Rights</strong></p>
    </div>
  `);
  const altezzaRiquadro3 = riquadro3.elt.offsetHeight;
riquadro4.style('height', altezzaRiquadro3 + 'px');
  
  // --- Quarto Titolo Verticale ---
  titoloVerticale4 = createDiv('Questions');
  const xTitoloVerticale4 = xRiquadro4 + larghezzaRiquadro2 + spaziaturaTitoloVerticale;
  const yTitoloVerticale4 = yRiquadro3 + 5;
  titoloVerticale4.position(xTitoloVerticale4, yTitoloVerticale4);
  
  // Stile del quarto titolo verticale
  titoloVerticale4.style('width', larghezzaTitoloVerticale2 + 'px');
  titoloVerticale4.style('height', 'auto');
  titoloVerticale4.style('display', 'flex');
  titoloVerticale4.style('align-items', 'flex-start');
  titoloVerticale4.style('justify-content', 'center');
  titoloVerticale4.style('color', '#d58d3e');
  titoloVerticale4.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  titoloVerticale4.style('font-size', '50px');
  titoloVerticale4.style('writing-mode', 'vertical-rl');
  titoloVerticale4.style('text-orientation', 'mixed');
  titoloVerticale4.style('letter-spacing', '4px');
  titoloVerticale4.style('z-index', '1000');
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
  bottoneFH.style('color', '#eaead8');
  bottoneFH.style('border', '1px solid #eaead8');
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
  bottoneUS.style('color', '#eaead8');
  bottoneUS.style('border', '1px solid #eaead8');
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
  
  // Ricrea i riquadri per ricalcolare le dimensioni
  if (riquadro1) riquadro1.remove();
  if (riquadro2) riquadro2.remove();
  if (riquadro3) riquadro3.remove();
  if (riquadro4) riquadro4.remove();
  if (titoloVerticale) titoloVerticale.remove();
  if (titoloVerticale2) titoloVerticale2.remove();
  if (titoloVerticale3) titoloVerticale3.remove();
  if (titoloVerticale4) titoloVerticale4.remove();
  creaRiquadri();
}