/* app.js */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const safe = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  let toastTimer;
  function toast(message) { const el = $('.toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 5000); }

  const menu = $('#site-menu');
  const menuButton = $('.dock-menu');
  menuButton?.addEventListener('click', () => { menu.showModal(); menuButton.setAttribute('aria-expanded', 'true'); });
  $('[data-close-menu]')?.addEventListener('click', () => menu.close());
  menu?.addEventListener('close', () => { menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus(); });
  menu?.addEventListener('click', event => { if (event.target === menu) { const r = menu.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) menu.close(); } });

  $$('[data-filter-library]').forEach(library => {
    let category = 'all';
    const field = $('[data-search-input]', library);
    const items = $$('.filter-item', library);
    const count = $('.results-count', library);
    const query = new URLSearchParams(location.search).get('search');
    if (query) field.value = query;
    function filter() {
      const term = field.value.toLocaleLowerCase().trim();
      let visible = 0;
      items.forEach(item => {
        const matchesCategory = category === 'all' || (item.dataset.category || '').split(' ').includes(category);
        const matchesSearch = (item.dataset.search || '').toLocaleLowerCase().includes(term);
        item.hidden = !matchesCategory || !matchesSearch;
        if (!item.hidden) visible++;
      });
      const reels = $('.reels-panel', library);
      if (reels) reels.hidden = category !== 'reels';
      const empty = $('.empty-result', library);
      if (empty) empty.hidden = visible > 0 || category === 'reels';
      count.textContent = category === 'reels' ? 'Short conversations from the field' : `${visible} ${visible === 1 ? 'result' : 'results'}`;
    }
    $$('[data-filter]', library).forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter;
      $$('[data-filter]', library).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      filter();
    }));
    field.addEventListener('input', filter);
    filter();
  });

  $$('[data-embed]').forEach(button => button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    const url = new URL(button.dataset.embed);
    url.searchParams.set('autoplay', '1');
    frame.src = url.href;
    frame.title = button.getAttribute('aria-label');
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    button.replaceWith(frame);
    frame.focus();
  }));

  $$('.preview-form').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const status = $('.form-status', form);
    const submit = $('[type=submit]', form);
    if (!form.reportValidity()) return;
    if (form.classList.contains('auth-form')) {
      status.textContent = 'This form is a design preview. No account was created and no credentials were sent. Use the live community link below to sign in or join.';
      const password = $('[name=password]', form); if (password) password.value = '';
    } else if (form.classList.contains('newsletter-form')) {
      // No mailing-list provider is connected yet, here or on the live site.
      status.textContent = 'Sign-up isn’t connected yet, so your address hasn’t been saved or sent anywhere. For now, you can follow Mycelium on ';
      const link = document.createElement('a');link.href = 'https://www.instagram.com/mycelium.learn/';link.target = '_blank';link.rel = 'noopener';link.textContent = 'Instagram';status.append(link, '.');
    } else if (form.classList.contains('contact-form')) {
      status.textContent = 'Your message is ready. Nothing has been sent. Use the live contact form below when you’re ready to reach Mycelium.';
    } else {
      status.textContent = 'Preview complete. This past event is closed; no registration has been sent.';
    }
    status.tabIndex = -1;status.focus({preventScroll:true});
  }));
  $$('[data-show-password]').forEach(button => button.addEventListener('click', () => {
    const input = $('input', button.parentElement);const show = input.type === 'password';input.type = show ? 'text' : 'password';button.textContent = show ? 'Hide' : 'Show';
  }));

  // Preserve the original site's click-to-reveal email behavior.
  $$('[data-email], .em-reveal-btn').forEach(button => button.addEventListener('click', () => {
    const source=button.matches('[data-email]')?button:button.closest('.em-reveal');
    const reverse=value=>String(value||'').split('').reverse().join('');
    const address=reverse(source?.dataset.u)+'@'+reverse(source?.dataset.d);
    const a=document.createElement('a');a.href=address.length>3?'mailto:'+address:'https://mycelium-learn.com/feedback';a.textContent=address.length>3?address:'Contact Mycelium';a.className='text-link';button.replaceWith(a);
  }));

  // Preserve the bilingual report with an explicit, accessible language switch.
  const languages = $$('.report-lang');
  if (languages.length) {
    const bar = $('.rpt-topbar');
    $$('button', bar || document).forEach(b => b.remove());
    $('.lang-toggle',bar)?.remove();
    const controls = document.createElement('div');controls.className = 'lang-switch';controls.setAttribute('role','group');controls.setAttribute('aria-label','Report language');
    ['English','Filipino'].forEach((name,i) => { const b=document.createElement('button');b.type='button';b.textContent=name;b.setAttribute('aria-pressed',String(i===0));b.addEventListener('click',()=>{languages.forEach((el,n)=>{el.classList.toggle('active',n===i);el.hidden=n!==i;el.lang=n===0?'en':'fil';});$$('button',controls).forEach((el,n)=>el.setAttribute('aria-pressed',String(n===i)));});controls.append(b); });
    bar?.append(controls);
    languages.forEach((el,i)=>{el.classList.toggle('active',i===0);el.hidden=i!==0;el.lang=i===0?'en':'fil';});
  }

  // Archive dates are frozen source content, not upcoming event claims.
  $$('.event-archive a').forEach(a => {
    // Only the visible label changes; rewriting every text node repeated it.
    if (/register\/permanent-culture/.test(a.href)) { const label=[...a.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()); if (label) label.textContent='View past event '; }
    if (a.textContent.includes('Reserve Your Spot')) a.textContent = 'View provider details';
  });
  $$('.event-archive [style]').forEach(el => el.removeAttribute('style'));

  if (!$('.cg-header')) return;
  const voteKey = 'mycelium-redesign-preview-votes-v1';
  const postKey = 'mycelium-redesign-preview-posts-v1';
  const statements = [
    'Permaculture learning should begin with observing the place you already live.',
    'Sharing what did not work can be just as useful as sharing a successful harvest.',
    'A small community garden can become a place for people to make decisions together.',
    'Local knowledge should have as much space in our learning as formal training.'
  ];
  let votes = read(voteKey, {});let voteIndex = 0;
  function showStatement() {
    $('[data-statement]').textContent = statements[voteIndex];
    $('[data-vote-index]').textContent = voteIndex + 1;
    $$('[data-vote]').forEach(b=>b.setAttribute('aria-pressed',String(votes[voteIndex]===b.dataset.vote)));
    $('.vote-status').textContent = votes[voteIndex] ? `Your preview answer: ${votes[voteIndex] === 'unsure' ? 'Not sure' : votes[voteIndex]}. Saved on this device.` : 'Your perspective belongs here.';
    $('[data-prev-statement]').disabled = voteIndex === 0;
    $('[data-next-statement]').disabled = voteIndex === statements.length-1;
    updateMarker();
  }
  $$('[data-vote]').forEach(button=>button.addEventListener('click',()=>{votes[voteIndex]=button.dataset.vote;const saved=write(voteKey,votes);showStatement();if(!saved)$('.vote-status').textContent='Answer selected for this session. Browser storage is unavailable.';}));
  $('[data-next-statement]').addEventListener('click',()=>{voteIndex=Math.min(statements.length-1,voteIndex+1);showStatement();});
  $('[data-prev-statement]').addEventListener('click',()=>{voteIndex=Math.max(0,voteIndex-1);showStatement();});
  const dots = $('[data-map-dots]');
  const colors = ['#2f4f2f','#8a8477','#a0813b'];
  for(let group=0;group<3;group++) for(let i=0;i<25;i++) {
    const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    const angle=i*2.39996;const radius=12+Math.sqrt(i)*20;
    dot.setAttribute('cx',245+group*250+Math.cos(angle)*radius);
    dot.setAttribute('cy',205+Math.sin(angle)*radius*.8+(group===1?-25:0));
    dot.setAttribute('r',4+(i%3));dot.setAttribute('fill',colors[group]);dot.setAttribute('opacity',.4+(i%4)*.15);dots.append(dot);
  }
  const marker=document.createElementNS('http://www.w3.org/2000/svg','circle');marker.setAttribute('r','11');marker.classList.add('map-you');dots.append(marker);
  function updateMarker(){
    const entries=Object.values(votes);marker.style.display=entries.length?'':'none';
    marker.setAttribute('cx',250+(entries.filter(v=>v==='agree').length/Math.max(1,entries.length))*500);
    marker.setAttribute('cy',190+entries.filter(v=>v==='unsure').length*17);
    $('[data-map-status]').textContent=entries.length?`Your preview marker · ${entries.length} of 4 statements answered. Illustrative positioning only.`:'Answer statements to add your preview marker.';
  }
  $('[data-map-help]').addEventListener('click',e=>{const help=$('.map-help');help.hidden=!help.hidden;e.currentTarget.setAttribute('aria-expanded',String(!help.hidden));});
  showStatement();

  let posts=read(postKey,[]);let postType='Question';let postFilter='all';
  $$('[data-post-type]').forEach(b=>b.addEventListener('click',()=>{postType=b.dataset.postType;$$('[data-post-type]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
  $$('[data-post-filter]').forEach(b=>b.addEventListener('click',()=>{postFilter=b.dataset.postFilter;$$('[data-post-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderPosts();}));
  $('#post-form').addEventListener('submit',event=>{
    event.preventDefault();const input=$('#post-body');const body=input.value.trim();
    if(body.length<3){$('#post-status').textContent='Write at least a few words to start the conversation.';input.focus();return;}
    posts.unshift({id:Date.now().toString(36),body,type:postType,date:new Date().toISOString(),liked:false,replies:[]});
    const saved=write(postKey,posts);input.value='';$('#post-status').textContent=saved?'Added to your local preview. Nothing was published to the live community.':'Added for this session. Browser storage is unavailable.';renderPosts();
  });
  function renderPosts(){
    const shown=posts.filter(p=>postFilter==='all'||p.type===postFilter);const list=$('#forum-posts');
    list.innerHTML=shown.length?shown.map(p=>`<article class="forum-post" data-post-id="${safe(p.id)}"><div class="post-author"><span class="avatar">Y</span><span>You · ${safe(p.type)}<br><small>Local preview</small></span><time datetime="${safe(p.date)}">${new Date(p.date).toLocaleDateString('en',{month:'short',day:'numeric'})}</time></div><p>${safe(p.body)}</p><div class="post-controls"><button type="button" class="like-post" data-liked="${p.liked}" aria-pressed="${p.liked}">${p.liked?'Appreciated':'Appreciate'}${p.liked?' · 1':''}</button><button type="button" class="reply-toggle" aria-expanded="false">Reply · ${p.replies.length}</button><button type="button" class="delete-post">Delete my draft</button></div>${p.replies.map(r=>`<div class="post-reply"><strong>You · local preview</strong><p>${safe(r)}</p></div>`).join('')}<form class="reply-form" hidden><input aria-label="Your reply" placeholder="Add your perspective…" required maxlength="1500"><button type="submit">Reply</button></form></article>`).join(''):'<div class="forum-empty"><h3>The floor is quiet.</h3><p>No '+(postFilter==='all'?'posts':postFilter.toLowerCase()+'s')+' in this preview yet. Share one above.</p></div>';
    $$('.forum-post',list).forEach(el=>{
      const p=posts.find(p=>p.id===el.dataset.postId);
      $('.like-post',el).addEventListener('click',()=>{p.liked=!p.liked;write(postKey,posts);renderPosts();});
      $('.delete-post',el).addEventListener('click',()=>{posts=posts.filter(x=>x.id!==p.id);write(postKey,posts);renderPosts();toast('Your local draft was deleted.');});
      $('.reply-toggle',el).addEventListener('click',e=>{const f=$('.reply-form',el);f.hidden=!f.hidden;e.currentTarget.setAttribute('aria-expanded',String(!f.hidden));if(!f.hidden)$('input',f).focus();});
      $('.reply-form',el).addEventListener('submit',event=>{event.preventDefault();const val=$('input',event.currentTarget).value.trim();if(!val)return;p.replies.push(val);write(postKey,posts);renderPosts();});
    });
  }
  $('[data-reset-preview]').addEventListener('click',()=>{posts=[];votes={};write(postKey,posts);write(voteKey,votes);renderPosts();showStatement();toast('Your local preview activity has been cleared.');});
  renderPosts();
})();

;
/* motion.js */
/* Small, native motion system. No scroll interception or animation framework. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const all = selector => [...document.querySelectorAll(selector)];
  let paused = false;
  let keyboard = false;
  try { paused = localStorage.getItem('mycelium-motion-paused') === 'true'; } catch {}
  const enabled = () => !paused && !reduced.matches;
  const toggle = document.querySelector('[data-motion-toggle]');
  const films = all('.ambient-film');
  const onScreen = new Set();

  function syncMotion() {
    root.classList.toggle('motion-paused', paused || reduced.matches);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Resume ambient motion' : 'Pause ambient motion');
      toggle.querySelector('span').textContent = paused ? 'Resume motion' : 'Pause motion';
    }
    films.forEach(film => {
      if (enabled() && !document.hidden && onScreen.has(film)) film.play().catch(() => {});
      else film.pause();
    });
    updateScroll();
  }

  const filmObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? onScreen.add(entry.target) : onScreen.delete(entry.target));
    syncMotion();
  }, {threshold: 0.15});
  films.forEach(film => { film.muted = true; filmObserver.observe(film); });
  toggle?.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('mycelium-motion-paused', String(paused)); } catch {}
    syncMotion();
  });
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
      keyboard = true;
      root.classList.add('keyboard-navigation');
    }
  });
  document.addEventListener('pointerdown', () => {
    keyboard = false;
    root.classList.remove('keyboard-navigation');
  }, {passive: true});

  // One entrance for the opening; the rest of the page is already visible.
  if (enabled()) root.classList.add('motion-ready');
  const stage = document.querySelector('.garden-stage');
  const layers = stage ? all('.garden-stage [data-depth]') : [];
  let pointerFrame = 0;
  stage?.addEventListener('pointermove', event => {
    if (!enabled() || !finePointer.matches || keyboard) return;
    const bounds = stage.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => layers.forEach(layer => {
      const depth = Number(layer.dataset.depth);
      layer.style.transition = 'translate 650ms cubic-bezier(.22,1,.36,1)';
      layer.style.translate = `${x * depth}px ${y * depth}px`;
    }));
  }, {passive: true});
  stage?.addEventListener('pointerleave', () => layers.forEach(layer => { layer.style.translate = '0 0'; }));

  const scenes = all('[data-scroll-scene]');
  const reading = document.querySelector('.reading-page,.legal-copy');
  let progressBar;
  if (reading) {
    progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Reading progress');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    document.body.append(progressBar);
  }
  const clamp = (n, low = 0, high = 1) => Math.max(low, Math.min(high, n));
  let scrollFrame = 0;
  function updateScroll() {
    const h = innerHeight;
    scenes.forEach(scene => {
      const box = scene.getBoundingClientRect();
      if (box.bottom > -100 && box.top < h + 100) {
        const progress = enabled() ? clamp((h - box.top) / (h + box.height)) : 0;
        scene.style.setProperty('--scene', progress.toFixed(4));
      }
    });
    if (stage) {
      const hero = stage.closest('.garden-hero').getBoundingClientRect();
      stage.style.translate = enabled() && innerWidth > 760 ? `0 ${clamp(-hero.top * .075, 0, 45)}px` : '0 0';
    }
    if (reading && progressBar) {
      const box = reading.getBoundingClientRect();
      const progress = clamp(-box.top / Math.max(1, box.height - h));
      progressBar.style.transform = `scaleX(${progress})`;
      progressBar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    }
    scrollFrame = 0;
  }
  function requestScrollUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  addEventListener('scroll', requestScrollUpdate, {passive: true});
  addEventListener('resize', requestScrollUpdate, {passive: true});

  // The two main journeys are tactile on a pointer; touch keeps ordinary links.
  all('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!enabled() || !finePointer.matches || keyboard) return;
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.transition = 'transform 450ms cubic-bezier(.22,1,.36,1)';
      card.style.transform = `perspective(1200px) rotateX(${-y * 2.2}deg) rotateY(${x * 2.2}deg)`;
    }, {passive: true});
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  const rail = document.querySelector('[data-film-rail]');
  if (rail) {
    const prev = document.querySelector('[data-rail-prev]');
    const next = document.querySelector('[data-rail-next]');
    const updateButtons = () => {
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
    };
    const move = direction => rail.scrollBy({left: direction * Math.min(rail.clientWidth * .8, 810), behavior: enabled() && !keyboard ? 'smooth' : 'instant'});
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    rail.addEventListener('scroll', updateButtons, {passive: true});
    addEventListener('resize', updateButtons, {passive: true});
    updateButtons();
  }

  all('[data-filter-library]').forEach(library => {
    let tick;
    const animateResults = () => {
      cancelAnimationFrame(tick);
      if (!enabled() || keyboard) return;
      tick = requestAnimationFrame(() => {
        [...library.querySelectorAll('.filter-item:not([hidden])')].slice(0, 12).forEach((item, index) => {
          item.animate([{opacity:.7,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}], {duration:280,delay:Math.min(index,5)*25,easing:'cubic-bezier(.22,1,.36,1)'});
        });
      });
    };
    library.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', animateResults));
  });
  syncMotion();
})();

;
/* reel.js */
/* Four real films, five seconds each. Native playback; no rendered composite. */
(() => {
 'use strict';
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const enabled=()=>!reduced.matches&&!root.classList.contains('motion-paused')&&!document.hidden;
 const reel=document.querySelector('[data-hero-reel]');
 if(reel){
  const films=[...reel.querySelectorAll('video')];
  const buttons=[...document.querySelectorAll('[data-reel-select]')];
  const meta=[
   ['Learning, in real life.','Kabuohan workshop','events/kabuohan-workshop/index.html'],
   ['Bakit kami nasa permakultura?','Kapitbahay · Episode 1','video/kapitbahay-kwentong-permakultura-episode-1-bakit-kami-nasa-permakultura-why-are-we-in-permaculture/index.html'],
   ['Lupa. It starts with the soil.','Kapitbahay · Episode 2','video/kapitbahay-kwentong-permakultura-permaculture-tails-episode-2-lupa/index.html'],
   ['Tubig. A conversation about water.','Kapitbahay · Watch the water episode','https://www.youtube.com/watch?v=LjwKnpSrGlo']
  ];
  let index=0,visible=false,frame=0,changing=false,elapsed=0,lastTick=0;
  films.forEach(video=>{video.muted=true;video.pause();});
  function sync(){
   if(!visible||!enabled())lastTick=0;
   films.forEach((video,i)=>{
    if(i===index&&visible&&enabled()) video.play().catch(()=>{});
    else video.pause();
   });
   if(!frame&&visible&&enabled())frame=requestAnimationFrame(tick);
  }
  function select(next){
   if(changing)return;
   changing=true;
   const old=films[index];old.pause();
   index=next;elapsed=0;lastTick=performance.now();const current=films[index];
   current.currentTime=0;
   films.forEach((video,i)=>video.classList.toggle('is-active',i===index));
   buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
   document.querySelector('[data-reel-title]').textContent=meta[index][0];
   const link=document.querySelector('[data-reel-link]');link.textContent=meta[index][1];link.href=meta[index][2];
   document.querySelector('[data-reel-index]').textContent=String(index+1);
   reel.dataset.activeClip=String(index);
   changing=false;sync();
  }
  function tick(now){
   frame=0;
   if(!visible||!enabled()){lastTick=0;return;}
   if(lastTick)elapsed+=now-lastTick;
   lastTick=now;
   if(elapsed>=5000)select((index+1)%films.length);
   if(!frame)frame=requestAnimationFrame(tick);
  }
  buttons.forEach((button,i)=>button.addEventListener('click',()=>select(i)));
  films.forEach((video,i)=>video.addEventListener('ended',()=>{if(i===index&&enabled())select((index+1)%films.length);}));
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.2}).observe(reel);
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 }
 const sculpture=document.querySelector('[data-film-sculpture]');
 if(sculpture){
  let frame=0;
  sculpture.addEventListener('pointermove',event=>{
   if(!enabled()||!fine.matches)return;
   const box=sculpture.getBoundingClientRect();
   const x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;
   cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{sculpture.style.setProperty('--rx',`${-y*8}deg`);sculpture.style.setProperty('--ry',`${x*10}deg`);});
  },{passive:true});
  sculpture.addEventListener('pointerleave',()=>{sculpture.style.setProperty('--rx','0deg');sculpture.style.setProperty('--ry','0deg');});
  const object=sculpture.querySelector('.headphone-object');
  let objectVisible=false;
  const sync=()=>object.style.animationPlayState=enabled()&&objectVisible?'running':'paused';
  new IntersectionObserver(entries=>{objectVisible=entries[0].isIntersecting;sync();}).observe(sculpture);
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 }
 document.querySelectorAll('[data-depth-card]').forEach(card=>{
  let frame=0;
  card.addEventListener('pointermove',event=>{
   if(!enabled()||!fine.matches||root.classList.contains('keyboard-navigation'))return;
   const box=card.getBoundingClientRect(),x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;
   cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>card.style.transform=`perspective(1000px) rotateX(${-y*7}deg) rotateY(${x*9}deg) translateY(-3px)`);
  },{passive:true});
  card.addEventListener('pointerleave',()=>{card.style.transform='';});
 });
})();
