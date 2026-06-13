// 🌙 The goodnight room: twinkling stars and a heart constellation that
// draws itself. Visiting in the small hours earns the Night Owl medal.
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    Medals.visitRoom("goodnight");
    const h = new Date().getHours();
    if (h >= 0 && h < 5) Medals.award("night-owl");

    // sprinkle twinkling stars
    const sky = document.getElementById("sky");
    for (let i = 0; i < 40; i++) {
      const s = document.createElement("span");
      s.className = "star";
      s.textContent = Math.random() < 0.15 ? "✦" : "·";
      s.style.left = Math.random() * 96 + "%";
      s.style.top = Math.random() * 92 + "%";
      s.style.animationDelay = Math.random() * 4 + "s";
      s.style.fontSize = 8 + Math.random() * 10 + "px";
      sky.appendChild(s);
    }

    // draw the heart constellation
    const path = document.getElementById("heart-line");
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    requestAnimationFrame(() => {
      path.style.transition = "stroke-dashoffset 6s ease-in-out";
      path.style.strokeDashoffset = "0";
    });

    // the occasional shooting star
    setInterval(() => {
      if (Math.random() < 0.5) return;
      const s = document.createElement("span");
      s.className = "shooting-star";
      s.textContent = "💫";
      s.style.left = 10 + Math.random() * 60 + "%";
      s.style.top = 5 + Math.random() * 30 + "%";
      sky.appendChild(s);
      setTimeout(() => s.remove(), 1600);
    }, 4000);
  });
})();
