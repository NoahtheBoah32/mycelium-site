# Mycelium site: deploy handoff

Written for the Codex / GPT-6 Astra agent taking over the mycelium-learn.com redesign, and for Joaquin to skim. Everything below was verified on 2026-10-18 from Joaquin's Windows machine.

## The short version

- The live site is this repo: `C:\Users\User\Documents\CLAUDE CODE\mycelium` → GitHub `NoahtheBoah32/mycelium-site` (public) → Vercel project `mycelium` → `https://mycelium-learn.com`.
- **Deploying is a git push.** Vercel's GitHub integration builds every push. Pushes to `master` go to production; pushes to any other branch get a preview URL. There is no Vercel CLI login, no deploy token, and nothing to install. Git on this machine is already authenticated as `NoahtheBoah32` through Windows Credential Manager, and the `gh` CLI is logged in too.
- A production deploy takes about 45 to 90 seconds after the push lands.
- The redesign must keep the forum, the API routes, the content data, the hosted images and the URL paths listed under "What must keep working". Restyle anything you like; do not remove or move those.
- Work on a branch, check the preview URL, then merge to `master`. Never force-push `master`.

## What exists today

| Thing | Value |
|---|---|
| Framework | Astro, `@astrojs/vercel` adapter, mixed static pages + server routes (`export const prerender = false`) |
| Node | `engines >=22.12`. Vercel runs Node 24. Local is 25.x and builds fine with a warning. |
| Repo | `https://github.com/NoahtheBoah32/mycelium-site.git`, branch `master`, remote `origin` |
| Local clone | `C:\Users\User\Documents\CLAUDE CODE\mycelium` |
| Vercel | project `mycelium`, personal scope `joaquinriego32-4454s-projects`. Dashboard: `https://vercel.com/joaquinriego32-4454s-projects/mycelium` (Joaquin's login only) |
| Domain | `mycelium-learn.com` is attached to the Vercel project's production deployment |
| Env vars (set in Vercel, not in the repo, no local copy) | `GMAIL_APP_PASSWORD` (required by four API routes), `NEWSLETTER_KEY` (optional) |
| CMS | Decap CMS at `/admin/` with a GitHub backend writing to this repo on `master` (`public/admin/config.yml`). TinaCMS is also in `package.json` (`npm run tina:dev`) but Decap is the one wired up. |
| Forum | Common Ground at `/common-ground/` is a single hand-maintained static file, `public/common-ground/index.html`, talking to Supabase project `fnqhncbxoxbvuryccvam` with a public anon key |
| Email | nodemailer through Gmail (`myceliumlearning@gmail.com`) inside the API routes |

Scripts: `npm run dev` (localhost:4321), `npm run build`, `npm run preview`.

## How to deploy

```bash
cd "/c/Users/User/Documents/CLAUDE CODE/mycelium"     # Git Bash
# or in PowerShell: cd "C:\Users\User\Documents\CLAUDE CODE\mycelium"

git status                      # see what you touched
git add <specific files/dirs>   # stage deliberately, see "Repo hygiene"
git commit -m "Describe the change"
git push origin <branch>
```

That is the whole deploy. To confirm Vercel picked it up:

```bash
SHA=$(git rev-parse HEAD)
gh api repos/NoahtheBoah32/mycelium-site/commits/$SHA/status --jq '.state'
# pending -> success (or failure). About 45-90 s.
```

To confirm production actually changed, fetch the live page and look for something only your build has:

```bash
curl -s https://mycelium-learn.com/ | grep -c "some-new-class-or-text"
```

## The safe procedure for the redesign

### Step 1: get the redesign into this repo

Two cases.

**Case A: you have been editing a copy of this repo.** Make sure `git remote -v` shows `NoahtheBoah32/mycelium-site`. Then follow steps 2 to 5.

**Case B: the redesign is a separate Astro project on localhost.** Do not try to point Vercel at a different repo or project; the domain, the env vars and the server routes live on this one. Bring the redesign into this repo instead:

1. Copy your new `src/components`, `src/layouts`, `src/styles`, page files and any new `public/` assets into this repo.
2. Keep every file and path in "What must keep working" in place. If your pages replaced theirs, wire the existing data back in (`src/content/**`, `src/data/*.js`) rather than hardcoding content.
3. Merge `package.json` by hand: keep `@astrojs/vercel`, `nodemailer`, `astro`, `tinacms`, `@tinacms/cli`, `resend`, `@aws-sdk/client-s3`; add yours. Keep `astro.config.mjs` using the Vercel adapter.
4. `npm install`, then `npm run build` until it passes.

### Step 2: branch and push

```bash
git checkout -b redesign
# ... commit your work ...
git push -u origin redesign
```

Keep the branch name short. Vercel builds a preview for every branch and gives it a stable alias of the form `https://mycelium-git-<branch>-joaquinriego32-4454s-projects.vercel.app`. That hostname is one DNS label and must stay under 64 characters, so `redesign` works and `redesign-preview-test` does not (verified: the long name never resolved, the build still succeeded).

**Previews are behind Vercel's login wall.** Verified 2026-10-18: the alias answers `302` to `vercel.com/sso-api`, so `curl` and browser automation see a login page, not the site. Production is not protected. Three ways to look at a preview:

1. Joaquin opens the alias in his own browser while logged into Vercel. Zero setup.
2. Joaquin turns protection off for previews: Vercel dashboard → project `mycelium` → Settings → Deployment Protection → Vercel Authentication → "Only production" or off. Then previews are public and the agent can check them with the commands below.
3. Joaquin creates a bypass secret: same Settings page → Protection Bypass for Automation → generate. Give the agent the secret and it sends `-H "x-vercel-protection-bypass: <secret>"` on every request (or appends `?x-vercel-protection-bypass=<secret>` once in a browser to set a cookie). Keep the secret out of the repo.

### Step 3: check the preview

- Open the preview alias above, using one of the three options.
- Run the route check below with `H=https://mycelium-git-redesign-joaquinriego32-4454s-projects.vercel.app` instead of production (add the bypass header if using option 3).
- Walk the pages in a browser at phone width and desktop width.
- The build status is visible without any login: `gh api repos/NoahtheBoah32/mycelium-site/commits/$(git rev-parse HEAD)/status --jq '.state'`.

### Step 4: ship to production

```bash
git checkout master
git pull
git merge --no-ff redesign -m "Redesign: <one line>"
git push origin master
```

Then run the route check against `https://mycelium-learn.com`.

### Step 5: if production is wrong

```bash
git revert -m 1 <merge-commit-sha>     # for a merge commit
git push origin master                  # Vercel redeploys the previous state in ~1 min
```

Joaquin can also use Instant Rollback in the Vercel dashboard, which is faster and needs no commit.

## What must keep working

Every path below is linked from somewhere outside the repo: Instagram, emails already in people's inboxes, Supabase triggers, the CMS, or printed QR codes. Restyle freely. Do not rename, move or delete.

### Public URL paths

| Path | Source | Why it matters |
|---|---|---|
| `/common-ground/` and `/common-ground/?post=<id>&reply=<id>` | `public/common-ground/index.html` | The forum. Notification emails deep-link to specific replies with those query params. The file reads `SUPABASE_URL` and the anon key inline. |
| `/api/cg-notify` | `src/pages/api/cg-notify.ts` + `src/lib/cg-email.ts` | Called by a Postgres trigger (pg_net) on every forum reply to send the reply emails. Breaking this silently stops notifications. |
| `/api/cg-email-prefs?t=<token>` | `src/pages/api/cg-email-prefs.ts` | The unsubscribe / email settings page linked from every notification email. |
| `/api/register` | `src/pages/api/register.ts` | Event registration endpoint used by `/register/*` pages. |
| `/api/newsletter-send` | `src/pages/api/newsletter-send.ts` + `src/newsletters/*.html` | Newsletter sender. |
| `/resources/baganihan-reports/<slug>` | `src/pages/resources/baganihan-reports/[slug].astro` + `src/data/baganihan-essays.js` | Published essays. `permaculture-beyond-the-farm` is linked from Instagram and the October newsletter. |
| `/resources/baganihan/<slug>`, `/resources/research/<slug>` | `src/pages/resources/**` + `src/data/baganihan-reports.js`, `src/data/upou-research.js` | Resource detail pages. |
| `/reels`, `/reel/<slug>`, `/videos`, `/video/<slug>` | `src/content/reels/*.md`, content collections | Linked from Instagram bios and posts. |
| `/events`, `/events/kabuohan-workshop`, `/register/permanent-culture` | `src/content/events/*.md`, page files | Event pages, some on printed QR codes. |
| `/privacy` | `src/pages/privacy.astro` | Legal copy. Restyle, but keep the text; the newsletter and forum emails link to it and it describes exactly what the site does with data. |
| `/newsletter`, `/about`, `/courses`, `/resources`, `/feedback`, `/` | page files | Linked from the footer, Instagram and emails. |
| `/admin/` | `public/admin/**` | Decap CMS. If you change the shape of `src/content/data/homepage.json` or `about.json`, update `public/admin/config.yml` to match or the CMS will write broken JSON. |
| `/images/**` | `public/images/**` | Referenced by content JSON, markdown, essays, emails and the CMS media folder `public/images/cms`. Do not prune. |
| `/newsletter/2026-10/*.jpg` | `public/newsletter/2026-10/` | Images inside an email already delivered. |

### Files that are not "theme" and should survive untouched

- `public/common-ground/index.html` (and `public/cg-intro/`, which it uses)
- `src/pages/api/*.ts`, `src/lib/cg-email.ts`, `src/newsletters/*`
- `src/content/**`, `src/content.config.ts`, `src/data/*.js`
- `public/admin/config.yml`
- `supabase/cg-email-notifications.sql` (reference copy of what is installed in the database)
- `astro.config.mjs` adapter setting

### Things wired to the outside world

- **Supabase** (forum auth, posts, replies, email outbox): the URL and anon key in the forum file and in `src/lib/cg-email.ts` are public by design. Do not rotate or move them.
- **Gmail**: the `from` address `myceliumlearning@gmail.com` and the `GMAIL_APP_PASSWORD` env var. Nothing to do; just do not delete the routes that use it.
- **Decap CMS**: authenticates against GitHub and commits to `master`. If you rename content files, update the CMS config in the same commit.

## Repo hygiene

- The repo is **public**. Never commit keys, passwords, `.env` files, or Supabase service keys. The anon key already in the code is the public one.
- There are 18 untracked scratch files in the root (`gen-cg-bg*.mjs`, `cg-preview-*.html`, `wp-*.json`, `*.bak`, `*.new`). Do not `git add -A`. Stage the paths you mean.
- `src/pages/index.astro.bak`, `index.astro.new`, `common-ground.astro.bak` are dead files. Deleting them is fine.
- Line endings: the repo has mixed CRLF/LF warnings. Ignore them.
- Commit as yourself; the git identity is already set to Joaquin's account.
- Never rewrite history on `master`, never `git push --force` to `master`.

## Verification commands

Run against the preview host first, then against production. On a protected preview, add `-H "x-vercel-protection-bypass: $SECRET"` to each curl, or every line will read `302`.

```bash
H=https://mycelium-learn.com
for p in / /about /videos /courses /events /resources /reels /newsletter /feedback /privacy \
         /common-ground/ /admin/ \
         /resources/baganihan-reports/permaculture-beyond-the-farm \
         /images/logo.png /newsletter/2026-10/sentinel-cover.jpg; do
  printf "%-62s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' -L "$H$p")"
done
# API routes answer with JSON, not 404:
curl -s -o /dev/null -w "%{http_code}\n" $H/api/newsletter-send     # expect 405
curl -s -o /dev/null -w "%{http_code}\n" -X POST $H/api/cg-notify    # expect 400
```

Every page should be 200. A 404 on anything in the list means a route was lost in the redesign.

## What the agent cannot do, and who does it

| Needs the Vercel dashboard (Joaquin) | Needs only git (the agent) |
|---|---|
| Add or change env vars | Deploy to preview or production |
| Open protected previews, or switch preview protection off / create a bypass secret | Check build status via `gh api` |
| Change domains, redirects at the project level | Roll back by `git revert` |
| Instant Rollback | Add or change pages, styles, content, API routes |
| Read build logs when a deploy fails | Reproduce the build locally with `npm run build` |

If a push shows `failure` in the GitHub status check, run `npm run build` locally; the same error will appear there.

## Context that is easy to miss

- The old WordPress site had Google Analytics. The Astro site has none, on purpose, and the privacy page says so. Do not add tracking scripts without Joaquin's decision.
- The newsletter signup form on `/newsletter` is cosmetic today; it posts to itself and stores nothing. A redesign may keep it as is or wire it to a backend, but should not pretend it works if it does not.
- Common Ground is deliberately outside Astro so it can be edited as one file. Leave it a static file.
- Brand so far: forest green `#1A2A14` / `#2F4F2F`, cream `#F7F7F5`, amber `#C4872A` / `#D9A24A`, Lora + Outfit + Inter + Cormorant Garamond (see `src/layouts/BaseLayout.astro`). The redesign owns the look from here; the forum and emails still use these, so a total palette change will leave them looking different from the site until they are updated too.
