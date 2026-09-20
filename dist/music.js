import { t, getLanguage, onLanguageChange } from './i18n.js';
import { artists, songs, favouriteAlbums } from './music-data.js';
import { canAnimate, onMotionChange } from './motion-state.js';

const section = document.querySelector('#music');
if (section) {
  const $ = selector => section.querySelector(selector);
  const icon = name => `<svg class="symbol" viewBox="0 0 24 24" aria-hidden="true"><use href="./assets/music-icons.svg#${name}"></use></svg>`;
  const escape = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const artistByKey = new Map(artists.map(a=>[a.key,a]));
  const artistName = key => getLanguage()==='en'?artistByKey.get(key).en:artistByKey.get(key).name;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let selectedArtist = 'all';
  let current = songs[Math.floor(Math.random()*songs.length)];
  let history = [current.id];
  let historyIndex = 0;
  let rotationEnabled = !motion.matches;
  let isVisible = false;
  let pointerInside = false;
  let timer;
  let page = 0;
  let playingSelection = null;
  let playerState = 'loading';
  let playerTimeout;
  const pageSize = 12;
  const collection = () => selectedArtist==='all'?songs:songs.filter(s=>s.artist===selectedArtist);
  const chooseRandom = () => {
    const options = collection().filter(s=>s.id!==current.id);
    return options[Math.floor(Math.random()*options.length)] || current;
  };

  function renderArtists() {
    $('#music-artists').innerHTML = artists.map(a=>{
      const count = songs.filter(s=>s.artist===a.key).length;
      return `<button type="button" class="music-artist" data-artist="${a.key}" aria-pressed="${selectedArtist===a.key}" aria-label="${escape(t('music.selectArtist',{artist:artistName(a.key),count}))}"><span class="music-artist-image"><img src="${a.image}" alt="" width="160" height="160" loading="lazy"></span><span class="music-artist-name">${escape(artistName(a.key))}</span><span class="music-artist-count mono">${escape(t('music.trackCount',{count}))}</span></button>`;
    }).join('');
    $('#music-all').setAttribute('aria-pressed',String(selectedArtist==='all'));
    $('#music-stats').textContent = t('music.stats',{artists:artists.length,songs:songs.length});
    $('#music-album-list').innerHTML = favouriteAlbums.map(a=>`<a class="favourite-album" href="${a.url}" target="_blank" rel="noopener noreferrer" aria-label="${escape(t('music.albumLink',{title:a.title}))}"><img src="${a.cover}" alt="" width="160" height="160" loading="lazy"><span><b>${escape(a.title)}</b><small>${escape(artistName(a.artist))}</small></span><span aria-hidden="true">↗</span></a>`).join('');
  }

  function renderFeature(animate=false) {
    const image = $('#music-cover');
    if (!image.src.endsWith(current.cover.slice(1))) image.src=current.cover;
    image.alt=`${current.title} · ${current.album}`;
    $('#music-song-title').textContent=current.title;
    $('#music-song-artist').textContent=current.credits.includes(' / ')?current.credits:artistName(current.artist);
    $('#music-song-album').textContent=current.album;
    $('#music-song-link').href=current.url;
    const pool=collection();
    $('#music-index').textContent=`${String(pool.findIndex(s=>s.id===current.id)+1).padStart(2,'0')} / ${String(pool.length).padStart(2,'0')} — SELECTED TRACK`;
    $('#music-prev').disabled=historyIndex===0;
    const stage=$('.music-cover-stage');
    if (animate && canAnimate()) {
      stage.classList.remove('is-changing');
      void stage.offsetWidth;
      stage.classList.add('is-changing');
    }
    section.querySelectorAll('[data-song]').forEach(button=>button.setAttribute('aria-current',String(Number(button.dataset.song)===current.id)));
  }

  function selectSong(song,{remember=true,announce=false}={}) {
    current=song;
    if (remember) {
      history=history.slice(0,historyIndex+1);
      history.push(song.id);
      historyIndex=history.length-1;
    }
    renderFeature(true);
    if (announce) $('#music-announcement').textContent=`${song.title} · ${artistName(song.artist)}`;
    scheduleRotation();
  }

  function renderLibrary() {
    const query=$('#music-search').value.trim().toLocaleLowerCase();
    const filtered=collection().filter(s=>`${s.title} ${s.album} ${artistName(s.artist)} ${artistByKey.get(s.artist).name} ${artistByKey.get(s.artist).en}`.toLocaleLowerCase().includes(query));
    page=Math.max(0,Math.min(page,Math.ceil(filtered.length/pageSize)-1));
    $('#music-library-artist').textContent=selectedArtist==='all'?t('music.all'):artistName(selectedArtist);
    $('#music-search').placeholder=t('music.search');
    $('#music-tracks').innerHTML=filtered.slice(page*pageSize,(page+1)*pageSize).map((song,index)=>`<li><button type="button" class="music-track-row" data-song="${song.id}" aria-current="${song.id===current.id}" aria-label="${escape(t('music.selectTrack',{title:song.title}))}"><span class="mono">${String(page*pageSize+index+1).padStart(2,'0')}</span><img src="${song.cover}" alt="" width="84" height="84" loading="lazy"><span><strong>${escape(song.title)}</strong><small>${escape(artistName(song.artist))} · ${escape(song.album)}</small></span>${icon('arrow-up-right')}</button></li>`).join('');
    $('#music-empty').hidden=filtered.length!==0;
    $('#music-page-count').textContent=t('music.page',{start:filtered.length?page*pageSize+1:0,end:Math.min(filtered.length,(page+1)*pageSize),total:filtered.length});
    $('#music-page-prev').disabled=page===0;
    $('#music-page-next').disabled=(page+1)*pageSize>=filtered.length;
  }

  function renderRotation() {
    $('#music-rotation').setAttribute('aria-label',t(rotationEnabled?'music.pause':'music.resume'));
    $('#music-rotation').setAttribute('aria-pressed',String(rotationEnabled));
    $('#music-rotation-icon').innerHTML=icon(rotationEnabled?'pause':'play');
  }

  function scheduleRotation() {
    clearTimeout(timer);
    if (!canAnimate() || !rotationEnabled || !isVisible || pointerInside || section.contains(document.activeElement) || playingSelection) return;
    timer=setTimeout(()=>selectSong(chooseRandom()),12000);
  }

  function chooseArtist(key) {
    selectedArtist=key;
    page=0;
    $('#music-search').value='';
    history=[];
    historyIndex=-1;
    selectSong(chooseRandom(),{announce:true});
    renderArtists();
    renderLibrary();
    // Keep keyboard focus on the re-rendered selector; then reveal its curated songs.
    (key==='all'?$('#music-all'):$(`[data-artist="${key}"]`)).focus({preventScroll:true});
    $('#music-library').open=true;
  }

  onMotionChange(scheduleRotation);

  function renderPlayerLabels() {
    if (!playingSelection) return;
    $('#music-player-label').textContent=`${t('music.player')} · ${playingSelection.title}`;
    $('#music-player-frame').title=t('music.playerTitle',{title:playingSelection.title});
    $('#music-player-link').href=playingSelection.url;
    $('#music-player-hint').textContent=t(playerState==='loading'?'music.playerLoading':playerState==='unavailable'?'music.playerUnavailable':'music.playerHint');
  }

  $('#music-artists').addEventListener('click',event=>{
    const button=event.target.closest('[data-artist]');
    if(button) chooseArtist(button.dataset.artist);
  });
  $('#music-all').addEventListener('click',()=>chooseArtist('all'));
  $('#music-shuffle').addEventListener('click',()=>selectSong(chooseRandom(),{announce:true}));
  $('#music-next').addEventListener('click',()=>{
    if(historyIndex<history.length-1) {
      historyIndex++;
      selectSong(songs.find(s=>s.id===history[historyIndex]),{remember:false,announce:true});
    } else selectSong(chooseRandom(),{announce:true});
  });
  $('#music-prev').addEventListener('click',()=>{
    if(historyIndex>0) {
      historyIndex--;
      selectSong(songs.find(s=>s.id===history[historyIndex]),{remember:false,announce:true});
    }
  });
  $('#music-rotation').addEventListener('click',()=>{rotationEnabled=!rotationEnabled;renderRotation();scheduleRotation();});
  $('#music-tracks').addEventListener('click',event=>{
    const button=event.target.closest('[data-song]');
    if(!button) return;
    selectSong(songs.find(s=>s.id===Number(button.dataset.song)),{announce:true});
    $('#music-listen').focus({preventScroll:true});
    $('.music-feature').scrollIntoView({behavior:canAnimate()?'smooth':'instant',block:'center'});
  });
  $('#music-search').addEventListener('input',()=>{page=0;renderLibrary();});
  $('#music-page-prev').addEventListener('click',()=>{page--;renderLibrary();});
  $('#music-page-next').addEventListener('click',()=>{page++;renderLibrary();});
  $('#music-listen').addEventListener('click',()=>{
    // QQ Music owns playback and authentication. Loading an iframe is not a playback event.
    playingSelection=current;
    clearTimeout(playerTimeout);
    playerState='loading';
    const frame=document.createElement('iframe');
    frame.id='music-player-frame';
    frame.src=`https://i.y.qq.com/n2/m/outchain/player/index.html?songid=${current.id}&songtype=0`;
    frame.allow='autoplay';
    frame.referrerPolicy='strict-origin-when-cross-origin';
    $('#music-player-slot').hidden=true;
    frame.addEventListener('load',()=>{
      if (!frame.isConnected) return;
      clearTimeout(playerTimeout);
      playerState='ready';
      $('#music-player-slot').hidden=false;
      renderPlayerLabels();
    });
    $('#music-player-slot').replaceChildren(frame);
    $('#music-player').hidden=false;
    renderPlayerLabels();
    playerTimeout=setTimeout(()=>{
      if (!frame.isConnected || playerState==='ready') return;
      playerState='unavailable';
      renderPlayerLabels();
    },8000);
    scheduleRotation();
    $('#music-close').focus({preventScroll:true});
    $('#music-player').scrollIntoView({behavior:canAnimate()?'smooth':'instant',block:'center'});
  });
  $('#music-close').addEventListener('click',()=>{
    clearTimeout(playerTimeout);
    $('#music-player-slot').replaceChildren();
    $('#music-player').hidden=true;
    playingSelection=null;
    $('#music-listen').focus({preventScroll:true});
    scheduleRotation();
  });
  section.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){pointerInside=true;scheduleRotation();}});
  section.addEventListener('pointerleave',()=>{pointerInside=false;scheduleRotation();});
  section.addEventListener('focusin',scheduleRotation);
  section.addEventListener('focusout',()=>queueMicrotask(scheduleRotation));
  document.addEventListener('visibilitychange',scheduleRotation);
  motion.addEventListener('change',()=>{if(motion.matches)rotationEnabled=false;renderRotation();scheduleRotation();});
  new IntersectionObserver(entries=>{isVisible=entries[0].isIntersecting;scheduleRotation();},{threshold:0}).observe($('.music-feature'));
  onLanguageChange(()=>{renderArtists();renderFeature();renderLibrary();renderRotation();renderPlayerLabels();});
  renderArtists();renderFeature();renderLibrary();renderRotation();
}
