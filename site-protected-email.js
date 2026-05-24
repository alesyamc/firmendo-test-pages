(function initProtectedEmails() {
  const links = document.querySelectorAll(".protected-email");
  if (!links.length) return;

  const decode = (value) => {
    try {
      return atob(value);
    } catch (error) {
      return "";
    }
  };

  links.forEach((link) => {
    const user = decode(link.dataset.user || "");
    const domain = decode(link.dataset.domain || "");
    if (!user || !domain) return;

    const email = user + "@" + domain;
    link.textContent = email;
    link.href = "mailto:" + email;
  });
})();
