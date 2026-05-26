const products = [
  {
    name: 'moss Free', priceNote: 'Kostenlos · Echter Kreditrahmen bis 2,5 Mio. € · 60 Tage Zahlungsziel', base: 0, cat: 'Fintech', highlight: true,
    suitable: ['GmbH & UG','AG','GbR','eK','Gründer'],
    cardType: 'Kreditkarte', rating: 4.7,
    cashbackRate: 0, cashbackLabel: '—',
    limit: 'bis 2,5 Mio. €',
    employeeCards: 'unbegrenzt', employeeCardsSort: 999,
    datev: true, belegerfassung: true,
    affiliateUrl: 'https://getmoss.com/?ref=firmendo',
    logo: '<img class="provider-logo-img u-logo-media-fit" src="../images/mini-logos/moss.svg" alt="moss Logo" loading="lazy" decoding="async">'
  },
  {
    name: 'Finom Solo', priceNote: 'Kostenlos · Visa Debitkarte · bis 3% Cashback', base: 0, cat: 'Fintech', highlight: false,
    suitable: ['Freiberufler','Einzelunternehmen','Gründer'],
    cardType: 'Debitkarte', rating: 4.5,
    cashbackRate: 3, cashbackLabel: 'bis 3 %',
    limit: 'Debit',
    employeeCards: 'solo', employeeCardsSort: 1,
    datev: true, belegerfassung: true,
    affiliateUrl: '/go/finom-prime-card/',
    logo: '<img class="provider-logo-img u-logo-media-fit" src="../images/mini-logos/finom.svg" alt="Finom Logo" loading="lazy" decoding="async">'
  },
  {
    name: 'Vivid Business', priceNote: 'Kostenlos · Visa Debitkarte · bis 4% Cashback', base: 0, cat: 'Online-Bank', highlight: false,
    suitable: ['Freiberufler','Einzelunternehmen','GmbH & UG','Gründer'],
    cardType: 'Debitkarte', rating: 4.8,
    cashbackRate: 4, cashbackLabel: 'bis 4 %',
    limit: 'Debit',
    employeeCards: 'bis 50', employeeCardsSort: 50,
    datev: false, belegerfassung: true,
    affiliateUrl: '/go/vivid-business-firmenkarte/',
    logo: '<img class="provider-logo-img u-logo-media-fit" src="../images/mini-logos/vivid-money.png" alt="Vivid Money Logo" loading="lazy" decoding="async">'
  },
  {
    name: 'Revolut Business Free', priceNote: 'Kostenlos · Mastercard Debitkarte · Multi-Währung', base: 0, cat: 'Fintech', highlight: false,
    suitable: ['Freiberufler','Einzelunternehmen','GmbH & UG','Gründer'],
    cardType: 'Debitkarte', rating: 4.4,
    cashbackRate: 0, cashbackLabel: '—',
    limit: 'Debit',
    employeeCards: 'ja', employeeCardsSort: 10,
    datev: false, belegerfassung: true,
    affiliateUrl: '/go/revolut-business-debit-card/',
    logo: '<img class="provider-logo-img u-logo-media-fit" src="../images/mini-logos/revolut.svg" alt="Revolut Logo" loading="lazy" decoding="async">'
  },
  {
    name: 'Qonto Business', priceNote: 'Ab 9 €/Monat · Mastercard Debitkarte · DATEV-Export', base: 9, cat: 'Fintech', highlight: false,
    suitable: ['Freiberufler','Einzelunternehmen','GmbH & UG','AG','GbR','Gründer'],
    cardType: 'Debitkarte', rating: 4.6,
    cashbackRate: 0, cashbackLabel: '—',
    limit: 'Debit',
    employeeCards: 'bis 30', employeeCardsSort: 30,
    datev: true, belegerfassung: true,
    affiliateUrl: '/go/qonto-business-credit-card/',
    logo: '<img class="provider-logo-img u-logo-media-fit" src="../images/mini-logos/qonto.png" alt="Qonto Logo" loading="lazy" decoding="async">'
  },
  {
    name: 'American Express Business Gold', priceNote: '216 €/Jahr · Charge-Karte · Membership Rewards', base: 216, cat: 'Kreditkarten-Anbieter', highlight: false,
    suitable: ['Freiberufler','Einzelunternehmen','GmbH & UG','AG','GbR'],
    cardType: 'Kreditkarte', rating: 4.6,
    cashbackRate: 0, cashbackLabel: 'Membership Rewards',
    limit: 'variabel',
    employeeCards: 'Corporate Cards', employeeCardsSort: 999,
    datev: false, belegerfassung: false,
    affiliateUrl: '/go/american-express-business-gold-card/',
    logo: '<img class="provider-logo-img u-logo-media-fit" src="../images/mini-logos/american-express.svg" alt="American Express Logo" loading="lazy" decoding="async">'
  },
  {
    name: 'N26 Business', priceNote: 'Kostenlos · Mastercard Debitkarte · 0,1% Cashback', base: 0, cat: 'Online-Bank', highlight: false,
    suitable: ['Freiberufler','Einzelunternehmen'],
    cardType: 'Debitkarte', rating: 4.2,
    cashbackRate: 0.1, cashbackLabel: '0,1 %',
    limit: 'Debit',
    employeeCards: 'solo', employeeCardsSort: 1,
    datev: false, belegerfassung: false,
    affiliateUrl: '/go/n26-business-card/',
    logo: '<img class="provider-logo-img u-logo-media-fit" src="../images/mini-logos/n26.svg" alt="N26 Logo" loading="lazy" decoding="async">'
  },
  {
    name: 'Kontist Premium', priceNote: '9 €/Monat · Visa Debitkarte · Steuerautomatisierung', base: 9, cat: 'Fintech', highlight: false,
    suitable: ['Freiberufler','Einzelunternehmen'],
    cardType: 'Debitkarte', rating: 4.3,
    cashbackRate: 0, cashbackLabel: '—',
    limit: 'Debit',
    employeeCards: 'solo', employeeCardsSort: 1,
    datev: true, belegerfassung: true,
    affiliateUrl: '/go/kontist-premium-karte/',
    logo: '<img class="provider-logo-img u-logo-media-fit" src="../images/mini-logos/kontist.png" alt="Kontist Logo" loading="lazy" decoding="async">'
  }
];

const YES = `<svg class="icon-yes" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const NO  = `<svg class="icon-no"  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const YES_SMALL = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const NO_SMALL  = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

let activeFilters = { cashback: false, employees: false, datev: false, kreditrahmen: false };
let sortKey = 'base', sortAsc = true;

function toggleFilter(key, btn) {
  activeFilters[key] = !activeFilters[key];
  btn.classList.toggle('active', activeFilters[key]);
  btn.setAttribute('aria-pressed', activeFilters[key] ? 'true' : 'false');
  renderTable();
}

function applyFilters() { renderTable(); }

function applySort() {
  const val = fdGetValue('fd-sort') || 'base-asc';
  const [key, dir] = val.split('-');
  sortKey = key;
  sortAsc = dir === 'asc';
  document.querySelectorAll('th.sortable').forEach(t => {
    t.classList.remove('asc','desc');
    if (t.dataset.key === key) t.classList.add(sortAsc ? 'asc' : 'desc');
  });
  renderTable();
}

function resetFilters() {
  activeFilters = { cashback: false, employees: false, datev: false, kreditrahmen: false };
  document.querySelectorAll('.toggle-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  fdSetValue('fd-suit', '', 'Alle Rechtsformen');
  fdSetValue('fd-type', '', 'Alle Typen');
  fdSetValue('fd-budget', '', 'Alle Preise');
  fdSetValue('fd-sort', 'base-asc', 'Preis: aufsteigend');
  sortKey = 'base'; sortAsc = true;
  document.querySelectorAll('th.sortable').forEach(t => t.classList.remove('asc','desc'));
  const defaultTh = document.querySelector('th.sortable[data-key="base"]');
  if (defaultTh) defaultTh.classList.add('asc');
  renderTable();
}

function updateFilterCount() {
  const suit = fdGetValue('fd-suit');
  const type = fdGetValue('fd-type');
  const budget = fdGetValue('fd-budget');
  let count = 0;
  if (suit) count++;
  if (type) count++;
  if (budget) count++;
  Object.values(activeFilters).forEach(v => { if (v) count++; });
  const badge = document.getElementById('filterCountBadge');
  const cnt = document.getElementById('filterCount');
  if (count > 0) {
    badge.classList.remove('hidden');
    cnt.textContent = count;
  } else {
    badge.classList.add('hidden');
  }
}

function renderTable() {
  const suit = fdGetValue('fd-suit');
  const type = fdGetValue('fd-type');
  const budget = fdGetValue('fd-budget');

  let data = products.filter(p => {
    if (suit && !p.suitable.includes(suit)) return false;
    if (type === 'Debitkarte' && p.cardType !== 'Debitkarte') return false;
    if (type === 'Kreditkarte' && p.cardType !== 'Kreditkarte') return false;
    if (type === 'Prepaid' && p.cardType !== 'Prepaid') return false;
    if (budget === 'free' && p.base > 0) return false;
    if (budget === 'low' && (p.base <= 0 || p.base > 10)) return false;
    if (budget === 'mid' && (p.base <= 10 || p.base > 50)) return false;
    if (budget === 'premium' && p.base < 50) return false;
    if (activeFilters.cashback && !(p.cashbackRate > 0)) return false;
    if (activeFilters.employees && (p.employeeCardsSort <= 1 || p.employeeCards === 'solo')) return false;
    if (activeFilters.datev && !p.datev) return false;
    if (activeFilters.kreditrahmen && p.cardType !== 'Kreditkarte') return false;
    return true;
  });

  if (sortKey) {
    data.sort((a, b) => {
      const highlightOrder = compareHighlightFirst(a, b);
      if (highlightOrder) return highlightOrder;
      let av = a[sortKey];
      let bv = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av === bv) return 0;
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }

  document.getElementById('cnt').textContent = data.length;
  const totalEl = document.getElementById('cntTotal');
  if (totalEl) totalEl.textContent = products.length;

  updateFilterCount();
  renderDesktopTable(data);
  renderMobileCards(data);
  requestAnimationFrame(updateScrollState);
}

function renderDesktopTable(data) {
  const tbody = document.getElementById('tbody');
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <p>Keine Anbieter gefunden. Bitte Filter anpassen.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(p => {
    const priceStr = p.base === 0
      ? `<span class="td-price-amount free">0 &euro;</span>`
      : `<span class="td-price-amount">${p.base % 1 === 0 ? p.base : p.base.toFixed(2).replace('.',',')} &euro;</span><span class="td-price-period">/ ${p.base >= 100 ? 'Jahr' : 'Monat'}</span>`;
    const cardBadgeClass = p.cardType === 'Kreditkarte' ? 'kredit' : p.cardType === 'Prepaid' ? 'prepaid' : 'debit';
    // Cashback: numeric uses green, Rewards (Amex) uses purple, none uses gray.
    const cashbackCell = p.cashbackRate > 0
      ? `<span class="cashback-val">${p.cashbackLabel}</span>`
      : (p.cashbackLabel && p.cashbackLabel !== '—'
        ? `<span class="cashback-val rewards">${p.cashbackLabel}</span>`
        : `<span class="cashback-none">&mdash;</span>`);
    // Kreditrahmen: debit uses gray, concrete limits use orange, variable uses purple.
    const limitCell = p.limit === 'Debit'
      ? `<span class="td-limit-value debit">Debit</span>`
      : p.limit === '—'
        ? `<span class="td-limit-value debit">&mdash;</span>`
        : p.limit === 'variabel'
          ? `<span class="td-limit-value variabel">variabel</span>`
          : `<span class="td-limit-value credit">${p.limit}</span>`;
    // Employee cards: unlimited/corporate uses orange, numeric values use blue.
    const empCell = p.employeeCards === 'solo'
      ? `<span class="td-employees-value none" title="Nur Einzelkonto, keine Mitarbeiterkarten">Einzelkonto</span>`
      : p.employeeCardsSort >= 999
        ? `<span class="td-employees-value premium">${p.employeeCards}</span>`
        : (p.employeeCardsSort > 0
          ? `<span class="td-employees-value">${p.employeeCards}</span>`
          : `<span class="td-employees-value none">&mdash;</span>`);
    const buchhaltungCell = `<div class="buchhaltung-stack">
      <span class="buchhaltung-item ${p.datev ? '' : 'off'}">DATEV</span>
      <span class="buchhaltung-item ${p.belegerfassung ? '' : 'off'}">Belege</span>
    </div>`;

    return `
    <tr class="${p.highlight ? 'highlight' : ''}">
      <td>
        <div class="td-anbieter u-table-provider-row">
          <div class="td-logo u-logo-dynamic-bg u-bg-white">${p.logo}</div>
          <div class="u-stack-start-gap-3 u-min-0">
            ${p.highlight ? '<span class="highlight-badge">Empfehlung</span>' : ''}
            <div class="td-name">${p.name}</div>
            <div class="td-cat">${p.cat}</div>
          </div>
        </div>
      </td>
      <td class="td-price">
        <div class="price-wrap">${priceStr}${p.priceNote ? `<div class="price-tooltip">${p.priceNote}</div>` : ''}</div>
      </td>
      <td class="td-center"><span class="card-badge ${cardBadgeClass}">${p.cardType}</span></td>
      <td class="td-center">${cashbackCell}</td>
      <td class="td-center">${limitCell}</td>
      <td class="td-center">${empCell}</td>
      <td class="td-center">${buchhaltungCell}</td>
      <td class="td-cta">
        <div class="td-cta-stack">
          <a href="${p.affiliateUrl}" target="_blank" rel="noopener sponsored" class="btn-table${p.highlight ? ' highlighted' : ''}">
            Zum Anbieter
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function renderMobileCards(data) {
  const mc = document.getElementById('mobileCards');
  if (!mc) return;
  if (data.length === 0) {
    mc.innerHTML = `<div class="mobile-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <p>Keine Anbieter gefunden. Bitte Filter anpassen.</p></div>`;
    return;
  }

  mc.innerHTML = data.map(p => {
    const priceStr = p.base === 0
      ? `<div class="mc-price-amount free">0 &euro;</div><div class="mc-price-period">Grundgeb&uuml;hr</div>`
      : `<div class="mc-price-amount">${p.base % 1 === 0 ? p.base : p.base.toFixed(2).replace('.',',')} &euro;</div><div class="mc-price-period">/ ${p.base >= 100 ? 'Jahr' : 'Monat'}</div>`;
    const cardBadgeClass = p.cardType === 'Kreditkarte' ? 'kredit' : p.cardType === 'Prepaid' ? 'prepaid' : 'debit';
    const cashbackVal = p.cashbackRate > 0
      ? `<span class="mc-spec-value green">${p.cashbackLabel}</span>`
      : (p.cashbackLabel && p.cashbackLabel !== '—'
        ? `<span class="mc-spec-value purple">${p.cashbackLabel}</span>`
        : `<span class="mc-spec-value muted">&mdash;</span>`);
    const limitVal = p.limit === 'Debit'
      ? `<span class="mc-spec-value muted">Debit</span>`
      : p.limit === '—'
        ? `<span class="mc-spec-value muted">&mdash;</span>`
        : p.limit === 'variabel'
          ? `<span class="mc-spec-value purple">variabel</span>`
          : `<span class="mc-spec-value orange">${p.limit}</span>`;
    const empVal = p.employeeCards === 'solo'
      ? `<span class="mc-spec-value muted">Einzelkonto</span>`
      : p.employeeCardsSort >= 999
        ? `<span class="mc-spec-value orange">${p.employeeCards}</span>`
        : (p.employeeCardsSort > 0
          ? `<span class="mc-spec-value blue">${p.employeeCards}</span>`
          : `<span class="mc-spec-value muted">&mdash;</span>`);
    const datevVal = p.datev
      ? `<span class="mc-spec-value green">${YES_SMALL} DATEV</span>`
      : `<span class="mc-spec-value muted">${NO_SMALL} DATEV</span>`;

    return `
    <div class="mc-card ${p.highlight ? 'highlight' : ''}">
      <div class="mc-head">
        <div class="mc-logo">${p.logo}</div>
        <div class="mc-head-text">
          <div class="mc-name">${p.name}</div>
          <div class="mc-meta">
            <span class="mc-cat">${p.cat}</span>
            <span class="card-badge ${cardBadgeClass}">${p.cardType}</span>
          </div>
          ${p.highlight ? '<span class="mc-badge">Empfehlung</span>' : ''}
        </div>
        <div class="mc-price-main">${priceStr}</div>
      </div>

      <div class="mc-specs">
        <div class="mc-spec">
          <div class="mc-spec-label">Cashback</div>
          ${cashbackVal}
        </div>
        <div class="mc-spec">
          <div class="mc-spec-label">Kreditrahmen</div>
          ${limitVal}
        </div>
        <div class="mc-spec">
          <div class="mc-spec-label">Mitarbeiterkarten</div>
          ${empVal}
        </div>
        <div class="mc-spec">
          <div class="mc-spec-label">Buchhaltung</div>
          ${datevVal}
        </div>
      </div>

      <div class="mc-footer">
        <div class="mc-footer-note">${p.priceNote || ''}</div>
        <a href="${p.affiliateUrl}" target="_blank" rel="noopener sponsored" class="mc-cta">
          Zum Anbieter
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </div>`;
  }).join('');
}

function updateScrollState() {
  updateTableScrollState({ scrollThreshold: 4, endWhenNotScrollable: true });
}

document.addEventListener('DOMContentLoaded', () => {
  fdInitControls({
    onSort: applySort,
    onFilter: applyFilters
  });
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.setAttribute('aria-pressed', 'false'));
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (sortKey === key) sortAsc = !sortAsc;
      else { sortKey = key; sortAsc = true; }
      document.querySelectorAll('th.sortable').forEach(t => { t.classList.remove('asc','desc'); });
      th.classList.add(sortAsc ? 'asc' : 'desc');
      // Sync fd-sort dropdown
      const matchingVal = `${key}-${sortAsc ? 'asc' : 'desc'}`;
      const fdSort = document.getElementById('fd-sort');
      if (fdSort) {
        const matchingOpt = fdSort.querySelector(`.fd-option[data-value="${matchingVal}"]`);
        if (matchingOpt) {
          fdSetValue('fd-sort', matchingVal, matchingOpt.textContent.trim());
        }
      }
      renderTable();
    });
  });
  // Set default sort indicator
  const defaultTh = document.querySelector('th.sortable[data-key="base"]');
  if (defaultTh) defaultTh.classList.add('asc');
  renderTable();

  const tableWrap = document.getElementById('tableWrap');
  if (tableWrap) tableWrap.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState);
  setTimeout(updateScrollState, 50);
  setTimeout(updateScrollState, 300);
  updateScrollState();
});
