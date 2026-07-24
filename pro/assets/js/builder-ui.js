(() => {
  'use strict';
  const workspace = document.querySelector('.builder-workspace');
  const modeButtons = document.querySelectorAll('[data-builder-mode]');
  modeButtons.forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.builderMode;
    modeButtons.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-selected', String(item === button)); });
    workspace?.classList.toggle('flow-mode', mode === 'flow');
  }));
  document.querySelector('[data-return-single]')?.addEventListener('click', () => document.querySelector('[data-builder-mode="single"]')?.click());
  document.querySelectorAll('[data-device]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-device]').forEach(item => item.classList.toggle('active', item === button));
    const phone = document.querySelector('.wa-phone');
    if (phone) phone.style.maxWidth = button.dataset.device === 'compact' ? '310px' : '360px';
  }));
  document.querySelectorAll('[data-theme]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-theme]').forEach(item => item.classList.toggle('active', item === button));
    const canvas = document.querySelector('.preview-canvas');
    if (canvas) canvas.style.filter = button.dataset.theme === 'dark' ? 'brightness(.78) contrast(1.08)' : '';
  }));
  const countFilled = () => {
    const fields = [...document.querySelectorAll('.builder-workspace input, .builder-workspace select, .builder-workspace textarea')].filter(el => el.type !== 'hidden');
    const filled = fields.filter(el => String(el.value).trim()).length;
    const percent = fields.length ? Math.round((filled / fields.length) * 100) : 0;
    const bar = document.querySelector('.progress-value'); const label = document.querySelector('[data-progress-label]');
    if (bar) bar.style.width = `${percent}%`; if (label) label.textContent = `${percent}% complete`;
  };
  document.querySelector('.builder-workspace')?.addEventListener('input', countFilled);
  document.querySelector('[data-scroll-preview]')?.addEventListener('click', () => document.querySelector('.preview-panel')?.scrollIntoView({behavior:'smooth',block:'start'}));
  countFilled();
})();