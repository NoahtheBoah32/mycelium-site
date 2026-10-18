// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  // Preserve the existing spacing between inline elements after the Astro 7 update.
  compressHTML: true,
});
