(function (root) {
  const OG = root.OG;

  let memCache = null;

  async function probe(url, picks) {
    if (!url) return null;
    const pull = await OG.caller.grab(url);
    if (!pull.ok || !pull.data) return null;
    return OG.reach.firstHit(pull.data, picks);
  }

  async function resolve() {
    if (memCache) return memCache;
    const cfg = (OG.settings.current && OG.settings.current.org) || {};
    let id = await probe(cfg.url, cfg.pick);
    if (!id) id = await probe(cfg.fallbackUrl, cfg.fallbackPick);
    if (id) {
      memCache = id;
      await OG.vault.set("og.orgId", id);
      return id;
    }
    return await OG.vault.get("og.orgId", null);
  }

  OG.org = { resolve: resolve };
})(typeof globalThis !== "undefined" ? globalThis : window);
