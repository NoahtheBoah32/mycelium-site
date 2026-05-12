/**
 * Generate atmospheric forest background for the events section
 * Uses fal.ai Nano Banana 2 — saves to public/images/events-bg.jpg
 */

import fs from 'fs';
import https from 'https';

const envContent = fs.readFileSync('c:/Users/User/Documents/CLAUDE CODE/dividr-mycelium/.env', 'utf8');
const FAL_KEY = envContent.match(/^FAL_KEY=(.+)$/m)?.[1]?.trim();
if (!FAL_KEY) { console.error('FAL_KEY not found in .env'); process.exit(1); }
console.log('✓ FAL_KEY loaded');

const MODEL = 'fal-ai/flux/dev';

const PROMPT = `Dense lush tropical rainforest understory at twilight, Philippine jungle floor, intricate aerial roots hanging from dark canopy, fern fronds and moss-covered branches, bioluminescent patches on bark, dappled amber light filtering through dense foliage, rich deep forest atmosphere, extremely detailed botanical photography, dark moody cinematic wide shot, editorial nature photography, deep rich greens and earthy dark tones, photorealistic`;

async function post(payload) {
  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'fal.run',
      path: `/${MODEL}`,
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on('finish', () => { out.close(); resolve(); });
    });
    req.on('error', reject);
  });
}

console.log('Generating image...');
console.log(`Model: ${MODEL}`);
console.log(`Prompt: ${PROMPT.slice(0, 80)}...`);

const result = await post({
  prompt: PROMPT,
  image_size: 'landscape_16_9',
  num_inference_steps: 28,
  guidance_scale: 3.5,
  num_images: 1,
});

console.log('Status:', result.status);

if (result.status !== 200) {
  console.error('Error response:', JSON.stringify(result.body, null, 2));
  process.exit(1);
}

const images = result.body?.images;
if (!images || images.length === 0) {
  console.error('No images in response:', JSON.stringify(result.body, null, 2));
  process.exit(1);
}

const imageUrl = images[0].url;
console.log('✓ Image generated:', imageUrl);

const dest = 'public/images/events-bg.jpg';
console.log(`Downloading to ${dest}...`);
await download(imageUrl, dest);
console.log(`✓ Saved to ${dest}`);
