# Approved Mycelium presentation

This directory integrates the reviewed local v5.16 design into Astro. Templates
contain presentation markup; `render.mjs` reconnects the video, reel, event and
reading libraries to their original content sources at build time. Structured
report pages retain their original Astro block renderers and data imports.

CSS, scripts, responsive images, unchanged video streams and GLB sculptures live
under `public/redesign/`. Original public media is retained. Content-hashed
delivery assets have immutable CDN caching; HTML keeps Vercel's normal policy.

## Preservation boundary

Integration baseline: `092cca8bfb0a59b15db423c42bb0abceeaba2a24`.

The following are unchanged: `public/common-ground/`, `public/cg-intro/`, existing
API handlers, email helpers/templates, Supabase SQL, all existing content/data,
CMS configuration and original image/newsletter assets. No schema migration or
subscriber/account/post/reply write is part of this deployment.

The separate `/join`, `/sign-in` and `/recover` screens use the same Supabase
project and public anon key as the forum. The forum itself remains byte-identical.
Existing sessions go straight through the new public-site entry to the forum.
Existing direct `/common-ground/` links and notification deep links are preserved.

## Known existing integration gaps

The previous `/newsletter` form did not persist addresses. The sender is an
independent API and is preserved. The owner reports an existing WordPress list;
no migration, deletion, import or broadcast has been attempted. Until the existing
signup provider can be identified, the form honestly reports that an address was
not saved. Do not show a false subscription-success message.

Feedback retains the existing Formspree action. No live feedback test is performed
because it could email an address other than the owner's authorized test inbox.
The old June 2026 registration route now accurately states registration is closed;
the original registration API is retained unchanged.

## Validation

`npm run build` produces static pages and the original Vercel API functions.
Browser checks cover desktop/mobile layouts, horizontal event gestures, search,
video playback and 3D models. Account tests replace the identity service with test
responses and never create real users or send email. Protected-file checksums
are checked against the baseline before deployment.

Dependency versions other than the added build-time HTML parser are unchanged.
The existing dependency tree has security advisories requiring a separately
reviewed framework/CMS maintenance update; no automatic major upgrade is applied
as part of this presentation deployment.

To roll back this rollout, revert its integration commit on master and push;
do not reset or force-push, and do not alter any external database.
