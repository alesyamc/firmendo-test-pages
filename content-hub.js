async function nlSubmit(){
  const email = document.getElementById('nlEmail').value.trim();
  const btn = document.getElementById('nlBtn');
  const msg = document.getElementById('nlMsg');

  function showNlMsg(type, text) {
    msg.classList.remove('nl-msg-success', 'nl-msg-error');
    msg.classList.add(`nl-msg-${type}`);
    msg.textContent = text;
    msg.hidden = false;
  }

  if(!email || !email.includes('@')){
    showNlMsg('error', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Wird angemeldet…';

  showNlMsg('error', 'Newsletter-Anmeldung ist in der Testversion deaktiviert.');
  btn.disabled = false;
  btn.textContent = 'Anmelden →';
}

document.getElementById('nlEmail').addEventListener('keydown', e => {
  if(e.key === 'Enter') nlSubmit();
});

/* =======================================================
   POSTS — neuen Artikel oben einfügen, neueste zuerst
   ======================================================= */
const POSTS = [
  {id:6,  title:"5 Finanzfehler von Einzelunternehmern – und wie Sie sie vermeiden",  excerpt:"Kein Geschäftskonto, keine Steuerrücklagen, verspätete Rechnungen: Diese fünf Fehler kosten Selbstständige Zeit, Geld und Nerven – und lassen sich leicht vermeiden.",  category:"finanzen", catLabel:"Finanzen",     author:"RF", authorName:"Redaktion Firmendo",  readTime:"6 Min.",  date:"17. März 2026", icon:"📊", href:"/5-finanzfehler-einzelunternehmer/",                   image:"../images/ratgeber/finanzfehler-einzelunternehmer.webp"},
  {id:5,  title:"Rechnung schreiben 2026: Alle Pflichtangaben auf einen Blick",       excerpt:"Was muss auf eine Rechnung? Alle Pflichtangaben, häufige Fehler und eine Schritt-für-Schritt-Anleitung für Gründer, Freelancer und Selbstständige.",                        category:"rechnung", catLabel:"Rechnungen",   author:"RF", authorName:"Redaktion Firmendo",   readTime:"8 Min.",  date:"17. März 2026", icon:"🧾", href:"/rechnungen-schreiben-selbststaendige/",         image:"../images/ratgeber/rechnungen-schreiben-selbststaendige.webp"},
  {id:4,  title:"Geschäftskontokosten absetzen – was ist steuerlich möglich?",        excerpt:"Kontoführungsgebühren, Transaktionskosten und Kreditkartengebühren können als Betriebsausgaben abgesetzt werden. So geht es richtig.",                                       category:"steuer",   catLabel:"Steuer & Recht", author:"RF", authorName:"Redaktion Firmendo",  readTime:"8 Min.",  date:"17. März 2026", icon:"💰", href:"/geschaeftskonto-kosten-absetzen/",      image:"../images/ratgeber/geschaeftskonto-kosten-absetzen.webp"},
  {id:3,  title:"Geschäftskonto kündigen: So wechseln Sie sicher und ohne Verluste",  excerpt:"Sie möchten das Geschäftskonto wechseln? So kündigen Sie korrekt, vermeiden typische Fehler und behalten den Überblick über laufende Zahlungen.",                         category:"konto",    catLabel:"Konto",        author:"RF", authorName:"Redaktion Firmendo",   readTime:"7 Min.",  date:"17. März 2026", icon:"🏦", href:"/geschaeftskonto-kuendigen/",            image:"../images/ratgeber/geschaeftskonto-kuendigen.webp"},
  {id:2,  title:"Krankenversicherung für Selbstständige: GKV oder PKV?",              excerpt:"Wer sich selbstständig macht, muss die Krankenversicherung selbst wählen. Alle Modelle, Kosten und Entscheidungshilfen im Überblick.",                                       category:"versich",  catLabel:"Versicherung", author:"RF", authorName:"Redaktion Firmendo",  readTime:"8 Min.",  date:"17. März 2026", icon:"🏥", href:"/krankenversicherung-selbststaendige/",                  image:"../images/ratgeber/krankenversicherung-selbststaendige.webp"},
  {id:1,  title:"Kleinunternehmerregelung 2026: Wann sie sich lohnt – und wann nicht", excerpt:"Ab 2025 gilt eine neue Umsatzgrenze. Was sich geändert hat, wann die Regelung sinnvoll ist und wie Sie den Antrag richtig stellen.",                                       category:"steuer",   catLabel:"Steuer & Recht", author:"RF", authorName:"Redaktion Firmendo",  readTime:"7 Min.", date:"17. März 2026", icon:"📋", href:"/kleinunternehmerregelung-2026/",             image:"../images/ratgeber/kleinunternehmerregelung-2026.webp"},
];

const BENTO_COUNT = 4;
const LIST_INIT  = 0;
const LIST_MORE  = 8;
const FILTER_INIT = 4;

let activeFilter='all', searchQ='', shown=LIST_INIT;

function resetShown() {
  shown = activeFilter === 'all' && searchQ === '' ? LIST_INIT : FILTER_INIT;
}

function getFiltered() {
  return POSTS.filter(p =>
    (activeFilter==='all' || p.category===activeFilter) &&
    (searchQ==='' || p.title.toLowerCase().includes(searchQ) || p.excerpt.toLowerCase().includes(searchQ) || p.catLabel.toLowerCase().includes(searchQ))
  );
}

function photoZone(p, extraClass) {
  if (p.image) {
    return `<div class="card-photo ${extraClass||''}"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>`;
  }
  return `<div class="card-photo card-photo-fallback v-${p.category} ${extraClass||''}">${p.icon}</div>`;
}

function catBadge(p){ return `<span class="card-cat c-${p.category}">${p.catLabel}</span>`; }
function footer(p){ return `<div class="card-footer"><div class="card-author"><div class="mini-av">${p.author}</div></div><div class="card-time"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${p.readTime}</div><span class="card-sep">·</span><span class="card-date">${p.date}</span></div>`; }

function heroCard(p){
  const visual = p.image
    ? `<div class="hp-visual"><img src="${p.image}" alt="${p.title}"></div>`
    : `<div class="hp-visual hp-visual-fallback v-${p.category}"><div class="hp-fallback-icon">${p.icon}</div></div>`;
  return `<a href="${p.href}" class="hero-post">
    ${visual}
    <div class="hp-overlay"></div>
    <div class="hp-content">
      <div class="hp-badge">${p.catLabel}</div>
      <div class="hp-title">${p.title}</div>
      <div class="hp-excerpt">${p.excerpt}</div>
      <div class="hp-meta">
        <div class="hp-meta-left"><div class="av">${p.author}</div><strong>${p.authorName}</strong><span>·</span><span>${p.date}</span><span>·</span><span>${p.readTime}</span></div>
        <div class="hp-cta">Artikel lesen <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
      </div>
    </div>
  </a>`;
}

function stdCard(p){
  return `<a href="${p.href}" class="post-card">
    ${photoZone(p)}
    <div class="card-body">${catBadge(p)}<div class="card-title">${p.title}</div><div class="card-excerpt">${p.excerpt}</div>${footer(p)}</div>
  </a>`;
}

function listCard(p){
  const photo = p.image
    ? `<div class="list-photo"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>`
    : `<div class="list-photo list-photo-fallback v-${p.category}">${p.icon}</div>`;
  return `<a href="${p.href}" class="list-card">
    ${photo}
    <div class="list-body">
      <div class="list-title">${p.title}</div>
      <div class="list-meta">
        <span class="list-cat-badge c-${p.category}">${p.catLabel}</span>
        <span class="list-meta-text"><span>${p.readTime}</span><span>·</span><span>${p.date}</span></span>
      </div>
    </div>
  </a>`;
}

function filterCard(p){
  return `<a href="${p.href}" class="fcard">
    ${photoZone(p, 'fcard-photo')}
    <div class="fcard-top">
      <span class="fcard-cat c-${p.category}">${p.catLabel}</span>
      <div class="fcard-title">${p.title}</div>
      <div class="fcard-excerpt">${p.excerpt}</div>
    </div>
    <div class="fcard-bottom">
      <div class="fcard-meta"><div class="fcard-av">${p.author}</div><span>${p.readTime}</span><span>·</span><span>${p.date}</span></div>
      <div class="fcard-read">Artikel lesen <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
    </div>
  </a>`;
}

function render(animate){
  const posts = getFiltered();
  const area = document.getElementById('contentArea');
  const empty = document.getElementById('emptyState');
  const loadArea = document.getElementById('loadArea');
  const progText = document.getElementById('progText');
  const loadBtn = document.getElementById('loadBtn');

  document.getElementById('totalCount').textContent = POSTS.length;

  if(!posts.length){
    area.innerHTML=''; empty.hidden = false; loadArea.hidden = true; return;
  }
  empty.hidden = true;
  loadArea.hidden = false;
  let html='';

  if(activeFilter==='all' && searchQ===''){
    // ── EDITORIAL LAYOUT ──
    const bentoPosts = posts.slice(0, BENTO_COUNT);
    const listPosts  = posts.slice(BENTO_COUNT, BENTO_COUNT + shown);

    html += heroCard(bentoPosts[0]);

    if(bentoPosts.length > 1){
      html += `<div class="sec-div sec-div-tight"><span class="sec-div-title">Alle Artikel</span><span class="sec-div-line"></span><span class="sec-div-pill">${posts.length} Artikel</span></div>`;
      html += '<div class="bento">';
      if(bentoPosts[1]){ html += `<div>${stdCard(bentoPosts[1])}</div>`; }
      if(bentoPosts[2]){ html += `<div>${stdCard(bentoPosts[2])}</div>`; }
      if(bentoPosts[3]){ html += `<div>${stdCard(bentoPosts[3])}</div>`; }
      html += '</div>';
    }

    if(listPosts.length > 0){
      html += `<div class="sec-div"><span class="sec-div-title">Weitere Artikel</span><span class="sec-div-line"></span></div>`;
      html += '<div class="posts-list" id="listRow">';
      listPosts.forEach(p => { html += listCard(p); });
      html += '</div>';
    }

    // load more logic für die Liste
    const totalList = posts.length - BENTO_COUNT;
    const shownList = listPosts.length;
    if(shownList < totalList){
      loadBtn.hidden = false;
      progText.textContent = `${shownList} von ${totalList} weiteren Artikeln`;
    } else {
      loadBtn.hidden = true;
      progText.textContent = totalList > 0 ? `Alle ${totalList} weiteren Artikel geladen` : '';
    }

  } else {
    // ── FILTERED / SEARCH VIEW ──
    const vis = posts.slice(0, shown);
    const count = posts.length;
    html += `<div class="sec-div"><span class="sec-div-title">${count === 1 ? '1 Ergebnis' : count + ' Ergebnisse'}</span><span class="sec-div-line"></span></div>`;
    html += `<div class="filter-grid">`;
    vis.forEach(p => { html += filterCard(p); });
    html += '</div>';

    if(shown >= posts.length){
      loadBtn.hidden = true;
      progText.textContent = count > 1 ? `Alle ${count} Artikel geladen` : '';
    } else {
      loadBtn.hidden = false;
      progText.textContent = `${vis.length} von ${count} Artikeln`;
    }
  }

  area.innerHTML = html;
  if(animate){ area.querySelectorAll('.post-card,.list-card,.hero-post,.fcard').forEach((el,i)=>{ el.classList.add('anim', `anim-stagger-${Math.min(i, 12)}`); }); }
}

function loadMore(){
  const btn=document.getElementById('loadBtn');
  btn.classList.add('is-loading');
  btn.innerHTML=`<svg class="load-spinner" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Wird geladen…`;
  setTimeout(()=>{
    const prevShown = shown;
    const total = activeFilter==='all' && searchQ===''
      ? getFiltered().length - BENTO_COUNT
      : getFiltered().length;
    shown = Math.min(shown + LIST_MORE, total);
    render(false);
    // анимируем только новые карточки
    const list = document.getElementById('listRow');
    if(list){
      const cards = list.querySelectorAll('.list-card');
      cards.forEach((el, i) => {
        if(i >= prevShown){
          el.classList.add('list-card-new');
          setTimeout(()=>{ el.classList.add('list-card-visible'); }, (i - prevShown) * 60);
        }
      });
    }
    btn.classList.remove('is-loading');
    btn.innerHTML=`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg> Weitere Artikel laden`;
  }, 480);
}

document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter=btn.dataset.filter; resetShown(); render(false);
  });
});

let t;
document.getElementById('searchInput').addEventListener('input', e=>{
  clearTimeout(t);
  t=setTimeout(()=>{ searchQ=e.target.value.trim().toLowerCase(); resetShown(); render(false); },220);
});

render(false);
document.getElementById('loadBtn')?.addEventListener('click', loadMore);
document.getElementById('nlBtn')?.addEventListener('click', nlSubmit);
