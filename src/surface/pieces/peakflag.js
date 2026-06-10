(function (root) {
  const OG = root.OG;

  function create() {
    const wrap = document.createElement("div");
    wrap.className = "og-peak";
    const dot = document.createElement("span");
    dot.className = "og-peak-dot";
    const label = document.createElement("span");
    label.textContent = "Off-peak";
    wrap.appendChild(dot);
    wrap.appendChild(label);

    function update(state) {
      label.textContent = state.label;
      if (state.peak) wrap.classList.add("on");
      else wrap.classList.remove("on");
    }

    return { el: wrap, update: update };
  }

  OG.peakflag = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
