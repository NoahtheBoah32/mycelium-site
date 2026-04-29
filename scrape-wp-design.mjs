/**
 * Scrapes the WP site visual design for all major pages.
 * Extracts: images, text, color palette, fonts, section structure.
 * Output: public/data/wp-pages.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://mycelium-learn.com';
const OUT = path.join(__dirname, 'public/data/wp-pages.json');

const PAGES = [
  { slug: '/', name: 'home' },
  { slug: '/about/', name: 'about' },
  { slug: '/videos/', name: 'videos' },
  { slug: '/courses/', name: 'courses' },
  { slug: '/resources/', name: 'resources' },
  { slug: '/events/', name: 'events' },
];

function extractImages(html) {
  const imgs = new Set();
  // src attributes
  for (const m of html.matchAll(/src="(https?:\/\/mycelium-learn\.com\/wp-content\/uploads\/[^"]+)"/g)) imgs.add(m[1]);
  // data-src (lazy)
  for (const m of html.matchAll(/data-src="(https?:\/\/mycelium-learn\.com\/wp-content\/uploads\/[^"]+)"/g)) imgs.add(m[1]);
  // srcset
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(' ')[0];
      if (url.includes('mycelium-learn.com/wp-content')) imgs.add(url);
    }
  }
  // og:image
  for (const m of html.matchAll(/property="og:image"\s+content="([^"]+)"/g)) imgs.add(m[1]);
  for (const m of html.matchAll(/content="([^"]+)"\s+property="og:image"/g)) imgs.add(m[1]);
  // CSS background-image
  for (const m of html.matchAll(/url\(['"]?(https?:\/\/mycelium-learn\.com\/wp-content\/uploads\/[^'")\s]+)['"]?\)/g)) imgs.add(m[1]);
  return [...imgs];
}

function extractTextBlocks(html) {
  // Get the main content area (everything inside body, excluding scripts/styles)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) return [];

  let body = bodyMatch[1];
  // Remove scripts
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Remove styles
  body = body.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove comments
  body = body.replace(/<!--[\s\S]*?-->/g, '');

  const blocks = [];

  // H1s
  for (const m of body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#\d+;/g, '').trim();
    if (text.length > 3) blocks.push({ type: 'h1', text });
  }
  // H2s
  for (const m of body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#\d+;/g, '').trim();
    if (text.length > 3) blocks.push({ type: 'h2', text });
  }
  // H3s
  for (const m of body.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#\d+;/g, '').trim();
    if (text.length > 3) blocks.push({ type: 'h3', text });
  }
  // Paragraphs
  for (const m of body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#\d+;/g, '').trim();
    if (text.length > 20) blocks.push({ type: 'p', text: text.substring(0, 500) });
  }

  // Deduplicate
  const seen = new Set();
  return blocks.filter(b => {
    if (seen.has(b.text)) return false;
    seen.add(b.text);
    return true;
  });
}

function extractColors(html) {
  const colors = new Set();
  for (const m of html.matchAll(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g)) colors.add('#' + m[1]);
  return [...colors].slice(0, 30);
}

function extractFonts(html) {
  const fonts = new Set();
  for (const m of html.matchAll(/font-family:\s*['"]?([^;'"<>]+?)['"]?\s*[;{]/g)) fonts.add(m[1].trim());
  for (const m of html.matchAll(/family=([^&"]+)/g)) fonts.add(decodeURIComponent(m[1].split(':')[0]));
  return [...fonts].slice(0, 10);
}

function extractButtons(html) {
  const btns = [];
  for (const m of html.matchAll(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[1];
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (text.length > 1 && text.length < 80) btns.push({ text, href });
  }
  const seen = new Set();
  return btns.filter(b => {
    if (seen.has(b.text)) return false;
    seen.add(b.text);
    return true;
  }).slice(0, 30);
}

function extractSectionBackgrounds(html) {
  const bgs = [];
  // Look for elementor sections with background colors
  for (const m of html.matchAll(/elementor-section[^>]+style="[^"]*background-color:\s*([^;"]+)/gi)) {
    bgs.push(m[1].trim());
  }
  // Also catch inline background-color on divs/sections
  for (const m of html.matchAll(/background-color:\s*(#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\))/gi)) {
    bgs.push(m[1].trim());
  }
  return [...new Set(bgs)].slice(0, 20);
}

async function scrapePage(slug, name) {
  const url = `${BASE}${slug}`;
  console.log(`Scraping ${name}: ${url}`);

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MyceliumScraper/1.0)' }
  });

  if (!res.ok) {
    console.log(`  HTTP ${res.status}`);
    return { name, slug, error: res.status };
  }

  const html = await res.text();
  const images = extractImages(html);
  const textBlocks = extractTextBlocks(html);
  const colors = extractColors(html);
  const fonts = extractFonts(html);
  const buttons = extractButtons(html);
  const sectionBgs = extractSectionBackgrounds(html);

  console.log(`  Images: ${images.length}, Text blocks: ${textBlocks.length}, Colors: ${colors.length}`);

  return { name, slug, url, images, textBlocks, colors, fonts, buttons, sectionBgs };
}

async function main() {
  const results = {};
  for (const page of PAGES) {
    results[page.name] = await scrapePage(page.slug, page.name);
    await new Promise(r => setTimeout(r, 300));
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
  console.log(`\nSaved to ${OUT}`);

  // Print a summary
  for (const [name, data] of Object.entries(results)) {
    if (data.error) continue;
    console.log(`\n=== ${name.toUpperCase()} ===`);
    console.log(`Images (${data.images.length}):`);
    data.images.slice(0, 5).forEach(u => console.log(`  ${u}`));
    console.log(`Headings:`);
    data.textBlocks.filter(b => b.type !== 'p').slice(0, 8).forEach(b => console.log(`  [${b.type}] ${b.text.substring(0, 80)}`));
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
