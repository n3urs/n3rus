// Main page: the countdown itself, captions, milestones, the date-setter,
// the relationship count-up, and the together-day celebration.
const Countdown = (() => {
  let state = { target: null, setAt: null };
  let celebrated = false;

  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, "0");

  function parseLocal(str) { return new Date(str); }

  // ---------- rendering ----------
  let prevDigits = {};
  function renderCountdown() {
    const now = new Date();
    const target = parseLocal(state.target);
    let ms = target - now;

    if (ms <= 0) { if (!celebrated) celebrate(); return; }

    const d = Math.floor(ms / 864e5);
    const h = Math.floor(ms / 36e5) % 24;
    const m = Math.floor(ms / 6e4) % 60;
    const s = Math.floor(ms / 1e3) % 60;
    setDigit("cd-days", d);
    setDigit("cd-hours", pad(h));
    setDigit("cd-mins", pad(m));
    setDigit("cd-secs", pad(s));

    // mascot beats faster as the day gets closer
    const mascot = $("mascot");
    const daysLeft = ms / 864e5;
    mascot.style.animationDuration =
      daysLeft > 14 ? "1.6s" : daysLeft > 3 ? "1.1s" : daysLeft > 1 ? "0.8s" : "0.5s";

    renderProgress(now, target);
    renderMilestone(ms, d);
  }

  function setDigit(id, val) {
    const el = $(id);
    if (prevDigits[id] !== val) {
      prevDigits[id] = val;
      el.textContent = val;
      el.classList.remove("tick");
      void el.offsetWidth; // restart animation
      el.classList.add("tick");
    }
  }

  function renderProgress(now, target) {
    const from = state.setAt ? new Date(state.setAt) : null;
    const bar = $("progress-hearts");
    const label = $("progress-label");
    if (!from || from >= target) { bar.parentElement.hidden = true; return; }
    bar.parentElement.hidden = false;
    const pct = Math.min(1, Math.max(0, (now - from) / (target - from)));
    const filled = Math.round(pct * 10);
    bar.textContent = "💗".repeat(filled) + "🤍".repeat(10 - filled);
    label.textContent = `${Math.floor(pct * 100)}% of the way back to each other`;
  }

  function renderMilestone(ms, days) {
    const el = $("milestone");
    const today = new Date();
    let msg = "";
    if (today.getDate() === 24 && today.getMonth() === 9)
      msg = "🥂 it's the 24th of October — happy anniversary, us!";
    else if (ms <= 864e5) msg = "😱 ONE MORE SLEEP!!! 😱";
    else if (ms <= 100 * 36e5) msg = "⏰ under 100 hours to go!!";
    else if (days < 7) msg = "✨ it's the final week ✨";
    el.textContent = msg;
    el.hidden = !msg;
  }

  // ---------- rotating captions ----------
  let capIdx = 0;
  function rotateCaption() {
    const days = Math.max(0, Math.ceil((parseLocal(state.target) - new Date()) / 864e5));
    const lines = NOTES.captions.filter((c) => !c.includes("[PLACEHOLDER"));
    const el = $("caption");
    el.classList.remove("swap");
    void el.offsetWidth;
    el.classList.add("swap");
    el.textContent = lines[capIdx % lines.length].replaceAll("{days}", days);
    capIdx++;
  }

  // ---------- relationship count-up ----------
  function renderUs() {
    const start = parseLocal(CONFIG.anniversary);
    let ms = Date.now() - start;
    const d = Math.floor(ms / 864e5);
    const h = Math.floor(ms / 36e5) % 24;
    const m = Math.floor(ms / 6e4) % 60;
    const s = Math.floor(ms / 1e3) % 60;
    $("us-timer").textContent = `${d.toLocaleString()} days, ${h}h ${m}m ${s}s`;
    $("us-beats").textContent =
      `(roughly ${Math.floor(ms / 1000 * 1.2).toLocaleString()} heartbeats each 💓)`;
  }

  // ---------- date setter ----------
  function openSetter() {
    const input = $("date-input");
    input.value = state.target;
    $("setter-modal").hidden = false;
  }

  async function saveDate(e) {
    e.preventDefault();
    const val = $("date-input").value;
    if (!val) return;
    const btn = $("setter-save");
    btn.disabled = true; btn.textContent = "saving…";
    const ok = await Sync.save(val);
    btn.disabled = false; btn.textContent = "save for both of us 💌";
    state.target = val;
    state.setAt = new Date().toISOString();
    celebrated = false;
    $("setter-modal").hidden = true;
    document.querySelector(".celebration")?.remove();
    FX.toast(ok ? "saved!! it'll show on Hettie's screen too 💗"
                : "saved on this device — internet hiccup, hit save again later to sync 📡");
    FX.confetti(2500);
    renderCountdown();
  }

  // ---------- celebration ----------
  function celebrate(isPreview = false) {
    if (!isPreview) celebrated = true;
    if (document.querySelector(".celebration")) return;
    const o = document.createElement("div");
    o.className = "celebration";
    o.innerHTML = `
      <div class="celebration-inner">
        <div class="celebration-hearts">💗💞💗</div>
        <h1>WE'RE TOGETHER<br>RIGHT NOW!!!</h1>
        <p class="celebration-sub">no more counting, ${CONFIG.herName} 🥹</p>
        <p class="celebration-us">we've been us for <span id="celebration-us"></span></p>
        ${isPreview
          ? `<button class="btn ghost" id="celebration-close">back to counting ⏳</button>`
          : `<button class="btn" id="celebration-next">set our next date 💞</button>`}
      </div>`;
    document.body.appendChild(o);
    FX.confetti(9000);
    const usEl = o.querySelector("#celebration-us");
    setInterval(() => {
      const ms = Date.now() - parseLocal(CONFIG.anniversary);
      usEl.textContent = `${Math.floor(ms / 864e5).toLocaleString()} days 💗`;
    }, 1000);
    o.querySelector("#celebration-close")?.addEventListener("click", () => o.remove());
    o.querySelector("#celebration-next")?.addEventListener("click", () => {
      o.remove();
      openSetter();
    });
  }

  // ---------- boot ----------
  document.addEventListener("DOMContentLoaded", async () => {
    state = await Sync.load();
    if (state.source === "fallback")
      FX.toast("👋 set your real date with the 💞 button below!");

    renderCountdown();
    renderUs();
    rotateCaption();
    setInterval(renderCountdown, 1000);
    setInterval(renderUs, 1000);
    setInterval(rotateCaption, 6000);

    $("change-date").addEventListener("click", openSetter);
    $("setter-form").addEventListener("submit", saveDate);

    // re-check the shared store every few minutes in case the other one of
    // you changed the date while this tab was open
    setInterval(async () => {
      const fresh = await Sync.load();
      if (fresh.source === "sync" && fresh.target !== state.target) {
        state = fresh;
        celebrated = false;
        FX.toast("💌 the date just changed — someone misses you");
        renderCountdown();
      }
    }, 3 * 60 * 1000);
  });

  return { celebrate };
})();
