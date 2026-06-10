(function (root) {
  const OG = root.OG;

  function normalize(payload, fields) {
    const record = {};
    const map = fields || {};
    Object.keys(map).forEach(function (key) {
      record[key] = OG.reach.read(payload, map[key]);
    });
    return record;
  }

  OG.shape = { normalize: normalize };
})(typeof globalThis !== "undefined" ? globalThis : window);
