/**
 * Mirror a remote URL to Cloudflare R2.
 * Usage (standalone): node scripts/mirror-to-r2.mjs <url> <key>
 * Usage (module):     import { mirrorToR2 } from './mirror-to-r2.mjs'
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import https from 'https';
import http from 'http';

function getClient() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
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

function contentType(key) {
  if (key.endsWith('.mp4'))  return 'video/mp4';
  if (key.endsWith('.jpg') || key.endsWith('.jpeg')) return 'image/jpeg';
  if (key.endsWith('.png'))  return 'image/png';
  if (key.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

export async function mirrorToR2(sourceUrl, key) {
  const client = getClient();
  const bucket = process.env.R2_BUCKET;

  // Skip if already uploaded
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    console.log(`  ↩ already in R2: ${key}`);
    return `https://pub-9798291bac7b4e0b84c1d6e37549845c.r2.dev/${key}`;
  } catch {
    // not found — proceed
  }

  console.log(`  ↑ mirroring ${sourceUrl} → ${key}`);
  const buffer = await fetchBuffer(sourceUrl);
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType(key),
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  return `https://pub-9798291bac7b4e0b84c1d6e37549845c.r2.dev/${key}`;
}

// Standalone test: node scripts/mirror-to-r2.mjs <url> <key>
if (process.argv[2] && process.argv[3]) {
  const url = process.argv[2];
  const key = process.argv[3];
  const result = await mirrorToR2(url, key);
  console.log('✓ Public URL:', result);
}
