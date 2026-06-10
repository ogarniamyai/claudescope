(function (root) {
  const OG = root.OG;
  const api = root.chrome || root.browser;

  function inject() {
    const cap = (OG.settings.current && OG.settings.current.capture) || {};
    const el = document.createElement("script");
    el.src = api.runtime.getURL("src/capture/model-reader.injected.js");
    el.dataset.match = cap.match || "/completion";
    el.dataset.modelPath = cap.modelPath || "model";
    el.dataset.beacon = OG.tag;
    el.onload = function () {
      el.remove();
    };
    (document.head || document.documentElement).appendChild(el);
  }

  function listen() {
    window.addEventListener("message", function (ev) {
      if (ev.source !== window) return;
      const data = ev.data;
      if (!data || data.beacon !== OG.tag || !data.model) return;
      OG.ledger.record(data.model);
    });
  }

  function start() {
    listen();
    inject();
  }

  OG.relay = { start: start };
})(typeof globalThis !== "undefined" ? globalThis : window);
