// 🏅 The medal system. Deeds around the site earn medals; the cabinet
// (medals.html) displays them. Secret medals show as ??? until earned.
const Medals = (() => {
  const LS = {
    medals: "n3rus.medals",       // { id: ISO date earned }
    streak: "n3rus.streak",       // { last: "YYYY-MM-DD", count: n }
    summoned: "n3rus.summoned",   // [animal codes typed]
    rooms: "n3rus.secretRooms",   // [secret page ids visited]
  };

  const DEFS = [
    { id: "first-heart",    emoji: "🥉", name: "First Heartbeat",   how: "find your first hidden heart" },
    { id: "all-hearts",     emoji: "🏆", name: "Heart Collector",   how: "find all six hidden hearts" },
    { id: "treasure",       emoji: "🗝️", name: "Treasure Hunter",   how: "open the treasure room" },
    { id: "gardener",       emoji: "🏵️", name: "Green Fingers",     how: "plant 10 flowers" },
    { id: "master-gardener",emoji: "🌹", name: "Master Gardener",   how: "plant 50 flowers" },
    { id: "bookworm",       emoji: "📚", name: "Hopeless Romantic", how: "open 7 daily letters" },
    { id: "zoologist",      emoji: "🐾", name: "Zookeeper",         how: "summon all six animals by name" },
    { id: "fortune",        emoji: "🥠", name: "Fortunate",         how: "crack open a fortune cookie" },
    { id: "streak-3",       emoji: "🥈", name: "Three in a Row",    how: "visit three days running" },
    { id: "streak-7",       emoji: "🥇", name: "Devoted",           how: "visit seven days running" },
    { id: "explorer",       emoji: "🧭", name: "Secret Explorer",   how: "discover all four secret rooms" },
    { id: "arcade-bronze",  emoji: "🥉", name: "Heart Catcher",     how: "score 15 in the arcade" },
    { id: "arcade-silver",  emoji: "🥈", name: "Heart Snatcher",    how: "score 30 in the arcade" },
    { id: "arcade-gold",    emoji: "🥇", name: "Heart Magnet",      how: "score 50 in the arcade" },
    { id: "night-owl",      emoji: "🦉", name: "Night Owl",         how: "???", secret: true },
    { id: "disco",          emoji: "🪩", name: "Disco Inferno",     how: "???", secret: true },
    { id: "cat-friend",     emoji: "😻", name: "Certified Cat Person", how: "???", secret: true },
  ];

  const get = (k, fb) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; }
  };
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const earned = () => get(LS.medals, {});

  // ----- awarding (queued so multiple medals don't talk over each other) -----
  let queue = [];
  let showing = false;

  function award(id) {
    const m = earned();
    if (m[id]) return false;
    const def = DEFS.find((d) => d.id === id);
    if (!def) return false;
    m[id] = new Date().toISOString();
    set(LS.medals, m);
    queue.push(def);
    if (!showing) nextBanner();
    injectNav();
    return true;
  }

  function nextBanner() {
    const def = queue.shift();
    if (!def) { showing = false; return; }
    showing = true;
    const b = document.createElement("div");
    b.className = "medal-banner";
    b.innerHTML = `<span class="medal-banner-emoji">${def.emoji}</span>
      <div><b>medal earned!</b><br>${def.name}</div>`;
    document.body.appendChild(b);
    FX.confetti(2200);
    requestAnimationFrame(() => b.classList.add("show"));
    setTimeout(() => {
      b.classList.remove("show");
      setTimeout(() => { b.remove(); nextBanner(); }, 450);
    }, 2800);
  }

  // ----- nav 🏅 pill, appears once any medal is earned -----
  function injectNav() {
    const nav = document.querySelector(".nav");
    if (!nav || nav.querySelector(".medal-pill")) return;
    if (!Object.keys(earned()).length) return;
    const a = document.createElement("a");
    a.href = "medals.html";
    a.className = "medal-pill";
    a.textContent = "🏅";
    a.title = "your medals";
    nav.appendChild(a);
  }

  // ----- visit streaks -----
  function trackStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const s = get(LS.streak, { last: "", count: 0 });
    if (s.last === today) return;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    s.count = s.last === yesterday ? s.count + 1 : 1;
    s.last = today;
    set(LS.streak, s);
    if (s.count >= 3) award("streak-3");
    if (s.count >= 7) award("streak-7");
  }

  // ----- helpers for the other scripts -----
  function summon(code) {
    const s = new Set(get(LS.summoned, []));
    s.add(code);
    set(LS.summoned, [...s]);
    if (Object.keys(CONFIG.animals).every((a) => s.has(a))) award("zoologist");
  }

  function visitRoom(id) {
    const r = new Set(get(LS.rooms, []));
    r.add(id);
    set(LS.rooms, [...r]);
    if (["catcorner", "goodnight", "timemachine", "locket"].every((p) => r.has(p)))
      award("explorer");
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectNav();
    trackStreak();
  });

  return { DEFS, earned, award, summon, visitRoom };
})();
