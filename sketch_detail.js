let data;
let countryTitle = "";
let rawCountryName;
let countryName;
let countryData = [];
let params = ["ElectoralProcess", "PoliticalPluralism", "FunctioningofGovernement", "FreedomofExpression","AssociationRights","RuleofLaw","IndividualRights"];
let padding = 100; //distanza del grafico dal lato della pagina
let bottomPadding = 100;
let textPadding = 70;

let dotSize;
let dotSpacing;
let totalHeight = (dotSize + dotSpacing)*50;



let viewMode = "overview"; 
let toggleBox = {};




let goBackButton;
let goBackBox = {};

// bottone per tornare indietro
let goBackTextX = 20;
let goBackTextY = 20;
let goBackTextSize = 15;

let textColor;
let colorElectoralProcess;
let colorPoliticalPluralism;
let colorFunctioningGovernement;
let colorFreedomExpression;
let colorAssociationalRights;
let colorRuleLaw;
let colorPersonalAutonomy;
let coloriStatus = {
  'F': ["#c76351", "#d58d3e", "#26231d"],    // Libero
  'PF': ["#e5c38f", "#cad181", "#26231d"],   // Parzialmente Libero
  'NF': ["#75a099", "#91a2a6", "#26231d"],   // Non Libero
};



function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  mioFont = loadFont("fonts/NeueHaasGrotDisp-55Roman.otf");
  mioFontMedium = loadFont("fonts/NeueHaasGrotDisp-65Medium.otf");
  mioFontBold = loadFont("fonts/NeueHaasGrotDisp-75Bold.otf");
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
  angleMode(DEGREES)

  textColor = color(234,234,216);
  colorElectoralProcess = color(202, 209, 129);
  colorPoliticalPluralism = color(144, 161, 165);
  colorFunctioningGovernement = color(21, 95, 128);
  colorFreedomExpression = color(213, 141, 62);
  colorAssociationalRights = color(161, 124, 182);
  colorRuleLaw = color(209, 191, 220);
  colorPersonalAutonomy = color(199, 99, 81);

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
      Status: data.getString(i, "Status").trim()
    });
  }

}

// Ordina per anno crescente
countryData.sort((a, b) => parseInt(a.year) - parseInt(b.year));

}

function draw() {
  background(38,35,29);

  textSize(15)
  fill(textColor);
  if (!countryData || countryData.length === 0) {
    
    textAlign(CENTER);
    
    text("Nessun dato disponibile per questo paese", width / 2, height / 2);
    return;
  }
 
  


  if (viewMode === "parameters") {
    drawDotChart(countryData, params, padding);
    drawLegend();
  } else {
    drawOverviewChart(countryData);
  }
  drawToggle();

  fill(textColor);
  textSize(goBackTextSize);
  textFont(mioFontBold);
  //drawGoBackButton();
  
  drawTitle();


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
  dotSize = 12;
  dotSpacing = 0;
  let xStart = padding;
  let yBase = windowHeight - bottomPadding;
  totalHeight = (dotSize + dotSpacing)*50

  let colors = [
    colorElectoralProcess,
    colorPoliticalPluralism,
    colorFunctioningGovernement,
    colorFreedomExpression,
    colorAssociationalRights,
    colorRuleLaw,
    colorPersonalAutonomy
  ];

  //tacche asse y
    for (let t = 0; t <= 100; t += 10) {
    let ty = map(t, 0, 100, 0, totalHeight);
    fill(0);
    noStroke();
    fill(textColor);
    textFont(mioFont);
    textSize(10)
    textAlign(RIGHT, CENTER);
    text(t, textPadding, yBase - ty);
    stroke(180);
    //strokeWeight(3)
    //line(padding - 5, yBase - ty, padding, yBase - ty);
    
  }

  for (let i = 0; i < data.length; i++) {

    // Calcola la lista dei colori cumulativi per i 100 pallini
    let dots = [];
    for (let p = 0; p < params.length; p++) {
      let count = round(data[i][params[p]]);
      for (let k = 0; k < count; k++) {
        dots.push(colors[p]);
        if (dots.length >= 100) break; // sicurezza
      }
    }

    // Se meno di 100, riempi con grigio chiaro
    while (dots.length < 100) {
      dots.push(color(53,51,48));
    }

    // rieempimento a zig -zag 
    // Disegna i 100 pallini in due colonne da 50
    /*for (let d = 0; d < 100; d++) {
    let row = floor(d / 2);  // ogni 2 pallini una nuova riga
    let col = d % 2;*/         // alterna colonna 0 e 1 (sinistra/destra)
   // 0 o 1

   // "riempimento a serpentina"
   for (let d = 0; d < 100; d++) {
    let row = floor(d / 2);          // riga 0..49
    let col = d % 2;                 // colonna base 0 o 1

    // Se la riga è dispari, inverti le colonne (serpentina)
    if (row % 2 == 1) {
        col = 1 - col;
    }

      let x = xStart + col * (dotSize + dotSpacing);
      let y = yBase - row * (dotSize + dotSpacing);

      fill(dots[d]);
      noStroke();
      circle(x, y, dotSize);
    }

    

    push();
    textAlign(CENTER, CENTER);
    textSize(20);                
    textFont(mioFont);       
    translate(xStart + (dotSize + dotSpacing) - 10, yBase + 40);
    rotate(-90);
    fill(textColor);
    text(data[i].year, 0, 0);
    pop();

    // Spazio tra una colonna di pallini e la successiva
    xStart += 2 * (dotSize + dotSpacing) + 40; // modifica se vuoi più distanziamento
  }
}




function drawOverviewChart() {
  
  dotSize = 12;
  dotSpacing = 0;
  totalHeight = (dotSize + dotSpacing)*50
  let xStart = padding;
  let yBase = windowHeight - bottomPadding;
  let barW = 12;
  let spacing = 64; // barW + (2*dotSize - barW) + guarda xStart alla fine di dotChart
  

  for (let t = 0; t <= 100; t += 10) {
    let ty = map(t, 0, 100, 0, totalHeight);
    fill(0);
    noStroke();
    fill(textColor);
    textFont(mioFont);
    textSize(10)
    textAlign(RIGHT, CENTER);
    text(t, textPadding, yBase - ty);
    stroke(180);
    //strokeWeight(3)
    //line(padding - 5, yBase - ty, padding, yBase - ty);
    
  }

  for (let d of countryData) {

    let total = 
      d.ElectoralProcess +
      d.PoliticalPluralism +
      d.FunctioningofGovernement +
      d.FreedomofExpression +
      d.AssociationRights +
      d.RuleofLaw +
      d.IndividualRights;

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

    // linea verticale
    //noStroke();
    //fill(40, 120, 200);
    //rect(xStart , yBase - h + dotSize/2 , barW, h); 
    

    // pallino
    fill(240);
    noStroke();
    circle(xStart + barW/2, yBase - h + dotSize/2, barW*1.8);

    // etichetta anno ruotata
    push();
    translate(xStart + 12 -10, yBase + 40);
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

  let xText = windowWidth /2 + 350;
  let yText = windowHeight - bottomPadding -350;
  let dimC = 15
  let c = 40
  let h = 25
  let b = 5


  let rectX = xText - 40;
  let rectY = yText - 40;
  let rectW = 370;
  let rectH = 320;


  textAlign(LEFT)

  fill(textColor);
  textFont(mioFont);
  textSize(15);
  text("Electoral Process", xText, yText + h );
  
  text("Political Pluralism and Participation", xText, yText + 2*h );
  
  text("Functioning of Government", xText, yText+ 3*h);
  
  text("Freedom of Expression and Belief", xText, yText +5*h + c);
  
  text("Associational and Organizational Rights", xText, yText+ 6*h + c);
  
  text("Rule of Law", xText, yText+ 7*h +c );
  
  text("Personal Autonomy and Individual Rights", xText, yText+8*h + c);
  


  textFont(mioFontBold);
  textSize(20)
  text("Political Rights", xText -20, yText -10);
  text("Civil Liberties", xText -20, yText+ 4*h +c -10 );


  noStroke();
  fill(colorElectoralProcess);
  ellipse(xText- dimC, yText + h + b - 5 , dimC);

  fill(colorPoliticalPluralism);
  ellipse(xText-dimC, yText + 2*h + b- 5, dimC);

  fill(colorFunctioningGovernement);
  ellipse(xText-dimC, yText + 3*h + b - 5, dimC);

  fill(colorFreedomExpression);
  ellipse(xText-dimC, yText + 5*h + b + c -5, dimC);

  fill(colorAssociationalRights);
  ellipse(xText-dimC, yText + 6*h + b + c -5, dimC);

  fill(colorRuleLaw);
  ellipse(xText-dimC, yText + 7*h + b + c -5, dimC);

  fill(colorPersonalAutonomy);
  ellipse(xText-dimC, yText + 8*h + b + c - 5, dimC);


  noFill();
  stroke(textColor);
  strokeWeight(2);
  rect(rectX,rectY,rectW,rectH,20);



}

function drawTitle(){

  fill(textColor);
  textSize(70);
  text(countryTitle, textPadding -10, 50);
}

function drawGoBackButton() {
  textFont(mioFontBold);
  textSize(goBackTextSize);
  fill(textColor);
  textAlign(LEFT, TOP);

  // disegna il testo
  text("< Go Back", goBackTextX, goBackTextY);

  // calcola e salva la "hitbox" del bottone
  let tw = textWidth("< Go Back");
  let th = goBackTextSize * 1.2; // altezza approssimativa con un po’ di margine

  goBackBox = {
    x: goBackTextX,
    y: goBackTextY,
    w: tw,
    h: th
  };
}

function creaGradienteToggle(x, y, w, h) {
  let g = drawingContext.createLinearGradient(x, y, x + w, y + h);

  // puoi cambiare i colori qui ↑↓
  g.addColorStop(0, "#c76351");  
  g.addColorStop(1, "#d58d3e");

  return g;
}


function drawToggle() {
  let x = windowWidth/2 + 450;
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
    text("Total Overview", x + w + 20, y + h / 2);
  } else {
    fill(150);
    text("Parameters", x - 100, y + h / 2);
    fill(255);
    text("Total Overview", x + w + 20, y + h / 2);
  }

  // cerchietto
  fill(255);
  let cx = (viewMode === "parameters") ? x + 15 : x + w - 15;
  circle(cx, y + h / 2, h - 3 );

  toggleBox = { x, y, w, h };
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



}