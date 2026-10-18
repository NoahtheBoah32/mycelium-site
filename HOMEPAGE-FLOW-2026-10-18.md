# Homepage sequence update

Requested sequence after the existing opening hero:

1. Learning / Community / People / Planet, unfolding into the Mycelium digital-network chapter and floating cells.
2. Grow Together, with its existing plant and cards.
3. Meet. Learn. Take part.

Removed the complete soil-film / "Soil, water, plants, people" section. Moved the existing story as one intact subtree. Updated the hero's scroll link to `#story` and the chapter's "Keep exploring" link to `#grow-together`. All animation scripts, styles, media, and later homepage sections remain unchanged.

Local validation: production build passed; `npm run check:build` verified 83 generated pages. Five scroll states passed at 1440, 1920, 390, 320 and 844 px in Chrome, plus 390 px in WebKit: 30 checks, no JavaScript errors, failed asset requests, broken visible images, or horizontal overflow. Desktop forward/reverse panel states verified. Screenshots reviewed for the cells, plant/cards and phone layout.

All 352 original protected files (excluding the Astro configuration already changed in the earlier maintenance release) match their preservation baseline. No Common Ground, API, content, CMS, subscriber, database or email changes. No forms submitted or emails sent for this update.

Only `src/redesign/templates/home.json` changes the deployed site. To undo the sequence change, revert its release commit normally and push; do not reset shared history.
