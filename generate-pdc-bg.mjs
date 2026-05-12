import fs from 'fs';
import https from 'https';

const envContent = fs.readFileSync('c:/Users/User/Documents/CLAUDE CODE/dividr-mycelium/.env', 'utf8');
const FAL_KEY = envContent.match(/^FAL_KEY=(.+)$/m)?.[1]?.trim();

const PROMPT = `Lush Philippine permaculture food forest at golden hour, wide aerial view of terraced gardens with diverse tropical crops, banana trees, bamboo, sweet potato ground cover, warm amber and green tones, rich abundance, cinematic wide landscape photography, ultra-detailed, no people, golden sunlight raking across the landscape`;

async function post(payload) {
  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'fal.run', path: '/fal-ai/flux/dev', method: 'POST',
      headers: { 'Authorization': `Key ${FAL_KEY}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch { resolve({ status: res.statusCode, body: data }); } });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

async function download(url, dest) {
  fs.mkdirSync('public/images/events', { recursive: true });
  return new Promise((resolve, reject) => {
    const follow = (u) => https.get(u, res => {
      if (res.statusCode === 301 || res.statusCode === 302) return follow(res.headers.location);
      const out = fs.createWriteStream(dest);
      res.pipe(out); out.on('finish', () => { out.close(); resolve(); });
    }).on('error', reject);
    follow(url);
  });
}

console.log('Generating permaculture landscape...');
const result = await post({ prompt: PROMPT, image_size: 'landscape_16_9', num_inference_steps: 28, guidance_scale: 3.5, num_images: 1 });
console.log('Status:', result.status);
if (result.status !== 200) { console.error(JSON.stringify(result.body)); process.exit(1); }
const url = result.body?.images?.[0]?.url;
console.log('✓ Generated:', url);
await download(url, 'public/images/events/pdc-bg.jpg');
console.log('✓ Saved to public/images/events/pdc-bg.jpg');
