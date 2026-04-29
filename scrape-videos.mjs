/**
 * Fetches all video data from mycelium-learn.com:
 * 1. Gets video list via WP REST API (slugs, titles, featured images, authors)
 * 2. For each video page, fetches rendered HTML and extracts YouTube embed + description
 * 3. Saves enriched data to public/data/videos.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://mycelium-learn.com';
const OUT  = path.join(__dirname, 'public/data/videos.json');

const DELAY_MS = 600; // polite delay between requests

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Extract YouTube watch URL from "Watch Now" button
function extractYoutubeEmbed(html) {
  // Mycelium uses a "Watch Now" button linking to YouTube
  const watchNow = html.match(/href="(https?:\/\/[^"]+youtube[^"]+)"[^>]*>[\s\S]{0,300}Watch Now/);
  if (watchNow) return watchNow[1];

  // Fallback: iframe embed
  const iframe = html.match(/src="(https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/[^"?]+[^"]*)"/);
  if (iframe) return iframe[1];

  // Fallback: any youtube watch URL in button/link
  const anyBtn = html.match(/href="(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]+[^"]*)"/);
  if (anyBtn) return anyBtn[1];

  return null;
}

// Extract video description
function extractDescription(html) {
  // Find the longest meaningful paragraph on the page
  const blocks = [...html.matchAll(/<p>([^<]{60,})<\/p>/g)];
  for (const m of blocks) {
    const text = m[1]
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
      .trim();
    // Skip newsletter/footer text
    if (text.includes('Curated resources') || text.includes('inbox') || text.includes('spam')) continue;
    if (text.length > 60) return text.substring(0, 350);
  }
  return '';
}

// Extract tags from the page
function extractTags(html) {
  const tagMatches = [...html.matchAll(/\/tag\/([^/"]+)"/g)];
  return [...new Set(tagMatches.map(m => decodeURIComponent(m[1]).replace(/-/g, ' ')))].slice(0, 6);
}

// Extract author name — look for "By <Name>" heading
function extractAuthor(html) {
  // Look for headings containing author names
  const byMatch = html.match(/elementor-heading-title[^>]*>(?:By\s+)?([A-Z][a-z]+ [A-Z][a-z]+)<\//);
  if (byMatch) return byMatch[1].trim();

  const byText = html.match(/\bBy\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
  if (byText) return byText[1].trim();

  return '';
}

async function fetchVideoList() {
  const url = `${BASE}/wp-json/wp/v2/video?per_page=100&_fields=id,title,slug,link,featured_media,_embedded&_embed=wp:featuredmedia,author`;
  console.log('Fetching video list...');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`REST API failed: ${res.status}`);
  const videos = await res.json();
  console.log(`Found ${videos.length} videos`);
  return videos;
}

async function fetchAuthorMap() {
  const url = `${BASE}/wp-json/wp/v2/users?per_page=100&_fields=id,name`;
  const res = await fetch(url);
  if (!res.ok) return {};
  const users = await res.json();
  return Object.fromEntries(users.map(u => [u.id, u.name]));
}

async function scrapeVideoPage(slug) {
  const url = `${BASE}/video/${slug}/`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MyceliumMigration/1.0)' }
  });
  if (!res.ok) {
    console.warn(`  ✗ ${slug}: HTTP ${res.status}`);
    return { embedUrl: null, description: '', tags: [] };
  }
  const html = await res.text();
  return {
    embedUrl:    extractYoutubeEmbed(html),
    description: extractDescription(html),
    tags:        extractTags(html),
    author:      extractAuthor(html),
  };
}

async function main() {
  const [videos, authorMap] = await Promise.all([fetchVideoList(), fetchAuthorMap()]);

  const enriched = [];
  let i = 0;

  for (const v of videos) {
    i++;
    const slug  = v.slug;
    const title = v.title?.rendered || slug;
    const wpLink = v.link || `${BASE}/video/${slug}/`;

    // Featured image from _embedded
    let thumbnail = '';
    try {
      thumbnail = v._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    } catch {}

    // Author from _embedded or authorMap
    let author = '';
    try {
      author = v._embedded?.author?.[0]?.name || authorMap[v.author] || '';
    } catch {}

    console.log(`[${i}/${videos.length}] ${title.substring(0, 60)}`);

    const scraped = await scrapeVideoPage(slug);
    if (scraped.author) author = scraped.author; // prefer scraped if found

    const record = {
      id:          v.id,
      title,
      slug,
      author,
      embedUrl:    scraped.embedUrl || '',
      description: scraped.description || '',
      thumbnail,
      tags:        scraped.tags,
      wpLink,
    };

    if (!scraped.embedUrl) {
      console.warn(`  ⚠  No YouTube embed found`);
    } else {
      console.log(`  ✓ embed: ${scraped.embedUrl.substring(0, 60)}`);
    }

    enriched.push(record);
    await sleep(DELAY_MS);
  }

  // Write output
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(enriched, null, 2));

  const withEmbed = enriched.filter(v => v.embedUrl).length;
  const withDesc  = enriched.filter(v => v.description).length;
  console.log(`\n✓ Saved ${enriched.length} videos to ${OUT}`);
  console.log(`  ${withEmbed}/${enriched.length} have embed URLs`);
  console.log(`  ${withDesc}/${enriched.length} have descriptions`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
