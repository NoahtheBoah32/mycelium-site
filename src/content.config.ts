import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    template: z.enum(['kapihan', 'bag', 'pdc', 'workshop']),
    schedule: z.string().optional(),
    date: z.coerce.date().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
    isOnline: z.boolean().default(false),
    isFree: z.boolean().default(false),
    isRecurring: z.boolean().default(false),
    description: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().optional(),
    image: z.string().optional(),
    sortOrder: z.number().default(0),
    // Speaker (bag template)
    speakerName: z.string().optional(),
    speakerRole: z.string().optional(),
    speakerBio: z.string().optional(),
    // Organizer
    organizer: z.string().optional(),
    organizerLogo: z.string().optional(),
    // PDC template
    dateRange: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    partner: z.enum(['ppa', 'baganihan']).optional(),
  }),
});

export const collections = { events };
