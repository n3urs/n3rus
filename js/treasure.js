// 🗝️ The treasure room. Locked behind the riddle (answer: see config).
// Finding all six hearts reveals the riddle; the answer opens this page.
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const gate = document.getElementById("gate");
    const room = document.getElementById("treasure-room");

    function open(first = false) {
      localStorage.setItem("n3rus.treasure", "open");
      gate.hidden = true;
      room.hidden = false;
      document.getElementById("treasure-letter").textContent = NOTES.treasureLetter;
      const start = new Date(CONFIG.anniversary);
      const ms = Date.now() - start;
      document.getElementById("treasure-stats").innerHTML = `
        <div><b>${Math.floor(ms / 864e5).toLocaleString()}</b><span>days of us</span></div>
        <div><b>${Math.floor(ms / 36e5).toLocaleString()}</b><span>hours of us</span></div>
        <div><b>∞</b><span>still to come</span></div>`;
      if (first) {
        FX.confetti(8000);
        for (let i = 0; i < 8; i++)
          setTimeout(() => FX.burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.6, 16), i * 250);
      }
      Eggs.updateChip();
    }

    if (Eggs.treasureOpen()) { open(false); return; }

    document.getElementById("gate-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const guess = document.getElementById("gate-input").value.trim().toLowerCase();
      if (guess === CONFIG.riddleAnswer) {
        open(true);
      } else {
        gate.classList.remove("shake");
        void gate.offsetWidth;
        gate.classList.add("shake");
        FX.toast("not quite… 🤔 (the six hidden hearts know the way)");
      }
      document.getElementById("gate-input").value = "";
    });
  });
})();
