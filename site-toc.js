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

  function init() {
    let progress = document.getElementById("reading-progress");
    if (!progress) {
      progress = document.createElement("div");
      progress.id = "reading-progress";
      progress.setAttribute("aria-hidden", "true");
      document.body.prepend(progress);
    }
    if (progress.dataset.ready === "true") return;
    progress.dataset.ready = "true";
    progress.style.width = "100%";
    progress.style.transformOrigin = "left";
    progress.style.transform = "scaleX(0)";
    progress.style.transition = "transform 0.1s linear";

    const title = document.querySelector(".toc-title");
    if (title && !title.textContent.trim()) title.textContent = "Inhalt";
    const links = Array.from(document.querySelectorAll(".toc-list a"));
    const tocList = links[0]?.closest(".toc-list");
    const sections = links
      .map((link) => ({ link, el: getTarget(link) }))
      .filter((item) => item.el);
    let lastActive = null;
    let frame = 0;

    function update() {
      // Read all geometry before changing styles, classes or the TOC scroll position.
      const scrollY = window.scrollY;
      const total = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const fraction = Math.min(1, Math.max(0, scrollY / total));
      let current = sections[0];
      sections.forEach((section) => {
        if (section.el.getBoundingClientRect().top <= 150) current = section;
      });
      const activeLink = current?.link;
      let nextScrollTop = null;
      if (activeLink && activeLink !== lastActive && tocList &&
          tocList.scrollHeight > tocList.clientHeight + 1) {
        const linkRect = activeLink.getBoundingClientRect();
        const listRect = tocList.getBoundingClientRect();
        const viewTop = listRect.top + tocList.clientTop;
        const viewBottom = viewTop + tocList.clientHeight;
        if (linkRect.top < viewTop) {
          nextScrollTop = tocList.scrollTop + linkRect.top - viewTop;
        } else if (linkRect.bottom > viewBottom) {
          nextScrollTop = tocList.scrollTop + linkRect.bottom - viewBottom;
        }
      }

      progress.style.transform = `scaleX(${fraction})`;
      if (activeLink && activeLink !== lastActive) {
        links.forEach((link) => link.classList.toggle("active", link === activeLink));
        lastActive = activeLink;
        if (nextScrollTop !== null) tocList.scrollTop = nextScrollTop;
      }
    }

    function scheduleUpdate() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    // ResizeObserver runs after layout, including the first render and late image/font loads.
    // Do not synchronously measure the page immediately after inserting the progress bar.
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = 0;
      update();
    });
    observer.observe(document.body);
    if (tocList) observer.observe(tocList);
  }

  domReady(init);
})();
