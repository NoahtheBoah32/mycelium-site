// Common Ground email notifications: shared pieces for /api/cg-notify and /api/cg-email-prefs.
// The database queues what to send (see supabase/cg-email-notifications.sql). Nothing here
// decides who gets mail.

export const SITE = 'https://mycelium-learn.com';
const SB_URL = 'https://fnqhncbxoxbvuryccvam.supabase.co';
// Public anon key, the same one the Common Ground page ships to every browser.
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucWhuY2J4b3hidnVyeWNjdmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDk5NTMsImV4cCI6MjA5ODUyNTk1M30.DQV-cd0O1Eo1wkSlkhWJGo7Gy8sZvHVJ_nv44igGPR0';

export async function rpc(fn: string, args: Record<string, unknown>): Promise<any> {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error(`${fn} failed (${r.status})`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

export const isUuid = (s: unknown): s is string =>
  typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
export const isToken = (s: unknown): s is string => typeof s === 'string' && /^[0-9a-f]{64}$/i.test(s);

export const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Posts are stored in the forum's small markdown subset. Escape first, then format.
function rich(raw: string): string {
  return esc(raw || '')
    .split('\n')
    .map((line) => {
      const h = line.match(/^\s*#{1,3}\s+(.+?)\s*$/);
      const t = (h ? h[1] : line)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
        .replace(/(^|[^_\w])_([^_\n]+)_(?![_\w])/g, '$1<em>$2</em>');
      return h ? `<strong>${t}</strong>` : t;
    })
    .join('<br>');
}
function plain(raw: string): string {
  return (raw || '')
    .replace(/^\s{0,3}#{1,3}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/(^|[^_\w])_([^_\n]+)_(?![_\w])/g, '$1$2')
    .trim();
}
function when(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-PH', {
      timeZone: 'Asia/Manila', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  } catch { return ''; }
}
const initials = (n: string) =>
  (n || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
const okColor = (c: unknown, d: string) => (typeof c === 'string' && /^#[0-9a-f]{3,8}$/i.test(c) ? c : d);

const F_SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const F_SERIF = "Georgia,'Times New Roman',serif";
const C = { ground: '#EFEADB', card: '#FFFDF7', ink: '#232A1C', soft: '#6B705C', line: '#E2DCC8', green: '#2F4F2F', amber: '#C4872A', mark: '#FFF1C9' };

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.green}" style="border-radius:40px">` +
  `<a href="${esc(href)}" style="display:inline-block;padding:14px 28px;font-family:${F_SANS};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:40px">${esc(label)} &rarr;</a>` +
  `</td></tr></table>`;

function shell(preheader: string, inner: string, footer: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>` +
    `<body style="margin:0;padding:0;background:${C.ground}">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.ground}">${esc(preheader)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.ground}"><tr><td align="center" style="padding:28px 14px">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">` +
    `<tr><td style="padding:0 6px 14px;font-family:${F_SANS};font-size:12px;font-weight:700;letter-spacing:2.4px;color:${C.green}">COMMON GROUND <span style="color:${C.amber}">&middot;</span> MYCELIUM</td></tr>` +
    `<tr><td bgcolor="${C.card}" style="border:1px solid ${C.line};border-radius:14px;padding:30px 28px">${inner}</td></tr>` +
    `<tr><td style="padding:18px 8px 0;font-family:${F_SANS};font-size:12px;line-height:1.6;color:${C.soft}">${footer}</td></tr>` +
    `</table></td></tr></table></body></html>`;
}

function footer(unsub: string | null, why: string): string {
  const manage = unsub ? `${SITE}/api/cg-email-prefs?t=${unsub}` : `${SITE}/common-ground`;
  return `${esc(why)} <a href="${manage}" style="color:${C.soft};text-decoration:underline">Choose which emails you get, or turn them off</a>.` +
    `<br>Mycelium Learning &middot; mycelium-learn.com`;
}

type Post = { id: string; body: string; at: string; name?: string | null; color?: string | null; has_media?: boolean };
export type Item = {
  id: string; kind: 'reply' | 'announcement'; to: string; name: string | null; unsub: string | null;
  question_id: string | null; reply_id: string | null;
  question: (Post & { kind?: string; status?: string }) | null; replies: Post[]; payload: Record<string, any>;
};

function row(p: Post, opts: { isNew?: boolean; label?: string }): string {
  const name = p.name || 'Common Ground';
  const media = p.has_media ? `<div style="margin-top:6px;font-size:13px;color:${C.soft}">Photo or file attached. Open the thread to see it.</div>` : '';
  const body = (p.body || '').trim() ? rich(p.body) : '';
  const tag = opts.isNew
    ? `<span style="display:inline-block;margin-left:8px;padding:2px 9px;border-radius:20px;background:${C.amber};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:.6px">NEW REPLY</span>`
    : opts.label ? `<span style="margin-left:8px;font-size:12px;color:${C.soft}">${esc(opts.label)}</span>` : '';
  const wrap = opts.isNew
    ? `background:${C.mark};border-left:4px solid ${C.amber};border-radius:8px;padding:14px 14px 14px 12px`
    : `padding:14px 14px 14px 16px`;
  return `<tr><td style="padding:0 0 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="${wrap}">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td width="40" valign="top"><div style="width:32px;height:32px;line-height:32px;border-radius:50%;background:${okColor(p.color, '#6f7d52')};color:#ffffff;font-family:${F_SANS};font-size:12px;font-weight:700;text-align:center">${esc(initials(name))}</div></td>` +
    `<td valign="top" style="font-family:${F_SANS};font-size:15px;line-height:1.55;color:${C.ink}">` +
    `<div style="font-size:14px"><strong>${esc(name)}</strong>${tag}<span style="margin-left:8px;font-size:12px;color:${C.soft}">${esc(when(p.at))}</span></div>` +
    `<div style="margin-top:4px;word-break:break-word">${body}</div>${media}` +
    `</td></tr></table></td></tr></table></td></tr>`;
}

export function buildReplyEmail(it: Item) {
  const link = `${SITE}/common-ground?post=${it.question_id}&reply=${it.reply_id}`;
  const fresh = it.replies.find((r) => r.id === it.reply_id);
  const who = fresh?.name || 'Someone';
  const hi = it.name ? `Hi ${it.name},` : 'Hi,';

  // The whole thread, oldest first. Very long threads keep the opening post and the latest 40.
  const MAX = 40;
  const skipped = Math.max(0, it.replies.length - MAX);
  const shown = skipped ? it.replies.slice(-MAX) : it.replies;
  let rows = '';
  if (it.question) rows += row({ ...it.question, name: it.question.name || 'Common Ground' }, { label: 'started the thread' });
  if (skipped) rows += `<tr><td style="padding:4px 16px 10px;font-family:${F_SANS};font-size:13px;color:${C.soft}">${skipped} earlier ${skipped === 1 ? 'reply' : 'replies'} in the thread. The button opens all of them.</td></tr>`;
  for (const r of shown) rows += row(r, { isNew: r.id === it.reply_id });

  const inner =
    `<div style="font-family:${F_SERIF};font-size:28px;line-height:1.2;color:${C.ink}">You&rsquo;ve got a new reply.</div>` +
    `<div style="margin:10px 0 22px;font-family:${F_SANS};font-size:16px;line-height:1.55;color:${C.ink}">${esc(hi)} <strong>${esc(who)}</strong> replied in a Common Ground thread you are part of. Their reply is highlighted below.</div>` +
    button(link, 'Go to Common Ground') +
    `<div style="margin:26px 0 10px;border-top:1px solid ${C.line};padding-top:18px;font-family:${F_SANS};font-size:11px;font-weight:700;letter-spacing:1.8px;color:${C.soft}">THE THREAD</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>` +
    `<div style="margin-top:18px">${button(link, 'Reply on Common Ground')}</div>`;

  const lines = [
    `You've got a new reply. Go to Common Ground: ${link}`, '',
    ...(it.question ? [`${it.question.name || 'Common Ground'} started the thread:`, plain(it.question.body), ''] : []),
    ...shown.map((r) => `${r.id === it.reply_id ? '>> NEW REPLY from ' : ''}${r.name || 'A member'}: ${plain(r.body) || '[photo or file]'}`),
    '', `Open the thread: ${link}`,
    it.unsub ? `Email settings: ${SITE}/api/cg-email-prefs?t=${it.unsub}` : '',
  ];
  return {
    subject: `You've got a new reply from ${who}. Go to Common Ground`,
    html: shell(`${who}: ${plain(fresh?.body || '').slice(0, 110)}`, inner,
      footer(it.unsub, 'You are getting this because someone replied in a Common Ground thread you are part of.')),
    text: lines.join('\n'),
  };
}

export function buildAnnouncementEmail(it: Item) {
  const p = it.payload || {};
  const link = `${SITE}/common-ground?post=${it.question_id}`;
  const img = typeof p.image === 'string' && p.image.startsWith('/')
    ? `<div style="margin:0 0 20px"><img src="${SITE}${esc(p.image)}" alt="" width="542" style="display:block;width:100%;max-width:542px;height:auto;border-radius:10px"></div>` : '';
  const more = typeof p.link === 'string' && p.link.startsWith('/')
    ? `<div style="margin-top:16px;font-family:${F_SANS};font-size:14px"><a href="${SITE}${esc(p.link)}" style="color:${C.green};font-weight:700">${esc(p.cta || 'Read more')}</a></div>` : '';
  const inner =
    `<div style="font-family:${F_SANS};font-size:11px;font-weight:700;letter-spacing:1.8px;color:${C.amber}">${esc(String(p.flair || "What's new").toUpperCase())}</div>` +
    `<div style="margin:8px 0 12px;font-family:${F_SERIF};font-size:27px;line-height:1.22;color:${C.ink}">${esc(p.title)}</div>` +
    `<div style="margin:0 0 20px;font-family:${F_SANS};font-size:16px;line-height:1.6;color:${C.ink}">${esc(p.summary || 'There is something new on Common Ground.')}</div>` +
    img + button(link, 'Go to Common Ground') + more;
  return {
    subject: `New on Common Ground: ${p.title}`,
    html: shell(String(p.summary || p.title || ''), inner,
      footer(it.unsub, 'You are getting this because you have a Common Ground account.')),
    text: [`New on Common Ground: ${p.title}`, '', p.summary || '', '', `Go to Common Ground: ${link}`,
      it.unsub ? `Email settings: ${SITE}/api/cg-email-prefs?t=${it.unsub}` : ''].join('\n'),
  };
}
