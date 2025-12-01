// variabili di stato
let scrollAmount = 0;
let targetScrollAmount = 0;

// testi
const texts = [
    "What is freedom to you?", 
    "What is freedom to FreedomHouse?", 
    "FreedomHouse", 
    " is founded on the core conviction that freedom flourishes in democratic nations where governments are accountable to their people.."
];

// fasi di scroll 
const PHASE_WRITE_1_END = 300;     // 1 - fine scrittura del primo testo
const PHASE_DELETE_END = 400;      // 2 - fine cancellazione "you?"
const PHASE_WRITE_2_END = 700;     // 3 - fine scrittura "FreedomHouse?"
const PHASE_ISOLATE_START = 1000;  // 4 - inizio: "What is freedom to FreedomHouse?" scompare.
const PHASE_ZOOM_OUT = 1300;       // 5 - fine: "FreedomHouse" finisce di rimpicciolirsi.
const MAX_SCROLL = 3000;           // 6 - limite massimo dello scroll per la scrittura lunga

const BASE_FONT_SIZE = 64;         // dimensione base del font


// FUNZIONI DI TRASFORMAZIONE DEL TESTO
function deleteText(text, progress) {
    const stablePart = "What is freedom to ";
    const toDelete = "you?";
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
        
        // --- CALCOLO DIMENSIONI BASE ---
        let baseSize = p.windowWidth > 768 ? BASE_FONT_SIZE : 40;
        let currentFontSize = p.constrain(baseSize * (p.width / 1200), 30, 80);
        
        // variabili per il cursore 
        let finalFontSize = currentFontSize;
        let cursorX = x;
        let cursorY = y;
        
        // variabili di stato usate nelle fasi 5 - 6
        const maxLineWidth = p.width * 0.8; 
        
        let shrinkProgress = 0;
        let writeProgress = 0;
        let finalExplanationLines = [];
        let lineHeight = 0;
        let xStartLeft = 0;
        let explanationYStart = 0;
        let explanationSize = currentFontSize; 

        //  FASI SCROLL
        if (scrollAmount < PHASE_WRITE_1_END) {
            // FASE 1 ->  scrivere "What is freedom to you?"
            let progress = p.map(scrollAmount, 0, PHASE_WRITE_1_END, 0, 1);
            let charsToShow = p.floor(texts[0].length * progress);
            displayText = texts[0].substring(0, charsToShow);
            
            if (progress >= 1.0) showCursor = false;
            
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
            // FASE 4: testo completo fisso 
            displayText = texts[1];
            showCursor = false;
            
        } else if (scrollAmount < PHASE_ZOOM_OUT) {
            // FASE 5: scomparsa frase lunga e rimpicciolimento di "FreedomHouse"
            
            // transizione di "FreedomHouse" -> appare grande, si rimpicciolisce
            shrinkProgress = p.map(scrollAmount, PHASE_ISOLATE_START, PHASE_ZOOM_OUT, 0, 1);
            
            // dimensione del font: da 2.5x a 1x (currentFontSize)
            let currentPhaseFontSize = p.map(shrinkProgress, 0, 1, currentFontSize * 2.5, currentFontSize);
            let opacityWord = p.map(shrinkProgress, 0, 0.2, 0, 255); // appare velocemente
            
            p.fill(255, p.constrain(opacityWord, 0, 255));
            p.textSize(currentPhaseFontSize);
            p.textAlign(p.CENTER, p.CENTER);
            
            // disegna la parola isolata
            p.text(texts[2], x, y); 
            showCursor = false;
            
        } else {
            // FASE 6: scrittura frase lunga
            showCursor = true;
            
            let writeProgress = p.map(scrollAmount, PHASE_ZOOM_OUT, MAX_SCROLL, 0, 1);
            writeProgress = p.constrain(writeProgress, 0, 1);

            // dimensione normale (spaziata)
            p.textSize(explanationSize);
            finalFontSize = explanationSize;
            
            // testo completo da mostrare: "FreedomHouse" + testo lungo
            const fullTextToShow = texts[2] + texts[3];
            let tempText = fullTextToShow.substring(0, p.floor(fullTextToShow.length * writeProgress));

            // suddividiamo il testo lungo per adattarlo allo schermo
            finalExplanationLines = tempText.split(' ').reduce((acc, word) => {
                if (acc.length === 0) acc.push('');
                let lastLine = acc[acc.length - 1];
                let testLine = lastLine ? lastLine + " " + word : word;
                
                p.textSize(explanationSize); 
                if (p.textWidth(testLine) > maxLineWidth) {
                    acc.push(word);
                } else {
                    acc[acc.length - 1] = testLine;
                }
                return acc;
            }, ['']);
            
            // centriamo il blocco di testo multiriga
            let maxWidth = 0;
            for (let line of finalExplanationLines) {
                maxWidth = p.max(maxWidth, p.textWidth(line));
            }

            lineHeight = explanationSize * 1.5;
            const totalHeight = finalExplanationLines.length * lineHeight;
            
            explanationYStart = p.height / 2 - totalHeight / 2;
            xStartLeft = p.width / 2 - maxWidth / 2;
            
            p.fill(255);
            p.textAlign(p.LEFT, p.TOP); 
            
            // disegna ogni riga separatamente
            for (let i = 0; i < finalExplanationLines.length; i++) {
                let lineY = explanationYStart + i * lineHeight;
                p.text(finalExplanationLines[i], xStartLeft, lineY);
            }

            // posizionamento cursore fase 6 
            let finalLine = finalExplanationLines[finalExplanationLines.length - 1];
            let cursorTextWidth = p.textWidth(finalLine);
            cursorX = xStartLeft + cursorTextWidth + 5;
            cursorY = explanationYStart + (finalExplanationLines.length - 1) * lineHeight; 

            if (writeProgress >= 1.0) showCursor = false;
        }

        // OUTPUT DEL TESTO (per le fasi 1-4)
        if (scrollAmount < PHASE_ISOLATE_START) {
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(currentFontSize);
            p.textFont('Arial, sans-serif');
            p.text(displayText, x, y);
        }

        // --- CURSORE UNIFICATO ---
        if (showCursor) {
            
            // 1. calcolo della posizione per le Fasi 1-4 (testo centrato monoriga)
            if (scrollAmount < PHASE_ZOOM_OUT) { 
                p.textSize(currentFontSize); 
                let cursorTextWidth = p.textWidth(displayText);
                
                cursorX = p.width / 2 + cursorTextWidth / 2 + 5; 
                cursorY = p.height / 2;
                finalFontSize = currentFontSize;
                
                // --> la posizione Y del rettangolo deve essere centrata per il testo monoriga.
                let rectY = cursorY - (finalFontSize * 1.1) / 2;
                
            } else {
                // 2. FASE 6: scrittura del testo lungo (testo allineato a sinistra, top-allineato)
                
                // --> la posizione Y del rettangolo è semplicemente cursorY (l'inizio della riga),
                // perché il testo è allineato in alto (TOP) in FASE 6.
                let rectY = cursorY;
            }
            
            // disegno del cursore
            if (showCursor) {
                const cursorWidth = 3;
                const cursorHeight = finalFontSize * 1.1; 
                
                // centratura verticale per fasi 1-4
                let rectY = cursorY;
                if (scrollAmount < PHASE_ZOOM_OUT) {
                   // fasi 1-4 
                   rectY = cursorY - cursorHeight / 2;
                }
                // fase 6
                
                if (p.frameCount % 30 < 15) { 
                    p.fill(255); 
                } else {
                    p.fill(0); 
                }
                
                p.noStroke();
                p.rect(cursorX, rectY, cursorWidth, cursorHeight); 
            }
        }
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