import { load } from 'cheerio';
import { readFileSync } from 'node:fs';
import videos from '../../public/data/videos.json';
import { baganihanReports } from '../data/baganihan-reports.js';
import { baganihanEssays } from '../data/baganihan-essays.js';
import { upouStudies } from '../data/upou-research.js';
import videoBase from './video-images.json';

// These are the reviewed presentation templates. All editable collections below
// still come from the original Astro/CMS sources at build time.
const templates = import.meta.glob('./templates/**/*.json', { eager: true, import: 'default' });
const template = route => templates[`./templates/${route || 'home'}.json`];
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = value => String(value || '').split('\n').filter(p => p.trim()).map(p => `<p>${escape(p)}</p>`).join('');
const slugTags = v => (v.tags || []).map(t => t.toLowerCase().replace(/\s+/g, '-')).join(' ');
const arrow = '<svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="M4 12h16M13 5l7 7-7 7" stroke="currentColor" stroke-width="1.5"/></svg>';

function image($, node, url, alt) {
  node.find('noscript').remove();
  const img = node.is('img') ? node : node.find('img').first();
  for (const attr of ['data-src','data-srcset','srcset','data-lazy-media','data-wheel-media']) img.removeAttr(attr);
  img.attr({src:url,alt:alt || '',loading:'lazy',decoding:'async'});
}

function videoLibrary($, reels) {
  const grid = $('[data-filter-library="videos"] > .library-grid');
  const originals = new Map();
  grid.children('.library-card').each((_, e) => {
    const card = $(e), url = card.find('a').first().attr('href');
    originals.set(url, card.clone());
  });
  const fallback = grid.children().first().clone();
  grid.empty();
  videos.forEach((v, i) => {
    const href = `/video/${v.slug}/`, exists = originals.has(href);
    const card = (originals.get(href) || fallback).clone();
    card.attr({'data-search':`${v.title} ${v.author} ${slugTags(v)}`,'data-category':slugTags(v)});
    card.find('a').first().attr('href', href).removeAttr('target').removeAttr('rel');
    card.find('h3').text(v.title); card.find('a > p').text(v.author || '');
    card.find('.library-card-meta span').last().text(String(i + 1).padStart(2,'0'));
    if (!exists || videoBase[v.slug] !== v.thumbnail) image($, card.find('.library-cover'), v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`, v.title);
    grid.append(card);
  });
  // The separately approved Tubig episode is not in the original video JSON.
  for (const [url, card] of originals) if (!url.startsWith('/video/')) grid.append(card);
  $('[data-filter-library="videos"] .results-count').text(`${grid.children().length} videos`);
  const reelGrid = $('.reels-library'), reelTemplates = reelGrid.children().toArray().map(e => $(e).clone());
  reelGrid.empty();
  reels.sort((a,b) => +b.data.postedAt - +a.data.postedAt).forEach((r,i) => {
    const card = reelTemplates[i % reelTemplates.length].clone(), d = r.data;
    card.attr('data-search', d.caption || ''); card.find('a').first().attr('href',d.permalink);
    card.find('h3').text(`Reel Talk ${i+1}`);
    card.find('.reel-content > p').text((d.caption || '').slice(0,180) + ((d.caption || '').length > 180 ? '…' : ''));
    card.find('.reel-content > span').first().text(d.postedAt.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}));
    reelGrid.append(card);
  });
}

function videoDetail($, v, isNew) {
  $('.watch-heading h1').text(v.title); $('.watch-credit > p').text(`With ${v.author || 'the community'}`);
  $('.watch-tags').html((v.tags || []).map(t=>`<span>${escape(t)}</span>`).join(''));
  const yt = v.youtubeId || v.embedUrl?.match(/(?:[?&]v=|youtu\.be\/|\/embed\/)([\w-]{11})/)?.[1];
  const embed = v.embedSrc || (yt ? `https://www.youtube-nocookie.com/embed/${yt}` : null);
  const poster = $('.watch-poster');
  if (embed) poster.attr({'data-watch-embed':embed,'aria-label':`Play ${v.title}`});
  else poster.replaceWith(`<a class="watch-poster" href="${escape(v.embedUrl)}" target="_blank" rel="noopener">${poster.html()}</a>`);
  $('.watch-source-line a').attr('href',v.embedUrl || `https://www.youtube.com/watch?v=${yt}`);
  if (isNew || videoBase[v.slug] !== v.thumbnail) image($, $('.watch-screen'),v.thumbnail || `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,v.title);
  $('.watch-prose .vd-body-text').first().html(paragraphs(v.about || v.description));
  const ideal = $('.watch-prose .vd-body-text').eq(1);
  if (ideal.length) ideal.html(paragraphs(v.idealFor));
  else if (v.idealFor) $('.watch-question').before(`<h3>Ideal for</h3><div class="vd-body-text">${paragraphs(v.idealFor)}</div>`);
  $('.watch-educator h2').text(v.author || ''); $('.watch-educator > div > span').text(v.authorRole || '');
  $('.watch-bio > p').remove(); $('.watch-bio').prepend(paragraphs(v.authorBio));
  $('.watch-bio > a').attr('href',`/videos/?search=${encodeURIComponent(v.author || '')}&view=shelf#library`);
}

function readingLibrary($) {
  const list=$('.reading-list'), entries = [
    ...baganihanReports.map(r=>({href:`/resources/baganihan/${r.slug}/`,title:r.cardTitle,summary:r.cardSummary,type:'field-report',label:'Field report'})),
    ...baganihanEssays.map(r=>({href:`/resources/baganihan-reports/${r.slug}/`,title:r.cardTitle || r.title,summary:r.cardSummary || r.subtitle,type:'essay-guide',label:'Essay'})),
    ...upouStudies.map(r=>({href:`/resources/research/${r.slug}/`,title:r.cardTitle,summary:r.cardSummary,type:'research',label:'Research'}))
  ];
  for(const r of entries){
    let card=list.find('h3 a').filter((_,el)=>$(el).attr('href')===r.href).closest('[data-reading-item]');
    if(!card.length){card=list.children().first().clone();card.find('a').attr('href',r.href);list.append(card);}
    card.find('h3 a').text(r.title);card.find('.reading-summary').text(r.summary);
    card.attr({'data-group':r.type,'data-search':`${r.title} ${r.summary} ${card.find('.reading-source').text()}`});
    card.find('.reading-type').text(r.label);
  }
  const count=list.children().length;
  list.children().each((i,el)=>{const card=$(el);card.attr('data-folio',String(i+1).padStart(2,'0'));card.find('.reading-number').text(`${String(i+1).padStart(2,'0')} / ${count}`)});
  $('[data-reading-count]').text(`${count} pieces`);
}

const eventIds = {'perma-kapihan':'perma-kapihan','baganihan-permanent-culture':'disruption','ppa-pdc-july-2026':'design-course','baganihan-seed-sovereignty':'seed-sovereignty','baganihan-ancestral-wisdom':'ancestral-wisdom'};
function eventsContent($, events, archive) {
  for(const event of events){
    const d=event.data,id=eventIds[event.id] || event.id;
    if(archive){
      let row=$('.archive-story').filter((_,e)=>$(e).attr('id')===id);
      if(!row.length && (d.archived || (d.date && d.date < new Date()))){
        row=$('.archive-story').first().clone().attr('id',id);$('.archive-stories').append(row);
        row.find('.archive-object').remove();
      }
      if(!row.length)continue;
      row.find('h2').text(d.title);
      const detail=row.find('.archive-details');
      detail.find('p:not(.archive-closed)').remove();
      detail.prepend(paragraphs(d.description)+(d.speakerBio?paragraphs(d.speakerBio):'')+(d.highlights?`<ul>${d.highlights.map(h=>`<li>${escape(h)}</li>`).join('')}</ul>`:''));
      detail.find('a').remove();
      continue;
    }
    let card=$('[data-wheel-card]').filter((_,e)=>id==='perma-kapihan'?$(e).find('h2').text().includes('Perma-Kapihan'):$(e).find('a').first().attr('href')?.endsWith('#'+id));
    if(!card.length){card=$('[data-wheel-card]').first().clone();$('.wheel-stage').append(card);card.find('.gathering-location').remove();image($,card.find('.gathering-cover'),d.image,d.title);}
    const href=id==='perma-kapihan'?'/events/perma-kapihan/':`/events/archive/#${id}`;
    card.find('a').attr('href',href);
    // Keep the approved short title where it is a prefix of the full CMS title.
    if(!d.title.startsWith(card.find('h2').text().trim()))card.find('h2 a').text(d.title);
    if(d.isRecurring && d.time)card.find('.gathering-caption > span').text('SUNDAYS · '+d.time.replace(/:00/g,'').replace(/\s*–\s*/,'–').replace(' AM',' AM').replace(' PM',' PM'));
    else if(d.date)card.find('.gathering-caption > span').text(d.date.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).toUpperCase());
    card.find('.gathering-state').text(d.isRecurring?'Recurring gathering':(d.archived || d.date<new Date())?'Past event':'Upcoming event');
  }
  if(!archive){
    const choices=$('.wheel-choices').empty();
    $('[data-wheel-card]').each((i,e)=>{const card=$(e).attr('data-wheel-index',i);choices.append(`<button type="button" data-wheel-select="${i}" aria-label="Show ${escape(card.find('h2').text())}" aria-pressed="${i===0}"><span>${String(i+1).padStart(2,'0')}</span></button>`)});
  }
}

export function renderPage(route, { events=[], reels=[] }={}) {
  const v=route.startsWith('video/')?videos.find(v=>`video/${v.slug}`===route):null;
  const source=template(route) || (v?template('video/11-amazing-mulch-materials-for-permaculture-gardening'):null);
  if(!source)throw new Error(`Missing approved presentation: ${route}`);
  const $=load(source.body,null,false), head=load(source.head,null,false);
  if(v){videoDetail($,v,!template(route));head('title').text(`${v.title} — Mycelium`);}
  if(route==='videos')videoLibrary($,reels);
  if(route==='resources')readingLibrary($);
  if(route==='newsletter')$('.preview-note').text('New subscriptions are temporarily unavailable. Please check back soon.');
  if(route==='events'||route==='events/archive')eventsContent($,events,route.endsWith('archive'));
  // Public-site entrances use the approved account screen. Existing sessions
  // continue into the unchanged forum; direct forum/post URLs remain intact.
  if(!['join','sign-in','recover'].includes(route))$('a[href="/common-ground/"]').attr('href','/sign-in/');
  head('link[rel=canonical]').attr('href',`https://mycelium-learn.com/${route}${route?'/':''}`);
  if(['join','sign-in','recover'].includes(route)){
    const original=readFileSync('public/common-ground/index.html','utf8');
    const url=original.match(/const SUPABASE_URL='([^']+)'/)[1], key=original.match(/const SUPABASE_ANON_KEY='([^']+)'/)[1];
    // This is the same public anon key already shipped by Common Ground, never a service key.
    head.root().append(`<meta name="cg-url" content="${url}"><meta name="cg-anon-key" content="${key}"><script defer src="/redesign/auth.js"></script>`);
  }
  return {head:head.html(),bodyClass:source.bodyClass,body:$.html()};
}

export function articleShell(route, title) {
  const source=template(route) || template('resources/baganihan-reports/permaculture-beyond-the-farm');
  const $=load(source.body,null,false), head=load(source.head,null,false);
  $('a[href="/common-ground/"]').attr('href','/sign-in/');
  const before=$('main').prevAll().toArray().reverse().map(e=>$.html(e)).join('');
  const after=$('main').nextAll().toArray().map(e=>$.html(e)).join('');
  head('link[rel=canonical]').attr('href',`https://mycelium-learn.com/${route}/`);
  const slug=route.split('/').pop();
  const content=[...baganihanReports,...baganihanEssays,...upouStudies].find(p=>p.slug===slug);
  if(title||content)head('title').text(`${title||content.cardTitle||content.title} — Mycelium`);
  return {...source,head:head.html(),before,after};
}
