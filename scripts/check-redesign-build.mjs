// Verify the actual generated HTML, including the head content injected by Astro.
// This is read-only: it does not contact the forum, database, or email services.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const root = path.resolve('.vercel/output/static');
const templates = path.resolve('src/redesign/templates');
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? files(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}

let checked = 0;
for (const filename of await files(templates)) {
  if (!filename.endsWith('.json')) continue;
  const template = JSON.parse(await readFile(filename, 'utf8'));
  const relative = path.relative(templates, filename).replaceAll('\\', '/').slice(0, -5);
  const route = relative === 'home' ? '' : relative;
  const html = await readFile(path.join(root, route, 'index.html'), 'utf8');
  const $ = load(html);
  const original = load(template.head);
  assert.ok($('head title').text().trim(), `${route}: missing page title`);
  assert.equal($('meta[name="viewport"]').length, 1, `${route}: missing viewport`);
  // Published article/video details intentionally keep the original Astro design.
  // They no longer consume the redesign's detail-page presentation templates.
  const originalDetail = /^(video\/|resources\/(research|baganihan|baganihan-reports)\/)/.test(route);
  if (originalDetail) {
    assert.equal($('.site-nav').length, 1, `${route}: original navigation missing`);
    assert.ok($('.vd-page, article.ra, article.rpt, article.psp').length, `${route}: original detail layout missing`);
    assert.equal($('.watch-heading, nav.dock, .review-header').length, 0, `${route}: redesign detail shell returned`);
  }
  for (const selector of ['link[rel="stylesheet"]', 'script[src]']) {
    const expected = originalDetail ? $ : original;
    for (const tag of expected(selector).toArray()) {
      const attr = tag.name === 'link' ? 'href' : 'src';
      const url = expected(tag).attr(attr);
      assert.ok($(selector).toArray().some(node => $(node).attr(attr) === url),
        `${route}: missing ${url}`);
      if (url.startsWith('/')) {
        await readFile(path.join(root, new URL(url, 'https://mycelium-learn.com').pathname));
      }
    }
  }
  checked++;
}
assert.ok(checked > 80, 'Expected the full redesign, not a partial build');
assert.deepEqual(
  await readFile(path.join(root, 'common-ground/index.html')),
  await readFile('public/common-ground/index.html'),
  'The build must copy the existing Common Ground forum without changes',
);
console.log(`Verified ${checked} generated pages, their scripts/styles, and unchanged Common Ground HTML.`);
