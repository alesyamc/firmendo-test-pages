/* Auswahl bleibt lokal; die vorhandenen Konto-, Dokument- und Checklisten-Inhalte
   sind ohne JavaScript vollständig verfügbar. */
(() => {
  'use strict';
  const form = document.getElementById('opening-choice');
  if (!form) return;
  const legal = document.getElementById('opening-form');
  const stage = document.getElementById('opening-stage');
  const accounts = [...document.querySelectorAll('[data-opening-forms]')];
  const documents = [...document.querySelectorAll('[data-document-forms]')];
  const checks = [...document.querySelectorAll('[data-check-forms]')];
  const matches = (tokens, value) => value === 'all' || tokens.split(' ').includes(value) || tokens === 'all';
  function update() {
    const type = legal.value;
    const phase = stage.value;
    const corporate = type === 'gmbh' || type === 'ug';
    let count = 0;
    const providers = new Set();
    accounts.forEach(row => {
      const phaseFits = !(row.dataset.openingStage === 'active' && (corporate || type === 'all') && (phase === 'founding' || phase === 'plan'));
      row.hidden = !matches(row.dataset.openingForms, type) || !phaseFits || (corporate && phase === 'plan');
      if (!row.hidden) {
        count++;
        providers.add(row.querySelector('.opening-review').getAttribute('href'));
      }
    });
    document.getElementById('opening-result').textContent = `${count} ${count === 1 ? 'Tarifvariante' : 'Tarifvarianten'} von ${providers.size} ${providers.size === 1 ? 'Anbieter' : 'Anbietern'}. ${type === 'all' ? 'Wählen Sie Ihre Rechtsform und Ihren Gründungsstand.' : 'Auswahl: ' + legal.options[legal.selectedIndex].text + ', ' + stage.options[stage.selectedIndex].text + '.'}`;
    document.getElementById('opening-empty').hidden = count > 0 || (corporate && phase === 'plan');
    const note = document.getElementById('opening-stage-note');
    note.hidden = !(corporate && phase !== 'active' && phase !== 'all');
    note.textContent = phase === 'plan'
      ? 'Bereiten Sie zunächst die notarielle Gründung und Ihre Unterlagen vor. Für das Konto der GmbH oder UG in Gründung benötigen Sie die beurkundeten Gründungsunterlagen. Wählen Sie nach dem Notartermin „In Gründung“, um passende Konten zu sehen.'
      : 'Die Auswahl zeigt Konten für die GmbH oder UG in Gründung. Kapital einzahlen und den Nachweis für das Notariat anfordern sind eigene Schritte nach dem Kontoantrag.';
    const phaseMatches = value => value === 'all' || phase === 'all' || (phase === 'active' ? value === 'active' : value === 'founding');
    documents.forEach(row => {
      row.hidden = !matches(row.dataset.documentForms, type) || !phaseMatches(row.dataset.documentStage);
    });
    checks.forEach(row => {
      row.hidden = !matches(row.dataset.checkForms, type) || !phaseMatches(row.dataset.checkStage);
    });
    document.getElementById('opening-documents-note').textContent = type === 'other'
      ? 'Für andere Rechtsformen klären Sie die benötigten Unternehmensnachweise direkt mit der Bank. Die allgemeine Checkliste bleibt verfügbar.'
      : 'Unterlagen für: ' + legal.options[legal.selectedIndex].text + ', ' + stage.options[stage.selectedIndex].text + '. Die Bank kann weitere Nachweise anfordern.';
  }
  form.addEventListener('change', update);
  form.addEventListener('reset', () => requestAnimationFrame(update));
  form.addEventListener('submit', event => event.preventDefault());
  update();
})();
