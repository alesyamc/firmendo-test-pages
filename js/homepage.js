function scrollBusinesskontoFinderIntoView() {
  var finder = document.getElementById('businesskonto-finder');
  if (!finder) return;

  var target = finder.querySelector('.section-header') || finder;
  var nav = document.getElementById('site-nav');
  var navHeight = nav ? nav.getBoundingClientRect().height : 72;
  var breathingRoom = window.matchMedia('(max-width: 700px)').matches ? 18 : 28;
  var targetTop = target.getBoundingClientRect().top + window.pageYOffset;

  window.scrollTo({
    top: Math.max(0, targetTop - navHeight - breathingRoom),
    behavior: 'smooth'
  });
}

(function() {
var heroFinder = document.querySelector('[data-hero-finder]');
if (!heroFinder) return;

var hQ1 = null;
var hContinueBtn = heroFinder.querySelector('[data-hero-action="continue"]');

function setHeroProgressSelected() {
  var dot1 = heroFinder.querySelector('[data-hero-step-dot="1"]');
  var dot2 = heroFinder.querySelector('[data-hero-step-dot="2"]');
  var line1 = heroFinder.querySelector('[data-hero-step-line="1"]');
  if (!dot1 || !dot2 || !line1) return;

  dot1.classList.remove('is-active');
  dot1.classList.add('is-done');
  line1.classList.add('is-done');
  dot2.classList.add('is-active');
}

function handOffToMainFinder() {
  if (!hQ1) return;

  document.dispatchEvent(new CustomEvent('firmendo:heroFinderSelected', {
    detail: { q1: hQ1 }
  }));

  var mainFinder = document.getElementById('businesskonto-finder');
  if (mainFinder) scrollBusinesskontoFinderIntoView();
}

heroFinder.addEventListener('click', function(event) {
  var q1Button = event.target.closest('[data-hero-q1]');
  if (q1Button) {
    hQ1 = q1Button.dataset.heroQ1;
    heroFinder.querySelectorAll('[data-hero-q1]').forEach(function(btn) {
      btn.classList.toggle('is-selected', btn === q1Button);
    });
    hContinueBtn.disabled = false;
    setHeroProgressSelected();
    handOffToMainFinder();
    return;
  }

  var actionButton = event.target.closest('[data-hero-action="continue"]');
  if (actionButton) handOffToMainFinder();
});
})();

(function() {
var fQ1 = null, fQ2 = null;
var fQ1FromHero = false;
var fLogos = {
  'Finom':         '../images/mini-logos/finom.svg',
  'Kontist':       '../images/mini-logos/kontist.png',
  'Holvi':         '../images/mini-logos/holvi.webp',
  'FYRST':         '../images/mini-logos/fyrst.svg',
  'Qonto':         '../images/mini-logos/qonto.png',
  'Vivid Business':'../images/mini-logos/vivid-money.png'
};
var fQ1Labels = {
  einzelunternehmer: 'Freelancer / Selbstständig',
  gruender: 'Gründer / Startup',
  gmbh: 'GmbH oder UG',
  teams: 'Team / Unternehmen'
};
var fDB = {
  einzelunternehmer: {
    kostenlos: [
      { name:'Finom', tag:'Konto & Buchhaltung in einer App', pros:['Solo-Tarif dauerhaft kostenlos','Sofort-IBAN in wenigen Minuten','Rechnungsstellung inklusive'], price:'Solo-Tarif kostenlos', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:true },
      { name:'Kontist', tag:'Speziell für Selbstständige', pros:['Steuervorauszahlungen automatisch berechnet','IBAN sofort – Konto in 8 Minuten','Visa Business Debitkarte inklusive'], price:'Kostenlos im Free-Tarif', affiliate:'https://kontist.com/?ref=firmendo', review:'/kontist-geschaeftskonto/', top:false }
    ],
    buchhaltung: [
      { name:'Finom', tag:'Konto & Buchhaltung in einer App', pros:['DATEV & Lexoffice-Integration','Rechnungsstellung inklusive','Sofort-IBAN in wenigen Minuten'], price:'Solo-Tarif kostenlos', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:true },
      { name:'Kontist', tag:'Automatische Steuerberechnung', pros:['DATEV & Lexoffice inklusive','Steuervorauszahlungen automatisch','Visa Business Debitkarte'], price:'Kostenlos im Free-Tarif', affiliate:'https://kontist.com/?ref=firmendo', review:'/kontist-geschaeftskonto/', top:false }
    ],
    komplett: [
      { name:'Finom', tag:'Konto & Buchhaltung in einer App', pros:['Rechnungsstellung inklusive','DATEV & Lexoffice-Integration','Sofort-IBAN in wenigen Minuten'], price:'Solo-Tarif kostenlos', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:true },
      { name:'Holvi', tag:'All-in-One für Selbstständige', pros:['Buchhaltung & Belege integriert','Rechnungsstellung aus dem Konto','Mehrere Währungen möglich'], price:'Kostenlos im Flex-Tarif', affiliate:'https://holvi.com/?ref=firmendo', review:'/holvi-geschaeftskonto/', top:false }
    ],
    cashback: [
      { name:'Finom', tag:'1 % Cashback auf Kartenzahlungen', pros:['1 % Cashback ab Basic-Tarif','Visa Business Karte inklusive','Sofort-IBAN in wenigen Minuten'], price:'Solo kostenlos · Basic ab 10,99 €/Monat', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:true },
      { name:'Kontist', tag:'Visa Business Debitkarte', pros:['Visa Business Debitkarte','Steuerberechnung automatisch','IBAN sofort verfügbar'], price:'Kostenlos im Free-Tarif', affiliate:'https://kontist.com/?ref=firmendo', review:'/kontist-geschaeftskonto/', top:false }
    ]
  },
  gruender: {
    kostenlos: [
      { name:'FYRST', tag:'Deutsche Bank Tochter – 1. Jahr gratis', pros:['1. Jahr komplett kostenlos','Deutsches IBAN & Bankgarantie','DATEV-Schnittstelle inklusive'], price:'Gratis im 1. Jahr', affiliate:'https://www.fyrst.de/?ref=firmendo', review:'/fyrst-geschaeftskonto/', top:true },
      { name:'Finom', tag:'Sofort startklar für Gründer', pros:['Solo-Tarif dauerhaft kostenlos','Sofort-IBAN in wenigen Minuten','Rechnungsstellung inklusive'], price:'Solo-Tarif kostenlos', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:false }
    ],
    buchhaltung: [
      { name:'FYRST', tag:'DATEV & Buchhaltungs-Integration', pros:['DATEV-Schnittstelle inklusive','Deutsche-Bank-Infrastruktur','Online + Filiale kombinierbar'], price:'Gratis im 1. Jahr', affiliate:'https://www.fyrst.de/?ref=firmendo', review:'/fyrst-geschaeftskonto/', top:true },
      { name:'Finom', tag:'Buchhaltung in einer App', pros:['DATEV & Lexoffice-Integration','Rechnungsstellung inklusive','Belege erfassen & kategorisieren'], price:'Solo-Tarif kostenlos', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:false }
    ],
    komplett: [
      { name:'Finom', tag:'All-in-One für Startups & Gründer', pros:['Rechnungsstellung inklusive','Buchhaltung & Belege in einer App','Sofort-IBAN in wenigen Minuten'], price:'Solo-Tarif kostenlos', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:true },
      { name:'FYRST', tag:'Deutsch, sicher und vollständig', pros:['1. Jahr kostenlos','DATEV inklusive','Online + Filiale kombinierbar'], price:'Gratis im 1. Jahr', affiliate:'https://www.fyrst.de/?ref=firmendo', review:'/fyrst-geschaeftskonto/', top:false }
    ],
    cashback: [
      { name:'Vivid Business', tag:'Cashback & moderne Features', pros:['Cashback auf Kartenzahlungen','Unterkonten für Budgets','Virtuelle Karten verfügbar'], price:'Start-Tarif kostenlos', affiliate:'https://vivid.money/business?ref=firmendo', review:'/vivid-business/', top:true },
      { name:'Finom', tag:'1 % Cashback ab Basic', pros:['1 % Cashback auf Kartenzahlungen','Visa Business Karte','Sofort-IBAN in wenigen Minuten'], price:'Solo kostenlos · Basic ab 10,99 €/Monat', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:false }
    ]
  },
  gmbh: {
    kostenlos: [
      { name:'FYRST', tag:'Deutsche Bank Tochter für GmbH & UG', pros:['Stammkapital-Einzahlung möglich','Deutsche-Bank-Infrastruktur','DATEV-Schnittstelle inklusive'], price:'Ab 6 €/Monat für juristische Personen', affiliate:'https://www.fyrst.de/?ref=firmendo', review:'/fyrst-geschaeftskonto/', top:true },
      { name:'Finom', tag:'Für GmbH, UG & Startups', pros:['2 Nutzer im Basic-Tarif','1 % Cashback auf Kartenzahlungen','Sofort-IBAN in wenigen Minuten'], price:'Basic ab 10,99 €/Monat (zzgl. MwSt.)', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:false }
    ],
    buchhaltung: [
      { name:'Qonto', tag:'DATEV-Integration für GmbH & UG', pros:['DATEV ab höheren Tarifen','Für alle deutschen Rechtsformen','Echtzeit-Benachrichtigungen'], price:'Ab 9 €/Monat (zzgl. MwSt.)', affiliate:'https://qonto.com/?ref=firmendo', review:'/qonto-geschaeftskonto/', top:true },
      { name:'FYRST', tag:'DATEV & Filiale kombinierbar', pros:['DATEV-Schnittstelle inklusive','Stammkapital-Einzahlung möglich','Online + Filiale kombinierbar'], price:'Ab 6 €/Monat', affiliate:'https://www.fyrst.de/?ref=firmendo', review:'/fyrst-geschaeftskonto/', top:false }
    ],
    komplett: [
      { name:'Qonto', tag:'Ideal für GmbH & UG', pros:['Stammkapital-Einzahlung möglich','Echtzeit-Benachrichtigungen','DATEV ab höheren Tarifen'], price:'Ab 9 €/Monat (zzgl. MwSt.)', affiliate:'https://qonto.com/?ref=firmendo', review:'/qonto-geschaeftskonto/', top:true },
      { name:'Finom', tag:'All-in-One für GmbH', pros:['Buchhaltung & Belege integriert','2 Nutzer im Basic-Tarif','Visa Business Karte inklusive'], price:'Basic ab 10,99 €/Monat (zzgl. MwSt.)', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:false }
    ],
    cashback: [
      { name:'Finom', tag:'1 % Cashback für GmbH & UG', pros:['1 % Cashback auf Kartenzahlungen','2 Nutzer im Basic-Tarif inklusive','Visa Business Karte inklusive'], price:'Basic ab 10,99 €/Monat (zzgl. MwSt.)', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:true },
      { name:'Qonto', tag:'Vollständig für GmbH', pros:['Stammkapital-Einzahlung möglich','DATEV-fähig','Strukturierte Kontoführung'], price:'Ab 9 €/Monat (zzgl. MwSt.)', affiliate:'https://qonto.com/?ref=firmendo', review:'/qonto-geschaeftskonto/', top:false }
    ]
  },
  teams: {
    kostenlos: [
      { name:'Vivid Business', tag:'Flexibel für Budgets und Teams', pros:['Start-Tarif dauerhaft kostenlos','Unterkonten für Teambudgets','Virtuelle Karten verfügbar'], price:'Start-Tarif kostenlos', affiliate:'https://vivid.money/business?ref=firmendo', review:'/vivid-business/', top:true },
      { name:'Finom', tag:'2 Nutzer im Basic-Tarif', pros:['2 Nutzer im Basic-Tarif inklusive','1 % Cashback auf Kartenzahlungen','Echtzeit-Benachrichtigungen'], price:'Basic ab 10,99 €/Monat (zzgl. MwSt.)', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:false }
    ],
    buchhaltung: [
      { name:'Qonto', tag:'DATEV & Teamzugänge', pros:['DATEV inklusive ab Smart-Tarif','Admin- und Teamzugänge','1 Unterkonto inklusive'], price:'Smart ab 19 €/Monat (zzgl. MwSt.)', affiliate:'https://qonto.com/?ref=firmendo', review:'/qonto-geschaeftskonto/', top:true },
      { name:'Finom', tag:'Buchhaltung für kleine Teams', pros:['DATEV & Lexoffice-Integration','Buchhaltung & Belege inklusive','2 Nutzer im Basic-Tarif'], price:'Basic ab 10,99 €/Monat (zzgl. MwSt.)', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:false }
    ],
    komplett: [
      { name:'Qonto', tag:'Stark für strukturierte Teams', pros:['Ausgabenrichtlinien & Budgets','Admin- und Teamzugänge','DATEV inklusive ab Smart'], price:'Smart ab 19 €/Monat (zzgl. MwSt.)', affiliate:'https://qonto.com/?ref=firmendo', review:'/qonto-geschaeftskonto/', top:true },
      { name:'Vivid Business', tag:'Unterkonten & virtuelle Karten', pros:['Unterkonten für Teambudgets','Virtuelle Karten verfügbar','Start-Tarif kostenlos'], price:'Start-Tarif kostenlos', affiliate:'https://vivid.money/business?ref=firmendo', review:'/vivid-business/', top:false }
    ],
    cashback: [
      { name:'Finom', tag:'Cashback für Teams', pros:['1 % Cashback auf Kartenzahlungen','Mehrere Nutzer inklusive','Echtzeit-Benachrichtigungen'], price:'Basic ab 10,99 €/Monat (zzgl. MwSt.)', affiliate:'https://finom.co/?ref=firmendo', review:'/finom-geschaeftskonto/', top:true },
      { name:'Vivid Business', tag:'Cashback & Unterkonten', pros:['Cashback ab Prime-Tarif','Unterkonten für Budgets','Virtuelle Karten verfügbar'], price:'Start-Tarif kostenlos', affiliate:'https://vivid.money/business?ref=firmendo', review:'/vivid-business/', top:false }
    ]
  }
};

function fSelectQ1(val, btn) {
  fQ1 = val;
  document.querySelectorAll('#fstep1 .finder-opt').forEach(function(b) { b.classList.remove('selected'); });
  if (btn) btn.classList.add('selected');
  document.getElementById('fbtn1').disabled = false;
  document.getElementById('fresult').hidden = true;
};
function fUpdateQ1Summary() {
  var prefillNote = document.getElementById('finder-prefill-note');
  if (!prefillNote || !fQ1) return;

  var source = prefillNote.querySelector('[data-finder-prefill-source]');
  var label = prefillNote.querySelector('[data-finder-prefill-label]');
  if (source) source.textContent = fQ1FromHero ? 'Aus der Auswahl oben übernommen' : 'Ausgewählt in Schritt 1';
  if (label) label.textContent = fQ1Labels[fQ1] || 'Ihre Auswahl';
  prefillNote.hidden = false;
}
function fSelectQ2(val, btn) {
  fQ2 = val;
  document.querySelectorAll('#fstep2 .finder-opt').forEach(function(b) { b.classList.remove('selected'); });
  if (btn) btn.classList.add('selected');
  document.getElementById('fbtn2').disabled = false;
  document.getElementById('fresult').hidden = true;
};
function fGoStep2() {
  document.getElementById('fstep1').hidden = true;
  var s2 = document.getElementById('fstep2');
  s2.hidden = false;
  document.getElementById('fresult').hidden = true;
  fUpdateQ1Summary();
  document.getElementById('fdot1').className = 'finder-step-dot done';
  document.getElementById('fline1').className = 'finder-step-line done';
  document.getElementById('fdot2').className = 'finder-step-dot active';
  document.getElementById('fline2').className = 'finder-step-line';
  document.getElementById('fdot3').className = 'finder-step-dot pending';
};
function fGoStep1() {
  document.getElementById('fstep2').hidden = true;
  document.getElementById('fstep1').hidden = false;
  document.getElementById('fresult').hidden = true;
  var prefillNote = document.getElementById('finder-prefill-note');
  if (prefillNote) prefillNote.hidden = true;
  document.getElementById('fdot1').className = 'finder-step-dot active';
  document.getElementById('fline1').className = 'finder-step-line';
  document.getElementById('fdot2').className = 'finder-step-dot pending';
  document.getElementById('fline2').className = 'finder-step-line';
  document.getElementById('fdot3').className = 'finder-step-dot pending';
};
function fShowResult() {
  if (!fQ1 || !fQ2) return;
  var recs = fDB[fQ1][fQ2];
  document.getElementById('fstep2').hidden = true;
  document.getElementById('fdot2').className = 'finder-step-dot done';
  document.getElementById('fline2').className = 'finder-step-line done';
  document.getElementById('fdot3').className = 'finder-step-dot done';
  var html = '<div class="finder-result-grid">';
  recs.forEach(function(r) {
    var logoSrc = fLogos[r.name] || '';
    var logoHtml = logoSrc
      ? '<img src="' + logoSrc + '" class="finder-result-logo" alt="' + r.name + '">'
      : '<div class="finder-result-logo finder-result-logo-fallback">' + r.name.charAt(0) + '</div>';
    html += '<div class="finder-result-card' + (r.top ? ' is-top' : '') + '">';
    html += '<span class="finder-result-badge ' + (r.top ? 'top' : 'alt') + '">' + (r.top ? 'Top-Empfehlung' : 'Alternative') + '</span>';
    html += '<div class="finder-result-header">' + logoHtml + '<div><div class="finder-result-name">' + r.name + '</div><div class="finder-result-tag">' + r.tag + '</div></div></div>';
    html += '<ul class="finder-result-pros">' + r.pros.map(function(p) { return '<li>' + p + '</li>'; }).join('') + '</ul>';
    html += '<div class="finder-result-price">Preis: <strong>' + r.price + '</strong></div>';
    html += '<div class="finder-result-trust"><span>Redaktionell geprüft</span><span>Stand: Mai 2026</span><span>Kriterienbasiert</span></div>';
    html += '<div class="finder-result-links">';
    html += '<a href="' + r.affiliate + '" class="finder-link-primary" target="_blank" rel="noopener">Jetzt testen →</a>';
    html += '<a href="' + r.review + '" class="finder-link-secondary">Detailtest lesen</a>';
    html += '</div></div>';
  });
  html += '</div><button class="finder-restart" data-finder-action="restart">← Neu starten</button>';
  var rv = document.getElementById('fresult');
  rv.innerHTML = html;
  rv.hidden = false;
};
function fRestart() {
  fQ1 = null; fQ2 = null;
  fQ1FromHero = false;
  document.getElementById('fresult').hidden = true;
  document.getElementById('fstep1').hidden = false;
  document.getElementById('fstep2').hidden = true;
  var prefillNote = document.getElementById('finder-prefill-note');
  if (prefillNote) prefillNote.hidden = true;
  document.querySelectorAll('.finder-opt').forEach(function(b) { b.classList.remove('selected'); });
  document.getElementById('fbtn1').disabled = true;
  document.getElementById('fbtn2').disabled = true;
  document.getElementById('fdot1').className = 'finder-step-dot active';
  document.getElementById('fdot2').className = 'finder-step-dot pending';
  document.getElementById('fdot3').className = 'finder-step-dot pending';
  document.getElementById('fline1').className = 'finder-step-line';
  document.getElementById('fline2').className = 'finder-step-line';
};

function initFinderControls() {
  const finder = document.querySelector('.section-finder');
  if (!finder) return;

  finder.addEventListener('click', function(event) {
    const q1Button = event.target.closest('[data-finder-q1]');
    if (q1Button) {
      fQ1FromHero = false;
      fSelectQ1(q1Button.dataset.finderQ1, q1Button);
      var prefillNote = document.getElementById('finder-prefill-note');
      if (prefillNote) prefillNote.hidden = true;
      return;
    }

    const q2Button = event.target.closest('[data-finder-q2]');
    if (q2Button) {
      fSelectQ2(q2Button.dataset.finderQ2, q2Button);
      return;
    }

    const actionButton = event.target.closest('[data-finder-action]');
    if (!actionButton) return;

    if (actionButton.dataset.finderAction === 'next') fGoStep2();
    if (actionButton.dataset.finderAction === 'back') fGoStep1();
    if (actionButton.dataset.finderAction === 'result') fShowResult();
    if (actionButton.dataset.finderAction === 'restart') fRestart();
  });

  document.addEventListener('firmendo:heroFinderSelected', function(event) {
    const q1 = event.detail && event.detail.q1;
    if (!q1) return;

    const q1Button = finder.querySelector('[data-finder-q1="' + q1 + '"]');
    if (!q1Button) return;

    fSelectQ1(q1, q1Button);
    fQ1FromHero = true;
    fQ2 = null;
    finder.querySelectorAll('#fstep2 .finder-opt').forEach(function(btn) {
      btn.classList.remove('selected');
    });
    document.getElementById('fbtn2').disabled = true;
    fGoStep2();
  });

  document.addEventListener('click', function(event) {
    const scrollLink = event.target.closest('[data-scroll-to-finder]');
    if (!scrollLink) return;
    event.preventDefault();
    scrollBusinesskontoFinderIntoView();
  });
}

initFinderControls();
})();

(() => {
  function toggleFaq(btn) {
    const item = btn.closest(".faq-item");
    if (!item) return;

    const answer = item.querySelector(".faq-a");
    if (!answer) return;

    const isOpen = item.classList.contains("open");

    const setFaqState = (faqItem, open) => {
      const faqButton = faqItem.querySelector(".faq-q");
      const faqAnswer = faqItem.querySelector(".faq-a");
      if (!faqButton || !faqAnswer) return;

      faqItem.classList.toggle("open", open);
      faqButton.setAttribute("aria-expanded", open ? "true" : "false");
      faqAnswer.hidden = !open;
    };

    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      setFaqState(openItem, false);
    });

    if (!isOpen) {
      setFaqState(item, true);
    }
  }

  window.FirmendoSiteShell = {
    ...(window.FirmendoSiteShell || {}),
    toggleFaq,
  };

  document.querySelectorAll(".faq-q").forEach((button) => {
    button.addEventListener("click", () => toggleFaq(button));
  });
})();

// ── Segment card switcher ──
const segmentTitles = {
  einzelunternehmer: 'Einzelunternehmer',
  gruender: 'Gründer',
  gmbh: 'GmbH & UG',
  teams: 'Teams'
};

function switchSegment(seg, btn) {
  document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const title = segmentTitles[seg] || segmentTitles.einzelunternehmer;
  const titleNode = document.getElementById('segment-title');
  if (titleNode) titleNode.textContent = title;

  const container = document.getElementById('cards-container');
  if (!container) return;

  container.querySelectorAll('[data-segment-card]').forEach(card => {
    card.hidden = card.dataset.segmentCard !== seg;
  });
}

function initSegmentSwitcher() {
  const activeButton = document.querySelector('.seg-btn.active[data-seg]') || document.querySelector('.seg-btn[data-seg]');

  document.addEventListener('click', event => {
    const button = event.target.closest('.seg-btn[data-seg]');
    if (!button) return;
    switchSegment(button.dataset.seg, button);
  });

  if (activeButton) switchSegment(activeButton.dataset.seg, activeButton);
}

initSegmentSwitcher();

// Activate first seg-card by default + handle click toggle
(function() {
  const cards = document.querySelectorAll('.seg-card');
  if (!cards.length) return;
  cards[0].classList.add('active');
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      cards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });
})();
