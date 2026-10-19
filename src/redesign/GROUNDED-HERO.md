# Grounded forest homepage

Approved for production by Joaquin on 19 October 2026, following the local
`site/studies/grounded-hero/?breeze=3` review.

Only the opening homepage section is replaced. Everything after that section
in `templates/home.json` is byte-identical to commit `2fe07be`. The full site
navigation remains in place; the study-only menu and label are not published.
Common Ground, authentication, APIs, CMS content, newsletter and database
configuration are unchanged.

## Assets and animation

`public/redesign/delivery/grounded/` contains content-hashed artwork, scoped
styles, the renderer, leaf contours and a homepage-specific runtime bundle.
All four WebP files are byte-identical to the approved local artwork. They are
generated illustrative images, not documentary photographs. Original PNGs and
generation prompts remain in the local project's research/grounded-hero folder.

The first WebGL pass draws a stationary forest. The second draws only the
original sapling through leaf/stem silhouettes and applies the approved gentle
breeze. Roots and flowers remain stationary. No video or new library is used.
The homepage runtime differs only by guarding three obsolete floating-plant
tweens; growth, cells and all other section animations are retained.

Responsive picture/preload media queries request only the matching desktop or
portrait artwork. The original image is visible while the animation prepares
and remains the fallback if WebGL or the clean plate is unavailable. Each
orientation loads about 3.6 MB of lossless imagery for the animated version.
The renderer pauses offscreen, with the menu open, and in a hidden tab. It
respects reduced motion, the existing site motion preference and its own
remembered Pause breeze button. CSS is scoped to the hero and its page header;
it does not override the rest of the page or visitors' theme extensions.

## Verification

- Astro build and check:build passed for all 83 generated pages.
- Built Common Ground HTML matches its unchanged source byte for byte.
- The rest of the homepage and all protected source paths match `2fe07be`.
- Desktop and phone browser checks cover image selection, loaded canvas,
  menu, pause/resume, offscreen suspension and transition into existing sections.
- No subscriber, account, post, reply or email writes were tested or performed.

To undo this change, revert the forest integration commit and push normally.
Do not reset/force-push or change any external data.
