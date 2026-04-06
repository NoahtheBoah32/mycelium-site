const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://mycelium-learn.com', { waitUntil: 'networkidle2', timeout: 60000 });

  // Scroll to load everything
  await page.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 400) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 2000));

  // Extract structured data
  const data = await page.evaluate(() => {
    const navLinks = [];
    document.querySelectorAll('header a, nav a').forEach(a => {
      if (a.textContent.trim() && a.href) navLinks.push({ text: a.textContent.trim(), href: a.pathname || a.href });
    });

    const images = [];
    document.querySelectorAll('img').forEach(img => {
      if (img.src && img.naturalWidth > 100) {
        images.push({ src: img.src, alt: img.alt, w: img.naturalWidth, h: img.naturalHeight });
      }
    });

    const textEls = [];
    document.querySelectorAll('h1, h2, h3, h4, p, a.wp-block-button__link').forEach(el => {
      const cs = getComputedStyle(el);
      const text = el.textContent.trim();
      if (text && text.length > 2 && text.length < 500) {
        const font = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
        textEls.push({
          tag: el.tagName,
          text: text.substring(0, 200),
          font,
          size: cs.fontSize,
          weight: cs.fontWeight,
          color: cs.color
        });
      }
    });

    // Get section backgrounds
    const sectionBgs = [];
    document.querySelectorAll('[class*=e-con], [class*=section], [class*=hero]').forEach(el => {
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      if (bg !== 'rgba(0, 0, 0, 0)') {
        sectionBgs.push({ bg, text: el.textContent.substring(0, 40).trim() });
      }
    });

    return { navLinks: navLinks.slice(0, 15), images: images.slice(0, 20), textEls: textEls.slice(0, 60), sectionBgs };
  });

  fs.writeFileSync('C:/Users/User/Documents/CLAUDE CODE/mycelium/wp-data.json', JSON.stringify(data, null, 2));
  console.log('Extracted:', data.navLinks.length, 'nav links,', data.images.length, 'images,', data.textEls.length, 'text elements');
  await browser.close();
})();
