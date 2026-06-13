// 💌 The mailbox: one sealed letter unlocks per day. Past letters stay
// readable. Day numbering starts from the anniversary.
(() => {
  const LS_KEY = "n3rus.mailbox"; // JSON array of unlocked day numbers

  const dayNumber = (date = new Date()) =>
    Math.floor((date - new Date(CONFIG.anniversary)) / 864e5);

  const unlocked = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
    catch { return []; }
  };

  const letterFor = (day) =>
    NOTES.dailyLetters[((day % NOTES.dailyLetters.length) + NOTES.dailyLetters.length) % NOTES.dailyLetters.length];

  document.addEventListener("DOMContentLoaded", () => {
    const env = document.getElementById("envelope");
    const today = dayNumber();
    const got = unlocked();
    const openedToday = got.includes(today);

    function renderPast() {
      const list = document.getElementById("past-letters");
      const days = unlocked().sort((a, b) => b - a);
      if (!days.length) { list.innerHTML = `<p class="muted">no letters opened yet…</p>`; return; }
      list.innerHTML = days.map((d) => {
        const date = new Date(new Date(CONFIG.anniversary).getTime() + d * 864e5);
        return `<div class="past-letter">
          <span class="past-date">${date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
          <p>${letterFor(d)}</p>
        </div>`;
      }).join("");
    }

    function showLetter(day) {
      document.getElementById("letter-text").textContent = letterFor(day);
      document.getElementById("letter").hidden = false;
      env.classList.add("opened");
      // heart #6 hides in the broken wax seal
      document.querySelector('[data-hh="h6"]').classList.add("sprouted");
      Eggs.bindHearts();
    }

    if (openedToday) showLetter(today);

    env.addEventListener("click", () => {
      if (env.classList.contains("opened")) return;
      const got = unlocked();
      if (got.includes(today)) return;
      got.push(today);
      localStorage.setItem(LS_KEY, JSON.stringify(got));
      const r = env.getBoundingClientRect();
      FX.burst(r.left + r.width / 2, r.top + r.height / 2, 24);
      showLetter(today);
      renderPast();
      if (got.length >= 7) Medals.award("bookworm");
    });

    // ----- 🥠 daily fortune -----
    const FORTUNE_KEY = "n3rus.fortuneDay";
    const cookie = document.getElementById("cookie");
    const crackedToday = localStorage.getItem(FORTUNE_KEY) === String(today);

    function showFortune() {
      cookie.textContent = "🥠✨";
      cookie.classList.add("cracked");
      document.getElementById("fortune-text").textContent =
        "“" + NOTES.fortunes[((today % NOTES.fortunes.length) + NOTES.fortunes.length) % NOTES.fortunes.length] + "”";
      document.getElementById("fortune").hidden = false;
    }

    if (crackedToday) showFortune();

    cookie.addEventListener("click", () => {
      if (localStorage.getItem(FORTUNE_KEY) === String(today)) return;
      localStorage.setItem(FORTUNE_KEY, String(today));
      const r = cookie.getBoundingClientRect();
      FX.burst(r.left + r.width / 2, r.top + r.height / 2, 14, ["✨", "🥠", "💗"]);
      showFortune();
      Medals.award("fortune");
    });

    // countdown to tomorrow's letter
    setInterval(() => {
      const el = document.getElementById("next-letter");
      if (!env.classList.contains("opened")) { el.textContent = "a letter is waiting… 👀"; return; }
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const ms = midnight - new Date();
      const h = Math.floor(ms / 36e5), m = Math.floor(ms / 6e4) % 60;
      el.textContent = `next letter unseals in ${h}h ${m}m ⏳`;
    }, 1000);

    renderPast();
  });
})();
