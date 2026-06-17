(function (root) {
  const OG = root.OG;

  if (window.top !== window) return;
  if (OG.__booted) return;
  OG.__booted = true;

  let ui = null;
  let snap = null;
  let peakState = null;

  function cycleNow() {
    if (!snap || !snap.billing) return null;
    if (snap.billing.free) return { free: true };
    const target = snap.billing.nextChargeInstant || snap.billing.nextChargeDate;
    return OG.clock.cycleProgress(new Date(), target, snap.billing.interval);
  }

  function paintNow() {
    if (!ui) return;
    ui.paint(snap, OG.presence.todaySeconds(), peakState, cycleNow(), OG.presence.active());
  }

  async function heavy() {
    if (document.hidden) return;
    const org = await OG.org.resolve();
    if (!org) return;
    const fresh = await OG.sources.collect(org);
    if (fresh) {
      const hasData = fresh.session.pct != null || fresh.week.pct != null;
      if (hasData) {
        if (snap) {
          snap.error = fresh.error;
          if (fresh.session.pct != null) snap.session = fresh.session;
          if (fresh.week.pct != null) snap.week = fresh.week;
          if (fresh.billing.nextChargeDate != null || fresh.billing.free) snap.billing = fresh.billing;
        } else {
          snap = fresh;
        }
        await OG.vault.set("og.snapshot", snap);
        OG.usagelog.record(fresh.session.pct, fresh.week.pct);
      } else if (fresh.error && snap) {
        snap.error = fresh.error;
      }
    }
    peakState = OG.peakwin.state(new Date());
    paintNow();
    if (ui) {
      try {
        ui.refreshStats();
      } catch (err) {
        void err;
      }
    }
  }

  async function start() {
    await OG.settings.load();
    await OG.presence.start();
    OG.relay.start();
    ui = OG.host.create();

    snap = await OG.vault.get("og.snapshot", null);
    peakState = OG.peakwin.state(new Date());
    paintNow();

    const every = ((OG.settings.current.poll && OG.settings.current.poll.usageSeconds) || 15) * 1000;
    heavy();
    setInterval(heavy, every);
    setInterval(paintNow, 1000);
  }

  start();
})(typeof globalThis !== "undefined" ? globalThis : window);
