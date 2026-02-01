let data; //variabile che contiene il mio csv
let iconaUs;
let iconaFh;

//RESPONSIVE
let BASE_W = 1280; // larghezza di riferimento 
let BASE_H = 665; // altezza di riferimento
let scaleFactor = 1; // fattore di scala corrente
let lastScaleFactor = -1; // per capire se la scala è cambiata
let logicalMouseX = 0; // mouse "nello spazio logico"
let logicalMouseY = 0;

const YEAR_BASE_X = 750;  // coordinate ORIGINALI del select anno
const YEAR_BASE_Y = 145;

//font 
let mioFont; 
let mioFontBold;
let fontSimboli;

let textColor;
let countrySlug = "";   // nome normalizzato (no maiuscole e spazi)
let countryName = "";   // il nome leggibile che poi vogliamo scrivere nella pagina come titolo

//CREO UN ARRAY PER CONTENERE GLI ANNI 
let anniDisponibili = []; //array con tutti gli anni disponibili 
let annoSelezionato = "" //anno selezionionato 
let yearSelect; //oggetti select che appare 

//FRECCETTA FINTA MENU A TENDINA 
let arrowSpan; // per la freccia finta

//TOTAL SCORE
let punteggioTotale = 0; 

//TOTAL CATEGORIE [A,B,C,D,E,F,G]-->positivi
let totaliCategorie = [0,0,0,0,0,0,0,0];
let maxCategorie = [12, 16, 12, 4, 16, 12, 16, 16];

let questionColumns = [ //per ogni categoria mi associa le colonne del mio dataset che contengono i valori delle domande 
  ["Question A1", "Question A2", "Question A3"], // 0:A
  ["Question B1", "Question B2", "Question B3", "Question B4"], // 1:B
  ["Question C1", "Question C2", "Question C3"],  // 2:C
  ["Add A"],   //Add A 
  ["Question D1", "Question D2", "Question D3", "Question D4"], // 4:D
  ["Question E1", "Question E2", "Question E3"], // 5:E
  ["Question F1", "Question F2", "Question F3", "Question F4"], // 6:F
  ["Question G1", "Question G2", "Question G3", "Question G4"]  // 7:G
];

let questionScores = []; //contiene il punteggio da 0 a 4 di ciascuna Domanda 

// variabili per i nuovi bottoni in alto a destra
let bottoneUS;
let bottoneFH;
let bottoneBack; // bottone per tornare indietro
let tooltipUS;
let tooltipFH;

// colori
let nero = "#26231d";
let bianco = "#eaead8";
let grigio = "#454340ff";

//leganda colori 
let coloriLegenda = {
  electoralProcess: "#D9D97A",
  politicalPluralism: "#6A8AA9",
  functioningGovernment: "#0F3C63",
  addQ: "#C51A1A",
  addA: "#1f863fff", 
  freedomExpression: "#C47929",
  associationalRights: "#9C6EBF",
  ruleOfLaw: "#A4B2B8",
  personalAutonomy: "#C0655A"
};
//COLORI CATEGORIE 
let coloriCategorie = [];

//valore AddQ (positivo nel CSV, ma negativo nella realtà)
let addQVal = 0;
let addAVal = 0;
// info di tutti i pallini (per sapere coordinate e categoria)
let palliniInfo = [];
// per l'animazione di lampeggio
let animT = 0;
const diametroPallino = 44;

//VARIABILE HOVER PER CATEGORIA 
let hoveredCatIndex = null; 
//VARIABILE CATEGORIA CLICCATA 
let selectedCatIndex = null;

let legendHitAreas = []; // zone cliccabili della legenda

let backDetailArea = null; // bottone "back" nel pannello domande
let backHomeArea = null;   // bottone "back" in alto (pagina principale)

//VARIABILI OVERVIEWCHART
let overviewExpanded = false;   // mini / fullscreen
let overviewBox = null;         // area cliccabile
// dati per grafico overview (tutti gli anni del paese)
let countryData = [];
// paddind di Overview
let padding = 100;
let bottomPadding = 60;
let topPadding = 60;
let textPadding = 70;
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
let lineColor = "#eaead8";
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
//paragrafi
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
    "Do the people have the right to organize in different political parties\nor other competitivepolitical groupings of their choice, and is the system free\nof undue obstacles to the rise and fall of these competing parties or groupings?",
    "Is there a realistic opportunity for the opposition to increase\nits support or gain power through elections?",
    "Are the people's political choices free from domination by forces that are external\nto the political sphere, or by political forces that employ extrapolitical means?",
    "Do various segments of the population (including ethnic, racial, religious, gender,\nLGBT+, and other relevant groups) have full political rights and electoral opportunities?"
  ],
  // Functioning of government
  [
    "Do the freely elected head of government and national legislative\nrepresentatives determine the policies of the government?",
    "Are safeguards against official corruption strong and effective?",
    "Does the government operate with openness and transparency?",
  ],
  // Add A
  [
  "For traditional monarchies that have no parties or electoral process,\ndoes the system provide for genuine, meaningful consultation with the people\n encourage public discussion of policy choices, and allow the right to petition the ruler?"
  ],
  // Freedom of expression and belief
  [
    "Are there free and independent media?",
    "Are individuals free to practice and express their religious faith\nor nonbelief in public and private?",
    "Is there academic freedom, and is the educational system free\nfrom extensive political indoctrination?",
    "Are individuals free to express their personal views on political or other sensitive\ntopics without fear of surveillance or retribution?"
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
    "Do individuals enjoy freedom of movement, including the ability to change\ntheir place of residence, employment, or education?",
    "Are individuals able to exercise the right to own property and establish\nprivate businesses without undue interference from state or nonstate actors?",
    "Do individuals enjoy personal social freedoms, including choice of marriage\npartner and size of family, protection from domestic violence,\nand control over appearance?",
    "Do individuals enjoy equality of opportunity and freedom\nfrom economic exploitation?"
  ],
  //Additional Discretionary Question B
  [
    "Is the government or occupying power deliberately changing the ethnic\ncomposition of a country or territory so as to destroy a culture\nor tip the political balance in favor of another group?"
  ]
];

// CARICO LE COSE 
function preload() {
  data = loadTable("assets/FH_dataset.csv", "csv", "header");
  // font
  mioFont = loadFont("font/NeueHaasDisplayRoman.ttf");
  fontMedium = loadFont("font/NeueHaasDisplayMedium.ttf");
  mioFontBold = loadFont("font/NeueHaasDisplayBold.ttf");
  fontSimboli = loadFont("font/NeueHaasDisplayRoman.ttf");
  // icone
  iconaUs = loadImage("img/icone/us-bianco.png");
  iconaFh = loadImage("img/icone/fh-bianco.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleFactor = min(windowWidth / BASE_W, windowHeight / BASE_H);

  // Caratteristiche generali dei testi 
  textColor = color(232, 233, 214);
  textFont(mioFont);
  textSize(16);
  fill(textColor);

  let urlParams = getURLParams();
  
  // DECODIFICA il parametro country
  let countryFromURL = urlParams.country || "";
  countrySlug = countryFromURL ? decodeURIComponent(countryFromURL) : "";
  countrySlug = normalizeCountryName(countrySlug);
  
  // Debug
  console.log("Country dall'URL:", countryFromURL);
  console.log("Country normalizzato:", countrySlug);

  if (countrySlug === "") {
    countryName = "Nessun paese selezionato";
    console.warn("Parametro ?country mancante nell'URL");
    return; 
  }

  // Cerco nel CSV la riga che ha lo stesso slug
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

  // COSTRUISCO countryData PER OVERVIEW =====
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
  

// ordina per anno crescente
countryData.sort((a, b) => int(a.year) - int(b.year));

  
  if (!found) {
    countryName = "Paese non trovato (" + countrySlug + ")";
    console.warn("Nessun dato trovato per lo slug:", countrySlug);
    return; // IMPORTANTE: esci se non trovi il paese
  }
  
  // Leggi l'anno dall'URL
  let yearFromURL = urlParams.year || "";
  console.log("Anno dall'URL:", yearFromURL);
  
  // SE HO TROVATO GLI ANNI
  if (anniDisponibili.length > 0) {
    anniDisponibili.sort((a, b) => int(b) - int(a));
    
    // Usa l'anno dall'URL se disponibile e valido
    if (yearFromURL && anniDisponibili.includes(yearFromURL)) {
      annoSelezionato = yearFromURL;
    } else {
      annoSelezionato = anniDisponibili[0];
    }
    
    console.log("Anno selezionato:", annoSelezionato);

    // Calcola subito i punteggi
    aggiornaPunteggioTotale();

    // Crea il select per l'anno
    yearSelect = createSelect();
    yearSelect.position(YEAR_BASE_X * scaleFactor, YEAR_BASE_Y * scaleFactor);

    for (let y of anniDisponibili) {
      yearSelect.option(y);
    }

    yearSelect.selected(annoSelezionato);

    yearSelect.style('background-color', nero);
    yearSelect.style('color', bianco);
    yearSelect.style('border', '1px solid' + bianco);
    yearSelect.style('font-family', 'Open Sans, sans-serif');
    yearSelect.style('font-size', (55 * scaleFactor) + 'px');
    yearSelect.style('border-radius', (18 * scaleFactor) + 'px');
    yearSelect.style('outline', 'none');

    // Tolgo la freccia nativa del browser
    yearSelect.style('appearance', 'none');
    yearSelect.style('-webkit-appearance', 'none');
    yearSelect.style('-moz-appearance', 'none');

    // Aumento il padding a destra per far posto alla freccia finta
    yearSelect.style(
      'padding',
      (6 * scaleFactor) + 'px ' +
      (60 * scaleFactor) + 'px ' +
      (6 * scaleFactor) + 'px ' +
      (24 * scaleFactor) + 'px'
    );

    // Creo una freccia finta "▾"
    arrowSpan = createSpan('▾');
    arrowSpan.style('position', 'absolute');
    arrowSpan.style('pointer-events', 'none');
    arrowSpan.style('color', bianco);
    arrowSpan.style('font-family', 'Open Sans, sans-serif');
    arrowSpan.style('font-size', (62 * scaleFactor) + 'px');

    yearSelect.changed(() => {
      annoSelezionato = yearSelect.value();
      aggiornaPunteggioTotale();
    });
    
    posizionaFreccia();
  }

  // Crea i bottoni
  creaBottoneBack();
  creaBottoniNavigazione();
  
}

//FUNZIONE PER NORMALIZZARE I NOMI 
//slug --> versione ripulita dei nomi dei paesi, più facile da usare e non crea errori 
function normalizeCountryName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ""); // tiene solo lettere e numeri
}

//DISEGNA I PALLINI 
function drawPalliniGrigi(){
    //VARIABILI 
    let pallini = 100; //definisco il numero dei pallini 
    let colonne = 10; //numero colonne 
    let righeQuadrato = 10; //numero righe 

    let diametro = diametroPallino; //diametro di ogni pallino 
    let spazio = 1; //spazio vuoto tra due pallini 

    let grigliaLarghezza = colonne*diametro + (colonne-1)*spazio; //calcolo la larghezza che occuperanno i pallini 
    let grigliaAltezza = righeQuadrato*diametro + (righeQuadrato-1)*spazio; //calcolo l'altezza occupata 

    let startX = 80;
    let startY = 150; 

    palliniInfo = [];

  coloriCategorie = [
    color("#D9D97A"),// A
    color("#6A8AA9"),// B
    color( "#0F3C63"),// C
    color("#1f863fff"), // 3: Add A  
    color("#C47929"),// D
    color("#9C6EBF"),// E
    color( "#A4B2B8"),// F
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

      if (catIndex === null) { // nessuna categoria: pallino grigio
        fill(grigio);
      } else { // c'è una categoria, quindi pallini colorati
        let baseCol = coloriCategorie[catIndex];
        let cCol = color(baseCol);

        // se esiste una categoria "attiva" (hover o click)
        // e questo pallino NON è di quella categoria --> lo spengo
        if (hasActive && catIndex !== activeCatIndex) {
          cCol.setAlpha(90);   // opaco
        } else {
          cCol.setAlpha(255);  // pieno
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
        type: "pos" //pos per i positivi, neg negativi 
      });

      indicePallino++; // passo al pallino successivo
    }
  } 
//LINEA DEI PUNTEGGI NEGATIVI inserita solo quando il punteggio totale è negativo 
if(punteggioTotale<0) {
    
//inserisco la LINEA BIANCA di separazione 
let lineY = startY + grigliaAltezza -15;
stroke(textColor);
strokeWeight(2);
line(60,lineY, 60+grigliaLarghezza,lineY);

//scritta 0
noStroke();
fill(textColor);
textAlign(LEFT,CENTER);
textSize(18);
text("0",40,lineY-3);

//10 PALLINI NEGATIVI 
let distanzaLineaPallini = 27;  // distanza verticale tra linea e riga extra
let yExtra = lineY + distanzaLineaPallini; // centro dei pallini della riga extra

fill(0);
noStroke();

for (let c = 0; c < colonne; c++) { //uso solo c
  let x = startX + c * (diametro + spazio);
  
  circle(x, yExtra, diametroPallino);

  //faccio la stessa cosa di prima, associo pallino a degli elementi fissi per riconoscerlo 
  //gli associo le sue caratteristiche 
  palliniInfo.push({
    index: indicePallino,
    x: x,
    y: yExtra,
    catIndex: null,  // nessuna categoria
    type: "neg"      // pallini sotto lo zero
  });
indicePallino++;
  }
};
}

//FUNZIONE HOVER PER CATEGORIA (mi aiuta per quella sotto)
function updateHoverCategory() {
  // Se c'è una categoria selezionata con il click,
  // l'hover non deve più cambiare nulla.
  if (selectedCatIndex !== null) {
    hoveredCatIndex = null;
    cursor(ARROW);
    return;
  }
  hoveredCatIndex = null;
  let cursorChanged = false;

  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      let d = dist(logicalMouseX, logicalMouseY, p.x, p.y);
      if (d < diametroPallino / 2) {
        hoveredCatIndex = p.catIndex;
        cursor(HAND);
        cursorChanged = true;
        break;
      }
    }
  }
  
  // Controlla anche i pallini negativi
  if (!cursorChanged) {
    for (let p of palliniInfo) {
      if (p.type === "neg") {
        let d = dist(logicalMouseX, logicalMouseY, p.x, p.y);
        if (d < diametroPallino / 2) {
          cursor(HAND);
          cursorChanged = true;
          break;
        }
      }
    }
  }
  
  if (!cursorChanged) {
    cursor(ARROW);
  }
}

// Controlla hover sulla legenda
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

// Controlla hover sul bottone X
function checkBackButtonHover() {
  if (!backDetailArea) return;
  
  let mx = logicalMouseX;
  let my = logicalMouseY;
  
  if (mx >= backDetailArea.x && mx <= backDetailArea.x + backDetailArea.w &&
      my >= backDetailArea.y && my <= backDetailArea.y + backDetailArea.h) {
    cursor(HAND);
  }
}

//LEGENDA O DOMANDE --> mi gestisce quale delle due funzioni attivare  
function drawSidePanel() {
  if (selectedCatIndex === null) {
    // nessuna categoria cliccata: mostro la legenda normale
   backDetailArea = null;
    drawLegenda();
  } else {
    // c'è una categoria cliccata: mostro il pannello di dettaglio
    drawCategoryPanel(selectedCatIndex);
  }
}

//DISEGNO LA LEGENDA 
function drawLegenda() {
  let x0 = 575;   // posizione X della legenda
  let y0 = 260;   // posizione Y della legenda
  let passo = 20; // distanza verticale tra le righe
  let dimCerchio = 16;
  let numerino = 870;
  let massimo = numerino+2;
  let categoriaSpazio = 600;

  let valA = int(totaliCategorie[0]);
  let valB = int(totaliCategorie[1]);
  let valC = int(totaliCategorie[2]);
  let valD = int(totaliCategorie[4]);
  let valE = int(totaliCategorie[5]);
  let valF = int(totaliCategorie[6]);
  let valG = int(totaliCategorie[7]);

  let xx = 560;
  let yy = 240;
  let w  = 350;
  let h  = 330;

  legendHitAreas = [] //svuoto l'array 

  //SE VOGLIO METTERE UN BORDO BIANCO 
  // sfondo del box
  noFill();
  stroke(textColor);
  strokeWeight(1);
  rect(xx, yy, w, h, 18); 


  noStroke();
  fill(textColor);
  textFont(mioFontBold);
  textSize(20);
  text("Political Rights", x0, y0);

  // 1) Electoral Process
  noStroke();
  fill(coloriLegenda.electoralProcess);
  circle(x0+8, y0 + 35, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Electoral Process", categoriaSpazio, y0 + passo + 10);
  textFont(mioFontBold);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(valA, numerino, y0 + passo + 8);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  textSize(10);
  text("/"+ maxCategorie[0],massimo, y0 + passo + 13)

  legendHitAreas.push({
    x: x0,          // da sinistra del box
    y: y0 + 20,     // inizio riga A (aggiusta se serve)
    w: 350,         // larghezza area cliccabile
    h: 24,          // altezza riga
    catIndex: 0     // categoria A
  });
  

  // 2) Political pluralism
  fill(coloriLegenda.politicalPluralism);
  circle(x0+8, y0 + 55, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Political pluralism and participation", categoriaSpazio, y0 + passo*2 + 10);
  textFont(mioFontBold);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(valB, numerino, y0 + passo + 28);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  textSize(10);
  text("/"+ maxCategorie[1],massimo, y0 + passo + 33)

legendHitAreas.push({
    x: x0,
    y: y0 + 40,   // riga più in basso
    w: 350,
    h: 24,
    catIndex: 1   // categoria B
  });

  // 3) Functioning of government
  fill(coloriLegenda.functioningGovernment);
  circle(x0+8, y0 + 75, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Functioning of government", categoriaSpazio, y0 + passo*3 + 10);
  textFont(mioFontBold);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(valC, numerino, y0 + passo + 48)
  textAlign(LEFT, TOP);
  textFont(mioFont);
  textSize(10);
  text("/" + maxCategorie[2],massimo, y0 + passo + 53)

  legendHitAreas.push({
    x: x0,
    y: y0 + 60,
    w: 350,
    h: 24,
    catIndex: 2   // categoria C
  });



  // 4) Add Q

  let valQ = int(addQVal);   
  let maxQ = 4; // massimo teorico Add Q
  // Add Q è concettualmente NEGATIVO → lo trasformo
  let valQneg = -valQ;

  stroke(coloriLegenda.addQ);
  strokeWeight(2);
  noFill();
  circle(x0+8, y0 + 95, dimCerchio);

  noStroke();
  fill(textColor);
  textFont(mioFontBold);
  textSize(16);
  fill("#C51A1A")
  textAlign(RIGHT, TOP);
  text(valQneg, numerino, y0 + passo+68);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  textSize(10);
  text("/" + "-"+maxQ,massimo, y0 + passo + 73)

 noStroke();
  fill("#C51A1A");
  textFont(mioFont);
  textSize(14);
  text("Additional Discretionary Question B:\nsubtracts points from other parameters", categoriaSpazio, y0 + passo*4 + 10);

  legendHitAreas.push({
    x: x0,
    y: y0 + 80,   // aggiusta un po' se non combacia perfettamente
    w: 350,
    h: 48,
    catIndex: 8   // 👈 corrisponde al pannello AddQ
  });

  //AddA
let anno = int(annoSelezionato);
if (anno >= 2013 && anno <= 2017) {

  fill(coloriLegenda.addA);
  noStroke();
  circle(x0+8, y0+135, dimCerchio);

  fill(textColor);
  textFont(mioFont);
  textSize(14);
  fill(textColor);
  text("Additional Discretionary Question A:\nadds points over 100", categoriaSpazio, y0 + passo*6 + 10);
  let maxA = 4;
  let valAc = int(addAVal);
  textFont(mioFontBold);
  textSize(16);
  fill(textColor);
  textAlign(RIGHT, TOP);
  text(valAc, numerino, y0 + passo+108);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  textSize(10);
  text("/" + maxA,massimo, y0 + passo + 113)

  legendHitAreas.push({
      x: x0,
      y: y0 + 120,   // altezza riga AddA
      w: 350,
      h: 48,
      catIndex: 3    // categoria 3 = Additional Answer
    });
  }



  //SPAZIO//
  let yLib = y0 + passo*6 +55;

  textFont(mioFontBold);
  fill(textColor);
  textSize(20);
  text("Civil Liberties", x0, yLib+10);

  // 5) Freedom Expression
  fill(coloriLegenda.freedomExpression);
  circle(x0+8, yLib + 45, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Freedom of expression and belief", categoriaSpazio, yLib + passo + 20);

  textSize(16);
  fill(textColor);
  textFont(mioFontBold);
  textAlign(RIGHT, TOP);
  text(valD, numerino, yLib + passo+19);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  textSize(10);
  text("/" + maxCategorie[4],massimo, yLib + passo+24)

  legendHitAreas.push({
    x: x0,
    y: yLib + 30,
    w: 350,
    h: 24,
    catIndex: 4
  });

  // 6) Associational rights
  fill(coloriLegenda.associationalRights);
  circle(x0+8, yLib + 65, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Associational and organizational right", categoriaSpazio, yLib + passo*2 + 20);
  textSize(16);
  fill(textColor);
  textFont(mioFontBold);
  textAlign(RIGHT, TOP);
  text(valE, numerino, yLib + passo+39);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  textSize(10);
  text("/" + maxCategorie[5],massimo, yLib + passo+44)

  legendHitAreas.push({
    x: x0,
    y: yLib + 50,
    w: 350,
    h: 24,
    catIndex: 5
  });


  // 7) Rule of Law
  fill(coloriLegenda.ruleOfLaw);
  circle(x0+8, yLib + 85, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Rule of Law", categoriaSpazio, yLib + passo*3 + 20);
  
  textSize(16);
  fill(textColor);
  textFont(mioFontBold);
  textAlign(RIGHT, TOP);
  text(valF, numerino, yLib + passo+59);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  textSize(10);
  text("/" + maxCategorie[6],massimo, yLib + passo+64)

  legendHitAreas.push({
    x: x0,
    y: yLib + 70,
    w: 350,
    h: 24,
    catIndex: 6
  });

  // 8) Personal Autonomy
  fill(coloriLegenda.personalAutonomy);
  circle(x0+8, yLib + 105, dimCerchio);
  fill(textColor);
  textFont(mioFont);
  textSize(14);
  text("Personal autonomy and individual rights", categoriaSpazio, yLib + passo*4 + 20);
  textSize(16);
  fill(textColor);
  textFont(mioFontBold);
  textAlign(RIGHT, TOP);
  text(valG, numerino, yLib + passo+79);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  textSize(10);
  text("/" + maxCategorie[7],massimo, yLib + passo+84)

  legendHitAreas.push({
    x: x0,
    y: yLib + 90,
    w: 350,
    h: 24,
    catIndex: 7
  });

}

// FUNZIONE DISEGNA PANNELLO DOMANDE 
function drawCategoryPanel(catIndex) {
  // Configurazione base fissa
  let x0 = 560; // X di partenza
  let y0 = 240; // Y di partenza (dove inizia il pannello)
  
  // Variabili di misurazione
  let paddingLeft = 30;   // Padding a sinistra per titolo e pallini
  let paddingRight = 30;  // Padding a destra per il testo più lungo (AUMENTATO per la X)
  let palliniSpazioTotale = 16 * 4; 
  let palliniOffset = 95;   
  let maxTextWidth = 0; 
  
  // --- A. VARIABILI DI CALCOLO ALTEZZA & TEXTWIDTH ---
  
  let titoloAltezza = 20;  
  let titoloMargine = 20;  
  let dopoTitolo = 20;     
  let lineHeight = 20;     
  let gap = 20;            
  let paddingBottom = 0;  // Aumentato per coerenza
  
  // Inizializzazione font per la misurazione
  textFont(mioFont);
  textSize(14); 

  // Iniziamo il calcolo dell'altezza necessaria (h)
  let h = 0;
  
  // 1. Larghezza del Titolo (inclusa la X)
  textFont(mioFontBold);
  textSize(20);
  let titolo = panelTitles[catIndex] || "Category details";
  
  // Larghezza del titolo + spazio per la 'X' sul lato destro
  // (La 'X' ha bisogno di circa 30px, la usiamo come offset dal bordo destro)
  maxTextWidth = textWidth(titolo) + paddingLeft + 30; 
  
  // 2. Altezza iniziale (Titolo + Spazi)
  h += titoloMargine + titoloAltezza + dopoTitolo;
  
  // 3. Calcolo Altezza e Larghezza Massima delle DOMANDE
  textFont(mioFont);
  textSize(14);
  let questions = panelQuestions[catIndex] || [];
  
  for (let qi = 0; qi < questions.length; qi++) {
      let q = questions[qi];
      let righe = q.split("\n");
      
      for (let r of righe) {
          let currentLineWidth = textWidth(r);
          let totalQuestionWidth = palliniOffset + currentLineWidth + paddingRight;
          
          if (totalQuestionWidth > maxTextWidth) {
              maxTextWidth = totalQuestionWidth;
          }
      }
      
      h += (righe.length * lineHeight) + gap;
  }
  
  // 4. Larghezza finale del pannello (w)
  let w = maxTextWidth + paddingLeft; 
  
  // 5. Altezza finale
  h += paddingBottom;

  // --- B. DEFINIZIONE E DISEGNO DEL PANNELLO DINAMICO ---
  
  noFill();
  stroke(textColor);
  strokeWeight(1.5);
  rect(x0, y0, w, h, 18); // h e w ORA SONO DINAMICHE
  noStroke();

  // --- C. DISEGNO CONTENUTO INTERNO ---
  
  // 1. Titolo
  textFont(mioFontBold);
  textSize(20);
  fill(textColor);
  let currentY = y0 + titoloMargine; 
  text(titolo, x0 + paddingLeft, currentY); 

  // --- D. BOTTONE 'X' (CLOSE) ---
  
  let xBtn = x0 + w - paddingRight; // X a destra, all'interno del padding
  let yBtn = y0 + titoloMargine + titoloAltezza / 2; // Y allineata al centro del titolo
  let btnSize = 16; // Dimensione della 'X'

  // Imposta l'area cliccabile per la 'X'
  backDetailArea = { 
    x: xBtn - btnSize / 2, // Centro X della 'X'
    y: yBtn - btnSize / 2, // Centro Y della 'X'
    w: btnSize * 1.5,      // Area più generosa per il click
    h: btnSize * 1.5
  };

  // Disegno della 'X'
  push(); // Salviamo lo stato attuale per il simbolo 'X'
  translate(xBtn, yBtn);
  fill(textColor);
  stroke(textColor);
  strokeWeight(2);
  
  // Disegna le due linee della 'X'
  line(-btnSize / 2, -btnSize / 2, btnSize / 2, btnSize / 2); // Diagonale \
  line(btnSize / 2, -btnSize / 2, -btnSize / 2, btnSize / 2); // Diagonale /
  
  pop(); // Ripristina lo stato
  
  // --- E. DOMANDE E PALLINI ---
  
  currentY += titoloAltezza + dopoTitolo; 
  
  textFont(mioFont);
  textSize(14);

  let palliniRaggio = 6; 
  let palliniSpazio = 16;
  let palliniStartX = x0 + paddingLeft; 
  let textX = x0 + palliniOffset; 

  for (let qi = 0; qi < questions.length; qi++) {
    let q = questions[qi];
    let score = 0;

    // Calcolo del punteggio (omesso per brevità, ma identico al tuo originale)
    if (catIndex === 8) {
        score = int(constrain(addQVal, 0, 4));
    } else {
        if (questionScores[catIndex] && questionScores[catIndex][qi] != null) {
            score = questionScores[catIndex][qi];
        }
        score = int(constrain(score, 0, 4));
    }

    let righe = q.split("\n");
    noStroke();
    let palliniY0 = currentY + 6; 

    // Disegno dei 4 pallini 
    for (let i = 0; i < 4; i++) {
        // ... Logica colori ...
        if (i < score) {
            if (catIndex === 8) {
                fill("#C51A1A");
            } else {
                let baseCol = coloriCategorie[catIndex];
                let c = color(baseCol); 
                c.setAlpha(255); 
                fill(c);
            }
        } else {
            fill(grigio);
        }

        let palliniX0 = palliniStartX + i * palliniSpazio;
        circle(palliniX0, palliniY0, palliniRaggio * 2);
    }

    // Disegno ogni riga di testo
    fill(textColor);
    noStroke();
    for (let r of righe) {
        text(r, textX, currentY);
        currentY += lineHeight;
    }

    // Gap tra una domanda e la successiva
    currentY += gap;
  }
}

//FUNZIONE ADDQ (domanda negativa)
function drawAddQOverlay() {
  let n = int(addQVal);   //valore addQ convertito con int in intero per sicurezza
  if (n <= 0) return;  // se è zero o negativo, non faccio nulla

  // political rights: sono le prime tre categorie, da 0 a 2
  let maxCatPR = 2;

  //ANIMAZIONE 
  let alphaInner = map(cos(animT), -1, 1, 0, 255);
  //variabile globale che incremento ad ogni frame nel draw 
  //cos oscilla sempre tra -1 e 1
  //oscillazione che viene mappata in un opacità 

  let colpiti = 0; //quanti pallini fanno questa cosa?

  let targets = [];

  // prendo gli ULTIMI pallini colorati

  // 1) raccolgo tutti i pallini positivi con categoria (quindi solo quelli colorati)
  let colored = [];
  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      colored.push(p);
    }
  }

  // 2) li ordino per indice crescente (0,1,2,...)
  colored.sort((a, b) => a.index - b.index);

  // 3) prendo gli ultimi n (partendo dalla fine dell’array)
  for (let i = colored.length - 1; i >= 0 && targets.length < n; i--) {
    targets.push(colored[i]);
  }

  //Negativi (sotto la linea)
  for (let p of palliniInfo) {
  if (p.type === "neg") {
    targets.push(p);
    }
  }

  //applico l'effetto con l'ordine delle regole di sopra 
  for (let p of targets) {
    if (colpiti >= n) break; 
  //se ho già cerchiato il numero di pallini giusto, ok 
  //se no procedo a fare anche quetso pallino 

   let rCerchio = diametroPallino;
    
    noStroke();
    fill(0);                      // stesso colore del background
    circle(p.x, p.y, rCerchio);


    //INTERNO di un pallino con bordo rosso 
   if (p.type === "pos" && p.catIndex !== null) {
    // pallino positivo: recupero il colore della categoria
    let baseCol = coloriCategorie[p.catIndex];
    let c = color(baseCol);   // 
    c.setAlpha(alphaInner);   // ok, non tocca l’originale
    fill(c);
    c.setAlpha(alphaInner);

    
    noStroke();
    fill(c);
    circle(p.x, p.y, rCerchio);

    //pallino negativo sotto la linea 
  } else if (p.type === "neg") {
    // pallino negativo
    let c = color("#C51A1A");
    noStroke();
    fill(c);
    circle(p.x, p.y, rCerchio);
  }

  //BORDO ROSSO FISSO
  noFill(); //vuoto
  stroke(197, 26, 26);   // rosso pieno
  strokeWeight(5);
  circle(p.x, p.y, rCerchio );  // anello più grande


  colpiti++;
}

// ripristino stato
noStroke();
  }

//FUNZIONE PUNTEGGIO TOTALE + ARRAY CON I VALORI DELLE CATEGORIE 
//qui associo paese.anno.valori
function aggiornaPunteggioTotale(){ //e anche categorie 
  punteggioTotale = 0; //azzero la mia variabile per sicurezza 

  //ciclo 
  for (let i=0; i<data.getRowCount(); i++){
    let countryCSV = data.getString(i,"Country/Territory").trim();
    let csvSlug = normalizeCountryName(countryCSV);
    let edition = data.getString(i,"Edition").trim();

    // stesso paese + stesso anno
    if (csvSlug === countrySlug && edition === annoSelezionato) {
      punteggioTotale = data.getNum(i, "TOTAL"); //ATTENZIONE ALLO SPAZIO ALLA FINE 
      
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

//creo una funzione di supporto che dopo aver asseganto i valori ai pallini
//mi dice di un pallino a che categoria appartiene 
//"dimmi che numero di pallino sei, ti dirò a che categoria appartieni"
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

//spiegazione breve con esempio 
//PALLINO 0
//all'inizio la somma è 0
//k=0 --> A, puntiCat = 3
//indicePallino <somma+puntiCat --> 0<0+3 --> pallino 0 appartiene a A

function posizionaFreccia() {
  if (!yearSelect || !arrowSpan) return;

  // prendo le coordinate reali del select nella pagina
  let rect = yearSelect.elt.getBoundingClientRect();
  let selX = rect.left;
  let selY = rect.top;
  let selW = rect.width;

  // posiziono la freccia un po' dentro dal bordo destro
  arrowSpan.position(selX + selW - 55, selY + 4);
}
function aggiornaYearSelect() {
  if (!yearSelect) return;

  // posizionamento scalato
  yearSelect.position(
    YEAR_BASE_X * scaleFactor,
    YEAR_BASE_Y * scaleFactor
  );

  // stile scalato
  yearSelect.style('font-size', (55 * scaleFactor) + 'px');
  yearSelect.style(
    'padding',
    (6 * scaleFactor) + 'px ' +
    (60 * scaleFactor) + 'px ' +
    (6 * scaleFactor) + 'px ' +
    (24 * scaleFactor) + 'px'
  );
  yearSelect.style('border-radius', (18 * scaleFactor) + 'px');

  if (arrowSpan) {
    arrowSpan.style('font-size', (62 * scaleFactor) + 'px');
    posizionaFreccia(); // la freccia usa già il bounding rect reale
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleFactor = min(windowWidth / BASE_W, windowHeight / BASE_H);
  aggiornaYearSelect();
}

function draw() {
  background(nero);

    scaleFactor = min(windowWidth / BASE_W, windowHeight / BASE_H);
    let translateX = (width - BASE_W * scaleFactor) / 2;
    let translateY = (height - BASE_H * scaleFactor) / 2;
    
    // per toggle
    // Ricalcola logicalMouseX e logicalMouseY tenendo conto della traslazione
    logicalMouseX = (mouseX - translateX) / scaleFactor;
    logicalMouseY = (mouseY - translateY) / scaleFactor;
    // 

    if (scaleFactor !== lastScaleFactor) {
        aggiornaYearSelect();
        lastScaleFactor = scaleFactor;
    }

    push();

    // La traslazione che devi compensare nel mouse
    translate(translateX, translateY);
    scale(scaleFactor);  

  animT += 0.01; 

  fill(textColor);
  textFont(mioFontBold);

  //TOTAL 
  textSize(72);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  text("Total", 560, 130);

  //TOTAL SCORE 
  //:
  textSize(72);
  textAlign(LEFT, TOP);
  textFont(fontSimboli);
  text(":",970, 110);
  //punteggio 
  textSize(92);
  textAlign(LEFT, TOP);
  textFont(mioFont);
  text(punteggioTotale,1010, 120);

  drawTitle();
  drawPalliniGrigi();
  updateHoverCategory();
  checkLegendHover();
  checkBackButtonHover();
  drawAddQOverlay();
  drawSidePanel();

  
  
  //overviewchart mini
  if (!overviewExpanded) {
  drawOverviewMini();
  }

  //CHART GRANDE (EXPANDED)
  if (overviewExpanded) {

  // box del grafico
  overviewBox = {
      x: 100,
      y: 120,
      w: BASE_W - 160,
      h: BASE_H - 200
    };
  
  // overlay per coprire le cose sotto
  fill(0, 180); // semi-trasparente
  noStroke();
  rect(0, 0, BASE_W, BASE_H);
  
  //sfondo overview
  fill(nero);
  rect(
      overviewBox.x,
      overviewBox.y,
      overviewBox.w,
      overviewBox.h,
      30
  );

  //grafico

  if (overviewExpanded) {
    drawOverviewExpanded();
  } else {
    drawOverviewMini();
  }

  

  //toggle solo se il grafico è esteso 
  drawToggle();

  // X per chiudere il grafico in versione extended 
  drawOverviewCloseButton();

  //funzione che rende non visibili i pulsanti back,home e aboutus-> necessaria perchè questi appartengono al csv
  aggiornaVisibilitaPulsanti();

  pop();

}




}

//SE CLICCO IL MOUSE
function mousePressed() {

  //GRAFICO IN MINIATURA
  let mx = logicalMouseX;
  let my = logicalMouseY;
   if (overviewExpanded) {

    // X per chiudere 
    if (overviewCloseBox &&
        mx >= overviewCloseBox.x &&
        mx <= overviewCloseBox.x + overviewCloseBox.w &&
        my >= overviewCloseBox.y &&
        my <= overviewCloseBox.y + overviewCloseBox.h) {
      overviewExpanded = false;

      aggiornaVisibilitaPulsanti();
      return;
    }

    //  toggle( priorità)
    if (toggleBox &&
        mx >= toggleBox.x &&
        mx <= toggleBox.x + toggleBox.w &&
        my >= toggleBox.y &&
        my <= toggleBox.y + toggleBox.h) {
      viewMode = (viewMode === "parameters") ? "overview" : "parameters";
      return;
    }

    //  blocca tutti gli altri pulsanti 
    return;
  }

  //per rendere cliccabile l'icone 
  if (overviewBox &&
      mx >= overviewBox.x &&
      mx <= overviewBox.x + overviewBox.w &&
      my >= overviewBox.y &&
      my <= overviewBox.y + overviewBox.h) {
    overviewExpanded = true;
    return;
  }


  // DA QUI IN POI PAGINA TUA AURO !!!!!

  // pallini positivi
  for (let p of palliniInfo) {
    if (p.type === "pos" && p.catIndex !== null) {
      if (dist(mx, my, p.x, p.y) < diametroPallino / 2) {
        selectedCatIndex =
          selectedCatIndex === p.catIndex ? null : p.catIndex;
        return;
      }
    }
  }

  // pallini negativi (AddQ)
  for (let p of palliniInfo) {
    if (p.type === "neg") {
      if (dist(mx, my, p.x, p.y) < diametroPallino / 2) {
        selectedCatIndex =
          selectedCatIndex === 8 ? null : 8;
        return;
      }
    }
  }

  // legenda
  if (selectedCatIndex === null) {
    for (let area of legendHitAreas) {
      if (
        mx >= area.x &&
        mx <= area.x + area.w &&
        my >= area.y &&
        my <= area.y + area.h
      ) {
        selectedCatIndex =
          selectedCatIndex === area.catIndex ? null : area.catIndex;
        return;
      }
    }
  }

  // chiudi pannello domande
  if (backDetailArea) {
    if (
      mx >= backDetailArea.x &&
      mx <= backDetailArea.x + backDetailArea.w &&
      my >= backDetailArea.y &&
      my <= backDetailArea.y + backDetailArea.h
    ) {
      selectedCatIndex = null;
      return;
    }
  }

  // back home
  if (backHomeArea) {
    if (
      mx >= backHomeArea.x &&
      mx <= backHomeArea.x + backHomeArea.w &&
      my >= backHomeArea.y &&
      my <= backHomeArea.y + backHomeArea.h
    ) {
      window.history.back();
      return;
    }
  }
}


// funzione per creare i bottoni di navigazione in alto a destra
function creaBottoniNavigazione() {
  
  // Calcola il diametro del cerchio in base all'altezza della barra di ricerca
  const diametroBottone = 60;
  const raggio = diametroBottone / 2;
  
  // Posizionamento
  const margineDestro = 25; // Margine dal bordo destro
  const margineSinistro = 30; // Margine dal bordo sinistro
  const yPos = 40; // Stessa altezza verticale della barra di ricerca
  const spaziaturaTraBottoni = 20;

  // Variabile per la posizione Y comune dei tooltip (5px sotto il bottone)
  const yTooltip = yPos + diametroBottone + 10; 

  const biancoOpaco = 'rgba(234, 234, 216, 0.8)';
  
  // --- Stili CSS comuni per tutti i tooltip (AGGIORNATO BORDER-RADIUS) ---
  const stileTooltip = {
    'position': 'absolute',
    'background-color': biancoOpaco,
    'color': nero,
    'padding': '5px 10px 3px 10px',
    'border-radius': '15px', 
    'font-size': '14px',
    'font-family': 'NeueHaasDisplay, sans-serif', 
    'font-weight': 'normal',
    'white-space': 'nowrap',
    'z-index': '1003',
    'display': 'none' // Nascosto di default
  };

// --- 2. Bottone FH (Freedom House) ---

  let xFH = width - diametroBottone - margineDestro; 
  bottoneFH = createButton(''); // Rimosso 'FH'
  bottoneFH.position(xFH, yPos);
  
  // *** INSERIMENTO DELL'IMMAGINE FH ***
  // Trasforma l'oggetto p5.Image in una stringa base64 per usarlo nel tag <img>
  const immagineFH = iconaFh.canvas.toDataURL();
  bottoneFH.html(`<img src="${immagineFH}" alt="FH" style="width: 80%; height: 80%; object-fit: contain;">`); // Dimensioni 70% per un look più pulito

  // Stili del bottone (adattati per l'immagine)
  bottoneFH.style('width', diametroBottone + 'px');
  bottoneFH.style('height', diametroBottone + 'px');
  bottoneFH.style('border-radius', '50%'); 
  bottoneFH.style('background-color', nero); 
  bottoneFH.style('border', '1px solid' + bianco);
  bottoneFH.style('cursor', 'pointer');
  bottoneFH.style('z-index', '1000');
  bottoneFH.style('padding', '0');
  // Aggiunti per centrare l'immagine
  bottoneFH.style('display', 'flex'); 
  bottoneFH.style('align-items', 'center'); 
  bottoneFH.style('justify-content', 'center'); 
  
  // --- CREAZIONE TOOLTIP FH ---
  tooltipFH = createDiv('About FreedomHouse');
  for (let key in stileTooltip) {
    tooltipFH.style(key, stileTooltip[key]);
  }

  // --- GESTIONE HOVER FH (ALLINEATO A DESTRA) ---
  bottoneFH.mouseOver(() => {
      tooltipFH.style('display', 'block');
      let larghezzaTooltip = tooltipFH.elt.offsetWidth;
      
      // Posizione X: Bordo destro del bottone - Larghezza del tooltip
      let xAllineatoDestra = xFH + diametroBottone - larghezzaTooltip; 
      tooltipFH.position(xAllineatoDestra, yTooltip);
  });

  bottoneFH.mouseOut(() => {
      tooltipFH.style('display', 'none');
  });

  // Link
  bottoneFH.mousePressed(() => {
    window.location.href = 'freedomhouse.html';
  });
  
  // --- 3. Bottone ABOUT US
  
  let xUS = xFH - diametroBottone - spaziaturaTraBottoni; 
  bottoneUS = createButton('');
  bottoneUS.position(xUS, yPos);
  
  // *** INSERIMENTO DELL'IMMAGINE US ***
  // Trasforma l'oggetto p5.Image in una stringa base64 per usarlo nel tag <img>
  const immagineUS = iconaUs.canvas.toDataURL();
  bottoneUS.html(`<img src="${immagineUS}" alt="US" style="width: 80%; height: 80%; object-fit: contain;">`); // Dimensioni 70% per un look più pulito

  // Stili del bottone (adattati per l'immagine)
  bottoneUS.style('width', diametroBottone + 'px');
  bottoneUS.style('height', diametroBottone + 'px');
  bottoneUS.style('border-radius', '50%'); 
  bottoneUS.style('background-color', nero);
  bottoneUS.style('border', '1px solid' + bianco);
  bottoneUS.style('cursor', 'pointer');
  bottoneUS.style('z-index', '1000');
  bottoneUS.style('padding', '0');
  // Aggiunti per centrare l'immagine
  bottoneUS.style('display', 'flex'); 
  bottoneUS.style('align-items', 'center'); 
  bottoneUS.style('justify-content', 'center'); 
  
  // --- CREAZIONE TOOLTIP US ---
  tooltipUS = createDiv('About Us');
  for (let key in stileTooltip) {
    tooltipUS.style(key, stileTooltip[key]);
  }

  // --- GESTIONE HOVER US (CENTRATO) ---
  bottoneUS.mouseOver(() => {
      tooltipUS.style('display', 'block');
      let larghezzaTooltip = tooltipUS.elt.offsetWidth;
      // Posizione X: Inizio bottone + metà bottone - metà tooltip
      tooltipUS.position(xUS + diametroBottone / 2 - larghezzaTooltip / 2, yTooltip);
  });

  bottoneUS.mouseOut(() => {
      tooltipUS.style('display', 'none');
  });

  // Link
  bottoneUS.mousePressed(() => {
    window.location.href = 'us.html';
  });
}

// NUOVA FUNZIONE per creare il bottone "Torna Indietro"
function creaBottoneBack() {
  const diametroBottone = 60; // Stesso diametro dei bottoni US e FH
  const raggio = diametroBottone / 2; // Necessario per l'SVG
  const xPos = 40; // Allineato a sinistra
  const yPos = 40; 
  
  bottoneBack = createButton(''); // L'HTML viene impostato dall'SVG
  bottoneBack.position(xPos, yPos);
  
  // --- Contenuto SVG Freccia Sinistra (RIGA MANCANTE INCLUSA) ---
bottoneBack.html(`
    <svg width="${raggio}" height="${raggio}" viewBox="0 0 24 24" fill="none" stroke="${bianco}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line> 
      <polyline points="12 5 5 12 12 19"></polyline> 
    </svg>
  `);
  
  // --- Stile del bottone circolare (come US e FH) ---
  bottoneBack.style('width', diametroBottone + 'px');
  bottoneBack.style('height', diametroBottone + 'px');
  bottoneBack.style('border-radius', '50%'); 
  bottoneBack.style('background-color', nero);
  bottoneBack.style('border', '1px solid' + bianco);
  bottoneBack.style('display', 'flex'); 
  bottoneBack.style('align-items', 'center'); 
  bottoneBack.style('justify-content', 'center'); 
  bottoneBack.style('cursor', 'pointer');
  bottoneBack.style('z-index', '1002');
  bottoneBack.style('padding', '0'); 

  // Funzione per tornare alla pagina precedente nella cronologia del browser
  bottoneBack.mousePressed(() => {
    window.history.back();
  });
}

function drawTitle(){
  push();
  fill(bianco);
  noStroke();
  textSize(60);
  textFont(fontMedium);
  textAlign(LEFT, TOP);
  text(countryName, 110, 10); 
  pop();
}

// NUOVE FUNZIONI PER OVERVIEWCHART
//gradiente
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

//controlla se esiste almeno un anno con un punteggio negativo 

function totaleNegativo() {
  for (let d of countryData) {
    if (d.Total < 0) return true;
  }
  return false;
}


//grafico overview
function drawOverviewChart(area, data) {

  // ===== PADDING INTERNI AL RIQUADRO =====
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

  // asse y
  textFont(mioFont);
  textSize(10);
  fill(textColor);
  noStroke();

  for (let t = 0; t <= 100; t += 10) {
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
    translate(xStart + barW / 2, yBase + 35);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(30 * scale);
    fill(textColor);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }
}


//grafico  overviewper negativi 
function drawOverviewChartNegative(area, data) {

  // ===== PADDING INTERNI AL RIQUADRO =====
  const padL = 60;
  const padR = 40;
  const padT = 50;
  const padB = 80;

  const chartW = area.w - padL - padR;
  const chartH = area.h - padT - padB;

  // ===== layout base =====
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

  // asse y
  textFont(mioFont);
  textSize(10);
  fill(textColor);
  noStroke();
  textAlign(RIGHT, CENTER);

  // valori positivi sopra lo zero (0–80)
  for (let t = 0; t <= 80; t += 10) {
    const ty = map(t, 0, 100, 0, totalHeight);
    text(t, padL - 25, yZero - ty);
  }

  // valore negativo sotto lo zero
  text("-10", padL - 25, yZero + totalHeight * 0.12);

  // linea 0 
  const xLineStart = padL;
  const xLineEnd   = padL + spacing * (nYears - 1) + barW;

  stroke(lineColor);
  strokeWeight(2);
  line(
    xLineStart,
    yZero,
    xLineEnd,
    yZero
    );

  

  // ===== BARRE =====
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
      // ----- NEGATIVO (sotto lo zero)
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

    // ===== ANNO =====
    push();
    translate(xStart + barW / 2, padT + chartH + 35);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(30 * scale);
    fill(textColor);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }
}



//finestra grafico mini 
function drawOverviewMini() {

  // se è expanded, la mini non esiste
  if (overviewExpanded) return;

  let isNegative = overviewNegative();

  const baseW = 300;
  const baseH = 220;
  const zoom = 1.2;

  const w = baseW * zoom;
  const h = baseH * zoom;

  const margin = 52;

  const x = width / 2 - w / 2;

  const bottomOffset = 120; // quanto lo vuoi sollevare
  const y = height - h - margin - bottomOffset;

  


  overviewBox = { x, y, w, h };

  
  strokeWeight(1.5);
  stroke(bianco);
  fill(nero);
  
  rect(x, y, w, h, 20);
  fill(bianco);
  
  
  //per scalare correttamente 
  const sx = w / width;
  const sy = h / height;
  const innerYOffset = -20;//margine grafico -rettangol o

  push();
  translate(
  x + (w - width * sx) / 2,
  y + (h - height * sy) / 2 + innerYOffset
  );
  scale(sx, sy);


  if (isNegative) {
    drawOverviewChartMiniNegative(countryData);
  } else {
    drawOverviewChartMini(countryData);
  }
  
  pop();

  const iconOffsetX = 15;   // quanto esce a sinistra
  const iconOffsetY = 14;    // quanto scende sotto

  

  overviewBox.expandIcon = {
  x: overviewBox.x + iconOffsetX,
  y: overviewBox.y + overviewBox.h + iconOffsetY,
  size: 18
  };

  const iconX = overviewBox.x + iconOffsetX;
  const iconY = overviewBox.y + overviewBox.h + iconOffsetY +5;

 drawExpandIcon(
  overviewBox.expandIcon.x,
  overviewBox.expandIcon.y
);

// testo
push();
fill(bianco);
noStroke();
textFont(mioFont);
textSize(14);
textAlign(LEFT, CENTER);
text("Historical content available",
     overviewBox.expandIcon.x + 14,
     overviewBox.expandIcon.y);
pop();



}

function drawOverviewChartMini() {
  // layout base 
  let baseBarW = 20;
  let baseDotSize = 12;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize) * baseRows;
  let baseSpacing = 104;

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

  // tacche asse y -> solo 3
  let xScala = xStart - 35;
  for (let t = 0; t <= 100; t += 50) {
    let ty = yBase - map(t, 0, 100, 0, totalHeight);
    
    stroke(bianco);
    strokeWeight(2);
    
    line(xScala -5, ty, xScala + 5, ty);
    
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
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(35*scale);
    textFont(mioFont);
    fill(200);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }
}

//overview mini negativo 
function drawOverviewChartMiniNegative() {
  // layout base 
  let baseBarW = 20;
  let baseDotSize = 12;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize) * baseRows;
  let baseSpacing = 104;

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

  //3 tacche 
  let xScala = xStart - 35;
  for (let t = 0; t <= 100; t += 50) {
    let ty = yBase - map(t, 0, 100, 0, totalHeight);
    
    stroke(bianco);
    strokeWeight(2);
    
    line(xScala -5, ty, xScala + 5, ty);
    
  }

  


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
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(35*scale);
    textFont(mioFont);
    fill(textColor);
    text(d.year, 0, 0);
    pop();

    xStart += spacing;
  }

  

}

//versione grande
function drawOverviewExpanded() {

  // overlay
  fill(nero);
  noStroke();
  rect(0, 0, BASE_W, BASE_H);

  // box principale
  overviewBox = {
    x: 5, // cambia le posizioni rispetto al canva
    y: 50,
    w: BASE_W - 190, //cambia la larghezza del rettangolo con il contorno bianco
    h: BASE_H - 50 // cambia l'altezza
  };

  

  const chartArea = {
    x: overviewBox.x + 20, // cambiano le posizioni dell'area dedicata al grafico, m
    // ma attenzione cambia anche il rettangolo
    y: overviewBox.y + 60,
    w: overviewBox.w - 10,
    h: overviewBox.h - 70
  };

  noFill();
  stroke(bianco);
  strokeWeight(1.5);
  rect(chartArea.x, chartArea.y, chartArea.w, chartArea.h, 30);

  // targhette status
  if (viewMode === "overview") {

  const statuses = getStatusesInData(countryData);

  let tagX = overviewBox.x + overviewBox.w - 320; // sposto targhette 
  let tagY = overviewBox.y + overviewBox.h -90;

  const gap = 8;

  for (let status of statuses) {
  const colors = coloriStatus[status];
  const label  = statusLabels[status];
  if (!colors || !label) continue;

  const h = drawStatusTag(tagX, tagY - 26, label, colors);
  tagY -= (h + gap);
  }

  }




  // ===== AREA GRAFICO =====
  const offsetX = 20;  // → destra
  const offsetY = -15; // ↑ su



  let isNegative = overviewNegative();

 push();
translate(
  chartArea.x + offsetX,
  chartArea.y + offsetY
);

if (viewMode === "overview") {
  if (isNegative) {
    drawOverviewChartNegative(chartArea, countryData);
    
  } else {
    drawOverviewChart(chartArea, countryData);
  }
} else {
  if(isNegative){
    drawDotChartNegatives(chartArea,countryData, params);
  } else {
    drawDotChart(chartArea, countryData, params);
  }
  
}

pop();


  // testi
  drawOverviewText();

  // UI
  drawToggle();
  drawOverviewCloseButton();
}


//icona per ingrandire
function drawExpandIcon(x, y) {
  push();
  stroke(bianco);
  strokeWeight(2);
  noFill();
  rectMode(CENTER);
  rect(x, y, 18, 18, 4);
  line(x - 4, y - 4, x + 4, y + 4);
  pop();
}

//funzione per trovare overview negativi
function overviewNegative() {
  for (let d of countryData) {
    if (d.Total < 0) return true;
  }
  return false;
}

//paragrafi 
function drawCountryText(countryName, x, y, w) {
  let key = normalizeCountryName(countryName);

  let testo = countryTexts[key] || "";
  if (testo.trim() === "") return 0;

  textSize(16);
  textFont(mioFont);
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

  fill(textColor);
  noStroke();
  let textY = y;

  for (let line of lines) {
    text(line, x, textY);
    textY += lineHeight;
  }


  return boxH;
}


//funzione per disegnare il testo dei paragrafi
function drawOverviewText() {
  if (viewMode !== "overview") return;

  const w = 300;

  // posizione delle targhette
  const tagsTopY = overviewBox.y + overviewBox.h - 110;

  // altezza del paragrafo
  const textH = measureCountryTextHeight(countryName, w);

  if (textH === 0) return;
  

  const x = overviewBox.x + overviewBox.w - w - 20;

  // spazio per il titolo
  const titleH = 15;
  const gap = 10;

  // y ancorato dal basso (titolo + gap + testo)
  const y = tagsTopY - textH - titleH - gap - 40;

  // TITOLO
  push();
  textFont(mioFontBold);
  textSize(16);
  fill(textColor);
  noStroke();
  textAlign(LEFT, TOP);
  text("HISTORICAL CONTEXT", x, y);
  pop();

  // ===== PARAGRAFO =====
  drawCountryText(
    countryName,
    x,
    y + titleH + gap,
    w
  );
}




//toggle per switchare
function drawToggle() {
  if (!overviewExpanded) return;

  // posizione
  let x = overviewBox.x + overviewBox.w - 220;
  let y = overviewBox.y + overviewBox.h - 70;
  let w = 70;
  let h = 36;

  // sfondo toggle
  noFill();
  stroke(bianco);
  rect(x, y, w, h, 30);
  

  // labels
  noStroke();
  textFont(mioFont);
  textSize(14);
  textAlign(LEFT, CENTER);

  if (viewMode === "parameters") {
    fill(255);
    text("Parameters", x - 90, y + h / 2);
    fill(150);
    text("Total overview", x + w + 20, y + h / 2);
  } else {
    fill(150);
    text("Parameters", x - 90, y + h / 2);
    fill(255);
    text("Total overview", x + w + 20, y + h / 2);
  }

  // knob
  fill(bianco);
  let cx = (viewMode === "parameters") ? x + 14 : x + w - 14;
  circle(cx, y + h / 2, h - 6);

  // HITBOX
  toggleBox = { x, y, w, h };
}




//DOTCHART
function drawDotChart(area, data, params) {

  // layout base
  let baseDotSize = 12;
  let baseDotSpacing = 0;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize + baseDotSpacing) * baseRows;
  let baseColumnWidth = 2 * (baseDotSize + baseDotSpacing) + 50;// spaxio tra colonne

  let baseGrey = color(grigio);

  const localWidth  = area.w;
  const localHeight = area.h;

  // baseline locale
  let yBase = localHeight - bottomPadding -20; // cambi a20 per alzare o abbassare il grafico 

  // spazio disponibile
  let availableHeight = localHeight - bottomPadding - topPadding;
  let availableWidth  = localWidth  - 2 * padding;

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
  let xStart = padding -30 ;

  // ===== COLORI =====
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

  // ===== TACCHETTE ASSE Y =====
  textFont(mioFont);
  textSize(10);
  fill(textColor);
  noStroke();
  textAlign(RIGHT, CENTER);

  for (let t = 0; t <= 100; t += 10) {
    let ty = map(t, 0, 100, 0, totalHeight);
    text(t, textPadding -35, yBase - ty);
  }

  // ===== COLONNE (ANNI) =====
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

    // ===== DISEGNO 100 PALLINI (SERPENTINA) =====
    for (let dIdx = 0; dIdx < 100; dIdx++) {
      let row = floor(dIdx / 2);
      let col = dIdx % 2;
      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * (dotSize + dotSpacing);
      let y = yBase - row * (dotSize + dotSpacing);

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
    textSize(30* scale);
    fill(textColor);
    text(d.year, 0, 0);
    pop();

    xStart += columnSpacing;
  }
}

//dotchart nagativo 
function drawDotChartNegatives(area, data, params) {

  //layout di base 
  let baseDotSize = 12;
  let baseDotSpacing = 0;
  let baseRows = 50;
  let baseTotalHeight = (baseDotSize + baseDotSpacing) * baseRows;
  let baseColumnGap = 50;
  let baseColumnWidth = 2 * (baseDotSize + baseDotSpacing) + baseColumnGap;

  let baseGrey = color(grigio);

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

  // asse y tacche
  textFont(mioFont);
  textSize(10);
  fill(textColor);
  noStroke();
  textAlign(RIGHT, CENTER);

  for (let t = 0; t <= 80; t += 10) {
    let ty = map(t, 0, 100, 0, 50 * stepY);
    text(t, textPadding -35, yZero - ty);
  }

  // tacca -10
  text("-10", textPadding -35, yZero + 5.5 * stepY);

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

    // 80n palilini positivi 
    for (let dIdx = 0; dIdx < 80; dIdx++) {
      let row = floor(dIdx / 2);
      let col = dIdx % 2;
      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * stepY;
      let y = yZero - row * stepY;

      let c = isNegative ? baseGrey : dots[dIdx];
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
      xStart + stepY * 2 + 2.5,
      yZero + dotSize * 0.5
    );

    // pallini negativi 
    let negCount = isNegative ? min(abs(d.Total), 10) : 0;

    for (let n = 0; n < 10; n++) {
      let row = floor(n / 2);
      let col = n % 2;
      if (row % 2 === 1) col = 1 - col;

      let x = xStart + col * stepY;
      let y = yZero + (row + 1.2) * stepY;

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
    textSize(30 * scale);
    fill(textColor);
    text(d.year, 0, 0);
    pop();

    xStart += columnSpacing;
  }
}


// X per chiudere il grafico extended 
function drawOverviewCloseButton() {
  const size = 28;
  const paddingX = 30;
  const paddingY = 30;

  let x = overviewBox.x + overviewBox.w - size - 20;
  let y = overviewBox.y +80;


  // area cliccabile
  overviewCloseBox = {
    x: x - 10,
    y: y - 10,
    w: size + 20,
    h: size + 20
  };

  // disegno X
  push();
  stroke(bianco);
  strokeWeight(3);
  noFill();

  line(x, y, x + size, y + size);
  line(x + size, y, x, y + size);

  pop();
}

// per nascondere i pulsanti aboutus, home e freccia indietro
function aggiornaVisibilitaPulsanti() {
  if (overviewExpanded) {
    bottoneBack?.style('display', 'none');
    bottoneUS?.style('display', 'none');
    bottoneFH?.style('display', 'none');
  } else {
    bottoneBack?.style('display', 'flex');
    bottoneUS?.style('display', 'flex');
    bottoneFH?.style('display', 'flex');
  }
}

//funzione che capisce lo status pe rle targhette
function getStatusesInData(data) {
  const set = new Set();
  for (let d of data) {
    if (d.Status) set.add(d.Status);
  }
  return Array.from(set);
}

//targhette status 
function drawStatusTag(x, y, label, colors) {

  const paddingX = 14;
  const paddingY =6;
  const radius = 14;

  textFont(mioFontBold);
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
  fill(nero);
  text(label, x + paddingX, y + h / 2);

  return h; // utile per posizionare la prossima
}

//funzione per misurare la grandezza del paragrafo
function measureCountryTextHeight(countryName, w) {
  let key = normalizeCountryName(countryName);
  let testo = countryTexts[key] || "";
  if (testo.trim() === "") return 0;

  textFont(mioFont);
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