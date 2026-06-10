(function (root) {
  const OG = root.OG;

  const WEEK = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function asDate(value) {
    if (value instanceof Date) return value;
    if (value == null) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function localDayKey(value) {
    const d = asDate(value) || new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function shortTime(value) {
    const d = asDate(value);
    if (!d) return "";
    return pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function shortDate(value) {
    const d = asDate(value);
    if (!d) return "";
    return pad(d.getDate()) + "." + pad(d.getMonth() + 1) + "." + d.getFullYear();
  }

  function untilLabel(value) {
    const d = asDate(value);
    if (!d) return "-";
    const diff = d.getTime() - Date.now();
    if (diff <= 0) return "teraz";
    const totalMin = Math.ceil(diff / 60000);
    const days = Math.floor(totalMin / 1440);
    const hours = Math.floor((totalMin % 1440) / 60);
    const mins = totalMin % 60;
    const parts = [];
    if (days) parts.push(days + "d");
    if (hours) parts.push(hours + "h");
    if (mins || parts.length === 0) parts.push(mins + "m");
    return parts.join(" ");
  }

  function spanLabel(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(total / 60);
    if (mins < 60) return mins + "m";
    const h = Math.floor(mins / 60);
    const rem = mins % 60;
    return h + "g " + pad(rem) + "m";
  }

  function partsInZone(value, zone) {
    const d = asDate(value) || new Date();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let weekday = d.getDay();
    try {
      const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        weekday: "short"
      });
      const bag = {};
      fmt.formatToParts(d).forEach(function (p) {
        bag[p.type] = p.value;
      });
      const h = parseInt(bag.hour, 10);
      const m = parseInt(bag.minute, 10);
      if (Number.isFinite(h)) hour = h % 24;
      if (Number.isFinite(m)) minute = m;
      if (bag.weekday && WEEK[bag.weekday] != null) weekday = WEEK[bag.weekday];
    } catch (err) {
      void err;
    }
    return { hour: hour, minute: minute, weekday: weekday };
  }

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function cycleProgress(now, nextCharge, intervalLabel) {
    const end = asDate(nextCharge);
    const ref = asDate(now) || new Date();
    if (!end) {
      return { percent: 0, daysLeft: null, dayIndex: 0, daysTotal: 0 };
    }
    const start = new Date(end);
    const interval = String(intervalLabel || "monthly").toLowerCase();
    if (interval.indexOf("year") >= 0 || interval.indexOf("annual") >= 0) {
      start.setFullYear(start.getFullYear() - 1);
    } else if (interval.indexOf("week") >= 0) {
      start.setDate(start.getDate() - 7);
    } else {
      start.setMonth(start.getMonth() - 1);
    }
    const dayMs = 86400000;
    const daysTotal = Math.max(1, Math.round((end - start) / dayMs));
    const elapsed = Math.min(Math.max(0, ref - start), end - start);
    const dayIndex = Math.min(daysTotal, Math.max(0, Math.round(elapsed / dayMs)));
    const daysLeft = Math.max(0, Math.ceil((end - ref) / dayMs));
    const raw = (elapsed / (end - start)) * 100;
    const percent = Math.min(100, Math.max(0, Math.floor(raw + 0.5)));
    return { percent: percent, daysLeft: daysLeft, dayIndex: dayIndex, daysTotal: daysTotal };
  }

  OG.clock = {
    asDate: asDate,
    localDayKey: localDayKey,
    shortTime: shortTime,
    shortDate: shortDate,
    spanLabel: spanLabel,
    untilLabel: untilLabel,
    partsInZone: partsInZone,
    daysInMonth: daysInMonth,
    cycleProgress: cycleProgress
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
