(function (root) {
  const OG = root.OG;
  const KEY = "og.usage";
  const PRUNE_MS = 45 * 86400000;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function dayKey(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function clamp(v) {
    const n = Number(v);
    if (!isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function record(sessionPct, weekPct) {
    const now = new Date();
    const day = dayKey(now);
    const hour = now.getHours();
    const a = clamp(sessionPct);
    const b = clamp(weekPct);
    OG.vault.patch(
      KEY,
      function (store) {
        const next = store && typeof store === "object" ? store : {};
        const cutoff = Date.now() - PRUNE_MS;
        Object.keys(next).forEach(function (k) {
          const stamp = Date.parse(k);
          if (!isNaN(stamp) && stamp < cutoff) delete next[k];
        });
        if (typeof next[day] !== "object" || next[day] === null) next[day] = {};
        next[day][hour] = { a: a, b: b };
        return next;
      },
      {}
    );
  }

  async function store() {
    return await OG.vault.get(KEY, {});
  }

  OG.usagelog = { record: record, store: store };
})(typeof globalThis !== "undefined" ? globalThis : window);
