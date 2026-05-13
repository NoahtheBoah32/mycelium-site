/**
 * Generate Color Flora botanical background for workshop card
 * Golden roses / marigolds, warm amber, olive green — editorial still life
 */

import fs from 'fs';
import https from 'https';

const envContent = fs.readFileSync('c:/Users/User/Documents/CLAUDE CODE/dividr-mycelium/.env', 'utf8');
const FAL_KEY = envContent.match(/^FAL_KEY=(.+)$/m)?.[1]?.trim();
if (!FAL_KEY) { console.error('FAL_KEY not found'); process.exit(1); }
console.log('✓ FAL_KEY loaded');

const PROMPT = `Editorial macro still life photograph of golden yellow marigolds and amber roses arranged with dried sage and olive leaves on warm dark linen, pressed botanical specimens, honey-colored petals catching warm side light, deep olive-green foliage in foreground, rich amber and golden yellow tones, moody editorial botanical photography, extremely detailed textures, shallow depth of field with soft bokeh, film grain, no people, no text, no AI-looking elements`;

async function post(payload) {
  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'fal.run',
      path: '/fal-ai/flux/dev',
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
  fs.mkdirSync('public/images/events', { recursive: true });
  return new Promise((resolve, reject) => {
    const follow = (u) => https.get(u, res => {
      if (res.statusCode === 301 || res.statusCode === 302) return follow(res.headers.location);
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on('finish', () => { out.close(); resolve(); });
    }).on('error', reject);
    follow(url);
  });
}

console.log('Generating Color Flora workshop background...');
const result = await post({
  prompt: PROMPT,
  image_size: 'landscape_16_9',
  num_inference_steps: 32,
  guidance_scale: 4.0,
  num_images: 1,
});

console.log('Status:', result.status);
if (result.status !== 200) { console.error(JSON.stringify(result.body, null, 2)); process.exit(1); }

const url = result.body?.images?.[0]?.url;
if (!url) { console.error('No image URL:', JSON.stringify(result.body)); process.exit(1); }

console.log('✓ Generated:', url);
await download(url, 'public/images/events/workshop-botanical-bg.jpg');
console.log('✓ Saved to public/images/events/workshop-botanical-bg.jpg');
