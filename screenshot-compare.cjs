const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1440, height: 900 }});
  const p1 = await browser.newPage();
  await p1.goto('https://mycelium-learn.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  await p1.screenshot({ path: 'compare-wp.png', fullPage: true });
  console.log('WP screenshot done');
  const p2 = await browser.newPage();
  await p2.goto('https://mycelium-learn.vercel.app/', { waitUntil: 'networkidle2', timeout: 60000 });
  await p2.screenshot({ path: 'compare-vercel.png', fullPage: true });
  console.log('Vercel screenshot done');
  await browser.close();
})();
