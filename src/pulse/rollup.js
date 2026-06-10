(function (root) {
  const OG = root.OG;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function dayKeyOf(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function bounds(range) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (range === "week") start.setDate(start.getDate() - 6);
    else if (range === "month") start.setDate(start.getDate() - 29);
    return { from: start.getTime(), to: now.getTime(), start: start, now: now };
  }

  function frames(range, span) {
    const out = [];
    if (range === "today") {
      for (let h = 0; h < 24; h += 1) {
        out.push({ key: "h" + h, label: pad(h), edge: new Date(span.start.getTime() + h * 3600000).getTime(), total: 0, models: {} });
      }
      return out;
    }
    const days = range === "week" ? 7 : 30;
    for (let d = 0; d < days; d += 1) {
      const date = new Date(span.start.getTime() + d * 86400000);
      out.push({ key: dayKeyOf(date), label: pad(date.getDate()) + "." + pad(date.getMonth() + 1), edge: date.getTime(), total: 0, models: {} });
    }
    return out;
  }

  function slotIndex(range, ts, span) {
    if (range === "today") {
      return new Date(ts).getHours();
    }
    return Math.floor((ts - span.start.getTime()) / 86400000);
  }

  async function presence(range, span) {
    const store = await OG.presence.store();
    let work = 0;
    const activity = [];
    if (range === "today") {
      const today = store[dayKeyOf(span.now)] || {};
      for (let h = 0; h < 24; h += 1) {
        const secs = today[h] || 0;
        work += secs;
        activity.push({ label: pad(h), seconds: secs, minutes: Math.round(secs / 60) });
      }
    } else {
      const cur = new Date(span.start.getTime());
      while (cur.getTime() <= span.now.getTime()) {
        const secs = OG.presence.daySeconds(store[dayKeyOf(cur)]);
        work += secs;
        activity.push({ label: pad(cur.getDate()) + "." + pad(cur.getMonth() + 1), seconds: secs, minutes: Math.round(secs / 60) });
        cur.setDate(cur.getDate() + 1);
      }
    }
    return { work: work, activity: activity };
  }

  function lastOfDay(bag) {
    let best = -1;
    let val = null;
    if (bag) {
      Object.keys(bag).forEach(function (h) {
        const idx = Number(h);
        if (idx > best && bag[h]) {
          best = idx;
          val = bag[h];
        }
      });
    }
    return val;
  }

  async function usage(range, span) {
    const store = await OG.usagelog.store();
    const a = [];
    const b = [];
    if (range === "today") {
      const today = store[dayKeyOf(span.now)] || {};
      for (let h = 0; h < 24; h += 1) {
        const cell = today[h];
        a.push(cell ? cell.a : null);
        b.push(cell ? cell.b : null);
      }
    } else {
      const cur = new Date(span.start.getTime());
      while (cur.getTime() <= span.now.getTime()) {
        const cell = lastOfDay(store[dayKeyOf(cur)]);
        a.push(cell ? cell.a : null);
        b.push(cell ? cell.b : null);
        cur.setDate(cur.getDate() + 1);
      }
    }
    return { a: a, b: b };
  }

  async function build(range) {
    const span = bounds(range);
    const events = await OG.ledger.all();
    const slots = frames(range, span);
    const perModel = {};
    let total = 0;

    events.forEach(function (row) {
      if (row.t < span.from || row.t > span.to) return;
      total += 1;
      perModel[row.m] = (perModel[row.m] || 0) + 1;
      const idx = slotIndex(range, row.t, span);
      const slot = slots[idx];
      if (slot) {
        slot.total += 1;
        slot.models[row.m] = (slot.models[row.m] || 0) + 1;
      }
    });

    const models = Object.keys(perModel)
      .map(function (id) {
        return {
          id: id,
          label: OG.labels.model(id),
          count: perModel[id],
          pct: total ? Math.round((perModel[id] / total) * 1000) / 10 : 0
        };
      })
      .sort(function (a, b) {
        return b.count - a.count;
      });

    const pres = await presence(range, span);
    const usg = await usage(range, span);
    return {
      range: range,
      total: total,
      models: models,
      slots: slots,
      work: pres.work,
      activity: pres.activity,
      usage: usg
    };
  }

  OG.rollup = { build: build };
})(typeof globalThis !== "undefined" ? globalThis : window);
