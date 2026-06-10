(function (root) {
  const OG = root.OG;
  const R = 25.5;
  const C = 2 * Math.PI * R;

  function create(tip) {
    const wrap = document.createElement("div");
    wrap.className = "og-dial";
    wrap.innerHTML = `
<svg viewBox="0 0 56 56">
  <circle class="og-dial-track" cx="28" cy="28" r="${R}" fill="none" stroke-width="5"/>
  <circle class="og-dial-arc" cx="28" cy="28" r="${R}" fill="none" stroke-width="5"
    stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${C.toFixed(2)}"/>
</svg>
<div class="og-dial-pct"><span class="og-dial-val">0%</span><span class="og-dial-sub"></span></div>
<div class="og-alert" role="img">
  <svg viewBox="0 0 24 24">
    <path d="M12 2 L23 21 H1 Z" fill="#DC2626"/>
    <rect x="11" y="8" width="2" height="7" rx="1" fill="#fff"/>
    <circle cx="12" cy="18" r="1.3" fill="#fff"/>
  </svg>
</div>`;

    const arc = wrap.querySelector(".og-dial-arc");
    const pctEl = wrap.querySelector(".og-dial-val");
    const subEl = wrap.querySelector(".og-dial-sub");
    const alert = wrap.querySelector(".og-alert");

    let tipText = "";
    alert.addEventListener("mouseenter", function () {
      if (tip) tip.show(tipText, alert.getBoundingClientRect());
    });
    alert.addEventListener("mouseleave", function () {
      if (tip) tip.hide();
    });

    function update(percent, daysLeft, message) {
      const hasValue = percent != null && percent !== "" && !Number.isNaN(Number(percent));
      const v = hasValue ? Math.max(0, Math.min(100, Math.round(Number(percent)))) : 0;
      pctEl.textContent = hasValue ? v + "%" : "-";
      arc.style.strokeDashoffset = (C * (1 - v / 100)).toFixed(2);
      subEl.textContent = daysLeft == null ? "" : daysLeft + (daysLeft === 1 ? " dzień" : " dni");
      const days = (OG.settings.current && OG.settings.current.thresholds.renewalAlertDays) || 3;
      if (daysLeft != null && daysLeft <= days) {
        tipText = message || "Przygotuj się do opłacenia subskrypcji";
        alert.classList.add("on");
      } else {
        alert.classList.remove("on");
      }
    }

    return { el: wrap, update: update };
  }

  OG.dial = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
