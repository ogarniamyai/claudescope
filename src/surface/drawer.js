(function (root) {
  const OG = root.OG;

  function row(label) {
    const r = document.createElement("div");
    r.className = "og-row";
    const a = document.createElement("span");
    a.textContent = label;
    const b = document.createElement("b");
    b.textContent = "-";
    r.appendChild(a);
    r.appendChild(b);
    return { el: r, val: b };
  }

  function card(title) {
    const c = document.createElement("div");
    c.className = "og-card";
    const t = document.createElement("div");
    t.className = "og-card-title";
    t.textContent = title;
    c.appendChild(t);
    return c;
  }

  function create(tip) {
    const el = document.createElement("section");
    el.className = "og-drawer";

    const head = document.createElement("div");
    head.className = "og-drawer-head";
    const lock = document.createElement("div");
    lock.innerHTML = OG.glyph.lockup();
    head.appendChild(lock.firstElementChild);

    const notices = document.createElement("div");

    let currentRange = "today";
    const tabs = OG.ranger.create(function (id) {
      currentRange = id;
      stats();
    });

    const statCard = card("Prompty");
    const total = document.createElement("div");
    total.className = "og-total";
    total.textContent = "0";
    const spark = OG.spark.create(tip);
    statCard.appendChild(total);
    statCard.appendChild(spark.el);

    const limCard = card("Limity");
    const dmeters = document.createElement("div");
    dmeters.className = "og-dmeters";
    const mSession = OG.meter.create("Sesja 5h", "session", true);
    const mWeek = OG.meter.create("Tydzień 7d", "week", true);
    dmeters.appendChild(mSession.el);
    dmeters.appendChild(mWeek.el);
    limCard.appendChild(dmeters);

    const subCard = card("Subskrypcja");
    const subGrid = document.createElement("div");
    subGrid.className = "og-subgrid";
    const rings = document.createElement("div");
    rings.className = "og-rings";
    const ring = OG.dial.create(tip);
    const ringCap = document.createElement("div");
    ringCap.className = "og-cap";
    ringCap.textContent = "wykorzystano";
    rings.appendChild(ring.el);
    rings.appendChild(ringCap);
    const rows = document.createElement("div");
    rows.className = "og-rows";
    const rStatus = row("Status");
    const rInterval = row("Cykl");
    const rNext = row("Odnowienie");
    const rLeft = row("Pozostało");
    rows.appendChild(rStatus.el);
    rows.appendChild(rInterval.el);
    rows.appendChild(rNext.el);
    rows.appendChild(rLeft.el);
    subGrid.appendChild(rings);
    subGrid.appendChild(rows);
    subCard.appendChild(subGrid);

    const peakCard = card("Peak hours");
    const clock = OG.clockface
      ? OG.clockface.create()
      : { el: document.createElement("div"), update: function () {} };
    peakCard.appendChild(clock.el);

    const workCard = card("Aktywność");
    const workBig = document.createElement("div");
    workBig.className = "og-bigwork";
    workBig.textContent = "0m";
    const workCap = document.createElement("div");
    workCap.className = "og-cap";
    workCap.textContent = "czas w wybranym zakresie";
    const workChart = OG.bars.create(tip);
    workCard.appendChild(workBig);
    workCard.appendChild(workCap);
    workCard.appendChild(workChart.el);

    const foot = document.createElement("div");
    foot.className = "og-foot";
    foot.innerHTML = "ogarniamy<span>.ai</span> | " + (OG.product || "ClaudeScope") + " " + OG.version;

    el.appendChild(head);
    el.appendChild(notices);
    el.appendChild(tabs.el);
    el.appendChild(statCard);
    el.appendChild(limCard);
    el.appendChild(subCard);
    el.appendChild(peakCard);
    el.appendChild(workCard);
    el.appendChild(foot);

    tabs.select("today");

    function banner(kind, text) {
      const b = document.createElement("div");
      b.className = "og-notice " + kind;
      b.textContent = text;
      notices.appendChild(b);
    }

    function drawNotices(snap) {
      notices.innerHTML = "";
      const h = OG.settings.health();
      if (h.outdated) {
        banner("stale", "Twoja wersja rozszerzenia nie jest już wspierana. Może działać nieprawidłowo. Zaktualizuj ją.");
      }
      if (h.notice) {
        banner(h.notice.level === "warn" ? "warn" : "info", h.notice.text);
      }
      if (snap && snap.error) {
        banner("error", snap.error);
      }
    }

    async function stats() {
      const data = await OG.rollup.build(currentRange);
      total.textContent = String(data.total);
      spark.update(data);
      workBig.textContent = OG.clock.spanLabel(data.work);
      workChart.update(data.activity, data.usage);
    }

    function render(snap, peakState, cycle) {
      drawNotices(snap);
      if (snap) {
        rStatus.val.textContent = OG.labels.status(snap.billing.status);
        rInterval.val.textContent = OG.labels.interval(snap.billing.interval);
        rNext.val.textContent = OG.clock.shortDate(snap.billing.nextChargeDate) || "-";
        mSession.update(snap.session.pct, snap.session.reset);
        mWeek.update(snap.week.pct, snap.week.reset);
      }
      if (cycle) {
        ring.update(cycle.percent, cycle.daysLeft, "Przygotuj się do opłacenia subskrypcji");
        rLeft.val.textContent = cycle.daysLeft == null ? "-" : cycle.daysLeft + (cycle.daysLeft === 1 ? " dzień" : " dni");
      }
      if (peakState) {
        clock.update(peakState, new Date());
      }
    }

    return { el: el, render: render, stats: stats };
  }

  OG.drawer = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
