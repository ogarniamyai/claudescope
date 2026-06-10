(function (root) {
  const OG = root.OG;

  function create(caption) {
    const wrap = document.createElement("div");
    wrap.className = "og-stack";
    const val = document.createElement("div");
    val.className = "og-watch-val";
    val.textContent = "0m";
    const cap = document.createElement("div");
    cap.className = "og-cap";
    cap.textContent = caption || "aktywność";
    wrap.appendChild(val);
    wrap.appendChild(cap);

    function update(seconds, active) {
      val.textContent = OG.clock.spanLabel(seconds);
      val.classList.toggle("live", !!active);
      val.classList.toggle("idle", !active);
      cap.textContent = active ? (caption || "aktywność") : "wstrzymano";
    }

    return { el: wrap, update: update };
  }

  OG.stopwatch = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
