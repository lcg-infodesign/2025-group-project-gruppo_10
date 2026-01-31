/**
 * intro.js - Configurazione animazioni e interazioni
 */

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
  // Canvas Setup
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvasContainer');
  
  alone = new AloneAnimato();
  alone.accendi(); 
  
  gsap.registerPlugin(ScrollTrigger);
  initLenis();
  
  // Elementi UI
  const skipBtn = document.getElementById('skip-intro');
  const scrollInd = document.querySelector('.scroll-indicator');
  const uiOverlay = document.getElementById('ui-overlay');

  // Apparizione iniziale indicatori
  gsap.to(scrollInd, { opacity: 1, duration: 1.5, delay: 2 });

  // --- 1. ANIMAZIONI SCROLL (P5.JS + GSAP) ---

  // Spegnimento alone (Sezione Titolo)
  ScrollTrigger.create({
    trigger: '#sezione-titolo',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => { alone.spegni(self.progress); }
  });

  // Discesa sfera (Sezione Transizione)
  ScrollTrigger.create({
    trigger: '#sezione-transizione',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => { offsetSferaY = height * 1.5 * self.progress; }
  });

  // Blocco Scroll per Typewriter
  ScrollTrigger.create({
    trigger: '.spacer-finale',
    start: 'top top', 
    onEnter: () => {
      if (!interactionStarted) {
        lenis.stop(); 
        canInteract = true;
        uiOverlay.style.pointerEvents = 'auto'; 
        gsap.to(uiOverlay, { opacity: 1, duration: 1 });
        gsap.to(scrollInd, { opacity: 0, duration: 0.5 });
      }
    }
  });

  // Dissolvenza UI quando inizia la spiegazione (se non skippato)
  ScrollTrigger.create({
    trigger: '#sezione-spiegazione',
    start: 'top bottom', 
    end: 'top center',
    scrub: true,
    onUpdate: (self) => {
      gsap.to(uiOverlay, { opacity: 1 - self.progress, duration: 0.1 });
    }
  });

  // --- 2. ANIMAZIONE STATUA ---

  let tlStatua = gsap.timeline({
    scrollTrigger: {
      trigger: "#statua-master-container",
      start: "top top",      
      end: "bottom bottom", 
      scrub: true,          
    }
  });

  tlStatua.fromTo(".statua-img.blu", 
    { opacity: 1 }, { opacity: 0, ease: "none" }, 0
  );

  let path = document.querySelector(".linea-curva-svg path");
  if(path) {
    let length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    tlStatua.to(path, { strokeDashoffset: 0, ease: "none" }, 0);
  }

  // Testi Statua
  gsap.to("#statua-parte-1", {
    opacity: 0,
    scrollTrigger: { trigger: "#statua-parte-1", start: "center center", end: "bottom top", scrub: true }
  });

  gsap.to("#statua-parte-2", {
    opacity: 1,
    scrollTrigger: { trigger: "#statua-parte-2", start: "top bottom", end: "center center", scrub: true }
  });

  // --- 3. SEZIONE REGIONI & FINALE ---

  gsap.from(".fiamma", {
    height: 0,
    stagger: 0.15,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#sezione-regioni",
      start: "top 70%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.from("#sezione-scopri .container-scopri", {
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: { trigger: "#sezione-scopri", start: "top 80%", toggleActions: "play none none reverse" }
  });

  // --- 4. GESTIONE SKIP INTRO ---

  skipBtn.addEventListener('click', () => {
    interactionStarted = true; // Impedisce al typewriter di bloccare di nuovo
    lenis.start();             // Sblocca lo scroll se fermo
    
    // Nascondi overlay e indicatori vari
    gsap.to([uiOverlay, scrollInd], { opacity: 0, duration: 0.5, pointerEvents: 'none' });

    // Salto fluido verso la fine
    lenis.scrollTo('#sezione-scopri', {
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  });

  // Nascondi pulsante skip quando si arriva alla fine
  ScrollTrigger.create({
    trigger: "#sezione-scopri",
    start: "top bottom",
    onEnter: () => gsap.to(skipBtn, { opacity: 0, pointerEvents: 'none' }),
    onLeaveBack: () => gsap.to(skipBtn, { opacity: 1, pointerEvents: 'auto' })
  });
}

// --- 5. TYPEWRITER LOGIC ---

document.getElementById('click-prompt').addEventListener('click', function() {
  if (canInteract && !interactionStarted) {
    interactionStarted = true;
    this.style.animation = 'none'; 
    gsap.to(this, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
    startComplexTypewriter();
  }
});

async function startComplexTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  await typeText(textElement, "What is freedom to you?", 60);
  await wait(800);
  await deleteText(textElement, 4, 100);
  await wait(200);
  await typeText(textElement, "Freedom House?", 80);
  
  gsap.to('#final-cta-container', { 
    opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out",
    onComplete: () => { lenis.start(); } 
  });
}

// --- HELPERS ---

function typeText(e, t, s) { return new Promise(r => { let i=0; let v=setInterval(()=>{e.innerHTML+=t.charAt(i);i++;if(i>=t.length){clearInterval(v);r()}},s) }) }
function deleteText(e, c, s) { return new Promise(r => { let d=0; let v=setInterval(()=>{e.innerHTML=e.innerHTML.slice(0,-1);d++;if(d>=c){clearInterval(v);r()}},s) }) }
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function initLenis() { 
  lenis = new Lenis({duration: 1.2, smooth: true}); 
  lenis.on('scroll', ScrollTrigger.update); 
  gsap.ticker.add((t)=>{lenis.raf(t*1000)}); 
  gsap.ticker.lagSmoothing(0); 
}

function draw() { 
  background('#26231d'); 
  alone.disegna(width/2, height/2+offsetSferaY); 
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
  ScrollTrigger.refresh(); 
}