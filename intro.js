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

  // 3. BLOCCO SCROLL E ATTIVAZIONE UI
  ScrollTrigger.create({
    trigger: '.spacer-finale',
    start: 'top top', 
    onEnter: () => {
      if (!interactionStarted) {
        lenis.stop(); // Blocca lo scroll qui
        
        canInteract = true;
        const overlay = document.getElementById('ui-overlay');
        overlay.style.pointerEvents = 'auto'; 
        gsap.to(overlay, { opacity: 1, duration: 1 });
        gsap.to('.scroll-indicator', { opacity: 0, duration: 0.5 });
      }
    }
  });

  // 4. Transizione verso nuova slide
  ScrollTrigger.create({
    trigger: '#sezione-spiegazione',
    start: 'top bottom', 
    end: 'top center',
    scrub: true,
    onUpdate: (self) => {
      gsap.to('#ui-overlay', { opacity: 1 - self.progress, duration: 0.1 });
    }
  });
}

// GESTIONE CLICK - FIX "SCOMPARSA IMMEDIATA"
document.getElementById('click-prompt').addEventListener('click', function() {
  if (canInteract && !interactionStarted) {
    interactionStarted = true;
    
    // IMPORTANTE: Ferma l'animazione CSS di pulsazione prima di nascondere
    this.style.animation = 'none'; 
    
    // Fai sparire il bottone velocemente
    gsap.to(this, { 
      opacity: 0, 
      duration: 0.3, 
      pointerEvents: 'none',
      overwrite: true // Assicura che GSAP sovrascriva tutto
    });
    
    // Avvia animazione testo
    startComplexTypewriter();
  }
});

async function startComplexTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  
  // A. Scrivi "What is freedom to you?"
  await typeText(textElement, "What is freedom to you?", 60);
  await wait(800);
  
  // B. Cancella "you?"
  await deleteText(textElement, 4, 100);
  await wait(200);
  
  // C. Scrivi "Freedom House?"
  await typeText(textElement, "Freedom House?", 80);
  
  // D. Apparizione "Scroll to continue"
  gsap.to('#final-cta-container', { 
    opacity: 1, 
    y: 0, 
    duration: 1, 
    delay: 0.5, 
    ease: "power2.out",
    onComplete: () => {
      // SBLOCCA LO SCROLL
      lenis.start();
    }
  });
}

// --- Funzioni Helper ---
function typeText(element, text, speed) {
  return new Promise(resolve => {
    let i = 0;
    let interval = setInterval(() => {
      element.innerHTML += text.charAt(i);
      i++;
      if (i >= text.length) { clearInterval(interval); resolve(); }
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
      if (deleted >= count) { clearInterval(interval); resolve(); }
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

