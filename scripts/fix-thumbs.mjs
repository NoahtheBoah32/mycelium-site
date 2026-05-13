/**
 * Fix thumbnails for specific broken reels only.
 * Downloads the reel video from R2, extracts a frame via ffmpeg, uploads as thumbnail.
 * Run via: node scripts/fix-thumbs.mjs
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const CONTENT_DIR = './src/content/reels';
const R2_PUBLIC   = 'https://pub-9798291bac7b4e0b84c1d6e37549845c.r2.dev';

// Only these reels — nothing else is touched
const TARGET_SLUGS = [
  'ig-18549459475069335',
  'ig-18086815823590485',
  'ig-18005635097867097',
  'ig-18107914669909252',
  'ig-18102968809950151',
  'ig-17858508180636290',
];

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const follow = (u) => {
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

async function extractFrame(videoUrl, thumbKey, offsetSecs = 3) {
  const tmpVideo = path.join(os.tmpdir(), path.basename(thumbKey, '.jpg') + '.mp4');
  const tmpThumb = path.join(os.tmpdir(), path.basename(thumbKey));
  try {
    process.stdout.write(`  downloading video...`);
    const videoBuffer = await fetchBuffer(videoUrl);
    fs.writeFileSync(tmpVideo, videoBuffer);
    process.stdout.write(` ${(videoBuffer.length / 1e6).toFixed(1)}MB, extracting frame at ${offsetSecs}s...`);
    execSync(`ffmpeg -y -ss ${offsetSecs} -i "${tmpVideo}" -vframes 1 -q:v 2 "${tmpThumb}"`, { stdio: 'pipe' });
    const thumbBuffer = fs.readFileSync(tmpThumb);
    process.stdout.write(` ${thumbBuffer.length}B\n`);
    return { buffer: thumbBuffer, url: await uploadToR2(thumbKey, thumbBuffer) };
  } finally {
    try { fs.unlinkSync(tmpVideo); } catch {}
    try { fs.unlinkSync(tmpThumb); } catch {}
  }
}

async function main() {
  const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) { console.error('Missing env vars:', missing.join(', ')); process.exit(1); }

  console.log(`Fixing thumbnails for ${TARGET_SLUGS.length} reels...\n`);
  let fixed = 0, failed = 0;

  for (const slug of TARGET_SLUGS) {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) { console.log(`${slug}: file not found, skipping`); continue; }

    const content = fs.readFileSync(filePath, 'utf8');
    const videoUrl = content.match(/r2VideoUrl: (.+)/)?.[1]?.trim();
    if (!videoUrl) { console.log(`${slug}: no r2VideoUrl, skipping`); continue; }

    process.stdout.write(`${slug}:`);
    try {
      const thumbKey = `reels/thumbs/${slug}.jpg`;
      const { url } = await extractFrame(videoUrl, thumbKey);
      const newContent = content.replace(/r2ThumbUrl:.*/, `r2ThumbUrl: ${url}`);
      if (newContent !== content) fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`  ✓ updated`);
      fixed++;
    } catch (err) {
      console.log(`  FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Fixed: ${fixed}, Failed: ${failed}`);
}

main().catch(err => { console.error(err); process.exit(1); });
