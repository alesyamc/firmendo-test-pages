(() => {
  function domReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function getTarget(link) {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#") || href.length < 2) return null;
    try {
      return document.getElementById(decodeURIComponent(href.slice(1))) || document.querySelector(href);
    } catch (_) {
      return document.getElementById(href.slice(1));
    }
  }

  function initReadingProgress() {
    let progress = document.getElementById("reading-progress");
    if (!progress) {
      progress = document.createElement("div");
      progress.id = "reading-progress";
      progress.setAttribute("aria-hidden", "true");
      document.body.prepend(progress);
    }
    if (progress.dataset.ready === "true") return;

    function updateProgress() {
      const total = Math.max(1, document.body.scrollHeight - window.innerHeight);
      progress.style.width = `${Math.min(100, Math.max(0, (window.scrollY / total) * 100))}%`;
    }

    progress.dataset.ready = "true";
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  function initToc() {
    const title = document.querySelector(".toc-title");
    if (title && !title.textContent.trim()) title.textContent = "Inhalt";

    const links = Array.from(document.querySelectorAll(".toc-list a"));
    if (!links.length) return;

    const tocList = links[0].closest(".toc-list");

    const sections = links
      .map((link) => ({ link, el: getTarget(link) }))
      .filter((item) => item.el);

    if (!sections.length) return;

    let lastActive = null;

    function updateToc() {
      const marker = window.scrollY + 150;
      let current = sections[0];

      sections.forEach((section) => {
        const top = section.el.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) current = section;
      });

      links.forEach((link) => link.classList.remove("active"));
      if (!current) return;

      current.link.classList.add("active");
      if (current.link !== lastActive) {
        lastActive = current.link;
        keepActiveLinkInTocView(current.link, tocList);
      }
    }

    window.addEventListener("scroll", updateToc, { passive: true });
    window.addEventListener("resize", updateToc);
    updateToc();
  }

  function keepActiveLinkInTocView(link, tocList) {
    if (!link || !tocList) return;
    if (tocList.scrollHeight <= tocList.clientHeight + 1) return;

    const linkTop = link.offsetTop;
    const linkBottom = linkTop + link.offsetHeight;
    const viewTop = tocList.scrollTop;
    const viewBottom = viewTop + tocList.clientHeight;

    if (linkTop < viewTop) {
      tocList.scrollTop = linkTop;
    } else if (linkBottom > viewBottom) {
      tocList.scrollTop = linkBottom - tocList.clientHeight;
    }
  }

  domReady(() => {
    initReadingProgress();
    initToc();
  });
})();
