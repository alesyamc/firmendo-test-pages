function compareHighlightFirst(a, b) {
  if (a.highlight && !b.highlight) return -1;
  if (!a.highlight && b.highlight) return 1;
  return 0;
}

function fdGetValue(id) {
  return document.getElementById(id)?.dataset.value || '';
}

const fdValueModes = {
  sortHasValue: Object.freeze({ sortHasValue: true })
};

function fdSetValue(id, value, label, options = {}) {
  const {
    labelMode = 'auto',
    selectFallback = false,
    syncAria = true,
    sortHasValue = false
  } = options;

  const el = document.getElementById(id);
  if (!el) return;

  const optionList = Array.from(el.querySelectorAll('.fd-option'));
  const selectedOption =
    optionList.find(option => (option.dataset.value || '') === value) ||
    (selectFallback ? optionList[0] : null);
  const nextValue = selectedOption ? (selectedOption.dataset.value || '') : value;

  el.dataset.value = nextValue;

  const triggerText = el.querySelector('.fd-trigger-text');
  const optionLabel = selectedOption ? selectedOption.innerHTML.trim() : undefined;
  const nextLabel = label !== undefined ? label : optionLabel;

  if (triggerText && nextLabel !== undefined) {
    const shouldRenderHtml =
      labelMode === 'html' ||
      (labelMode === 'auto' && (
        /<[^>]+>/.test(nextLabel) ||
        /&(?:[a-zA-Z]+|#\d+|#x[\da-fA-F]+);/.test(nextLabel) ||
        Boolean(selectedOption?.children.length)
      ));

    if (shouldRenderHtml) triggerText.innerHTML = nextLabel;
    else triggerText.textContent = nextLabel;
  }

  optionList.forEach(option => {
    const selected = selectedOption ? option === selectedOption : (option.dataset.value || '') === nextValue;
    option.classList.toggle('selected', selected);
    if (syncAria) option.setAttribute('aria-selected', selected ? 'true' : 'false');
  });

  el.classList.toggle('has-value', nextValue !== '' && (sortHasValue || id !== 'fd-sort'));
}

function fdCloseDropdowns(except = null) {
  document.querySelectorAll('.fd.open').forEach(fd => {
    if (fd === except) return;
    fd.classList.remove('open');
    fd.querySelector('.fd-trigger')?.setAttribute('aria-expanded', 'false');
  });
}

function fdInitControls(options = {}) {
  const {
    selector = '.fd',
    label,
    valueOptions,
    onSort,
    onFilter,
    onChange
  } = options;

  document.querySelectorAll(selector).forEach(fd => {
    const trigger = fd.querySelector('.fd-trigger');
    const menu = fd.querySelector('.fd-menu');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', event => {
      event.stopPropagation();
      const willOpen = !fd.classList.contains('open');
      fdCloseDropdowns(fd);
      fd.classList.toggle('open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    menu.querySelectorAll('.fd-option').forEach(option => {
      option.addEventListener('click', event => {
        event.stopPropagation();
        const nextValue = option.dataset.value || '';
        const nextLabel = typeof label === 'function' ? label(option, fd) : undefined;
        const nextOptions = typeof valueOptions === 'function' ? valueOptions(fd, option) : valueOptions;

        fdSetValue(fd.id, nextValue, nextLabel, nextOptions || undefined);
        fd.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');

        const detail = { fd, option, value: fd.dataset.value || '', isSort: fd.id === 'fd-sort' };
        if (typeof onChange === 'function') {
          onChange(detail);
        } else if (detail.isSort && typeof onSort === 'function') {
          onSort(detail);
        } else if (!detail.isSort && typeof onFilter === 'function') {
          onFilter(detail);
        }
      });
    });
  });

  if (document.documentElement.dataset.fdControlsBound === 'true') return;
  document.documentElement.dataset.fdControlsBound = 'true';

  document.addEventListener('click', event => {
    if (event.target.closest('.fd')) return;
    fdCloseDropdowns();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') fdCloseDropdowns();
  });
}

function updateTableScrollState(options = {}) {
  const {
    tableId = 'tableWrap',
    shellId = 'tableScrollWrap',
    hintId = 'scrollHint',
    scrollThreshold = 2,
    startOffset = 2,
    endOffset = 8,
    trackEnd = true,
    endWhenNotScrollable = false,
    hintMode = 'until-end'
  } = options;

  const tableWrap = document.getElementById(tableId);
  const scrollWrap = document.getElementById(shellId);
  const scrollHint = document.getElementById(hintId);
  if (!tableWrap || !scrollWrap) return;

  const scrollable = tableWrap.scrollWidth > tableWrap.clientWidth + scrollThreshold;
  const atStart = tableWrap.scrollLeft <= startOffset;
  const atEnd = tableWrap.scrollLeft + tableWrap.clientWidth >= tableWrap.scrollWidth - endOffset;

  scrollWrap.classList.toggle('scrollable', scrollable);
  scrollWrap.classList.toggle('at-start', endWhenNotScrollable ? (!scrollable || atStart) : atStart);
  if (trackEnd) scrollWrap.classList.toggle('at-end', endWhenNotScrollable ? (!scrollable || atEnd) : atEnd);

  if (!scrollHint) return;
  const hintVisible =
    hintMode === 'while-scrollable' ? scrollable :
    hintMode === 'at-start' ? (scrollable && atStart) :
    (scrollable && !atEnd);
  scrollHint.classList.toggle('visible', hintVisible);
}
