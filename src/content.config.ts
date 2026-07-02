import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().max(90),
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).min(1),
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .length(3),
    sources: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .min(3),
  }),
});

export const collections = { guides };
