(function (root) {
  const OG = root.OG;

  OG.skin = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:host, .og-shell, .og-shell * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.og-shell {
  --ink: #0B1120;
  --deep: #131C3B;
  --primary: #2563EB;
  --primary-light: #60A5FA;
  --line: rgba(148, 163, 184, 0.16);
  --paper: #E6EDF6;
  --muted: #8B98AD;
  --ok: #16A34A;
  --warn: #F59E0B;
  --danger: #EF4444;
  --glow: 0 0 12px rgba(96, 165, 250, 0.4);
  --display: 'Space Grotesk', system-ui, sans-serif;
  --body: 'Space Grotesk', system-ui, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
  position: fixed;
  inset: 0 0 auto auto;
  z-index: 2147483000;
  font-family: var(--body);
  color: var(--paper);
  pointer-events: none;
}

.og-shell > * { pointer-events: auto; }

.og-rail {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 106px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 18px 11px;
  background: linear-gradient(165deg, rgba(11, 17, 32, 0.97), rgba(19, 28, 59, 0.97));
  border: 1px solid var(--line);
  border-right: none;
  border-radius: 18px 0 0 18px;
  backdrop-filter: blur(16px);
  box-shadow: -10px 0 34px rgba(2, 6, 23, 0.55);
}

.og-rail.collapsed {
  width: 46px;
  padding: 12px 8px;
  gap: 10px;
  border-radius: 18px 0 0 18px;
}

.og-rail.collapsed .og-meters,
.og-rail.collapsed .og-stack,
.og-rail.collapsed .og-watch,
.og-rail.collapsed .og-peak,
.og-rail.collapsed .og-div {
  display: none;
}

.og-rail-error {
  width: 100%;
  padding: 6px 8px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.45);
  border-radius: 10px;
  text-align: center;
}

.og-rail-collapse {
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: rgba(11, 17, 32, 0.9);
  border: 1px solid var(--line);
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, color 0.2s;
}

.og-rail-collapse:hover {
  background: rgba(37, 99, 235, 0.2);
  color: var(--primary-light);
}

.og-rail-collapse svg {
  width: 12px;
  height: 12px;
  transition: transform 0.3s ease;
}

.og-rail.collapsed .og-rail-collapse svg {
  transform: rotate(180deg);
}

.og-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 7px rgba(96, 165, 250, 0.5));
}

.og-meters { display: flex; flex-direction: column; gap: 13px; width: 100%; }
.og-meter { display: flex; flex-direction: column; gap: 5px; }
.og-meter-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  white-space: nowrap;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}
.og-meter-pct { color: var(--paper); font-weight: 600; }

.og-track { display: flex; gap: 2px; height: 12px; }
.og-seg { flex: 1; border-radius: 2px; background: rgba(148, 163, 184, 0.12); position: relative; overflow: hidden; }
.og-seg-fill { position: absolute; inset: 0; width: 0; transition: width 0.5s ease; }
.is-ok .og-seg-fill { background: var(--ok); box-shadow: 0 0 6px rgba(22, 163, 74, 0.55); }
.is-warn .og-seg-fill { background: var(--warn); box-shadow: 0 0 6px rgba(245, 158, 11, 0.55); }
.is-danger .og-seg-fill { background: var(--danger); box-shadow: 0 0 6px rgba(239, 68, 68, 0.55); }
.is-none .og-seg-fill { background: rgba(148, 163, 184, 0.24); box-shadow: none; }

.og-reset {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.04em;
  white-space: nowrap;
  color: var(--muted);
}
.og-meters .og-reset { white-space: normal; word-spacing: 0.2em; }

.og-div { width: 100%; height: 1px; background: var(--line); flex: none; }

.og-stack { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.og-dialstack { gap: 10px; }
.og-cap {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.og-dial { position: relative; width: 64px; height: 64px; }
.og-dial svg { width: 64px; height: 64px; transform: rotate(-90deg); }
.og-dial-track { stroke: rgba(148, 163, 184, 0.14); }
.og-dial-arc { stroke: var(--primary-light); stroke-linecap: round; filter: drop-shadow(0 0 4px rgba(96, 165, 250, 0.6)); transition: stroke-dashoffset 0.6s ease; }
.og-dial-pct {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0;
  line-height: 1.05;
}
.og-dial-val { font-family: var(--mono); font-size: 15px; font-weight: 600; color: var(--paper); }
.og-dial-sub { font-family: var(--mono); font-size: 8px; color: var(--muted); }

.og-freeplan {
  font-family: var(--display);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-light);
  text-align: center;
  line-height: 1.1;
}
.og-freeplan-big {
  font-size: 22px;
  letter-spacing: 0.06em;
  padding: 4px 4px 6px;
  text-align: left;
}

.og-alert {
  position: absolute; top: -5px; right: -5px;
  width: 18px; height: 18px;
  display: none; align-items: center; justify-content: center; cursor: help;
}
.og-alert.on { display: flex; animation: og-pulse 1.6s infinite; }
.og-alert svg { width: 18px; height: 18px; filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.85)); }
@keyframes og-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.og-watch-val { font-family: var(--mono); font-size: 15px; font-weight: 500; color: var(--paper); transition: color 0.3s ease, opacity 0.3s ease; }
.og-watch-val.idle { color: var(--muted); opacity: 0.5; }
.og-watch-val.live { color: var(--ok); animation: og-breathe 1.9s ease-in-out infinite; }
@keyframes og-breathe { 0%, 100% { opacity: 1; text-shadow: 0 0 7px rgba(22, 163, 74, 0.55); } 50% { opacity: 0.62; text-shadow: 0 0 2px rgba(22, 163, 74, 0.25); } }

.og-peak {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--muted);
}
.og-peak-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 7px rgba(22, 163, 74, 0.7); }
.og-peak.on .og-peak-dot { background: var(--warn); box-shadow: 0 0 7px var(--warn); }
.og-peak.on { color: var(--warn); }

.og-toggle {
  width: 36px; height: 36px; border-radius: 11px;
  border: 1px solid var(--line);
  background: rgba(37, 99, 235, 0.16);
  color: var(--primary-light); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}
.og-toggle:hover { background: rgba(37, 99, 235, 0.3); box-shadow: var(--glow); }
.og-toggle.alert { animation: og-alert-pulse 1.6s infinite; background: rgba(245, 158, 11, 0.2); border-color: var(--warn); color: var(--warn); }
.og-toggle svg { width: 17px; height: 17px; transition: transform 0.35s ease; }
.og-shell.open .og-toggle svg { transform: rotate(180deg); }
@keyframes og-alert-pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba(245, 158, 11, 0.6); } 50% { opacity: 0.5; box-shadow: 0 0 6px rgba(245, 158, 11, 0.3); } }

.og-drawer {
  position: fixed;
  top: 16px;
  right: 104px;
  width: 372px;
  max-height: calc(100vh - 32px);
  padding: 20px;
  overflow-y: auto;
  background: linear-gradient(168deg, rgba(11, 17, 32, 0.98), rgba(19, 28, 59, 0.98));
  border: 1px solid var(--line);
  border-radius: 18px;
  backdrop-filter: blur(20px);
  transform: translateX(calc(100% + 130px));
  opacity: 0;
  transition: transform 0.44s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
  box-shadow: -18px 24px 60px rgba(2, 6, 23, 0.62);
}
.og-shell.open .og-drawer { transform: translateX(0); opacity: 1; }
.og-drawer::-webkit-scrollbar { width: 7px; }
.og-drawer::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.24); border-radius: 4px; }

.og-drawer-head { display: flex; margin-bottom: 16px; }
.og-lock { display: flex; align-items: center; width: 100%; }
.og-lock-logo { height: 28px; width: auto; display: block; }

.og-plan {
  font-family: var(--mono); font-size: 10px; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--primary-light);
  border: 1px solid var(--line); border-radius: 7px; padding: 5px 9px;
  background: rgba(37, 99, 235, 0.1);
}

.og-card {
  background: rgba(11, 17, 32, 0.5);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 13px;
  animation: og-rise 0.4s ease both;
}
@keyframes og-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.og-card-title {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 12px;
}

.og-row { display: flex; justify-content: space-between; align-items: baseline; padding: 5px 0; font-size: 14px; }
.og-row span { color: var(--muted); font-size: 13px; }
.og-row b { font-family: var(--mono); font-weight: 500; font-size: 13px; color: var(--paper); white-space: nowrap; }

.og-dmeters { display: flex; flex-direction: column; gap: 14px; }
.og-dmeters .og-meter-head { font-size: 11px; }
.og-dmeters .og-track { height: 16px; }
.og-dmeters .og-seg { border-radius: 3px; }
.og-dmeters .og-reset { font-size: 11px; letter-spacing: 0.02em; }

.og-subgrid { display: flex; gap: 16px; align-items: center; }
.og-subgrid .og-rings { flex: none; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.og-subgrid .og-rings .og-dial { width: 74px; height: 74px; }
.og-subgrid .og-rings .og-dial svg { width: 74px; height: 74px; }
.og-subgrid .og-rings .og-dial-val { font-size: 18px; }
.og-subgrid .og-rings .og-dial-sub { font-size: 10px; }
.og-subgrid .og-rows { flex: 1; }

.og-bigwork { font-family: var(--display); font-weight: 700; font-size: 32px; letter-spacing: -0.02em; color: var(--paper); }

.og-pkwrap { display: flex; flex-direction: column; gap: 9px; }
.og-pkstate { font-family: var(--display); font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; }
.og-pkstate.on { color: var(--warn); }
.og-pkstate.off { color: var(--ok); }
.og-pkbar {
  position: relative;
  height: 16px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: rgba(22, 163, 74, 0.4);
  overflow: hidden;
}
.og-pkfill { position: absolute; inset: 0; }
.og-pkpeak { position: absolute; top: 0; bottom: 0; background: rgba(245, 158, 11, 0.85); box-shadow: 0 0 8px rgba(245, 158, 11, 0.45); }
.og-pknow {
  position: absolute; top: -2px; bottom: -2px; width: 2px;
  margin-left: -1px; background: var(--paper);
  box-shadow: 0 0 6px rgba(230, 237, 246, 0.9);
  transition: left 0.6s ease;
}
.og-pknow::before {
  content: ""; position: absolute; top: -3px; left: -3px;
  border-left: 4px solid transparent; border-right: 4px solid transparent;
  border-top: 5px solid var(--paper);
}
.og-pkaxis { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 9px; letter-spacing: 0.05em; color: var(--muted); }
.og-pklegend { display: flex; gap: 16px; margin-top: 2px; }
.og-pklg { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.04em; color: var(--muted); }
.og-pkdot { width: 9px; height: 9px; border-radius: 3px; }
.og-pkdot.off { background: rgba(22, 163, 74, 0.85); }
.og-pkdot.on { background: rgba(245, 158, 11, 0.9); }

.og-ranger { display: flex; gap: 6px; margin-bottom: 13px; }
.og-tab {
  flex: 1; font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--muted);
  background: rgba(148, 163, 184, 0.07); border: 1px solid var(--line);
  border-radius: 9px; padding: 8px 0; cursor: pointer; transition: all 0.2s ease;
}
.og-tab.on { color: var(--paper); background: rgba(37, 99, 235, 0.22); border-color: var(--primary); box-shadow: var(--glow); }

.og-spark { width: 100%; height: 112px; display: block; }
.og-spark rect { transition: height 0.4s ease, y 0.4s ease; cursor: pointer; }
.og-spark rect:hover { opacity: 0.82; }
.og-axis { display: flex; justify-content: space-between; margin-top: 5px; font-family: var(--mono); font-size: 9px; letter-spacing: 0.03em; color: var(--muted); }

.og-chart { display: flex; align-items: flex-start; gap: 6px; }
.og-plot { flex: 1; min-width: 0; }
.og-yaxis { display: flex; flex-direction: column; justify-content: space-between; height: 112px; font-family: var(--mono); font-size: 9px; letter-spacing: 0.02em; color: var(--muted); }
.og-yleft { text-align: right; }
.og-yright { text-align: left; }
.og-uleg { display: flex; gap: 16px; margin-top: 9px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.04em; color: var(--muted); }
.og-ull { display: flex; align-items: center; }
.og-ull i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; vertical-align: middle; }

.og-legend { display: flex; flex-direction: column; gap: 7px; margin-top: 13px; }
.og-legend-row { display: flex; align-items: center; gap: 9px; font-size: 13px; }
.og-legend-dot { width: 10px; height: 10px; border-radius: 3px; flex: none; }
.og-legend-name { flex: 1; color: var(--paper); }
.og-legend-pct { font-family: var(--mono); font-size: 12px; color: var(--muted); }

.og-total { font-family: var(--display); font-weight: 700; font-size: 28px; letter-spacing: -0.02em; color: var(--paper); }

.og-notice { border-radius: 11px; padding: 10px 12px; margin-bottom: 13px; font-size: 13px; line-height: 1.5; }
.og-notice.info { background: rgba(37, 99, 235, 0.16); border: 1px solid var(--primary); }
.og-notice.warn { background: rgba(245, 158, 11, 0.14); border: 1px solid var(--warn); color: var(--warn); }
.og-notice.error { background: rgba(239, 68, 68, 0.14); border: 1px solid var(--danger); color: var(--danger); }
.og-notice.stale { background: rgba(239, 68, 68, 0.14); border: 1px solid var(--danger); }

.og-tip {
  position: fixed; z-index: 2147483001; max-width: 230px;
  padding: 8px 11px; border-radius: 9px;
  background: #05070D; border: 1px solid var(--line);
  color: var(--paper); font-size: 12px; line-height: 1.45;
  pointer-events: none; opacity: 0; transition: opacity 0.14s ease;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.5);
}
.og-tip.on { opacity: 1; }

.og-foot {
  margin-top: 6px; text-align: center;
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.08em; color: var(--muted);
}
.og-foot span { color: var(--primary-light); }
`;
})(typeof globalThis !== "undefined" ? globalThis : window);
