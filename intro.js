// variabili di stato
let scrollAmount = 0;
let targetScrollAmount = 0;

// testi
const texts = [
    "What is freedom to you?",
    "What is freedom to FreedomHouse?",
    // testo lungo 1
    "FreedomHouse is financed by American government and is founded on the core conviction that freedom flourishes in democratic nations where governments are accountable to their people.",
    // testo lungo 2
    "Copper oxidation represents the degradation of the freedom of the countries of the world.",
    "Discover our site here:"
];

// fasi di scroll
const PHASE_WRITE_1_END = 300;              // 1 - fine scrittura del primo testo
const PHASE_DELETE_END = 400;               // 2 - fine cancellazione "you?"
const PHASE_WRITE_2_END = 550;              // 3 - fine scrittura "FreedomHouse?" 
const PHASE_FADE_OUT_Q_END = 600;           // 4 - fade out della domanda 
const PHASE_TEXT_1_START = 650;             // 5 - inizio fade-in testo 1 + img 1
const PHASE_TEXT_1_END = 1200;              // 6 -  fine fade-out testo 1 + img 1
const PHASE_WRITE_2_START = 1250;           // 7 - inizio typing testo 2 + img 2 
const PHASE_WRITE_2_END_TYPING = 3500;      // 8 - fine typing testo 2
const PHASE_FADE_OUT_2_END = 3800;          // 9 - fine fade-out testo 2 + img 2 
const PHASE_BUTTON_SHOW = 4100;            // 10 - bottone link pagina generalissima

const MAX_SCROLL = 4500;                   // limite massimo dello scroll finale
const BASE_FONT_SIZE = 45;                 // dimensione base del font 


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

    let button;
    let img1Element;
    let img2Element;
    
    p.setup = function() {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('p5-canvas-container');
        p.textAlign(p.CENTER, p.CENTER);
        p.smooth();
        p.textFont('NeueHaasDisplayRoman');

        img1Element = p.select('#img-liberty-1'); // rame.png 
        img2Element = p.select('#img-liberty-2'); // rame_o2.png 
            
        button = p.createButton('Visit Site'); // testo bottone link
        button.parent('p5-canvas-container');
        button.id('linkButton');
        button.attribute('href', 'URL_DEL_TUO_SITO_WEB_QUI');
        button.style('opacity', 0);
        button.hide();
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
        
        // X centrata dello schermo
        let x = p.width / 2;
        let y = p.height / 2;
        
        // calcolo dimensioni base (standardizzata per TUTTI i testi)
        let baseSize = p.windowWidth > 768 ? BASE_FONT_SIZE : 40;
        let currentFontSize = p.constrain(baseSize * (p.width / 1200), 30, 80);
        
        // variabili per i testi lunghi 
        const lineHeight = currentFontSize * 1.3; // interlinea generale x tutti i testi
        const lineHeight1 = currentFontSize * 0.9; // interlinea testo lungo 1
        const contentWidth = p.width * 0.5;
        const maxLineWidth = contentWidth * 0.8;
        
        // posizione X: centro della colonna di destra
        const xContentCenter = p.width * 0.75;
        
        // variabili per il cursore 
        let finalFontSize = currentFontSize;
        let cursorX = x;
        let cursorY = y;
        
        // testi
        const fullText1 = texts[2];
        const fullText2 = texts[3];
        const invitationText = texts[4];

        // variabili posizionamento testo lungo 1 (DA DESTRA)
        let lines1 = formatTextForScreen(fullText1, currentFontSize, maxLineWidth);
        let maxWidth1 = lines1.reduce((max, line) => p.max(max, p.textWidth(line)), 0);
        let xStartLeft1 = xContentCenter - maxWidth1 / 2;
        let totalHeight1 = lines1.length * lineHeight;
        let explanationYStart1 = p.height / 2 - totalHeight1 / 2;
        
        // variabili posizionamento testo lungo 2 (DA DESTRA)
        const allWords = fullText2.split(' ');
        let lines2 = [];
        let currentLine = '';
        p.textSize(currentFontSize);
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
        let maxWidth2 = lines2.reduce((max, line) => p.max(max, p.textWidth(line)), 0);
        let xStartLeft2 = xContentCenter - maxWidth2 / 2;
        let totalHeight2 = lines2.length * lineHeight;
        let explanationYStart2 = p.height / 2 - totalHeight2 / 2;

        //  opacità immagini
        if (img1Element && img2Element) {
            img1Element.style('opacity', 0);
            img2Element.style('opacity', 0);
        }

        //  FASI SCROLL
        if (scrollAmount < PHASE_WRITE_1_END) {
            // FASE 1 -> scrivere "What is freedom to you?"
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
            
        } else if (scrollAmount < PHASE_TEXT_1_END) {
            // FASE 5: Testo lungo 1 + img 1 
            showCursor = false;

            // calcola il progresso di FADE-IN e FADE-OUT all'interno dello stesso intervallo
            let fadeInStart = PHASE_FADE_OUT_Q_END;
            let fadeInEnd = PHASE_TEXT_1_START + 20; // tempo di fade-in 20 unità scroll
            let fadeOutStart = PHASE_TEXT_1_END - 200; // inizia a sbiadire 200 unità prima della fine
            let fadeOutEnd = PHASE_TEXT_1_END; 

            let opacity = 255;

            if (scrollAmount < fadeInEnd) {
                // fase di fade-in
                let fadeInProgress = p.map(scrollAmount, fadeInStart, fadeInEnd, 0, 1);
                opacity = p.map(fadeInProgress, 0, 1, 0, 255);
            } else if (scrollAmount > fadeOutStart) {
                // fase di fade-out
                let fadeOutProgress = p.map(scrollAmount, fadeOutStart, fadeOutEnd, 0, 1);
                opacity = p.map(fadeOutProgress, 0, 1, 255, 0);
            } else {
                // stato stabile
                opacity = 255;
            }

            // disegna testo 1
            p.fill(255, opacity);
            p.textSize(currentFontSize); 
            p.textAlign(p.LEFT, p.TOP);
            for (let i = 0; i < lines1.length; i++) {
                p.text(lines1[i], xStartLeft1, explanationYStart1 + i * lineHeight);
            }

            // sincronizza img 1 
            if (img1Element) {
                // usiamo l'opacità del testo anche per l'immagine
                img1Element.style('opacity', p.constrain(opacity / 255, 0, 1));
            }
            
        } else if (scrollAmount < PHASE_FADE_OUT_2_END) {
            // FASE 7 & 8: typing del testo 2 e fade-out img 2 
            
            // 7A: calcola il progresso di scrittura
            let writeProgress = p.map(scrollAmount, PHASE_WRITE_2_START, PHASE_WRITE_2_END_TYPING, 0, 1);
            writeProgress = p.constrain(writeProgress, 0, 1);

            // 7B: calcola il progresso di fade-out (attivo solo dopo la scrittura)
            let fadeOutProgress = 0;
            if (scrollAmount >= PHASE_WRITE_2_END_TYPING) {
                fadeOutProgress = p.map(scrollAmount, PHASE_WRITE_2_END_TYPING, PHASE_FADE_OUT_2_END, 0, 1);
            }
            // calcola l'opacità finale del testo
            let finalOpacity = p.map(fadeOutProgress, 0, 1, 255, 0);

            // calcola il fade-in iniziale per l'Immagine 2 (per farla apparire prima del typing)
            let imageFadeInStart = PHASE_TEXT_1_END; // inizia appena finisce il testo 1
            let imageFadeInEnd = PHASE_WRITE_2_START + 50; // fade-in molto veloce
            let imageOpacity = 0;

            if (scrollAmount < imageFadeInEnd) {
                // fase di fade-in img 2 
                let fadeInProgress = p.map(scrollAmount, imageFadeInStart, imageFadeInEnd, 0, 1);
                imageOpacity = p.map(fadeInProgress, 0, 1, 0, 255);
            } else {
                // dopo il fade-in, l'opacità dell'immagine segue il fade-out del testo
                imageOpacity = finalOpacity;
            }

            // sincronizza img 2
            if (img2Element) {
                img2Element.style('opacity', p.constrain(imageOpacity / 255, 0, 1));
            }
            
            showCursor = writeProgress < 1.0;
            finalFontSize = currentFontSize;

            // colori per il gradiente: azzurrino -> rame 
            const START_COLOR = p.color(145, 162, 166, finalOpacity); // azzurrino
            const END_COLOR = p.color(199, 99, 81, finalOpacity); // rame
            
            const totalChars = fullText2.length;
            let writtenChars = p.floor(totalChars * writeProgress);
            let charCounter = 0;

            p.textSize(currentFontSize); 
            p.textAlign(p.LEFT, p.TOP);
            
            let xPos = 0;
            let lineIndex = 0;
            
            for (let i = 0; i < allWords.length; i++) {
                const word = allWords[i];
                
                let isFirstWordInLine = (xPos === 0);
                let wordWidth = p.textWidth(word);
                let spaceWidth = isFirstWordInLine ? 0 : p.textWidth(' ');

                // controllo per il passaggio alla nuova riga
                if (lineIndex < lines2.length && xStartLeft2 + xPos + wordWidth + spaceWidth > xStartLeft2 + maxLineWidth && !isFirstWordInLine) {
                    xPos = 0;
                    lineIndex++;
                    isFirstWordInLine = true;
                    spaceWidth = 0;
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
                        let a = p.alpha(START_COLOR); // usa opacità calcolata

                        p.fill(r, g, b, a);
                        
                        p.text(char, wordXStart, wordY);
                        
                        const charWidth = p.textWidth(char);
                        wordXStart += charWidth;
                        charCounter++;
                        
                        cursorX = wordXStart; 
                        cursorY = wordY;
                    } else {
                        // quando la scrittura si ferma, il cursore deve stare alla fine dell'ultima parola scritta
                        cursorX = wordXStart + 5;
                        cursorY = wordY;
                        i = allWords.length;
                        break;
                    }
                }
                
                
                xPos += wordWidth + spaceWidth;
                
                if (charCounter >= writtenChars) {
                    break;
                }
            }
            
            // ricalcoliamo solo la posizione Y per il cursore
            if (writeProgress < 1.0) {
                 cursorY = explanationYStart2 + lineIndex * lineHeight + (currentFontSize * 0.5); 
            } else {
                 cursorY = explanationYStart2 + lineIndex * lineHeight;
            }
           
            // correzione finale per il posizionamento del cursore del testo 2
            cursorX += 5; // aggiunge lo spazio per il cursore dopo la parola

        } else if (scrollAmount < PHASE_BUTTON_SHOW) {
            // FASE 9: fade-in del testo invito e del bottone 
            showCursor = false;
            
            let fadeInProgress = p.map(scrollAmount, PHASE_FADE_OUT_2_END, PHASE_BUTTON_SHOW, 0, 1);
            fadeInProgress = p.constrain(fadeInProgress, 0, 1);

            let finalOpacity = p.map(fadeInProgress, 0, 1, 0, 255);
            
            // disegno del testo invito
            p.fill(255, finalOpacity);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(currentFontSize);
            const invitationY = p.height / 2 - 40;
            p.text(invitationText, x, invitationY);
            
            // gestione del bottone
            if (button) {
                const buttonX = x;
                const buttonY = p.height / 2 + 40;
                
                button.style('opacity', finalOpacity / 255);
                button.position(buttonX - button.width / 2, buttonY - button.height / 2);
                button.show();
            }

        } else {
            // FASE 10: stato finale, tutto visibile 
            showCursor = false;
            
            // testo finale
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(currentFontSize);
            const invitationY = p.height / 2 - 40;
            p.text(invitationText, x, invitationY);

            // bottone
            if (button) {
                const buttonX = x;
                const buttonY = p.height / 2 + 40;
                button.style('opacity', 1.0);
                button.position(buttonX - button.width / 2, buttonY - button.height / 2);
                button.show();
            }
        }
        
        // bottone nascosto quando non è l'ultima fase
        if (scrollAmount < PHASE_FADE_OUT_2_END && button) {
            button.hide(); 
        }

        // OUTPUT DEL TESTO --> fasi 1 - 4 
        // eseguito SOLO FINO alla fine della fase di scrittura interrogativa
        if (scrollAmount < PHASE_FADE_OUT_Q_END) {
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(currentFontSize);
            // FASE 4 ha una sua logica di fade-out, quindi scriviamo displayText solo nelle fasi 1-3
            if (scrollAmount < PHASE_WRITE_2_END) { 
                p.text(displayText, x, y);
            }
        }

        // CURSORE 
        if (showCursor) {
            
            if (scrollAmount < PHASE_FADE_OUT_Q_END || (scrollAmount >= PHASE_WRITE_2_START && scrollAmount < PHASE_WRITE_2_END_TYPING)) {
                
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
                let cursorHeight;
                
                if (scrollAmount < PHASE_FADE_OUT_Q_END) {
                    // fasi 1 - 3 
                    cursorHeight = finalFontSize * 1.1;
                    cursorY -= cursorHeight / 2;
                } else {
                    // fase 7 
                    cursorHeight = finalFontSize * 1.1;
                    // il cursoreY per la fase 7 è già stato calcolato nel blocco precedente
                    cursorY -= finalFontSize * 0.55; // allinea la base del cursore con la base del testo
                }
                
                if (p.frameCount % 30 < 15) {
                    p.fill(255);
                } else {
                    p.fill(0);
                }
                
                p.noStroke();
                p.rect(cursorX, cursorY, cursorWidth, cursorHeight);
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