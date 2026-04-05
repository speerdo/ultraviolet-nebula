// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.adamspeerweb.dev',
    integrations: [
        mdx(),
        sitemap(),
        // vite:react-babel may delete its `transform` in configResolved when it thinks
        // Babel can be skipped. Vite then keeps a stale per-plugin filter (WeakMap) that
        // still matches `.jsx` files but `getHookHandler(transform)` is undefined →
        // "Cannot read properties of undefined (reading 'call')". A no-op Babel plugin
        // forces `canSkipBabel` to false so the transform hook is never removed.
        react({
            include: /\.(jsx|tsx|mdx)$/,
            babel: {
                plugins: [() => ({ visitor: {} })],
            },
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
        // Pre-bundled client deps (incl. Astro dev toolbar) used to emit
        // `sourceMappingURL=…entrypoint__js.js.map`, which browsers resolve under
        // `/@id/...` and get 404. This applies only to dependency optimization, not your app.
        optimizeDeps: {
            esbuildOptions: {
                sourcemap: false,
            },
        },
    },
});