let data;
let countryName;
let countryData = [];
let params = ["ElectoralProcess", "PoliticalPluralism", "FunctioningofGovernement", "FreedomofExpression","AssociationRights","RuleofLaw","IndividualRights"];
let padding = 70; //distanza dal lato della pagina
let barWidth = 70; 
let spacing = 2; //spazio tra barre
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



function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  mioFont = loadFont("fonts/OpenSans-Regular.ttf");
  mioFontBold = loadFont("fonts/OpenSans-Bold.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  textColor = color(232,233,214);
  colorElectoralProcess = color(232, 233, 214);
  colorPoliticalPluralism = color(144, 161, 165);
  colorFunctioningGovernement = color(75, 89, 101);
  colorFreedomExpression = color(229, 194, 143);
  colorAssociationalRights = color(162, 124, 182);
  colorRuleLaw = color(209, 191, 220);
  colorPersonalAutonomy = color(244, 201, 184);


  fill(textColor);
  textSize(14);
  textFont(mioFont);



  // prendi il paese dalla query string
  let urlParams = getURLParams();
  countryName = urlParams.country;

  if (!countryName) {
    fill(textColor);
    console.error("Nessun paese selezionato nella query string");
    noLoop();
    return;
  }

  // filtra tutti i dati per il paese selezionato
    for (let i = 0; i < data.getRowCount(); i++) {
    let countryCSV = data.getString(i, "Country/Territory").trim();
    if (countryCSV.toLowerCase() === countryName.toLowerCase()) {
      countryData.push({
        year: data.getString(i, "Edition").trim(),
        ElectoralProcess: parseFloat(data.getString(i, "Total A")) || 0,
        PoliticalPluralism: parseFloat(data.getString(i, "Total B")) || 0,
        FunctioningofGovernement: parseFloat(data.getString(i, "Total C")) || 0,
        FreedomofExpression: parseFloat(data.getString(i, "Total D")) || 0,
        AssociationRights: parseFloat(data.getString(i, "Total E")) || 0,
        RuleofLaw: parseFloat(data.getString(i, "Total F")) || 0,
        IndividualRights: parseFloat(data.getString(i, "Total G")) || 0,
      });
    }
  countryData.reverse();
  }
}

function draw() {
  background(24,23,20);

  
  textSize(15)
  fill(textColor);
  if (!countryData || countryData.length === 0) {
    
    textAlign(CENTER);
    
    text("Nessun dato disponibile per questo paese", width / 2, height / 2);
    return;
  }

  
  drawBarChart(countryData, params, padding, barWidth, spacing);
  drawLegendTitle();
  fill(textColor);
  textSize(goBackTextSize);
  textFont(mioFontBold);
  text("< Go Back", goBackTextX, goBackTextY);
  drawGoBackButton();
}


function drawBarChart(data, params, padding, barWidth, spacing) {
  let xStart = padding;
  let yBase = windowHeight - padding;
  let maxHeight = 500; // cambiando questo cambia tutta l'altezza del grafico in proporzione

  // palette colori diversi per i parametri 
  let colors = [
  colorElectoralProcess,
  colorPoliticalPluralism,
  colorFunctioningGovernement,
  colorFreedomExpression,
  colorAssociationalRights,
  colorRuleLaw,
  colorPersonalAutonomy
  ];


  

  // Tacche asse y
  for (let t = 0; t <= 100; t += 10) {
    let ty = map(t, 0, 100, 0, maxHeight);
    fill(0);
    noStroke();
    fill(textColor);
    textFont(mioFont);
    textAlign(RIGHT, CENTER);
    text(t, padding - 10 , yBase - ty);
    stroke(180);
    strokeWeight(3)
    line(padding - 5, yBase - ty, padding, yBase - ty);
    
  }

  //barre
  noStroke();
  for (let i = 0; i < data.length; i++) {
    let yTop = yBase;

    // Rettangoli parametri -> i è l'anno, j è il parametro all'interno dell'anno
    for (let j = 0; j < params.length; j++) {
      let val = data[i][params[j]];
      let rectHeight = map(val, 0, 100, 0, maxHeight);

      fill(colors[j]);
      rect(xStart, yTop - rectHeight, barWidth, rectHeight);

      yTop -= rectHeight;
    }

    // anno asse x
    fill(textColor);
    textAlign(CENTER);
    text(data[i].year, xStart + barWidth / 2, yBase + 20);

    xStart += barWidth + spacing;
  }

  
}

function drawLegendTitle(){

  let xText = windowWidth /2 + 320;
  let yText = padding - 20;
  let c = 10
  let h = 20
  let b = 5

  textAlign(LEFT)

  fill(textColor);
  textFont(mioFont);
  text("Electoral Process", xText, yText + h );
  ellipse(xText-10, yText + h +b , 10);
  text("Political Pluralism & Participation", xText, yText + 2*h );
  ellipse(xText-10, yText + 2*h +b , 10);
  text("Functioning of Government", xText, yText+ 3*h);
  ellipse(xText-10, yText+ 3*h +b  , 10);
  text("Freedom of Expression & Belief", xText, yText +5*h + c);
  ellipse(xText-10, yText +5*h + b + c, 10);
  text("Associational & Organizational Rights", xText, yText+ 6*h + c);
  ellipse(xText-10, yText+ 6*h + b + c, 10);
  text("Rule of Law", xText, yText+ 7*h +c );
  ellipse(xText-10, yText+ 7*h + b + c , 10);
  text("Personal Autonomy & Individual Rights", xText, yText+8*h + c);
  ellipse(xText-10, yText+8*h + b + c, 10);


  textFont(mioFontBold);
  text("Political Rights", xText -20, yText);
  text("Civil Liberties", xText -20, yText+ 4*h +c );


  noStroke();
  fill(colorElectoralProcess);
  ellipse(xText-10, yText + h + b, 10);

  fill(colorPoliticalPluralism);
  ellipse(xText-10, yText + 2*h + b, 10);

  fill(colorFunctioningGovernement);
  ellipse(xText-10, yText + 3*h + b, 10);

  fill(colorFreedomExpression);
  ellipse(xText-10, yText + 5*h + b + c, 10);

  fill(colorAssociationalRights);
  ellipse(xText-10, yText + 6*h + b + c, 10);

  fill(colorRuleLaw);
  ellipse(xText-10, yText + 7*h + b + c, 10);

  fill(colorPersonalAutonomy);
  ellipse(xText-10, yText + 8*h + b + c, 10);




  fill(textColor);
  textSize(100);
  text(countryName, padding , padding);
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
}





