(function (root) {
  const OG = root.OG;

  async function pull(name, org) {
    const cfg = (OG.settings.current && OG.settings.current.sources) || {};
    const spec = cfg[name];
    if (!spec || !spec.url) return { ok: true, data: {} };
    const url = OG.caller.fill(spec.url, { org: org });
    const res = await OG.caller.grab(url);
    if (!res.ok || !res.data) return { ok: false, data: {} };
    return { ok: true, data: OG.shape.normalize(res.data, spec.fields) };
  }

  async function collect(org) {
    const usage = await pull("usage", org);
    const billing = await pull("billing", org);
    const failures = [];
    if (!usage.ok) failures.push("zużycia");
    if (!billing.ok) failures.push("subskrypcji");
    const error = failures.length ? "Nie udało się pobrać danych " + failures.join(" i ") + "." : null;
    const sessionPct = usage.ok ? usage.data.sessionPct : null;
    const weekPct = usage.ok ? usage.data.weekPct : null;
    return {
      at: Date.now(),
      error: error,
      session: { pct: sessionPct, reset: usage.ok ? usage.data.sessionReset || null : null },
      week: { pct: weekPct, reset: usage.ok ? usage.data.weekReset || null : null },
      billing: {
        nextChargeDate: billing.ok ? billing.data.nextChargeDate || null : null,
        nextChargeInstant: billing.ok ? billing.data.nextChargeInstant || null : null,
        status: billing.ok ? billing.data.status || "unknown" : "unknown",
        interval: billing.ok ? billing.data.interval || "monthly" : "monthly"
      }
    };
  }

  OG.sources = { collect: collect };
})(typeof globalThis !== "undefined" ? globalThis : window);
