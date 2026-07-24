/**
 * Tag every video in public/data/videos.json.
 * Origin tag (Philippines / International) is derived from the author.
 * Format tags come from the existing `category`/`series` fields.
 * Idempotent: re-running rebuilds tags from source fields rather than appending.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, '..', 'public', 'data', 'videos.json');

// Philippine-based creators. Everyone else is international.
const PH_AUTHORS = new Set([
  'Hubert Posadas',
  'Bert Peeters and Sixto Bereber',
  'Ben Francia',
  'Garbi Jover',
]);

const videos = JSON.parse(fs.readFileSync(FILE, 'utf8'));

for (const v of videos) {
  const author = (v.author || '').trim();
  const tags = [PH_AUTHORS.has(author) ? 'Philippines' : 'International'];

  // format tag from the existing category field
  const cat = (v.category || '').trim();
  if (cat && !tags.includes(cat)) tags.push(cat);

  // make sure podcasts are caught even where category is blank
  const podcastish = /podcast/i.test(v.title || '') || /podcast/i.test(v.series || '');
  if (podcastish && !tags.includes('Podcast')) tags.push('Podcast');

  v.tags = tags;
}

fs.writeFileSync(FILE, JSON.stringify(videos, null, 2) + '\n', 'utf8');

// report
const tally = {};
videos.forEach(v => v.tags.forEach(t => (tally[t] = (tally[t] || 0) + 1)));
console.log(`tagged ${videos.length} videos`);
Object.entries(tally)
  .sort((a, b) => b[1] - a[1])
  .forEach(([t, n]) => console.log(`  ${t.padEnd(18)} ${n}`));
const untagged = videos.filter(v => !v.tags.length).length;
console.log(`untagged: ${untagged}`);
