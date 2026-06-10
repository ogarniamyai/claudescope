(function (root) {
  const OG = root.OG;
  const api = root.chrome || root.browser;

  let current = null;

  async function bundled() {
    try {
      const url = api.runtime.getURL("config/runtime.config.json");
      const res = await fetch(url);
      return await res.json();
    } catch (err) {
      void err;
      return {};
    }
  }

  async function remote(seed) {
    const url = seed && seed.selfUpdate ? seed.selfUpdate.configUrl : "";
    if (!url || url.indexOf("OWNER/REPO") >= 0) return null;
    const pull = await OG.caller.grab(url, { creds: "omit", timeoutMs: 4000 });
    if (!pull.ok || !pull.data) return null;
    if (pull.data.schema !== seed.schema) return null;
    return pull.data;
  }

  async function load() {
    const local = await bundled();
    const fresh = await remote(local);
    const merged = fresh || local;
    current = merged;
    OG.settings.current = merged;
    return merged;
  }

  function health() {
    const cfg = current || {};
    const outdated = OG.semver.below(OG.version, cfg.minClientVersion);
    const notice = cfg.notice && cfg.notice.text ? cfg.notice : null;
    return { outdated: outdated, notice: notice };
  }

  OG.settings = { load: load, health: health, current: null };
})(typeof globalThis !== "undefined" ? globalThis : window);
