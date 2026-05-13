/**
 * Sync reels from Instagram into src/content/reels/
 * Runs daily via GitHub Actions. Safe to re-run (idempotent).
 *
 * Required env vars:
 *   META_LONG_LIVED_TOKEN  — Instagram long-lived user token (60-day, auto-refreshed)
 *   IG_USER_ID             — Numeric Instagram user ID for @mycelium.learn
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 */

import fs from 'fs';
import https from 'https';
import http from 'http';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mirrorToR2 } from './mirror-to-r2.mjs';

const R2_PUBLIC = 'https://mycelium-r2.joaquinriego32.workers.dev';

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const follow = (u) => {
      const mod = u.startsWith('https') ? https : http;
      mod.get(u, res => {
        if (res.statusCode === 301 || res.statusCode === 302) return follow(res.headers.location);
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }).on('error', reject);
    };
    follow(url);
  });
}

async function mirrorBufferToR2(buffer, key) {
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
  });
  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET, Key: key, Body: buffer,
    ContentType: 'image/jpeg', CacheControl: 'public, max-age=31536000, immutable',
  }));
  return `${R2_PUBLIC}/${key}`;
}

const CONTENT_DIR = './src/content/reels';

// ─── helpers ────────────────────────────────────────────────────────────────

async function extractThumbnail(videoUrl, thumbKey) {
  const tmpVideo = path.join(os.tmpdir(), `${path.basename(thumbKey, '.jpg')}.mp4`);
  const tmpThumb = path.join(os.tmpdir(), path.basename(thumbKey));
  try {
    // Download just the first few seconds of the video
    execSync(`curl -s -L --max-time 60 -o "${tmpVideo}" "${videoUrl}"`, { stdio: 'pipe' });
    // Extract frame at 1 second (more likely to be a visible frame than 0s)
    execSync(`ffmpeg -y -ss 1 -i "${tmpVideo}" -vframes 1 -q:v 2 "${tmpThumb}"`, { stdio: 'pipe' });
    // Upload thumb to R2 using S3 client directly (file:// not supported by mirrorToR2)
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
    });
    await client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET, Key: thumbKey,
      Body: fs.readFileSync(tmpThumb), ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    return `https://mycelium-r2.joaquinriego32.workers.dev/${thumbKey}`;
  } catch (err) {
    console.warn(`  ffmpeg thumbnail failed: ${err.message}`);
    return null;
  } finally {
    try { fs.unlinkSync(tmpVideo); } catch {}
    try { fs.unlinkSync(tmpThumb); } catch {}
  }
}

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

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  const existing = existingSlugs();
  console.log(`Existing reels: ${existing.size}`);

  let created = 0;

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
      if (reel.thumbnail_url) {
        const thumbBuf = await fetchBuffer(reel.thumbnail_url);
        if (thumbBuf.length >= 5000) {
          r2ThumbUrl = await mirrorBufferToR2(thumbBuf, thumbKey);
        } else {
          console.log(`  IG thumbnail too small (${thumbBuf.length}B) — extracting via ffmpeg`);
          r2ThumbUrl = await extractThumbnail(reel.media_url, thumbKey);
        }
      } else if (r2VideoUrl) {
        console.log(`  No thumbnail_url from IG — extracting via ffmpeg`);
        r2ThumbUrl = await extractThumbnail(reel.media_url, thumbKey);
      }
    } catch (err) {
      console.error(`  Mirror failed for ${reel.id}:`, err.message);
      continue;
    }

    if (!r2VideoUrl) { console.warn(`  No video URL for ${reel.id}, skipping`); continue; }

    writeMd(fileSlug, 'instagram', reel.permalink, r2VideoUrl, r2ThumbUrl, caption, postedAt);
    created++;
  }

  console.log(`\nDone. Created ${created} new reel(s).`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
