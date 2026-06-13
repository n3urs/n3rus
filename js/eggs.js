// 🥚 The secrets engine: hidden hearts, typed codes, animal cameos,
// the riddle, and the treasure unlock. Loaded on every page.
const Eggs = (() => {
  const LS = {
    hearts: "n3rus.heartsFound",   // JSON array of heart ids
    treasure: "n3rus.treasure",    // "open" once unlocked
  };
  const ALL_HEARTS = ["h1", "h2", "h3", "h4", "h5", "h6"];

  const found = () => {
    try { return new Set(JSON.parse(localStorage.getItem(LS.hearts) || "[]")); }
    catch { return new Set(); }
  };
  const treasureOpen = () => localStorage.getItem(LS.treasure) === "open";

  // ---------- shared UI (chip + modals), injected on every page ----------
  function injectUI() {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <button class="heart-chip" id="heart-chip" title="Secrets…">💗 <span id="heart-count"></span></button>

      <div class="modal-backdrop" id="secrets-modal" hidden>
        <div class="modal">
          <button class="modal-close" data-close>✕</button>
          <h2>🤫 Secrets</h2>
          <p class="muted">Six tiny hearts are hidden around this site. Find them all…</p>
          <ul class="clue-list" id="clue-list"></ul>
          <div id="riddle-box" hidden>
            <h3>🗝️ You found them all! A riddle:</h3>
            <p class="riddle" id="riddle-text"></p>
          </div>
          <div class="whisper">
            <p class="muted">Some names are magic here. Whisper one:</p>
            <form id="whisper-form">
              <input id="whisper-input" type="text" placeholder="whisper…" autocomplete="off" maxlength="20">
              <button type="submit" class="btn small">🪄</button>
            </form>
          </div>
          <p class="muted tiny">psst — you can also just <em>type</em> a magic name anywhere on the page</p>
          <div class="rumours">
            <p class="muted">rumours going around…</p>
            <ul class="clue-list">
              <li>🐾 something pads softly across the screen sometimes. catch it.</li>
              <li>🌙 one secret only comes out after bedtime</li>
              <li>⏳ time cracks if you poke it three times</li>
              <li>💗 the heart in the title likes being bothered. seven times, to be exact</li>
              <li>🎮 whisper <em>play</em> if you fancy a game</li>
              <li>🪩 this site knows how to party, if you say the word</li>
              <li>🏅 good deeds around here don't go unrewarded</li>
            </ul>
          </div>
          <button class="btn ghost small" id="preview-celebrate">🎉 peek at the together-day</button>
          <button class="btn ghost small" id="hunt-reset">🔄 start the hunt over</button>
        </div>
      </div>

      <div class="modal-backdrop" id="note-modal" hidden>
        <div class="modal note">
          <button class="modal-close" data-close>✕</button>
          <div class="note-heart">💌</div>
          <p id="note-text"></p>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    document.getElementById("heart-chip").addEventListener("click", openSecrets);
    document.querySelectorAll("[data-close]").forEach((b) =>
      b.addEventListener("click", (e) => e.target.closest(".modal-backdrop").hidden = true));
    document.querySelectorAll(".modal-backdrop").forEach((m) =>
      m.addEventListener("click", (e) => { if (e.target === m) m.hidden = true; }));

    document.getElementById("whisper-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const word = document.getElementById("whisper-input").value.trim().toLowerCase();
      document.getElementById("whisper-input").value = "";
      if (word) triggerCode(word, true);
    });

    document.getElementById("hunt-reset").addEventListener("click", () => {
      [
        LS.hearts, LS.treasure,
        "n3rus.medals", "n3rus.summoned", "n3rus.secretRooms",
        "n3rus.arcadeBest", "n3rus.catsSummoned", "n3rus.fortuneDay",
      ].forEach((k) => localStorage.removeItem(k));
      document.querySelectorAll(".hh").forEach((el) => el.classList.remove("found"));
      const lock = document.querySelector(".nav .lock");
      if (lock) { lock.textContent = "🔒"; lock.title = "locked… for now"; }
      document.querySelector(".nav .medal-pill")?.remove();
      updateChip();
      openSecrets();
      FX.toast("hearts re-hidden, medals melted down, lock re-locked — happy hunting 💗");
    });

    document.getElementById("preview-celebrate").addEventListener("click", () => {
      document.getElementById("secrets-modal").hidden = true;
      if (typeof Countdown !== "undefined") Countdown.celebrate(true);
      else FX.confetti(4000);
    });

    updateChip();
  }

  function updateChip() {
    const n = found().size;
    document.getElementById("heart-count").textContent = `${n}/6`;
    const lock = document.querySelector(".nav .lock");
    if (lock && treasureOpen()) { lock.textContent = "💝"; lock.title = "the treasure…"; }
  }

  function openSecrets() {
    const f = found();
    const list = document.getElementById("clue-list");
    list.innerHTML = ALL_HEARTS.map((id) =>
      f.has(id)
        ? `<li class="got">💗 <s>${NOTES.heartClues[id]}</s></li>`
        : `<li>🤍 ${NOTES.heartClues[id]}</li>`
    ).join("");
    const riddleBox = document.getElementById("riddle-box");
    riddleBox.hidden = f.size < ALL_HEARTS.length;
    if (!riddleBox.hidden)
      document.getElementById("riddle-text").textContent = NOTES.riddle;
    document.getElementById("secrets-modal").hidden = false;
  }

  function showNote(text) {
    document.getElementById("note-text").textContent = text;
    document.getElementById("note-modal").hidden = false;
  }

  // ---------- hidden hearts ----------
  function bindHearts() {
    document.querySelectorAll(".hh").forEach((el) => {
      const id = el.dataset.hh;
      if (found().has(id)) el.classList.add("found");
      if (el.dataset.bound) return;
      el.dataset.bound = "1";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const f = found();
        const isNew = !f.has(id);
        f.add(id);
        localStorage.setItem(LS.hearts, JSON.stringify([...f]));
        el.classList.add("found");
        const r = el.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top + r.height / 2, isNew ? 26 : 8);
        showNote(NOTES.hiddenHearts[id]);
        updateChip();
        if (isNew && f.size === 1) Medals.award("first-heart");
        if (isNew && f.size === ALL_HEARTS.length) Medals.award("all-hearts");
        if (isNew && f.size === ALL_HEARTS.length)
          setTimeout(() => { FX.confetti(4000); openSecrets(); }, 900);
        else if (isNew)
          FX.toast(`💗 hidden heart found! ${f.size}/6`);
      });
    });
  }

  // ---------- typed secret codes ----------
  let buf = "";
  document.addEventListener("keydown", (e) => {
    if (e.target instanceof Element && e.target.matches("input, textarea")) return;
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-12);
    for (const word of [...Object.keys(CONFIG.animals), "hettie", "play", "disco", "medals", "meow", CONFIG.riddleAnswer]) {
      if (buf.endsWith(word)) { buf = ""; triggerCode(word); break; }
    }
  });

  function triggerCode(word, fromWhisper = false) {
    if (word === "hettie") return hettieSurprise();
    if (word === "play") return location.href = "arcade.html";
    if (word === "medals") return location.href = "medals.html";
    if (word === "meow") return location.href = "catcorner.html";
    if (word === "disco") return discoMode();
    const animal = CONFIG.animals[word];
    if (!animal) {
      if (fromWhisper) FX.toast("hmm… that name isn't magic. yet. 🤔");
      return;
    }
    document.getElementById("secrets-modal").hidden = true;
    FX.toast(NOTES.animalLines[word]);
    Medals.summon(word);

    if (word === "egg") hatchEgg();
    else if (word === "mouse") { runner("🐭", { speed: 5 }); setTimeout(() => runner("🐱", { speed: 4.4 }), 600); }
    else if (word === "bee") runner("🐝", { bob: 40, trail: "✨", speed: 7 });
    else if (word === "rosie") runner("🐱", { speed: 9, trail: "🩷" });
    else if (word === "biscuit") { runner("🐴", { speed: 5, trail: "💨" }); maybeUnlockTreasure(); }
    else runner(animal.emoji, { trail: "💕" });
  }

  function maybeUnlockTreasure() {
    if (treasureOpen()) return;
    if (found().size === ALL_HEARTS.length) {
      localStorage.setItem(LS.treasure, "open");
      updateChip();
      setTimeout(() => {
        FX.confetti(5000);
        FX.toast("🗝️ the riddle is answered… the 🔒 in the menu just changed");
      }, 1200);
    }
  }

  // animal trots across the bottom of the screen, leaving a little trail
  function runner(emoji, { speed = 6, bob = 14, trail = "💕" } = {}) {
    const el = document.createElement("div");
    el.className = "egg-runner";
    el.textContent = emoji;
    document.body.appendChild(el);
    const start = performance.now();
    const dur = speed * 1000;
    let lastTrail = 0;
    (function step(t) {
      const p = (t - start) / dur;
      if (p >= 1) return el.remove();
      const x = -8 + p * 116;
      const y = Math.abs(Math.sin(p * Math.PI * 8)) * bob;
      el.style.left = x + "vw";
      el.style.bottom = `calc(7vh + ${y}px)`;
      if (t - lastTrail > 180) {
        lastTrail = t;
        const r = el.getBoundingClientRect();
        FX.pop(r.left, r.top + r.height / 2, 1, trail);
      }
      requestAnimationFrame(step);
    })(start);
  }

  function hatchEgg() {
    const el = document.createElement("div");
    el.className = "egg-hatch";
    el.textContent = "🥚";
    document.body.appendChild(el);
    setTimeout(() => { el.textContent = "🐣"; el.classList.add("hatched");
      const r = el.getBoundingClientRect();
      FX.burst(r.left + r.width / 2, r.top + r.height / 2, 30);
    }, 1600);
    setTimeout(() => el.remove(), 4000);
  }

  function hettieSurprise() {
    FX.confetti(4500);
    for (let i = 0; i < 10; i++)
      setTimeout(() => FX.burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.7, 14), i * 180);
    showNote(NOTES.animalLines.hettie);
  }

  // ---------- 🪩 disco mode ----------
  let discoTimer = null;
  function discoMode() {
    document.body.classList.add("disco");
    FX.confetti(6000);
    FX.toast("🪩 DISCO MODE 🪩");
    Medals.award("disco");
    clearTimeout(discoTimer);
    discoTimer = setTimeout(() => document.body.classList.remove("disco"), 15000);
  }

  // ---------- 🐾 wandering paw print → cat corner ----------
  function pawWander() {
    const startY = 20 + Math.random() * 50;
    const goRight = Math.random() < 0.5;
    for (let i = 0; i < 9; i++) {
      setTimeout(() => {
        const p = document.createElement("button");
        p.className = "paw";
        p.textContent = "🐾";
        const x = goRight ? 4 + i * 11 : 96 - i * 11;
        p.style.left = x + "vw";
        p.style.top = startY + Math.sin(i * 0.9) * 6 + "vh";
        p.style.transform = `rotate(${goRight ? 90 : -90}deg)`;
        p.addEventListener("click", () => (location.href = "catcorner.html"));
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 3500);
      }, i * 380);
    }
    schedulePaw();
  }
  function schedulePaw() {
    setTimeout(pawWander, 10000 + Math.random() * 15000);
  }

  // ---------- 🌙 night-only moon → goodnight page ----------
  function maybeMoon() {
    const h = new Date().getHours();
    if (h >= 21 || h < 6) {
      const m = document.createElement("button");
      m.className = "moon";
      m.textContent = "🌙";
      m.title = "psst…";
      m.addEventListener("click", () => (location.href = "goodnight.html"));
      document.body.appendChild(m);
    }
  }

  // ---------- ⏳ poke time three times → time machine ----------
  function bindHourglass() {
    const hg = document.querySelector(".nav .hg");
    if (!hg) return;
    let clicks = 0, timer = null;
    hg.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      clicks++;
      hg.classList.remove("crack");
      void hg.offsetWidth;
      hg.classList.add("crack");
      clearTimeout(timer);
      timer = setTimeout(() => (clicks = 0), 1600);
      if (clicks >= 3) location.href = "timemachine.html";
    });
  }

  // ---------- 💗 bother the title heart seven times → locket ----------
  function bindTitleHeart() {
    const th = document.getElementById("title-heart");
    if (!th) return;
    let clicks = 0;
    th.addEventListener("click", () => {
      clicks++;
      th.classList.remove("spin");
      void th.offsetWidth;
      th.classList.add("spin");
      if (clicks === 5) FX.toast("it's starting to open… keep going 👀");
      if (clicks >= 7) location.href = "locket.html";
    });
  }

  // ---------- boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    injectUI();
    bindHearts();
    maybeMoon();
    bindHourglass();
    bindTitleHeart();
    schedulePaw();
  });

  return { found, treasureOpen, bindHearts, showNote, updateChip };
})();
