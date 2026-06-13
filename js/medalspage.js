// 🏅 Renders the medal cabinet.
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const got = Medals.earned();
    const grid = document.getElementById("medal-grid");

    grid.innerHTML = Medals.DEFS.map((d) => {
      const when = got[d.id];
      if (when) {
        const date = new Date(when).toLocaleDateString(undefined, { day: "numeric", month: "short" });
        return `<div class="medal earned" title="earned ${date}">
          <span class="medal-emoji">${d.emoji}</span>
          <b>${d.name}</b><span class="medal-how">${d.how === "???" ? "you found a secret 🤫" : d.how}</span>
          <span class="medal-date">🎀 ${date}</span>
        </div>`;
      }
      return `<div class="medal locked">
        <span class="medal-emoji">${d.secret ? "❓" : d.emoji}</span>
        <b>${d.secret ? "???" : d.name}</b><span class="medal-how">${d.how}</span>
      </div>`;
    }).join("");

    const n = Object.keys(got).length;
    document.getElementById("medal-tally").textContent =
      n === 0 ? "no medals yet — go do something lovely" :
      n === Medals.DEFS.length ? `ALL ${n} MEDALS!! undisputed champion 🏆👑` :
      `${n} of ${Medals.DEFS.length} earned so far`;
  });
})();
