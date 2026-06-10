(function (root) {
  const OG = root.OG;

  function tokens(path) {
    const out = [];
    String(path == null ? "" : path).split(".").forEach(function (segment) {
      if (!segment) return;
      const head = segment.replace(/\[\d+\]/g, "");
      if (head) out.push(head);
      const brackets = segment.match(/\[(\d+)\]/g) || [];
      brackets.forEach(function (b) {
        out.push(parseInt(b.slice(1, -1), 10));
      });
    });
    return out;
  }

  function dig(payload, path) {
    let node = payload;
    const steps = tokens(path);
    for (let i = 0; i < steps.length; i += 1) {
      if (node == null) return undefined;
      node = node[steps[i]];
    }
    return node;
  }

  function flatten(value) {
    if (value == null) return null;
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch (err) {
        void err;
        return String(value);
      }
    }
    return String(value);
  }

  function toNumber(text, fallback) {
    if (text == null) return fallback;
    const cleaned = text.replace(/[^0-9.+-]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }

  function toInstant(text, fallback) {
    if (text == null) return fallback;
    const d = new Date(text);
    return Number.isNaN(d.getTime()) ? fallback : d.toISOString();
  }

  function shape(raw, as, fallback) {
    const flat = flatten(raw);
    const miss = fallback === undefined ? null : fallback;
    if (flat == null) return miss;
    if (as === "number") return toNumber(flat, miss);
    if (as === "instant" || as === "day") return toInstant(flat, miss);
    return flat;
  }

  function read(payload, spec) {
    const raw = dig(payload, spec.path);
    return shape(raw, spec.as, spec.fallback);
  }

  function firstHit(payload, paths) {
    const list = Array.isArray(paths) ? paths : [];
    for (let i = 0; i < list.length; i += 1) {
      const hit = dig(payload, list[i]);
      if (hit != null && hit !== "") return flatten(hit);
    }
    return null;
  }

  OG.reach = {
    tokens: tokens,
    dig: dig,
    flatten: flatten,
    shape: shape,
    read: read,
    firstHit: firstHit
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
