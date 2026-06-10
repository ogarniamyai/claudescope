(function (root) {
  const OG = root.OG;

  function conf() {
    return (OG.settings.current && OG.settings.current.peak) || {
      timezone: "America/Los_Angeles",
      windows: []
    };
  }

  function active(date) {
    const cfg = conf();
    const parts = OG.clock.partsInZone(date, cfg.timezone);
    const windows = cfg.windows || [];
    for (let i = 0; i < windows.length; i += 1) {
      const w = windows[i];
      const days = w.days || [];
      if (days.indexOf(parts.weekday) >= 0 && parts.hour >= w.from && parts.hour < w.to) {
        return true;
      }
    }
    return false;
  }

  function state(now) {
    const ref = now || new Date();
    const here = active(ref);
    const step = 1800000;
    let probe = new Date(ref.getTime());
    let nextChangeAt = null;
    for (let i = 0; i < 384; i += 1) {
      probe = new Date(probe.getTime() + step);
      if (active(probe) !== here) {
        nextChangeAt = probe;
        break;
      }
    }
    return {
      peak: here,
      label: here ? "Peak" : "Off-peak",
      nextChangeAt: nextChangeAt
    };
  }

  OG.peakwin = { active: active, state: state };
})(typeof globalThis !== "undefined" ? globalThis : window);
