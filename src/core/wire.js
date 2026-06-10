(function (root) {
  const OG = root.OG;

  OG.wire = {
    channel: "claudex::bus",
    kind: {
      model: "model-seen"
    },
    keys: {
      snapshot: "og.snapshot",
      events: "og.events",
      presence: "og.presence",
      seenNotice: "og.seenNotice"
    }
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
