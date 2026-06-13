// 😺 Cat Corner: random real cats (cataas.com) + Pixel the pettable cat.
(() => {
  const LS_CATS = "n3rus.catsSummoned";

  document.addEventListener("DOMContentLoaded", () => {
    Medals.visitRoom("catcorner");

    // ----- press for cat -----
    const img = document.getElementById("cat-img");
    const ph = document.getElementById("cat-placeholder");
    const btn = document.getElementById("cat-btn");
    const countEl = document.getElementById("cat-count");
    let cats = parseInt(localStorage.getItem(LS_CATS) || "0", 10);

    function updateCount() {
      countEl.textContent = cats ? `${cats} cat${cats === 1 ? "" : "s"} summoned so far` : "";
    }
    updateCount();

    btn.addEventListener("click", () => {
      btn.disabled = true;
      btn.textContent = "🐾 summoning…";
      ph.hidden = false;
      ph.textContent = "🔮";
      img.hidden = true;
      const fresh = new Image();
      fresh.onload = () => {
        img.src = fresh.src;
        img.hidden = false;
        ph.hidden = true;
        btn.disabled = false;
        btn.textContent = "🐾 press for cat";
        cats++;
        localStorage.setItem(LS_CATS, String(cats));
        updateCount();
        const r = img.getBoundingClientRect();
        FX.pop(r.left + r.width / 2, r.top + 10, 3);
      };
      fresh.onerror = () => {
        ph.textContent = "🙀";
        btn.disabled = false;
        btn.textContent = "🐾 press for cat";
        FX.toast("the cat dimension is napping — try again in a bit 😴");
      };
      fresh.src = "https://cataas.com/cat?width=600&t=" + Date.now();
    });

    // ----- Pixel the pettable cat -----
    const cat = document.getElementById("pet-cat");
    const fill = document.getElementById("purr-fill");
    const label = document.getElementById("purr-label");
    let purr = 0;

    cat.addEventListener("click", (e) => {
      purr = Math.min(100, purr + 9);
      fill.style.width = purr + "%";
      label.textContent = purr < 100 ? `purr level: ${purr}%` : "MAXIMUM PURR ACHIEVED";
      cat.textContent = purr > 70 ? "😻" : purr > 30 ? "😸" : "🐈";
      FX.pop(e.clientX, e.clientY, 1, purr > 70 ? "💞" : "🩷");
      if (purr >= 100) {
        FX.burst(e.clientX, e.clientY, 30, ["💗", "💕", "😻", "✨"]);
        Medals.award("cat-friend");
        setTimeout(() => {
          purr = 0;
          fill.style.width = "0%";
          cat.textContent = "🐈";
          label.textContent = "purr level: 0% (she wants more)";
        }, 2500);
      }
    });
  });
})();
