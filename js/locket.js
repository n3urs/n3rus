// 📿 The locket: click to swing it open. Shows drawn art, or real photos if
// any paths are listed in NOTES.locket.photos.
(() => {
  // stick-figure-cute "us": two round friends holding hands, plus the horse
  const ART_US = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="34" r="13" fill="#ffd6e8" stroke="#d6336c" stroke-width="2.5"/>
      <path d="M26 30 q4 -8 9 -4 q3 -6 8 -2" fill="none" stroke="#d6336c" stroke-width="2" stroke-linecap="round"/>
      <circle cx="31" cy="34" r="1.6" fill="#6b2a47"/><circle cx="39" cy="34" r="1.6" fill="#6b2a47"/>
      <path d="M31 39 q4 3 8 0" fill="none" stroke="#6b2a47" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="67" cy="34" r="13" fill="#fff" stroke="#d6336c" stroke-width="2.5"/>
      <path d="M56 28 q5 -9 12 -5 q6 -3 9 4" fill="none" stroke="#d6336c" stroke-width="2" stroke-linecap="round"/>
      <circle cx="63" cy="34" r="1.6" fill="#6b2a47"/><circle cx="71" cy="34" r="1.6" fill="#6b2a47"/>
      <path d="M63 39 q4 3 8 0" fill="none" stroke="#6b2a47" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M35 47 v18 M67 47 v18 M35 53 q16 8 32 0" fill="none" stroke="#d6336c" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M28 86 l7 -21 M42 86 l-7 -21 M60 86 l7 -21 M74 86 l-7 -21" stroke="#d6336c" stroke-width="2.5" stroke-linecap="round"/>
      <text x="50" y="20" font-size="11" text-anchor="middle">💗</text>
    </svg>`;
  const ART_GANG = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="30" font-size="17" text-anchor="middle">🐴</text>
      <text x="28" y="52" font-size="13" text-anchor="middle">🐶</text>
      <text x="50" y="55" font-size="13" text-anchor="middle">🐕</text>
      <text x="72" y="52" font-size="13" text-anchor="middle">🐝</text>
      <text x="38" y="74" font-size="13" text-anchor="middle">🐭</text>
      <text x="62" y="74" font-size="13" text-anchor="middle">🐱</text>
      <text x="50" y="88" font-size="7" text-anchor="middle" fill="#a4688a">the whole gang</text>
    </svg>`;

  document.addEventListener("DOMContentLoaded", () => {
    Medals.visitRoom("locket");
    const locket = document.getElementById("locket");
    const f1 = document.getElementById("locket-frame-1");
    const f2 = document.getElementById("locket-frame-2");
    const photos = NOTES.locket.photos;

    if (photos.length >= 2) {
      f1.innerHTML = `<img src="${photos[0]}" alt="us">`;
      f2.innerHTML = `<img src="${photos[1]}" alt="us">`;
    } else {
      f1.innerHTML = ART_US;
      f2.innerHTML = ART_GANG;
    }

    locket.addEventListener("click", () => {
      if (locket.classList.contains("open")) return;
      locket.classList.add("open");
      const r = locket.getBoundingClientRect();
      FX.burst(r.left + r.width / 2, r.top + r.height / 2, 22);
      const cap = document.getElementById("locket-caption");
      cap.textContent = NOTES.locket.caption;
      cap.hidden = false;
    });
  });
})();
