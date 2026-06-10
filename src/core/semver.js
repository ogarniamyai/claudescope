(function (root) {
  const OG = root.OG;

  function chunks(value) {
    return String(value == null ? "" : value)
      .trim()
      .split(".")
      .map(function (part) {
        const n = parseInt(part, 10);
        return Number.isFinite(n) ? n : 0;
      });
  }

  function compare(left, right) {
    const a = chunks(left);
    const b = chunks(right);
    const span = Math.max(a.length, b.length);
    for (let i = 0; i < span; i += 1) {
      const da = a[i] || 0;
      const db = b[i] || 0;
      if (da > db) return 1;
      if (da < db) return -1;
    }
    return 0;
  }

  function below(current, floor) {
    if (!floor) return false;
    return compare(current, floor) < 0;
  }

  OG.semver = { compare: compare, below: below };
})(typeof globalThis !== "undefined" ? globalThis : window);
