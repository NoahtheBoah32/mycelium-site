export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import october2026 from '../../newsletters/2026-10-october.html?raw';

// Newsletter sender. Issues are plain HTML files in src/newsletters, registered here.
//
// Two modes:
//   - NEWSLETTER_KEY set in the environment and matched: send a named issue to the
//     `to` list in the request (up to 100 addresses per call), or to the owner if omitted.
//   - Otherwise only the bootstrap key is accepted, and it can only ever deliver to the
//     owner's own address. That makes test sends possible before the env var exists
//     without giving anyone a way to email the list.
const OWNER = 'joaquinriego32@gmail.com';
const BOOTSTRAP_KEY = 'f4a636ca1695c3c6e5f2257db9517ed1f832ead2809f73f2';
const FROM = 'Mycelium Learning <myceliumlearning@gmail.com>';

const ISSUES: Record<string, { subject: string; html: string }> = {
  '2026-10': {
    subject: 'The Mycelium Letter, October 2026: permanent culture, twelve farms measured, and a masterclass for land stewards',
    html: october2026,
  },
};

const isEmail = (v: unknown): v is string => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length < 200;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const GET: APIRoute = async () => json({ error: 'POST only.' }, 405);

export const POST: APIRoute = async ({ request }) => {
  let key: unknown, issue: unknown, to: unknown;
  try { ({ key, issue, to } = await request.json()); } catch { return json({ error: 'Invalid request.' }, 400); }

  const envKey = import.meta.env.NEWSLETTER_KEY;
  let recipients: string[];
  if (envKey && typeof key === 'string' && key === envKey) {
    recipients = Array.isArray(to) ? Array.from(new Set(to.filter(isEmail))).slice(0, 100) : [OWNER];
  } else if (typeof key === 'string' && key === BOOTSTRAP_KEY) {
    recipients = [OWNER];
  } else {
    return json({ error: 'Unauthorized.' }, 401);
  }

  const it = typeof issue === 'string' ? ISSUES[issue] : undefined;
  if (!it) return json({ error: 'Unknown issue.', issues: Object.keys(ISSUES) }, 404);
  if (!import.meta.env.GMAIL_APP_PASSWORD) return json({ error: 'Mail is not configured.' }, 500);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 2,
    auth: { user: 'myceliumlearning@gmail.com', pass: import.meta.env.GMAIL_APP_PASSWORD },
  });

  let sent = 0, failed = 0;
  for (const rcpt of recipients) {
    try {
      await transporter.sendMail({
        from: FROM,
        to: rcpt,
        subject: it.subject,
        html: it.html,
        headers: {
          'List-Unsubscribe': '<mailto:myceliumlearning@gmail.com?subject=Unsubscribe>',
        },
      });
      sent++;
    } catch (e) {
      failed++;
      console.error('[newsletter-send] failed for', rcpt, e);
    }
  }
  transporter.close();
  return json({ issue, sent, failed });
};
