(function (root) {
  const OG = root.OG;
  const api = root.chrome || root.browser;
  let seq = 0;

  const HEX = "157.94 0 315.89 87.75 315.89 245.69 157.94 333.44 0 245.69 0 87.75 157.94 0";

  function mark(size) {
    const w = size || 30;
    const h = Math.round((w * 333.44) / 315.89);
    const id = "ogmark" + seq;
    seq += 1;
    return (
      '<svg viewBox="0 0 315.89 333.44" width="' + w + '" height="' + h + '" aria-hidden="true">' +
      '<defs><clipPath id="' + id + '"><polygon points="' + HEX + '"/></clipPath></defs>' +
      '<polygon points="' + HEX + '" fill="#2563eb"/>' +
      '<g clip-path="url(#' + id + ')">' +
      '<circle cx="157.94" cy="166.72" r="86" fill="none" stroke="#fff" stroke-opacity="0.28" stroke-width="20" stroke-linecap="round" stroke-dasharray="405 540" transform="rotate(135 157.94 166.72)"/>' +
      '<circle cx="157.94" cy="166.72" r="86" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-dasharray="284 540" transform="rotate(135 157.94 166.72)"/>' +
      '<circle cx="157.94" cy="166.72" r="34" fill="#fff"/>' +
      '<line x1="157.94" y1="166.72" x2="157.94" y2="100" stroke="#2563eb" stroke-width="13" stroke-linecap="round"/>' +
      "</g></svg>"
    );
  }

  function logoUrl() {
    try {
      return api.runtime.getURL("assets/logo-inverted.svg");
    } catch (err) {
      void err;
      return "";
    }
  }

  function lockup() {
    return (
      '<div class="og-lock">' +
      '<img class="og-lock-logo" src="' + logoUrl() + '" alt="ClaudeScope">' +
      "</div>"
    );
  }

  OG.glyph = { mark: mark, lockup: lockup };
})(typeof globalThis !== "undefined" ? globalThis : window);
