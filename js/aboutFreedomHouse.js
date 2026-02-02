// --- VARIABILI GLOBALI ---
let data;

// variabili per font
let fontRegular, fontMedium, fontBold, fontThin;

// variabili per bottoni
let iconaAboutUs, iconaAboutFh, iconaHome, iconaLente, iconaClose; // icone generali
let iconaArrLeft; // icone frecce

let titolo; 

let riquadro1, riquadro2, riquadro3, riquadro4;
let titoloRiquadro1, titoloRiquadro2, titoloRiquadro3, titoloRiquadro4;

let footer;

// --- PRELOAD ---
function preload() {
  data = loadTable("../assets/FH_dataset.csv", "csv", "header"); 
  torcia = loadImage("../img/torcia.png");

  // font
  fontRegular = loadFont("../font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("../font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("../font/NeueHaasDisplayBold.ttf");

  // icone
  iconaHome = loadImage("../img/icone/home.png");
  iconaAboutUs = loadImage("../img/icone/person.png");
  iconaArrLeft = loadImage("../img/icone/frecce/arrowleft.png");

  // reset margini browser
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
  document.documentElement.style.height = '100%';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.height = '100%';
  document.body.style.overflow = 'auto';
}

// --- SETUP ---
function setup() {
  createCanvas(windowWidth, windowHeight); 

  // bottoni
  const margine = 30;
  const diametro = 60;
  creaBottoneStandard(margine, margine, iconaArrLeft, () => window.history.back()); // back
  creaBottoneStandard(width - diametro - margine, margine, iconaHome, '../index.html'); // home
  creaBottoneStandard(width - (diametro * 2) - margine*3/2, margine, iconaAboutUs, '../html/aboutUs.html'); // about us

  creaTitolo();
  creaRiquadri();
  creaFooter();

  // ridimensiona canvas per coprire tutto il contenuto
  let altezzaTotale = footer.elt.offsetTop + footer.elt.offsetHeight;
  resizeCanvas(windowWidth, altezzaTotale);
}

function draw() {
  background(palette.nero);
}

// il titolo
function creaTitolo() {
  titolo = createElement('h1', 'Freedom House');
  titolo.position(110, 35);
  
  // Stile del titolo
  titolo.style('color', palette.bianco);
  titolo.style('font-family', 'NeueHaasDisplayMedium, sans-serif');
  titolo.style('font-size', '70px');
  titolo.style('margin', '0');
  titolo.style('padding', '0');
  titolo.style('line-height', '60px');
  titolo.style('z-index', '1000');
}

// funzione per creare i riquadri informativi

function creaRiquadri() {
  const margine = 25;
  const yInizio = 30 + 60 + 60;
  const spaziaturaRiquadri = 50;
  const altezzaTitoloRiquadro = 65; 
  const spaziaturaTitoloRiquadro = 8;
  const offsetTitolo = 30;

  // Calcola la larghezza totale disponibile
  const larghezzaTotale = width - (margine * 2);
  // Calcola la larghezza di ogni riquadro
  const larghezzaRiquadro = (larghezzaTotale - spaziaturaRiquadri) / 2;

  // --- Titolo Riquadro 1 ---
  titoloRiquadro1 = createDiv('About');
  titoloRiquadro1.position(margine + offsetTitolo, yInizio);
  titoloRiquadro1.style('color', '#c76351');
  titoloRiquadro1.style('font-family', 'NeueHaasDisplayBold, sans-serif');
  titoloRiquadro1.style('font-size', '60px');
  titoloRiquadro1.style('margin', '0');
  titoloRiquadro1.style('padding', '0');
  titoloRiquadro1.style('z-index', '1000');

  // --- Riquadro 1 ---
  riquadro1 = createDiv();
  riquadro1.position(margine, yInizio + altezzaTitoloRiquadro + spaziaturaTitoloRiquadro);
  
  // Stile del riquadro
  riquadro1.style('width', larghezzaRiquadro + 'px');
  riquadro1.style('height', 'auto');
  riquadro1.style('min-height', '60px');
  riquadro1.style('background-color', '#26231d');
  riquadro1.style('border', '1px solid #eaead8');
  riquadro1.style('border-radius', '30px');
  riquadro1.style('padding', '20px');
  riquadro1.style('box-sizing', 'border-box');
  riquadro1.style('z-index', '1000');
  
  // Contenuto del riquadro
  riquadro1.html(`
    <p style="color: #eaead8; font-family: 'NeueHaasDisplayThin', sans-serif; margin: 0; font-size: 16px; line-height: 1.6;">
      Freedom House was founded in <strong>1941</strong> by <strong>Wendell Willkie</strong> to counter the advancement of Nazi Germany and raise awareness about the 
      threat it posed. Today, Freedom House is an <strong>international non-governmental organization</strong> based in <strong>Washington D.C.</strong>, led by 
      <strong>Gerardo Berthin</strong> and <strong>Annie Wilcox Boyajian</strong>. The organization is supported, as evidenced by its financial reports, by funding 
      that comes <strong>90%</strong> from the <strong>federal government of the United States of America</strong>. Despite this, Freedom House's vision remains 
      independent and its commitment to <strong>objectivity</strong> stays constant. To date, FH is the leading American organization dedicated to 
      supporting and defending democracy worldwide. Through accurate data and analysis, it systematically monitors the most urgent 
      threats and promotes policies that strengthen democracy and protect human rights. It also <strong>actively collaborates with activists</strong> 
      who strengthen the credibility of its work and bring issues to prominent institutional spaces, such as the United Nations and 
      the United States Congress. When necessary, Freedom House works to <strong>protect these individuals</strong> if they are persecuted for their ideas.
    </p>
  `);

  // --- Titolo Riquadro 2 ---
  const xRiquadro2 = margine + larghezzaRiquadro + spaziaturaRiquadri;
  titoloRiquadro2 = createDiv('Method');
  titoloRiquadro2.position(xRiquadro2 + offsetTitolo, yInizio); 
  titoloRiquadro2.style('color', '#75a099');
  titoloRiquadro2.style('font-family', 'NeueHaasDisplayBold, sans-serif');
  titoloRiquadro2.style('font-size', '60px'); 
  titoloRiquadro2.style('margin', '0');
  titoloRiquadro2.style('padding', '0');
  titoloRiquadro2.style('z-index', '1000');
  
  // --- Riquadro 2 ---
  riquadro2 = createDiv();
  riquadro2.position(xRiquadro2, yInizio + altezzaTitoloRiquadro + spaziaturaTitoloRiquadro);
  
  // Stile del riquadro
  riquadro2.style('width', larghezzaRiquadro + 'px');
  riquadro2.style('height', 'auto');
  riquadro2.style('min-height', '50px');
  riquadro2.style('background-color', '#26231d');
  riquadro2.style('border', '1px solid #eaead8');
  riquadro2.style('border-radius', '30px');
  riquadro2.style('padding', '20px');
  riquadro2.style('box-sizing', 'border-box');
  riquadro2.style('z-index', '1000');
  
  // Contenuto del riquadro
  riquadro2.html(`
    <p style="color: #eaead8; font-family: 'NeueHaasDisplayThin', sans-serif; margin: 0; font-size: 19px; line-height: 1.8;">
      "Freedom in the World" is produced annually by a team of <strong>approximately 60 specialists</strong>: internal and 
      external analysts, academic consultants, and human rights experts. The method is based on assessments that answer <strong>twenty-five 
      questions</strong> for each country. FH analyzes <strong>two macro-aspects</strong>: <strong>political rights</strong>, which concern citizens' participation in the 
      political process and the ability to influence the government; and <strong>civil liberties</strong>, namely personal freedoms and individual 
      rights that protect against abuses of political, social, and religious power. Each aspect is divided into sub-parameters
      assessed through specific questions. <strong>Each question receives a score</strong> from 0 to 4 based on the conditions observed in the
      reference period. The sum determines the total score: a maximum of <strong>40 points for political rights</strong> and <strong>60 for civil liberties</strong>.
      Each score range corresponds to an indicator <strong>from 1 (very free) to 7 (not free)</strong>. The final index is the average of the indicators
      of the two macro-aspects, classifying countries as <strong>Free, Partly Free, and Not Free</strong>, categories that are vague since they can contain
      countries with very different scores from one another.
    </p>
  `);
  
  // --- Riquadro 3 (seconda riga) ---
  const spaziaturaVerticale = 40;
  const altezzaRiquadro1 = riquadro1.elt.offsetHeight;
  const yRiquadro3Base = yInizio + altezzaTitoloRiquadro + spaziaturaTitoloRiquadro + altezzaRiquadro1 + spaziaturaVerticale;
  
  // --- Titolo Riquadro 3 ---
  titoloRiquadro3 = createDiv('Classification');
  titoloRiquadro3.position(margine + offsetTitolo, yRiquadro3Base);
  titoloRiquadro3.style('color', '#e5c38f');
  titoloRiquadro3.style('font-family', 'NeueHaasDisplayBold, sans-serif');
  titoloRiquadro3.style('font-size', '60px');
  titoloRiquadro3.style('margin', '0');
  titoloRiquadro3.style('padding', '0');
  titoloRiquadro3.style('z-index', '1000');
  
  riquadro3 = createDiv();
  riquadro3.position(margine, yRiquadro3Base + altezzaTitoloRiquadro + spaziaturaTitoloRiquadro);
  
  // Stile del riquadro
  riquadro3.style('width', larghezzaRiquadro + 'px');
  riquadro3.style('height', 'auto');
  riquadro3.style('min-height', '50px');
  riquadro3.style('background-color', '#26231d');
  riquadro3.style('border', '1px solid #eaead8');
  riquadro3.style('border-radius', '30px');
  riquadro3.style('padding', '20px');
  riquadro3.style('box-sizing', 'border-box');
  riquadro3.style('z-index', '1000');
  
  // Contenuto del riquadro
  riquadro3.html(`
    <p style="color: #eaead8; font-family: 'NeueHaasDisplayThin', sans-serif; margin: 0; font-size: 19px; line-height: 1.8;">
      Freedom House does not specifically calculate <strong>how democratic a state is</strong>, but rather focuses on measuring the degree of freedom 
      in each country. Assessing the state of democracy in a country is complex, partly because citizens' opinions vary and even 
      experts' assessments can be <strong>subjective on certain aspects</strong>. Nevertheless, various analyses agree on the significant differences 
      among political institutions and on the distinction between <strong>more and less democratic countries</strong>.
      Countries are further classified as <strong>Free, Partly Free, and Not Free</strong>. In the first category, citizens enjoy <strong>full political rights and 
     civil liberties</strong>, elections are free, the press is independent, and the rule of law is upheld. In the second, freedoms are <strong>guaranteed 
     but with significant limitations</strong>: corruption, pressure on the media, and elections not fully transparent. In the most 
     restrictive category, political rights and civil liberties are <strong>severely repressed</strong>, regimes are authoritarian.
    </p>
  `);

  // --- Titolo Riquadro 4 ---
  titoloRiquadro4 = createDiv('Questions');
  titoloRiquadro4.position(xRiquadro2 + offsetTitolo, yRiquadro3Base);
  titoloRiquadro4.style('color', '#d58d3e');
  titoloRiquadro4.style('font-family', 'NeueHaasDisplayBold, sans-serif');
  titoloRiquadro4.style('font-size', '60px');
  titoloRiquadro4.style('margin', '0');
  titoloRiquadro4.style('padding', '0');
  titoloRiquadro4.style('z-index', '1000');
  
  // --- Riquadro 4 ---
  riquadro4 = createDiv();
  riquadro4.position(xRiquadro2, yRiquadro3Base + altezzaTitoloRiquadro + spaziaturaTitoloRiquadro);
  
  // Stile del riquadro
  riquadro4.style('width', larghezzaRiquadro + 'px');
  riquadro4.style('height', 'auto');
  riquadro4.style('min-height', '50px');
  riquadro4.style('background-color', '#26231d');
  riquadro4.style('border', '1px solid #eaead8');
  riquadro4.style('border-radius', '30px');
  riquadro4.style('padding', '20px');
  riquadro4.style('box-sizing', 'border-box');
  riquadro4.style('z-index', '1000');
  
  // Contenuto del riquadro
  riquadro4.html(`
    <div style="color: #eaead8; font-family: 'NeueHaasDisplayThin', sans-serif; font-size: 18px; line-height: 1.8;">
      <p style="margin: 0 0 10px 0;"><strong style="font-family: 'NeueHaasDisplayBold', sans-serif; font-size: 17px;">POLITICAL RIGHTS</strong></p>
      <p style="margin: 0 0 5px 0;">A. Electoral Process</p>
      <p style="margin: 0 0 5px 0;">B. Political Pluralism & Participation</p>
      <p style="margin: 0 0 5px 0;">C. Functioning of Government</p>
      <p style="margin: 0 0 5px 0;">Additional Discretionary Political Rights Question</p>
      <ul style="margin: 0 0 5px 0; padding-left: 20px;">
        <li>Is the government or occupying power deliberately changing the ethnic composition of a country or territory so as to destroy a culture or tip the political balance in favor of another group?</li>
      </ul>
      <p style="margin: 0 0 5px 0;"><strong style="font-family: 'NeueHaasDisplayRoman', sans-serif; font-size: 17px;">CIVIL LIBERTIES</strong></p>
      <p style="margin: 0 0 5px 0;">D. Freedom of Expression & Belief</p>
      <p style="margin: 0 0 5px 0;">E. Associational & Organizational Rights</p>
      <p style="margin: 0 0 5px 0;">F. Rule of Law</p>
      <p style="margin: 0 0 5px 0;">G. Personal Autonomy & Individual Rights</p>
    </div>
  `);
}

function creaFooter() {
  footer = createDiv();
  
  // Calcola la posizione Y del footer in base all'altezza dei riquadri
  const margine = 25;
  const spaziaturaVerticale = 40;
  
  // Ottieni l'altezza effettiva del riquadro più basso (riquadro3 o riquadro4)
  const altezzaRiquadro3 = riquadro3.elt.offsetHeight;
  const altezzaRiquadro4 = riquadro4.elt.offsetHeight;
  const altezzaMassima = max(altezzaRiquadro3, altezzaRiquadro4);
  
  // Calcola la posizione Y del footer partendo dalla posizione dei riquadri 3/4
  const yInizio = 30 + 60 + 60;
  const altezzaTitoloRiquadro = 65;
  const spaziaturaTitoloRiquadro = 8;
  const altezzaRiquadro1 = riquadro1.elt.offsetHeight;
  const yRiquadro3Base = yInizio + altezzaTitoloRiquadro + spaziaturaTitoloRiquadro + altezzaRiquadro1 + spaziaturaVerticale;
  
  const footerY = yRiquadro3Base + altezzaTitoloRiquadro + spaziaturaTitoloRiquadro + altezzaMassima + 60;
  
  footer.position(0, footerY);
  
  footer.style('width', '100%');
  footer.style('padding', '50px 110px');
  footer.style('box-sizing', 'border-box');
  footer.style('background-color', '#1b1914ff');
  footer.style('color', '#eaead8');
  footer.style('font-family', 'NeueHaasDisplayRoman, sans-serif');
  footer.style('font-size', '14px');
  footer.style('line-height', '22px');
  footer.style('z-index', '1000');
  footer.style('position', 'absolute');
  footer.style('border-top', '0px solid #eaead8');
  
  footer.html(`
    <div style="display: flex; justify-content: space-between; gap: 80px; max-width: 1400px;">
  
  <!-- COLONNA SINISTRA -->
  <div style="flex: 1;">
    <p style="margin: 0 0 5px 0; font-family: 'NeueHaasDisplayBold', sans-serif; font-size: 16px;">
      Computer Graphics Studio for Information Design
    </p>
    <p style="margin: 0 0 3px 0;">A.Y. 2025/2026</p>
    <p style="margin: 0 0 25px 0;"><strong>Bachelor's Degree in Communication Design</strong></p>
    
    <p style="margin: 0 0 8px 0; font-family: 'NeueHaasDisplayBold', sans-serif; font-size: 15px;">Project by</p>
    <div style="display: flex; gap: 40px;">
      <div style="flex: 1;">
        <p style="margin: 0 0 3px 0;">Federica Besenzoni</p>
        <p style="margin: 0 0 3px 0;">Vittoria Franchi</p>
        <p style="margin: 0;">Asia Marozzi</p>
      </div>
      <div style="flex: 1;">
        <p style="margin: 0 0 3px 0;">Aurora Preioni</p>
        <p style="margin: 0 0 3px 0;">Jasmin Soraruf</p>
        <p style="margin: 0;">Sheetal Zanotto</p>
      </div>
    </div>
    
    <p style="margin: 25px 0 8px 0; font-family: 'NeueHaasDisplayBold', sans-serif; font-size: 15px;">Contact</p>
    <div style="display: flex; gap: 30px;">
      <div style="flex: 1;">
        <p style="margin: 0 0 3px 0; font-size: 15px;">federica.besenzoni@mail.polimi.it</p>
        <p style="margin: 0 0 3px 0; font-size: 15px;">vittoria.franchi@mail.polimi.it</p>
        <p style="margin: 0; font-size: 15px;">asia.marozzi@mail.polimi.it</p>
      </div>
      <div style="flex: 1;">
        <p style="margin: 0 0 3px 0; font-size: 15px;">aurora.preioni@mail.polimi.it</p>
        <p style="margin: 0 0 3px 0; font-size: 15px;">jasmin.soraruf@mail.polimi.it</p>
        <p style="margin: 0; font-size: 15px;">sheetal.zanotto@mail.polimi.it</p>
      </div>
    </div>
  </div>
  
  <!-- COLONNA DESTRA -->
  <div style="flex: 1; display: flex; flex-direction: column;">
    <p style="margin: 0 0 10px 0; font-family: 'NeueHaasDisplayBold', sans-serif; font-size: 15px;">
      © [CC-BY 4.0] The authors
    </p>
    <p style="margin: 0 0 20px 0; line-height: 20px;">
      Except where otherwise noted, all content on this website is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
      You are free to share and adapt the material, including for commercial use, provided appropriate credit is given.
    </p>
    
     <div style="display: flex; gap: 40px; margin-top: 25px;">
    
    <div style="flex: 1;">
      <p style="margin: 0 0 8px 0; font-family: 'NeueHaasDisplayBold', sans-serif; font-size: 15px;">
        Faculty
      </p>
      <p style="margin: 0 0 3px 0;">Michele Mauri</p>
      <p style="margin: 0;">Davide Conficconi</p>
    </div>

    <div style="flex: 1;">
      <p style="margin: 0 0 8px 0; font-family: 'NeueHaasDisplayBold', sans-serif; font-size: 15px;">
        Teaching Assistants
      </p>
      <p style="margin: 0 0 3px 0;">Alessandra Facchin</p>
      <p style="margin: 0;">Alessandro Nazzari</p>
    </div>

  </div>

   <div style="display: flex; gap: 80px; align-items: flex-end; margin-top: auto;">
      <img src="../img/loghi/LogoDensityDesign.png" style="height: 90px; object-fit: contain;">
      <img src="../img/loghi/LogoNECST.png" style="height: 90px; object-fit: contain;">
      <img src="../img/loghi/LogoPolimi.png" style="height: 90px; object-fit: contain;">
    </div>
</div>
  `);
}

function windowResized() {
  let altezzaNecessaria = max(windowHeight, 1200);
  resizeCanvas(windowWidth, altezzaNecessaria);
  
  // Riposiziona gli elementi quando la finestra viene ridimensionata
  const diametroBottone = 60;
  const spaziaturaTraBottoni = 20;
  let xGr = width - diametroBottone - 25;
  let xUS = xGr - diametroBottone - spaziaturaTraBottoni;
  let xBack = 25;
  
  bottoneGr.position(xGr, 30);
  bottoneUS.position(xUS, 30);
  bottoneBack.position(xBack, 30);
  
  titolo.position(110, 35);
  
  // Ricrea i riquadri per ricalcolare le dimensioni
  if (riquadro1) riquadro1.remove();
  if (riquadro2) riquadro2.remove();
  if (riquadro3) riquadro3.remove();
  if (riquadro4) riquadro4.remove();
  if (titoloRiquadro1) titoloRiquadro1.remove();
  if (titoloRiquadro2) titoloRiquadro2.remove();
  if (titoloRiquadro3) titoloRiquadro3.remove();
  if (titoloRiquadro4) titoloRiquadro4.remove();
  if (footer) footer.remove();
  
  creaRiquadri();
  creaFooter();
}
