// 🎮 Heart Catcher: move the basket, catch hearts, three misses = game over.
// Scores feed the medal cabinet (15 / 30 / 50).
(() => {
  const LS_BEST = "n3rus.arcadeBest";

  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const overlay = document.getElementById("game-overlay");
    const W = canvas.width, H = canvas.height;

    let basketX = W / 2, hearts = [], score = 0, lives = 3;
    let running = false, lastSpawn = 0, raf = null;

    function best() { return parseInt(localStorage.getItem(LS_BEST) || "0", 10); }
    function showBest() {
      document.getElementById("game-best").textContent =
        best() ? `personal best: ${best()} 💗` : "";
    }
    showBest();

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
      const interval = Math.max(380, 900 - score * 9);
      if (now - lastSpawn < interval) return;
      lastSpawn = now;
      hearts.push({
        x: 24 + Math.random() * (W - 48),
        y: -20,
        v: 1.6 + Math.random() * 1.2 + score * 0.035,
        glyph: Math.random() < 0.12 ? "💖" : "💗", // 💖 is worth 3!
      });
    }

    function step(now) {
      if (!running) return;
      spawn(now);
      ctx.clearRect(0, 0, W, H);

      // basket
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
      ctx.fillText("💗".repeat(lives) + "🩶".repeat(3 - lives), W - 12, 24);
      ctx.fillStyle = "#000";

      raf = requestAnimationFrame(step);
    }

    function gameOver() {
      running = false;
      cancelAnimationFrame(raf);
      if (score > best()) localStorage.setItem(LS_BEST, String(score));
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
      hearts = []; score = 0; lives = 3; lastSpawn = 0;
      overlay.hidden = true;
      running = true;
      raf = requestAnimationFrame(step);
    });
  });
})();
