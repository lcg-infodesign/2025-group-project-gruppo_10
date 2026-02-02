class AloneAnimato {
  constructor() {
    this.intensitaAlone = 1;
    this.dimensioneAlone = 0;
    this.fattorePulsazione = 1;
    this.intensitaLuce = 1;
    this.isPulsing = false;
    this.scrollProgress = 0;
    
    this.coloriBase = [
      { stop: 0, color: '#e5c38f' },
      { stop: 0.15, color: '#e5c38f' },
      { stop: 0.25, color: '#c76351' },
      { stop: 0.60, color: '#8b4639' },
      { stop: 1.0, color: '#26231d' }
    ];
    
    this.sferaColor = '#faf9f5';
    this.sferaSize = 70;
  }
  
  accendi() {
    this.isPulsing = true;
    
    let tl = gsap.timeline({
      onComplete: () => {
        this.avviaLampeggio();
      }
    });
    
    tl.to(this, {
      dimensioneAlone: 1,
      fattorePulsazione: 1.3,
      intensitaLuce: 1.2,
      duration: 3,
      ease: "power2.out"
    }, 0);
  }
  
  avviaLampeggio() {
    // Timeline senza yoyo - ciclo completo manuale per smoothness perfetta
    let tl = gsap.timeline({ 
      repeat: -1
    });
    
    // Dal massimo al minimo
    tl.to(this, {
      fattorePulsazione: 1,
      intensitaLuce: 1,
      duration: 2.5,
      ease: "sine.inOut"
    }, 0);
    
    // Dal minimo al massimo (stesso tempo, stesso easing)
    tl.to(this, {
      fattorePulsazione: 1.3,
      intensitaLuce: 1.2,
      duration: 2.5,
      ease: "sine.inOut"
    }, 2.5); // Inizia esattamente quando finisce il precedente
  }
  
  spegni(scrollProg) {
    this.scrollProgress = scrollProg;
    this.intensitaAlone = max(0, 1 - scrollProg);
  }
  
  disegna(x, y) {
    push();
    translate(x, y);
    
    if (this.dimensioneAlone > 0.01) {
      let maxSize = max(width, height) * 1.4;
      
      let dimensioneBase = maxSize * this.dimensioneAlone;
      let dimensioneFinale = dimensioneBase * this.fattorePulsazione;
      
      let intensitaFinale = this.intensitaAlone * this.intensitaLuce;
      
      let coloriPulsanti = this.applicaPulsazioneAiColori();
      
      this.disegnaGradienteRadiale(0, 0, dimensioneFinale, coloriPulsanti, intensitaFinale);
    }
    
    this.disegnaSfera(0, 0);
    
    pop();
  }
  
  applicaPulsazioneAiColori() {
    return this.coloriBase.map((stop, index) => {
      let nuovoStop = stop.stop;
      
      if (index > 0) {
        let espansione = (1 - stop.stop) * 0.35;
        nuovoStop = stop.stop + espansione * (this.fattorePulsazione - 1);
        nuovoStop = constrain(nuovoStop, 0, 1);
      }
      
      return {
        stop: nuovoStop,
        color: stop.color
      };
    });
  }
  
  disegnaGradienteRadiale(x, y, diameter, coloriStops, intensita) {
    let radius = diameter / 2;
    
    if (radius < 1) return;
    
    let gradient = drawingContext.createRadialGradient(x, y, 0, x, y, radius);
    
    let stopsRGB = coloriStops.map(stop => ({
      position: stop.stop,
      ...this.hexToRgb(stop.color)
    }));
    
    let stopsFinali = [];
    for (let i = 0; i < stopsRGB.length - 1; i++) {
      let start = stopsRGB[i];
      let end = stopsRGB[i + 1];
      
      stopsFinali.push({...start});
      
      let numIntermedi = 20;
      for (let j = 1; j < numIntermedi; j++) {
        let t = j / numIntermedi;
        let pos = lerp(start.position, end.position, t);
        let r = lerp(start.r, end.r, t);
        let g = lerp(start.g, end.g, t);
        let b = lerp(start.b, end.b, t);
        
        stopsFinali.push({ position: pos, r: r, g: g, b: b });
      }
    }
    
    stopsFinali.push({...stopsRGB[stopsRGB.length - 1]});
    
    for (let stop of stopsFinali) {
      let alphaFactor = pow(1 - stop.position, 1.8);
      let alpha = intensita * alphaFactor;
      
      alpha = constrain(alpha, 0, 1);
      
      gradient.addColorStop(
        stop.position,
        `rgba(${Math.round(stop.r)}, ${Math.round(stop.g)}, ${Math.round(stop.b)}, ${alpha})`
      );
    }
    
    drawingContext.fillStyle = gradient;
    drawingContext.beginPath();
    drawingContext.arc(x, y, radius, 0, Math.PI * 2);
    drawingContext.fill();
  }
  
  disegnaSfera(x, y) {
    let radius = this.sferaSize / 2;
    
    let gradient = drawingContext.createRadialGradient(
      x - radius * 0.3, y - radius * 0.3, 0,
      x, y, radius
    );
    
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, this.sferaColor);
    gradient.addColorStop(1, '#e8e7e0');
    
    drawingContext.fillStyle = gradient;
    drawingContext.beginPath();
    drawingContext.arc(x, y, radius, 0, Math.PI * 2);
    drawingContext.fill();
  }
  
  hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
}