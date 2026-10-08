/* Firmendo Dark Mode – Umschalter.
   Das Inline-Script im <head> setzt data-theme vor dem ersten Rendern;
   dieses Script fügt die Umschalter in die Navigation ein und tauscht das Logo. */
(() => {
  const KEY = "firmendo-theme";
  const root = document.documentElement;
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  const stored = () => {
    try { return localStorage.getItem(KEY); } catch (_) { return null; }
  };

  const ICONS =
    '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
    '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function syncUi() {
    const dark = root.dataset.theme === "dark";
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "Helles Design aktivieren" : "Dunkles Design aktivieren");
      btn.title = dark ? "Helles Design" : "Dunkles Design";
    });
    document.querySelectorAll("img.sn-logo-img, img.footer-logo-img").forEach((img) => {
      if (!img.dataset.lightSrc) img.dataset.lightSrc = img.getAttribute("src");
      const light = img.dataset.lightSrc;
      img.setAttribute("src", dark ? light.replace("firmendo-logo.svg", "firmendo-logo-white.svg") : light);
    });
  }

  function apply(theme, persist) {
    root.dataset.theme = theme;
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch (_) {}
    }
    syncUi();
  }

  function makeButton(extraClass) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle " + extraClass;
    btn.innerHTML = ICONS;
    btn.addEventListener("click", () => {
      apply(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
    return btn;
  }

  function mount() {
    const nav = document.getElementById("site-nav");
    if (!nav || nav.querySelector(".theme-toggle")) { syncUi(); return; }

    const links = nav.querySelector(".sn-links");
    const searchLi = nav.querySelector(".sn-search-btn") && nav.querySelector(".sn-search-btn").closest("li");
    if (links) {
      const li = document.createElement("li");
      li.className = "theme-toggle-item";
      li.appendChild(makeButton("theme-toggle--desktop"));
      if (searchLi && searchLi.nextSibling) links.insertBefore(li, searchLi.nextSibling);
      else links.appendChild(li);
    }

    const burger = nav.querySelector(".sn-burger");
    if (burger) burger.parentNode.insertBefore(makeButton("theme-toggle--mobile"), burger);

    syncUi();
  }

  if (media && media.addEventListener) {
    media.addEventListener("change", (e) => {
      if (!stored()) apply(e.matches ? "dark" : "light", false);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
