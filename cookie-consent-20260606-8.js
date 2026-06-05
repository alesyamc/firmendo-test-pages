(function () {
  var storageKey = 'firmendo_cookie_consent_v3';
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

  function deleteCookie(name, domain) {
    var domainPart = domain ? ';domain=' + domain : '';
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + domainPart;
  }

  function clearHotjarStorage() {
    var host = window.location.hostname;
    var parts = host.split('.');
    var rootDomain = parts.length > 2 ? '.' + parts.slice(-2).join('.') : '.' + host;

    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (name.indexOf('_hj') === 0) {
        deleteCookie(name);
        deleteCookie(name, host);
        deleteCookie(name, rootDomain);
      }
    });

    [window.localStorage, window.sessionStorage].forEach(function (storage) {
      if (!storage) return;
      try {
        Object.keys(storage).forEach(function (key) {
          if (key.indexOf('_hj') === 0 || key.indexOf('hj') === 0) {
            storage.removeItem(key);
          }
        });
      } catch (error) {
        return;
      }
    });
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
    button.setAttribute('aria-label', 'Cookie-Einstellungen');
    button.innerHTML = '<svg class="cookie-settings-icon" width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 0 9 9 3 3 0 0 1-3-3 3 3 0 0 1-3-3 3 3 0 0 1-3-3Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="13" cy="15" r="1" fill="currentColor"/><circle cx="8" cy="15" r="1" fill="currentColor"/></svg>';
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
    text.innerHTML = 'Wir verwenden Cookies und ähnliche Technologien. Einige sind technisch notwendig, andere helfen uns nur mit Ihrer Einwilligung, unsere Website zu analysieren und zu verbessern. Weitere Informationen finden Sie in der <a href="/firmendo-test-pages/datenschutz/">Datenschutzerklärung</a>.';

    var actions = document.createElement('div');
    actions.className = 'cookie-consent-actions';

    var rejectButton = document.createElement('button');
    rejectButton.type = 'button';
    rejectButton.className = 'cookie-consent-button cookie-consent-button-secondary';
    rejectButton.textContent = 'Ablehnen';
    rejectButton.addEventListener('click', function () {
      var previousConsent = getConsent();
      setConsent('rejected');
      clearHotjarStorage();
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
