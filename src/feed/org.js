(function (root) {
  const OG = root.OG;

  async function probe(url, picks) {
    if (!url) return null;
    const pull = await OG.caller.grab(url);
    if (!pull.ok || !pull.data) return null;
    return OG.reach.firstHit(pull.data, picks);
  }

  async function resolve() {
    const cached = await OG.vault.get("og.orgId", null);
    if (cached) return cached;
    const cfg = (OG.settings.current && OG.settings.current.org) || {};
    let id = await probe(cfg.url, cfg.pick);
    if (!id) id = await probe(cfg.fallbackUrl, cfg.fallbackPick);
    if (id) await OG.vault.set("og.orgId", id);
    return id;
  }

  OG.org = { resolve: resolve };
})(typeof globalThis !== "undefined" ? globalThis : window);
