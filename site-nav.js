(() => {
  const shellAssetBase = (() => {
    const script = document.currentScript || document.querySelector('script[src$="site-nav.js"]');
    return script ? new URL("./", script.src) : new URL("./", window.location.href);
  })();

  function domReady() {
    if (document.readyState === "loading") {
      return new Promise((resolve) => {
        document.addEventListener("DOMContentLoaded", resolve, { once: true });
      });
    }

    return Promise.resolve();
  }

  async function loadSharedNav() {
    if (window.location.protocol === "file:") return false;

    await domReady();

    const currentNav = document.getElementById("site-nav");
    const currentOverlay = document.getElementById("sn-search-overlay");
    if (currentNav && currentOverlay) return false;

    try {
      const response = await fetch("/snippets/nav.html", { cache: "no-cache" });
      if (!response.ok) return false;

      const html = await response.text();
      const template = document.createElement("template");
      template.innerHTML = html.trim();

      const nextNav = template.content.querySelector("#site-nav");
      const nextOverlay = template.content.querySelector("#sn-search-overlay");
      if (!nextNav) return false;

      if (currentNav) {
        currentNav.replaceWith(nextNav);
      } else {
        document.body.prepend(nextNav);
      }

      if (nextOverlay) {
        if (currentOverlay) {
          currentOverlay.replaceWith(nextOverlay);
        } else {
          nextNav.insertAdjacentElement("afterend", nextOverlay);
        }
      } else if (currentOverlay) {
        currentOverlay.remove();
      }

      return true;
    } catch (_) {
      return false;
    }
  }

  function initNav() {
    const nav = document.getElementById("site-nav");
    const links = document.getElementById("sn-links");
    const burger = document.getElementById("sn-burger");

    if (!nav || nav.dataset.ready === "true") return;

    if (window.location.protocol === "file:") {
      nav.querySelectorAll('img[src^="/images/"]').forEach((img) => {
        img.src = new URL(img.getAttribute("src").slice(1), shellAssetBase).href;
      });
    }

    const syncScrolled = () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    };

    syncScrolled();
    window.addEventListener("scroll", syncScrolled, { passive: true });

    if (links && burger) {
      const closeMenu = () => {
        links.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Menü öffnen");
      };

      const toggleMenu = () => {
        const open = links.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      };

      burger.addEventListener("click", toggleMenu);

      links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      links.querySelectorAll(".sn-submenu-tabs").forEach((submenu) => {
        const tabs = Array.from(submenu.querySelectorAll(".sn-submenu-tab"));
        const panels = Array.from(submenu.querySelectorAll(".sn-submenu-panel"));

        const activatePanel = (panelId) => {
          tabs.forEach((tab) => {
            const isActive = tab.dataset.panel === panelId;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-selected", isActive ? "true" : "false");
          });

          panels.forEach((panel) => {
            const isActive = panel.id === panelId;
            panel.classList.toggle("is-active", isActive);
            panel.hidden = !isActive;
          });
        };

        tabs.forEach((tab) => {
          const activate = () => activatePanel(tab.dataset.panel);
          tab.addEventListener("mouseenter", activate);
          tab.addEventListener("focus", activate);
          tab.addEventListener("click", activate);
        });

        if (tabs[0]?.dataset.panel) {
          activatePanel(tabs[0].dataset.panel);
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 700) closeMenu();
      });
    }

    nav.dataset.ready = "true";
  }

  function initSearch() {
    const trigger = document.getElementById("sn-search-open");
    const overlay = document.getElementById("sn-search-overlay");
    const closeBtn = document.getElementById("sn-search-close");
    const input = document.getElementById("sn-search-input");
    const results = document.getElementById("sn-search-results");

    if (!trigger || !overlay || !closeBtn || !input || !results || overlay.dataset.ready === "true") return;

    const defaultItems = [
      { title: "Geschäftskonto Vergleich", subtitle: "Passende Konten nach Rechtsform, Bedarf und Kostenmodell", tag: "Banking", href: "/geschaeftskonto-vergleich/" },
      { title: "Kostenloses Geschäftskonto", subtitle: "Kostenfreie Geschäftskonten im Überblick", tag: "Vergleich", href: "/geschaeftskonto-kostenlos/" },
      { title: "Geschäftskonto ohne Schufa", subtitle: "Optionen für Kontoeröffnung ohne SCHUFA-Prüfung", tag: "Banking", href: "/geschaeftskonto-ohne-schufa/" },
      { title: "Girokonto für Selbstständige", subtitle: "Konten für Freiberufler und Einzelunternehmer", tag: "Selbstständige", href: "/girokonto-fuer-selbststaendige-und-freiberufler/" },
      { title: "Finom", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/finom-geschaeftskonto/" },
      { title: "FYRST", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/fyrst-geschaeftskonto/" },
      { title: "Qonto", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/qonto-geschaeftskonto/" },
      { title: "Vivid", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/vivid-geschaeftskonto/" },
      { title: "Commerzbank", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/commerzbank-geschaeftskonto/", keywords: "comm kommerzbank filialbank klassik premium" },
      { title: "Deutsche Bank", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/deutsche-bank-geschaeftskonto/", keywords: "db deutschebank filialbank" },
      { title: "Postbank", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/postbank-geschaeftskonto/" },
      { title: "DKB", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/dkb-geschaeftskonto/" },
      { title: "ING", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/ing-geschaeftskonto/" },
      { title: "HypoVereinsbank", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/hypovereinsbank-geschaeftskonto/", keywords: "hvb unicredit hypo vereinsbank" },
      { title: "Kontist", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/kontist-geschaeftskonto/" },
      { title: "Holvi", subtitle: "Geschäftskonto im Detailtest", tag: "Anbieter", href: "/holvi-geschaeftskonto/" },
      { title: "Kredit für Selbstständige", subtitle: "Finanzierungslösungen für Selbstständige", tag: "Kredit", href: "/kredit-fuer-selbststaendige/" },
      { title: "Rechnungen schreiben", subtitle: "Leitfaden für Selbstständige", tag: "Ratgeber", href: "/rechnungen-schreiben-selbststaendige/" },
      { title: "Krankenversicherung für Selbstständige", subtitle: "Wichtige Grundlagen kompakt erklärt", tag: "Ratgeber", href: "/krankenversicherung-selbststaendige/" },
      { title: "5 Finanzfehler für Einzelunternehmer", subtitle: "Typische Stolperfallen vermeiden", tag: "Ratgeber", href: "/5-finanzfehler-einzelunternehmer/" },
      { title: "Ratgeber", subtitle: "Alle Ratgeber und Grundlagen im Überblick", tag: "Wissen", href: "/ratgeber/" }
    ];
    let items = defaultItems;

    const loadSearchIndex = async () => {
      if (window.location.protocol === "file:") return;

      try {
        const response = await fetch(new URL("search-index.json", shellAssetBase), { cache: "no-cache" });
        if (!response.ok) return;

        const nextItems = await response.json();
        if (!Array.isArray(nextItems) || nextItems.length === 0) return;

        items = nextItems.filter((item) => item.title && item.href);
        render(input.value);
      } catch (_) {
        items = defaultItems;
      }
    };

    const render = (query = "") => {
      const q = query.trim().toLowerCase();
      const filtered = q
        ? items
            .map((item) => {
              const title = String(item.title || "").toLowerCase();
              const subtitle = String(item.subtitle || "").toLowerCase();
              const tag = String(item.tag || "").toLowerCase();
              const href = String(item.href || "").toLowerCase();
              const keywords = String(item.keywords || "").toLowerCase();
              const haystack = `${title} ${subtitle} ${tag} ${href} ${keywords}`;
              if (!haystack.includes(q)) return null;

              let score = 0;
              if (title.startsWith(q)) score += 100;
              if (title.includes(q)) score += 70;
              if (href.includes(q)) score += 50;
              if (subtitle.includes(q)) score += 25;
              if (tag.includes(q)) score += 15;
              if (keywords.includes(q)) score += 5;

              return { item, score };
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "de"))
            .map((entry) => entry.item)
        : items.slice(0, 8);

      results.innerHTML = filtered.length
        ? filtered.slice(0, 8).map((item) => `
            <a class="sn-search-link" href="${item.href}">
              <span class="sn-search-link-main">
                <span class="sn-search-link-title">${item.title}</span>
                <span class="sn-search-link-subtitle">${item.subtitle}</span>
              </span>
              <span class="sn-search-link-tag">${item.tag}</span>
            </a>
          `).join("")
        : `<div class="sn-search-link"><span class="sn-search-link-main"><span class="sn-search-link-title">Keine Treffer</span><span class="sn-search-link-subtitle">Versuchen Sie es mit einem Anbieter, Thema oder Produkt.</span></span><span class="sn-search-link-tag">Suche</span></div>`;
    };

    const openSearch = () => {
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      render(input.value);
      window.setTimeout(() => input.focus(), 20);
    };

    const closeSearch = () => {
      overlay.hidden = true;
      document.body.style.overflow = "";
    };

    trigger.addEventListener("click", openSearch);
    closeBtn.addEventListener("click", closeSearch);
    overlay.querySelectorAll("[data-close-search]").forEach((node) => {
      node.addEventListener("click", closeSearch);
    });
    input.addEventListener("input", (event) => render(event.target.value));
    results.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeSearch();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) closeSearch();
    });

    render();
    loadSearchIndex();
    overlay.dataset.ready = "true";
  }

  function init() {
    initNav();
    initSearch();
  }

  window.FirmendoSiteShell = {
    ...(window.FirmendoSiteShell || {}),
    init,
    initNav,
    initSearch,
    loadSharedNav,
  };

  loadSharedNav().finally(init);
})();
