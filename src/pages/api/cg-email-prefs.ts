export const prerender = false;

import type { APIRoute } from 'astro';
import { rpc, isToken, esc } from '../../lib/cg-email';

// The "choose which emails you get" page linked from every Common Ground email.
// GET shows the two switches, POST saves them. The token in the link is the key,
// so nobody has to sign in to stop the emails.

const page = (body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Common Ground emails</title>` +
    `<style>body{margin:0;background:#EFEADB;color:#232A1C;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.55}` +
    `main{max-width:520px;margin:0 auto;padding:48px 20px}.k{font-size:12px;font-weight:700;letter-spacing:2.4px;color:#2F4F2F;margin-bottom:14px}` +
    `.card{background:#FFFDF7;border:1px solid #E2DCC8;border-radius:14px;padding:28px 26px}h1{font-family:Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;margin:0 0 10px}` +
    `p{margin:0 0 18px}label{display:flex;gap:12px;align-items:flex-start;padding:14px 0;border-top:1px solid #E2DCC8;cursor:pointer}label b{display:block}label span{font-size:14px;color:#6B705C}` +
    `input[type=checkbox]{width:20px;height:20px;margin-top:2px;accent-color:#2F4F2F;flex-shrink:0}` +
    `button,a.b{display:inline-block;margin-top:18px;padding:13px 26px;border:0;border-radius:40px;background:#2F4F2F;color:#fff;font:inherit;font-weight:700;cursor:pointer;text-decoration:none}` +
    `button:focus-visible,a.b:focus-visible,input:focus-visible{outline:3px solid #C4872A;outline-offset:2px}.ok{color:#2F6B3A;font-weight:700}</style></head>` +
    `<body><main><div class="k">COMMON GROUND &middot; MYCELIUM</div><div class="card">${body}</div></main></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );

const form = (t: string, p: { replies: boolean; announcements: boolean; name?: string | null }, saved: boolean) =>
  `<h1>Your Common Ground emails</h1>` +
  (saved ? `<p class="ok">Saved. Your settings are updated.</p>` : `<p>${p.name ? esc(p.name) + ', choose' : 'Choose'} what lands in your inbox. Untick both to stop every email.</p>`) +
  `<form method="post" action="/api/cg-email-prefs?t=${t}">` +
  `<label><input type="checkbox" name="replies" value="1"${p.replies ? ' checked' : ''}><div><b>Replies</b><span>When someone replies in a thread you started or joined.</span></div></label>` +
  `<label><input type="checkbox" name="announcements" value="1"${p.announcements ? ' checked' : ''}><div><b>Announcements</b><span>New reports, events and updates on Common Ground.</span></div></label>` +
  `<button type="submit">Save</button></form>`;

const missing = () =>
  page(`<h1>That link has expired</h1><p>Open the link from your most recent Common Ground email, or sign in to Common Ground.</p><a class="b" href="/common-ground">Go to Common Ground</a>`, 404);

export const GET: APIRoute = async ({ url }) => {
  const t = url.searchParams.get('t');
  if (!isToken(t)) return missing();
  try {
    const p = await rpc('cg_email_prefs_get', { p_token: t });
    return p ? page(form(t, p, false)) : missing();
  } catch {
    return page(`<h1>Something went wrong</h1><p>Your settings did not load. Try the link again in a minute.</p>`, 502);
  }
};

export const POST: APIRoute = async ({ url, request }) => {
  const t = url.searchParams.get('t');
  if (!isToken(t)) return missing();
  try {
    const f = await request.formData();
    const next = { replies: f.get('replies') === '1', announcements: f.get('announcements') === '1' };
    const ok = await rpc('cg_email_prefs_set', { p_token: t, p_replies: next.replies, p_announcements: next.announcements });
    if (!ok) return missing();
    const p = await rpc('cg_email_prefs_get', { p_token: t });
    return page(form(t, { ...next, name: p?.name }, true));
  } catch {
    return page(`<h1>Something went wrong</h1><p>Your settings were not saved. Go back and try again.</p>`, 502);
  }
};
