// variabili di Stato
let scrollAmount = 0;
let targetScrollAmount = 0;

// testi
const texts = [
    "What is freedom to you?", 
    "What is freedom to FreedomHouse?", 
    "freedom"
];

// fasi di scroll 
const PHASE_WRITE_1_END = 300;     // fine scrittura del primo testo
const PHASE_DELETE_END = 400;      // fine cancellazione "you?"
const PHASE_WRITE_2_END = 700;     // fine scrittura "FreedomHouse?"
const PHASE_ISOLATE_START = 1000;  // inizio transizione finale
const MAX_SCROLL = 1600;           // limite massimo dello scroll

const BASE_FONT_SIZE = 64;         // dimensione base del font


// FUNZIONI DI TRASFORMAZIONE DEL TESTO
function deleteText(text, progress) {
    const stablePart = "What is freedom to ";
    const toDelete = "you?";
    // cancellazione è un inversione della scrittura -> si mostrano i caratteri rimanenti
    let charsToKeep = toDelete.length - Math.floor(toDelete.length * progress);
    let result = stablePart + toDelete.substring(0, charsToKeep);
    return result;
}

function addNewText(text1, text2, progress) {
    const stablePart = "What is freedom to ";
    const toAdd = "FreedomHouse?";
    
    let addCharsShown = Math.floor(toAdd.length * progress);
    let result = stablePart + toAdd.substring(0, addCharsShown);
    return result;
}


// SKETCH P5
function sketch(p) {

    p.setup = function() {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('p5-canvas-container'); 
        p.textAlign(p.CENTER, p.CENTER); 
        p.smooth();
    };

    p.draw = function() {
        p.background(0, 0, 0);
        
        // smoothing dello scroll
        scrollAmount += (targetScrollAmount - scrollAmount) * 0.1;

        let displayText = ""; // stringa vuota
        let showCursor = true; // cursore è sempre attivo tranne x animazione finale
        let x = p.width / 2;
        let y = p.height / 2;
        
        let currentFontSize = BASE_FONT_SIZE;

        //  FASI SCROLL
        if (scrollAmount < PHASE_WRITE_1_END) {
            // FASE 1 ->  scrivere "What is freedom to you?"
            let progress = p.map(scrollAmount, 0, PHASE_WRITE_1_END, 0, 1);
            let charsToShow = p.floor(texts[0].length * progress);
            displayText = texts[0].substring(0, charsToShow);
            
            if (progress >= 1.0) showCursor = false; // cursore è visibile finché la scrittura non è finita
            
        } else if (scrollAmount < PHASE_DELETE_END) {
            // FASE 2: cancellare "you?"
            let progress = p.map(scrollAmount, PHASE_WRITE_1_END, PHASE_DELETE_END, 0, 1);
            displayText = deleteText(texts[0], progress);
            
        } else if (scrollAmount < PHASE_WRITE_2_END) {
            // FASE 3: scrivere "FreedomHouse?"
            let progress = p.map(scrollAmount, PHASE_DELETE_END, PHASE_WRITE_2_END, 0, 1);
            displayText = addNewText(texts[0], texts[1], progress);
            
            if (progress >= 1.0) showCursor = false;
            
        } else if (scrollAmount < PHASE_ISOLATE_START) {
            // FASE 4: testo completo fisso in attesa
            displayText = texts[1];
            showCursor = false;
            
        } else {
            // FASE 5: morfizza a "freedom" 
            showCursor = false; // cursore spento
            let morphProgress = p.min((scrollAmount - PHASE_ISOLATE_START) / 400, 1);
            
            // dissolvenza
            let opacityLong = p.map(morphProgress, 0.0, 0.7, 255, 0);
            let opacityShort = p.map(morphProgress, 0.3, 1.0, 0, 255);
            
            let baseSize = p.windowWidth > 768 ? BASE_FONT_SIZE : 40;
            let currentBaseSize = p.constrain(baseSize * (p.width / 1200), 30, 80);
            let finalWordSize = p.map(morphProgress, 0.5, 1.0, currentBaseSize, currentBaseSize * 1.8);

            // disegno del testo lungo in dissolvenza
            if (morphProgress < 0.7) {
                p.fill(255, p.constrain(opacityLong, 0, 255));
                p.textSize(currentBaseSize);
                p.text(texts[1], x, y);
            }
            
            // "freedom" in apparizione
            if (morphProgress > 0.3) {
                p.fill(255, p.constrain(opacityShort, 0, 255));
                p.textSize(finalWordSize);
                p.text(texts[2], x, y);
            }
            
            return; 
        }

        // CURSORE -> acceso se in fase di scrittura 
        if (showCursor && p.frameCount % 30 < 15) {
            displayText += '|';
        }

        // OUTPUT DEL TESTO FINALE
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        // auto-ridimensionamento di base
        let baseSize = p.windowWidth > 768 ? BASE_FONT_SIZE : 40;
        currentFontSize = p.constrain(baseSize * (p.width / 1200), 30, 80);
        
        p.textSize(currentFontSize);
        p.textFont('Arial, sans-serif');
        
        p.text(displayText, x, y);
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}

new p5(sketch);

// GESTIONE DELL'INTERAZIONE CON LO SCROLL
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetScrollAmount += e.deltaY * 0.5;
    targetScrollAmount = Math.max(0, Math.min(targetScrollAmount, MAX_SCROLL));
}, { passive: false });

// touch
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    e.preventDefault(); 
    const touchEndY = e.touches[0].clientY;
    const diff = touchStartY - touchEndY;
    targetScrollAmount += diff * 0.5;
    targetScrollAmount = Math.max(0, Math.min(targetScrollAmount, MAX_SCROLL));
    touchStartY = touchEndY;
}, { passive: false });