// Edition 03: an original paper compass and seven woven colour bands.
export const festivalJourneyMessages = {
  'now.meta': ['ChefZC 的近况。2026 年 9 月 22 日，Festival Toolkit 0.3：旅程收藏手册、七色腕带与每日版本提醒。', 'Updates from ChefZC. September 22, 2026: Festival Toolkit 0.3 brings journey journals, seven wristbands and daily release checks.'],
  'profile.bridgeNote': ['Festival Toolkit 0.3，把旅途收进手册。还有 ProjectLens 项目透镜、AXIOM 科学绘图、Folio 模组手帖与 NBA After Hours。每一次好奇，都有自己的展位。', 'Festival Toolkit 0.3 puts the journey on a new page. Explore ProjectLens, AXIOM, Folio and NBA After Hours, too. A place for every curiosity.'],
  'festival.name': ['地平线 · 旅程、季节赛与车库工坊', 'A JOURNEY, PLAYLIST & GARAGE WORKSHOP'],
  'festival.journalCount': ['收藏手册子项目', 'JOURNAL ENTRIES'],
  'festival.wristbandCount': ['腕带颜色', 'WRISTBAND COLOURS'],
  'now.festival03Kicker': ['把每一次发现，仔细收藏', 'A LITTLE FURTHER. A LITTLE MORE CURIOUS.'],
  'now.festival03Title': ['Festival Toolkit 0.3，让旅途完整绽放。', 'Festival Toolkit 0.3. Let every journey bloom.'],
  'now.festival03Text': ['四季工坊，又往前开了一段。这次给 Discover Japan 和嘉年华做了旅程手册：38 个分类、2,833 个子项目，可以慢慢找，也可以按分类整理；七色腕带也有了自己的收藏页。软件每天看看 GitHub 有没有新版本，下次见面，就不容易错过了。薄荷绿、淡蓝和粉色照旧，新的通行证带着一枚指南针——继续出发，也把沿途的发现收好。', 'The workshop takes another little trip. Discover Japan and the Festival now have a journey journal: 38 categories and 2,833 entries to search and organise, with a separate collection for seven wristband colours. The app checks GitHub each day, so the next edition is easier to find. The mint, blue and pink stay. This pass carries a compass: keep exploring, and keep a little of the journey.'],
  'now.festival03Note': ['收藏完成记录、积分与腕带持有记录分别处理；真实游戏读档、奖励及云同步仍未验证。', 'Journal completion, points and wristband ownership are distinct records; actual in-game loading, rewards and cloud sync remain unverified.'],
  'now.festival03Download': ['下载 0.3.0', 'Download 0.3.0'],
};

export function festivalJourneyArt() {
  return `<div class="fj-object" aria-hidden="true"><div class="fj-compass"><svg viewBox="0 0 240 240" fill="none"><circle cx="120" cy="120" r="109"/><circle cx="120" cy="120" r="94" stroke-dasharray="1 8" stroke-width="8"/><circle cx="120" cy="120" r="73"/><path d="M120 3v26m0 182v26M3 120h26m182 0h26"/><g class="fj-needle"><path d="m120 39 18 81-18 81-18-81Z" fill="#f7bbd4"/><path d="m120 39 18 81h-36Z" fill="#507f9f"/><circle cx="120" cy="120" r="9" fill="#f5f7e9"/></g></svg><span>N</span></div><div class="fj-paper"><div class="fj-paper-top"><span>H / 06</span><span>JOURNAL PASS</span></div><strong>TAKE THE<br><em>LONG WAY.</em></strong><svg class="fj-map" viewBox="0 0 250 80" fill="none"><path d="M6 59c60 0 30-49 85-49s24 56 79 56 34-39 72-39" stroke="currentColor" stroke-width="2" stroke-dasharray="4 5"/><circle cx="6" cy="59" r="5" fill="#bfdcf4"/><circle cx="91" cy="10" r="5" fill="#f7bbd4"/><circle cx="170" cy="66" r="5" fill="#bfdcf4"/><path d="m234 19 16 16m0-16-16 16" stroke="#ab4f79" stroke-width="3"/></svg><div class="fj-paper-bottom"><b>2,833<small>JOURNAL ENTRIES</small></b><span>38 CATEGORIES<br>02 JOURNALS<br>ONE MORE ADVENTURE.</span></div></div><div class="fj-ribbons">${['#bfdcf4','#f7bbd4','#c3dbae','#f0d7a4','#bfb1df','#e99c9b','#82bcaa'].map((color,i)=>`<i style="--band:${color};--n:${i}"><span>FESTIVAL / 0${i+1}</span></i>`).join('')}</div><div class="fj-edition"><span>EDITION</span><b>03</b><span>KEEP EXPLORING ↗</span></div></div>`;
}

document.querySelectorAll('[data-festival-journey]').forEach(root => { root.innerHTML = festivalJourneyArt(); });
