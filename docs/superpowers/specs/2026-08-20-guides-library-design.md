# RxDown Guides Library Refresh Design

## Goal

Turn the existing flat 15-guide directory into a multilingual editorial library that preserves the verified 2026-08-20 handoff, organizes every guide into a clear category, and closes every article with a localized app-store conversion block.

## Canonical user journey

A reader lands on Guides, chooses one of nine clearly named topics or searches the article list, opens the most relevant article, reads the evidence and safety boundaries without interruption, then reaches a visually distinct RxDown block that explains how to record dose, sleep, and symptoms and export a clinician-ready report. The block offers one App Store action and one Google Play action.

## Content boundary

- Import the 109 English evidence-master articles and all 109 matching articles in each of eight localized libraries.
- Follow `EXISTING_SITE_UPDATE_MAP.csv`: add 106 slugs and replace only `benzodiazepine-tapering-ashton`, `hold-and-reinstate-guide`, and `sleep-during-withdrawal`.
- Retain the 12 existing slugs that are not replaced. The final site contains 121 guides per locale and 1,089 guide article pages.
- Preserve all handoff frontmatter, review flags, source hashes, canonical data, evidence cutoffs, references, and localized figures.
- Keep the handoff's clinical publication gates intact. This task prepares and verifies the local website; it does not push or deploy it.

## Information architecture

Every article belongs to one of the handoff's nine editorial hubs:

1. Start Here & Tapering Fundamentals
2. Antidepressants
3. Benzodiazepines
4. Sleep Medications
5. Sleep & CBT-I
6. Other Medications
7. Symptoms & Recovery
8. Practical Tapering Tools
9. Research & Emerging Evidence

The Guides index uses these hubs as the primary browsing model. Category navigation remains compact on mobile, category sections expose their article counts, and search is an enhancement rather than the only way to find content. The 12 retained legacy articles receive category mappings in code so all locales stay consistent without rewriting 108 existing Markdown files.

## Content and routing architecture

- Keep the existing Astro content collection and flat locale folders (`en` at the collection root; other routes under `zh`, `ja`, `ko`, `de`, `es`, `fr`, `id`, and `pt`).
- Extend the Zod schema to accept both legacy metadata and the complete handoff governance fields. Unknown handoff fields must not be discarded.
- Continue static route generation through `getStaticPaths()`, using the current locale/slug helpers.
- Use the imported `featured_image` for article visuals. Localized article figures resolve to localized public assets.
- Generate canonical and reciprocal hreflang links from actual locale availability. Keep `x-default` on the English URL.
- Emit structured data only when it matches visible content. Legacy frontmatter can continue supplying FAQ and citation data; new articles use their visible body and references without fabricating parsed FAQ data.

## Page design

The aesthetic remains RxDown's warm clinical editorial system: paper ground, deep navy type, mint navigation cues, amber evidence accents, Fraunces display typography, and restrained motion. The refreshed index replaces the undifferentiated image-card wall with an editorial table-of-contents hero, category navigator, search field, and compact article cards designed for 121 entries.

Article pages add a category badge, evidence-review date, a more useful related-reading section based on category and medication metadata, and the localized RxDown app promotion as the final content section. The promotion uses the existing real `report.webp` product screenshot, localized existing homepage copy, and direct App Store and Google Play links. It describes tracking and clinician-ready reporting, never diagnosis or prescribing.

## Accessibility and performance

- Category controls and search remain keyboard accessible and usable without pointer precision.
- Touch targets are at least 44px high; focus indicators remain visible.
- Search progressively enhances server-rendered links; all content remains crawlable without JavaScript.
- Images include dimensions, useful localized alt text, and lazy loading below the fold.
- Reduced-motion preferences disable non-essential reveal effects.
- Tables retain keyboard-scrollable wrappers.

## Verification

- Node contract tests prove 121 guides per locale, exactly 109 imported articles per locale, the nine expected hub counts, preservation of action/review/hash metadata, and localized asset availability.
- Unit tests prove category normalization, legacy categorization, grouping, and deterministic ordering.
- A production Astro build proves every static route renders.
- Rendered-output tests prove one H1 per article, complete canonical/hreflang clusters, no broken local guide/asset links, category markup on indexes and articles, and the screenshot plus both store links on every article.
- Manual responsive review covers English and Traditional Chinese at phone and desktop widths.

## Research basis

- Astro v5 content collections and schemas: https://v5.docs.astro.build/en/guides/content-collections/
- Astro v5 static dynamic routes and `getStaticPaths()`: https://v5.docs.astro.build/en/guides/routing/
- Astro internationalization routing: https://docs.astro.build/en/reference/modules/astro-i18n/
- Astro sitemap integration and i18n: https://v4.docs.astro.build/en/guides/integrations-guide/sitemap/
- RxDown handoff source of truth: `/Users/xup/Downloads/RxDown_AGENT_HANDOFF_2026-08-20/`
