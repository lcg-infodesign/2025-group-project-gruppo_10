// variabili di stato
let scrollAmount = 0;
let targetScrollAmount = 0;

// testi
const texts = [
    "What is freedom to you?", 
    "What is freedom to FreedomHouse?", 
    // testo lungo 1
    "FreedomHouse is founded on the core conviction that freedom flourishes in democratic nations where governments are accountable to their people.",
    // testo lungo 2
    "Copper oxidation represents the degradation of the freedom of the countries of the world." 
];

// fasi di scroll 
const PHASE_WRITE_1_END = 300;          // 1 - fine scrittura del primo testo
const PHASE_DELETE_END = 400;           // 2 - fine cancellazione "you?"
const PHASE_WRITE_2_END = 700;          // 3 - fine scrittura "FreedomHouse?" 
const PHASE_FADE_OUT_Q_END = 900;       // 4 - fade out della domanda 
const PHASE_FADE_IN_1_END = 1800;       // 5 - fade in testo lungo 1
const PHASE_FADE_OUT_1_END = 2300;      // 6 - fade out testo lungo 1 
const PHASE_WRITE_2_END_TYPING = 4800;  // 7 - fine typing  testo lungo 2
const MAX_SCROLL = 5000;                // 8 - limite massimo dello scroll finale

const BASE_FONT_SIZE = 64;              // dimensione base del font


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
        p.textFont('Arial, sans-serif');
    };
    
    // funzione helper per formattare il testo su più righe
    function formatTextForScreen(text, fontSize, maxWidth) {
        p.textSize(fontSize);
        return text.split(' ').reduce((acc, word) => {
            if (acc.length === 0) acc.push('');
            let lastLine = acc[acc.length - 1];
            let testLine = lastLine ? lastLine + " " + word : word;
            
            if (p.textWidth(testLine) > maxWidth) {
                acc.push(word);
            } else {
                acc[acc.length - 1] = testLine;
            }
            return acc;
        }, ['']);
    }

    p.draw = function() {
        p.background(0, 0, 0);
        
        // smoothing dello scroll
        scrollAmount += (targetScrollAmount - scrollAmount) * 0.1;

        let displayText = ""; 
        let showCursor = true; 
        let x = p.width / 2;
        let y = p.height / 2;
        
        //  calcolo dimensioni base
        let baseSize = p.windowWidth > 768 ? BASE_FONT_SIZE : 40;
        let currentFontSize = p.constrain(baseSize * (p.width / 1200), 30, 80);
        
        // variabili per il cursore 
        let finalFontSize = currentFontSize;
        let cursorX = x;
        let cursorY = y;
        
        // variabili di stato usate per la formattazione dei testi lunghi
        const maxLineWidth = p.width * 0.8; 
        const explanationSize = currentFontSize; 
        const lineHeight = explanationSize * 1.5;
        
        // Testi lunghi
        const fullText1 = texts[2]; // testo lungo 1
        const fullText2 = texts[3]; // testo lungo 2

        // variabili posizionamento testo lungo 1 
        let lines1 = formatTextForScreen(fullText1, explanationSize, maxLineWidth);
        let maxWidth1 = lines1.reduce((max, line) => p.max(max, p.textWidth(line)), 0);
        let totalHeight1 = lines1.length * lineHeight;
        let xStartLeft1 = p.width / 2 - maxWidth1 / 2;
        let explanationYStart1 = p.height / 2 - totalHeight1 / 2;

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
            
        } else if (scrollAmount < PHASE_FADE_OUT_Q_END) {
            // FASE 4: fade out frase interrogativa
            showCursor = false;
            let fadeOutProgress = p.map(scrollAmount, PHASE_WRITE_2_END, PHASE_FADE_OUT_Q_END, 0, 1);
            
            p.fill(255, p.map(fadeOutProgress, 0, 1, 255, 0));
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(currentFontSize);
            p.text(texts[1], x, y);
            
        } else if (scrollAmount < PHASE_FADE_IN_1_END) {
            // FASE 5: fade-in testo lungo 1
            showCursor = false; 
            
            let fadeInProgress = p.map(scrollAmount, PHASE_FADE_OUT_Q_END, PHASE_FADE_IN_1_END, 0, 1);
            let opacity = p.map(fadeInProgress, 0, 1, 0, 255);
            
            p.fill(255, opacity);
            p.textSize(explanationSize);

            p.textAlign(p.LEFT, p.TOP); 
            for (let i = 0; i < lines1.length; i++) {
                p.text(lines1[i], xStartLeft1, explanationYStart1 + i * lineHeight);
            }
            
        } else if (scrollAmount < PHASE_FADE_OUT_1_END) {
            // FASE 6: fade-out testo lungo 1
            showCursor = false; 
            
            let fadeOutProgress = p.map(scrollAmount, PHASE_FADE_IN_1_END, PHASE_FADE_OUT_1_END, 0, 1);
            let opacity = p.map(fadeOutProgress, 0, 1, 255, 0);
            
            p.fill(255, opacity);
            p.textSize(explanationSize);

            p.textAlign(p.LEFT, p.TOP); 
            for (let i = 0; i < lines1.length; i++) {
                p.text(lines1[i], xStartLeft1, explanationYStart1 + i * lineHeight);
            }

        } else {
            // FASE 7: typing testo lungo 2 CON GRADIENTE DI COLORE
            let writeProgress = p.map(scrollAmount, PHASE_FADE_OUT_1_END, PHASE_WRITE_2_END_TYPING, 0, 1);
            writeProgress = p.constrain(writeProgress, 0, 1);
            
            showCursor = writeProgress < 1.0; 
            finalFontSize = explanationSize;

            // colori per il gradiente: azzurrino -> rame
            const START_COLOR = p.color(173, 216, 230); // azzurrino
            const END_COLOR = p.color(184, 115, 51);   // rame

            const allWords = fullText2.split(' ');
            const totalChars = fullText2.length;
            let writtenChars = p.floor(totalChars * writeProgress);
            let charCounter = 0; // contatore globale dei caratteri disegnati

            p.textSize(explanationSize);
            p.textAlign(p.LEFT, p.TOP); 

            // 1. pre-calcolo delle righe (per il corretto posizionamento)
            let currentLine = '';
            let lines2 = [];
            for (const word of allWords) {
                let testLine = currentLine ? currentLine + " " + word : word;
                if (p.textWidth(testLine) > maxLineWidth && currentLine !== '') {
                    lines2.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) lines2.push(currentLine);

            // calcolo del posizionamento Y centrato
            let totalHeight2 = lines2.length * lineHeight;
            let explanationYStart2 = p.height / 2 - totalHeight2 / 2;
            let maxWidth2 = lines2.reduce((max, line) => p.max(max, p.textWidth(line)), 0);
            let xStartLeft2 = p.width / 2 - maxWidth2 / 2;

            // 2. disegno finale con gradiente e limite di scrittura
            let cursorXFinal = xStartLeft2;
            let cursorYFinal = explanationYStart2;

            let xPos = 0; // posizione X all'interno della riga corrente
            let lineIndex = 0;
            
            for (let i = 0; i < allWords.length; i++) {
                const word = allWords[i];
                
                let isFirstWordInLine = (xPos === 0);
                let wordWidth = p.textWidth(word);
                let spaceWidth = isFirstWordInLine ? 0 : p.textWidth(' '); 
                let charOffset = isFirstWordInLine ? 0 : 1; // 1 per lo spazio

                // controllo per il passaggio alla nuova riga
                if (lineIndex < lines2.length && xStartLeft2 + xPos + wordWidth + spaceWidth > xStartLeft2 + maxLineWidth && !isFirstWordInLine) {
                    xPos = 0; // reset X
                    lineIndex++; // nuova riga
                    isFirstWordInLine = true;
                    spaceWidth = 0;
                    charOffset = 0;
                }
                
                let wordXStart = xStartLeft2 + xPos + spaceWidth;
                let wordY = explanationYStart2 + lineIndex * lineHeight;
                
                // disegna lo spazio (se non è la prima parola)
                if (!isFirstWordInLine && charCounter < writtenChars) {
                    charCounter++;
                }

                // disegna i caratteri della parola
                for (let j = 0; j < word.length; j++) {
                    const char = word[j];
                    
                    if (charCounter < writtenChars) {
                        // interpolazione del colore basata sul progresso globale
                        let charProgress = charCounter / (totalChars - 1); 
                        let r = p.lerp(p.red(START_COLOR), p.red(END_COLOR), charProgress);
                        let g = p.lerp(p.green(START_COLOR), p.green(END_COLOR), charProgress);
                        let b = p.lerp(p.blue(START_COLOR), p.blue(END_COLOR), charProgress);
                        
                        p.fill(r, g, b);
                        
                        // disegna il carattere
                        p.text(char, wordXStart, wordY);
                        
                        // aggiorna la posizione X per il carattere successivo
                        wordXStart += p.textWidth(char);
                        
                        // aggiorna il contatore globale
                        charCounter++;
                        
                        // memorizza la posizione del cursore
                        cursorXFinal = wordXStart + 5;
                        cursorYFinal = wordY;
                    } else {
                        // posiziona il cursore sul carattere non ancora scritto
                        cursorXFinal = wordXStart + 5;
                        cursorYFinal = wordY;
                        
                        // termina il disegno della parola
                        i = allWords.length; // forza uscita dal ciclo esterno
                        break; 
                    }
                }

                // aggiorna la posizione X per la prossima parola
                xPos += wordWidth + spaceWidth;
                
                // se la scrittura è terminata, usciamo dal ciclo
                if (charCounter >= writtenChars) {
                    break;
                }
            }

            // imposta la posizione finale del cursore
            cursorX = cursorXFinal;
            cursorY = cursorYFinal;
        }

        // OUTPUT DEL TESTO --> fasi 1-3
        // eseguito SOLO FINO alla fine della fase di scrittura interrogativa
        if (scrollAmount < PHASE_WRITE_2_END) { 
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(currentFontSize);
            p.text(displayText, x, y);
        }

        // --- CURSORE UNIFICATO ---
        if (showCursor) {
            
            // 1. calcolo della posizione per le fasi 1-3 (testo centrato monoriga)
            if (scrollAmount < PHASE_FADE_OUT_Q_END || scrollAmount > PHASE_FADE_OUT_1_END) { 
                
                // cursore fasi 1 - 3
                if (scrollAmount < PHASE_FADE_OUT_Q_END) {
                    p.textSize(currentFontSize); 
                    let cursorTextWidth = p.textWidth(displayText);
                    
                    cursorX = p.width / 2 + cursorTextWidth / 2 + 5; 
                    cursorY = p.height / 2;
                    finalFontSize = currentFontSize;
                }
                

                // disegno del cursore
                const cursorWidth = 3;
                const cursorHeight = finalFontSize * 1.1; 
                
                let rectY = cursorY;
                
                if (scrollAmount < PHASE_FADE_OUT_Q_END) {
                   // fasi 1-3 
                   rectY = cursorY - cursorHeight / 2;
                }
                // fase 7: rectY è l'inizio della riga 
                
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