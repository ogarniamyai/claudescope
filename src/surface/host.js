(function (root) {
  const OG = root.OG;

  function create() {
    const mount = document.createElement("div");
    mount.id = "claudescope-host";
    const shadow = mount.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = OG.skin;
    shadow.appendChild(style);

    const shell = document.createElement("div");
    shell.className = "og-shell";

    const tipEl = document.createElement("div");
    tipEl.className = "og-tip";
    const tip = {
      show: function (text, rect) {
        tipEl.textContent = text;
        tipEl.style.right = (window.innerWidth - rect.left + 10) + "px";
        tipEl.style.top = rect.top + "px";
        tipEl.classList.add("on");
      },
      hide: function () {
        tipEl.classList.remove("on");
      }
    };

    const drawer = OG.drawer.create(tip);
    let open = false;
    function toggle() {
      open = !open;
      shell.classList.toggle("open", open);
      if (open) {
        try {
          drawer.stats();
        } catch (err) {
          void err;
        }
      }
    }
    const rail = OG.rail.create(tip, toggle);

    shell.appendChild(drawer.el);
    shell.appendChild(rail.el);
    shadow.appendChild(shell);
    shadow.appendChild(tipEl);

    document.documentElement.appendChild(mount);

    function guard(label, fn) {
      try {
        fn();
      } catch (err) {
        if (root.console) console.warn("[ClaudeScope] " + label + ":", err && err.message);
      }
    }

    function paint(snap, seconds, peakState, cycle, active) {
      guard("rail", function () {
        rail.render(snap, seconds, peakState, cycle, active);
        const h = OG.settings.health();
        const hasAlert = (snap && snap.error) || (h.outdated) || (h.notice);
        rail.setAlert(hasAlert);
      });
      guard("drawer", function () {
        drawer.render(snap, peakState, cycle);
      });
    }

    return { paint: paint, refreshStats: drawer.stats };
  }

  OG.host = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
