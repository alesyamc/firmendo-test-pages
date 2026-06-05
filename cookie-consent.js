(function () {
  var storageKey = 'firmendo_cookie_consent_v2';
  var hotjarId = 6725714;
  var hotjarVersion = 6;

  function getConsent() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch (error) {
      return;
    }
  }

  function loadHotjar() {
    if (window.__firmendoHotjarLoaded) return;
    window.__firmendoHotjarLoaded = true;

    (function (h, o, t, j, a, r) {
      h.hj = h.hj || function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
      h._hjSettings = { hjid: hotjarId, hjsv: hotjarVersion };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  function closeBanner() {
    var banner = document.querySelector('[data-cookie-consent-banner]');
    if (banner) banner.remove();
  }

  function showSettingsButton() {
    if (document.querySelector('[data-cookie-settings-button]')) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'cookie-settings-button';
    button.setAttribute('data-cookie-settings-button', '');
    button.textContent = 'Cookie-Einstellungen';
    button.addEventListener('click', function () {
      renderBanner(true);
    });
    document.body.appendChild(button);
  }

  function renderBanner(isSettingsOpen) {
    closeBanner();

    var banner = document.createElement('section');
    banner.className = 'cookie-consent';
    banner.setAttribute('data-cookie-consent-banner', '');
    banner.setAttribute('tabindex', '-1');
    banner.setAttribute('aria-label', 'Cookie-Hinweis');

    var text = document.createElement('p');
    text.className = 'cookie-consent-text';
    text.innerHTML = 'Wir nutzen Hotjar nur mit Ihrer Einwilligung, um die Nutzung unserer Website zu analysieren und Firmendo zu verbessern. Details finden Sie in der <a href="/firmendo-test-pages/datenschutz/">Datenschutzerklärung</a>.';

    var actions = document.createElement('div');
    actions.className = 'cookie-consent-actions';

    var rejectButton = document.createElement('button');
    rejectButton.type = 'button';
    rejectButton.className = 'cookie-consent-button cookie-consent-button-secondary';
    rejectButton.textContent = 'Ablehnen';
    rejectButton.addEventListener('click', function () {
      var previousConsent = getConsent();
      setConsent('rejected');
      closeBanner();
      showSettingsButton();
      if (previousConsent === 'accepted') {
        window.location.reload();
      }
    });

    var acceptButton = document.createElement('button');
    acceptButton.type = 'button';
    acceptButton.className = 'cookie-consent-button cookie-consent-button-primary';
    acceptButton.textContent = 'Akzeptieren';
    acceptButton.addEventListener('click', function () {
      setConsent('accepted');
      closeBanner();
      showSettingsButton();
      loadHotjar();
    });

    actions.appendChild(rejectButton);
    actions.appendChild(acceptButton);
    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);

    if (isSettingsOpen) {
      banner.focus({ preventScroll: true });
    }
  }

  function init() {
    var consent = getConsent();

    if (consent === 'accepted') {
      loadHotjar();
      showSettingsButton();
      return;
    }

    if (consent === 'rejected') {
      showSettingsButton();
      return;
    }

    renderBanner(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
