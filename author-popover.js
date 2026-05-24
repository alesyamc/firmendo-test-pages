(() => {
  function closeAuthorPopovers(exceptPopover) {
    document.querySelectorAll('.author-popover.visible').forEach((popover) => {
      if (popover !== exceptPopover) {
        popover.classList.remove('visible');
      }
    });

    document.querySelectorAll('.author-pop-trigger[aria-expanded="true"]').forEach((trigger) => {
      const controlledPopover = trigger.getAttribute('aria-controls');
      if (!exceptPopover || controlledPopover !== exceptPopover.id) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function findAuthorPopover(trigger) {
    const wrap = trigger.closest('.author-popover-wrap');
    if (wrap) {
      const scopedPopover = wrap.querySelector('.author-popover');
      if (scopedPopover) return scopedPopover;
    }

    const controlledId = trigger.getAttribute('aria-controls');
    if (controlledId) return document.getElementById(controlledId);

    return document.getElementById('author-popover');
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.author-pop-trigger');

    if (trigger) {
      const popover = findAuthorPopover(trigger);
      if (!popover) return;

      event.preventDefault();
      const shouldOpen = !popover.classList.contains('visible');
      closeAuthorPopovers(popover);
      popover.classList.toggle('visible', shouldOpen);
      trigger.setAttribute('aria-expanded', String(shouldOpen));
      return;
    }

    if (!event.target.closest('.author-popover-wrap')) {
      closeAuthorPopovers();
    }
  });

  document.addEventListener('keydown', (event) => {
    const trigger = event.target.closest?.('.author-pop-trigger');
    if (trigger && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      trigger.click();
      return;
    }

    if (event.key === 'Escape') {
      closeAuthorPopovers();
    }
  });
})();
