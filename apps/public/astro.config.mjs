import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
// For Vercel deployment: uses @astrojs/vercel adapter
// For other Node.js hosting: uses @astrojs/node adapter
// Switch adapters by changing which one is active in the adapter field
export default defineConfig({
  output: 'server',
  // Use vercel adapter for Vercel deployment:
  // adapter: vercel(),
  // Use node adapter for other Node.js hosting (Railway, Render, VPS):
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: 4321,
    host: true
  }
});
