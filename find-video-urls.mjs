/**
 * Finds the unique YouTube URL per video by:
 * 1. Fetching all video pages
 * 2. Collecting every YouTube URL from each page
 * 3. URLs appearing on only 1 page = page-specific video
 * 4. URLs appearing on many pages = sitewide template (ignore)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'public/data/videos.json');
const BASE = 'https://mycelium-learn.com';
const DELAY_MS = 500;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function getAllYoutubeIds(html) {
  const ids = new Set();
  const matches = [...html.matchAll(/youtube\.com\/(?:watch\?v=|embed\/)([A-Za-z0-9_-]{11})/g)];
  matches.forEach(m => ids.add(m[1]));
  return [...ids];
}

// Extract video link from the single-post section (post-specific content)
function extractPostVideoLink(html) {
  const singlePostIdx = html.indexOf('data-elementor-type="single-post"');
  if (singlePostIdx < 0) return null;
  const section = html.substring(singlePostIdx, singlePostIdx + 15000);

  // Look for any external video link in this section
  const links = [...section.matchAll(/href="(https?:\/\/(?:www\.)?(?:youtube|youtu\.be|vimeo|webinarjam|event\.webinarjam|zoom)[^\s"<>]+)"/g)];
  return links[0]?.[1] || null;
}

function extractDescription(html) {
  const blocks = [...html.matchAll(/<p>([^<]{60,})<\/p>/g)];
  for (const m of blocks) {
    const text = m[1]
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').trim();
    if (text.includes('Curated resources') || text.includes('inbox') || text.includes('unsubscribe')) continue;
    if (text.includes('newsletter') || text.includes('Newsletter')) continue;
    if (text.length > 60) return text.substring(0, 350);
  }
  return '';
}

function extractAuthor(html) {
  // Look in single-post section for author
  const singlePost = html.indexOf('data-elementor-type="single-post"');
  if (singlePost > 0) {
    const section = html.substring(singlePost, singlePost + 5000);
    // Author is in a heading widget
    const m = section.match(/elementor-heading-title[^>]*>\s*([A-Z][a-z]+ [A-Z][a-z]+)\s*</);
    if (m) return m[1].trim();
  }
  return '';
}

function extractThumbnail(html) {
  // og:image is the featured image thumbnail
  const m = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
  return m ? m[1] : '';
}

function extractTags(html) {
  const tagMatches = [...html.matchAll(/\/tag\/([^/"]+)"/g)];
  return [...new Set(tagMatches.map(m => decodeURIComponent(m[1]).replace(/-/g, ' ')))].slice(0, 6);
}

async function fetchVideoList() {
  const url = `${BASE}/wp-json/wp/v2/video?per_page=100&_fields=id,title,slug,link,author&_embed=author`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`REST API failed: ${res.status}`);
  return res.json();
}

async function fetchAuthorMap() {
  const res = await fetch(`${BASE}/wp-json/wp/v2/users?per_page=100&_fields=id,name`);
  if (!res.ok) return {};
  const users = await res.json();
  return Object.fromEntries(users.map(u => [u.id, u.name]));
}

async function main() {
  console.log('Phase 1: Fetching video list...');
  const [videos, authorMap] = await Promise.all([fetchVideoList(), fetchAuthorMap()]);
  console.log(`Found ${videos.length} videos\n`);

  // Phase 2: Fetch all pages and collect YouTube IDs
  console.log('Phase 2: Scanning all video pages for YouTube IDs...');
  const pageData = []; // { slug, title, ids, html, ... }

  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const slug = v.slug;
    const url = `${BASE}/video/${slug}/`;
    process.stdout.write(`[${i+1}/${videos.length}] ${slug.substring(0, 50)}... `);

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MyceliumMigration/1.0)' }
    });

    if (!res.ok) {
      console.log(`HTTP ${res.status}`);
      pageData.push({ v, slug, ids: [], html: '' });
      continue;
    }

    const html = await res.text();
    const ids = getAllYoutubeIds(html);
    console.log(`${ids.length} YouTube IDs`);

    pageData.push({ v, slug, ids, html });
    await sleep(DELAY_MS);
  }

  // Phase 3: Count occurrences of each YouTube ID across all pages
  console.log('\nPhase 3: Counting YouTube ID occurrences...');
  const idCount = {};
  for (const { ids } of pageData) {
    for (const id of ids) {
      idCount[id] = (idCount[id] || 0) + 1;
    }
  }

  // Sort by occurrence count
  const sorted = Object.entries(idCount).sort((a, b) => b[1] - a[1]);
  console.log('\nYouTube ID frequency (top 15):');
  sorted.slice(0, 15).forEach(([id, count]) => {
    console.log(`  ${id}: appears on ${count} pages`);
  });

  // IDs appearing on many pages (>5) are sitewide — exclude them
  const SITEWIDE_THRESHOLD = 5;
  const sitewideIds = new Set(sorted.filter(([, c]) => c > SITEWIDE_THRESHOLD).map(([id]) => id));
  console.log(`\nSitewide IDs (appearing >${SITEWIDE_THRESHOLD} pages): ${[...sitewideIds].join(', ')}`);

  // Phase 4: Build enriched video data
  console.log('\nPhase 4: Building enriched video records...');
  const enriched = [];

  for (const { v, slug, ids, html } of pageData) {
    const title = (v.title?.rendered || slug).replace(/&#\d+;/g, c => {
      const code = c.match(/\d+/)[0];
      return String.fromCodePoint(parseInt(code));
    }).replace(/&amp;/g, '&').replace(/&quot;/g, '"');

    const authorName = v._embedded?.author?.[0]?.name || authorMap[v.author] || extractAuthor(html) || '';
    const thumbnail = html ? extractThumbnail(html) : '';
    const description = html ? extractDescription(html) : '';
    const tags = html ? extractTags(html) : [];

    // Find the page-specific YouTube ID (not sitewide)
    const uniqueIds = ids.filter(id => !sitewideIds.has(id));
    const embedId = uniqueIds[0] || null;

    let youtubeId = embedId;
    let videoUrl = '';
    let videoType = 'youtube';

    if (!embedId) {
      // Check the post-specific section for a non-YouTube video link
      const postLink = html ? extractPostVideoLink(html) : null;
      if (postLink) {
        videoUrl = postLink;
        videoType = postLink.includes('webinarjam') || postLink.includes('zoom') ? 'webinar' : 'other';
        console.log(`  → ${slug.substring(0,40)}: ${videoType} link: ${postLink.substring(0,60)}`);
      } else {
        console.log(`  ⚠  ${slug.substring(0,40)}: no unique video URL found`);
      }
    }

    const embedUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : videoUrl;
    const embedSrc = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}` : '';

    enriched.push({
      id: v.id,
      title,
      slug,
      author: authorName,
      youtubeId: youtubeId || null,
      videoType,
      embedUrl,
      embedSrc,
      description,
      thumbnail,
      tags,
      wpLink: v.link || `${BASE}/video/${slug}/`,
    });
  }

  // Write output
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(enriched, null, 2));

  const withVideo = enriched.filter(v => v.youtubeId).length;
  const withDesc = enriched.filter(v => v.description).length;
  const withThumb = enriched.filter(v => v.thumbnail).length;

  console.log(`\n✓ Saved ${enriched.length} videos → ${OUT}`);
  console.log(`  ${withVideo}/${enriched.length} have YouTube IDs`);
  console.log(`  ${withDesc}/${enriched.length} have descriptions`);
  console.log(`  ${withThumb}/${enriched.length} have thumbnails`);

  // Sample output
  console.log('\nSample records:');
  enriched.slice(0, 3).forEach(v => {
    console.log(`\n  "${v.title.substring(0,50)}"`);
    console.log(`  → youtubeId: ${v.youtubeId}`);
    console.log(`  → author: ${v.author}`);
    console.log(`  → desc: ${v.description.substring(0,80)}...`);
  });
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
