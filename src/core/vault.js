(function (root) {
  const OG = root.OG;
  const api = root.chrome || root.browser;
  const bin = api && api.storage ? api.storage.local : null;

  function get(key, fallback) {
    return new Promise(function (resolve) {
      if (!bin) {
        resolve(fallback);
        return;
      }
      try {
        bin.get(key, function (bag) {
          const value = bag ? bag[key] : undefined;
          resolve(value === undefined ? fallback : value);
        });
      } catch (err) {
        void err;
        resolve(fallback);
      }
    });
  }

  function set(key, value) {
    return new Promise(function (resolve) {
      if (!bin) {
        resolve(false);
        return;
      }
      const bag = {};
      bag[key] = value;
      try {
        bin.set(bag, function () {
          resolve(true);
        });
      } catch (err) {
        void err;
        resolve(false);
      }
    });
  }

  async function patch(key, mutate, seed) {
    const current = await get(key, seed);
    const next = mutate(current);
    await set(key, next);
    return next;
  }

  OG.vault = { get: get, set: set, patch: patch };
})(typeof globalThis !== "undefined" ? globalThis : window);
