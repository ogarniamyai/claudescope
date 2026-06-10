(function (root) {
  const OG = root.OG;

  function chartIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16"/><path d="M6 14v5"/><path d="M10 11v8"/><path d="M14 7v12"/><path d="M18 4v15"/></svg>';
  }

  function create(tip, onToggle) {
    const el = document.createElement("aside");
    el.className = "og-rail";

    const brand = document.createElement("div");
    brand.className = "og-brand";
    brand.innerHTML = OG.glyph.mark(30);

    const errorBanner = document.createElement("div");
    errorBanner.className = "og-rail-error";
    errorBanner.style.display = "none";

    const meters = document.createElement("div");
    meters.className = "og-meters";
    const session = OG.meter.create("5h", "session", false);
    const week = OG.meter.create("7d", "week", false);
    meters.appendChild(session.el);
    meters.appendChild(week.el);

    const dial = OG.dial.create(tip);
    const dialStack = document.createElement("div");
    dialStack.className = "og-stack og-dialstack";
    const dialCap = document.createElement("div");
    dialCap.className = "og-cap";
    dialCap.textContent = "subskrypcja";
    dialStack.appendChild(dial.el);
    dialStack.appendChild(dialCap);

    const watch = OG.stopwatch.create("aktywność");
    const peak = OG.peakflag.create();

    const toggle = document.createElement("button");
    toggle.className = "og-toggle";
    toggle.title = "Pokaz panel";
    toggle.innerHTML = chartIcon();
    toggle.addEventListener("click", onToggle);

    const collapse = document.createElement("button");
    collapse.className = "og-rail-collapse";
    collapse.type = "button";
    collapse.title = "Ukryj panel";
    collapse.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
    collapse.addEventListener("click", function () {
      const hidden = el.classList.toggle("collapsed");
      collapse.title = hidden ? "Pokaż panel" : "Ukryj panel";
    });

    function divide() {
      const d = document.createElement("div");
      d.className = "og-div";
      el.appendChild(d);
    }

    el.appendChild(brand);
    el.appendChild(errorBanner);
    el.appendChild(collapse);
    divide();
    el.appendChild(meters);
    divide();
    el.appendChild(dialStack);
    divide();
    el.appendChild(watch.el);
    divide();
    el.appendChild(peak.el);
    divide();
    el.appendChild(toggle);

    function render(snap, seconds, peakState, cycle, active) {
      if (snap && snap.error) {
        errorBanner.textContent = snap.error;
        errorBanner.style.display = "block";
      } else {
        errorBanner.style.display = "none";
      }
      if (snap) {
        session.update(snap.session.pct, snap.session.reset);
        week.update(snap.week.pct, snap.week.reset);
      }
      if (cycle) {
        const date = snap && snap.billing ? OG.clock.shortDate(snap.billing.nextChargeDate) : "";
        dial.update(cycle.percent, cycle.daysLeft, "Przygotuj się do opłacenia subskrypcji" + (date ? " (" + date + ")" : ""));
      }
      watch.update(seconds, active);
      if (peakState) peak.update(peakState);
    }

    function setAlert(hasAlert) {
      toggle.classList.toggle("alert", hasAlert);
    }

    return { el: el, render: render, setAlert: setAlert };
  }

  OG.rail = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
