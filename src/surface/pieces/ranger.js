(function (root) {
  const OG = root.OG;

  const TABS = [
    { id: "today", label: "Dziś" },
    { id: "week", label: "Tydzień" },
    { id: "month", label: "Miesiąc" }
  ];

  function create(onPick) {
    const wrap = document.createElement("div");
    wrap.className = "og-ranger";
    const buttons = {};

    TABS.forEach(function (tab) {
      const b = document.createElement("button");
      b.className = "og-tab";
      b.textContent = tab.label;
      b.addEventListener("click", function () {
        select(tab.id);
        onPick(tab.id);
      });
      buttons[tab.id] = b;
      wrap.appendChild(b);
    });

    function select(id) {
      Object.keys(buttons).forEach(function (key) {
        buttons[key].classList.toggle("on", key === id);
      });
    }

    return { el: wrap, select: select };
  }

  OG.ranger = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
