/**
 * Re-download cover thumbnails from IG for all existing reels.
 * Run this when covers were set/changed after the initial sync.
 *
 * Usage: node scripts/rethumbnail.mjs
 * Required env: META_LONG_LIVED_TOKEN, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID,
 *               R2_SECRET_ACCESS_KEY, R2_BUCKET
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import http from 'http';
import https from 'https';
import { execSync } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const CONTENT_DIR = './src/content/reels';
const R2_PUBLIC   = 'https://pub-9798291bac7b4e0b84c1d6e37549845c.r2.dev';
const TOKEN       = process.env.META_LONG_LIVED_TOKEN;

function apiFetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Non-JSON from ${url}: ${data.slice(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

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

async function uploadToR2(key, buffer) {
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'image/jpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return `${R2_PUBLIC}/${key}`;
}

async function ffmpegThumb(videoUrl, thumbKey) {
  const tmpVideo = path.join(os.tmpdir(), path.basename(thumbKey, '.jpg') + '.mp4');
  const tmpThumb = path.join(os.tmpdir(), path.basename(thumbKey));
  try {
    execSync(`curl -s -L --max-time 120 -o "${tmpVideo}" "${videoUrl}"`, { stdio: 'pipe' });
    execSync(`ffmpeg -y -ss 3 -i "${tmpVideo}" -vframes 1 -q:v 2 "${tmpThumb}"`, { stdio: 'pipe' });
    const buffer = fs.readFileSync(tmpThumb);
    return { buffer, url: await uploadToR2(thumbKey, buffer) };
  } finally {
    try { fs.unlinkSync(tmpVideo); } catch {}
    try { fs.unlinkSync(tmpThumb); } catch {}
  }
}

async function main() {
  if (!TOKEN) { console.error('META_LONG_LIVED_TOKEN not set'); process.exit(1); }

  const files = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.startsWith('ig-') && f.endsWith('.md'));

  console.log(`Processing ${files.length} IG reels...\n`);
  let updated = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const igId = file.replace(/^ig-/, '').replace(/\.md$/, '');
    const thumbKey = `reels/thumbs/ig-${igId}.jpg`;
    const filePath = path.join(CONTENT_DIR, file);

    process.stdout.write(`${file}: `);

    try {
      // Fetch current thumbnail_url + media_url from IG
      const data = await apiFetch(
        `https://graph.instagram.com/v22.0/${igId}?fields=thumbnail_url,media_url&access_token=${TOKEN}`
      );

      let r2Url;

      if (data.thumbnail_url) {
        const buffer = await fetchBuffer(data.thumbnail_url);
        if (buffer.length >= 5000) {
          // Good thumbnail from IG
          r2Url = await uploadToR2(thumbKey, buffer);
          console.log(`re-uploaded from IG (${buffer.length}B)`);
        } else {
          // IG returned a black/tiny frame — extract via ffmpeg at 3s
          console.log(`IG thumb too small (${buffer.length}B), extracting via ffmpeg...`);
          const result = await ffmpegThumb(data.media_url, thumbKey);
          r2Url = result.url;
          console.log(`extracted via ffmpeg (${result.buffer.length}B)`);
        }
      } else if (data.media_url) {
        console.log(`no thumbnail_url — extracting via ffmpeg...`);
        const result = await ffmpegThumb(data.media_url, thumbKey);
        r2Url = result.url;
        console.log(`extracted via ffmpeg (${result.buffer.length}B)`);
      } else {
        console.log('no thumbnail_url or media_url from IG, skipping');
        skipped++;
        continue;
      }

      // Update the .md file's r2ThumbUrl if it changed
      let content = fs.readFileSync(filePath, 'utf8');
      const newContent = content.replace(/r2ThumbUrl:.*/, `r2ThumbUrl: ${r2Url}`);
      if (newContent !== content) fs.writeFileSync(filePath, newContent, 'utf8');
      updated++;

    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(err => { console.error(err); process.exit(1); });
