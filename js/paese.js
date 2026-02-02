// Variabili globali
let data;

// Font
let fontRegular, fontMedium, fontBold;

// Icone
let iconaAboutUs, iconaAboutFh, iconaHome, iconaLente, iconaClose;
let iconaArrLeft; 
let btnBack, btnAboutFH, btnAboutUs;

// Responsiveness
let graficoWidth;
let annoWidth;
let BASE_W = 1280; // larghezza di riferimento 
let BASE_H = 665; // altezza di riferimento
let scaleFactor = 1; // fattore di scala corrente
let lastScaleFactor = -1; // per capire se la scala è cambiata
let logicalMouseX = 0; // mouse "nello spazio logico"
let logicalMouseY = 0;

let countrySlug = "";   // nome normalizzato senza maiuscole e spazi
let countryName = "";   // il nome leggibile che poi vogliamo scrivere nella pagina come titolo

// CREO UN ARRAY PER CONTENERE GLI ANNI 
let anniDisponibili = []; //array con tutti gli anni disponibili 
let annoSelezionato = "" //anno selezionionato 
let yearSelect; //oggetti select che appare 

// TOTAL SCORE
let punteggioTotale = 0; 

// TOTAL CATEGORIE [A,B,C,D,E,F,G]-->positivi
let totaliCategorie = [0,0,0,0,0,0,0,0];
let maxCategorie = [12, 16, 12, 4, 16, 12, 16, 16];

let questionColumns = [ // per ogni categoria mi associa le colonne del mio dataset che contengono i valori delle domande 
  ["Question A1", "Question A2", "Question A3"], // 0:A
  ["Question B1", "Question B2", "Question B3", "Question B4"], // 1:B
  ["Question C1", "Question C2", "Question C3"],  // 2:C
  ["Add A"],   //Add A 
  ["Question D1", "Question D2", "Question D3", "Question D4"], // 4:D
  ["Question E1", "Question E2", "Question E3"], // 5:E
  ["Question F1", "Question F2", "Question F3", "Question F4"], // 6:F
  ["Question G1", "Question G2", "Question G3", "Question G4"]  // 7:G
];

let questionScores = []; // contiene il punteggio da 0 a 4 di ciascuna Domanda 

// COLORI CATEGORIE 
let coloriCategorie = [];

// valore AddQ (positivo nel CSV, ma negativo nella realtà)
let addQVal = 0;
let addAVal = 0;
// info di tutti i pallini (per sapere coordinate e categoria)
let palliniInfo = [];
// per l'animazione di lampeggio
let animT = 0;
const diametroPallino = 48;

//VARIABILE HOVER PER CATEGORIA 
let hoveredCatIndex = null; 
//VARIABILE CATEGORIA CLICCATA 
let selectedCatIndex = null;

let legendHitAreas = []; // zone cliccabili della legenda
// variabili per selezionare l'anno
let datiFiltrati;
let scrollAccumulato = 0;
let pixelPerAnno = 200; // Quanti pixel di scroll per cambiare anno
let progressoScroll = 0; // Valore da 0 a 1 per l'animazione tra anni

coloriLegenda= {
  electoralProcess: "#D9D97A",
  politicalPluralism: "#6A8AA9",
  functioningGovernment: "#134a7b",
  addQ: "#C51A1A",
  addA: "#1f863fff", 
  freedomExpression: "#C47929",
  associationalRights: "#9C6EBF",
  ruleOfLaw: "#7fb6ce",
  personalAutonomy: "#C0655A"
}

const whiteHover = palette.bianco; //bianco solito

//VARIABILI PER REGOLARE MEGLIO L'HOVER 
let hoveredLegendCatIndex = null;
let hoveredPalliniCatIndex = null;

// Anni
let areeAnniGlobale = null;
let xPosAnniGlobale = 0;
let yPosAnniGlobale = 0;

//VARIABILI TITOLO (7 parametri)
let panelTitles = [
  "Electoral process",
  "Political pluralism and participation",
  "Functioning of government",
  "Additional Answer",
  "Freedom of expression and belief",
  "Associational and organizational rights",
  "Rule of Law",
  "Personal autonomy and individual rights",
  "Additional Discretionary Question B" 
];

//per  ogni categoria del mio array creo un array con le domande 
let panelQuestions = [
  [ //Electoral process
    "Was the current head of government or other chief national\nauthority elected through free and fair elections? ",
    "Were the current national legislative representatives elected\nthrough free and fair elections?",
    "Are the electoral laws and framework fair, and are they implemented\nimpartially by the relevant election management bodies? ",
  ],
  //Political pluralism and participation
  [
    "Do the people have the right to organize in different political parties or other\ncompetitivepolitical groupings of their choice, and is the system free of undue\nobstacles to the rise and fall of these competing parties or groupings?",
    "Is there a realistic opportunity for the opposition to increase\nits support or gain power through elections?",
    "Are the people's political choices free from domination\nby forces that are external to the political sphere,\nor by political forces that employ extrapolitical means?",
    "Do various segments of the population (including ethnic, racial,\nreligious, gender, LGBT+, and other relevant groups)\nhave full political rights and electoral opportunities?"
  ],
  // Functioning of government
  [
    "Do the freely elected head of government\nand national legislative representatives determine\nthe policies of the government?",
    "Are safeguards against official corruption strong and effective?",
    "Does the government operate with openness and transparency?",
  ],
  // Add A
  [
  "For traditional monarchies that have no parties or electoral process,\ndoes the system provide for genuine, meaningful consultation\nwith the people encourage public discussion of policy choices,\nand allow the right to petition the ruler?"
  ],
  // Freedom of expression and belief
  [
    "Are there free and independent media?",
    "Are individuals free to practice and express their religious faith\nor nonbelief in public and private?",
    "Is there academic freedom, and is the educational system free\nfrom extensive political indoctrination?",
    "Are individuals free to express their personal views on political\nor other sensitive topics without fear of surveillance or retribution?"
  ],
  // Associational and organizational rights
  [
    "Is there freedom of assembly?",
    "Is there freedom for nongovernmental organizations, particularly those\nthat are engaged in human rights -and governance- related work?",
    "Is there freedom for trade unions and similar\nprofessional or labor organizations?",
  ],
  // Rule of Law
  [
    "Is there an independent judiciary?",
    "Does due process prevail in civil and criminal matters?",
    "Is there protection from the illegitimate use of physical force\nand freedom from war and insurgencies?",
    "Do laws, policies, and practices guarantee equal treatment\nof various segments of the population?"
  ],
  // Personal autonomy and individual rights
  [
    "Do individuals enjoy freedom of movement, including the ability\nto change their place of residence, employment, or education?",
    "Are individuals able to exercise the right to own property and establish\nprivate businesses without undue interference\nfrom state or nonstate actors?",
    "Do individuals enjoy personal social freedoms, including choice\nof marriage partner and size of family, protection from domestic violence,\nand control over appearance?",
    "Do individuals enjoy equality of opportunity and freedom\nfrom economic exploitation?"
  ],
  //Additional Discretionary Question B
  [
    "Is the government or occupying power deliberately changing the ethnic\ncomposition of a country or territory so as to destroy a culture\nor tip the political balance in favor of another group?"
  ]
];

//VARIABILI OVERVIEWCHART
let overviewExpanded = false; // mini / fullscreen
let overviewBox = null; // area cliccabile
// dati per grafico overview (tutti gli anni del paese)
let countryData = [];
// paddind di Overview
let padding = 100;
let bottomPadding = 60;
let topPadding = 60;
let textPadding = 70;

// Variabili globali per il mini grafico
let overviewBaseW = 360;  
let overviewBaseH = 220;   
let overviewZoom = 1;    
let overviewMargin = 52;   
let overviewX, overviewY;

//colori status di Overview
let coloriStatus = {
  'F':  ["#c76351", "#d58d3e", "#26231d"],   // Free
  'PF': ["#e5c38f", "#cad181", "#26231d"],   // Partly Free
  'NF': ["#75a099", "#91a2a6", "#26231d"],   // Not Free
};

//status per targhetta
const statusLabels = {
  F:  "FREE",
  PF: "PARTIALLY FREE",
  NF: "NOT FREE"
};

//colore linea 0 per overviewnegativo
let lineColor = palette.bianco;
//toggle default
let viewMode = "overview"; // oppure "parameters"
// X per chiudere grafico extended
let overviewCloseBox = null;
//varuiabili per toggle grafico expanded
let toggleBox = null;
//parametri per il DotChart
let params = [
  "Total A",
  "Total B",
  "Total C",
  "Total D",
  "Total E",
  "Total F",
  "Total G",
  "Add A"
];

// Paragrafi cambio di status
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

let toggleLabelRect = null;

function preload() {
  data = loadTable("../assets/FH_dataset.csv", "csv", "header"); // caricamento del dataset (con header)
  // font
  fontRegular = loadFont("../font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("../font/NeueHaasDisplayMedium.ttf");
  fontBold = loadFont("../font/NeueHaasDisplayBold.ttf");
  // icone
  iconaAboutUs = loadImage("../img/icone/person.png");
  iconaAboutFh = loadImage("../img/icone/info.png");
  iconaArrLeft = loadImage("../img/icone/frecce/arrowleft.png");
  iconaClose = loadImage("../img/icone/close.png");
  iconaStar = loadImage("../img/icone/star.png");
}

function setup() {
   if (!iconaArrLeft || !iconaAboutFh || !iconaAboutUs) {
    console.error("Icone non caricate correttamente");
    return;
  }
  createCanvas(windowWidth, windowHeight);
  scaleFactor = min(windowWidth / BASE_W, windowHeight / BASE_H);

  graficoWidth = width * 0.9;
  annoWidth = width - graficoWidth;

  let urlParams = getURLParams();
  
  // DECODIFICA il parametro country
  let countryFromURL = urlParams.country || "";
  countrySlug = countryFromURL ? decodeURIComponent(countryFromURL) : "";
  countrySlug = normalizeCountryName(countrySlug);

  if (countrySlug === "") {
    countryName = "Nessun paese selezionato";
    console.warn("Parametro ?country mancante nell'URL");
    return; 
  }

  // cerco nel CSV la riga che ha lo stesso slug
  let found = false; 
  anniDisponibili = [];

  for (let i = 0; i < data.getRowCount(); i++) {
    let countryCSV = data.getString(i, "Country/Territory").trim();
    let csvSlug = normalizeCountryName(countryCSV);
    let edition = data.getString(i, "Edition").trim();

    if (csvSlug === countrySlug) {
      if (!found) {
        countryName = countryCSV;
        found = true;
      }
      if (!anniDisponibili.includes(edition)) {
        anniDisponibili.push(edition); 
      }
    }
  }

  // COSTRUISCO countryData PER OVERVIEW 
  countryData = [];

  for (let i = 0; i < data.getRowCount(); i++) {
  let countryCSV = data.getString(i, "Country/Territory").trim();
  let csvSlug = normalizeCountryName(countryCSV);

    if (csvSlug === countrySlug) {
    countryData.push({//modificato per permettergli di disegnare il DotChart
    year: data.getString(i, "Edition").trim(),

    // overview
    Total: parseFloat(data.getString(i, "TOTAL")) || 0,
    Status: data.getString(i, "Status").trim(),

    // parametri per dot chart
    "Total A": data.getNum(i, "Total A") || 0,
    "Total B": data.getNum(i, "Total B") || 0,
    "Total C": data.getNum(i, "Total C") || 0,
    "Total D": data.getNum(i, "Total D") || 0,
    "Total E": data.getNum(i, "Total E") || 0,
    "Total F": data.getNum(i, "Total F") || 0,
    "Total G": data.getNum(i, "Total G") || 0,

    // Add A e Add Q
    AddQ: parseFloat(data.getString(i, "Add Q")) || 0,
    AddA: parseFloat(data.getString(i, "Add A")) || 0,
    });
    }
  }
  
  if (!found) {
    countryName = "Paese non trovato (" + countrySlug + ")";
    console.warn("Nessun dato trovato per lo slug:", countrySlug);
    return; // IMPORTANTE: esci se non trovi il paese
  }
  
  // Leggi l'anno dall'URL
  let yearFromURL = urlParams.year || "";
  
  // SE HO TROVATO GLI ANNI
  if (anniDisponibili.length > 0) {
    anniDisponibili.sort((a, b) => int(b) - int(a));
    
    // Usa l'anno dall'URL se disponibile e valido
    if (yearFromURL && anniDisponibili.includes(yearFromURL)) {
      annoSelezionato = yearFromURL;
    } else {
      annoSelezionato = anniDisponibili[0];
    }

    // Calcola subito i punteggi
    aggiornaPunteggioTotale();

    // Crea il select per l'anno
    yearSelect = createSelect();
    yearSelect.selected(annoSelezionato);
    yearSelect.changed(() => {
      annoSelezionato = yearSelect.value();
      aggiornaPunteggioTotale();
    });
    yearIndex = anniDisponibili.indexOf(annoSelezionato);
  }

  // Bottoni
  btnBack = creaBottoneStandard(margine, margine, iconaArrLeft, () => window.history.back());
  btnAboutFH = creaBottoneStandard(width - diametro - margine, margine, iconaAboutFh, '../html/aboutFreedomHouse.html');
  btnAboutUs = creaBottoneStandard(width - (diametro * 2) - margine * 1.5, margine, iconaAboutUs, '../html/AboutUs.html');
}

function draw() {
  background(palette.nero);

  // titolo sempre visibile 
  drawTitle();

  // calcolo scala + mouse logico 
  scaleFactor = min(windowWidth / BASE_W, windowHeight / BASE_H);
  let translateX = (width - BASE_W * scaleFactor) / 2;
  let translateY = (height - BASE_H * scaleFactor) / 2;

  logicalMouseX = (mouseX - translateX) / scaleFactor;
  logicalMouseY = (mouseY - translateY) / scaleFactor;

  // DISEGNO CONTENUTO PRINCIPALE (in coordinate logiche) 
  push();
  translate(translateX, translateY);
  scale(scaleFactor);

  animT += 0.04;

  fill(palette.bianco);
  textFont(fontBold);

  drawPalliniGrigi();
  updateHoverCategory();
  checkLegendHover();
  drawAddQOverlay();
  drawSidePanel();
  drawTotalScore();

  pop();

  // MINI OVERVIEW: sparisce quando selezioni una pillola (selectedCatIndex != null)
  if (!overviewExpanded && selectedCatIndex === null) {
    drawOverviewMini();
  }

  // OVERVIEW EXPANDED (in coordinate schermo) 
  if (overviewExpanded) {
    // overlay su tutto lo schermo
    fill(palette.nero);
    noStroke();
    rect(0, 0, width, height);

    // box centrato e responsive
    const marginX = 80;
    const marginY = 80;
    overviewBox = {
      x: marginX-40,
      y: marginY+40,
      w: width - marginX * 2+90,
      h: height - marginY * 2
    };

    // sfondo box
    fill(palette.nero);
    stroke(palette.nero);
    rect(overviewBox.x, overviewBox.y, overviewBox.w, overviewBox.h, 30);

    drawOverviewExpanded();
    drawToggle();
    if (viewMode === "parameters") drawParamsLegendSmall();
    drawTitle();
    aggiornaVisibilitaPulsanti();
    drawOverviewCloseButton();
  }

  if (!overviewExpanded) {
  disegnaEtichettaAnno();
  aggiornaVisibilitaPulsanti();
}
}

function drawTitle(){
  push();
  fill(palette.bianco);
  noStroke();
  textSize(65);
  textFont(fontMedium);
  textAlign(LEFT, BOTTOM);
  text(countryName, margine*2+diametro, margine+diametro+10); 
  pop();
}

// LEGENDA 

function drawLegenda() {
  //COSTANTE ANNI --> per addA che compare solo fino al 2017
  const anno = int(annoSelezionato);
  const showAddA = (anno >= 2013 && anno <= 2017);

  //definisco delle costanti per la mia legenda 
  const x = 540;
  const y = 120;
  const w = 570;
  const h = 270;

  legendHitAreas = [];
  hoveredLegendCatIndex = null;
  
  //definsico un bordo 
  noFill();
  stroke(palette.bianco); 
  strokeWeight(1);
  rect(x, y, w, h, 30);
  noStroke();

  //inserisco un padding per separare scritte e bordo bianco 
  const padX = w * 0.04;  
  const padY = h * 0.18;  

  //definisco variabili per le colonne 
  const colGap = w * 0.04;
  const colW = (w - padX * 2 - colGap) / 2;

  const leftX  = x + padX;
  const rightX = x + padX + colW + colGap;
  const topY   = y + padY;

  //scrivo i titoli delle due categorie 
  fill(palette.bianco);
  noStroke();
  textFont(fontBold || fontRegular);
  textSize(18);
  textAlign(LEFT, BOTTOM);
  text("Political Rights", leftX,  y + padY - 10);
  text("Civil Liberties",  rightX, y + padY - 10);

//cambia gli a capo del mio testo quando cambi ail layout della legenda
const labelFunctioning = showAddA
  ? "Functioning of government"
  : "Functioning\nof government";

const labelPluralism = showAddA
? "Political pluralism and participation"
: "Political pluralism\nand participation";

const labelAddQ = showAddA
?"Additional Question: subtracts points"
: "Additional Question:\nsubtracts points";

  const leftItems = [
  { label: "Electoral Process", color: coloriLegenda.electoralProcess, addQ: false, catIndex: 0},
  { label: labelPluralism, color: coloriLegenda.politicalPluralism, addQ: false, catIndex: 1},
  { label: labelFunctioning, color: coloriLegenda.functioningGovernment, addQ: false, catIndex: 2},
  { label: labelAddQ, color: coloriLegenda.addQ, addQ: true, catIndex:8} // speciale: cerchio vuoto bordo rosso
];

//inserisco AddA solo per gli anni specifici 
if (showAddA) {
  leftItems.push({
    label: "Additional Answer:adds points over 100",
    color: coloriLegenda.addA,
    addQ: false,
    catIndex: 3
  });
}
const pillTextSize = showAddA ? 12 : 14;

const labelFreedom = showAddA 
? "Freedom of expression and belief"
: "Freedom of expression\nand belief";

const labelAss = showAddA 
? "Associational and organizational rights"
: "Associational and\norganizational rights";

const labelPersonal = showAddA
? "Personal autonomy and individual rights"
: "Personal autonomy\nand individual rights";

const rightItems = [
  { label: labelFreedom, color: coloriLegenda.freedomExpression, catIndex: 4},
  { label: labelAss, color: coloriLegenda.associationalRights, catIndex: 5},
  { label: "Rule of Law", color: coloriLegenda.ruleOfLaw, catIndex: 6 },
  { label: labelPersonal, color: coloriLegenda.personalAutonomy, catIndex: 7}
];

// definisco un numero di righe comune 
const rows = max(leftItems.length, rightItems.length);

// VARIABILI DELLE MIE PILLOLE 
  // quanto spazio verticale ho per le pillole (sotto i titoli)
  const bottomPad = h * 0.06;
  const availableH = (y + h) - bottomPad - topY;

  // spazio tra pillole --> dipende da AddA
  const pillGap = showAddA ? availableH * 0.03 : availableH * 0.05;

  // altezza pillola calcolata per far stare "rows" righe
  const pillH = (availableH - (rows - 1) * pillGap) / rows;
  const dotR     = pillH * 0.26;  
  const innerPad = pillH * 0.50; 

//PRIMA COLONNA 
//CICLO ripeti il mio codice per tutti gli elementi inseriti nella mia "cartella"
for (let i = 0; i < rows; i++) {
  const it = leftItems[i];
  if (!it) continue;   // se non esiste, non disegno nulla

  // posizione verticale della pillola i-esima
  //La pillola parte da topY e scende di un tot ogni volta
  let py = topY + i * (pillH + pillGap);
  let pillX = leftX;
  let pillY = py;

  let hoverByMouse = pointInRect(logicalMouseX, logicalMouseY, pillX, pillY, colW, pillH);
let hoverByPallini = (hoveredPalliniCatIndex !== null && hoveredPalliniCatIndex === it.catIndex);
let isHover = (selectedCatIndex === null) && (hoverByMouse || hoverByPallini);

legendHitAreas.push({ x: pillX, y: pillY, w: colW, h: pillH, catIndex: it.catIndex });
if (isHover) hoveredLegendCatIndex = it.catIndex;

  //SCALA IN HOVER ingrandendo un pochetto 
  let scaleHover = isHover ? 1.08 : 1; // ← quanto cresce (1.05–1.1 va benissimo)
  // centro della pillola
  let cx = pillX + colW / 2;
  let cy = pillY + pillH / 2;

  //hover solo se non c'è selezione 
push();
translate(cx, cy);
scale(scaleHover);
translate(-cx, -cy);

if (isHover) {
  fill(whiteHover);
  stroke(whiteHover);
} else {
  noFill();
  stroke(palette.bianco);
}
strokeWeight(1);
rect(pillX, pillY, colW, pillH, pillH * 0.45);
noStroke();

  // coordinate icona
   let iconX = pillX + innerPad;
  let iconY = pillY + pillH / 2;

  // ICONE:
  if (it.addQ) {
    // AddQ: cerchio vuoto con SOLO bordo rosso
    noFill();
    stroke(it.color);
    strokeWeight(4);
    circle(iconX, iconY, dotR * 2);
    noStroke();
  } else {
    // tutte le altre: cerchio pieno
    fill(it.color);
    noStroke();
    circle(iconX, iconY, dotR * 2);
  }

  // TESTO
  fill(isHover ? palette.nero : palette.bianco);
  
  textFont(fontRegular);
  textSize(pillTextSize);
  textLeading(14);
  textAlign(LEFT, CENTER);

  let textX = pillX + innerPad + dotR * 2.2;
  text(it.label, textX, iconY);

  pop();
}
//SECONDA COLONNA, STESSO CICLO FOR 
for (let i = 0; i < rows; i++) {
  const it = rightItems[i];
  if (!it) continue;

  let py = topY + i * (pillH + pillGap);
  let pillX = rightX;
  let pillY = py;

  let hoverByMouse = pointInRect(logicalMouseX, logicalMouseY, pillX, pillY, colW, pillH);
let hoverByPallini = (hoveredPalliniCatIndex !== null && hoveredPalliniCatIndex === it.catIndex);
let isHover = (selectedCatIndex === null) && (hoverByMouse || hoverByPallini);
  legendHitAreas.push({ x: pillX, y: pillY, w: colW, h: pillH, catIndex: it.catIndex });

  if (isHover) hoveredLegendCatIndex = it.catIndex;
let scaleHover = isHover ? 1.08 : 1;

let cx = pillX + colW / 2;
let cy = pillY + pillH / 2;

push();
translate(cx, cy);
scale(scaleHover);
translate(-cx, -cy);

if (isHover) {
  fill(whiteHover);
  stroke(whiteHover);
} else {
  noFill();
  stroke(palette.bianco);
}
strokeWeight(1);
rect(pillX, pillY, colW, pillH, pillH * 0.45);
noStroke();

  let iconX = pillX + innerPad;
  let iconY = pillY + pillH / 2;

  fill(it.color);
  noStroke();
  circle(iconX, iconY, dotR * 2);

  fill(isHover ? palette.nero : palette.bianco);
  textFont(fontRegular);
  textSize(pillTextSize);
  textLeading(14);
  textAlign(LEFT, CENTER);

  let textX = pillX + innerPad + dotR * 2.2;
  text(it.label, textX, iconY);

  pop();
}
}

function checkLegendHover() {
  if (selectedCatIndex !== null) return;
  let mx = logicalMouseX;
  let my = logicalMouseY;
  
  for (let area of legendHitAreas) {
    if (mx >= area.x && mx <= area.x + area.w && my >= area.y && my <= area.y + area.h) {
      cursor(HAND);
      return;
    }
  }
}
 
function drawSidePanel() {
  if (selectedCatIndex === null) {
    // stato normale → legenda
    backDetailArea = null;
    drawLegenda();
  } else {

    // stato dettaglio → cursore normale OVUNQUE
    cursor(ARROW);
    drawCategoryPanel(selectedCatIndex);
  }
}

function drawCategoryPanel(catIndex) {
// BLOCCO CONFIGURAZIONE BASE (stile legenda)
  let x0 = 540; 
  let y0 = 120; 
  let w  = 570; 
  let r  = 30;

  // padding interni
  let paddingLeft   = 24;
  let paddingRight  = 24;
  let paddingBottom = 20;

  // layout “header” identico alla legenda
  const padY = 270 * 0.18;  
  const headerBaselineY = y0 + padY - 10; 

  // tipografia domande
  let lineHeight = 18; 
  let textSizeQ  = 14;

  // distanza tra header e inizio contenuto
  let gapAfterTitle = 22;
  let gapBetweenQuestions = 14;  

  // pallini
  let palliniOffset  = 100;
  let palliniRaggio  = 8;
  let palliniSpazio  = 18;

  // contenuti
  let titolo = panelTitles[catIndex] || "Category details";
  let questions = panelQuestions[catIndex] || [];

  // BLOCCO CALCOLO ALTEZZA DINAMICA (h cambia con le domande)
  let totalLines = 0;
  for (let q of questions) {
    totalLines += q.split("\n").length;
  }

  let questionsTextH = totalLines * lineHeight;
  let gapsH = max(0, questions.length - 1) * gapBetweenQuestions;

  let contentTop = headerBaselineY + gapAfterTitle;

  let h = (contentTop - y0) + questionsTextH + gapsH + paddingBottom; 

  // BOX
  noFill();
  stroke(palette.bianco);
  strokeWeight(1);
  rect(x0, y0, w, h, r);
  noStroke();

  // TITOLO (stesso stile e posizione della legenda)
  fill(palette.bianco);
  noStroke();
  textFont(fontBold);
  textSize(18);
  textAlign(LEFT, BOTTOM);
  text(titolo, x0 + paddingLeft, headerBaselineY);

 // BLOCCO BOTTONE CLOSE (immagine, allineata bene)
  let btnSize = 46; 
  let closePad = 18;

  // posizione: ancorata all'angolo alto-destro del BOX
  let xBtn = x0 + w - closePad - btnSize+5;
  let yBtn = y0 + closePad-10;

  // area cliccabile (un po' più grande dell'icona)
  backDetailArea = {
    x: xBtn - 8,
    y: yBtn - 8,
    w: btnSize + 16,
    h: btnSize + 16
  };

  // hover
  let hoverClose = pointInRect(
    logicalMouseX, logicalMouseY,
    backDetailArea.x, backDetailArea.y, backDetailArea.w, backDetailArea.h
  );

  // cursore: torna normale di default, mano solo sulla X
  if (hoverClose) cursor(HAND);

  // scale hover
  let hoverScale = hoverClose ? 1.12 : 1.0;
  let drawSize = btnSize * hoverScale;

  // centra il disegno quando cresce (così NON si sposta)
  let dx = (drawSize - btnSize) / 2;
  let dy = (drawSize - btnSize) / 2;

  imageMode(CORNER);
  image(iconaClose, xBtn - dx, yBtn - dy, drawSize, drawSize);

  // BLOCCO DISEGNO DOMANDE + PALLINI (pallini sulla prima riga)
  textFont(fontRegular);
  textSize(textSizeQ);
  fill(palette.bianco);
  noStroke();
  textAlign(LEFT, TOP);

  let palliniStartX = x0 + paddingLeft;
  let textX = x0 + palliniOffset;
  let currentY = contentTop;

  for (let qi = 0; qi < questions.length; qi++) {
    let q = questions[qi];
    // punteggio
    let score = 0;
    if (catIndex === 8) {
      score = int(constrain(addQVal, 0, 4));
    } else if (questionScores[catIndex]) {
      score = int(constrain(questionScores[catIndex][qi] || 0, 0, 4));
    }

    // righe della domanda
    let righe = q.split("\n");

    // PALLINI ALLINEATI ALLA PRIMA RIGA
    let palliniY0 = currentY + lineHeight / 2 ;

    // disegno pallini
    for (let i = 0; i < 4; i++) {
      if (i < score) {
        if (catIndex === 8) {
          fill("#C51A1A");
        } else {
          let c = color(coloriCategorie[catIndex]);
          c.setAlpha(255);
          fill(c);
        }
      } else {
        fill(palette.grigio);
      }

      let px = palliniStartX + i * palliniSpazio +6 ;
      circle(px, palliniY0 -3, palliniRaggio * 2);
    }
    // testo (tutte le righe)
    fill(palette.bianco);
    for (let riga of righe) {
      text(riga, textX, currentY);
      currentY += lineHeight;
    }
    currentY += gapBetweenQuestions; 
  }

drawCategoryScore(catIndex);
}

function updateHoverCategory() {
  if (selectedCatIndex !== null) {
    hoveredPalliniCatIndex = null;
    return;
  }
 //se non c'è nessuna seleione attiva, per dafaul metti nessuna categoria in hover 
  hoveredPalliniCatIndex = null;

  // hover sui pallini positivi
  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      let d = dist(logicalMouseX, logicalMouseY, p.x, p.y);
      if (d < diametroPallino / 2) {
        hoveredPalliniCatIndex = p.catIndex;
        break;
      }
    }
  }

  // se non ho hover sui positivi, controllo i negativi (AddQ = 8)
  if (hoveredPalliniCatIndex === null) {
    for (let p of palliniInfo) {
      if (p.type === "neg") {
        let d = dist(logicalMouseX, logicalMouseY, p.x, p.y);
        if (d < diametroPallino / 2) {
          hoveredPalliniCatIndex = 8;
          break;
        }
      }
    }
  }

  // hover “globale” = legenda ha priorità sui pallini
  hoveredCatIndex = (hoveredLegendCatIndex !== null) ? hoveredLegendCatIndex : hoveredPalliniCatIndex;

  // cursore
  if (hoveredCatIndex !== null) cursor(HAND);
  else cursor(ARROW);
}

// GRIGLIA

function drawPalliniGrigi(){
    let pallini = 100; //definisco il numero dei pallini 
    let colonne = 10; //numero colonne 
    let righeQuadrato = 10; //numero righe 

    let diametro = diametroPallino; //diametro di ogni pallino 
    let spazio = 1; //spazio vuoto tra due pallini 

    let grigliaLarghezza = colonne*diametro + (colonne-1)*spazio; //calcolo la larghezza che occuperanno i pallini 
    let grigliaAltezza = righeQuadrato*diametro + (righeQuadrato-1)*spazio; //calcolo l'altezza occupata 

    let startX = 60;
    let startY = 140; 

    palliniInfo = [];

  coloriCategorie = [
    color("#D9D97A"),// A
    color("#6A8AA9"),// B
    color( "#134a7b"),// C
    color("#1f863fff"), // 3: Add A  
    color("#C47929"),// D
    color("#9C6EBF"),// E
    color("#7fb6ce"),// F
    color("#C0655A")   // G
  ];
    noStroke();

    let indicePallino = 0; //parto dal basso a sinistra 

    // se c'è una categoria selezionata uso quella, altrimenti uso l'hover
    let activeCatIndex = (selectedCatIndex !== null) ? selectedCatIndex : hoveredCatIndex;
    let hasActive = (activeCatIndex !== null);

    //ciclo che genera i pallini 
    for (let r=0; r<righeQuadrato; r++) { //indice di riga
      for(let c=0; c<colonne; c++) { //indice di colonna
        let x = startX + c*(diametro+spazio);
        let y = startY + (righeQuadrato - 1 - r) * (diametro + spazio);

        let catIndex = categoriaPerIndice(indicePallino);
        let rCerchio = diametroPallino;  // niente hover di grandezza

      if (catIndex === null) { // nessuna categoria: pallino palette.grigio
        fill(palette.grigio);
      } else { // c'è una categoria, quindi pallini colorati
        let baseCol = coloriCategorie[catIndex];
        let cCol = color(baseCol);

        // se esiste una categoria "attiva" (hover o click) e questo pallino NON è di quella categoria --> lo spengo
        if (hasActive && catIndex !== activeCatIndex) {
          cCol.setAlpha(90); 
        } else {
          cCol.setAlpha(255);
        }
        fill(cCol);
      }
      noStroke();
      circle(x, y, rCerchio);

      palliniInfo.push({ //salvo tutte le info legate al pallino
        index: indicePallino,
        x: x,
        y: y,
        catIndex: catIndex,
        type: "pos" 
      });

      indicePallino++; 
    }
  } 
//LINEA DEI PUNTEGGI NEGATIVI inserita solo quando il punteggio totale è negativo 
if(punteggioTotale<0) {
    
//inserisco la LINEA BIANCA di separazione 
let lineY = startY + grigliaAltezza -20;
stroke(palette.bianco);
strokeWeight(2);
line(30,lineY, 60+grigliaLarghezza,lineY);

//scritta 0
noStroke();
fill(palette.bianco);
textAlign(LEFT,CENTER);
textSize(18);
text("0",15,lineY-3);

//10 PALLINI NEGATIVI 
let distanzaLineaPallini = 27;  
let yExtra = lineY + distanzaLineaPallini; 

fill(palette.grigio);
noStroke();

for (let c = 0; c < colonne; c++) {
  let x = startX + c * (diametro + spazio);
  
  circle(x, yExtra, diametroPallino);
  //faccio la stessa cosa di prima, associo pallino a degli elementi fissi per riconoscerlo 
  //gli associo le sue caratteristiche 
  palliniInfo.push({
    index: indicePallino,
    x: x,
    y: yExtra,
    catIndex: null,
    type: "neg"   
  });
indicePallino++;
  }
};
}

function drawAddQOverlay() {
  let n = int(addQVal);   //valore addQ convertito con int in intero per sicurezza
  if (n <= 0) return;  // se è zero o negativo, non faccio nulla

  // political rights: sono le prime tre categorie, da 0 a 2
  let maxCatPR = 2;

  //ANIMAZIONE 
  let alphaInner = map(cos(animT), -1, 1, 0, 255);
  let colpiti = 0; //quanti pallini fanno questa cosa?
  let targets = [];

  // prendo gli ULTIMI pallini colorati
  let colored = [];
  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      colored.push(p);
    }
  }
  colored.sort((a, b) => a.index - b.index);

  for (let i = colored.length - 1; i >= 0 && targets.length < n; i--) {
    targets.push(colored[i]);
  }

  //Negativi (sotto la linea)
  for (let p of palliniInfo) {
  if (p.type === "neg") {
    targets.push(p);
    }
  }

  for (let p of targets) {
    if (colpiti >= n) break; 
   let rCerchio = diametroPallino;
    
    noStroke();
    fill(palette.grigio);
    circle(p.x, p.y, rCerchio);

    //INTERNO di un pallino con bordo rosso 
   if (p.type === "pos" && p.catIndex !== null) {
    // pallino positivo: recupero il colore della categoria
    let baseCol = coloriCategorie[p.catIndex];
    let c = color(baseCol);   
    c.setAlpha(alphaInner);  
    fill(c);
    c.setAlpha(alphaInner);

    noStroke();
    fill(c);
    circle(p.x, p.y, rCerchio);
  } else if (p.type === "neg") {
    let c = color("#C51A1A");
    noStroke();
    fill(c);
    circle(p.x, p.y, rCerchio);
  }

  //BORDO ROSSO FISSO
  noFill(); //vuoto
  stroke(197, 26, 26);
  strokeWeight(5);
  circle(p.x, p.y, rCerchio );
  colpiti++;
}
noStroke();
}

// FUNZIONI GRAFICHE

function drawTotalScore() {
const x = 540;
  const y = 120;
  const w = 570;
  const h = 270;
const scoreRightX = x + w * 0.32;  
const scoreBaseY  = y + h + 170;  

//  testo e "numero cifre"
const scoreVal = int(punteggioTotale);
const scoreStr = str(scoreVal);
const digits = str(abs(scoreVal)).length;

let bigSize, slashDY, slashDX, labelDY1, labelDY2;

if (digits === 1) {
  bigSize  = 140;   
  slashDX  = 10;   
  slashDY  = 0.52; 
  labelDY1 = 0.2; 
  labelDY2 = 0.30;  
} else if (digits === 2) {
  bigSize  = 140;
  slashDX  = 10;
  slashDY  = 0.52;
  labelDY1 = 0.2;
  labelDY2 = 0.30;
} else { 
  bigSize  = 110;   
  slashDX  = 6;     
  slashDY  = 0.49; 
  labelDY1 = 0.255;  
  labelDY2 = 0.382;
}

push();
fill(palette.bianco);
noStroke();

// NUMERO GRANDE (allineato a destra)
textFont(fontMedium);
textSize(bigSize);
textAlign(RIGHT, BASELINE);
text(scoreStr, scoreRightX, scoreBaseY);

// /100 (in alto a destra del numero)
textFont(fontRegular);
textSize(26);
textAlign(LEFT, BASELINE);

const slashX = scoreRightX + slashDX;
const slashY = scoreBaseY - bigSize * slashDY;
text("/100", slashX, slashY);

// LABELS sotto
textAlign(RIGHT, BASELINE);
textFont(fontBold);
textSize(16);
text("TOTAL SCORE", scoreRightX, scoreBaseY + bigSize * labelDY1);
textFont(fontRegular);
textSize(14);
text("IN " + annoSelezionato, scoreRightX, scoreBaseY + bigSize * labelDY2);
pop();
}

function drawCategoryScore(catIndex) {
  // POSIZIONE (stesso riferimento di drawTotalScore) 
  const x = 540;
  const y = 120;
  const w = 570;
  const hLegend = 270;

  // stessa base del total score
  const scoreBaseY = y + hLegend + 170;

  // POSIZIONE ORIZZONTALE DEL BLOCCO CATEGORIA (MANOPOLA)
  const catRightX = x + w * 0.78;

  // PRENDO VALORE + MASSIMO 
  let val = 0;
  let maxVal = 0;

  // categorie 0..7
  if (catIndex >= 0 && catIndex <= 7) {
    val = int(totaliCategorie[catIndex] || 0);
    maxVal = int(maxCategorie[catIndex] || 0);
  }

  // AddQ (indice 8) -> scala 0..4
  if (catIndex === 8) {
    val = int(constrain(addQVal, 0, 4));
    maxVal = 4;
  }

  // COLORE (numero grande in colore categoria) 
  let numCol;
  if (catIndex === 8) {
    numCol = color("#C51A1A");
  } else {
    numCol = color(coloriCategorie[catIndex]);
  }

  // LAYOUT DINAMICO
  const digits = str(abs(val)).length;
  let bigSize, slashDY, slashDX, labelDY1, labelDY2;

  if (digits === 1) {
    bigSize  = 140;
    slashDX  = 10;
    slashDY  = 0.52;
    labelDY1 = 0.20;
    labelDY2 = 0.30;
  } else if (digits === 2) {
    bigSize  = 140;
    slashDX  = 10;
    slashDY  = 0.52;
    labelDY1 = 0.20;
    labelDY2 = 0.30;
  } else {
    bigSize  = 110;
    slashDX  = 6;
    slashDY  = 0.49;
    labelDY1 = 0.255;
    labelDY2 = 0.382;
  }

  // DISEGNO
  push();
  noStroke();

  // NUMERO GRANDE (colorato)
  fill(numCol);
  textFont(fontMedium || fontBold);
  textSize(bigSize);
  textAlign(RIGHT, BASELINE);
  text(str(val), catRightX, scoreBaseY);

  // "/max" (bianco)
  fill(palette.bianco);
  textFont(fontRegular);
  textSize(26);
  textAlign(LEFT, BASELINE);

  const slashX = catRightX + slashDX;
  const slashY = scoreBaseY - bigSize * slashDY;
  text("/" + str(maxVal), slashX, slashY);

  // LABELS sotto (bianco, come total score)
  textAlign(RIGHT, BASELINE);
  textFont(fontBold);
  textSize(16);
  text("CATEGORY SCORE", catRightX, scoreBaseY + bigSize * labelDY1);
  textFont(fontRegular);
  textSize(14);
  text("IN " + annoSelezionato, catRightX, scoreBaseY + bigSize * labelDY2);
  pop();
}

function aggiornaPunteggioTotale(){ //e anche categorie 
  punteggioTotale = 0; 

  for (let i=0; i<data.getRowCount(); i++){
    let countryCSV = data.getString(i,"Country/Territory").trim();
    let csvSlug = normalizeCountryName(countryCSV);
    let edition = data.getString(i,"Edition").trim();

    // stesso paese + stesso anno
    if (csvSlug === countrySlug && edition === annoSelezionato) {
      punteggioTotale = data.getNum(i, "TOTAL");  
      
      totaliCategorie[0] = data.getNum(i, "Total A");
      totaliCategorie[1] = data.getNum(i, "Total B");
      totaliCategorie[2] = data.getNum(i, "Total C");

      // leggo Add A come stringa
      let addAStr = data.getString(i, "Add A").trim();
      // se è vuoto o N/A --> lo considero 0
      if (addAStr === "" || addAStr.toUpperCase() === "N/A") {
      addAVal = 0;
      } else {
      addAVal = float(addAStr);   // converto a numero
      if (isNaN(addAVal)) addAVal = 0;
      }
      totaliCategorie[3] = addAVal;

      totaliCategorie[4] = data.getNum(i, "Total D");
      totaliCategorie[5] = data.getNum(i, "Total E");
      totaliCategorie[6] = data.getNum(i, "Total F");
      totaliCategorie[7] = data.getNum(i, "Total G");

      //leggo anche la domanda aggiuntiva 
      // leggo Add Q come stringa
      let addQStr = data.getString(i, "Add Q").trim();

      // se è vuoto o N/A --> 0
      if (addQStr === "" || addQStr.toUpperCase() === "N/A") {
      addQVal = 0;
      } else {
      addQVal = float(addQStr);
      if (isNaN(addQVal)) addQVal = 0;
      }

      //AGGIUNGO CHE OLTRE AI TOTALI LEGGO ANCHE I PUNTEGGI DELLE SINGOLE DOMANDE 
       questionScores = []; // svuoto
         for (let k = 0; k < questionColumns.length; k++) { //scorriamo tutte le categorie 
        let cols = questionColumns[k]; //cols è l'elenco dei nomi di colonna CSV
        questionScores[k] = []; //array che conterrà i punteggi delle domande in quella categoria 

      if (!cols) continue; //se cols è vuoto, quella categoria non ha domande, vado avanti 

        for (let q = 0; q < cols.length; q++) {
          let colName = cols[q]; //nome colonna (Question A)
          let valStr = data.getString(i, colName).trim(); //prende la stringa del CSV 

          let val;
          if (valStr === "" || valStr.toUpperCase() === "N/A") { //se è vuota o ha scritte strane prende 0
            val = 0;
          } else {
            val = float(valStr); //converte in numero 
            if (isNaN(val)) val = 0;
          }

          questionScores[k][q] = val; // memorizza il punteggio 
        }
      }

      break; // mi fermo: ho trovato la riga giusta
    }
  }
};

function categoriaPerIndice(indicePallino) {
  let somma = 0;//variabile somma, terrà la somma dei pallini precedenti (pallini già usati fino ad ora)

  for (let k = 0; k < totaliCategorie.length; k++) { //ciclo for per le 7 categorie
    let puntiCat = int(totaliCategorie[k]); // mi assicuro che sia intero e positivo
    if (puntiCat < 0) puntiCat = 0; //per ora considero solo i +, se è negativo lo fisso a 0


    //se l'indice è dentro l'intervallo di quella categoria 
    if (indicePallino <somma+puntiCat){ //somma pallini già usati, puntiCat pallini di questa categoria 
      return k;
    }
    somma+=puntiCat;//altrimenti passa alla categoria successiva 
}
return null;
};

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

function totaleNegativo() {
  for (let d of countryData) {
    if (d.Total < 0) return true;
  }
  return false;
}

function drawOverviewChart(area, data) {

  //  PADDING INTERNI AL RIQUADRO 
  const padL = 60;
  const padR = 40;
  const padT = 40;
  const padB = 80;

  const chartW = area.w - padL - padR;
  const chartH = area.h - padT - padB;

  // baseline (zero)
  const yBase = padT + chartH;

  //layout base
  const baseBarW = 14;
  const baseSpacing = 74;
  const baseRows = 50;
  const baseTotalHeight = baseRows * 12;

  const nYears = max(data.length, 1);

  const scaleX = chartW / (baseSpacing * nYears);
  const scaleY = chartH / baseTotalHeight;
  const scale = min(scaleX, scaleY);

  const barW = baseBarW * scale;
  const spacing = baseSpacing * scale;
  const totalHeight = baseTotalHeight * scale;
  const dotSize = 12 * scale;

  let xStart = padL;

  // LINEE ORIZZONTALI DI GRIGLIA (ogni 20)
  const xLineStart = padL;
  const xLineEnd = padL + spacing * (nYears - 1) + barW;
  
  stroke(palette.bianco);
  strokeWeight(0.5);
  
  for (let t = 0; t <= 100; t += 20) {
    const ty = map(t, 0, 100, 0, totalHeight);
    line(xLineStart, yBase - ty, xLineEnd, yBase - ty);
  }

  // asse y (numeri ogni 20, allineati con le linee)
  textFont(fontRegular);
  textSize(10);
  fill(palette.bianco);
  noStroke();

  for (let t = 0; t <= 100; t += 20) {
    const ty = map(t, 0, 100, 0, totalHeight);
    textAlign(RIGHT, CENTER);
    text(t, padL - 25, yBase - ty);
  }

  // barre
  for (let d of data) {

    const h = map(d.Total, 0, 100, 0, totalHeight);
    const colori = coloriStatus[d.Status] || ["#888", "#888", "#888"];

    drawingContext.fillStyle = creaGradiente(
      xStart,
      yBase - h,
      yBase,
      barW,
      colori
    );

    noStroke();
    rect(xStart, yBase - h, barW, h);

    // pallino
    fill(240);
    circle(xStart + barW / 2, yBase - h, dotSize * 1.6);

    // anno
    push();
    translate(xStart + barW / 2-1, yBase + 40);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(palette.bianco);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }
}

function drawOverviewChartNegative(area, data) {

  //  PADDING INTERNI AL RIQUADRO 
  const padL = 60;
  const padR = 40;
  const padT = 50;
  const padB = 80;

  const chartW = area.w - padL - padR;
  const chartH = area.h - padT - padB;

  //  layout base 
  const baseBarW = 14;
  const baseSpacing = 74;
  const baseRows = 50;
  const baseTotalHeight = baseRows * 12;

  const nYears = max(data.length, 1);

  const scaleX = chartW / (baseSpacing * nYears);
  const scaleY = chartH / baseTotalHeight;
  const scale  = min(scaleX, scaleY);

  const barW = baseBarW * scale;
  const spacing = baseSpacing * scale;
  const totalHeight = baseTotalHeight * scale;
  const dotSize = 12 * scale;

  let xStart = padL;

  // asse y 0
  const yZero = padT + chartH - 60;

  // LINEE ORIZZONTALI DI GRIGLIA (ogni 20 per valori positivi)
  const xLineStart = padL;
  const xLineEnd = padL + spacing * (nYears - 1) + barW;
  
  stroke(palette.bianco);
  strokeWeight(0.5);
  
  for (let t = 0; t <= 80; t += 20) {
    const ty = map(t, 0, 100, 0, totalHeight);
    line(xLineStart, yZero - ty, xLineEnd, yZero - ty);
  }

  // asse y (numeri ogni 20, allineati con le linee)
  textFont(fontRegular);
  textSize(10);
  fill(palette.bianco);
  noStroke();
  textAlign(RIGHT, CENTER);

  // valori positivi sopra lo zero (0, 20, 40, 60, 80)
  for (let t = 0; t <= 80; t += 20) {
    const ty = map(t, 0, 100, 0, totalHeight);
    text(t, padL - 25, yZero - ty);
  }

  // valore negativo sotto lo zero
  text("-10", padL - 25, yZero + totalHeight * 0.12);

  // linea 0 (più spessa)
  stroke(lineColor);
  strokeWeight(2);
  line(
    xLineStart,
    yZero,
    xLineEnd,
    yZero
  );

  //  BARRE 
  for (let d of data) {

    const value = d.Total;
    const absH  = map(abs(value), 0, 100, 0, totalHeight);
    const colori = coloriStatus[d.Status] || ["#888", "#888", "#888"];

    if (value >= 0) {
      // positivo
      drawingContext.fillStyle = creaGradiente(
        xStart,
        yZero - absH,
        yZero,
        barW,
        colori
      );

      noStroke();
      rect(xStart, yZero - absH, barW, absH);

      fill(240);
      circle(xStart + barW / 2, yZero - absH, dotSize * 1.6);

    } else {
      // -- NEGATIVO (sotto lo zero)
      drawingContext.fillStyle = creaGradiente(
        xStart,
        yZero,
        yZero + absH,
        barW,
        colori
      );

      noStroke();
      rect(xStart, yZero, barW, absH);

      fill(240);
      circle(xStart + barW / 2, yZero + absH, dotSize * 1.6);
    }

    //  ANNO 
    push();
    translate(xStart + barW / 2, padT + chartH + 35);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(palette.bianco);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }
}

//MOSTARE CONTEXT INS SOLO QUANDO LO STATO HA UN CONTEXT INS
function hasContextInsight() {
  let key = normalizeCountryName(countryName);
  let testo = countryTexts[key] || "";
  return testo.trim().length > 0;
}

// FUNZIONE PER NORMALIZZARE I NOMI 
function normalizeCountryName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ""); // tiene solo lettere e numeri
}

// GRAFICO PICCOLO

function drawOverviewMini() {
  // Ordina i dati per anno
  let chartData = countryData.slice().sort((a,b) => int(a.year) - int(b.year));

  // Se è expanded, la mini non viene mostrata
  if (overviewExpanded) return;

  let isNegative = overviewNegative();

  // Calcola larghezza/altezza responsive in base alla finestra
  const w = overviewBaseW * overviewZoom - 20;
  const h = overviewBaseH * overviewZoom;

  // COORDINATE DELLA LEGENDA (in coordinate logiche)
  const legendX = 540;
  const legendW = 570;
  const legendRightEdge = legendX + legendW;

  // COORDINATE GRIGLIA PALLINI (in coordinate logiche)
  const grigliaStartY = 140;
  const grigliaRows = 10;
  const diametro = diametroPallino;
  const spazio = 1;
  const grigliaAltezza = grigliaRows * diametro + (grigliaRows - 1) * spazio;
  const grigliaBottomEdge = grigliaStartY + grigliaAltezza;

  // Calcolo offset di traslazione (come nel draw)
  let translateX = (width - BASE_W * scaleFactor) / 2;
  let translateY = (height - BASE_H * scaleFactor) / 2 + 20;

  // POSIZIONA IL BOX (converti da coordinate logiche a schermo):
  overviewX = (legendRightEdge - w / scaleFactor) * scaleFactor + translateX;
  overviewY = (grigliaBottomEdge - h / scaleFactor - 35) * scaleFactor + translateY;
  
  overviewBox = { x: overviewX, y: overviewY, w, h };

  // VERIFICA HOVER su tutto il box
  const isHoveringBox = 
    mouseX >= overviewX && 
    mouseX <= overviewX + w && 
    mouseY >= overviewY - 10 && 
    mouseY <= overviewY + h + 25;

  // Cursore manina se hover
  if (isHoveringBox) {
    cursor(HAND);
  }

  // Scale per hover
  const hoverScale = isHoveringBox ? 1.03 : 1;

  // Centro del box per lo scaling
  const centerX = overviewX + w / 2;
  const centerY = overviewY + h / 2;

  // APPLICA SCALING A TUTTO IL BOX
  push();
  translate(centerX, centerY);
  scale(hoverScale);
  translate(-centerX, -centerY);

  // Disegna il rettangolo di background
  strokeWeight(1.5);
  stroke(palette.bianco);
  fill(palette.nero);
  rect(overviewX, overviewY - 10, w, h + 35, 20);

  // ICONA PIÙ (+) in alto a destra
  const plusSize = 20;
  const plusPad = 15;
  const plusX = overviewX + w - plusPad - plusSize / 2;
  const plusY = overviewY + plusPad;

  push();
  stroke(palette.bianco);
  strokeWeight(2);
  noFill();
  
  // Linea orizzontale del +
  line(plusX - plusSize / 2, plusY, plusX + plusSize / 2, plusY);
  
  // Linea verticale del +
  line(plusX, plusY - plusSize / 2, plusX, plusY + plusSize / 2);
  
  pop();

  // TESTO "View Years Overview" allineato a sinistra
  fill(palette.bianco);
  noStroke();
  textFont(fontMedium);
  textSize(18);
  textAlign(LEFT, CENTER);
  
  text("Click to view Years Overview", overviewX + plusPad, plusY);

  // Label "Context Insight" FUORI DAL BOX (dopo il pop dello scaling)
  if (hasContextInsight()) {
    push();
    fill(palette.bianco);
    noStroke();
    textFont(fontRegular);
    textSize(14);
    textAlign(LEFT, CENTER);

    const labelX = overviewBox.x + 15;
    const labelY = overviewBox.y + h + 45;

    const starSize = 26;
    imageMode(CENTER);
    image(iconaStar, labelX + starSize / 2 - 5, labelY, starSize, starSize);

    text("Context Insight", labelX + starSize / 2 + 15, labelY);
    pop();
  }

  // SCALING PER IL GRAFICO
  const sx = w / width;
  const sy = h / height;
  const innerYOffset = -10;

  push();
  translate(
    overviewX + (w - width * sx) / 2,
    overviewY + (h - height * sy) / 2 + innerYOffset
  );
  scale(sx, sy);

  // Disegna il grafico mini corretto
  if (isNegative) {
    drawOverviewChartMiniNegative(chartData);
  } else {
    drawOverviewChartMini(chartData);
  }
  pop();

  pop();
}

function drawOverviewChartMini(data) {
  // layout base con barre più larghe
  let baseBarW = 28;
  let baseDotSize = 12;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize) * baseRows;
  let baseSpacing = 110;

  let yBase = height - bottomPadding;

  let availableHeight = height - bottomPadding - topPadding;
  let availableWidth  = width - 2 * padding;

  let nYears = max(data.length, 1);
  let scaleY = availableHeight / baseTotalHeight;
  let scaleX = availableWidth / (baseSpacing * nYears);

  let scale = min(scaleX, scaleY);

  totalHeight = baseTotalHeight * scale;
  let barW = baseBarW * scale;
  let spacing = baseSpacing * scale;
  dotSize = baseDotSize * scale;
  
  // CENTRA IL GRAFICO ORIZZONTALMENTE
  let totalGraphWidth = (nYears - 1) * spacing + barW;
  let xStart = (width - totalGraphWidth) / 2;
  
  // LINEE ORIZZONTALI ESTESE (griglie)
  let xScala = xStart - 35;
  let xEndLine = xStart + totalGraphWidth + 35;
  
  for (let t = 0; t <= 100; t += 50) {
    let ty = yBase - map(t, 0, 100, 0, totalHeight);
    
    stroke(palette.bianco);
    strokeWeight(1);
    
    // Linea orizzontale estesa
    line(xScala - 5, ty, xEndLine, ty);
  }

  for (let d of data) {
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
    circle(xStart + barW/2, yBase - h + dotSize/2, barW);

    // etichetta anno ruotata
    push();
    translate(xStart + barW/2, yBase + 90);
    rotate(-HALF_PI)
    textAlign(CENTER, CENTER);
    textSize(50*scale);
    textFont(fontRegular);
    fill(200);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }
}

function drawOverviewChartMiniNegative(data) {
  // layout base con barre più larghe
  let baseBarW = 28;
  let baseDotSize = 12;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize) * baseRows;
  let baseSpacing = 110;

  let yBase = height - bottomPadding;

  // scalatura
  let availableHeight = height - bottomPadding - topPadding;
  let availableWidth  = width - 2 * padding;

  let nYears = max(data.length, 1);
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

  // CENTRA IL GRAFICO ORIZZONTALMENTE
  let totalGraphWidth = (nYears - 1) * spacing + barW;
  let xStart = (width - totalGraphWidth) / 2;

  // LINEE ORIZZONTALI ESTESE (griglie)
  let xScala = xStart - 35;
  let xEndLine = xStart + totalGraphWidth + 35;
  
  for (let t = 0; t <= 100; t += 50) {
    let ty = yBase - map(t, 0, 100, 0, totalHeight);
    
    stroke(palette.bianco);
    strokeWeight(1);
    
    // Linea orizzontale estesa
    line(xScala - 5, ty, xEndLine, ty);
  }

  // linea 0 
  let xStartLine = xStart - 5;
  let xLineEnd = xStart + totalGraphWidth + 5;
  stroke(lineColor);
  strokeWeight(2);
  line(xStartLine, yZero, xLineEnd, yZero);

  // barre
  for (let d of data) {

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
    circle(xStart + barW/2, yZero - h + dotSize/2, barW);

    // etichetta anno  
    push();
    translate(xStart + barW/2, yBase + 40);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(35*scale);
    textFont(fontRegular);
    fill(palette.bianco);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }
}

// GRAFICO ESPANSO

function drawOverviewExpanded() {
  const chartData = countryData
    .slice()
    .sort((a, b) => int(a.year) - int(b.year));

  // Area box grande (schermo)
  const chartArea = {
    x: overviewBox.x,
    y: overviewBox.y,
    w: overviewBox.w,
    h: overviewBox.h
  };

  // 1. Cornice e sfondo
  noFill();
  stroke(palette.bianco);
  strokeWeight(1.5);
  rect(chartArea.x, chartArea.y, chartArea.w, chartArea.h, 30);

  const offsetX = 20;
  const offsetY = -15;

  push();
  translate(chartArea.x + offsetX, chartArea.y + offsetY);

  // Area LOCALE: x=0,y=0
  const localArea = { x: 0, y: 0, w: chartArea.w, h: chartArea.h };
  const isNegative = overviewNegative();

  // 2. Disegno il grafico (Barre o DotChart)
  if (viewMode === "overview") {
    if (isNegative) drawOverviewChartNegative(localArea, chartData);
    else drawOverviewChart(localArea, chartData);
  } else {
    if (isNegative) drawDotChartNegatives(localArea, chartData, params);
    else drawDotChart(localArea, chartData, params);
  }

  pop();

  // targhette status (solo in overview)
if (viewMode === "overview") {
  const statuses = getStatusesInData(chartData);

  // IMPORTANTE: drawToggle() deve essere già stato chiamato in questo frame
  // (nel tuo draw() lo chiami prima di drawOverviewExpanded(), quindi ok)

  const gap = 8;

  // se vuoi l'ancoraggio alla scritta "Parameters"
  if (toggleLabelRect) {
    // allineo a DESTRA sulla scritta "Parameters"
    const anchorLeftX = toggleLabelRect.x;

    // parto appena sopra la scritta (stack verso l’alto)
    let tagBottomY = toggleLabelRect.y - 30;

    push();
    textFont(fontBold);
    textSize(15);

    // (opzionale) ordine stabile: NF, PF, F (se esistono)
    const order = ["NF", "PF", "F"];
    const sorted = statuses.slice().sort((a, b) => order.indexOf(a) - order.indexOf(b));

    // disegno dal basso verso l’alto
    for (let i = sorted.length - 1; i >= 0; i--) {
      const status = sorted[i];
      const colors = coloriStatus[status];
      const label  = statusLabels[status];
      if (!colors || !label) continue;

      const tw = textWidth(label);
      const paddingX = 14;
      const wTag = tw + paddingX * 2;
      const hTag = 26;

      const xTag = anchorLeftX ;
      const yTag = tagBottomY - hTag;

      drawStatusTag(xTag, yTag, label, colors);

      tagBottomY = yTag - gap;
    }
    pop();

  } else {
    // fallback: se per qualche motivo toggleLabelRect non è pronto,
    // usa la tua vecchia posizione fissa
    let tagX = overviewBox.x + overviewBox.w - 420;
    let tagY = overviewBox.y + overviewBox.h - 90;

    for (let status of statuses) {
      const colors = coloriStatus[status];
      const label  = statusLabels[status];
      if (!colors || !label) continue;

      const hTag = drawStatusTag(tagX, tagY - 26, label, colors);
      tagY -= (hTag + gap);
    }
  }
}

  // 4. Testo di approfondimento (Context Insight)
  drawOverviewText();
}

// funzione per trovare overview negativi
function overviewNegative() {
  for (let d of countryData) {
    if (d.Total < 0) return true;
  }
  return false;
}

// GRAFICO ESPANSO DOT

function drawDotChart(area, data, params) {

  // layout base
  let baseDotSize = 12;
  let baseDotSpacing = 0;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize + baseDotSpacing) * baseRows;
  let baseColumnWidth = 2 * (baseDotSize + baseDotSpacing) + 50;// spaxio tra colonne

  let baseGrey = color(palette.grigio);

  const localWidth  = area.w;
  const localHeight = area.h;

  // USA GLI STESSI PAD DELL'OVERVIEW
  const padL = 60;
  const padR = 40;
  const padT = 40;
  const padB = 80;

  const chartW = localWidth  - padL - padR;
  const chartH = localHeight - padT - padB;

  // baseline identica all'overview
  let yBase = padT + chartH;

  // spazio disponibile identico
  let availableHeight = chartH;
  let availableWidth  = chartW;

  // scala
  let nYears = max(data.length, 1);
  let scaleY = availableHeight / baseTotalHeight;
  let scaleX = availableWidth  / (baseColumnWidth * nYears);
  let scale  = min(scaleX, scaleY);

  // dimensioni scalate
  let dotSize     = baseDotSize * scale;
  let dotSpacing  = baseDotSpacing * scale;
  let totalHeight = baseTotalHeight * scale;

  let columnSpacing = baseColumnWidth * scale;
  let xStart = padL;

  //  COLORI 
  let colors = [
    color(coloriLegenda.electoralProcess),
    color(coloriLegenda.politicalPluralism),
    color(coloriLegenda.functioningGovernment),
    color(coloriLegenda.freedomExpression),
    color(coloriLegenda.associationalRights),
    color(coloriLegenda.ruleOfLaw),
    color(coloriLegenda.personalAutonomy),
    color(coloriLegenda.addA)
  ];

  // LINEE ORIZZONTALI DI GRIGLIA (ogni 20)
  const xLineStart = padL-10;
  const xLineEnd = padL + columnSpacing * (nYears - 1) + 2 * (dotSize + dotSpacing);
  
  stroke(palette.bianco);
  strokeWeight(0.5);
  
  for (let t = 0; t <= 100; t += 20) {
    let ty = map(t, 0, 100, 0, totalHeight);
    line(xLineStart, yBase - ty, xLineEnd, yBase - ty);
  }

  //  TACCHETTE ASSE Y (numeri ogni 20)
  textFont(fontRegular);
  textSize(10);
  fill(palette.bianco);
  noStroke();
  textAlign(RIGHT, CENTER);

  for (let t = 0; t <= 100; t += 20) {
    let ty = map(t, 0, 100, 0, totalHeight);
    text(t, textPadding - 35, yBase - ty);
  }

  //  COLONNE (ANNI) 
  for (let i = 0; i < data.length; i++) {
    let d = data[i];

    // costruisco i pallini colorati
    let dots = [];
    for (let p = 0; p < params.length; p++) {
      let count = round(d[params[p]]);
      for (let k = 0; k < count && dots.length < 100; k++) {
        dots.push(colors[p]);
      }
    }

    let coloredCount = dots.length;

    // riempio con grigio
    while (dots.length < 100) dots.push(baseGrey);

    // applico AddQ
    let addq = d.AddQ || 0;
    if (addq > 0) {
      let toRemove = min(round(addq), coloredCount);
      let removed = 0;

      for (let idx = dots.length - 1; idx >= 0 && removed < toRemove; idx--) {
        if (dots[idx] !== baseGrey) {
          dots[idx] = baseGrey;
          removed++;
        }
      }
    }

    //  DISEGNO 100 PALLINI (SERPENTINA) - PARTONO DALLA LINEA DELLO ZERO
    for (let dIdx = 0; dIdx < 100; dIdx++) {
      let row = floor(dIdx / 2);
      let col = dIdx % 2;
      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * (dotSize + dotSpacing);
      // I pallini partono esattamente dalla baseline (aggiungo metà del dotSize per centrare)
      let y = yBase - row * (dotSize + dotSpacing) - dotSize / 2;

      fill(dots[dIdx]);
      noStroke();
      circle(x, y, dotSize);
    }

    // anni 
    let colCenter = xStart + (dotSize + dotSpacing) * 0.5;

    push();
    translate(colCenter, yBase + 40);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(palette.bianco);
    text(d.year, 0, 0);
    pop();

    xStart += columnSpacing;
  }
}
 
function drawDotChartNegatives(area, data, params) {

  //layout di base 
  let baseDotSize = 12;
  let baseDotSpacing = 0;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize + baseDotSpacing) * baseRows;
  let baseColumnGap = 50;
  let baseColumnWidth = 2 * (baseDotSize + baseDotSpacing) + baseColumnGap;

  let baseGrey = color(palette.grigio);

  const localWidth  = area.w;
  const localHeight = area.h;

  //  baseline 
  let yBase = localHeight - bottomPadding - 20;

  // spazio disponibile
  let availableHeight = localHeight - bottomPadding - topPadding;
  let availableWidth  = localWidth  - 2 * padding;

  // scala
  let nYears = max(data.length, 1);
  let scaleY = availableHeight / baseTotalHeight;
  let scaleX = availableWidth  / (baseColumnWidth * nYears);
  let scale  = min(scaleX, scaleY);

  let dotSize = baseDotSize * scale;
  let dotSpacing = baseDotSpacing * scale;
  let stepY = dotSize + dotSpacing;

  // posizione asse zero (identica alla overview negative)
  let zeroOffset = 50 * scale;
  let yZero = yBase - dotSize * 2 - zeroOffset;

  let columnSpacing = baseColumnWidth * scale;
  let xStart = padding - 30; //  avvicinato al bordo sinistro

  let colors = [
    color(coloriLegenda.electoralProcess),
    color(coloriLegenda.politicalPluralism),
    color(coloriLegenda.functioningGovernment),
    color(coloriLegenda.freedomExpression),
    color(coloriLegenda.associationalRights),
    color(coloriLegenda.ruleOfLaw),
    color(coloriLegenda.personalAutonomy),
    color(coloriLegenda.addA)
  ];

  // LINEE ORIZZONTALI DI GRIGLIA (ogni 20 per valori positivi)
  const xLineStart = xStart - 10;
  const xLineEnd = xStart + columnSpacing * (nYears - 1) + stepY * 2 + 2.5;
  
  stroke(palette.bianco);
  strokeWeight(0.5);
  
  for (let t = 0; t <= 80; t += 20) {
    let ty = map(t, 0, 100, 0, 50 * stepY);
    line(xLineStart, yZero - ty, xLineEnd, yZero - ty);
  }

  // asse y tacche (numeri ogni 20)
  textFont(fontRegular);
  fill(palette.bianco);
  textSize(10);
  noStroke();
  textAlign(RIGHT, CENTER);

  for (let t = 0; t <= 80; t += 20) {
    let ty = map(t, 0, 100, 0, 50 * stepY);
    text(t, textPadding - 35, yZero - ty);
  }

  // tacca -10
  text("-10", textPadding - 35, yZero + 5.5 * stepY);

  // linea zero (più spessa) - ALLINEATA AL BORDO INFERIORE DEI PALLINI
  stroke(lineColor);
  strokeWeight(3);
  line(
    xStart - 10,
    yZero + dotSize * 0.2,
    xStart + columnSpacing * (nYears - 1) + stepY * 2 + 2.5,
    yZero + dotSize * 0.2
  );

  // colonne pallini per anno 
  for (let i = 0; i < data.length; i++) {

    let d = data[i];
    let isNegative = d.Total < 0;

    let dots = [];
    let removedColors = [];

    // pallini positivi
    for (let p = 0; p < params.length; p++) {
      let count = round(d[params[p]]);
      for (let k = 0; k < count && dots.length < 100; k++) {
        dots.push(colors[p]);
      }
    }

    let coloredCount = dots.length;

    // AddQ -> rimuove pallini e salva colori
    let addq = d.AddQ || 0;
    if (addq > 0 && coloredCount > 0) {
      let toRemove = min(round(addq), coloredCount);
      let removed = 0;

      for (let idx = dots.length - 1; idx >= 0 && removed < toRemove; idx--) {
        if (dots[idx] !== baseGrey) {
          removedColors.push(dots[idx]);
          dots[idx] = baseGrey;
          removed++;
        }
      }
    }

    while (dots.length < 100) dots.push(baseGrey);

    // 80 pallini positivi - PARTONO DALLA LINEA DELLO ZERO
    for (let dIdx = 0; dIdx < 80; dIdx++) {
      let row = floor(dIdx / 2);
      let col = dIdx % 2;
      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * stepY;
      // I pallini partono esattamente dalla linea dello zero
      let y = yZero - row * stepY - dotSize / 2;

      let c = isNegative ? baseGrey : dots[dIdx];
      fill(c);
      noStroke();
      circle(x, y, dotSize);
    }

    // pallini negativi - PARTONO SOTTO LA LINEA DELLO ZERO
    let negCount = isNegative ? min(abs(d.Total), 10) : 0;

    for (let n = 0; n < 10; n++) {
      let row = floor(n / 2);
      let col = n % 2;
      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * stepY;
      // I pallini negativi partono dalla linea dello zero andando verso il basso
      let y = yZero + (row + 0.7) * stepY + dotSize / 2;

      let cNeg = baseGrey;
      if (n < negCount) {
        cNeg = n < removedColors.length
          ? removedColors[n]
          : color("#C51A1A");
      }

      fill(cNeg);
      noStroke();
      circle(x, y, dotSize);
    }

    // anni 
    let colCenter = xStart + stepY * 0.5;

    push();
    translate(colCenter, yBase + 40);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(palette.bianco);
    text(d.year, 0, 0);
    pop();

    xStart += columnSpacing;
  }
}

// FUNZIONI PER VERSIONI ESPANSE

function drawExpandIcon(x, y) {
  push();
  stroke(palette.bianco);
  strokeWeight(2);
  noFill();
  rectMode(CENTER);
  rect(x, y, 18, 18, 4);
  line(x - 4, y - 4, x + 4, y + 4);
  pop();
}

function drawOverviewCloseButton() {
  const size = 28;

  let x = overviewBox.x + overviewBox.w - size - 30;
  let y = overviewBox.y + 30;

  // area cliccabile
  overviewCloseBox = {
    x: x - 10,
    y: y - 10,
    w: size + 20,
    h: size + 20
  };

  // hover detection
  const hoverClose =
    mouseX >= overviewCloseBox.x &&
    mouseX <= overviewCloseBox.x + overviewCloseBox.w &&
    mouseY >= overviewCloseBox.y &&
    mouseY <= overviewCloseBox.y + overviewCloseBox.h;

  if (hoverClose) cursor(HAND);
  const hoverScale = hoverClose ? 1.15 : 1.0;

  // centro della X
  const cx = x + size / 2;
  const cy = y + size / 2;

  push();
  translate(cx, cy);
  scale(hoverScale);
  translate(-cx, -cy);

  // disegno X 
  stroke(palette.bianco);
  strokeWeight(3);
  noFill();
  line(x, y, x + size, y + size);
  line(x + size, y, x, y + size);

  pop();
}

function aggiornaVisibilitaPulsanti() {
  // non nascondo più nulla
  if (overviewExpanded) {
    // quando il box overlay è aperto
    btnBack.hide();        // NASCONDI freccia indietro
    btnAboutFH.show();
    btnAboutUs.show();
  } else {
    // stato normale
    btnBack.show();
    btnAboutFH.show();
    btnAboutUs.show();
  }
}

function drawParamsLegendSmall() {
  //  POSIZIONE BOX (ancorato in alto a destra dentro overviewBox) 
  const boxW = 300;
  const boxH = 260;

  const marginRight = 120;
  const marginTop   = 80;

  const x0 = overviewBox.x + overviewBox.w - boxW - marginRight;
  const y0 = overviewBox.y + marginTop;

  // STILE BOX 
  const r = 22;
  stroke(palette.bianco);
  strokeWeight(1.5);
  noFill();
  rect(x0, y0, boxW, boxH, r);

  // padding interno
  const padX = 20;
  const padY = 20;

  // TIPOGRAFIA
  const titleSize = 18;
  const itemSize  = 14;

  const dotR = 5;              // raggio pallino
  const rowH = 18;             // altezza riga
  const dotX = x0 + padX + 6;  // x pallino
  const textX = dotX + dotR*2 + 10; // x testo

  //  TESTI + COLORI (come screenshot) 
  const PR = [
    { label: "Electoral Process", color: coloriLegenda.electoralProcess },
    { label: "Political Pluralism and Participation", color: coloriLegenda.politicalPluralism },
    { label: "Functioning of Government", color: coloriLegenda.functioningGovernment },
    { label: "Add A", color: coloriLegenda.addA }
  ];

  const CL = [
    { label: "Freedom of Expression and Belief", color: coloriLegenda.freedomExpression },
    { label: "Associational and Organizational Rights", color: coloriLegenda.associationalRights },
    { label: "Rule of Law", color: coloriLegenda.ruleOfLaw },
    { label: "Personal Autonomy and Individual Rights", color: coloriLegenda.personalAutonomy }
  ];

  //  DISEGNO TITOLI + LISTE 
  noStroke();
  fill(palette.bianco);

  // titolo PR
  textFont(fontBold || fontRegular);
  textSize(titleSize);
  textAlign(LEFT, TOP);
  text("Political Rights", x0 + padX, y0 + padY);

  // lista PR
  textFont(fontRegular);
  textSize(itemSize);

  let y = y0 + padY + 24;

  for (let it of PR) {
    // pallino
    fill(it.color);
    circle(dotX, y + rowH/2, dotR*2);

    // testo
    fill(palette.bianco);
    textAlign(LEFT, CENTER);
    text(it.label, textX, y + rowH/2);

    y += rowH;
  }

  // spazio tra sezioni
  y += 18;

  // titolo CL
  textFont(fontBold || fontRegular);
  textSize(titleSize);
  textAlign(LEFT, TOP);
  text("Civil Liberties", x0 + padX, y);

  // lista CL
  y += 24;
  textFont(fontRegular);
  textSize(itemSize);

  for (let it of CL) {
    fill(it.color);
    circle(dotX, y + rowH/2, dotR*2);

    fill(palette.bianco);
    textAlign(LEFT, CENTER);
    text(it.label, textX, y + rowH/2);

    y += rowH;
  }
}

function getStatusesInData(data) {
  const set = new Set();
  for (let d of data) {
    if (d.Status) set.add(d.Status);
  }
  return Array.from(set);
}

function drawStatusTag(x, y, label, colors) {

  const paddingX = 14;
  const paddingY =6;
  const radius = 14;

  textFont(fontBold);
  textSize(15);
  textAlign(LEFT, CENTER);

  const tw = textWidth(label);
  const w = tw + paddingX * 2;
  const h = 26;

  // background
  noStroke();
  fill(colors[1]); // colore centrale dello status
  rect(x, y, w, h, radius);

  // testo
  fill(palette.nero);
  text(label, x + paddingX, y + h / 2);

  return h; // utile per posizionare la prossima
}

function drawToggle() {
  if (!overviewExpanded) return;

  const toggleW = 70;
  const toggleH = 36;
  const x = overviewBox.x + overviewBox.w - 325;
  const y = overviewBox.y + overviewBox.h - 70;
  const toggleX = x; // left del toggle
  const toggleY_center = y + toggleH/2; // centro verticale toggle
  const labelLeft  = "Parameters";
  const labelRight = "Total overview";

  push();

  noFill();
  stroke(palette.bianco);
  strokeWeight(1);
  rect(toggleX, toggleY_center - toggleH / 2, toggleW, toggleH, 30);

  noStroke();
  textFont(fontRegular);
  textSize(14);
  textAlign(RIGHT, CENTER);
  textLeading(16);

  if (viewMode === "parameters") fill(palette.bianco);
  else fill(150);

  text(labelLeft, toggleX - 15, toggleY_center);

  const labelLeftW = textWidth(labelLeft);
  const labelLeftH = textAscent() + textDescent(); // più preciso di "14"

  toggleLabelRect = {
    x: (toggleX - 15) - labelLeftW,
    y: toggleY_center - labelLeftH / 2,
    w: labelLeftW,
    h: labelLeftH
  };

  textAlign(LEFT, CENTER);

  if (viewMode === "overview") fill(palette.bianco);
  else fill(150);

  text(labelRight, toggleX + toggleW + 15, toggleY_center);

  //pallino
  fill(palette.bianco);
  noStroke();

  const knobX = (viewMode === "parameters")
    ? toggleX + 18
    : toggleX + toggleW - 18;

  circle(knobX, toggleY_center, toggleH - 8);

  pop();

  const hitboxPadding = 120;
  toggleBox = {
    x: toggleX - hitboxPadding,
    y: toggleY_center - toggleH / 2,
    w: toggleW + hitboxPadding * 2,
    h: toggleH
  };

  if (
  mouseX >= toggleBox.x &&
  mouseX <= toggleBox.x + toggleBox.w &&
  mouseY >= toggleBox.y &&
  mouseY <= toggleBox.y + toggleBox.h
) {
  cursor(HAND);
}
}

function drawCountryText(countryName, x, y, w) {
  let key = normalizeCountryName(countryName);

  let testo = countryTexts[key] || "";
  if (testo.trim() === "") return 0;

  textSize(16);
  textFont(fontRegular);
  textAlign(LEFT, TOP);

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

  let lineHeight = textAscent() + textDescent() + 4;
  let boxPadding = 20;
  let boxH = lines.length * lineHeight + boxPadding * 2;

  fill(palette.bianco);
  noStroke();
  let textY = y;

  for (let line of lines) {
    text(line, x, textY);
    textY += lineHeight;
  }
  return boxH;
}

function drawOverviewText() {
  if (viewMode !== "overview") return;

  const w = 300;

  // posizione delle targhette
  const tagsTopY = overviewBox.y + overviewBox.h - 150;

  // altezza del paragrafo
  const textH = measureCountryTextHeight(countryName, w);

  if (textH === 0) return;
  
const x = toggleLabelRect ? toggleLabelRect.x : (overviewBox.x + overviewBox.w - w);  

  // spazio per il titolo
  const titleH = 15;
  const gap = 10;

  // y ancorato dal basso (titolo + gap + testo)
  const y = tagsTopY - textH - titleH - gap - 10;

  // TITOLO
  push();
  textFont(fontBold);
  textSize(16);
  fill(palette.bianco);
  noStroke();
  textAlign(LEFT, TOP);
  text("CONTEXT INSIGHT", x, y);

  const starSize = 30;
const titleW = textWidth("CONTEXT INSIGHT");

imageMode(CORNER);
image(
  iconaStar,
  x -40, // distanza a destra del titolo
  y -7,           // piccolo allineamento verticale
  starSize,
  starSize
);
  pop();

  // PARAGRAFO
  drawCountryText(
    countryName,
    x,
    y + titleH + gap,
    w
  );
}

function measureCountryTextHeight(countryName, w) {
  let key = normalizeCountryName(countryName);
  let testo = countryTexts[key] || "";
  if (testo.trim() === "") return 0;

  textFont(fontRegular);
  textSize(16);

  let words = testo.split(" ");
  let lines = [];
  let currentLine = "";

  for (let word of words) {
    let testLine = currentLine + word + " ";
    if (textWidth(testLine) > w) {
      lines.push(currentLine);
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  let lineHeight = textAscent() + textDescent() + 4;
  let boxPadding = 20;

  return lines.length * lineHeight + boxPadding * 2;
}

// EVENTI MOUSE

function mousePressed() {
  // mouse in schermo (per overview mini/expanded)
  let sx = mouseX;
  let sy = mouseY;

  // mouse logico (per pallini/legenda)
  let mx = logicalMouseX;
  let my = logicalMouseY;

  //SE OVERVIEW È APERTO: gestisci X e toggle con mouse SCHERMO 
  if (overviewExpanded) {

    // X per chiudere
    if (overviewCloseBox &&
        sx >= overviewCloseBox.x &&
        sx <= overviewCloseBox.x + overviewCloseBox.w &&
        sy >= overviewCloseBox.y &&
        sy <= overviewCloseBox.y + overviewCloseBox.h) {
      overviewExpanded = false;
      return;
    }

    // toggle (priorità)
    if (toggleBox &&
        sx >= toggleBox.x &&
        sx <= toggleBox.x + toggleBox.w &&
        sy >= toggleBox.y &&
        sy <= toggleBox.y + toggleBox.h) {
      viewMode = (viewMode === "parameters") ? "overview" : "parameters";
      return;
    }

    // blocca click sul resto mentre è aperto
    return;
  }

  //APERTURA OVERVIEW (mini)
  if (overviewBox &&
      sx >= overviewBox.x &&
      sx <= overviewBox.x + overviewBox.w &&
      sy >= overviewBox.y &&
      sy <= overviewBox.y + overviewBox.h) {
    overviewExpanded = true;
    return;
  }


  // SE SONO NEL DETTAGLIO E CLICCO LA X → CHIUDO
  if (selectedCatIndex !== null && backDetailArea) {
    if (pointInRect(mx, my, backDetailArea.x, backDetailArea.y, backDetailArea.w, backDetailArea.h)) {
      selectedCatIndex = null;
      backDetailArea = null;
      return;
    }
  }

  // controllo se ho cliccato su un pallino "positivo" con categoria
  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      // Usa mx e my (che sono già nello spazio corretto)
      let d = dist(mx, my, p.x, p.y); 
      if (d < diametroPallino / 2) {
        // se clicco sulla stessa categoria già selezionata: la "disattivo"
        if (selectedCatIndex === p.catIndex) {
          selectedCatIndex = null;
        } else {
          // altrimenti seleziono questa categoria
          selectedCatIndex = p.catIndex;
        }
        return; // ho gestito il click, posso uscire dalla funzione
      }
    }
  }

for (let p of palliniInfo) { //PALLINI NEGATIVI 
    if (p.type === "neg") {
      let d = dist(mx, my, p.x, p.y);
      if (d < diametroPallino / 2) {
        // AddQ è indice 8
        if (selectedCatIndex === 8) {
          selectedCatIndex = null;
        } else {
          selectedCatIndex = 8;
        }
        return;
      }
    }
  }

//CLICCARE SULLA LEGENDA 
 for (let area of legendHitAreas) {
    if (pointInRect(mx, my, area.x, area.y, area.w, area.h)) {
      if (selectedCatIndex === area.catIndex) selectedCatIndex = null;
      else selectedCatIndex = area.catIndex;
      return;
    }
  }

  
}

function pointInRect(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

function mouseWheel(event) {
  if (!anniDisponibili.length) return false;

  // Usa la funzione della libreria
  let risultato = gestioneMouseWheel(
    event,
    anniDisponibili,
    annoSelezionato,
    scrollAccumulato,
    pixelPerAnno,
    progressoScroll,
    (nuovoIndice) => {
      // Callback quando l'anno cambia
      annoSelezionato = anniDisponibili[nuovoIndice];
      yearSelect?.selected(annoSelezionato);
      aggiornaPunteggioTotale();
    }
  );

  // Aggiorna le variabili globali
  scrollAccumulato = risultato.scrollAccumulato;
  progressoScroll = risultato.progressoScroll;

  return false; // Blocca lo scroll della pagina
}

function disegnaEtichettaAnno() {
  push(); 

  noStroke();
  textFont(fontRegular); 
  textAlign(CENTER, CENTER);
  
  // CALCOLO POSIZIONE COME NEL CODICE REGIONE
  let xPos = graficoWidth + (annoWidth / 2); 
  let yPos = height / 2;
  
  translate(xPos, yPos);
  rotate(PI / 2 * 3); 
  
  const spaziaturaFissaX = 400; 
  let offsetGlobaleX = map(progressoScroll, 0, 1, 0, spaziaturaFissaX);
  
  // Calcola l'indice dell'anno corrente
  let indiceCorrente = anniDisponibili.indexOf(annoSelezionato);
  
  // ANNO PRECEDENTE
  if (indiceCorrente > 0) {
    let annoPrecedente = anniDisponibili[indiceCorrente - 1];
    let baseXPrecedente = spaziaturaFissaX; 
    let finalXPrecedente = baseXPrecedente + offsetGlobaleX;
    
    // USA annoWidth INVECE DI VALORI FISSI
    let dimensionePrecedente = map(progressoScroll, 0, 1, annoWidth * 0.9, annoWidth * 0.7);
    let opacitaPrecedente = map(progressoScroll, 0, 1, 100, 70);
    
    fill(palette.bianco + hex(floor(opacitaPrecedente), 2));
    textSize(dimensionePrecedente);
    text(annoPrecedente, finalXPrecedente, -30);
  }
  
  // ANNO CORRENTE
  let baseXCorrente = 0;
  let finalXCorrente = baseXCorrente + offsetGlobaleX;

  // USA annoWidth INVECE DI VALORI FISSI
  let dimensioneCorrente = map(progressoScroll, 0, 1, annoWidth * 1.3, annoWidth * 0.9);
  let opacitaCorrente = map(progressoScroll, 0, 1, 255, 100);
  
  fill(palette.bianco + hex(floor(opacitaCorrente), 2));
  textSize(dimensioneCorrente);
  text(annoSelezionato, finalXCorrente, -30);
  
  // ANNO SUCCESSIVO
  if (indiceCorrente < anniDisponibili.length - 1) {
    let annoSuccessivo = anniDisponibili[indiceCorrente + 1];
    let baseXSuccessivo = -spaziaturaFissaX;
    let finalXSuccessivo = baseXSuccessivo + offsetGlobaleX;
    
    // USA annoWidth INVECE DI VALORI FISSI
    let dimensioneSuccessivo = map(progressoScroll, 0, 1, annoWidth * 0.7, annoWidth * 1.3); 
    let opacitaSuccessivo = map(progressoScroll, 0, 1, 70, 100);  

    fill(palette.bianco + hex(floor(opacitaSuccessivo), 2));
    textSize(dimensioneSuccessivo);
    text(annoSuccessivo, finalXSuccessivo, -30);
  }

  pop();
}