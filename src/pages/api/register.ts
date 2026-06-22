import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const EVENT_TITLE = 'Permanent Culture in Times of Disruption';
const EVENT_DATE  = 'Friday, June 26, 2026';
const EVENT_TIME  = '8:00 PM Philippine Standard Time';
const MEET_LINK   = 'https://meet.google.com/kyh-mfgm-yfj';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, newsletter } = await request.json();
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0d1a0d;font-family:Georgia,serif;">
<div style="max-width:540px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#C8A24A;">MYCELIUM LEARNING</p>
    <div style="width:40px;height:1px;background:#C8A24A;margin:0 auto;"></div>
  </div>
  <div style="background:#111f11;border:1px solid rgba(200,162,74,0.2);border-radius:12px;padding:36px 32px;">
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C8A24A;">YOU'RE REGISTERED</p>
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#F5EDD8;line-height:1.3;">${EVENT_TITLE}</h1>
    <p style="margin:0 0 24px;font-size:13px;color:rgba(245,237,216,0.5);">Why Permaculturists Need to Think Beyond Food</p>
    <div style="background:rgba(200,162,74,0.08);border-left:3px solid #C8A24A;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:12px;color:#C8A24A;"><strong>${EVENT_DATE}</strong></p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:rgba(245,237,216,0.6);">${EVENT_TIME}</p>
    </div>
    <p style="margin:0 0 8px;"><strong style="color:#F5EDD8;">Join the talk:</strong> <a href="${MEET_LINK}" style="color:#C8A24A;">${MEET_LINK}</a></p>
    <p style="margin:24px 0 0;font-size:13px;color:rgba(245,237,216,0.55);line-height:1.7;">This talk is part of an ongoing series by the <strong style="color:rgba(245,237,216,0.8);">Baganihan Collective</strong>, presented in partnership with Mycelium Learning.</p>
  </div>
  <p style="text-align:center;margin-top:28px;font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25);">mycelium-learn.com &nbsp;·&nbsp; Questions? Reply to this email.</p>
</div></body></html>`;

    await resend.emails.send({
      from: 'Mycelium Learning <onboarding@resend.dev>',
      to: email,
      subject: `You're registered — ${EVENT_TITLE}`,
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
