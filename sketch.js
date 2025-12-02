let data;
let topPadding = 250;
let outerPadding = 10;
let padding = 10;
let itemSize = 30;
let hoveredCountry = null;
let countries = [];

function preload() {
  
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  mioFont = loadFont("fonts/NeueHaasGrotDisp-55Roman.otf");
  mioFontMedium = loadFont("fonts/NeueHaasGrotDisp-65Medium.otf");
  mioFontBold = loadFont("fonts/NeueHaasGrotDisp-75Bold.otf");
}

//stessa cosa del dettaglio, metto una cosa per omologare
function normalizeCountryName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ""); // tiene solo lettere e numeri
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(14);
  textFont(mioFont)

  let seen = {}; // oggetto per evitare duplicati

  for (let i = 0; i < data.getRowCount(); i++) {
    let edition = data.getString(i, "Edition").trim();
    let country = data.getString(i, "Country/Territory").trim();

    if (edition === "2024" && !seen[country]) {
      countries.push({
        name: country,                       // nome leggibile
        slug: normalizeCountryName(country)  // chiave “pulita”
      });
      seen[country] = true;
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
      hoveredCountry = { ...countries[i], xPos, yPos }; // name + slug
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
    window.location.href =
      "detail.html?country=" + encodeURIComponent(hoveredCountry.slug);
  }
}


