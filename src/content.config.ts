import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const legacyGuideSchema = z
  .object({
    title: z.string().max(90),
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).min(1),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).length(3),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(3),
  })
  .passthrough();

const importedGuideSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    primary_keyword: z.string(),
    secondary_keywords: z.array(z.string()),
    search_intent: z.string(),
    content_hub: z.string(),
    priority: z.string(),
    article_type: z.string(),
    article_action: z.enum(['new', 'live-update']).optional(),
    evidence_cutoff: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    last_evidence_search: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    review_status: z.string(),
    required_reviewers: z.string(),
    specialist_review_required: z.boolean(),
    canonical_medication_name: z.string().optional(),
    brand_name_search_synonyms: z.array(z.string()).optional(),
    medication_class: z.string().optional(),
    medical_specialty: z.string().optional(),
    schema_types: z.array(z.string()).min(1),
    featured_image: z.string(),
    app_keyword_theme: z.string(),
    suggested_internal_links: z.array(z.string()).optional(),
    terminology_standard: z.string(),
    region_note: z.string(),
    source_locale: z.string(),
    locale: z.string().optional(),
    canonical_url: z.string().url().optional(),
    hreflang: z.record(z.string(), z.string().url()).optional(),
    translation_source_sha256: z.string().regex(/^[a-f0-9]{64}$/).optional(),
    translation_model: z.string().optional(),
    translation_date: z.string().optional(),
    translation_status: z.string().optional(),
    translation_review_note: z.string().optional(),
    localized_keywords_status: z.string().optional(),
    publication_status: z.string().optional(),
    required_reviewers_en: z.string().optional(),
    region_note_en: z.string().optional(),
    medication_class_en: z.string().optional(),
  })
  .passthrough();

const guides = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/guides',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.union([legacyGuideSchema, importedGuideSchema]),
});

export const collections = { guides };
