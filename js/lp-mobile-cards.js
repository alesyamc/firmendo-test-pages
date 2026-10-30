/* Shared mobile comparison cards. Pages supply data; this file owns the markup. */
const lpMobileCards = (() => {
  const yes = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const no = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const euro = value => Number(value).toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' €';

  function cell(html) {
    const box = document.createElement('div');
    box.innerHTML = html ?? '';
    const note = [...box.querySelectorAll('.price-tooltip')].map(n => n.textContent.trim()).filter(Boolean).join(' ');
    box.querySelectorAll('.price-tooltip, .price-hint').forEach(n => n.remove());
    box.querySelectorAll('br').forEach(n => n.replaceWith(' · '));
    return {value: box.textContent.replace(/\s+/g, ' ').trim(), html: box.innerHTML, note};
  }

  function usage() {
    const u = lpComparisonUsage();
    const nb = '\u00a0';
    const cash = u.withdrawals > 0 && u.amount > 0
      ? `${u.withdrawals}×${nb}${euro(u.amount).replace(',00', '').replace(/\s/g, nb)}${nb}Bargeld`
      : `ohne${nb}Bargeld`;
    return `bei ${u.transactions}${nb}Buchungen · ${cash}`;
  }

  function feature(label, on, optional = false) {
    return {label, on, optional};
  }

  function datev(product) {
    const match = String(product.priceNote || '').match(/DATEV(?:-\S+)?\s+(\d+(?:[,.]\d+)?)\s*€\s*\/\s*Monat/i);
    const amount = product.datevMonthly || (match ? Number(match[1].replace(',', '.')) : 0);
    return feature(amount && product.datev ? `DATEV +${euro(amount).replace(',00', '')}/Monat` : 'DATEV', product.datev, !!amount && product.datev);
  }

  function features(product, options = {}) {
    return [
      ...(options.schufa === false ? [] : [feature('Ohne Schufa', !product.schufa)]),
      datev(product), feature('Buchhaltung', product.accounting), feature('International', product.intl),
      ...(product.cashback && product.cashback !== '—' ? [feature('Cashback ' + product.cashback.replace(/\s*garantiert$/i, ''), true)] : [])
    ];
  }

  function detail(label, html) { return {label, html}; }
  function fact(label, value, tone = '') { return {label, value, tone}; }

  function promoEnd(product) {
    return product.promoEnd || String(product.promoNote || '').match(/bis (\d{1,2}\.\d{1,2}\.\d{4})/)?.[1] || '';
  }

  function promoFact(product) {
    return {...fact('Aktion', product.promo, 'promo'), sub: promoEnd(product) ? 'bis ' + promoEnd(product) : ''};
  }

  function promo(product) {
    const parts = String(product.promoNote || '').split(/;\s*zusätzlich\s+/).map(s => s.trim()).filter(Boolean);
    return parts.length < 2 ? product.promoNote || '' : `<ul class="mc-detail-points">${parts.map(s => `<li>${s.replace(/\.$/, '')}</li>`).join('')}</ul>`;
  }

  function tariff(product) {
    if (product.mobileConditions) return product.mobileConditions;
    const parts = String(product.priceNote || '').split(/;\s+/).map(s => s.trim()).filter(Boolean);
    if (parts.length < 2) return parts.join('').replace(/(^|,\s*)0 €\/Monat(?=,|$)/, '').replace(/^,\s*/, '').trim();
    return parts.filter(s => !/Bonus|Onboarding|Aktivierung|\bAktion\b|Neukunden|p\.a\.|Bargeld|Abhebung|\bATM\b|^Preise netto$/i.test(s))
      .map(s => s.replace(/(^|,\s*)0 €\/Monat(?=,|$)/, '').replace(/^,\s*/, '').trim()).filter(Boolean).join('; ');
  }

  function costTable(costs, note = '') {
    const rows = [['Grundgebühr', costs.base], ['Transaktionen', costs.transactions]];
    if (costs.card) rows.push(['Physische Karte', costs.card]);
    rows.push(['Abhebungen', costs.withdrawals]);
    const rest = String(note).replace(/^Grundgebühr\s+[\d.,]+\s*€(?:\s*[,+]\s*(?:Transaktionen|Abhebungen|physische Karte)\s+[\d.,]+\s*€)+[.]?\s*/i, '').replace(/^,\s*/, '').trim();
    return `<table class="mc-calc"><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${label}</th><td>${euro(value)}</td></tr>`).join('')}</tbody><tfoot><tr><th scope="row">Gesamt</th><td>${euro(costs.total)}<small>/Monat</small></td></tr></tfoot></table>${rest ? `<p class="mc-calc-note">${escape(rest)}</p>` : ''}`;
  }

  function costNote(total, note) {
    const read = label => {
      const m = String(note).match(new RegExp(label + '\\s+([\\d.]+,\\d{2})\\s*€', 'i'));
      return m ? Number(m[1].replaceAll('.', '').replace(',', '.')) : null;
    };
    const base = read('Grundgebühr'), transactions = read('Transaktionen'), withdrawals = read('Abhebungen'), card = read('physische Karte') || 0;
    if ([base, transactions, withdrawals].some(v => v === null) || Math.abs(base + transactions + withdrawals + card - total) > .01) return escape(note || '');
    return costTable({base, transactions, withdrawals, card, total}, note);
  }

  function target(product) {
    if (product.mobileTargetGroup) return product.mobileTargetGroup;
    if (!product.targetGroup) return '';
    return 'Tarif für ' + product.targetGroup.replace(' & ', ', ');
  }

  function action(href, label = 'Zum Anbieter', options = {}) {
    if (!href || options.disabled) return `<span class="mc-cta mc-cta--disabled" aria-disabled="true">${escape(label)}</span>`;
    return `<a href="${escape(href)}" target="_blank" rel="${escape(options.rel || 'noopener sponsored')}" class="mc-cta${options.muted ? ' mc-cta--muted' : ''}">${escape(label)}</a>`;
  }

  function review(href, label = 'Testbericht') {
    return href ? `<a href="${escape(href)}" class="mc-review">${escape(label)}</a>` : '';
  }

  function render(root, data, adapter, options = {}) {
    const node = typeof root === 'string' ? document.getElementById(root) : root;
    if (!node) return;
    if (!data.length) {
      node.innerHTML = `<div class="mobile-empty"><p>${escape(options.emptyMessage || 'Keine Anbieter gefunden. Bitte Filter anpassen.')}</p></div>`;
      return;
    }
    node.innerHTML = data.map((product, index) => {
      const card = adapter(product, index), metric = card.metric || {};
      const metricValue = cell(metric.value).value;
      const compact = metric.compact ?? (metricValue.length > 15 || /Variabel|Limit|individuell/i.test(metricValue));
      const cardFeatures = (card.features || []).filter(f => f && f.on !== undefined && f.on !== null);
      const details = (card.details || []).filter(d => d && String(d.html || '').trim());
      const actions = card.actions || '';
      return `<article class="mc-card mc-card--v2 ${card.highlight ? 'highlight' : ''}">
        ${card.badge ? `<span class="mc-badge mc-badge--edge">${escape(card.badge)}</span>` : ''}
        <div class="mc-head"><div class="mc-logo ${escape(card.logoClass || '')}">${card.logo || ''}<span class="mc-rank" aria-label="Platz ${index + 1}">${index + 1}</span></div>
          <div class="mc-head-text"><div class="mc-name">${card.name}</div><div class="mc-meta">${card.meta || ''}</div></div></div>
        <dl class="mc-facts"><div class="mc-fact mc-fact--total"><dt>${escape(metric.label || 'Grundgebühr')}${metric.usage ? `<span class="mc-usage">${escape(metric.usage)}</span>` : ''}</dt>
          <dd class="${metric.free ? 'is-free' : ''}${compact ? ' is-note' : ''}">${metric.value ?? '—'}${metric.period ? `<small>${escape(metric.period)}</small>` : ''}</dd></div>
          ${(card.facts || []).map(f => `<div class="mc-fact ${f.tone === 'promo' ? 'mc-fact--promo has-promo' : ''}"><dt>${escape(f.label)}</dt><dd class="mc-fact-small ${f.tone === 'free' ? 'is-free' : ''}">${f.value}${f.sub ? `<span class="mc-fact-sub">${escape(f.sub)}</span>` : ''}</dd></div>`).join('')}</dl>
        ${cardFeatures.length ? `<ul class="mc-feats" aria-label="Merkmale">${cardFeatures.map(f => `<li class="mc-feat ${f.optional ? 'mc-feat--optional' : f.on ? 'mc-feat--yes' : 'mc-feat--no'}">${f.on ? yes : no}<span>${escape(f.label)}</span><span class="mc-sr">${f.optional ? ': kostenpflichtige Option' : f.on ? ': ja' : ': nein'}</span></li>`).join('')}</ul>` : ''}
        ${details.length ? `<details class="mc-details"><summary>${escape(card.detailsLabel || 'Konditionen & Kosten')}</summary><dl class="mc-detail-list">${details.map(d => `<div class="mc-detail-row"><dt>${escape(d.label)}</dt><dd>${d.html}</dd></div>`).join('')}</dl></details>` : ''}
        <div class="mc-actions${actions.includes('mc-review') ? '' : ' mc-actions--single'}">${actions}</div></article>`;
    }).join('');
  }

  return {render, cell, usage, feature, features, datev, detail, fact, euro, escape, promoEnd, promoFact, promo, tariff, costTable, costNote, target, action, review};
})();
