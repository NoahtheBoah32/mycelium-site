export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { SITE, rpc, isUuid, isToken, buildReplyEmail, buildAnnouncementEmail, type Item } from '../../lib/cg-email';

// Called by the database (pg_net) with {batch, token} whenever Common Ground queues email.
// The token is single use: we trade it for the payload, so this route can only ever send
// what the database queued. Anyone else calling it gets an empty batch.
export const POST: APIRoute = async ({ request }) => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  let batch: unknown, token: unknown;
  try { ({ batch, token } = await request.json()); } catch { return json({ error: 'Invalid request.' }, 400); }
  if (!isUuid(batch) || !isToken(token)) return json({ error: 'Invalid request.' }, 400);

  let items: Item[] = [];
  try { items = (await rpc('cg_claim_emails', { p_batch: batch, p_token: token })) || []; }
  catch (e) { console.error('[cg-notify] claim failed', e); return json({ error: 'Claim failed.' }, 502); }
  if (!items.length) return json({ sent: 0, failed: 0 });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 2,
    auth: { user: 'myceliumlearning@gmail.com', pass: import.meta.env.GMAIL_APP_PASSWORD },
  });

  let sent = 0, failed = 0;
  await Promise.all(items.map(async (it) => {
    let ok = false, err = '';
    try {
      const mail = it.kind === 'announcement' ? buildAnnouncementEmail(it) : buildReplyEmail(it);
      await transporter.sendMail({
        from: 'Common Ground <myceliumlearning@gmail.com>',
        to: it.to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: it.unsub ? { 'List-Unsubscribe': `<${SITE}/api/cg-email-prefs?t=${it.unsub}>` } : undefined,
      });
      ok = true; sent++;
    } catch (e: any) {
      failed++; err = String(e?.message || e);
      console.error('[cg-notify] send failed', it.id, err);
    }
    try { await rpc('cg_mark_email', { p_id: it.id, p_token: token, p_ok: ok, p_error: ok ? null : err }); } catch {}
  }));
  transporter.close();

  return json({ sent, failed });
};
