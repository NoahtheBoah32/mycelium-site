import { YoutubeTranscript } from 'youtube-transcript';
import { readFileSync, writeFileSync } from 'fs';

const GEMINI_KEY = 'AIzaSyB8DpQCkxHWE6A1Bc1ztYPjrAUFXQFTZJs';
const VIDEOS_PATH = './public/data/videos.json';

const videos = JSON.parse(readFileSync(VIDEOS_PATH, 'utf-8'));

function extractYtId(v) {
  if (v.youtubeId) return v.youtubeId;
  const m = (v.embedUrl || '').match(/(?:[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

async function getTranscript(ytId) {
  try {
    const items = await YoutubeTranscript.fetchTranscript(ytId, { lang: 'en' });
    return items.map(i => i.text).join(' ').slice(0, 8000); // cap at 8k chars
  } catch {
    try {
      // fallback: no lang param
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
   // gemini-2.5-flash has thinking mode: parts[0] is thought, last non-thought part is the response
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const textPart = parts.filter(p => !p.thought).at(-1);
  return textPart?.text?.trim() || null;
}

async function main() {
  let updated = 0;
  const out = [...videos];

  for (let i = 0; i < out.length; i++) {
    const v = out[i];
    if (v.about) { console.log(`SKIP  [${i+1}/${out.length}] ${v.title.slice(0,50)}`); continue; }

    const ytId = extractYtId(v);
    if (!ytId) { console.log(`NO_ID [${i+1}/${out.length}] ${v.title.slice(0,50)}`); continue; }

    process.stdout.write(`FETCH [${i+1}/${out.length}] ${v.title.slice(0,50)}... `);
    const transcript = await getTranscript(ytId);

    if (!transcript) {
      console.log('no transcript');
      continue;
    }

    const summary = await summarise(v.title, v.author || 'Unknown', transcript);
    if (!summary) { console.log('gemini failed'); continue; }

    out[i] = { ...v, about: summary };
    updated++;
    console.log('done');

    // save after every video so progress isn't lost
    writeFileSync(VIDEOS_PATH, JSON.stringify(out, null, 2), 'utf-8');
    await new Promise(r => setTimeout(r, 800)); // be gentle with rate limits
  }

  console.log(`\nDone. Updated ${updated} videos.`);
}

main().catch(console.error);
