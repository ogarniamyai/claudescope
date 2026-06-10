(function (root) {
  const OG = root.OG;

  async function grab(url, opts) {
    const settings = opts || {};
    const ctrl = settings.timeoutMs ? new AbortController() : null;
    const timer = ctrl ? setTimeout(function () { ctrl.abort(); }, settings.timeoutMs) : null;
    try {
      const res = await fetch(url, {
        credentials: settings.creds || "same-origin",
        headers: { Accept: "application/json" },
        signal: ctrl ? ctrl.signal : undefined
      });
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        void err;
        data = null;
      }
      return { ok: res.ok, status: res.status, data: data, text: text };
    } catch (err) {
      void err;
      return { ok: false, status: 0, data: null, text: "" };
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function fill(template, slots) {
    let out = String(template == null ? "" : template);
    Object.keys(slots || {}).forEach(function (key) {
      out = out.split("{" + key + "}").join(slots[key]);
    });
    return out;
  }

  OG.caller = { grab: grab, fill: fill };
})(typeof globalThis !== "undefined" ? globalThis : window);
