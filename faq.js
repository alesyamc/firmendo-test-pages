(function () {
  function getQuestion(item) {
    return item ? item.querySelector('.faq-q') : null;
  }

  function getAnswer(item) {
    return item ? item.querySelector('.faq-a') : null;
  }

  function closeItem(item) {
    const question = getQuestion(item);
    item.classList.remove('open');
    if (question) question.setAttribute('aria-expanded', 'false');
  }

  function openItem(item) {
    const question = getQuestion(item);
    item.classList.add('open');
    if (question) question.setAttribute('aria-expanded', 'true');
  }

  function setupFaq() {
    document.querySelectorAll('.faq-item').forEach((item, index) => {
      const question = getQuestion(item);
      const answer = getAnswer(item);
      if (!question || !answer) return;

      if (question.tagName === 'BUTTON' && !question.hasAttribute('type')) {
        question.setAttribute('type', 'button');
      }

      if (question.tagName !== 'BUTTON') {
        question.setAttribute('role', 'button');
        question.setAttribute('tabindex', '0');
      }

      if (!answer.id) {
        answer.id = `faq-answer-${index + 1}`;
      }

      question.setAttribute('aria-controls', answer.id);
      question.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');

      const icon = question.querySelector('.faq-q-icon');
      if (icon) icon.setAttribute('aria-hidden', 'true');
    });
  }

  function toggleItem(question) {
    const item = question.closest('.faq-item');
    if (!item) return;

    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(closeItem);

    if (!wasOpen) {
      openItem(item);
    }
  }

  document.addEventListener('DOMContentLoaded', setupFaq);

  document.addEventListener('click', (event) => {
    const question = event.target.closest('.faq-q');
    if (!question) return;

    event.preventDefault();
    toggleItem(question);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const question = event.target.closest('.faq-q');
    if (!question) return;

    event.preventDefault();
    toggleItem(question);
  });
})();
