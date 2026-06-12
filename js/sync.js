// Cross-device date syncing. The shared date lives at CONFIG.syncUrl
// (a tiny free text store). localStorage keeps a cache so the site still
// works offline or if the store ever hiccups.
const Sync = {
  CACHE_KEY: "n3rus.countdown",

  cached() {
    try { return JSON.parse(localStorage.getItem(this.CACHE_KEY)); }
    catch { return null; }
  },

  cache(data) {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
  },

  // -> { target: "YYYY-MM-DDTHH:MM", setAt: ISO string, source: "sync"|"cache"|"fallback" }
  async load() {
    try {
      const res = await fetch(CONFIG.syncUrl, { cache: "no-store" });
      if (res.ok) {
        const text = (await res.text()).trim();
        if (text) {
          const data = JSON.parse(text);
          if (data && data.target) {
            this.cache(data);
            return { ...data, source: "sync" };
          }
        }
      }
    } catch (e) { /* offline or store down — fall through */ }

    const cached = this.cached();
    if (cached && cached.target) return { ...cached, source: "cache" };

    return {
      target: CONFIG.fallbackTarget,
      setAt: CONFIG.anniversary,
      source: "fallback",
    };
  },

  // Saves for BOTH of you. Returns true if it reached the shared store.
  async save(target) {
    const data = { target, setAt: new Date().toISOString() };
    this.cache(data);
    try {
      // text/plain keeps this a "simple" CORS request — no preflight needed
      const res = await fetch(CONFIG.syncUrl, {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },
};
