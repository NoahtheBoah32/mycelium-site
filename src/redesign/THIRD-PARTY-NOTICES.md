# Third-party material

## 3dicons headphone

- Creator: Vijay Verma / realvjy, 3dicons.
- License: CC0 1.0, verified on the [icon page](https://3dicons.co/icons/b81ead-headphone) and [repository](https://github.com/realvjy/3dicons).
- Asset: `assets/headphone-clay.png`.
- [Original transparent PNG](https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/clay/headphone-dynamic-clay.png).
- [Source metadata](https://github.com/realvjy/3dicons/blob/develop/content/3dicons-meta/headphone.md).

Mycelium photographs, logo, thumbnails and workshop footage remain original-site material. Kapitbahay excerpts come from the Philippine Permaculture Association's public podcasts and the user's existing downloads for this requested local design review. Source links are in REVIEW-V3.md and beside the hero. Embedded captions and logos are retained.

No Cabana, Organimo, Farm Minerals, Plantica, Interstellar Lab or From Fauna media or branding is included. Their public sites were inspected as design references. Homepage timelines are an original implementation using GSAP; no proprietary site bundle, Aceternity package or Motion Primitives package was copied.

## GSAP and ScrollTrigger 3.15.0

- Publisher: GreenSock / Webflow.
- License: [GSAP Standard License](https://gsap.com/community/standard-license/), verified during this revision. GSAP is source-available under this license; do not describe the package as MIT.
- Local files: `vendor/gsap.min.js` and `vendor/ScrollTrigger.min.js`, copied into `site/vendor/` by the build. Original library headers are retained.
- Download sources: [GSAP 3.15.0](https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js) and [ScrollTrigger 3.15.0](https://cdn.prod.website-files.com/gsap/3.15.0/ScrollTrigger.min.js).
- [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

## v5.2 generated illustration

`assets/mycelium-network-cutaway.png` was generated with the built-in OpenAI image tool for this preview. It depicts a conceptual underground root/mycelium network, not a documentary photograph. Its exact prompt and usage are recorded in `assets/mycelium-network-cutaway.md`. No ElevenLabs credits were used.

This generated image was replaced on the homepage in v5.3. The user-supplied files now used on Home/About are documented in `assets/SUPPLIED-MEDIA.md`. Original files and watermarks are retained; English localization is a webpage overlay. No claim of authorship of the supplied media is made.

## v5.9 generated photographs

The six photographs in Events (Home), the account pages and About's mission were generated with gpt-image-2 through ElevenLabs. They are labelled "Illustrative image" in their alt text. Prompts, credits and the rejected images are recorded in `REVIEW-GENERATED-IMAGES.md` and `research/image-generation/`.

## v5.9 Gmail film

- Assets: `assets/newsletter-gmail.mp4` and `assets/newsletter-gmail-poster.jpg`. This is an original frame-by-frame recreation rendered locally for this preview, not a screen recording.
- What it depicts: Google Chrome, the new-tab page, the Google Workspace loading screen and Gmail. The newsletter section also places Gmail's logo on the card as an inline SVG.
- Trademarks: Google, Google Chrome, Gmail and their logos are trademarks of Google LLC. They are shown for illustration only and imply no endorsement.
- Inbox: the inbox owner (rosa.delmundo.gardens@gmail.com) and the other messages are fictional.
- The open letter: it follows Mycelium's own newsletter from Joaquin's reference screenshots. Its field photograph keeps its credit, Hubert Joseph Balana Posadas.
- Fonts: interface text was rendered in the fonts the real apps use. Only rendered pixels are in the video; no font file is packaged.


## v5.13 editorial illustrations — 18 October 2026

Seven images generated through the user-authorized ElevenLabs Image & Video API, using Gemini 3 Pro Image at 2K, 3:2. These depict generic botanical and garden subjects, not actual events or named communities. All are people-free. File names: `editorial-resilience.jpg`, `editorial-waterways.jpg`, `editorial-seed-library.jpg`, `editorial-living-soil.jpg`, `editorial-field-notes.jpg`, `editorial-food-forest.jpg`, `editorial-coffee-garden.jpg`. Source PNGs, prompts, generation IDs and credit observations: `research/image-generation/v5.13/`.

The provider account usage delta for this seven-image batch was **8,526 credits**. Including the prior ledger's **20,643**, the recorded project total is **29,169**, below the user-authorized **100,000-credit** ceiling. Per-request account observations lagged the bill; the reconciled batch total is authoritative. No credentials are included.

Event titles, dates, organizations and speaker details were checked against https://mycelium-learn.com/events on 18 October 2026; snapshot: `research/events-live-2026-10-18.html`. Kabuohan's account comes from the preserved published recap at https://mycelium-learn.com/events/kabuohan-workshop. New cover imagery is explicitly labelled as editorial illustration.

Interaction references: https://www.dopper.com/ (vertical adaptation of its unfolding solution cards), https://composting.hlabs.co.uk/ (events wheel), https://seed.com/ (layered hover), and https://truekindskincare.com/ (newsletter wording direction). Original brand assets and code were not copied from these references. API reference: https://elevenlabs.io/docs/eleven-api/guides/cookbooks/image-and-video.

## v5.14 archive sculptures and renderer

Five original procedural sculptures were authored in Blender 5.1 for this project: clay bowl and seedling, terraced food forest, open seed pod, water garden, and leafy branch. Editable generation source: `research/build_archive_objects.py`. Exported glTF models and transparent fallback posters: `assets/archive-objects/`. These are illustrations of event themes, not records of event outcomes. No third-party models, API generation or paid assets were used.

The archive uses Google's `<model-viewer>` 4.1.0, vendored at `vendor/model-viewer-4.1.0.min.js`, under Apache-2.0. Copyright Google LLC; bundled dependency license comments remain intact. Full license: `vendor/model-viewer-LICENSE.txt`. Pinned distribution: https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js. Official documentation: https://modelviewer.dev/.

Seed's public product page and the user's supplied screenshots informed the rotation direction. Direct automated inspection encountered Cloudflare verification, so its internal rendering implementation was not established and no claim is made that Mycelium uses the same technology.

## v5.15 images and expanded sculptures

Six people-free editorial images were generated through the authorized ElevenLabs API using GPT Image 2: `editorial-share-story.jpg`, `editorial-forest-roots.jpg`, `editorial-grafting.jpg`, `editorial-nursery.jpg`, `editorial-garden-practice.jpg` and `editorial-fern-unfurling.jpg`. These are illustrative scenes, not photographs documenting actual Mycelium events or sites. Prompts, original PNGs, request identifiers and the credit ledger are retained in `research/image-generation/v5.15/`. The batch used 9,585 credits; recorded cumulative project spend is 38,754 of the 100,000-credit allowance. Prompt direction references official OpenAI image-prompting guidance; source links are in `research/v5.15/IMAGE-PROMPTING.md`.

The seed, water and branch glTF sculptures were replaced by original Blender scenes illustrating seed keeping, connected community systems, and older/younger growth with roots. No paid models or generation credits were used. The clay seedling and terraced forest models remain unchanged.
