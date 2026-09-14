(() => {
  const initChecklistProgress = (checklist) => {
    const checkboxes = Array.from(checklist.querySelectorAll('input[type="checkbox"]'));
    if (!checkboxes.length || checklist.querySelector('.checklist-progress')) return;

    const progress = document.createElement('div');
    progress.className = 'checklist-progress';
    progress.innerHTML = `
      <div class="checklist-progress-head">
        <span class="checklist-progress-label" aria-live="polite"></span>
        <span class="checklist-progress-percent" aria-hidden="true"></span>
      </div>
      <div class="checklist-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${checkboxes.length}" aria-valuenow="0">
        <div class="checklist-progress-fill"></div>
      </div>`;
    checklist.append(progress);

    const label = progress.querySelector('.checklist-progress-label');
    const percent = progress.querySelector('.checklist-progress-percent');
    const track = progress.querySelector('.checklist-progress-track');
    const fill = progress.querySelector('.checklist-progress-fill');

    const update = () => {
      const checked = checkboxes.filter((checkbox) => checkbox.checked).length;
      const total = checkboxes.length;
      const complete = checked === total;
      const percentage = Math.round((checked / total) * 100);

      label.textContent = complete
        ? `Geschafft! ${checked} von ${total} erledigt 🎉`
        : `${checked} von ${total} erledigt`;
      percent.textContent = `${percentage} %`;
      fill.style.width = `${percentage}%`;
      track.setAttribute('aria-valuenow', String(checked));
      track.setAttribute('aria-valuetext', `${checked} von ${total} erledigt`);
      progress.classList.toggle('is-complete', complete);
    };

    checkboxes.forEach((checkbox) => checkbox.addEventListener('change', update));
    update();
  };

  const init = () => {
    document.querySelectorAll('[data-checklist-progress]').forEach(initChecklistProgress);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
