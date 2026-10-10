(() => {
  const initChecklistProgress = (checklist) => {
    checklist.querySelectorAll('li').forEach((row) => {
      const icon = row.querySelector(':scope > .check-icon');
      if (!icon || row.querySelector('input[type="checkbox"]')) return;
      icon.remove();
      const label = document.createElement('label');
      label.className = 'check-item';
      const input = document.createElement('input');
      input.type = 'checkbox';
      const box = document.createElement('span');
      box.className = 'check-box';
      box.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      text.className = 'check-text';
      text.append(...row.childNodes);
      label.append(input, box, text);
      row.append(label);
    });
    const checkboxes = Array.from(checklist.querySelectorAll('input[type="checkbox"]'));
    if (!checkboxes.length || checklist.querySelector('.checklist-progress')) return;

    // Upgrade the older flat checklist to the same shared component.
    if (checklist.classList.contains('interactive-checklist')) {
      checklist.classList.remove('interactive-checklist');
      checklist.classList.add('post-checklist', 'post-checklist-compact');
      const list = document.createElement('ul');
      Array.from(checklist.children).forEach((item) => {
        if (!item.matches('label.check-item')) return;
        const row = document.createElement('li');
        row.append(item);
        list.append(row);
      });
      checklist.append(list);
    }

    const progress = document.createElement('div');
    progress.className = 'checklist-progress';
    progress.innerHTML = `
      <div class="checklist-progress-head">
        <span class="checklist-progress-label" aria-live="polite"></span>
        <span class="checklist-progress-percent" aria-hidden="true"></span>
      </div>
      <div class="checklist-progress-track" role="progressbar" aria-label="Checklisten-Fortschritt" aria-valuemin="0" aria-valuemax="${checkboxes.length}" aria-valuenow="0">
        <div class="checklist-progress-fill"></div>
      </div>`;
    checklist.append(progress);

    const label = progress.querySelector('.checklist-progress-label');
    const percent = progress.querySelector('.checklist-progress-percent');
    const track = progress.querySelector('.checklist-progress-track');
    const fill = progress.querySelector('.checklist-progress-fill');

    const update = () => {
      const active = checkboxes.filter((checkbox) => !checkbox.disabled && !checkbox.closest('[hidden]'));
      const checked = active.filter((checkbox) => checkbox.checked).length;
      const total = active.length;
      const complete = total > 0 && checked === total;
      const percentage = total ? Math.round((checked / total) * 100) : 0;

      label.textContent = complete
        ? `Geschafft! ${checked} von ${total} erledigt 🎉`
        : `${checked} von ${total} erledigt`;
      percent.textContent = `${percentage} %`;
      fill.style.width = `${percentage}%`;
      track.setAttribute('aria-valuemax', String(total));
      track.setAttribute('aria-valuenow', String(checked));
      track.setAttribute('aria-valuetext', `${checked} von ${total} erledigt`);
      progress.classList.toggle('is-complete', complete);
    };

    checkboxes.forEach((checkbox) => checkbox.addEventListener('change', update));
    const observer = new MutationObserver(update);
    observer.observe(checklist, { subtree: true, attributes: true, attributeFilter: ['hidden', 'disabled'] });
    update();
  };

  const init = () => {
    document.querySelectorAll('.post-checklist, .interactive-checklist, [data-checklist-progress]').forEach(initChecklistProgress);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
