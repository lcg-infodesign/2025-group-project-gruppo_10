let data;
let countryTitle = "";
let rawCountryName;
let countryName;
let countryData = [];
let params = ["ElectoralProcess", "PoliticalPluralism", "FunctioningofGovernement", "FreedomofExpression","AssociationRights","RuleofLaw","IndividualRights", "AddA"];
let padding = 100; //distanza del grafico dal lato della pagina
let bottomPadding = 100;
let topPadding = 100;
let textPadding = 70;

let dotSize;
let dotSpacing;
let totalHeight = (dotSize + dotSpacing)*50;



let viewMode = "overview"; 
let toggleBox = {};



let currentHoveredIndex = -1; // indice della colonna attualmente sotto il mouse
 
let backHomeArea = null;   // bottone "back" in alto (pagina principale)


// bottone per tornare indietro -> veccchio non utilizzato 
let goBackButton;
let goBackBox = {};
let goBackTextX = 20;
let goBackTextY = 20;
let goBackTextSize = 15;

let sfondo;
let textColor;
let lineColor;
let greyBase;
let colorElectoralProcess;
let colorPoliticalPluralism;
let colorFunctioningGovernement;
let colorFreedomExpression;
let colorAssociationalRights;
let colorRuleLaw;
let colorPersonalAutonomy;
let colorAddA;
let coloriStatus = {
  'F': ["#c76351", "#d58d3e", "#26231d"],    // Libero
  'PF': ["#e5c38f", "#cad181", "#26231d"],   // Parzialmente Libero
  'NF': ["#75a099", "#91a2a6", "#26231d"],   // Non Libero
};




function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  mioFont = loadFont("fonts/NeueHaasGrotDisp-55Roman.otf");
  mioFontMedium = loadFont("fonts/NeueHaasDisplayRoman.ttf");
  mioFontBold = loadFont("fonts/NeueHaasDisplayBold.ttf");
}

//NORMALIZZARE I NOMI così legge tutto 
function normalizeCountryName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ""); // tiene solo lettere e numeri
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  creaBottoneBack();

  sfondo = color(38,35,29);
  textColor = color(234,234,216);
  greyBase = color(53, 51, 48);
  lineColor = color(136,135,124);
  colorElectoralProcess = color(202, 209, 129);
  colorPoliticalPluralism = color(144, 161, 165);
  colorFunctioningGovernement = color(21, 95, 128);
  colorFreedomExpression = color(213, 141, 62);
  colorAssociationalRights = color(161, 124, 182);
  colorRuleLaw = color(209, 191, 220);
  colorPersonalAutonomy = color(199, 99, 81);
  colorAddA = color('#1f863fff')
  

  fill(textColor);
  textSize(14);
  textFont(mioFont);

  // prendi il paese dal URL
  let urlParams = getURLParams();
  countryName = urlParams.country;

  if (!countryName) {
    fill(textColor);
    console.error("Nessun paese selezionato nella query string");
    noLoop();
    return;
  }

  // normalizzo il nome che arriva dall’URL
  rawCountryName = countryName
  let countryKey = normalizeCountryName(rawCountryName);
  countryName = rawCountryName; // lo tengo per scriverlo grande nel titolo
  

  // filtra tutti i dati per il paese selezionato
  for (let i = 0; i < data.getRowCount(); i++) {
  let countryCSV = data.getString(i, "Country/Territory").trim();
  let csvKey = normalizeCountryName(countryCSV);

  if (csvKey === countryKey) {

    // salva il nome *esatto* del CSV una sola volta
    if (countryTitle === "") {
        countryTitle = countryCSV;
    }

    countryData.push({
      year: data.getString(i, "Edition").trim(),
      ElectoralProcess: parseFloat(data.getString(i, "Total A")) || 0,
      PoliticalPluralism: parseFloat(data.getString(i, "Total B")) || 0,
      FunctioningofGovernement: parseFloat(data.getString(i, "Total C")) || 0,
      FreedomofExpression: parseFloat(data.getString(i, "Total D")) || 0,
      AssociationRights: parseFloat(data.getString(i, "Total E")) || 0,
      RuleofLaw: parseFloat(data.getString(i, "Total F")) || 0,
      IndividualRights: parseFloat(data.getString(i, "Total G")) || 0,
      AddQ: parseFloat(data.getString(i, "Add Q")) || 0,
      AddA: parseFloat(data.getString(i, "Add A")) || 0,
      Total: parseFloat(data.getString(i, "TOTAL ")) || 0,
      Status: data.getString(i, "Status").trim(),
      
    });
  }

  

}

// Ordina per anno crescente
countryData.sort((a, b) => parseInt(a.year) - parseInt(b.year));

}

function draw() {
  background(sfondo);

  textSize(15)
  fill(textColor);
  if (!countryData || countryData.length === 0) {
    
    textAlign(CENTER);
    
    text("Nessun dato disponibile per questo paese", width / 2, height / 2);
    return;
  }
 
  


 if (viewMode === "parameters") {
  if (totaleNegativo()) {
    // usa il nuovo grafico con pallini sotto lo zero
    drawDotChartNegatives(countryData, params, padding);
    
  } else {
    // usa il grafico normale
    drawDotChart(countryData, params, padding);
  }

  drawLegend();

  } else {
    if(totaleNegativo())
      {
      drawOverviewChartNegative(countryData);

      } else {
      drawOverviewChart(countryData);
      }
    drawCountryText(countryName, windowWidth - padding - 300 , 120, 300); // ultimo parametro larghezza box testo 
  }
  drawToggle();

  fill(textColor);
  textSize(goBackTextSize);
  textFont(mioFontBold);
  //drawGoBackButton();
  
  drawTitle();
  


}

// controlla se il total score è negativo 
function totaleNegativo() {
  for (let d of countryData) {
    if (d.Total < 0) return true;
  }
  return false;


}


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




function drawDotChart(data, params, padding) {

  // layout di riferimento -> tutto scalato in base a queste proporzioni 
  let baseDotSize = 12;
  let baseDotSpacing = 0;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize + baseDotSpacing) * baseRows;
  let baseColumnWidth = 2 * (baseDotSize + baseDotSpacing) + 40;

  let yBase = height - bottomPadding;

  // spazio disponibile
  let availableHeight = height - bottomPadding - topPadding;
  let availableWidth  = width - 2 * padding;

  // scala
  let nYears = max(data.length, 1); // sicurezza
  let scaleY = availableHeight / baseTotalHeight;
  let scaleX = availableWidth / (baseColumnWidth * nYears);

  // fattore di scala uniforme (mantiene le proporzioni originali)
  let scale = min(scaleX, scaleY);

  // applico la scala al layout originale
  dotSize = baseDotSize * scale;
  dotSpacing = baseDotSpacing * scale;   // è 0, ma lo teniamo lo stesso 
  totalHeight = baseTotalHeight * scale;

  let columnSpacing = baseColumnWidth * scale;
  let xStart = padding;

  let colors = [
    colorElectoralProcess,
    colorPoliticalPluralism,
    colorFunctioningGovernement,
    colorFreedomExpression,
    colorAssociationalRights,
    colorRuleLaw,
    colorPersonalAutonomy,
    colorAddA
  ];

  

  // tacche asse y
  for (let t = 0; t <= 100; t += 10) {
    let ty = map(t, 0, 100, 0, totalHeight);
    fill(textColor);
    noStroke();
    textFont(mioFont);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text(t, textPadding, yBase - ty);
    stroke(180);
  }

  // colonna per ogni anno (i)
  for (let i = 0; i < data.length; i++) {

    let d = data[i];


    // leggo parametri e coloro i pallini
    let dots = [];
    for (let p = 0; p < params.length; p++) {
      let count = round(d[params[p]]);
      for (let k = 0; k < count; k++) {
        dots.push(colors[p]);
        if (dots.length >= 100) break;
      }
      if (dots.length >= 100) break;
    }

    // numero pallini colorati 
    let coloredCount = dots.length;

    // i rimanenti li coloro di grigio
    while (dots.length < 100) {
      dots.push(greyBase);
    }

    // Usa AddQ (valore positivo) per spegnere dei pallini già colorati
    let addq = d.AddQ;  // già numero dal setup

    if (addq > 0) {
      let toRemove = Math.min(Math.round(addq), coloredCount);
      let removed = 0;

      // parto dalla fine e spengo i dot colorati
      for (let idx = dots.length - 1; idx >= 0 && removed < toRemove; idx--) {
        let c = dots[idx];

        if (
          red(c) !== red(greyBase) ||
          green(c) !== green(greyBase) ||
          blue(c) !== blue(greyBase)
        ) {
          dots[idx] = greyBase;
          removed++;
        }
      }
    }

    // 100 pallini in serpentina 
    for (let dIdx = 0; dIdx < 100; dIdx++) {
      let row = floor(dIdx / 2);          // riga 0..49
      let col = dIdx % 2;                 // colonna base 0 o 1

      // Se la riga è dispari, inverti le colonne (serpentina)
      if (row % 2 == 1) {
        col = 1 - col;
      }

      let x = xStart + col * (dotSize + dotSpacing);
      let y = yBase - row * (dotSize + dotSpacing);

      let c = dots[dIdx];


      fill(c);
      noStroke();
      circle(x, y, dotSize);
    }
    
    // centro della doppia colonna per l’anno corrente
    let colCenter = xStart + (dotSize + dotSpacing) * 0.5;

    // asse x Anno (in grassetto se hoverato)
    push();
    textAlign(CENTER, CENTER);
    textSize(20);                
    


    translate(colCenter, yBase + 40);
    rotate(-90);
    fill(textColor);
    text(d.year, 0, 0);
    pop();

    // Spazio tra una colonna di pallini e la successiva (scalato)
    xStart += columnSpacing;
  }
}






function drawOverviewChart() {
  // layout base 
  let baseBarW = 12;
  let baseDotSize = 12;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize) * baseRows;
  let baseSpacing = 64;

  let yBase = height - bottomPadding;

  let availableHeight = height - bottomPadding - topPadding;
  let availableWidth  = width - 2 * padding;

  let nYears = max(countryData.length, 1);
  let scaleY = availableHeight / baseTotalHeight;
  let scaleX = availableWidth / (baseSpacing * nYears);

  let scale = min(scaleX, scaleY);

  totalHeight = baseTotalHeight * scale;
  let barW = baseBarW * scale;
  let spacing = baseSpacing * scale;
  dotSize = baseDotSize * scale;
  

  let xStart = padding;

  // tacche asse y
  for (let t = 0; t <= 100; t += 10) {
    let ty = map(t, 0, 100, 0, totalHeight);
    fill(textColor);
    noStroke();
    textFont(mioFont);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text(t, textPadding, yBase - ty);
    stroke(180);
  }

  for (let d of countryData) {

    let total = d.Total;
    let h = map(total, 0, 100, 0, totalHeight);

    let status = d.Status;
    let colori = coloriStatus[status] || ["#888", "#888", "#888"];

    drawingContext.fillStyle = creaGradiente(
      xStart,
      yBase - h,
      yBase,
      barW,
      colori
    );

    noStroke();
    rect(xStart, yBase - h, barW, h);

    // pallino in cima
    fill(240);
    noStroke();
    circle(xStart + barW/2, yBase - h + dotSize/2, barW*1.8);

    // etichetta anno ruotata
    push();
    translate(xStart + barW/2, yBase + 40);
    rotate(-90);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(mioFont);
    fill(200);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }
}


function drawLegend(){

  let xText = windowWidth - padding - 280;//come larghezza paragrafo testo
  let yText = windowHeight - bottomPadding - 360; 
  let dimC = 15
  let c = 40
  let h = 25 // distanza testi
  let b = 5


  let rectX = xText - 40; // come padding rettangolo testo
  let rectY = yText - 40;
  let rectW = 340;
  let rectH = 340;


  textAlign(LEFT)

  fill(textColor);
  textFont(mioFont);
  textSize(15);
  text("Electoral Process", xText, yText + h );
  
  text("Political Pluralism and Participation", xText, yText + 2*h );
  
  text("Functioning of Government", xText, yText+ 3*h);

  text("Add A", xText, yText + 4*h)
  
  text("Freedom of Expression and Belief", xText, yText +6*h + c);
  
  text("Associational and Organizational Rights", xText, yText+ 7*h + c);
  
  text("Rule of Law", xText, yText+ 8*h +c );
  
  text("Personal Autonomy and Individual Rights", xText, yText+9*h + c);
  


  textFont(mioFontBold);
  textSize(20)
  text("Political Rights", xText -20, yText -10);
  text("Civil Liberties", xText -20, yText+ 5*h +c -10 );


  noStroke();
  fill(colorElectoralProcess);
  ellipse(xText- dimC, yText + h + b - 5 , dimC);

  fill(colorPoliticalPluralism);
  ellipse(xText-dimC, yText + 2*h + b- 5, dimC);

  fill(colorFunctioningGovernement);
  ellipse(xText-dimC, yText + 3*h + b - 5, dimC);

  fill(colorAddA);
  ellipse(xText-dimC, yText + 4*h + b - 5, dimC);

  fill(colorFreedomExpression);
  ellipse(xText-dimC, yText + 6*h + b + c -5, dimC);

  fill(colorAssociationalRights);
  ellipse(xText-dimC, yText + 7*h + b + c -5, dimC);

  fill(colorRuleLaw);
  ellipse(xText-dimC, yText + 8*h + b + c -5, dimC);

  fill(colorPersonalAutonomy);
  ellipse(xText-dimC, yText + 9*h + b + c - 5, dimC);


  noFill();
  stroke(textColor);
  strokeWeight(2);
  rect(rectX,rectY,rectW,rectH,20);



}

function drawTitle(){

  fill(textColor);
  textSize(70);
  text(countryTitle, textPadding + 50, 45);
}



function creaGradienteToggle(x, y, w, h) {
  let g = drawingContext.createLinearGradient(x, y, x + w, y + h);

  // puoi cambiare i colori qui 
  g.addColorStop(0, "#c76351");  
  g.addColorStop(1, "#d58d3e");

  return g;
}


function drawToggle() {
  let x = windowWidth - padding - 200;
  let y = windowHeight - bottomPadding;
  let w = 70;
  let h = 40;

  // background del toggle
  fill(60);
  noStroke();
  rect(x, y, w, h, 30);

  // testi con evidenziazione
  textSize(15);
  textAlign(LEFT, CENTER);
  textFont(mioFont)

  if (viewMode === "parameters") {
    fill(255); // evidenziato
    text("Parameters", x - 100, y + h / 2);
    fill(150); // sbiadito
    text("Total Overview", x + 100, y + h / 2);
  } else {
    fill(150);
    text("Parameters", x - 100, y + h / 2);
    fill(255);
    text("Total Overview", x + 100, y + h / 2);
  }

  // cerchietto
  fill(255);
  let cx = (viewMode === "parameters") ? x + 15 : x + w - 15;
  circle(cx, y + h / 2, h - 3 );

  toggleBox = { x, y, w, h };
}

// NUOVA FUNZIONE per creare il bottone "Torna Indietro"
function creaBottoneBack() {
  const diametroBottone = 60; // Stesso diametro dei bottoni US e FH
  const xPos = 30; // Allineato a sinistra
  const yPos = 15; 
  const borderColor = '#EAEAD8';
  const sfondoCss = '#26231d';
  
  bottoneBack = createButton('←');
  bottoneBack.position(xPos, yPos);
  
  // Stile del bottone circolare (come US e FH)
  bottoneBack.style('width', diametroBottone + 'px');
  bottoneBack.style('height', diametroBottone + 'px');
  bottoneBack.style('border-radius', '50%'); // Rende il bottone circolare
  bottoneBack.style('background-color', sfondoCss);
  bottoneBack.style('color', borderColor);
  bottoneBack.style('border', '2px solid ' + borderColor);
  bottoneBack.style('text-align', 'center');
  bottoneBack.style('line-height', diametroBottone + 'px'); // Centra la freccia verticalmente
  bottoneBack.style('font-size', '24px'); // Dimensione della freccia
  bottoneBack.style('font-family', 'NeueHaasGrotDisp-75Bold, sans-serif');
  bottoneBack.style('cursor', 'pointer');
  bottoneBack.style('z-index', '1002');
  bottoneBack.style('padding', '0'); // Rimuove padding per centrare meglio

  bottoneBack.style('appearance', 'none');
  bottoneBack.style('-webkit-appearance', 'none');
  bottoneBack.style('outline', 'none');
  bottoneBack.style('box-shadow', 'none');



  // Funzione per tornare alla pagina precedente nella cronologia del browser
  bottoneBack.mousePressed(() => {
    window.history.back();
  });
}


function mousePressed() {
  // Controlla se il mouse è sopra il bottone
  if (
    mouseX >= goBackBox.x &&
    mouseX <= goBackBox.x + goBackBox.w &&
    mouseY >= goBackBox.y &&
    mouseY <= goBackBox.y + goBackBox.h
  ) {
    window.location.href = "index.html"; // torna alla pagina principale
  }

 

  if (
  mouseX > toggleBox.x &&
  mouseX < toggleBox.x + toggleBox.w &&
  mouseY > toggleBox.y &&
  mouseY < toggleBox.y + toggleBox.h
  ) {
  viewMode = (viewMode === "parameters") ? "overview" : "parameters";
  }

  //HOVER OPzione 1 (colonne pallini)
  if (currentHoveredIndex !== -1) {
    // recupero i dati di quell'anno
    let d = countryData[currentHoveredIndex];
    let year = d.year;

    // costruisci l'URL della pagina di destinazione
    
    let url = "detail_year.html"
      + "?country=" + encodeURIComponent(rawCountryName)
      + "&year=" + encodeURIComponent(year);

    window.location.href = url;
  }

  let mx = mouseX 
  let my = mouseY 
  if (backHomeArea) {
  if (
    mx >= backHomeArea.x &&
    mx <= backHomeArea.x + backHomeArea.w &&
    my >= backHomeArea.y &&
    my <= backHomeArea.y + backHomeArea.h
  ) {
    window.location.href = "index.html";; // oppure location.href = "index.html"
    return;
  }
  }


}


function drawDotChartNegativesNotColored(data, params, padding) {

  // layout originale di riferimento 
  let baseDotSize = 12;
  let baseDotSpacing = 0;
  let baseRows = 50; 
  let baseTotalHeight = (baseDotSize + baseDotSpacing) * baseRows;
  let baseColumnWidth = 2 * (baseDotSize + baseDotSpacing) + 40;

  let yBase = height - bottomPadding;

  // scalatura
  let availableHeight = height - bottomPadding - topPadding;
  let availableWidth  = width - 2 * padding;

  let nYears = max(data.length, 1);
  let scaleY = availableHeight / baseTotalHeight;
  let scaleX = availableWidth / (baseColumnWidth * nYears);

  let scale = min(scaleX, scaleY);

  dotSize = baseDotSize * scale;
  dotSpacing = baseDotSpacing * scale;
  let stepY = dotSize + dotSpacing;

  // distanza scalata tra anni e pallini negativi
  let spostamentoVerticalePallini = 50 * scale;    // <-- qui la distanza scala
  let yZero = yBase - dotSize * 2 - spostamentoVerticalePallini;

  let columnSpacing = baseColumnWidth * scale;
  let xStart = padding;

  let colors = [
    colorElectoralProcess,
    colorPoliticalPluralism,
    colorFunctioningGovernement,
    colorFreedomExpression,
    colorAssociationalRights,
    colorRuleLaw,
    colorPersonalAutonomy,
    colorAddA
  ];

  //HOVER
  //calcolo colonna hoverata mouse x e mouse y 
  let hoveredIndex = -1;
  let tempX = padding;
  let colWidth = 2 * (dotSize + dotSpacing);

  // sopra: 80 pallini -> 80/2 righe = 40 righe
  // sotto: 10 pallini -> 10/2 righe = 5 righe
  let topY = yZero - 40 * stepY;   // parte alta
  let bottomY = yZero + 5 * stepY; // parte bassa (negativi)

  if (mouseY >= topY && mouseY <= bottomY) {
    for (let i = 0; i < data.length; i++) {
      if (mouseX >= tempX && mouseX <= tempX + colWidth) {
        hoveredIndex = i;
        break;
      }
      tempX += columnSpacing;
    }
  }
  //HOVER

  

  // asse y tacche
  for (let t = 0; t <= 80; t += 10) {

    
    let ty = map(t, 0, 100, 0, 50 * stepY);

    fill(textColor);
    noStroke();
    textFont(mioFont);
    textSize(10);
    textAlign(RIGHT, CENTER);

    
    text(t, textPadding, yZero - ty);
  }

  // tacca -10
  let tyNeg = 5.5 * stepY;  // cambiare per spostare su asse y 
  fill(textColor);
  text("-10", textPadding, yZero + tyNeg);

  // asse x anni
  for (let i = 0; i < data.length; i++) {

    let d = data[i];
    let isNegative = d.Total < 0;

    // I PALLINI SOPRA LO 0
    let dots = [];

    if (isNegative) {
      // totale negativo = niente sopra lo 0 
      for (let k = 0; k < 100; k++) {
        dots.push(greyBase);
      }

    } else {
      // TOTAL >= 0 -> uso parametri  come nel grafico originale

      // pallini colorati con i parametri 
      for (let p = 0; p < params.length; p++) {
        if (params[p] === "AddA") continue;

        let count = round(d[params[p]]);
        for (let k = 0; k < count; k++) {
          if (dots.length < 100) dots.push(colors[p]);
        }
        if (dots.length >= 100) break;
      }

      // numero pallini colorati prima di AddQ
      let coloredCount = dots.length;

      // applico AddQ -> spengo pallini colorati partendo dalla fine
      let addq = d.AddQ || 0;

      if (addq > 0) {
        let toRemove = Math.min(Math.round(addq), coloredCount);
        let removed = 0;

        for (let idx = dots.length - 1; idx >= 0 && removed < toRemove; idx--) {
          let c = dots[idx];

          if (
            red(c) !== red(greyBase) ||
            green(c) !== green(greyBase) ||
            blue(c) !== blue(greyBase)
          ) {
            dots[idx] = greyBase;
            removed++;
          }
        }
      }

      // completa  con grigio
      while (dots.length < 100) {
        dots.push(greyBase);
      }
    }

    // 80 pallini sopra lo 0 
    for (let dIdx = 0; dIdx < 80; dIdx++) {
      let row = floor(dIdx / 2);
      let col = dIdx % 2;

      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * (dotSize + dotSpacing);
      let y = yZero - row * stepY;

      fill(dots[dIdx]);
      noStroke();
      circle(x, y, dotSize);
    }

    //linee dello 0
    stroke(textColor);
    strokeWeight(2);
    line(
      xStart - 10,
      yZero + dotSize * 0.5,
      xStart + (dotSize * 2) + 2.5,
      yZero + dotSize * 0.5
    );

    // pallini negativi -> solo se total score <0
    let negCount = 0;
    if (isNegative) {
      negCount = min(abs(d.Total), 10);
    }

    for (let n = 0; n < 10; n++) {

      let row = floor(n / 2);
      let col = n % 2;

      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * (dotSize + dotSpacing);
      let y = yZero + (row + 1.2) * stepY; // cambiare 1.2 per avvicinare i pallini sotto 

      fill( n < negCount ? color(220, 100, 100) : greyBase );

      noStroke();
      circle(x, y, dotSize);
    }

    // asse x : anni 
    let colCenter = xStart + (dotSize + dotSpacing) * 0.5;

    push();
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(mioFont);
    translate(colCenter, yBase + 40);
    rotate(-90);
    fill(textColor);
    text(d.year, 0, 0);
    pop();

    

    xStart += columnSpacing;
  }
}

// i pallini negativi sono colorati in base ai colori dei parametri
function drawDotChartNegatives(data, params, padding) {

  // layout originale di riferimento 
  let baseDotSize = 12;
  let baseDotSpacing = 0;
  let baseRows = 50; 
  let baseTotalHeight = (baseDotSize + baseDotSpacing) * baseRows;
  let baseColumnWidth = 2 * (baseDotSize + baseDotSpacing) + 40;

  let yBase = height - bottomPadding;

  // scalatura
  let availableHeight = height - bottomPadding - topPadding;
  let availableWidth  = width - 2 * padding;

  let nYears = max(data.length, 1);
  let scaleY = availableHeight / baseTotalHeight;
  let scaleX = availableWidth / (baseColumnWidth * nYears);

  let scale = min(scaleX, scaleY);

  dotSize = baseDotSize * scale;
  dotSpacing = baseDotSpacing * scale;
  let stepY = dotSize + dotSpacing;

  // distanza scalata tra anni e pallini negativi
  let spostamentoVerticalePallini = 50 * scale;
  let yZero = yBase - dotSize * 2 - spostamentoVerticalePallini;

  let columnSpacing = baseColumnWidth * scale;
  let xStart = padding;

  let colors = [
    colorElectoralProcess,
    colorPoliticalPluralism,
    colorFunctioningGovernement,
    colorFreedomExpression,
    colorAssociationalRights,
    colorRuleLaw,
    colorPersonalAutonomy,
    colorAddA
  ];




  // asse y tacche (0–80 sopra lo zero)
  for (let t = 0; t <= 80; t += 10) {
    let ty = map(t, 0, 100, 0, 50 * stepY);
    fill(textColor);
    noStroke();
    textFont(mioFont);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text(t, textPadding, yZero - ty);
  }

  // tacca -10
  let tyNeg = 5.5 * stepY;
  fill(textColor);
  text("-10", textPadding, yZero + tyNeg);

  // asse x anni
  for (let i = 0; i < data.length; i++) {

    let d = data[i];
    let isNegative = d.Total < 0;

  

    // costruisco pallini positivi + rimozione Add Q
    let dots = [];
    let removedColors = []; // colori dei pallini cancellati

    // pallini colorati per parametri 
    for (let p = 0; p < params.length; p++) {
      

      let count = round(d[params[p]]);
      for (let k = 0; k < count; k++) {
        if (dots.length < 100) dots.push(colors[p]);
      }
      if (dots.length >= 100) break;
    }

    let coloredCount = dots.length;

    // applico AddQ: cancello pallini dalla fine e salvo il loro colore
    let addq = d.AddQ || 0;

    if (addq > 0 && coloredCount > 0) {
      let toRemove = Math.min(Math.round(addq), coloredCount);
      let removed = 0;

      for (let idx = dots.length - 1; idx >= 0 && removed < toRemove; idx--) {
        let c = dots[idx];

        // se non è grigio, lo “cancello”
        if (
          red(c) !== red(greyBase) ||
          green(c) !== green(greyBase) ||
          blue(c) !== blue(greyBase)
        ) {
          removedColors.push(c);  // salvo il colore cancellato
          dots[idx] = greyBase;  // lo spengo
          removed++;
        }
      }
    }

    // completo a 100 con grigio
    while (dots.length < 100) {
      dots.push(greyBase);
    }

    // 80 pallini sopra lo 0 
    for (let dIdx = 0; dIdx < 80; dIdx++) {
      let row = floor(dIdx / 2);
      let col = dIdx % 2;

      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * (dotSize + dotSpacing);
      let y = yZero - row * stepY;

      let c = dots[dIdx];

      // se il total è negativo, sopra lo zero vuoi la griglia è vuota =  grigio 
      if (isNegative) {
        c = greyBase;
      }

    
      fill(c);
      noStroke();
      circle(x, y, dotSize);
    }

    // linea zero 
    stroke(lineColor);
    strokeWeight(2);
    line(
      xStart - 10,
      yZero + dotSize * 0.5,
      xStart + (dotSize * 2) + 2.5,
      yZero + dotSize * 0.5
    );

    // pallini colorati negativi 
    let negCount = 0;
    if (isNegative) {
      negCount = min(abs(d.Total), 10); // max 10 pallini
    }

    for (let n = 0; n < 10; n++) {

      let row = floor(n / 2);
      let col = n % 2;

      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * (dotSize + dotSpacing);
      let y = yZero + (row + 1.2) * stepY;// cambiare 1.2 per cambiare distaza palllini e linea 0

      //fill( n < negCount ? color("#C51A1A") : greyBase );

      let cNeg = greyBase;

      if (n < negCount) {
        // se ho abbastanza colori cancellati, li uso
        if (n < removedColors.length) {
          cNeg = removedColors[n];
        } else {
          // se non ci sono abbastanza colori, fallback a un rosso
          cNeg = color("#C51A1A"); // in realtà sono tutti tolti dall'addQ
        }
      }

      fill(cNeg);
      noStroke();
      circle(x, y, dotSize);
    }

    // anno asse x
    let colCenter = xStart + (dotSize + dotSpacing) * 0.5;

    push();
    textAlign(CENTER, CENTER);
    textSize(20);
    translate(colCenter, yBase + 40);
    rotate(-90);
    fill(textColor);
    text(d.year, 0, 0);
    pop();

    xStart += columnSpacing;
  }
}


function drawOverviewChartNegative() {
  // layout base 
  let baseBarW = 12;
  let baseDotSize = 12;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize) * baseRows;
  let baseSpacing = 64;

  let yBase = height - bottomPadding;

  // scalatura
  let availableHeight = height - bottomPadding - topPadding;
  let availableWidth  = width - 2 * padding;

  let nYears = max(countryData.length, 1);
  let scaleY = availableHeight / baseTotalHeight;
  let scaleX = availableWidth / (baseSpacing * nYears);

  let scale = min(scaleX, scaleY);

  totalHeight = baseTotalHeight * scale;
  let barW = baseBarW * scale;
  let spacing = baseSpacing * scale;
  dotSize = baseDotSize * scale;

  // per posizionare asse dello 0 
  let spostamentoVerticalePallini = 50 * scale;
  let yZero = yBase - dotSize * 2 - spostamentoVerticalePallini;

  let xStart = padding;

  //  tacche asse y (80, non 100): 0 sulla linea dello 0 
  for (let t = 0; t <= 80; t += 10) {
    let ty = map(t, 0, 100, 0, totalHeight); 
    fill(textColor);
    noStroke();
    textFont(mioFont);
    textSize(10);
    textAlign(RIGHT, CENTER);
    
    text(t, textPadding, yZero - ty);
  }

  // tacca -10 sotto lo 0 
  let yNeg = totalHeight / 9;  
  fill(textColor);
  noStroke();
  textAlign(RIGHT, CENTER);
  text("-10", textPadding, yZero + yNeg );


  // linea 0 
  let xStartLine = padding - 5;
  let xEndLine = padding + spacing * (nYears - 1) + barW + 5;
  stroke(lineColor); // problema con colore, o va sopra i pallini o le barre vanno sopra solo che si vede la differenza di gradiente
  strokeWeight(2);
  line(xStartLine, yZero, xEndLine, yZero);

  // barre
  for (let d of countryData) {

    let total = d.Total;
    let h = map(total, 0, 100, 0, totalHeight);

    let status = d.Status;
    let colori = coloriStatus[status] || ["#888", "#888", "#888"];

    drawingContext.fillStyle = creaGradiente(
      xStart,
      yZero - h,
      yZero,
      barW,
      colori
    );

    noStroke();
    rect(xStart, yZero - h, barW, h);

    

    // pallino in cima
    fill(240);
    noStroke();
    circle(xStart + barW/2, yZero - h + dotSize/2, barW*1.8);

    // etichetta anno  
    push();
    translate(xStart + barW/2, yBase + 40);
    rotate(-90);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(mioFont);
    fill(textColor);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }

  

}




function drawCountryText(countryName, x, y, w) {
  let key = normalizeCountryName(countryName);

  // testi dei paesi
  const countryTexts = {
    //africa
    benin: "Benin’s status declined from Free to Partly Free because a new electoral code and a series of decisions by the courts, electoral authorities, and the government resulted in the exclusion of all opposition parties from the April 2019 parliamentary elections.",
    burkinafaso: "Burkina Faso’s status declined from Partly Free to Not Free due to the effects of two successive military coups, including the suspension of the constitution and dissolution of the legislature, and an expanding conflict with Islamist militant groups.",
    burundi: "After a brief decline in violence following the 2010 and 2011 peak, 2014 saw renewed intimidation and attacks against the opposition and civil society by the ruling party’s youth wing. Freedom of expression and the press were further restricted, including through a new repressive media law. The secret arrest of a journalist highlighted the dramatic shrinking of democratic space.",
    centralafricanrepublic: "The Central African Republic's political rights rating declined from 5 to 7, its civil liberties rating declined from 5 to 7, and its status declined from Partly Free to Not Free due to the Séléka rebel group's ouster of the incumbent president and legislature, the suspension of the constitution, and a general proliferation of violence by criminal bands and militias, spurring clashes between Muslim and Christian communities.",
    egypt:"Since taking power in a 2013 coup, President Abdel Fattah al-Sisi has tightened his authoritarian grip on Egypt. Political opposition has been effectively eliminated, with dissent leading to prosecution and imprisonment. Civil liberties, especially press freedom and freedom of assembly, are severely restricted. Security forces commit human rights abuses with impunity, while discrimination and gender-based violence remain widespread.",
    guinea: "Guinea’s status declined from Partly Free to Not Free because military commanders seized power in a coup, removing President Alpha Condé and dissolving the legislature.",
    guineabissau: "Guinea-Bissau’s political rights rating improved and its status shifted from Not Free to Partly Free because the 2014 elections, the first since the 2012 coup, were considered free and fair by both international and national observers, allowing the opposition to compete and increase its participation in government. However, the police continue to disrupt some demonstrations, and corruption remains a major problem, aggravated by the influence of organized criminal networks, including drug trafficking.",
    lesotho: "Lesotho’s political rights rating declined from 2 to 3, and its status shifted from Free to Partly Free due to ongoing instability following the failed 2014 coup attempt. It later improved from Partly Free to Free thanks to the formation of a new government after competitive parliamentary elections, though the country continues to face serious security and governance challenges.",
    libya:"Libya’s political rights and civil liberties ratings declined, and its status shifted from Partly Free to Not Free due to the country’s descent into civil war. The conflict triggered a humanitarian crisis as citizens fled embattled cities, and it increased pressure on civil society and media outlets amid growing political polarization.",
    mali:"After a period of democratization that began in the early 1990s, Mali showed growing signs of institutional fragility. The crisis erupted in 2012 with a military coup and an armed rebellion in the north. Despite a return to constitutional order in 2015, insecurity and political tensions persisted, culminating in two additional military coups in 2020 and 2021. These events pushed the country toward a much less free and stable status.",
    mauritania: "Mauritania’s status improved from Not Free to Partly Free due to a relatively credible presidential election that resulted in the country’s first peaceful transfer of power after the incumbent completed his term, signaling a departure from a history of military coups.",
    niger: "Niger’s status declined from Partly Free to Not Free because the junta restricted media freedom, weakened due process, and dissolved local councils, which had been among the country’s few remaining elected institutions.",
    senegal: "Senegal moved from Free to Partly Free in 2020 because the 2019 presidential election excluded two major opposition leaders through politically charged convictions. In 2025, the country returned to Free after democratic institutions blocked an attempt to delay the election, and an opposition coalition won both the presidency and a parliamentary majority in free and fair elections.",
    seychelles: "Seychelles’s status improved from Partly Free to Free because a strengthened electoral framework contributed to a more open and competitive presidential election, resulting in the country’s first transfer of power to an opposition party.",
    sierraleone: "Sierra Leone's political rights rating declined and its status declined from Free to Partly Free due to high-profile corruption allegations against bankers, police officers, and government officials as well as long-standing accounting irregularities that led to the country's suspension from the Extractive Industries Transparency Initiative.",
    tanzania: "Tanzania’s status declined from Partly Free to Not Free because the authorities altered the voter registrations of ethnic Maasai citizens as part of a repressive campaign to expel their communities from a planned game reserve.",
    thegambia: "The Gambia’s status improved from Not Free to Partly Free, due to the installation of newly elected president Adama Barrow into office in January and the holding of competitive legislative elections in April. Among other openings associated with the departure of former president Yahya Jammeh, exiled journalists and activists returned, political prisoners were released, ministers declared their assets to an ombudsman, and the press union began work on media-sector reform.",
    tunisia: "After the 2011 revolution, Tunisia made significant democratic gains, adopting a new constitution in 2014 and holding free multiparty elections. However, corruption, economic instability, security issues, and unresolved justice reforms hindered democratic consolidation. Tunisia’s status fell from Free to Partly Free in 2022 when President Kaïs Saïed dismissed the elected government, suspended parliament indefinitely, and imposed severe restrictions on civil liberties to suppress opposition.",
    uganda: "In 2015, Uganda’s status dropped from Partly Free to Not Free due to growing violations of civil liberties and political rights, especially targeting opposition supporters, civil society, women, and LGBT communities. In 2019, the country remained classified as Not Free, as the government under long-time leader Yoweri Museveni further restricted free expression and increased surveillance of communications.",
    zimbawe: "In 2016, Zimbabwe’s status improved from Not Free to Partly Free, thanks to marginal gains in civil liberties and court rulings that hinted at greater judicial independence. However, by 2018, the country’s status declined from Partly Free to Not Free due to the manner in which longtime president Robert Mugabe was forced out under military pressure, continuing repression of opposition and media, and lack of genuine democratic reform.",

  
    //asia
    bhutan: "Bhutan’s status improved from Partly Free to Free because free and fair legislative elections and the formation of a new government further consolidated a long democratic reform process in the kingdom, and because physical security and the environment for civil liberties have steadily improved in recent years.",
    india: "India’s status declined from Free to Partly Free due to a multiyear pattern in which the Hindu nationalist government and its allies have presided over rising violence and discriminatory policies affecting the Muslim population and pursued a crackdown on expressions of dissent by the media, academics, civil society groups, and protesters.",
    indiankashmir: "Indian Kashmir’s status declined from Partly Free to Not Free due to the Indian government’s abrupt revocation of the region’s autonomy, the postponement or elimination of legislative elections, and a security crackdown that sharply curtailed civil liberties and included mass arrests of local politicians and activists.",
    indonesia: "Indonesia's civil liberties rating declined and its status declined from Free to Partly Free due to the adoption of a law that restricts the activities of nongovernmental organizations, increases bureaucratic oversight of such groups, and requires them to support the national ideology of Pancasila, including its explicitly monotheist component.",
    myanmar: "Myanmar’s status improved from Not Free to Partly Free in 2017, after lawmakers held the country’s first relatively free presidential election through an indirect vote in parliament, and as the newly elected government began implementing policy reforms to expand civil liberties. However, in 2020, Myanmar’s status declined back to Not Free due to worsening conflicts between the military and ethnic minority rebel groups, which severely restricted freedom of movement and contributed to a broader deterioration of rights and security across the country.",
    solomonislands: "The Solomon Islands’ status improved from Partly Free to Free, due to a recent record of free competition among opposing political groupings and a pattern of increased judicial independence.",
    thailand: "Thailand has experienced repeated shifts between Partly Free and Not Free due to persistent military influence, judicial interventions against opposition parties, and recurrent restrictions on civil liberties. The country first declined to Not Free in 2015 following the 2014 military coup. A temporary improvement to Partly Free in 2020 followed parliamentary elections, but renewed repression of student protests and the dissolution of a key opposition party pushed Thailand back to Not Free in 2021. In 2024, competitive elections led to a brief return to Partly Free, but in 2025, the Constitutional Court dissolved another major opposition party, and unelected institutions continued to undermine democratic governance, resulting once again in a Not Free rating.",
    timorleste: "Timor-Leste’s status improved from Partly Free to Free in 2018 because fair elections that led to a smooth transfer of power enabled new parties and candidates to enter the political system.",
    
    //america
    colombia: "Colombia’s status improved from Partly Free to Free due to more open and competitive national elections, a decline in restrictions on assembly and movement, and the decriminalization of abortion. However, illegal armed groups remained active, and the country was still one of the deadliest in the world for human rights defenders.",
    dominicanrepublic: "In 2016, the Dominican Republic fell from Free to Partly Free as corruption, police abuses, and weak rule of law undermined democratic institutions. Persistent discrimination against people of Haitian descent and widespread vote-buying further reduced political and civil freedoms.",
    ecuador: "Ecuador’s status moved from Partly Free to Free because that year’s presidential and legislative elections did not feature the kinds of abuses seen in previous cycles — such as the misuse of public resources — and resulted in a peaceful transfer of power between rival parties. However, in subsequent reports, the country returned to Partly Free due to rising organized violence, increasing corruption, and a decline in civil liberties.",
    elsalvador: "El Salvador’s status declined from Free to Partly Free because criminal groups continue to commit acts of violence and intimidation against politicians, ordinary citizens, and religious congregants, and because the justice system has been hampered by obstruction and politicization.",
    haiti: "Haiti’s status declined from Partly Free to Not Free due to the assassination of President Jovenel Moïse, an ongoing breakdown in the electoral system and other state institutions, and the corrosive effects of organized crime and violence on civic life.",
    nicaragua: "Nicaragua’s status declined from Partly Free to Not Free due to authorities’ brutal repression of an antigovernment protest movement, which has included the arrest and imprisonment of opposition figures, intimidation and attacks against religious leaders, and violence by state forces and allied armed groups that resulted in hundreds of deaths.",
    peru: "Peru shifted from Free to Partly Free in 2021 due to years of institutional conflict between the presidency and Congress, which destabilized governance and led to rapid presidential turnover.It briefly returned to Free in 2022 after new elections eased the crisi. In 2023, the country fell back to Partly Free when the president attempted to dissolve Congress and was removed, sparking deadly protests.",
    venezuela: "Venezuela’s status declined from Partly Free to Not Free, due to efforts by the executive branch and the politicized judiciary to curtail the power of the opposition-controlled legislature, including a series of court rulings that invalidated new laws, usurped legislative authority to review the national budget, and blocked legislative efforts to address the country’s economic and humanitarian crisis.",

    //europa
    hungary: "Hungary’s status declined from Free to Partly Free due to sustained attacks on the country’s democratic institutions by Prime Minister Viktor Orbán’s Fidesz party, which has used its parliamentary supermajority to impose restrictions on or assert control over the opposition, the media, religious groups, academia, NGOs, the courts, asylum seekers, and the private sector since 2010.",
    montenegro: "Montenegro’s status declined from Free to Partly Free in 2016 due to increasing political tensions, police violence against anti-government protests, and restrictions on public assemblies. Freedom House also noted intimidation of journalists and disruptions of LGBTQ+ events as further signs of democratic backsliding.",
    serbia: "Serbia’s status declined from Free to Partly Free due to deterioration in the conduct of elections, continued attempts by the government and allied media outlets to undermine independent journalists through legal harassment and smear campaigns, and President Aleksandar Vučić’s de facto accumulation of executive powers that conflict with his constitutional role.",
    turkey: "Turkey’s status declined from Partly Free to Not Free, due to a deeply flawed constitutional referendum that centralized power in the presidency, the mass replacement of elected mayors with government appointees, arbitrary prosecutions of rights activists and other perceived enemies of the state, and continued purges of state employees.",

    //medio oriente
    jordan: "From 2016 to 2025, Jordan alternates between brief periods of political opening and phases of democratic regression. The shift to Partly Free in 2017 reflects the impact of an electoral reform that made parliamentary elections fairer. The subsequent return to Not Free is linked to restrictions on freedom of expression, repression of dissent, and limits on political participation. In 2025, the status moves back to Partly Free, due to electoral law changes that led to somewhat fairer parliamentary elections.",
    kuwait: "Kuwait is a constitutional emirate in which the al-Sabah family holds executive power, while the elected parliament has historically played a critical and independent role. The authorities impose limits on civil liberties, and the country’s large population of non-citizen workers faces significant disadvantages. In 2025, the emir dissolved the parliament and suspended elections, triggering one of the steepest score declines globally in Freedom House’s ratings.",

    //eurasia
    kyrgyzstan: "Kyrgyzstan’s status declined from Partly Free to Not Free because the aftermath of deeply flawed parliamentary elections featured significant political violence and intimidation that culminated in the irregular seizure of power by a nationalist leader and convicted felon who had been freed from prison by supporters.",
    nagornokarabakh: "Nagorno-Karabakh’s status declined from Partly Free to Not Free due to an Azerbaijani blockade and military offensive that culminated in the dissolution of local political, legal, and civic institutions and the departure of nearly all of the civilian population.",
    
   
  };

  // prende il testo (oppure stringa vuota)
  let testo = countryTexts[key] || "";

  // no testo no riquadro
  if (testo.trim() === "") return;


  
  // --- Preparazione font ---
  textSize(16);
  textFont(mioFont);
  textAlign(LEFT, TOP);

  // --- Calcolo automatico delle righe ---
  let words = testo.split(" ");
  let lines = [];
  let currentLine = "";

  for (let wIndex = 0; wIndex < words.length; wIndex++) {
    let testLine = currentLine + words[wIndex] + " ";

    if (textWidth(testLine) > w) {
      lines.push(currentLine);
      currentLine = words[wIndex] + " ";
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // --- Altezza totale del box ---
  let lineHeight = textAscent() + textDescent() + 4;
  let boxPadding = 20;
  let boxH = lines.length * lineHeight + boxPadding * 2;
  let boxW = w + boxPadding * 2;

  // --- Disegno del box ---
  noFill();
  stroke(textColor);
  strokeWeight(2);
  rect(x - boxPadding, y - boxPadding, boxW, boxH, 15);

  // --- Disegno del testo ---
  fill(textColor);
  noStroke();
  let textY = y;

  for (let line of lines) {
    text(line, x, textY);
    textY += lineHeight;
  }

}



