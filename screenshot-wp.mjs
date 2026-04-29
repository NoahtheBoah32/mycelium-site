import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'wp-screenshots');
fs.mkdirSync(OUT, { recursive: true });

const BASE = 'https://mycelium-learn.com';
const PAGES = [
  { name: 'home', url: '/' },
  { name: 'about', url: '/about/' },
  { name: 'videos', url: '/videos/' },
  { name: 'courses', url: '/courses/' },
  { name: 'resources', url: '/resources/' },
  { name: 'events', url: '/events/' },
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 120);
    });
  });
  await new Promise(r => setTimeout(r, 2000));
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Login
  console.log('Logging in...');
  await page.goto(`${BASE}/login/`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.type('#user_login', 'joaquin');
  await page.type('#user_pass', 'TZfyxyx9FrOFjEyT8i#4DD!b');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('#wp-submit'),
  ]);
  console.log('Logged in:', page.url());

  for (const { name, url } of PAGES) {
    console.log(`Screenshotting ${name}...`);
    await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle2', timeout: 40000 });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll to trigger lazy load
    await autoScroll(page);

    // Wait for any remaining network activity
    await new Promise(r => setTimeout(r, 3000));

    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const stat = fs.statSync(file);
    console.log(`  Saved ${name}.png (${Math.round(stat.size/1024)}KB)`);
  }

  await browser.close();
  console.log('\nDone:', OUT);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
