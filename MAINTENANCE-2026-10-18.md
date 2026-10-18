# Security package maintenance — 18 October 2026

The existing site used older third-party software with published security
advisories. An advisory is not evidence of a breach. This update changes that
software while preserving the approved pages and the existing Common Ground.

## Changes

- Astro 6.1.3 → 7.4.0 and its Vercel adapter 10.0.8 → 11.0.15.
- Nodemailer 9.0.1 → 10.1.6; available compatible dependency patches applied.
- TinaCMS 3.7.6 → 3.14.4 and its CLI 2.2.6 → 2.7.0. These are local editing tools,
  now correctly listed as development dependencies. React 18.3.1 satisfies their
  shared supported peer range. The public Decap CMS and its configuration remain
  unchanged; the Tina CLI help command was checked, not an authenticated editor
  workflow or a CMS rebuild.
- The Vercel routing helper's legacy path-to-regexp dependency is explicitly
  patched to 6.3.0, retaining the same major API.
- Node minimum updated to 22.22.0; production remains on Node 24.
- Explicit `compressHTML: true` retains the previous whitespace policy.
- Explicit head/body fragments preserve injected scripts and styles under the
  new Astro compiler. A local test caught missing head content before publication.
- `npm run check:build` checks all 83 presentation templates' generated pages,
  scripts and styles, and verifies that Common Ground is copied unchanged.

## Security scan scope

The initial full npm audit reported 79 findings, including five critical findings.
After the update, `npm audit --omit=dev` reports **zero known vulnerabilities**.
The full development installation still reports **29 findings** (16 high,
11 moderate, 2 low), all in the Tina editing-tool dependency tree. These have not
been dismissed or claimed fixed. They include libraries with no patched release
in their supported range (including braces and sprintf-js); forcing unrelated
major replacements or downgrading the editor would not be a safe blanket fix.

The generated Vercel server package was inspected: none of the packages flagged
by the remaining audit are included. Do not expose the local Tina development
server to untrusted visitors or feed it untrusted project files. Review these
development findings when upstream compatible fixes become available. This npm
check does not audit external CDN scripts or establish that the entire system
is free of security issues.

## Preservation and local verification

- All 352 protected content/forum/API/media/database/CMS files match the original
  pre-redesign checksums. The only change among the 353 baseline files is the
  explicit whitespace compatibility option in astro.config.mjs.
- No changes to Common Ground, stored accounts, threads, media, notifications,
  database schema, environment variables or subscriber lists.
- Production build and the 83-page build regression check passed.
- 48 mobile checks passed (Chrome/WebKit, portrait/landscape and 320px Reel pages),
  with no horizontal overflow or browser JavaScript errors.
- Carousel: 35 transitions across 36 continuous gestures including reversals.
  Resources: three static navigation cards, 11 reading cards and working search.
- Video autoplay, 24 CMS reels, desktop archive loading/rotation, and touch-only
  on-demand 3D models in Chrome and WebKit passed.
- Signup/sign-in/recovery tests used mocked identity services and blocked real
  Supabase requests. No test account or profile was written.
- Nodemailer generated a Unicode HTML email through its offline stream transport;
  that test sends nothing. Live email testing, if performed, is restricted to
  joaquinriego32@gmail.com.

## Existing functional gap

Newsletter collection still needs the original WordPress subscriber service
identified and reconnected. No subscriber migration or alternate list was
created. Sending a newsletter is separate from saving new subscriptions.

## Sources

- https://docs.astro.build/en/guides/upgrade-to/v7/
- https://docs.astro.build/en/guides/integrations-guide/vercel/
- https://nodemailer.com/
- https://github.com/pillarjs/path-to-regexp/security/advisories/GHSA-9wv6-86v2-598j
