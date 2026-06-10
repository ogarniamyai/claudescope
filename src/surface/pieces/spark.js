(function (root) {
  const OG = root.OG;
  const PALETTE = ["#F472B6", "#34D399", "#FBBF24", "#A78BFA", "#FB923C", "#F87171", "#2DD4BF", "#E879F9", "#A3E635", "#FCD34D"];
  const W = 340;
  const H = 104;

  function isHour(label) {
    return /^\d{2}$/.test(label);
  }

  function fmtLabel(label) {
    return isHour(label) ? label + ":00" : label;
  }

  function esc(text) {
    return String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function axis(labels) {
    const n = labels.length;
    if (!n) return "";
    let idx;
    if (n <= 8) {
      idx = labels.map(function (_, i) {
        return i;
      });
    } else {
      idx = [];
      const step = (n - 1) / 5;
      for (let i = 0; i < 6; i += 1) idx.push(Math.round(i * step));
    }
    const seen = {};
    let out = '<div class="og-axis">';
    idx.forEach(function (i) {
      if (seen[i]) return;
      seen[i] = true;
      out += "<span>" + esc(fmtLabel(labels[i])) + "</span>";
    });
    return out + "</div>";
  }

  function hookTip(host, tip) {
    if (!tip) return;
    host.addEventListener("mousemove", function (ev) {
      const t = ev.target;
      const text = t && t.getAttribute ? t.getAttribute("data-tip") : null;
      if (text) tip.show(text, { left: ev.clientX, top: ev.clientY - 14 });
      else tip.hide();
    });
    host.addEventListener("mouseleave", function () {
      tip.hide();
    });
  }

  function create(tip) {
    const wrap = document.createElement("div");
    const svgBox = document.createElement("div");
    const legend = document.createElement("div");
    legend.className = "og-legend";
    wrap.appendChild(svgBox);
    wrap.appendChild(legend);
    hookTip(svgBox, tip);

    function colorFor(models) {
      const map = {};
      models.forEach(function (m, i) {
        map[m.id] = PALETTE[i % PALETTE.length];
      });
      return map;
    }

    function tipFor(label, slot, models) {
      const lines = [fmtLabel(label) + " | " + slot.total + " promptów"];
      models.forEach(function (m) {
        const c = slot.models[m.id] || 0;
        if (c) lines.push(m.label + ": " + c);
      });
      return lines.join(" · ");
    }

    function update(data) {
      const colors = colorFor(data.models);
      const slots = data.slots || [];
      let peak = 0;
      slots.forEach(function (s) {
        if (s.total > peak) peak = s.total;
      });
      if (peak === 0) peak = 1;

      const n = slots.length || 1;
      const gap = n > 12 ? 1 : 4;
      const barW = Math.max(2, (W - (n - 1) * gap) / n);
      let bars = "";
      slots.forEach(function (slot, i) {
        const x = i * (barW + gap);
        const tipText = esc(tipFor(slot.label, slot, data.models));
        let cursor = H;
        data.models.forEach(function (m) {
          const c = slot.models[m.id] || 0;
          if (!c) return;
          const h = (c / peak) * (H - 6);
          cursor -= h;
          bars += '<rect data-tip="' + tipText + '" x="' + x.toFixed(1) + '" y="' + cursor.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="1" fill="' + colors[m.id] + '"></rect>';
        });
        if (!slot.total) {
          bars += '<rect data-tip="' + tipText + '" x="' + x.toFixed(1) + '" y="' + (H - 2) + '" width="' + barW.toFixed(1) + '" height="2" fill="rgba(148,163,184,0.18)"></rect>';
        }
      });

      svgBox.innerHTML = data.total
        ? '<svg class="og-spark" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none">' + bars + "</svg>" + axis(slots.map(function (s) { return s.label; }))
        : '<div class="og-foot" style="padding:32px 0">Brak promptów w tym zakresie</div>';

      legend.innerHTML = "";
      data.models.forEach(function (m) {
        const r = document.createElement("div");
        r.className = "og-legend-row";
        r.innerHTML =
          '<span class="og-legend-dot" style="background:' + colors[m.id] + '"></span>' +
          '<span class="og-legend-name">' + esc(m.label) + "</span>" +
          '<span class="og-legend-pct">' + m.count + " | " + m.pct + "%</span>";
        legend.appendChild(r);
      });
    }

    return { el: wrap, update: update };
  }

  const DOT5 = "#60A5FA";
  const DOT7 = "#A78BFA";

  function bars(tip) {
    const wrap = document.createElement("div");
    hookTip(wrap, tip);

    function pctY(v) {
      return H - (v / 100) * (H - 6);
    }

    function dots(vals, color, list, name, cx) {
      let s = "";
      (vals || []).forEach(function (v, i) {
        if (v == null) return;
        const x = cx(i).toFixed(1);
        const y = pctY(v).toFixed(1);
        const tipText = esc(fmtLabel(list[i].label) + " | " + name + ": " + v + "%");
        s += '<circle data-tip="' + tipText + '" cx="' + x + '" cy="' + y + '" r="6" fill="transparent"></circle>';
        s += '<circle data-tip="' + tipText + '" cx="' + x + '" cy="' + y + '" r="2.4" fill="' + color + '"></circle>';
      });
      return s;
    }

    function update(activity, usage) {
      const list = activity || [];
      const us = usage || { a: [], b: [] };
      let peak = 0;
      let peakSecs = 0;
      let total = 0;
      list.forEach(function (a) {
        if (a.minutes > peak) peak = a.minutes;
        if (a.seconds > peakSecs) peakSecs = a.seconds;
        total += a.minutes;
      });
      if (peak === 0) peak = 1;
      const n = list.length || 1;
      const gap = n > 12 ? 1 : 4;
      const barW = Math.max(2, (W - (n - 1) * gap) / n);
      const cx = function (i) {
        return i * (barW + gap) + barW / 2;
      };

      let grid = "";
      [0, 25, 50, 75, 100].forEach(function (p) {
        const y = pctY(p);
        grid += '<line x1="0" y1="' + y.toFixed(1) + '" x2="' + W + '" y2="' + y.toFixed(1) + '" stroke="rgba(148,163,184,0.12)" stroke-width="1"></line>';
      });

      let rects = "";
      list.forEach(function (a, i) {
        const h = (a.minutes / peak) * (H - 6);
        const x = i * (barW + gap);
        const parts = [fmtLabel(a.label), a.seconds ? OG.clock.spanLabel(a.seconds) : "0m"];
        if (us.a && us.a[i] != null) parts.push("5h: " + us.a[i] + "%");
        if (us.b && us.b[i] != null) parts.push("7d: " + us.b[i] + "%");
        const tipText = esc(parts.join(" | "));
        const drawH = a.minutes ? h : 2;
        const fill = a.minutes ? "#34D399" : "rgba(148,163,184,0.18)";
        rects += '<rect data-tip="' + tipText + '" x="' + x.toFixed(1) + '" y="' + (H - drawH).toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + drawH.toFixed(1) + '" rx="1" fill="' + fill + '"></rect>';
      });

      const marks = dots(us.a, DOT5, list, "Sesja 5h", cx) + dots(us.b, DOT7, list, "Tydzień 7d", cx);
      const hasUsage =
        (us.a && us.a.some(function (v) { return v != null; })) ||
        (us.b && us.b.some(function (v) { return v != null; }));

      if (!total && !hasUsage) {
        wrap.innerHTML = '<div class="og-foot" style="padding:26px 0">Brak aktywności w tym zakresie</div>';
        return;
      }

      const left =
        '<div class="og-yaxis og-yleft">' +
        "<span>" + esc(OG.clock.spanLabel(peakSecs)) + "</span>" +
        "<span>" + esc(OG.clock.spanLabel(Math.round(peakSecs / 2))) + "</span>" +
        "<span>0</span></div>";
      const right =
        '<div class="og-yaxis og-yright"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>';
      const plot =
        '<div class="og-plot"><svg class="og-spark" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none">' +
        grid + rects + marks + "</svg>" +
        axis(list.map(function (a) { return a.label; })) + "</div>";
      const legend =
        '<div class="og-uleg">' +
        '<span class="og-ull"><i style="background:' + DOT5 + '"></i>Sesja 5h</span>' +
        '<span class="og-ull"><i style="background:' + DOT7 + '"></i>Tydzień 7d</span>' +
        "</div>";

      wrap.innerHTML = '<div class="og-chart">' + left + plot + right + "</div>" + legend;
    }

    return { el: wrap, update: update };
  }

  OG.spark = { create: create };
  OG.bars = { create: bars };
})(typeof globalThis !== "undefined" ? globalThis : window);
