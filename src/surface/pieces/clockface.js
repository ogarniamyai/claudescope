(function (root) {
  const OG = root.OG;
  const DAYS = ["Nd", "Pn", "Wt", "Sr", "Cz", "Pt", "So"];

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function daysLabel(days) {
    const list = days || [];
    if (list.length === 5 && list.indexOf(1) >= 0 && list.indexOf(5) >= 0 && list.indexOf(0) < 0 && list.indexOf(6) < 0) {
      return "Pn-Pt";
    }
    return list
      .map(function (d) {
        return DAYS[d] || "";
      })
      .join(" ");
  }

  function shiftMinutes(now, zone) {
    const ref = now || new Date();
    const local = ref.getHours() * 60 + ref.getMinutes();
    const parts = OG.clock.partsInZone(ref, zone);
    const anchor = parts.hour * 60 + parts.minute;
    let delta = local - anchor;
    if (delta > 720) delta -= 1440;
    if (delta < -720) delta += 1440;
    return delta;
  }

  function segments(windows, delta) {
    const out = [];
    (windows || []).forEach(function (w) {
      const from = (((w.from * 60 + delta) % 1440) + 1440) % 1440;
      let to = (((w.to * 60 + delta) % 1440) + 1440) % 1440;
      if (to === from) return;
      if (to < from) {
        out.push([from, 1440]);
        out.push([0, to]);
      } else {
        out.push([from, to]);
      }
    });
    return out;
  }

  function create() {
    const peak = (OG.settings.current && OG.settings.current.peak) || { timezone: "", windows: [] };
    const windows = peak.windows || [];

    const wrap = document.createElement("div");
    wrap.className = "og-pkwrap";

    const state = document.createElement("div");
    state.className = "og-pkstate off";
    state.textContent = "Off-peak";

    const bar = document.createElement("div");
    bar.className = "og-pkbar";
    const fill = document.createElement("div");
    fill.className = "og-pkfill";
    const nowMark = document.createElement("div");
    nowMark.className = "og-pknow";
    bar.appendChild(fill);
    bar.appendChild(nowMark);

    const axis = document.createElement("div");
    axis.className = "og-pkaxis";
    ["00", "06", "12", "18", "24"].forEach(function (t) {
      const s = document.createElement("span");
      s.textContent = t;
      axis.appendChild(s);
    });

    const legend = document.createElement("div");
    legend.className = "og-pklegend";
    const days = windows.length ? daysLabel(windows[0].days) : "";
    legend.innerHTML =
      '<span class="og-pklg"><i class="og-pkdot off"></i>Off-peak</span>' +
      '<span class="og-pklg"><i class="og-pkdot on"></i>Peak' + (days ? " (" + days + ")" : "") + "</span>";

    wrap.appendChild(state);
    wrap.appendChild(bar);
    wrap.appendChild(axis);
    wrap.appendChild(legend);

    function update(peakState, now) {
      const ref = now || new Date();
      const delta = shiftMinutes(ref, peak.timezone);
      const segs = segments(windows, delta);
      let html = "";
      segs.forEach(function (s) {
        const left = (s[0] / 1440) * 100;
        const width = ((s[1] - s[0]) / 1440) * 100;
        html += '<div class="og-pkpeak" style="left:' + left.toFixed(2) + "%;width:" + width.toFixed(2) + '%"></div>';
      });
      fill.innerHTML = html;

      const mins = ref.getHours() * 60 + ref.getMinutes();
      nowMark.style.left = ((mins / 1440) * 100).toFixed(2) + "%";

      if (peakState) {
        state.textContent = peakState.label;
        state.className = "og-pkstate " + (peakState.peak ? "on" : "off");
      }
    }

    return { el: wrap, update: update };
  }

  OG.clockface = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
