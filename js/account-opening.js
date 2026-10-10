/* Kontoauswahl auf /geschaeftskonto-eroeffnen/: Rechtsform- und Phasenfilter steuern
   die Tarif-Tabelle (Vergleichsrechner-Design), die Unterlagen und die Checkliste.
   Unterlagen und Checkliste bleiben ohne JavaScript vollständig sichtbar. */
(() => {
  'use strict';
  const accounts = Array.isArray(window.openingAccounts) ? window.openingAccounts : [];
  const tbody = document.getElementById('tbody');
  const mobile = document.getElementById('mobileCards');
  const legalFd = document.getElementById('fd-opening-form');
  const stageFd = document.getElementById('fd-opening-stage');
  if (!tbody || !legalFd || !stageFd) return;
  const quick = { noSchufa: false, founding: false, free: false, branch: false };
  const quickButtons = [...document.querySelectorAll('#opening-quick .toggle-btn')];

  const documents = [...document.querySelectorAll('[data-document-forms]')];
  const checks = [...document.querySelectorAll('[data-check-forms]')];
  const YES = '<span class="td-bool-state yes"><svg class="icon-yes td-check-yes" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>';
  const NO = '<span class="td-bool-state no"><svg class="icon-no td-check-no" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>';
  const EXT = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

  const optionText = (fd, value) => fd.querySelector(`.fd-option[data-value="${value === 'all' ? '' : value}"]`)?.textContent.trim() || '';
  const matches = (tokens, value) => value === 'all' || tokens === 'all' || tokens.split(' ').includes(value);
  const plain = text => String(text).replace(/&shy;/g, '');
  const fullName = p => p.variant ? `${p.name} – ${p.variant}` : p.name;

  function basePriceMarkup(p) {
    const amount = p.base === 0
      ? `<span class="price-green">${p.baseText}</span>`
      : `<span class="price-blue">${p.baseText}</span>`;
    if (!p.baseHint) return amount;
    return `<span class="price-wrap">${amount}<span class="price-hint">${p.baseHint}</span><span class="price-tooltip">${p.baseNote}</span></span>`;
  }
  function foundingMarkup(p, mode) {
    if (p.founding === null) return mode === 'mobile' ? 'nur Selbstständige' : '<span class="opening-muted" title="Nur für Selbstständige">—</span>';
    if (mode === 'mobile') return p.founding ? 'Ja' : 'Nein';
    return p.founding ? YES : NO;
  }
  function ctaMarkup(p, mode) {
    const label = `Konto eröffnen: ${plain(fullName(p))}`;
    return mode === 'mobile'
      ? `<a href="${p.affiliateUrl}" target="_blank" rel="sponsored nofollow noopener" class="mc-cta" aria-label="${label}">Konto eröffnen*</a>`
      : `<a href="${p.affiliateUrl}" target="_blank" rel="sponsored nofollow noopener" class="btn-table" aria-label="${label}">Konto eröffnen* ${EXT}</a>`;
  }

  function visibleAccounts() {
    const type = legalFd.dataset.value || 'all';
    const phase = stageFd.dataset.value || 'all';
    const corporate = type === 'gmbh' || type === 'ug';
    const price = fdGetValue('fd-opening-price');
    const kind = fdGetValue('fd-opening-type');
    return accounts.filter(p => {
      const phaseFits = !(p.stage === 'active' && (corporate || type === 'all') && (phase === 'founding' || phase === 'plan'));
      if (!(matches(p.forms, type) && phaseFits && !(corporate && phase === 'plan'))) return false;
      if (price === 'free' && p.base !== 0) return false;
      if (price === 'paid' && p.base === 0) return false;
      if (kind && p.cat !== kind) return false;
      if (quick.noSchufa && p.schufa) return false;
      if (quick.founding && p.founding !== true) return false;
      if (quick.free && p.base !== 0) return false;
      if (quick.branch && !p.branch) return false;
      return true;
    });
  }

  function activeFilterCount() {
    let count = 0;
    ['fd-opening-form', 'fd-opening-stage', 'fd-opening-price', 'fd-opening-type'].forEach(id => { if (fdGetValue(id)) count += 1; });
    Object.values(quick).forEach(on => { if (on) count += 1; });
    return count;
  }

  function sorted(list) {
    const mode = fdGetValue('fd-sort') || 'default';
    const copy = [...list];
    if (mode === 'base-asc') copy.sort((a, b) => a.base - b.base);
    else if (mode === 'base-desc') copy.sort((a, b) => b.base - a.base);
    else if (mode === 'name-asc') copy.sort((a, b) => plain(a.sortName || a.name).localeCompare(plain(b.sortName || b.name), 'de'));
    return copy.sort(compareHighlightFirst);
  }

  function renderRows(data) {
    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <p>Kein passender Tarif für diese Filter. Bitte Auswahl anpassen oder zurücksetzen.</p></div></td></tr>`;
      return;
    }
    tbody.innerHTML = data.map(p => `
      <tr class="${p.highlight ? 'highlight' : ''}">
        <td>
          <div class="td-anbieter">
            <div class="td-logo">${p.logo}</div>
            <div>
              ${p.highlight ? '<span class="highlight-badge">Empfehlung</span>' : ''}
              <div class="td-name">${p.name}</div>
              <div class="td-cat">${p.cat}${p.variant ? `, ${p.variant}` : ''}</div>
              <span class="tariff-group-text">Tarif für ${p.targetGroup}</span>
            </div>
          </div>
        </td>
        <td class="td-price opening-center">${basePriceMarkup(p)}</td>
        <td class="td-inklusive"><span class="table-text">${p.inklusive}</span></td>
        <td class="td-rf"><div class="rf-tags">${p.suitable.map(r => `<span class="rf-tag">${r}</span>`).join('')}</div></td>
        <td class="td-bool">${foundingMarkup(p, 'table')}</td>
        <td class="td-legitimation"><span class="table-text">${p.legitimation}</span></td>
        <td class="td-cta">
          <div class="opening-cta-stack">
            ${ctaMarkup(p, 'table')}
            <a href="${p.reviewUrl}" class="btn-table-ghost btn-table-detail opening-review">Zum Testbericht</a>
          </div>
        </td>
      </tr>`).join('');
  }

  function renderCards(data) {
    if (!mobile) return;
    if (!data.length) {
      mobile.innerHTML = '<div class="mobile-empty"><p>Kein passender Tarif für diese Filter. Bitte Auswahl anpassen oder zurücksetzen.</p></div>';
      return;
    }
    mobile.innerHTML = data.map(p => `
      <article class="mc-card ${p.highlight ? 'highlight' : ''}">
        <div class="mc-head">
          <div class="mc-logo">${p.logo}</div>
          <div class="mc-head-text">
            ${p.highlight ? '<span class="mc-badge">Empfehlung</span>' : ''}
            <div class="mc-name">${fullName(p)}</div>
            <div class="mc-meta"><span class="mc-cat">${p.cat}</span><span class="tariff-group-text">Tarif für ${p.targetGroup}</span></div>
          </div>
          <div class="mc-price-main">
            <div class="mc-price-amount ${p.base === 0 ? 'free' : ''}">${p.baseText}</div>
            <div class="mc-price-period">${p.baseHint || 'Grundpreis'}</div>
          </div>
        </div>
        <div class="mc-specs">
          <div class="mc-spec"><span class="mc-spec-label">Inklusive</span><span class="mc-spec-value">${p.inklusive}</span></div>
          <div class="mc-spec"><span class="mc-spec-label">Rechtsformen</span><span class="mc-spec-value">${p.suitable.join(', ')}</span></div>
          <div class="mc-spec"><span class="mc-spec-label">In Gründung</span><span class="mc-spec-value ${p.founding ? 'green' : 'muted'}">${foundingMarkup(p, 'mobile')}</span></div>
          <div class="mc-spec"><span class="mc-spec-label">Legitimation</span><span class="mc-spec-value">${p.legitimation}</span></div>
        </div>
        <div class="mc-footer">
          <div class="mc-footer-note">${p.baseNote ? `${p.baseNote} ` : ''}${p.note}</div>
          <div class="mc-actions">
            ${ctaMarkup(p, 'mobile')}
            <a href="${p.reviewUrl}" class="mc-secondary opening-review">Testbericht →</a>
          </div>
        </div>
      </article>`).join('');
  }

  function update() {
    const type = legalFd.dataset.value || 'all';
    const phase = stageFd.dataset.value || 'all';
    const corporate = type === 'gmbh' || type === 'ug';
    const data = sorted(visibleAccounts());
    const providers = new Set(data.map(p => p.reviewUrl));

    renderRows(data);
    renderCards(data);
    if (typeof updateTableScrollState === 'function') updateTableScrollState({ scrollThreshold: 4, endWhenNotScrollable: true });

    const result = document.getElementById('opening-result-text');
    if (result) {
      const selection = type === 'all' && phase === 'all' ? '' : ` (Auswahl: ${optionText(legalFd, type)}, ${optionText(stageFd, phase)})`;
      result.innerHTML = `<strong>${data.length}</strong> ${data.length === 1 ? 'Tarifvariante' : 'Tarifvarianten'} von ${providers.size} ${providers.size === 1 ? 'Anbieter' : 'Anbietern'}${selection}`;
    }
    document.getElementById('opening-empty').hidden = data.length > 0 || (corporate && phase === 'plan');
    const note = document.getElementById('opening-stage-note');
    note.hidden = !(corporate && phase !== 'active' && phase !== 'all');
    note.textContent = phase === 'plan'
      ? 'Bereiten Sie zunächst die notarielle Gründung und Ihre Unterlagen vor. Für das Konto der GmbH oder UG in Gründung benötigen Sie die beurkundeten Gründungsunterlagen. Wählen Sie nach dem Notartermin „In Gründung“, um passende Konten zu sehen.'
      : 'Die Auswahl zeigt Konten für die GmbH oder UG in Gründung. Kapital einzahlen und den Nachweis für das Notariat anfordern sind eigene Schritte nach dem Kontoantrag.';

    const count = activeFilterCount();
    const reset = document.getElementById('opening-reset');
    if (reset) reset.classList.toggle('active', count > 0);
    const badge = document.getElementById('opening-filter-badge');
    const countNode = document.getElementById('opening-filter-count');
    if (badge && countNode) { countNode.textContent = count; badge.classList.toggle('hidden', count === 0); }

    const phaseMatches = value => value === 'all' || phase === 'all' || (phase === 'active' ? value === 'active' : value === 'founding');
    documents.forEach(row => { row.hidden = !matches(row.dataset.documentForms, type) || !phaseMatches(row.dataset.documentStage); });
    checks.forEach(row => { row.hidden = !matches(row.dataset.checkForms, type) || !phaseMatches(row.dataset.checkStage); });
    const docNote = document.getElementById('opening-documents-note');
    if (docNote) {
      docNote.textContent = type === 'other'
        ? 'Für andere Rechtsformen klären Sie die benötigten Unternehmensnachweise direkt mit der Bank. Die allgemeine Checkliste bleibt verfügbar.'
        : 'Unterlagen für: ' + optionText(legalFd, type) + ', ' + optionText(stageFd, phase) + '. Die Bank kann weitere Nachweise anfordern.';
    }
  }

  fdInitControls({ onChange: update });
  document.getElementById('opening-reset')?.addEventListener('click', () => {
    fdSetValue('fd-opening-form', '');
    fdSetValue('fd-opening-stage', '');
    fdSetValue('fd-opening-price', '');
    fdSetValue('fd-opening-type', '');
    fdSetValue('fd-sort', 'default');
    Object.keys(quick).forEach(key => { quick[key] = false; });
    quickButtons.forEach(btn => { btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); });
    update();
  });
  quickButtons.forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.quick;
    quick[key] = !quick[key];
    btn.classList.toggle('active', quick[key]);
    btn.setAttribute('aria-pressed', quick[key] ? 'true' : 'false');
    update();
  }));
  const tableWrap = document.getElementById('tableWrap');
  if (tableWrap && typeof updateTableScrollState === 'function') {
    const sync = () => updateTableScrollState({ scrollThreshold: 4, endWhenNotScrollable: true });
    tableWrap.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
  }
  update();
})();
