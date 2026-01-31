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

  // 3. Blocco Scroll
  ScrollTrigger.create({
    trigger: '.spacer-finale',
    start: 'top top', 
    onEnter: () => {
      if (!interactionStarted) {
        lenis.stop(); 
        canInteract = true;
        const overlay = document.getElementById('ui-overlay');
        overlay.style.pointerEvents = 'auto'; 
        gsap.to(overlay, { opacity: 1, duration: 1 });
        gsap.to('.scroll-indicator', { opacity: 0, duration: 0.5 });
      }
    }
  });

  // 4. Dissolvenza UI
  ScrollTrigger.create({
    trigger: '#sezione-spiegazione',
    start: 'top bottom', 
    end: 'top center',
    scrub: true,
    onUpdate: (self) => {
      gsap.to('#ui-overlay', { opacity: 1 - self.progress, duration: 0.1 });
    }
  });

  // 5. ANIMAZIONE STATUA (Immagini + Linea)
  let tlStatua = gsap.timeline({
    scrollTrigger: {
      trigger: "#statua-master-container",
      start: "top top",     
      end: "bottom bottom", 
      scrub: true,          
    }
  });

  // Cambio immagine statua
  tlStatua.fromTo(".statua-img.blu", 
    { opacity: 1 }, 
    { opacity: 0, ease: "none" }, 
    0
  );

  // Linea Curva
  let path = document.querySelector(".linea-curva-svg path");
  if(path) {
    let length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    tlStatua.to(path, { strokeDashoffset: 0, ease: "none" }, 0);
  }

  // --- NUOVA LOGICA: ANIMAZIONE TESTI ---
  
  // Testo 1: Svanisce mentre scorri via
  gsap.to("#statua-parte-1", {
    opacity: 0,
    scrollTrigger: {
      trigger: "#statua-parte-1",
      start: "center center", // Inizia a svanire quando è al centro
      end: "bottom top",      // Sparito quando esce in alto
      scrub: true
    }
  });

  // Testo 2: Appare mentre entra
  gsap.to("#statua-parte-2", {
    opacity: 1,
    scrollTrigger: {
      trigger: "#statua-parte-2",
      start: "top bottom",    // Inizia ad apparire appena entra dal basso
      end: "center center",   // Completamente visibile al centro
      scrub: true
    }
  });
}

// GESTIONE CLICK
document.getElementById('click-prompt').addEventListener('click', function() {
  if (canInteract && !interactionStarted) {
    interactionStarted = true;
    this.style.animation = 'none'; 
    gsap.to(this, { opacity: 0, duration: 0.3, pointerEvents: 'none', overwrite: true });
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

// Helpers
function typeText(e, t, s) { return new Promise(r => { let i=0; let v=setInterval(()=>{e.innerHTML+=t.charAt(i);i++;if(i>=t.length){clearInterval(v);r()}},s) }) }
function deleteText(e, c, s) { return new Promise(r => { let d=0; let v=setInterval(()=>{e.innerHTML=e.innerHTML.slice(0,-1);d++;if(d>=c){clearInterval(v);r()}},s) }) }
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function initLenis() { lenis=new Lenis({duration:1.2,smooth:true}); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t)=>{lenis.raf(t*1000)}); gsap.ticker.lagSmoothing(0); }
function draw() { background('#26231d'); alone.disegna(width/2, height/2+offsetSferaY); }
function windowResized() { resizeCanvas(windowWidth, windowHeight); ScrollTrigger.refresh(); }