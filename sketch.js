let data;
let topPadding = 250;
let outerPadding = 10;
let padding = 10;
let itemSize = 30;
let hoveredCountry = null;
let countries = [];

function preload() {
  
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  mioFont = loadFont("fonts/OpenSans-Regular.ttf");
  mioFontBold = loadFont("fonts/OpenSans-Bold.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(14);

  textFont(mioFont)

  let seen = {}; // oggetto per evitare duplicati

  for (let i = 0; i < data.getRowCount(); i++) {
    let edition = data.getString(i, "Edition").trim(); // togli spazi
    let country = data.getString(i, "Country/Territory").trim();

    if (edition === "2025" && !seen[country]) {
      countries.push({ name: country });
      seen[country] = true; // marca come già visto
    }
  }

  console.log("Paesi 2025:", countries.length);
}


function draw() {
  background(220);
  drawGrid();
  drawTooltip();
}

function drawGrid() {
  let cols = floor((width - 2 * outerPadding) / (itemSize + padding));
  hoveredCountry = null;
  let colCount = 0;
  let rowCount = 0;

  for (let i = 0; i < countries.length; i++) {
    let xPos = outerPadding + colCount * (itemSize + padding);
    let yPos = topPadding + rowCount * (itemSize + padding);

    
    if (mouseX > xPos && mouseX < xPos + itemSize &&
        mouseY > yPos && mouseY < yPos + itemSize) {
      fill(180);
      hoveredCountry = { ...countries[i], xPos, yPos };
    } else {
      fill(200);
    }

    noStroke();
    rect(xPos, yPos, itemSize, itemSize);

    colCount++;
    if (colCount >= cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

function drawTooltip() {
  if (hoveredCountry) {
    fill(0);
    text(hoveredCountry.name, hoveredCountry.xPos + 35, hoveredCountry.yPos + 15);
  }
}

function mousePressed() {
  if (hoveredCountry) {
    
    window.location.href = "detail.html?country=" + encodeURIComponent(hoveredCountry.name);
  }
}


