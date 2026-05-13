import { YoutubeTranscript } from 'youtube-transcript';
import { readFileSync, writeFileSync } from 'fs';

const GEMINI_KEY = 'AIzaSyB8DpQCkxHWE6A1Bc1ztYPjrAUFXQFTZJs';
const VIDEOS_PATH = './public/data/videos.json';

// New videos to add
const NEW_VIDEOS = [
  {
    ytId: 'ybSID4xdGis',
    title: 'Exploring the Food Forests of Zaytuna Farm',
    author: 'Geoff Lawton',
    authorRole: 'Permaculture Consultant & Designer',
    authorBio: 'Geoff Lawton is a world renowned permaculture consultant, designer and teacher. He first took his Permaculture Design Certificate (PDC) Course in 1983 with Bill Mollison, widely considered the "father of permaculture." Geoff has undertaken thousands of jobs teaching, consulting, designing, administering and implementing, in 6 continents and over 50 countries around the world.',
    authorThumb: null,
    category: 'Visual Learning',
    type: 'food-forest',
  },
  {
    ytId: 'RDCFbfcRcUE',
    title: 'Water is the Foundation of Permaculture Design',
    author: 'Andrew Millison',
    authorRole: 'Permaculture Educator & Professor',
    authorBio: 'Andrew Millison is a permaculture educator and professor at Oregon State University who teaches Introduction to Permaculture — one of the world\'s most-enrolled online permaculture courses. He is dedicated to spreading practical permaculture knowledge through clear, accessible teaching.',
    authorThumb: null,
    category: 'Visual Learning',
    type: 'water',
  },
  {
    ytId: 'TI_6OAnIcDI',
    title: 'How to Compost Simply',
    author: 'Morag Gamble',
    authorRole: 'Permaculture Designer & Educator',
    authorBio: 'Morag Gamble is an internationally recognised permaculture educator, filmmaker, speaker, and author based in Australia. Founder of Our Permaculture Life and the Permaculture Education Institute, she has been designing and teaching permaculture across the world for over 25 years.',
    authorThumb: null,
    category: 'Visual Learning',
    type: 'community',
  },
  {
    ytId: 'UOR5JUOMmQQ',
    title: 'Keyline Design: A Regenerative Agriculture Tool',
    author: 'Darren Doherty',
    authorRole: 'Regenerative Agriculture Designer',
    authorBio: 'Darren Doherty is one of the world\'s leading regenerative agriculture designers and the creator of Regrarians, a framework for holistic land design. He has worked across six continents designing landscapes that restore water cycles, build soil, and create productive farm systems.',
    authorThumb: null,
    category: 'Visual Learning',
    type: 'agroforestry',
  },
  {
    ytId: 'JZPjzIBquPM',
    title: 'A Secret Technique to Growing Plants from Seed',
    author: 'Stefan Sobkowiak',
    authorRole: 'Permaculture Orchardist',
    authorBio: 'Stefan Sobkowiak is the founder of Miracle Farms, a commercial permaculture orchard in Quebec, Canada. He applies permaculture design principles to fruit tree cultivation and food forest management, and shares practical growing techniques through The Permaculture Orchard channel.',
    authorThumb: null,
    category: 'Visual Learning',
    type: 'food-forest',
  },
];

function slugify(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function getTranscript(ytId) {
  try {
    const items = await YoutubeTranscript.fetchTranscript(ytId, { lang: 'en' });
    return items.map(i => i.text).join(' ').slice(0, 8000);
  } catch {
    try {
      const items = await YoutubeTranscript.fetchTranscript(ytId);
      return items.map(i => i.text).join(' ').slice(0, 8000);
    } catch {
      return null;
    }
  }
}

async function summarise(title, author, transcript) {
  const prompt = `You are writing the "About This Video" section for a permaculture education platform called Mycelium.

Video title: "${title}"
Creator: ${author}

Transcript excerpt:
${transcript}

Write a 3–5 sentence summary of what this video is actually about — the specific topic, techniques, or ideas covered. Be concrete and specific to this video's content. Do not start with the creator's name or bio. Do not use phrases like "In this video" or "This video covers". Just describe the subject matter directly, in an engaging but educational tone. Plain text only, no markdown.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 600, thinkingConfig: { thinkingBudget: 0 } }
      })
    }
  );
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const textPart = parts.filter(p => !p.thought).at(-1);
  return textPart?.text?.trim() || null;
}

async function main() {
  const videos = JSON.parse(readFileSync(VIDEOS_PATH, 'utf-8'));
  const existingIds = new Set(videos.map(v => v.youtubeId).filter(Boolean));
  const existingEmbedIds = new Set(
    videos.map(v => {
      const m = (v.embedUrl || '').match(/(?:[?&]v=)([A-Za-z0-9_-]{11})/);
      return m ? m[1] : null;
    }).filter(Boolean)
  );
  const allExisting = new Set([...existingIds, ...existingEmbedIds]);

  let maxId = Math.max(...videos.map(v => v.id));

  for (const nv of NEW_VIDEOS) {
    if (allExisting.has(nv.ytId)) {
      console.log(`SKIP  ${nv.ytId} — already in library`);
      continue;
    }

    process.stdout.write(`FETCH ${nv.ytId} ${nv.title.slice(0, 45)}... `);
    const transcript = await getTranscript(nv.ytId);

    let about = null;
    if (transcript) {
      about = await summarise(nv.title, nv.author, transcript);
    }

    if (!about) {
      console.log('no transcript/summary — skipping');
      continue;
    }

    maxId++;
    const entry = {
      id: maxId,
      title: nv.title,
      slug: slugify(nv.title),
      author: nv.author,
      youtubeId: nv.ytId,
      videoType: 'other',
      embedUrl: `https://www.youtube.com/watch?v=${nv.ytId}`,
      embedSrc: '',
      description: about.slice(0, 200),
      thumbnail: `https://img.youtube.com/vi/${nv.ytId}/hqdefault.jpg`,
      tags: [],
      wpLink: null,
      about,
      idealFor: null,
      category: nv.category,
      series: null,
      authorRole: nv.authorRole,
      authorBio: nv.authorBio,
      authorThumb: nv.authorThumb,
    };

    videos.push(entry);
    allExisting.add(nv.ytId);
    writeFileSync(VIDEOS_PATH, JSON.stringify(videos, null, 2), 'utf-8');
    console.log(`done (id ${maxId})`);
    await new Promise(r => setTimeout(r, 800));
  }

  console.log(`\nDone. Total videos: ${videos.length}`);
}

main().catch(console.error);
