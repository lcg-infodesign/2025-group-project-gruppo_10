let scrollAmount = 0;
let targetScrollAmount = 0;

// testi fasi di scroll
const texts = [
    "che cos'è la libertà per te?",
    "che cos'è la libertà per Freedom House?",
    "libertà"
];

// testi fasi di scroll
const phase1Start = 300;   // inizio cancellazione "per te?"
const phase1End = 650;     // fine cancellazione
const phase2Start = 650;   // inizio aggiunta "per Freedom House?"
const phase2End = 1000;    // fine aggiunta
const phase3Start = 1200;  // inizio cancellazione resto del testo

function sketch(p) {

    p.setup = function() {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('p5-canvas-container'); 
    };

    p.draw = function() {
        p.background(10, 14, 39);

        // smoothing dello scroll 
        scrollAmount += (targetScrollAmount - scrollAmount) * 0.1;

        let displayText = texts[0];

        // SCROLL DEL TESTO
        if (scrollAmount < phase1Start) {
            displayText = texts[0];
        } else if (scrollAmount < phase1End) {
            // FASE 1: cancella "per te?"
            let deleteProgress = (scrollAmount - phase1Start) / (phase1End - phase1Start);
            displayText = deleteText(texts[0], deleteProgress);
        } else if (scrollAmount < phase2End) {
            // FASE 2: aggiunge "per Freedom House?"
            let addProgress = (scrollAmount - phase2Start) / (phase2End - phase2Start);
            displayText = addNewText(texts[0], texts[1], addProgress);
        } else if (scrollAmount < phase3Start) {
            // FASE 3: testo completo, in attesa della transizione finale
            displayText = texts[1];
        } else {
            // FASE 4: morfizza a "libertà"
            let morphProgress = p.min((scrollAmount - phase3Start) / 400, 1);
            displayText = morphToSingle(texts[1], texts[2], morphProgress);
        }

        // OUTPUT DEL TESTO
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        
        // ridimensionamento del testo in base alla larghezza della finestra
        let baseSize = p.windowWidth > 768 ? 64 : 40;
        let textSizeToUse = p.constrain(baseSize * (p.windowWidth / 1200), 30, 80);
        
        p.textSize(textSizeToUse);
        
        // disegna il testo al centro del canvas
        p.text(displayText, p.width / 2, p.height / 2);
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}

// funzioni di trasformazione del testo

function deleteText(text, progress) {
    // text = "che cos'è la libertà per te?"
    const stablePart = "che cos'è la libertà ";
    const toDelete = "per te?";
    
    // numero di caratteri da rimuovere (da sinistra a destra della parte da cancellare)
    let deleteCharsLeft = Math.floor(toDelete.length * progress);
    
    // mostra la parte stabile + quello che rimane della parte da cancellare
    let result = stablePart + toDelete.substring(deleteCharsLeft);
    return result;
}

function addNewText(text1, text2, progress) {
    // text1 = testo base (cancellato)
    // text2 = testo finale
    const stablePart = "che cos'è la libertà ";
    const toAdd = "per Freedom House?";
    
    // numero di caratteri da aggiungere
    let addCharsShown = Math.floor(toAdd.length * progress);
    
    // mostra la parte stabile + i nuovi caratteri
    let result = stablePart + toAdd.substring(0, addCharsShown);
    return result;
}

function morphToSingle(fullText, singleWord, progress) {
    // morfizza da testo lungo a "libertà"
    if (progress < 0.5) {
        // nella prima metà della transizione, scompare il testo
        return fullText;
    } else {
        // nella seconda metà, appare solo la parola
        return singleWord;
    }
}

// inizializza l'istanza p5.js
new p5(sketch);

// gestione dell'interazione con lo scroll

const MAX_SCROLL = 1600; // limite massimo dello scroll

window.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetScrollAmount += e.deltaY * 0.5;
    targetScrollAmount = Math.max(0, Math.min(targetScrollAmount, MAX_SCROLL));
}, { passive: false });

// supporto Touch
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    e.preventDefault(); // previene lo scroll nativo su touch
    const touchEndY = e.touches[0].clientY;
    const diff = touchStartY - touchEndY;
    targetScrollAmount += diff * 0.5;
    targetScrollAmount = Math.max(0, Math.min(targetScrollAmount, MAX_SCROLL));
    touchStartY = touchEndY;
}, { passive: false });
