/* A one-day, reversible layer. The original site remains the default. */
(function () {
  const festivalDay = '2026-09-25';
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const dubaiDay = date => {
    const parts = Object.fromEntries(formatter.formatToParts(date).map(part => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  };
  const isActive = date => dubaiDay(date) === festivalDay;
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const originalThemeColor = themeColor?.content;
  const favicon = document.querySelector('link[rel="icon"]');
  const originalFavicon = favicon?.href;
  const moonFavicon = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#101933"/><circle cx="33" cy="31" r="20" fill="#ffe4a4"/><circle cx="25" cy="22" r="3" fill="#cfb986" opacity=".6"/><circle cx="42" cy="36" r="5" fill="#cfb986" opacity=".45"/><path d="m10 11 2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#f67caf"/></svg>')}`;
  let mounted = false;

  function setLanguage() {
    const en = root.lang.startsWith('en');
    document.querySelectorAll('[data-moon-zh][data-moon-en]').forEach(node => {
      node.textContent = node.dataset[en ? 'moonEn' : 'moonZh'];
    });
    const section = document.querySelector('.midautumn-celebration');
    if (section) section.setAttribute('aria-label', en ? 'Mid-Autumn Festival, one-day edition' : '中秋佳节，一日限定皮肤');
  }

  function mount() {
    if (!document.body || mounted || !isActive(new Date())) return;
    const header = document.querySelector('.site-header');
    if (!header) return;
    mounted = true;
    const section = document.createElement('section');
    section.className = 'midautumn-celebration';
    section.innerHTML = `
      <div class="moon-backdrop" aria-hidden="true"></div>
      <div class="moon-sky" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="moon-stage" aria-hidden="true">
        <div class="moon-corona"></div><div class="moon-orbit moon-orbit--outer"></div><div class="moon-orbit moon-orbit--inner"></div>
        <div class="moon-fallback"></div><canvas class="moon-canvas"></canvas>
        <span class="moon-coordinates">MOON / 25° N · 55° E</span>
      </div>
      <div class="moon-lantern moon-lantern--one" aria-hidden="true"><i></i><b></b></div>
      <div class="moon-lantern moon-lantern--two" aria-hidden="true"><i></i><b></b></div>
      <div class="moon-lantern moon-lantern--three" aria-hidden="true"><i></i><b></b></div>
      <div class="moon-copy">
        <p class="moon-eyebrow"><span class="moon-spark">✦</span> CHEFZC / MOON FESTIVAL 2026 <span>·</span> 09.25</p>
        <h2><span data-moon-zh="今夜，月亮上线。" data-moon-en="THE MOON IS ONLINE."></span><em>FULL MOON <b>✳</b> FULL HEART</em></h2>
        <p class="moon-description" data-moon-zh="把满月、花灯和一点波普色彩，挂进我的数字宇宙。愿这束光，也照到你那边。" data-moon-en="A full moon, floating lanterns and a burst of pop colour in my digital universe. May this light find you, too."></p>
        <a class="moon-post-link" href="./post.html?article=midautumn"><span data-moon-zh="翻开中秋随笔" data-moon-en="READ THE MOON NOTE"></span><span aria-hidden="true">↗</span></a>
      </div>
      <div class="moon-edition" aria-hidden="true"><span>ONE NIGHT</span><b>25</b><span>SEPT / DUBAI</span></div>
      <div class="moon-bottom" aria-hidden="true"><span>月亮照见远方，也照见此刻。</span><span>THE MID-AUTUMN EDITION ✦ 仅此一天</span></div>`;
    header.after(section);
    const stage = section.querySelector('.moon-stage');
    stage.addEventListener('pointermove', event => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = stage.getBoundingClientRect();
      stage.style.setProperty('--moon-tilt-x', `${((event.clientX - rect.left) / rect.width - .5) * 13}deg`);
      stage.style.setProperty('--moon-tilt-y', `${((event.clientY - rect.top) / rect.height - .5) * -10}deg`);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
      stage.style.removeProperty('--moon-tilt-x');
      stage.style.removeProperty('--moon-tilt-y');
    }, { passive: true });
    setLanguage();
    document.dispatchEvent(new Event('midautumn:change'));
  }

  function sync() {
    const active = isActive(new Date());
    if (active) root.dataset.midautumn = 'on';
    else root.removeAttribute('data-midautumn');
    if (themeColor) themeColor.content = active ? '#0b1126' : originalThemeColor;
    if (favicon) favicon.href = active ? moonFavicon : originalFavicon;
    if (active) mount();
    else if (mounted) {
      document.querySelector('.midautumn-celebration')?.remove();
      mounted = false;
      document.dispatchEvent(new Event('midautumn:change'));
    }
  }

  sync();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync, { once: true });
  else sync();
  document.addEventListener('visibilitychange', sync);
  // The open tab also returns to the original skin shortly after Dubai midnight.
  window.setInterval(sync, 15_000);
  new MutationObserver(setLanguage).observe(root, { attributes: true, attributeFilter: ['lang'] });
  window.ChefZCSeason = Object.freeze({ dubaiDay, isActive });
})();
