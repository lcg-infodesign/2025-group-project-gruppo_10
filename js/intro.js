// --- VARIABILI GLOBALI ---
let font;
let alone;
let offsetSferaY = 0;
let lenis;
let canInteract = false;
let interactionStarted = false;
let typewriterCompleted = false;

// Force scroll to top on page load/refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// --- SETUP ---
function setup() {
  // CRITICAL: Reset state variables first
  offsetSferaY = 0;
  canInteract = false;
  interactionStarted = false;
  typewriterCompleted = false;
  
  // CRITICAL: Force scroll to top BEFORE any other initialization
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // Canvas Setup
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvasContainer');
  
  // Kill any existing GSAP animations
  gsap.killTweensOf("*");
  
  alone = new AloneAnimato();
  alone.accendi(); 
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Clear any existing ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
  // Initialize with a small delay to ensure scroll position is reset
  setTimeout(() => {
    initLenis();
    setupScrollAnimations();
    setupUIHandlers();
  }, 100);
}

// --- INIZIALIZZAZIONE LENIS ---
function initLenis() { 
  lenis = new Lenis({
    duration: 1.2, 
    smooth: true,
    smoothTouch: false 
  }); 
  
  lenis.on('scroll', ScrollTrigger.update); 
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  }); 
  
  gsap.ticker.lagSmoothing(0); 
}

// --- SETUP SCROLL ANIMATIONS ---
function setupScrollAnimations() {
  const skipBtn = document.getElementById('skip-intro');
  const scrollInd = document.querySelector('.scroll-indicator');
  const uiOverlay = document.getElementById('ui-overlay');

  // Reset UI overlay position and visibility
  gsap.set(uiOverlay, { opacity: 0, pointerEvents: 'none' });
  uiOverlay.style.display = 'none'; // Start completely hidden
  gsap.set('#final-cta-container', { opacity: 0, y: 10 });
  
  // Hide skip button initially
  gsap.set(skipBtn, { opacity: 0, pointerEvents: 'none' });
  
  // Apparizione iniziale indicatori
  gsap.to(scrollInd, { opacity: 1, duration: 1.5, delay: 2 });

  // Traccia se hai già scrollato
  let hasScrolled = false;

  // Nascondi scroll indicator quando inizi a scrollare
  ScrollTrigger.create({
    trigger: '#sezione-titolo',
    start: 'top top',
    end: 'bottom top',
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (self.progress > 0.05) {
        hasScrolled = true;
        gsap.to(scrollInd, { opacity: 0, duration: 0.5 });
      } 
    }
  });

  // --- 1. ANIMAZIONI SCROLL (P5.JS + GSAP) ---

  // Spegnimento alone (sezione titolo)
  ScrollTrigger.create({
    trigger: '#sezione-titolo',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => { 
      alone.spegni(self.progress); 
    }
  });

  // Discesa sfera
  ScrollTrigger.create({
    trigger: '#sezione-transizione',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => { 
      offsetSferaY = height * 1.5 * self.progress;
      
      if (self.direction === -1 && self.progress < 0.5) {
        gsap.to(uiOverlay, { opacity: 0, duration: 0.3 });
        uiOverlay.style.pointerEvents = 'none';
        setTimeout(() => {
          if (parseFloat(window.getComputedStyle(uiOverlay).opacity) < 0.1) {
            uiOverlay.style.display = 'none';
          }
        }, 300);
      }
    }
  });

  // Blocco scroll per typewriter
  ScrollTrigger.create({
    trigger: '.spacer-finale',
    start: 'top top', 
    invalidateOnRefresh: true,
    onEnter: () => {
      if (!interactionStarted && !typewriterCompleted) {
        lenis.stop(); 
        canInteract = true;
        uiOverlay.style.display = 'flex'; // Show overlay first
        uiOverlay.style.pointerEvents = 'auto'; 
        gsap.to(uiOverlay, { opacity: 1, duration: 1 });
        gsap.to(scrollInd, { opacity: 0, duration: 0.5 });
      } else if (typewriterCompleted) {
        // If typewriter was already completed, show skip button immediately
        gsap.to(skipBtn, { opacity: 1, pointerEvents: 'auto', duration: 0.5 });
      }
    },
    onLeaveBack: () => {
      gsap.to(uiOverlay, { opacity: 0, duration: 0.5 });
      setTimeout(() => {
        uiOverlay.style.pointerEvents = 'none';
        if (parseFloat(window.getComputedStyle(uiOverlay).opacity) < 0.1) {
          uiOverlay.style.display = 'none';
        }
      }, 500);
      gsap.to(scrollInd, { opacity: 1, duration: 0.5 });
      
      // Hide skip button when leaving typewriter section backwards
      gsap.to(skipBtn, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
      canInteract = false;
    }
  });

  // Nascondi overlay quando torni alle sezioni iniziali
  ScrollTrigger.create({
    trigger: '#sezione-titolo',
    start: 'top bottom',
    end: 'bottom top',
    invalidateOnRefresh: true,
    onEnter: () => {
      gsap.to(uiOverlay, { opacity: 0, duration: 0.3 });
      uiOverlay.style.pointerEvents = 'none';
      setTimeout(() => {
        if (uiOverlay.style.opacity === '0' || parseFloat(window.getComputedStyle(uiOverlay).opacity) < 0.1) {
          uiOverlay.style.display = 'none';
        }
      }, 300);
    },
    onLeaveBack: () => {
      gsap.to(uiOverlay, { opacity: 0, duration: 0.3 });
      uiOverlay.style.pointerEvents = 'none';
      setTimeout(() => {
        if (uiOverlay.style.opacity === '0' || parseFloat(window.getComputedStyle(uiOverlay).opacity) < 0.1) {
          uiOverlay.style.display = 'none';
        }
      }, 300);
    }
  });

  // Dissolvenza UI quando inizia la spiegazione
  ScrollTrigger.create({
    trigger: '#sezione-spiegazione',
    start: 'top bottom', 
    end: 'top center',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (typewriterCompleted || interactionStarted) {
        let newOpacity = 1 - self.progress;
        gsap.to(uiOverlay, { opacity: newOpacity, duration: 0.1 });
        
        // Completely remove overlay from interaction when fully faded
        if (self.progress > 0.9) {
          uiOverlay.style.display = 'none';
        } else {
          uiOverlay.style.display = 'flex';
        }
      }
    },
    onLeave: () => {
      uiOverlay.style.display = 'none';
    },
    onEnterBack: () => {
      if (typewriterCompleted || interactionStarted) {
        uiOverlay.style.display = 'flex';
      }
    }
  });

  // --- 2. ANIMAZIONE STATUA ---
  
  let tlStatuaColore = gsap.timeline({
    scrollTrigger: {
      trigger: "#statua-master-container",
      start: "top top",      
      end: "bottom bottom", 
      scrub: true,
      invalidateOnRefresh: true,
    }
  });

  // Transizione opacità tra rame e blu
  tlStatuaColore.fromTo(".statua-img.blu", 
    { opacity: 1 }, 
    { opacity: 0, ease: "none" }, 
    0
  );

  // Linea curva
  let path = document.querySelector(".linea-curva-svg path");
  if(path) {
    let length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    tlStatuaColore.to(path, { strokeDashoffset: 0, ease: "none" }, 0);
  }

  // Testi Statua
  gsap.to("#statua-parte-1", {
    opacity: 0,
    scrollTrigger: { 
      trigger: "#statua-parte-1", 
      start: "center center", 
      end: "bottom top", 
      scrub: true,
      invalidateOnRefresh: true
    }
  });

  gsap.fromTo("#statua-parte-2",
    { opacity: 0 },
    {
      opacity: 1,
      scrollTrigger: { 
        trigger: "#statua-parte-2", 
        start: "top bottom", 
        end: "center center", 
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );

  // --- 3. SEZIONE REGIONI & FINALE ---

  gsap.from(".fiamma", {
    height: 0,
    stagger: 0.15,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#sezione-regioni",
      start: "top 70%",
      toggleActions: "play none none reverse",
      invalidateOnRefresh: true
    }
  });

  gsap.from("#sezione-scopri .container-scopri", {
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: { 
      trigger: "#sezione-scopri", 
      start: "top 80%", 
      toggleActions: "play none none reverse",
      invalidateOnRefresh: true
    }
  });

  // --- 4. GESTIONE SKIP INTRO ---

  skipBtn.addEventListener('click', () => {
    interactionStarted = true;
    typewriterCompleted = true;
    lenis.start();
    
    gsap.to([uiOverlay, scrollInd], { 
      opacity: 0, 
      duration: 0.5, 
      onComplete: () => {
        uiOverlay.style.pointerEvents = 'none';
        uiOverlay.style.display = 'none'; // Hide completely
      }
    });

    lenis.scrollTo('#sezione-scopri', {
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  });

  // Nascondi pulsante skip quando si arriva alla fine
  ScrollTrigger.create({
    trigger: "#sezione-scopri",
    start: "top bottom",
    invalidateOnRefresh: true,
    onEnter: () => gsap.to(skipBtn, { opacity: 0, pointerEvents: 'none' }),
    onLeaveBack: () => gsap.to(skipBtn, { opacity: 1, pointerEvents: 'auto' })
  });
}

// --- SETUP UI HANDLERS ---
function setupUIHandlers() {
  const clickPrompt = document.getElementById('click-prompt');
  
  clickPrompt.addEventListener('click', function() {
    if (canInteract && !interactionStarted && !typewriterCompleted) {
      interactionStarted = true;
      this.style.animation = 'none'; 
      gsap.to(this, { 
        opacity: 0, 
        duration: 0.3, 
        onComplete: () => {
          this.style.pointerEvents = 'none';
        }
      });
      startComplexTypewriter();
    }
  });
}

// --- TYPEWRITER LOGIC ---
async function startComplexTypewriter() {
  if (typewriterCompleted) return; 
  
  const textElement = document.getElementById('typewriter-text');
  const skipBtn = document.getElementById('skip-intro');
  textElement.innerHTML = ''; 
  
  await typeText(textElement, "What is freedom to you?", 60);
  await wait(800);
  await deleteText(textElement, 4, 100);
  await wait(200);
  await typeText(textElement, "Freedom House?", 80);
  
  typewriterCompleted = true;
  
  // Show skip button after typewriter completes
  gsap.to(skipBtn, { 
    opacity: 1, 
    pointerEvents: 'auto', 
    duration: 0.5, 
    delay: 0.3 
  });
  
  gsap.to('#final-cta-container', { 
    opacity: 1, 
    y: 0, 
    duration: 1, 
    delay: 0.5, 
    ease: "power2.out",
    onComplete: () => { 
      lenis.start(); 
    } 
  });
}

// --- HELPER FUNCTIONS ---
function typeText(e, t, s) { 
  return new Promise(r => { 
    let i = 0; 
    let v = setInterval(() => {
      e.innerHTML += t.charAt(i);
      i++;
      if(i >= t.length) {
        clearInterval(v);
        r();
      }
    }, s);
  });
}

function deleteText(e, c, s) { 
  return new Promise(r => { 
    let d = 0; 
    let v = setInterval(() => {
      e.innerHTML = e.innerHTML.slice(0, -1);
      d++;
      if(d >= c) {
        clearInterval(v);
        r();
      }
    }, s);
  });
}

function wait(ms) { 
  return new Promise(r => setTimeout(r, ms)); 
}

// --- P5.JS DRAW ---
function draw() { 
  background(palette.nero); 
  alone.disegna(width / 2, height / 2 + offsetSferaY); 
}

// --- WINDOW RESIZE ---
function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
  ScrollTrigger.refresh(); 
}