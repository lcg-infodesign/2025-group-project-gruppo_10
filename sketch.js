let data;
let topPadding = 250;
let outerPadding = 10;
let padding = 10;
let itemSize = 30;
let hoveredCountry = null;
let countries = [];
let mioFont;
let mioFontBold;

function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  mioFont = loadFont("fonts/OpenSans-Regular.ttf");
  mioFontBold = loadFont("fonts/OpenSans-Bold.ttf");
}

// stessa cosa del dettaglio, funzione per normalizzare i nomi
function normalizeCountryName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ""); // tiene solo lettere e numeri
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(14);
  textFont(mioFont);

  let seen = {}; // per evitare duplicati (usiamo lo slug come chiave)

  for (let i = 0; i < data.getRowCount(); i++) {
    let country = data.getString(i, "Country/Territory").trim();
    let slug = normalizeCountryName(country);

    // 🔹 se vuoi filtrare solo un anno (es. 2025), decommenta queste righe:
    // let edition = data.getString(i, "Edition").trim();
    // if (edition !== "2025") continue;

    if (!seen[slug]) {
      countries.push({
        name: country, // nome leggibile da mostrare nel tooltip
        slug: slug     // slug normalizzato da passare nell'URL
      });
      seen[slug] = true;
    }
  }

  console.log("Paesi / territori trovati:", countries.length);
}

function draw() {
  background(220);
  drawGrid();
  drawTooltip();
}

function drawGrid() {
  let cols = floor((width - 2 * outerPadding) / (itemSize + padding));
  if (cols < 1) cols = 1;

  hoveredCountry = null;
  let colCount = 0;
  let rowCount = 0;

  noStroke();

  for (let i = 0; i < countries.length; i++) {
    let xPos = outerPadding + colCount * (itemSize + padding);
    let yPos = topPadding + rowCount * (itemSize + padding);

    // hitbox per hover
    if (
      mouseX > xPos && mouseX < xPos + itemSize &&
      mouseY > yPos && mouseY < yPos + itemSize
    ) {
      fill(180);
      hoveredCountry = { ...countries[i], xPos, yPos }; // aggiungo xPos, yPos per il tooltip
    } else {
      fill(200);
    }

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
    textFont(mioFont);
    textSize(14);
    text(
      hoveredCountry.name,
      hoveredCountry.xPos + 35,
      hoveredCountry.yPos + 15
    );
  }
}

function mousePressed() {
  if (hoveredCountry) {
    // vai alla pagina di dettaglio con lo slug come parametro
    window.location.href =
      "dettagliopallini.html?country=" +
      encodeURIComponent(hoveredCountry.slug);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
