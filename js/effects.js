// Ambient prettiness: drifting background hearts, click-pops, toasts,
// heart bursts and confetti. Shared by every page.
const FX = (() => {
  // ----- drifting hearts canvas -----
  const canvas = document.createElement("canvas");
  canvas.id = "bg-hearts";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");
  const GLYPHS = ["💗", "💕", "🩷", "💞", "✨", "🤍"];
  let drift = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  addEventListener("resize", resize);
  resize();

  function spawnDrifter() {
    drift.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 30,
      size: 12 + Math.random() * 22,
      speed: 0.25 + Math.random() * 0.7,
      sway: Math.random() * Math.PI * 2,
      swayAmp: 10 + Math.random() * 25,
      glyph: GLYPHS[(Math.random() * GLYPHS.length) | 0],
      alpha: 0.25 + Math.random() * 0.4,
    });
  }
  for (let i = 0; i < 18; i++) {
    spawnDrifter();
    drift[i].y = Math.random() * canvas.height;
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drift.forEach((d) => {
      d.y -= d.speed;
      d.sway += 0.01;
      ctx.globalAlpha = d.alpha;
      ctx.font = `${d.size}px serif`;
      ctx.fillText(d.glyph, d.x + Math.sin(d.sway) * d.swayAmp, d.y);
    });
    ctx.globalAlpha = 1;
    drift = drift.filter((d) => d.y > -40);
    while (drift.length < 18) spawnDrifter();
    requestAnimationFrame(tick);
  }
  tick();

  // ----- little heart pop wherever you click -----
  document.addEventListener("pointerdown", (e) => {
    pop(e.clientX, e.clientY, 1);
  });

  function pop(x, y, count = 1, glyph = "💗") {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "fx-pop";
      el.textContent = glyph;
      el.style.left = x + (Math.random() - 0.5) * 30 * count + "px";
      el.style.top = y + (Math.random() - 0.5) * 20 * count + "px";
      el.style.fontSize = 14 + Math.random() * 14 + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1100);
    }
  }

  // ----- big burst (egg hatches, secrets found, etc.) -----
  function burst(x, y, count = 24, glyphs = ["💗", "💕", "✨", "🩷"]) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "fx-burst";
      el.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      const ang = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 140;
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      el.style.setProperty("--dy", Math.sin(ang) * dist - 60 + "px");
      el.style.fontSize = 14 + Math.random() * 18 + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }
  }

  // ----- confetti rain (celebration) -----
  let confettiTimer = null;
  function confetti(durationMs = 6000) {
    const COLORS = ["#ff8fc0", "#ffd6e8", "#e5d4ff", "#ffe9a8", "#c3f5d9", "#fff"];
    const end = Date.now() + durationMs;
    clearInterval(confettiTimer);
    confettiTimer = setInterval(() => {
      if (Date.now() > end) return clearInterval(confettiTimer);
      for (let i = 0; i < 6; i++) {
        const el = document.createElement("span");
        const heart = Math.random() < 0.3;
        el.className = "fx-confetti";
        if (heart) {
          el.textContent = "💗";
          el.style.fontSize = 10 + Math.random() * 16 + "px";
        } else {
          el.style.background = COLORS[(Math.random() * COLORS.length) | 0];
          el.style.width = el.style.height = 6 + Math.random() * 8 + "px";
        }
        el.style.left = Math.random() * 100 + "vw";
        el.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
        el.style.animationDelay = Math.random() * 0.5 + "s";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 5500);
      }
    }, 120);
  }

  // ----- toast -----
  function toast(msg, ms = 3200) {
    let t = document.querySelector(".fx-toast");
    if (t) t.remove();
    t = document.createElement("div");
    t.className = "fx-toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 400);
    }, ms);
  }

  return { pop, burst, confetti, toast };
})();
