# Implementation Plan: Remove React, Migrate Accordion to Plain Astro

Date: 2026-08-18
Status: **Implemented and verified 2026-08-18** — see [Verification results](#verification-results) at the end
Companion doc: [`dependency-research.md`](./dependency-research.md)
Chosen approach: **Option C** — drop the framework entirely, rebuild the accordion as a plain Astro component with a `<script>` tag.

## Goals

1. Rebuild `ExperienceAccordion` as a framework-free Astro component.
2. Delete the unused `ProjectAccordion.jsx`.
3. Remove `react`, `react-dom`, `@astrojs/react`, and `motion` (~13 MB unpacked, and the site's only client-side JS bundle).
4. Remove two unused direct dependencies found during research (`devalue`, `glob`).
5. Update every remaining package to its latest compatible version.

**Net result:** `package.json` goes from 10 dependencies + 10 devDependencies to **6 + 9**, and the site ships zero framework runtime.

## Pre-flight

```bash
cd /home/adam/Projects/ultraviolet-nebula
git checkout -b feature/remove-react
npm run build          # capture a known-good baseline before touching anything
```

Note the build output (page count, any warnings) so you can diff against it at the end.

---

## Phase 1 — Delete dead code

`ProjectAccordion.jsx` has no importer anywhere in the repo, and it imports from `framer-motion`, which is not in `package.json` (it resolves only as a transitive of `motion`). It goes first because nothing depends on it.

```bash
rm src/components/HomePage/ProjectAccordion.jsx
grep -rn "ProjectAccordion" src/ || echo "clean"
```

---

## Phase 2 — Build the replacement component

Create `src/components/HomePage/ExperienceAccordion.astro`.

### Design decisions

**Not using `<details>`/`<summary>`.** It's tempting — free semantics and keyboard handling — but it does not animate cleanly. The browser removes the `open` attribute immediately on close, which cuts the collapse animation off mid-flight; every working `<details>` accordion works around this with JavaScript that defers the attribute removal until `transitionend`. Since we need a script either way, a `<button aria-expanded>` + panel pair is simpler, fully portable, and animates correctly in both directions.

**Height animation via `grid-template-rows: 0fr → 1fr`.** This animates to intrinsic height with no hardcoded pixel values and works in every current engine. The alternative — `::details-content` with `interpolate-size: allow-keywords` — is Chromium-only as of 2026 (Firefox and Safari have not shipped `interpolate-size`/`calc-size()`), so the height change would be instant in two of three engines. Revisit when support lands.

**Preserved from the React version:** all Tailwind classes, the `background-accordion` / `company-name` / `company-link` classes from `global.css`, the `+`/`−` indicator, the 300 ms duration, one-panel-open-at-a-time behavior, and the `bullets`-optional guard (2 of the 5 experience entries have no `bullets` array).

### The component

```astro
---
interface Experience {
  company: string;
  dates: string;
  title: string;
  description: string;
  bullets?: string[];
  image: string;
  link: string;
}

const { experiences } = Astro.props as { experiences: Experience[] };
---

<div class="w-full max-w-4xl mx-auto space-y-4" data-accordion>
  {
    experiences.map((experience, index) => (
      <div class="border border-gray-700 rounded overflow-hidden">
        <button
          type="button"
          id={`accordion-trigger-${index}`}
          aria-expanded="false"
          aria-controls={`accordion-panel-${index}`}
          data-accordion-trigger
          class="flex w-full cursor-pointer flex-col gap-2 p-4 text-left text-white background-accordion md:flex-row md:items-center md:justify-between md:gap-4"
        >
          <h3 class="company-name m-0! shrink-0 text-xl">{experience.company}</h3>
          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-0 md:ml-auto">
            <span class="text-sm text-gray-300 md:mr-4">{experience.dates}</span>
            <span class="text-sm text-gray-300 tabular-nums" aria-hidden="true" data-accordion-icon>+</span>
          </div>
        </button>

        <div
          id={`accordion-panel-${index}`}
          role="region"
          aria-labelledby={`accordion-trigger-${index}`}
          data-accordion-panel
          class="accordion-panel bg-gray-900"
        >
          <div class="accordion-panel-inner">
            <div class="p-4 text-gray-100">
              <h3 class="mb-4 mt-4">{experience.title}</h3>

              <p class="mb-4">{experience.description}</p>

              {experience.bullets && experience.bullets.length > 0 && (
                <ul class="mb-8 pl-4 space-y-2">
                  {experience.bullets.map((bullet) => (
                    <li class="text-gray-200 flex items-start">
                      <span class="text-blue-400 mr-2">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div class="flex justify-start mb-8">
                <div class="w-1/4 h-28 rounded overflow-hidden flex items-center">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    class="w-full h-full object-contain object-center rounded"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <a href={experience.link} target="_blank" rel="noopener noreferrer" class="company-link">
                Company Website
              </a>
            </div>
          </div>
        </div>
      </div>
    ))
  }
</div>

<style>
  .accordion-panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 300ms ease;
  }

  .accordion-panel-inner {
    overflow: hidden;
    min-height: 0;
  }

  [aria-expanded='true'] + .accordion-panel {
    grid-template-rows: 1fr;
  }

  @media (prefers-reduced-motion: reduce) {
    .accordion-panel {
      transition: none;
    }
  }
</style>

<script>
  function setOpen(trigger: HTMLElement, open: boolean) {
    trigger.setAttribute('aria-expanded', String(open));

    const icon = trigger.querySelector('[data-accordion-icon]');
    if (icon) icon.textContent = open ? '−' : '+';

    const panel = trigger.nextElementSibling;
    if (panel) panel.toggleAttribute('inert', !open);
  }

  document.querySelectorAll('[data-accordion]').forEach((root) => {
    const triggers = Array.from(
      root.querySelectorAll<HTMLElement>('[data-accordion-trigger]')
    );

    triggers.forEach((trigger) => {
      setOpen(trigger, false); // establish the collapsed starting state

      trigger.addEventListener('click', () => {
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
        triggers.forEach((other) => setOpen(other, false));
        if (willOpen) setOpen(trigger, true);
      });
    });
  });
</script>
```

**Why `min-height: 0` on the inner wrapper:** without it, the grid item refuses to shrink below its content height and the collapse does nothing. This is the one non-obvious part of the grid-rows technique.

**Why `inert` on closed panels:** at `0fr` the content is visually collapsed but still in the accessibility tree and still focusable. `inert` removes it from both, matching what React's `AnimatePresence` did by unmounting. `inert` is Baseline widely available.

### Optional hardening — no-JS fallback

As written, panels start closed and require JS to open. If you want the content readable without JS, add this to `BaseLayout.astro`'s `<head>`:

```html
<script is:inline>document.documentElement.classList.add('js');</script>
```

then render panels open by default and let CSS collapse them only when JS is present:

```css
.accordion-panel { grid-template-rows: 1fr; }
:root.js .accordion-panel { grid-template-rows: 0fr; }
:root.js [aria-expanded='true'] + .accordion-panel { grid-template-rows: 1fr; }
```

The inline script runs before paint, so there's no flash of expanded content. Skip this if you're comfortable requiring JS — it's a portfolio site, not a content archive.

---

## Phase 3 — Wire it up

In `src/components/HomePage/Experience.astro`, change the import on line 2 and the usage on line 66:

```diff
- import ExperienceAccordion from './ExperienceAccordion.jsx';
+ import ExperienceAccordion from './ExperienceAccordion.astro';
```

```diff
-  <ExperienceAccordion experiences={experiences} client:load />
+  <ExperienceAccordion experiences={experiences} />
```

The `client:load` directive disappears entirely — there's no island left to hydrate. (This supersedes the `client:visible` recommendation in the research doc, which was the fix for *keeping* React.)

Then delete the old component:

```bash
rm src/components/HomePage/ExperienceAccordion.jsx
find src -name "*.jsx" -o -name "*.tsx" | grep . || echo "no JSX left"
```

---

## Phase 4 — Remove the React integration

In `astro.config.mjs`:

```diff
  import { defineConfig } from 'astro/config';
  import mdx from '@astrojs/mdx';
  import sitemap from '@astrojs/sitemap';
- import react from '@astrojs/react';
  import tailwindcss from '@tailwindcss/vite';

  export default defineConfig({
      site: 'https://www.adamspeerweb.dev',
-     integrations: [mdx(), sitemap(), react()],
+     integrations: [mdx(), sitemap()],
      vite: {
          plugins: [tailwindcss()],
      },
  });
```

---

## Phase 5 — Prune dependencies

```bash
npm uninstall @astrojs/react react react-dom motion devalue glob
```

| Package | Why it's going |
|---|---|
| `@astrojs/react` | Integration no longer registered |
| `react`, `react-dom` | No `.jsx` files remain |
| `motion` | Replaced by the CSS grid-rows transition |
| `devalue` | **Unused.** Nothing in `src/` imports it; Astro pulls its own copy transitively |
| `glob` | **Unused.** `content.config.ts` imports `glob` from `astro/loaders`, not this package |

`devalue` and `glob` were found during the dependency research and are unrelated to React — they're just dead entries in `package.json`. Both were verified to have zero import sites in `src/`.

> **`@vercel/analytics` is unaffected.** `react` is only an *optional* peer of it, and `BaseLayout.astro:5` imports the Astro entrypoint (`@vercel/analytics/astro`). Removing React does not break analytics.

---

## Phase 6 — Update remaining packages

### Safe updates (within existing semver ranges)

```bash
npm update
```

This picks up:

| Package | Current | → |
|---|---|---|
| `astro` | 7.1.6 | 7.2.3 |
| `@astrojs/mdx` | 7.0.5 | 7.0.6 |
| `postcss` | 8.5.25 | 8.5.26 |

All patch/minor. Everything else in `package.json` is already at its latest published version (`tailwindcss` 4.3.3, `@tailwindcss/vite` 4.3.3, `autoprefixer` 10.5.4, `prettier` 3.9.6, `prettier-plugin-astro` 0.14.1, `@astrojs/sitemap` 3.7.3, `@astrojs/rss` 4.0.19, `@astrojs/check` 0.9.10, `@vercel/analytics` 2.0.1).

### ⚠️ TypeScript 7 — hold at 6.x

`typescript` has 7.0.2 available (you're on 6.0.3), but **do not take it yet**:

```
@astrojs/check@0.9.10  peerDependencies: { typescript: '^5.0.0 || ^6.0.0' }
```

`@astrojs/check` 0.9.10 is the latest published version and does not yet declare TypeScript 7 support, so `npm install typescript@7` will fail the peer check. Forcing it with `--legacy-peer-deps` would leave `npm run astro check` on an unsupported combination.

**Action:** leave `"typescript": "^6.0.3"` as-is. Re-check after `@astrojs/check` publishes a release widening that peer range.

The other major bump, `motion` 12 → 13, is moot — Phase 5 removes the package.

### Post-update verification

```bash
npm audit          # expect: 0 vulnerabilities
npm ls --all | wc -l
```

---

## Phase 7 — Verify

```bash
npm run build
npm run preview
```

Manual checks on the Experience section:

- [ ] All five panels render collapsed on load
- [ ] Clicking a header expands it with a smooth ~300 ms height animation
- [ ] Opening a second panel closes the first (one-at-a-time behavior preserved)
- [ ] Clicking an open header collapses it
- [ ] The `+` / `−` indicator flips correctly
- [ ] Gradient header background (`background-accordion`) is intact
- [ ] Company logos render; the two entries **without** `bullets` (JDR Web Solutions, Prosper Group) render without an empty `<ul>`
- [ ] "Company Website" links open in a new tab with the `company-link` hover color
- [ ] Keyboard: Tab reaches each header, Enter/Space toggles, and Tab does **not** enter a collapsed panel (this is `inert` working)
- [ ] Responsive: header switches to the row layout at `md`
- [ ] DevTools Network: **no React or motion chunk is requested**

Expected build-output change: the Experience page should no longer emit a client-side JS bundle for the island.

---

## Rollback

Everything is on the `remove-react` branch:

```bash
git checkout main            # abandon
# or, to keep the branch but undo working-tree changes:
git checkout -- . && git clean -fd
```

---

## Summary of file changes

| File | Change |
|---|---|
| `src/components/HomePage/ProjectAccordion.jsx` | **Deleted** (dead code) |
| `src/components/HomePage/ExperienceAccordion.jsx` | **Deleted** (replaced) |
| `src/components/HomePage/ExperienceAccordion.astro` | **New** |
| `src/components/HomePage/Experience.astro` | Import path + drop `client:load` |
| `astro.config.mjs` | Drop `@astrojs/react` integration |
| `package.json` | −6 deps, 3 version bumps |
| `src/layouts/BaseLayout.astro` | *Optional* — inline `js` class script |

## Follow-ups (not in scope)

- Re-evaluate `typescript@7` once `@astrojs/check` supports it.
- Re-evaluate `::details-content` + `interpolate-size` once Firefox and Safari ship it — it would let the accordion drop to near-zero JS.
- `src/components/HomePage/Experience.astro` has an unused `.projects-grid` rule in its `<style>` block (lines 83–85); it appears to be a leftover and could be removed.


---

## Verification results

Implemented and verified on 2026-08-18 (branch `feature/remove-react`).

### Automated

- `npm run build` — 24 pages, no errors. **No JS bundles emitted** (`dist/_astro/` contains CSS only); the accordion script is inlined into the HTML.
- `npx astro check` — 0 errors, 0 warnings (20 pre-existing hints, all unrelated).
- `npm audit` — 0 vulnerabilities.
- Headless Chrome interaction suite — **20/20 passed**: collapsed-on-load, `inert` applied to all 5 closed panels, `+`/`−` flip, expand to 537 px, mid-transition sampling confirms the height genuinely animates (358 px mid → 537 px end, i.e. not instant), one-at-a-time exclusivity, click-to-collapse, Enter-key activation, Tab skipping collapsed content, 3 bullet lists / 5 logos / 5 `_blank` links, gradient header intact, zero React/motion requests, zero JS errors.

Test harness lives in the session scratchpad, not the repo — Playwright was installed with `--no-save` outside the project so it never touched `package.json`.

### Deviations from the plan

- **Optional no-JS fallback: not implemented.** Panels require JS to open. Fine for a portfolio; revisit if that changes.
- **`.projects-grid` dead rule removed** from `Experience.astro` (listed as an out-of-scope follow-up in the original plan; it was three lines, so it was done). Verified the identical rule in `Work.astro`/`WorkCard.astro` is still in use — Astro styles are scoped, so only the `Experience.astro` copy was dead.
- **Declared semver ranges bumped** to match what `npm update` installed (`astro ^7.2.3`, `@astrojs/mdx ^7.0.6`, `postcss ^8.5.26`), so `package.json` states the current versions rather than trailing them.

### Confirmed at implementation time

- `typescript` held at `^6.0.3`. `@astrojs/check@0.9.10` still peers on `^5 || ^6`; TS 7.0.2 remains blocked.
- `devalue` is now purely transitive via `astro@7.2.3`, as expected.
- `overrides: { yaml: ^2.9.0 }` left in place — harmless, and everything resolves to 2.9.0.

### Known cosmetic issue (pre-existing, not a regression)

On mobile the `+`/`−` indicator wraps to its own line below the date, because the header uses `flex-col gap-1 md:flex-row`. The React version had the identical markup and behaved the same way, so this migration did not introduce it. Worth a small layout tweak if it bothers you.
