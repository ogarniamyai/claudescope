(function (root) {
  const OG = root.OG;

  function band(pct) {
    const t = (OG.settings.current && OG.settings.current.thresholds) || { warn: 51, danger: 81 };
    if (pct >= t.danger) return "is-danger";
    if (pct >= t.warn) return "is-warn";
    return "is-ok";
  }

  function create(label, kind, full) {
    const wrap = document.createElement("div");
    wrap.className = "og-meter";

    const head = document.createElement("div");
    head.className = "og-meter-head";
    const name = document.createElement("span");
    name.textContent = label;
    const val = document.createElement("span");
    val.className = "og-meter-pct";
    val.textContent = "0%";
    head.appendChild(name);
    head.appendChild(val);

    const track = document.createElement("div");
    track.className = "og-track is-ok";
    const fills = [];
    for (let i = 0; i < 10; i += 1) {
      const seg = document.createElement("div");
      seg.className = "og-seg";
      const fill = document.createElement("div");
      fill.className = "og-seg-fill";
      seg.appendChild(fill);
      track.appendChild(seg);
      fills.push(fill);
    }

    const reset = document.createElement("div");
    reset.className = "og-reset";

    wrap.appendChild(head);
    wrap.appendChild(track);
    wrap.appendChild(reset);

    function update(pct, resetIso) {
      const hasValue = pct != null && pct !== "" && !Number.isNaN(Number(pct));
      const v = hasValue ? Math.max(0, Math.min(100, Math.round(Number(pct)))) : 0;
      val.textContent = hasValue ? v + "%" : "-";
      track.className = "og-track " + (hasValue ? band(v) : "is-none");
      for (let i = 0; i < fills.length; i += 1) {
        const local = hasValue ? Math.max(0, Math.min(100, (v - i * 10) * 10)) : 0;
        fills[i].style.width = local + "%";
      }
      const has = OG.clock.asDate(resetIso);
      if (full) {
        reset.textContent = has
          ? OG.clock.shortDate(resetIso) + " " + OG.clock.shortTime(resetIso) + " (za " + OG.clock.untilLabel(resetIso) + ")"
          : "reset -";
      } else {
        reset.textContent = has ? OG.clock.shortTime(resetIso) : "-";
      }
    }

    return { el: wrap, update: update };
  }

  OG.meter = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
