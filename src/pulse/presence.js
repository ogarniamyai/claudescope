(function (root) {
  const OG = root.OG;
  const KEY = "og.presence";

  let book = {};
  let pending = {};
  let ticker = null;

  function visible() {
    return document.visibilityState === "visible" && document.hasFocus();
  }

  function slot(map, day) {
    if (typeof map[day] !== "object" || map[day] === null) map[day] = {};
    return map[day];
  }

  function bump(day, hour, by) {
    const bag = slot(book, day);
    bag[hour] = (bag[hour] || 0) + by;
  }

  function pendingCount() {
    let n = 0;
    Object.keys(pending).forEach(function (k) {
      n += pending[k];
    });
    return n;
  }

  async function flush() {
    if (!pendingCount()) return;
    const deltas = pending;
    pending = {};
    book = await OG.vault.patch(
      KEY,
      function (store) {
        const next = store || {};
        Object.keys(deltas).forEach(function (k) {
          const cut = k.split("#");
          const bag = slot(next, cut[0]);
          bag[cut[1]] = (bag[cut[1]] || 0) + deltas[k];
        });
        return next;
      },
      {}
    );
  }

  function tick() {
    if (!visible()) return;
    const now = new Date();
    const day = OG.clock.localDayKey(now);
    const hour = now.getHours();
    bump(day, hour, 1);
    pending[day + "#" + hour] = (pending[day + "#" + hour] || 0) + 1;
    if (pendingCount() >= 10) flush();
  }

  function daySeconds(map) {
    if (typeof map === "number") return map;
    let sum = 0;
    const bag = map || {};
    Object.keys(bag).forEach(function (h) {
      sum += bag[h] || 0;
    });
    return sum;
  }

  function todaySeconds() {
    return daySeconds(book[OG.clock.localDayKey()]);
  }

  async function store() {
    await flush();
    return await OG.vault.get(KEY, {});
  }

  async function start() {
    book = await OG.vault.get(KEY, {});
    ticker = setInterval(tick, 1000);
    window.addEventListener("visibilitychange", flush);
    window.addEventListener("blur", flush);
    window.addEventListener("pagehide", flush);
  }

  OG.presence = {
    start: start,
    todaySeconds: todaySeconds,
    daySeconds: daySeconds,
    store: store,
    active: visible,
    stop: function () {
      clearInterval(ticker);
    }
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
