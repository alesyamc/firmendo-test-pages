document.querySelectorAll('[data-review-plan-tabs]').forEach((tabs) => {
  const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]'));
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  function activateTab(nextTab, moveFocus = false) {
    tabButtons.forEach((tabButton) => {
      const isActive = tabButton === nextTab;
      tabButton.setAttribute('aria-selected', String(isActive));
      tabButton.tabIndex = isActive ? 0 : -1;
    });

    tabPanels.forEach((panel) => {
      panel.hidden = panel.id !== nextTab.getAttribute('aria-controls');
    });

    if (moveFocus) nextTab.focus();
  }

  tabButtons.forEach((tabButton, index) => {
    tabButton.addEventListener('click', () => activateTab(tabButton));
    tabButton.addEventListener('keydown', (event) => {
      let nextIndex = index;

      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabButtons.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabButtons.length - 1;
      else return;

      event.preventDefault();
      activateTab(tabButtons[nextIndex], true);
    });
  });
});
