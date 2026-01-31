// --- CONFIGURAZIONE DINAMICA ---
const THEME = {
  gradients: {
    free: "linear-gradient(to top, #c76351, #e5c38f)",
    notFree: "linear-gradient(to top, #2f3e46, #6b8c85)",
    transition: "linear-gradient(to top, #2f3e46, #e5c38f)"
  },
  fiammeData: [
    { id: ".f1", h: 180, type: "free" },
    { id: ".f2", h: 240, type: "transition" },
    { id: ".f3", h: 100, type: "notFree" },
    { id: ".f4", h: 150, type: "notFree" }
  ]
};

let font, alone, lenis, offsetSferaY = 0;
let canInteract = false, interactionStarted = false;

function preload() { font = loadFont('font/NeueHaasDisplayLight.ttf'); }

function setup() {
  createCanvas(windowWidth, windowHeight).parent('canvasContainer');
  alone = new AloneAnimato();
  alone.accendi();
  
  gsap.registerPlugin(ScrollTrigger);
  initLenis();
  initScrollAnimations();
}

function initScrollAnimations() {
  // 1. Alone e Sfera
  ScrollTrigger.create({
    trigger: '#sezione-titolo', start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (self) => alone.spegni(self.progress)
  });

  ScrollTrigger.create({
    trigger: '#sezione-transizione', start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (self) => offsetSferaY = height * 1.5 * self.progress
  });

  // 2. Typewriter Logic
  ScrollTrigger.create({
    trigger: '.spacer-finale', start: 'top top',
    onEnter: () => {
      if (!interactionStarted) {
        lenis.stop();
        canInteract = true;
        gsap.to('#ui-overlay', { opacity: 1, duration: 1, pointerEvents: 'auto' });
      }
    }
  });

  // 3. Statua & Path
  let tlStatua = gsap.timeline({
    scrollTrigger: { trigger: "#statua-master-container", start: "top top", end: "bottom bottom", scrub: true }
  });
  tlStatua.to(".statua-img.blu", { opacity: 0, ease: "none" });

  let path = document.querySelector(".linea-curva-svg path");
  if(path) {
    let len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    tlStatua.to(path, { strokeDashoffset: 0, ease: "none" }, 0);
  }

  // 4. Testi Statua (Fade in/out)
  gsap.to("#statua-parte-1", { opacity: 0, scrollTrigger: { trigger: "#statua-parte-1", start: "center center", end: "bottom top", scrub: true }});
  gsap.to("#statua-parte-2", { opacity: 1, scrollTrigger: { trigger: "#statua-parte-2", start: "top bottom", end: "center center", scrub: true }});

  // 5. FIAMME (Configurazione da oggetto THEME)
  THEME.fiammeData.forEach(f => {
    gsap.set(f.id, { background: THEME.gradients[f.type] });
    gsap.fromTo(f.id, { height: 0 }, {
      height: f.h, duration: 1.5, ease: "power3.out",
      scrollTrigger: { trigger: "#sezione-regioni", start: "top 70%" }
    });
  });
}

// --- TYPEWRITER & INTERACTION ---
document.getElementById('click-prompt').addEventListener('click', async function() {
  if (canInteract && !interactionStarted) {
    interactionStarted = true;
    gsap.to(this, { opacity: 0, duration: 0.3 });
    const txt = document.getElementById('typewriter-text');
    await typeText(txt, "What is freedom to you?", 60);
    await wait(800);
    await deleteText(txt, 4, 100);
    await typeText(txt, "Freedom House?", 80);
    
    gsap.to('#final-cta-container', { opacity: 1, y: 0, duration: 1, onComplete: () => lenis.start() });
  }
});

// --- HELPERS ---
function initLenis() {
  lenis = new Lenis({ duration: 1.2, smooth: true });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
function draw() { background('#26231d'); alone.disegna(width/2, height/2 + offsetSferaY); }
function windowResized() { resizeCanvas(windowWidth, windowHeight); ScrollTrigger.refresh(); }
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
async function typeText(e, t, s) { for(let char of t) { e.innerHTML += char; await wait(s); } }
async function deleteText(e, n, s) { for(let i=0; i<n; i++) { e.innerHTML = e.innerHTML.slice(0,-1); await wait(s); } }