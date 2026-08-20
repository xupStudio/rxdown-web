# RxDown Guides Library Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare a locally verified 121-guide-per-locale editorial library with nine categories and a localized, screenshot-led app promotion on every article, without bypassing the clinical publication gates.

**Architecture:** Preserve the handoff Markdown and metadata inside the existing Astro content collection, add pure catalog helpers for category behavior, and reuse the existing static guide routes. A staged import copies only the 106 new slugs and the three authorized replacements per locale while retaining 12 legacy guides; UI components consume one normalized guide model.

**Tech Stack:** Astro 5.18.2, Astro Content Layer, Zod, vanilla JavaScript, CSS, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-08-20-guides-library-design.md`

## Global Constraints

- English is the sole medical evidence source of truth.
- Import only the verified 2026-08-20 library; never use `90_HISTORICAL_INCOMPLETE_DO_NOT_DEPLOY/`.
- Preserve all clinical, pharmacy, specialist, localization, country-label, and publication review flags.
- Do not push, deploy, or alter external services in this task.
- Do not add third-party dependencies.
- Retain all existing URLs; replace only the three `live-update` slugs in the handoff action map.
- App copy may describe tracking, journaling, trends, and clinician-ready reports; it may not diagnose, prescribe, or guarantee safe tapering.

---

### Task 1: Lock the guide-library contracts

**Files:**
- Create: `test/guide-library.test.mjs`
- Create: `test/guide-catalog.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: existing Markdown under `src/content/guides/`
- Produces: executable `npm test` contract for content counts, metadata, assets, and catalog behavior

- [ ] **Step 1: Write failing library tests**

Assert literal expectations: nine locales, 121 Markdown files per locale, 109 imported files carrying `content_hub`, 106 `new` plus three `live-update` actions, exact English hub counts `3/14/11/13/9/19/3/6/31`, localized review/hash metadata, and all referenced localized assets present.

- [ ] **Step 2: Write failing catalog tests**

Assert that each retained legacy slug maps to its approved hub, unknown hub values fall back safely, groups follow the editorial order, and P0/P1 entries sort ahead of research/P2/P3 entries without locale-unstable output.

- [ ] **Step 3: Run RED verification**

Run: `npm test`

Expected: FAIL because the library still has 15 articles per locale and the catalog module does not exist.

- [ ] **Step 4: Add only the test scripts**

Add `test`, `test:content`, and `test:rendered` scripts using `node --test`; do not add packages.

### Task 2: Normalize category and article metadata

**Files:**
- Create: `src/i18n/guide-categories.js`
- Create: `src/lib/guide-catalog.js`
- Modify: `src/content.config.ts`
- Modify: `src/i18n/guides.js`
- Modify: `src/i18n/jsonld.js`

**Interfaces:**
- Produces: `guideHub(entry)`, `guideGroups(guides)`, `guideDate(data)`, `guideImage(locale, data, slug)`, and deterministic related-guide selection
- Consumes: both legacy and handoff frontmatter shapes

- [ ] **Step 1: Implement the minimal pure catalog functions**

Define the nine hub IDs/order and the 12-slug legacy map. Normalize case-only localized hub values and return the Start Here hub only for truly unknown content.

- [ ] **Step 2: Extend the content schema**

Keep legacy `pubDate`, `tags`, `faq`, and `sources` optional while defining the handoff's slug, intent, hub, evidence, reviewer, schema, canonical, hreflang, translation, and publication fields. Use a passthrough object so governance fields are not stripped.

- [ ] **Step 3: Adapt routing and JSON-LD**

Keep locale/slug routing stable. Emit dates, FAQ data, citations, article type, image, and in-language values only when supported by visible data.

- [ ] **Step 4: Run catalog tests**

Run: `node --test test/guide-catalog.test.mjs`

Expected: PASS.

### Task 3: Stage and integrate the verified library

**Files:**
- Create: `scripts/import-guide-library.mjs`
- Create: `public/assets/guides/**`
- Create/modify: `src/content/guides/**/*.md`

**Interfaces:**
- Consumes: a `--source` path pointing to `01_FINAL_EXTRACTED_MULTILINGUAL_LIBRARY`
- Produces: a staging tree with flat route-locale article folders plus English and localized public assets

- [ ] **Step 1: Implement staging-only import**

The importer validates the verified manifest counts and action map, writes to a new staging directory, maps `zh-Hant → zh` and `pt-PT → pt`, and never overwrites the repository content tree directly.

- [ ] **Step 2: Run the importer into a temporary staging directory**

Run: `node scripts/import-guide-library.mjs --source /Users/xup/Downloads/RxDown_AGENT_HANDOFF_2026-08-20/01_FINAL_EXTRACTED_MULTILINGUAL_LIBRARY --output <mktemp-directory>`

Expected: 109 English files, 872 localized files, 17 English SVGs, and 136 localized SVGs.

- [ ] **Step 3: Back up the authorized replacements**

Check `git status -s` for the 27 replacement files, copy those files to a task-specific temporary backup, and verify the backup count before replacement.

- [ ] **Step 4: Integrate new files and authorized replacements**

Copy new article files without overwriting, replace only the three approved slugs per locale, and copy assets into their public route locations.

- [ ] **Step 5: Run library contract tests**

Run: `node --test test/guide-library.test.mjs`

Expected: PASS with 1,089 article files and no missing localized assets.

### Task 4: Refresh the Guides directory

**Files:**
- Create: `src/components/GuideDirectory.astro`
- Modify: `src/pages/guides/index.astro`
- Modify: `src/pages/[lang]/guides/index.astro`
- Modify: `src/i18n/guides-ui.js`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: normalized, grouped guides and localized category/UI strings
- Produces: category navigation, search, category sections, counts, and article cards

- [ ] **Step 1: Build the shared directory component**

Render an editorial hero, nine category jump links, a labeled search input, and one crawlable section per category. Each article card displays category, title, description, evidence date, and priority without relying on a unique hero image.

- [ ] **Step 2: Add progressive search behavior**

Filter cards by normalized title, description, medication, and keyword text; preserve all links without JavaScript and announce result counts through an ARIA live region.

- [ ] **Step 3: Replace duplicate index templates with the component**

Keep separate English and localized route files only for static path concerns; move shared rendering into the component.

- [ ] **Step 4: Add responsive editorial styling**

Use the existing warm clinical tokens, visible focus states, 44px touch targets, compact cards, reduced-motion handling, and mobile-safe horizontal category navigation.

### Task 5: Refresh article pages and add the app promotion

**Files:**
- Create: `src/components/GuideArticle.astro`
- Create: `src/components/GuideAppPromo.astro`
- Modify: `src/pages/guides/[slug].astro`
- Modify: `src/pages/[lang]/guides/[slug].astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: normalized guide metadata, existing `STRINGS`, `GUIDES_UI`, `APP_STORE_URL`, `PLAY_STORE_URL`, and `/shots/report.webp`
- Produces: one localized article template and a reusable two-store promotion block

- [ ] **Step 1: Build the shared article component**

Render one H1, category breadcrumb/badge, honest evidence date, handoff body, optional legacy FAQ, related guides, and source-aware structured data.

- [ ] **Step 2: Build the localized app promotion**

Place the block after related reading so it is the final section of every article. Reuse the localized homepage report copy and store labels, show `/shots/report.webp`, link directly to both stores, and include the non-prescribing boundary.

- [ ] **Step 3: Replace duplicate article templates**

Both route files pass their locale/entry/slug to `GuideArticle.astro`; route generation remains unchanged.

### Task 6: Verify rendered behavior and quality

**Files:**
- Create: `test/rendered-guides.test.mjs`

**Interfaces:**
- Consumes: `dist/` from a fresh Astro production build
- Produces: evidence for route, SEO, link, asset, category, and app-promotion correctness

- [ ] **Step 1: Write rendered-output assertions**

Assert 1,089 guide article outputs; exactly one H1 per article; canonical and nine-language hreflang clusters; no broken local guide or asset references; category UI on every index/article; and exactly one report image, App Store link, and Google Play link on every article.

- [ ] **Step 2: Run a fresh full build**

Run: `npm run build`

Expected: exit 0 with all static routes generated.

- [ ] **Step 3: Run all automated verification**

Run: `npm test && npm run test:rendered`

Expected: all tests pass with zero failures.

- [ ] **Step 4: Perform source and responsive review**

Review the spec line by line, inspect the complete diff, and render English and Traditional Chinese Guides/index/article pages at phone and desktop widths. Confirm category navigation, search, tables, localized figures, dark mode, and store actions.

- [ ] **Step 5: Re-run the final gate**

Run: `npm run build && npm test && npm run test:rendered`

Expected: all commands exit 0 after the final edits.
