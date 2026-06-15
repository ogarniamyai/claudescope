(function () {
  const self = document.currentScript;
  const match = (self && self.dataset.match) || "/completion";
  const modelPath = (self && self.dataset.modelPath) || "model";
  const beacon = (self && self.dataset.beacon) || "claudescope";

  function dig(node, path) {
    const steps = [];
    String(path).split(".").forEach(function (seg) {
      if (!seg) return;
      const head = seg.replace(/\[\d+\]/g, "");
      if (head) steps.push(head);
      (seg.match(/\[(\d+)\]/g) || []).forEach(function (b) {
        steps.push(parseInt(b.slice(1, -1), 10));
      });
    });
    let cur = node;
    for (let i = 0; i < steps.length; i += 1) {
      if (cur == null) return undefined;
      cur = cur[steps[i]];
    }
    return cur;
  }

  function announce(model) {
    if (!model) return;
    try {
      window.postMessage({ beacon: beacon, model: String(model) }, window.location.origin);
    } catch (err) {
      void err;
    }
  }

  function inspect(url, body) {
    if (!url || String(url).indexOf(match) < 0) return;
    if (typeof body !== "string") return;
    try {
      const parsed = JSON.parse(body);
      announce(dig(parsed, modelPath));
    } catch (err) {
      void err;
    }
  }

  const nativeFetch = window.fetch;
  if (typeof nativeFetch === "function") {
    window.fetch = function (input, init) {
      try {
        const url = typeof input === "string" ? input : input && input.url;
        const body = init && init.body;
        inspect(url, body);
      } catch (err) {
        void err;
      }
      return nativeFetch.apply(this, arguments);
    };
  }

  const NativeXHR = window.XMLHttpRequest;
  if (NativeXHR && NativeXHR.prototype) {
    const open = NativeXHR.prototype.open;
    const send = NativeXHR.prototype.send;
    NativeXHR.prototype.open = function (method, url) {
      this.__ogUrl = url;
      return open.apply(this, arguments);
    };
    NativeXHR.prototype.send = function (body) {
      try {
        inspect(this.__ogUrl, body);
      } catch (err) {
        void err;
      }
      return send.apply(this, arguments);
    };
  }
})();
