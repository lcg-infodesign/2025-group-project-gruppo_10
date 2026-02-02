// variabili globali
let data;

// variabili per font
let fontRegular, fontMedium, fontBold;

// variabili per bottoni
let iconaAboutUs, iconaAboutFh, iconaHome, iconaLente, iconaClose; // icone generali
let iconaArrLeft; // icone frecce

let titolo;
let testoIntro;
let testiRettangoli = [];
let ritratti = [];

let offsetY = [];
let offsetXimg = [];

let hoverIndex = -1;
let scaleAmount = [];

let footer;

function preload() {
  data = loadTable("../assets/FH_dataset.csv", "csv", "header"); // caricamento del dataset (con header)
  // font
  fontRegular = loadFont("../font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("../font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("../font/NeueHaasDisplayBold.ttf");
  // icone
  iconaHome = loadImage("../img/icone/home.png");
  iconaAboutFh = loadImage("../img/icone/info.png");
  iconaArrLeft = loadImage("../img/icone/frecce/arrowleft.png");
  // ritratti
  ritratti.push(loadImage("../img/ritratti/Besenzoni.png")); // Besenzoni
  ritratti.push(loadImage("../img/ritratti/Franchi.png")); // Franchi
  ritratti.push(loadImage("../img/ritratti/Marozzi.png")); // Marozzi
  ritratti.push(loadImage("../img/ritratti/Preioni.png")); // Preioni
  ritratti.push(loadImage("../img/ritratti/Soraruf.png")); // Soraruf
  ritratti.push(loadImage("../img/ritratti/Zanotto.png")); // Zanotto

  // Offset verticale (Y)
  offsetY.push(-20);
  offsetY.push(-40);
  offsetY.push(-25);
  offsetY.push(-30);
  offsetY.push(0);
  offsetY.push(-30);
  // Offset orizzontale (X)
  offsetXimg.push(10);
  offsetXimg.push(-5);
  offsetXimg.push(30);
  offsetXimg.push(20);
  offsetXimg.push(20);
  offsetXimg.push(-25);
}

function setup() {
  let margine = 30;
  let d = 60;

  const margineTop = 320;
  const margineBottom = 400;
  const spaziaturaV = 240;
  const altezzaRett = 280;
  const numRighe = 2;
  
  const altezzaTotale = margineTop + (altezzaRett * numRighe) + (spaziaturaV * (numRighe - 1)) + margineBottom + 100;

    createCanvas(windowWidth, max(windowHeight, altezzaTotale));

  // Inizializza array scale
  for (let i = 0; i < 6; i++) {
    scaleAmount[i] = 1;

  creaTitolo();
  creaTestoIntroduttivo();
  creaTestiRettangoli();
  creaFooter();

  // bottoni
  creaBottoneStandard(margine, margine, iconaArrLeft, () => window.history.back()); // bottone per tornare indietro
  creaBottoneStandard(width - diametro - margine, margine, iconaAboutFh, '../html/aboutFreedomHouse.html'); // bottone Freedom House in alto a destra
  creaBottoneStandard(width - (diametro * 2) - margine*3/2, margine, iconaHome, '../index.html'); // bottone About Us a sinistra del primo
}
}

function draw() {
  background(palette.nero);
disegnaRettangoli();
  cursor(ARROW); // Reset cursore
}

// --- DISEGNA RETTANGOLI ---
function disegnaRettangoli() {
  const numColonne = 3;
  const numRighe = 2;
  const raggio = 20;
  
  const margineTop = 320;
  const spaziaturaH = 230;
  const spaziaturaV = 230;
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

      // Verifica hover
      let isHover = mouseX > x && mouseX < x + larghezzaRett && 
                    mouseY > y && mouseY < y + altezzaRett;
      
      if (isHover) {
        hoverIndex = indice;
        scaleAmount[indice] = lerp(scaleAmount[indice], 1.02, 0.2);
        cursor(HAND);
      } else {
        scaleAmount[indice] = lerp(scaleAmount[indice], 1, 0.2);
      }

      push();
      translate(x + larghezzaRett/2, y + altezzaRett/2);
      scale(scaleAmount[indice]);
      translate(-(x + larghezzaRett/2), -(y + altezzaRett/2));

      // Rettangolo sotto
      fill('#3d3a34');
      rect(x, y, larghezzaRett, altezzaRett, raggio);

      // Immagine ritratto
      if (ritratti[indice]) {
        beginClip();
        rect(x - 1000, y - 1000, larghezzaRett + 2000, altezzaRett + 1000, raggio);
        endClip();

        let img = ritratti[indice];
        let zoomFactor = 1.6;

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
      }
      
      pop();

      // descrizione sotto rettangolo
      if (testiRettangoli[indice]) {
        let testoX = x + 10;
        let testoY = y + altezzaRett + 20;
        
        testiRettangoli[indice].position(testoX, testoY);
        
        // Applica scale anche al testo
        let scaleValue = scaleAmount[indice];
        testiRettangoli[indice].style('transform', `scale(${scaleValue})`);
        testiRettangoli[indice].style('transform-origin', 'top left');
        testiRettangoli[indice].style('transition', 'transform 0.09s ease-out'); 
      }
    }
  }
}

// --- RIDIMENSIONAMENTO ---
function windowResized() {
  const margineTop = 320;
  const margineBottom = 400;
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
  titolo.style('color', '#eaead8');
  titolo.style('font-family', 'NeueHaasDisplay, sans-serif');
  titolo.style('font-weight', "500");
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
  testoIntro.position(110, 120);
  testoIntro.style('color', '#eaead8');
  testoIntro.style('font-family', 'NeueHaasDisplay, sans-serif');
  testoIntro.style('font-weight', "400");
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
    '<span style="font-size: 19px;"><strong>Federica Besenzoni</strong></span><br><span style="font-size: 16px; font-family: NeueHaasDisplayRoman">Pagina di dettaglio sulla variazione di libertà per i singoli Paesi</span>',
    '<span style="font-size: 19px;"><strong>Vittoria Franchi</strong></span><br><span style="font-size: 16px; font-family: NeueHaasDisplayRoman">Stesura testi e pagine extra</span>',
    '<span style="font-size: 19px;"><strong>Asia Marozzi</strong></span><br><span style="font-size: 16px; font-family: NeueHaasDisplayRoman">Visualizzazione generale e del dettaglio delle regioni</span>',
    '<span style="font-size: 19px;"><strong>Aurora Preioni</strong></span><br><span style="font-size: 16px; font-family: NeueHaasDisplayRoman">Pagina di dettaglio dei singoli Paesi</span>',
    '<span style="font-size: 19px;"><strong>Jasmin Soraruf</strong></span><br><span style="font-size: 16px; font-family: NeueHaasDisplayRoman">Illustrazioni e analisi del dataset</span>',
    '<span style="font-size: 19px;"><strong>Sheetal Zanotto</strong></span><br><span style="font-size: 16px; font-family: NeueHaasDisplayRoman">Pagina di introduzione al progetto</span>'
  ];

  for (let i = 0; i < testiContent.length; i++) {
    let testo = createP(testiContent[i]);
    testo.style('color', palette.bianco);
    testo.style('font-family', 'NeueHaasDisplayMedium, sans-serif');
    testo.style('font-size', '17px');
    testo.style('margin', '0');
    testo.style('padding', '0');
    testo.style('line-height', '22px');
    testo.style('max-width', '245px');
    testo.style('z-index', '1000');
    testo.style('position', 'absolute');
    testiRettangoli.push(testo);
  }
}

// --- FOOTER ---

function creaFooter() {
  footer = createDiv();
  
  const footerY = height - 300;
  footer.position(0, footerY);
  
  footer.style('width', '100%');
  footer.style('padding', '50px 110px');
  footer.style('box-sizing', 'border-box');
  footer.style('background-color', '#1b1914ff');
  footer.style('color', palette.bianco);
  footer.style('font-family', 'NeueHaasDisplayRoman, sans-serif');
  footer.style('font-size', '14px');
  footer.style('line-height', '22px');
  footer.style('z-index', '1000');
  footer.style('position', 'absolute');
  footer.style('border-top', '0px solid'+ palette.bianco);
  
  footer.html(`
    <div style="display: flex; justify-content: space-between; gap: 80px; max-width: 1400px;">
  
  <!-- COLONNA SINISTRA -->
  <div style="flex: 1;">
    <p style="margin: 0 0 5px 0; font-family: 'NeueHaasDisplayMedium', sans-serif; font-size: 16px;">
      Computer Graphics Studio for Information Design
    </p>
    <p style="margin: 0 0 3px 0;">A.Y. 2025/2026</p>
    <p style="margin: 0 0 25px 0;"><strong>Bachelor's Degree in Communication Design</strong></p>
    
    <p style="margin: 0 0 8px 0; font-family: 'NeueHaasDisplayMedium', sans-serif; font-size: 15px;">Project by</p>
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
    
    <p style="margin: 25px 0 8px 0; font-family: 'NeueHaasDisplayMedium', sans-serif; font-size: 15px;">Contact</p>
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
    <p style="margin: 0 0 10px 0; font-family: 'NeueHaasDisplayMedium', sans-serif; font-size: 15px;">
      © [CC-BY 4.0] The authors
    </p>
    <p style="margin: 0 0 20px 0; line-height: 20px;">
      Except where otherwise noted, all content on this website is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
      You are free to share and adapt the material, including for commercial use, provided appropriate credit is given.
    </p>
    
     <div style="display: flex; gap: 40px; margin-top: 25px;">
    
    <div style="flex: 1;">
      <p style="margin: 0 0 8px 0; font-family: 'NeueHaasDisplayMedium', sans-serif; font-size: 15px;">
        Faculty
      </p>
      <p style="margin: 0 0 3px 0;">Michele Mauri</p>
      <p style="margin: 0;">Davide Conficconi</p>
    </div>

    <div style="flex: 1;">
      <p style="margin: 0 0 8px 0; font-family: 'NeueHaasDisplayMedium', sans-serif; font-size: 15px;">
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

function riposizionaElementiDOM() {
  titolo.position(110, 35);
  testoIntro.position(110, 100);
  
  if (footer) {
    const footerY = height - 380;
    footer.position(0, footerY);
  }
}

function riposizionaElementiDOM() {
  titolo.position(110, 35);
  testoIntro.position(110, 100);
  
  if (footer) {
    const footerY = height - 350;
    footer.position(0, footerY);
  }
}