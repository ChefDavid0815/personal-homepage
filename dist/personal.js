import { t, onLanguageChange } from './i18n.js';
import './motion.js';
import './music.js';

const copyButton = document.querySelector('[data-copy-email]');
const announcement = document.querySelector('#copy-announcement');
copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copyEmail);
    announcement.textContent = t('contact.copied');
  } catch {
    announcement.textContent = t('contact.copyFailed');
  }
});
onLanguageChange(() => { if (announcement) announcement.textContent = ''; });
