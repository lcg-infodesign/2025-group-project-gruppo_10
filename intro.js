let font;
let alone;
let offsetSferaY = 0;
let lenis;
let canInteract = false;
let interactionStarted = false;

function preload() {
  font = loadFont('font/NeueHaasDisplayLight.ttf');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvasContainer');
  
  alone = new AloneAnimato();
  alone.accendi();
  
  gsap.registerPlugin(ScrollTrigger);
  initLenis();
  
  // Indicatore iniziale
  gsap.to('.scroll-indicator', { opacity: 1, duration: 1.5, delay: 2 });

  // 1. Spegnimento alone
  ScrollTrigger.create({
    trigger: '#sezione-titolo',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => { alone.spegni(self.progress); }
  });

  // 2. Discesa sfera
  ScrollTrigger.create({
    trigger: '#sezione-transizione',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => { offsetSferaY = height * 1.5 * self.progress; }
  });

  // 3. Attivazione Interazione Finale
  ScrollTrigger.create({
    trigger: '.spacer-finale',
    start: 'top center', 
    onEnter: () => {
      if (!interactionStarted) {
        canInteract = true;
        const overlay = document.getElementById('ui-overlay');
        overlay.style.pointerEvents = 'auto';
        gsap.to(overlay, { opacity: 1, duration: 1 });
        // Via la vecchia freccia
        gsap.to('.scroll-indicator', { opacity: 0, duration: 0.5 });
      }
    }
  });
}

// GESTIONE CLICK
document.getElementById('click-prompt').addEventListener('click', () => {
  if (canInteract && !interactionStarted) {
    interactionStarted = true;
    
    // 1. Fai sparire IMMEDIATAMENTE il bottone "Click to start"
    gsap.to('#click-prompt', { 
      opacity: 0, 
      duration: 0.3, 
      pointerEvents: 'none',
      onComplete: () => {
        // Opzionale: rimuovi dal DOM se vuoi essere pulitissimo, 
        // ma opacity 0 e pointer-events none bastano visivamente
        document.getElementById('click-prompt').style.display = 'none';
      }
    });
    
    // 2. Avvia animazione testo
    startComplexTypewriter();
  }
});

async function startComplexTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  
  // A. Scrivi "What is freedom to you?"
  await typeText(textElement, "What is freedom to you?", 60); // Leggermente più veloce
  await wait(800);
  
  // B. Cancella "you?" (4 caratteri)
  await deleteText(textElement, 4, 100);
  await wait(200);
  
  // C. Scrivi "Freedom House?"
  await typeText(textElement, "Freedom House?", 80);
  
  // D. Apparizione finale "Scroll to continue" + Freccia
  gsap.to('#final-cta-container', { 
    opacity: 1, 
    y: 0, // Sale leggermente alla posizione naturale
    duration: 1, 
    delay: 0.5, 
    ease: "power2.out" 
  });
}

// --- Funzioni di utilità (Invariate) ---
function typeText(element, text, speed) {
  return new Promise(resolve => {
    let i = 0;
    let interval = setInterval(() => {
      element.innerHTML += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function deleteText(element, count, speed) {
  return new Promise(resolve => {
    let deleted = 0;
    let interval = setInterval(() => {
      let current = element.innerHTML;
      element.innerHTML = current.substring(0, current.length - 1);
      deleted++;
      if (deleted >= count) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function initLenis() {
  lenis = new Lenis({ duration: 1.2, smooth: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

function draw() {
  background('#26231d');
  alone.disegna(width / 2, height / 2 + offsetSferaY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ScrollTrigger.refresh();
}