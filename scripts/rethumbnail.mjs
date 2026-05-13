/**
 * Re-download cover thumbnails from IG for all existing reels.
 * Run this when covers were set/changed after the initial sync.
 *
 * Usage: node scripts/rethumbnail.mjs
 * Required env: META_LONG_LIVED_TOKEN, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID,
 *               R2_SECRET_ACCESS_KEY, R2_BUCKET
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
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
      const mod = u.startsWith('https') ? https : (await import('http')).default;
      https.get(u, res => {
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
      // Fetch current thumbnail_url from IG
      const data = await apiFetch(
        `https://graph.instagram.com/v22.0/${igId}?fields=thumbnail_url&access_token=${TOKEN}`
      );

      if (!data.thumbnail_url) {
        console.log('no thumbnail_url from IG, skipping');
        skipped++;
        continue;
      }

      // Download thumbnail
      const buffer = await fetchBuffer(data.thumbnail_url);
      if (buffer.length < 1000) {
        console.log(`suspicious size (${buffer.length}B), skipping`);
        skipped++;
        continue;
      }

      // Upload to R2 (overwrites existing)
      const r2Url = await uploadToR2(thumbKey, buffer);

      // Update the .md file's r2ThumbUrl if it changed
      let content = fs.readFileSync(filePath, 'utf8');
      const newContent = content.replace(/r2ThumbUrl:.*/, `r2ThumbUrl: ${r2Url}`);
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`updated (${buffer.length}B)`);
      } else {
        console.log(`re-uploaded (${buffer.length}B)`);
      }
      updated++;

    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(err => { console.error(err); process.exit(1); });
