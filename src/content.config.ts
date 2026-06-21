import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    template: z.enum(['kapihan', 'bag', 'pdc', 'workshop', 'hov']),
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
    // Workshop details
    capacity: z.string().optional(),
    // Organizer
    organizer: z.string().optional(),
    organizerLogo: z.string().optional(),
    // PDC template
    dateRange: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    partner: z.enum(['ppa', 'baganihan']).optional(),
    archived: z.boolean().default(false),
  }),
});

const reels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reels' }),
  schema: z.object({
    platform: z.enum(['instagram']),
    permalink: z.string(),
    r2VideoUrl: z.string(),
    r2ThumbUrl: z.string().optional(),
    caption: z.string().optional(),
    postedAt: z.coerce.date(),
    hidden: z.boolean().default(false),
  }),
});

export const collections = { events, reels };
