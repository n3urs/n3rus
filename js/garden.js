// 🌷 The garden: click to plant flowers (they stay forever), watch the
// animals wander, and find what's hiding behind the bushes.
(() => {
  const LS_KEY = "n3rus.garden";
  const FLOWERS = ["🌷", "🌸", "🌼", "🌺", "🪻", "🌻", "💐", "🌹"];

  const load = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
    catch { return []; }
  };
  const save = (f) => localStorage.setItem(LS_KEY, JSON.stringify(f));

  document.addEventListener("DOMContentLoaded", () => {
    const plot = document.getElementById("plot");
    let flowers = load();

    function addFlower(f, animate) {
      const el = document.createElement("span");
      el.className = "flower" + (animate ? " grow" : "");
      el.textContent = f.emoji;
      el.style.left = f.x + "%";
      el.style.top = f.y + "%";
      plot.appendChild(el);
    }

    function updateCount() {
      document.getElementById("flower-count").textContent =
        `${flowers.length} flower${flowers.length === 1 ? "" : "s"} planted for ${CONFIG.herName}`;
      // heart #4 sprouts once the garden has five flowers
      const h4 = document.querySelector('[data-hh="h4"]');
      if (flowers.length >= 5) h4.classList.add("sprouted");
    }

    flowers.forEach((f) => addFlower(f, false));
    updateCount();

    plot.addEventListener("click", (e) => {
      if (e.target.closest(".hh") || e.target.closest(".critter")) return;
      if (flowers.length >= 120)
        return FX.toast("the garden is completely full of love 🌸 (and flowers)");
      const r = plot.getBoundingClientRect();
      const f = {
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
        emoji: FLOWERS[(Math.random() * FLOWERS.length) | 0],
      };
      flowers.push(f);
      save(flowers);
      addFlower(f, true);
      updateCount();
      if (flowers.length >= 10) Medals.award("gardener");
      if (flowers.length >= 50) Medals.award("master-gardener");
    });

    // 🦔 one bush is not like the others. no clue, no reward — just a hedgehog.
    const bushes = plot.querySelector(".bushes");
    const hogBush = document.createElement("span");
    hogBush.className = "hog-bush";
    hogBush.textContent = "🌳";
    hogBush.style.cursor = "pointer";
    bushes.appendChild(hogBush);
    let hogOut = false;
    hogBush.addEventListener("click", (e) => {
      e.stopPropagation();
      if (hogOut) return;
      hogOut = true;
      const hog = document.createElement("span");
      hog.textContent = "🦔";
      hog.style.cssText = "position:absolute; right:0; bottom:38px; font-size:1.5rem; animation: sprout 0.5s;";
      bushes.style.position = "relative";
      bushes.appendChild(hog);
      setTimeout(() => { hog.textContent = "🦔💤"; }, 1600);
      setTimeout(() => { hog.remove(); hogOut = false; }, 3000);
    });

    // ----- wandering critters -----
    const critters = [
      { name: "Egg", emoji: "🐶" }, { name: "Maude", emoji: "🐕" },
      { name: "Bee", emoji: "🐝" }, { name: "Mouse", emoji: "🐭" },
      { name: "Rosie", emoji: "🐱" }, { name: "Biscuit", emoji: "🐴" },
    ];
    critters.forEach((c, i) => {
      const el = document.createElement("div");
      el.className = "critter";
      el.innerHTML = `<span class="critter-emoji">${c.emoji}</span><span class="critter-name">${c.name}</span>`;
      el.style.left = 10 + i * 14 + "%";
      el.style.top = 30 + (i % 3) * 20 + "%";
      plot.appendChild(el);
      (function wander() {
        const x = 4 + Math.random() * 88;
        const y = 10 + Math.random() * 80;
        const dur = 5 + Math.random() * 7;
        el.style.transition = `left ${dur}s ease-in-out, top ${dur}s ease-in-out`;
        el.style.left = x + "%";
        el.style.top = y + "%";
        setTimeout(wander, dur * 1000 + Math.random() * 3000);
      })();
      el.addEventListener("click", () => {
        const r = el.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top, 10);
        FX.toast(NOTES.animalLines[c.name.toLowerCase()]);
      });
    });
  });
})();
