// 🎮 Heart Catcher: move the basket, catch hearts, three misses = game over.
// Scores feed the medal cabinet (15 / 30 / 50).
(() => {
  const DIFF = {
    easy:   { spawnBase: 900, spawnFloor: 380, spawnRamp: 9,  vBase: 1.6, vRand: 1.2, vRamp: 0.035, lives: 3 },
    medium: { spawnBase: 650, spawnFloor: 260, spawnRamp: 10, vBase: 2.4, vRand: 1.4, vRamp: 0.06,  lives: 3 },
    hard:   { spawnBase: 450, spawnFloor: 160, spawnRamp: 12, vBase: 3.5, vRand: 1.8, vRamp: 0.09,  lives: 2 },
  };

  let difficulty = "easy";
  const bestKey = () => `n3rus.arcadeBest.${difficulty}`;

  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const overlay = document.getElementById("game-overlay");
    const W = canvas.width, H = canvas.height;

    let basketX = W / 2, hearts = [], score = 0, lives = 3;
    let running = false, lastSpawn = 0, raf = null;

    function best() { return parseInt(localStorage.getItem(bestKey()) || "0", 10); }
    function showBest() {
      const b = best();
      document.getElementById("game-best").textContent =
        b ? `personal best (${difficulty}): ${b} 💗` : "";
    }
    showBest();

    document.querySelectorAll(".diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (running) return;
        difficulty = btn.dataset.diff;
        document.querySelectorAll(".diff-btn").forEach((b) => b.classList.toggle("active", b === btn));
        showBest();
      });
    });

    function moveTo(clientX) {
      const r = canvas.getBoundingClientRect();
      basketX = Math.max(28, Math.min(W - 28, ((clientX - r.left) / r.width) * W));
    }
    canvas.addEventListener("mousemove", (e) => moveTo(e.clientX));
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      moveTo(e.touches[0].clientX);
    }, { passive: false });

    function spawn(now) {
      const d = DIFF[difficulty];
      const interval = Math.max(d.spawnFloor, d.spawnBase - score * d.spawnRamp);
      if (now - lastSpawn < interval) return;
      lastSpawn = now;
      hearts.push({
        x: 24 + Math.random() * (W - 48),
        y: -20,
        v: d.vBase + Math.random() * d.vRand + score * d.vRamp,
        glyph: Math.random() < 0.12 ? "💖" : "💗",
      });
    }

    function step(now) {
      if (!running) return;
      spawn(now);
      ctx.clearRect(0, 0, W, H);

      ctx.font = "38px serif";
      ctx.textAlign = "center";
      ctx.fillText("🧺", basketX, H - 14);

      ctx.font = "26px serif";
      hearts = hearts.filter((h) => {
        h.y += h.v;
        ctx.fillText(h.glyph, h.x, h.y);
        if (h.y > H - 44 && h.y < H - 8 && Math.abs(h.x - basketX) < 32) {
          score += h.glyph === "💖" ? 3 : 1;
          if (score >= 15) Medals.award("arcade-bronze");
          if (score >= 30) Medals.award("arcade-silver");
          if (score >= 50) Medals.award("arcade-gold");
          return false;
        }
        if (h.y > H) {
          lives--;
          if (lives <= 0) gameOver();
          return false;
        }
        return true;
      });

      // HUD
      ctx.font = "16px 'Baloo 2', sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = "#d6336c";
      ctx.fillText(`score ${score}`, 12, 24);
      ctx.textAlign = "right";
      ctx.fillText("💗".repeat(lives) + "🩶".repeat(DIFF[difficulty].lives - lives), W - 12, 24);
      ctx.fillStyle = "#000";

      raf = requestAnimationFrame(step);
    }

    function gameOver() {
      running = false;
      cancelAnimationFrame(raf);
      if (score > best()) localStorage.setItem(bestKey(), String(score));
      showBest();
      document.getElementById("game-title").textContent =
        score >= 50 ? `${score}!! GOLD!! 🥇` : score >= 30 ? `${score} — silver! 🥈` :
        score >= 15 ? `${score} — bronze! 🥉` : `${score} hearts caught`;
      document.getElementById("game-sub").textContent =
        score >= 15 ? "check the medal cabinet 🏅" : "the hearts believe in you. go again?";
      document.getElementById("game-start").textContent = "play again 💗";
      overlay.hidden = false;
    }

    document.getElementById("game-start").addEventListener("click", () => {
      const d = DIFF[difficulty];
      hearts = []; score = 0; lives = d.lives; lastSpawn = 0;
      overlay.hidden = true;
      running = true;
      raf = requestAnimationFrame(step);
    });
  });
})();
