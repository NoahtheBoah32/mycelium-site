/**
 * Sync reels from Instagram + Facebook into src/content/reels/
 * Runs daily via GitHub Actions. Safe to re-run (idempotent).
 *
 * Required env vars:
 *   META_LONG_LIVED_TOKEN  — Instagram long-lived user token (60-day, auto-refreshed)
 *   IG_USER_ID             — Numeric Instagram user ID for @mycelium.learn
 *   FB_PAGE_ID             — Numeric Facebook Page ID for mycelium.learn
 *   FB_PAGE_TOKEN          — Facebook Page access token
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 */

import fs from 'fs';
import https from 'https';
import path from 'path';
import { mirrorToR2 } from './mirror-to-r2.mjs';

const CONTENT_DIR = './src/content/reels';

// ─── helpers ────────────────────────────────────────────────────────────────

function apiFetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Non-JSON response from ${url}: ${data.slice(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

function slug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function existingSlugs() {
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
  return new Set(
    fs.readdirSync(CONTENT_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(/\.md$/, ''))
  );
}

function writeMd(fileSlug, platform, permalink, r2VideoUrl, r2ThumbUrl, caption, postedAt) {
  const frontmatter = [
    '---',
    `platform: ${platform}`,
    `permalink: ${permalink}`,
    `r2VideoUrl: ${r2VideoUrl}`,
    r2ThumbUrl ? `r2ThumbUrl: ${r2ThumbUrl}` : null,
    caption ? `caption: "${caption.replace(/"/g, '\\"').replace(/\n/g, ' ').trim()}"` : null,
    `postedAt: ${postedAt}`,
    `hidden: false`,
    '---',
  ].filter(Boolean).join('\n');

  const filePath = path.join(CONTENT_DIR, `${fileSlug}.md`);
  fs.writeFileSync(filePath, frontmatter + '\n');
  console.log(`  ✓ wrote ${filePath}`);
}

// ─── Instagram ───────────────────────────────────────────────────────────────

async function fetchIGReels() {
  const token = process.env.META_LONG_LIVED_TOKEN;
  const userId = process.env.IG_USER_ID;
  if (!token || !userId) throw new Error('META_LONG_LIVED_TOKEN or IG_USER_ID not set');

  const fields = 'id,media_type,media_product_type,permalink,media_url,thumbnail_url,caption,timestamp';
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&access_token=${token}&limit=50`;

  const data = await apiFetch(url);
  if (data.error) throw new Error(`IG API error: ${data.error.message}`);

  return (data.data || []).filter(m => m.media_product_type === 'REELS');
}

// ─── Facebook ────────────────────────────────────────────────────────────────

async function fetchFBReels() {
  const token = process.env.FB_PAGE_TOKEN;
  const pageId = process.env.FB_PAGE_ID;
  if (!token || !pageId) throw new Error('FB_PAGE_TOKEN or FB_PAGE_ID not set');

  const url = `https://graph.facebook.com/v21.0/${pageId}/video_reels?fields=id,permalink_url,source,description,created_time&access_token=${token}&limit=50`;

  const data = await apiFetch(url);
  if (data.error) throw new Error(`FB API error: ${data.error.message}`);

  return data.data || [];
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  const existing = existingSlugs();
  console.log(`Existing reels: ${existing.size}`);

  let created = 0;

  // Instagram
  console.log('\nFetching Instagram reels...');
  let igReels = [];
  try {
    igReels = await fetchIGReels();
    console.log(`Found ${igReels.length} IG reels`);
  } catch (err) {
    console.error('IG fetch failed:', err.message);
  }

  for (const reel of igReels) {
    const postedAt = reel.timestamp?.slice(0, 10);
    const caption = reel.caption || '';
    const fileSlug = `ig-${reel.id}`;

    if (existing.has(fileSlug)) continue;

    console.log(`\nNew IG reel: ${reel.id}`);
    const videoKey = `reels/${fileSlug}.mp4`;
    const thumbKey = `reels/thumbs/${fileSlug}.jpg`;

    let r2VideoUrl, r2ThumbUrl;
    try {
      if (reel.media_url) r2VideoUrl = await mirrorToR2(reel.media_url, videoKey);
      if (reel.thumbnail_url) r2ThumbUrl = await mirrorToR2(reel.thumbnail_url, thumbKey);
    } catch (err) {
      console.error(`  Mirror failed for ${reel.id}:`, err.message);
      continue;
    }

    if (!r2VideoUrl) { console.warn(`  No video URL for ${reel.id}, skipping`); continue; }

    writeMd(fileSlug, 'instagram', reel.permalink, r2VideoUrl, r2ThumbUrl, caption, postedAt);
    created++;
  }

  // Facebook
  console.log('\nFetching Facebook reels...');
  let fbReels = [];
  try {
    fbReels = await fetchFBReels();
    console.log(`Found ${fbReels.length} FB reels`);
  } catch (err) {
    console.error('FB fetch failed:', err.message);
  }

  for (const reel of fbReels) {
    const postedAt = reel.created_time?.slice(0, 10);
    const caption = reel.description || '';
    const fileSlug = `fb-${reel.id}`;

    if (existing.has(fileSlug)) continue;

    console.log(`\nNew FB reel: ${reel.id}`);
    const videoKey = `reels/${fileSlug}.mp4`;
    const thumbKey = `reels/thumbs/${fileSlug}.jpg`;

    let r2VideoUrl, r2ThumbUrl;
    try {
      if (reel.source) r2VideoUrl = await mirrorToR2(reel.source, videoKey);
    } catch (err) {
      console.error(`  Mirror failed for ${reel.id}:`, err.message);
      continue;
    }

    if (!r2VideoUrl) { console.warn(`  No video URL for ${reel.id}, skipping`); continue; }

    writeMd(fileSlug, 'facebook', reel.permalink_url, r2VideoUrl, r2ThumbUrl, caption, postedAt);
    created++;
  }

  console.log(`\nDone. Created ${created} new reel(s).`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
