// ⏳ Fun (real) numbers since the anniversary, ticking live.
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    Medals.visitRoom("timemachine");
    const grid = document.getElementById("stat-grid");
    const start = new Date(CONFIG.anniversary);

    function stats() {
      const ms = Date.now() - start;
      const sec = ms / 1000;
      const days = ms / 864e5;
      const list = [
        { n: Math.floor(sec), label: "seconds of being us", emoji: "⏱️" },
        { n: Math.floor(days), label: "days together", emoji: "📆" },
        { n: Math.floor(days / 29.53), label: "full moons we've shared", emoji: "🌕" },
        { n: Math.floor(sec * 29.78), label: "km the Earth has flown us through space", emoji: "🚀" },
        { n: Math.floor(sec / 60 * 80 * 2), label: "combined heartbeats", emoji: "💓" },
        { n: Math.floor(days * 16 * 60 * 15), label: "times you've blinked thinking about me*", emoji: "👀" },
        { n: Math.floor(days * 3), label: "cups of tea owed to each other (est.)", emoji: "☕" },
        { n: Math.floor(days * 24 * 2.5), label: "carrots Biscuit has demanded since", emoji: "🥕" },
      ];
      if (CONFIG.herBirthday) {
        const lifeMs = Date.now() - new Date(CONFIG.herBirthday);
        list.splice(2, 0, {
          n: ((ms / lifeMs) * 100).toFixed(2) + "%",
          label: "of your life you've been stuck with me", emoji: "📈",
        });
      }
      return list;
    }

    function render() {
      grid.innerHTML = stats().map((s) => `
        <div class="stat">
          <span class="stat-emoji">${s.emoji}</span>
          <b>${typeof s.n === "number" ? s.n.toLocaleString() : s.n}</b>
          <span>${s.label}</span>
        </div>`).join("");
    }

    render();
    setInterval(render, 1000);

    const note = document.createElement("p");
    note.className = "muted tiny";
    note.textContent = "*all blinks count. I checked.";
    grid.after(note);
  });
})();
