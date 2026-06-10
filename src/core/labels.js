(function (root) {
  const OG = root.OG;

  function dict(group, key, fallback) {
    const all = (OG.settings.current && OG.settings.current.dict) || {};
    const table = all[group] || {};
    const k = String(key == null ? "" : key).toLowerCase();
    return table[k] || fallback || key || "";
  }

  function status(value) {
    return dict("status", value, value || "-");
  }

  function interval(value) {
    return dict("interval", value, value || "-");
  }

  function cap(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function prettyModel(id) {
    const raw = String(id || "").replace(/^claude-/, "");
    if (!raw) return "Model";
    let parts = raw.split("-").filter(Boolean);
    while (parts.length > 1 && /^\d{4,}$/.test(parts[parts.length - 1])) {
      parts.pop();
    }
    const family = parts
      .filter(function (p) {
        return /[a-z]/i.test(p);
      })
      .map(cap)
      .join(" ");
    const nums = parts.filter(function (p) {
      return /^\d{1,2}$/.test(p);
    });
    const out = [family, nums.join(".")].filter(Boolean).join(" ");
    return out || raw;
  }

  function model(id) {
    return prettyModel(id);
  }

  OG.labels = { status: status, interval: interval, model: model };
})(typeof globalThis !== "undefined" ? globalThis : window);
