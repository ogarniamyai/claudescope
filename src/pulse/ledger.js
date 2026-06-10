(function (root) {
  const OG = root.OG;
  const KEY = "og.events";
  const CAP = 6000;
  const PRUNE_MS = 45 * 86400000;

  let last = { model: "", at: 0 };

  function record(model) {
    const now = Date.now();
    if (model === last.model && now - last.at < 1200) return;
    last = { model: model, at: now };
    OG.vault.patch(
      KEY,
      function (store) {
        const list = Array.isArray(store) ? store : [];
        list.push({ t: now, m: String(model) });
        const cutoff = now - PRUNE_MS;
        let trimmed = list.filter(function (row) {
          return row.t >= cutoff;
        });
        if (trimmed.length > CAP) trimmed = trimmed.slice(trimmed.length - CAP);
        return trimmed;
      },
      []
    );
  }

  async function all() {
    return await OG.vault.get(KEY, []);
  }

  OG.ledger = { record: record, all: all };
})(typeof globalThis !== "undefined" ? globalThis : window);
