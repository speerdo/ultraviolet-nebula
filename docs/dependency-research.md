# Dependency Security & Framework Alternatives Research

Date: 2026-08-18
Last verified: 2026-08-18 (external claims re-checked against npm registry, GitHub Advisory Database, and Astro docs)
Context: Triggered by GitHub email about `fast-xml-parser` (GHSA-8r6m-32jq-jx6q, CVE-2026-73569).
Question: Can replacing the React stack with something else (e.g. Svelte) reduce the frequency of these security warnings?

## TL;DR

- The `fast-xml-parser` advisory that triggered this is already patched in your tree (`5.10.1`); it came in transitively via `@astrojs/rss`, not via the React stack. `npm audit` currently reports **0 vulnerabilities**.
- Your React stack exists for **one component** (`ExperienceAccordion.jsx`). The other React component, `ProjectAccordion.jsx`, is dead code (not imported anywhere).
- **The cheapest win has nothing to do with framework choice:** the accordion is the third section down the page but hydrates with `client:load`. Switching to `client:visible` costs one line and defers the entire React bundle until the user scrolls to it.
- Replacing React with Svelte (or another framework) would meaningfully reduce transitive dependency surface, bundle size, and likely security-advisory volume over time.
- Svelte itself is not advisory-free; it has had several advisories in 2026. But it has a far smaller transitive footprint than React + react-dom + motion + framer-motion.
- The lowest-risk option is to drop React entirely and rebuild the single accordion as a plain Astro component with a `<script>` tag (no framework). This removes the most packages and the most attack surface.

## Current state of `ultraviolet-nebula`

### Direct React-related dependencies in `package.json`

```
"@astrojs/react": "^6.0.2"
"motion": "^12.43.0"          # pulls in framer-motion@12.43.0
"react": "^19.2.8"
"react-dom": "^19.2.8"
```

### Where React is actually used

Only two `.jsx` components exist in the repo:

| File | Used? | Hydration | Animation import |
|---|---|---|---|
| `src/components/HomePage/ExperienceAccordion.jsx` | Yes, via `Experience.astro:66` | `client:load` | `motion/react` |
| `src/components/HomePage/ProjectAccordion.jsx` | **No** (no importer found anywhere) | — | `framer-motion` |

Both components are simple accordions:
- Local `useState` for which panel is open
- `motion.div` / `AnimatePresence` for a `height: 0 → auto` animation

That's the entire React usage. There is no React router, no SSR data fetching, no Suspense, no React Server Components. Nothing else in the project depends on React.

> **Undeclared dependency (new finding):** `ProjectAccordion.jsx` imports from `framer-motion`, which is **not** in `package.json` — it resolves only because `framer-motion` happens to be a transitive dependency of `motion`. If `motion` ever restructures its deps, that import breaks. This is a phantom dependency and one more reason the file should just be deleted.

### Transitive dependency tree introduced by React + motion

From `npm ls --all`:

```
@astrojs/react@6.0.2
├── @types/react-dom@19.2.3
├── @types/react@19.2.17
├── @vitejs/plugin-react@5.2.0
│   ├── @babel/plugin-transform-react-jsx-self@7.29.7
│   ├── @babel/plugin-transform-react-jsx-source@7.29.7
│   └── react-refresh@0.18.0
├── react-dom@19.2.8
└── react@19.2.8

motion@12.43.0
├── framer-motion@12.43.0
│   ├── motion-dom@12.43.0
│   │   └── motion-utils@12.39.0
│   ├── motion-utils@12.39.0
│   ├── react-dom@19.2.8 (deduped)
│   └── react@19.2.8 (deduped)
├── react-dom@19.2.8 (deduped)
└── react@19.2.8 (deduped)

@vercel/analytics@2.0.1
└── react@19.2.8 (deduped)
```

Unpacked sizes from the npm registry (verified 2026-08-18):

| Package | Unpacked |
|---|---|
| `react-dom` | 7.32 MB |
| `framer-motion` | 4.81 MB |
| `motion` | 683 KB |
| `react` | 172 KB |
| `@astrojs/react` | 35 KB |
| **Total** | **~13 MB** |

(For comparison: `svelte` is 2.88 MB, `@astrojs/svelte` is 24 KB.)

> **Correction:** an earlier revision of this doc put the React subtree at "roughly 8 MB." That undercounted — it listed `motion` at 683 KB but omitted `framer-motion`, which is the 4.81 MB bulk of that pair. The real figure is **~13 MB unpacked**, plus Babel plugins and types.

> **`@vercel/analytics` is not a React dependency here.** The `react@19.2.8 (deduped)` line above is an npm tree artifact: `react` is an **optional** peer dependency of `@vercel/analytics`, and `BaseLayout.astro:5` imports the Astro entrypoint (`@vercel/analytics/astro`), not the React one. Removing React will **not** break analytics. An earlier reading of this tree suggested otherwise.

So one accordion island drags in roughly **13 MB of unpacked JS source** plus a non-trivial chunk shipped to the browser — and, because of `client:load`, that chunk is fetched and hydrated on every page load whether or not the user ever scrolls to the Experience section.

## Where the security advisories actually come from

The GitHub email was about `fast-xml-parser`. That package has nothing to do with React:

```
@astrojs/rss@4.0.19
└── fast-xml-parser@5.10.1   ← patched
```

`@astrojs/rss` only uses `fast-xml-parser` for RSS feed generation. The advisory (CVE-2026-73569, High, CVSS 8.7 — repeated DOCTYPE declarations reset entity-expansion counters, enabling a "billion laughs" DoS) affects `>= 5.9.3, < 5.10.1` and is already patched in your lockfile. No action required.

The recent `npm audit` findings (`js-yaml`, `nanoid`) were similarly unrelated to React — they came in via Astro's own internals and `postcss`. Your `package.json` already carries a `yaml: ^2.9.0` override for one of these.

So **React is not currently the source of the advisories you've received**. However, the question is still valid because:

1. The React ecosystem is one of the largest npm consumers and frequently shows up in advisory feeds (React Router, react-server-dom, axios-style companion packages, etc.).
2. You're carrying React + react-dom + motion + framer-motion + Babel plugins + types purely for one accordion.

## Advisory frequency: React vs. Svelte (GitHub Advisory Database)

Raw advisory-search counts are a bad metric because "react" matches hundreds of packages whose names merely contain "react" (`react-router`, `react-native`, `react-scripts`, `react-helmet`, `react-flow`, …). Filtering to the framework packages themselves — **all of the following were re-verified against the GitHub Advisory Database on 2026-08-18 and are accurate**:

**Svelte (the framework) — direct advisories in 2026:**

| Advisory | Issue | Severity | Patched |
|---|---|---|---|
| GHSA-f3cj-j4f6-wq85 (CVE-2026-42599 family) | SSR XSS via insecure Promise serialization in `hydratable` | Moderate (5.3) | 5.55.7 |
| GHSA-pr6f-5x2q-rwfp (CVE-2026-42599) | SSR XSS via spread attributes | Moderate (5.1) | 5.55.7 |
| GHSA-f7gr-6p89-r883 (CVE-2026-27121) | SSR XSS via spread attributes (earlier occurrence) | Moderate | 5.51.5 |
| GHSA-crpf-4hrx-3jrp | SSR attribute spreading enumerates prototype-chain properties | Moderate | — |
| GHSA-rcqx-6q8c-2c42 | XSS via DOM clobbering of internal framework state | Moderate | — |
| GHSA-9rmh-mm8f-r9h6 | ReDoS in `<svelte:element>` tag validation | Moderate | — |
| GHSA-qgvg-pr8v-6rr3 (CVE-2026-27902) | XSS via HTML comment injection in SSR error-boundary hydration markers | Moderate | — |
| GHSA-77vg-94rm-hx3p (CVE-2026-42570) | `devalue` DoS via sparse array deserialization | **High (7.5)** | devalue 5.8.1 |

Note the recurrence: **spread-attribute SSR XSS in Svelte has been patched at least twice in 2026** (5.51.5, then again at 5.55.7). That is a code path Astro exercises when it server-renders a Svelte island.

**React (the framework) — direct advisories in 2026:**

- GHSA-wx67-qw84-cm4g (CVE-2026-44907) — `react-server-dom-{webpack,turbopack,parcel}` DoS in Server Functions, High (7.5), patched in 19.0.8 / 19.1.9 / 19.2.8. **You do not use any `react-server-dom-*` package.**
- A long tail of `react-router` advisories (multiple High) — **you don't use React Router.**
- `react` and `react-dom` themselves have had relatively few direct CVEs; the volume lives in the surrounding ecosystem (router, server components, Next.js).

Takeaway: **Both frameworks publish advisories.** React's surrounding ecosystem publishes many more because it's bigger, but essentially none of that volume touches packages you actually install. Svelte publishes fewer advisories, but a higher fraction of them land in `svelte` itself, on the SSR path Astro uses. Switching frameworks is not a silver bullet. For *your* usage profile (a single accordion with one `useState` and a height animation), Svelte is a clear win on dependency count and bundle size; the advisory-risk delta is closer to a wash than the raw counts suggest.

## Framework alternatives considered

### Option 0 — Fix the hydration directive (do this regardless)

`Experience.astro:66` uses `client:load`, the most eager directive, on the only island in the entire site. `index.astro` renders `Expertise → Work → Experience`, so the accordion is well below the fold on every viewport.

```diff
- <ExperienceAccordion experiences={experiences} client:load />
+ <ExperienceAccordion experiences={experiences} client:visible={{ rootMargin: "200px" }} />
```

- Cost: one line. No dependency changes, no component rewrite.
- Effect: React + motion are no longer fetched or hydrated on initial page load; they load when the user scrolls near the section. `rootMargin` starts hydration 200 px early so it's already interactive by the time it's on screen.
- This is orthogonal to every option below and should be done first — it's the largest real-user performance win available and carries essentially zero risk.

### Option A — Switch to Svelte 5

- Astro has first-class official support: `@astrojs/svelte@9.0.1` (peers: `astro ^7.0.0`, `svelte ^5.43.6`), Svelte `5.56.9` is current. Both are compatible with your Astro `^7.1.6`.
- The accordion pattern maps 1:1 (`<script>` with `let openIndex = $state(null)`, Svelte's `slide` transition replaces `motion.div`'s height animation — no extra animation library needed).
- Removes: `react`, `react-dom`, `motion`, `framer-motion`, `@astrojs/react`, Babel JSX plugins, `@types/react*` (~13 MB unpacked).
- Adds: `svelte` (2.88 MB), `@astrojs/svelte` (24 KB).
- Net: significantly fewer packages; Svelte compiles components, so the client bundle for this island shrinks dramatically.
- Trade-off: Svelte's 2026 advisories are concentrated in SSR rendering, and Astro **does** SSR-render Svelte islands to produce the static HTML. Mitigating factor: those advisories all require *untrusted data* flowing into spread attributes or `hydratable` promises. Your accordion renders from local content collections, not user input, so the vulnerable paths aren't reachable in practice. Keep Svelte updated anyway; the team patches quickly.

> **Correction:** an earlier revision listed "you already depend on `devalue@^5.9.0`" as a point in Svelte's favor. That argument is backwards — see the `devalue` note under Housekeeping below.

### Option B — Switch to Solid or Preact

- **Solid** (`@astrojs/solid-js`): JSX syntax stays the same, so porting `ExperienceAccordion.jsx` is mechanical. Smaller runtime than React. Fewer advisories. Fine-grained reactivity, no virtual DOM.
- **Preact** (`@astrojs/preact`): Closest to React API; can drop in much existing React code with the `preact/compat` alias. ~3 KB runtime. Good if you want minimal code churn.
- Both let you drop `motion`/`framer-motion` in favour of a CSS transition.

> **Correction:** an earlier revision suggested swapping to "a small lib like `motion-one`." That advice is stale. Motion One was folded into the unified `motion` package when Framer Motion became independent — `motion` now ships both the React API (`motion/react`) and the framework-agnostic vanilla API (`motion` / `motion/dom`). There is no separate maintained `motion-one` to migrate to. If you want to keep Motion without React, you don't add anything: you just change `import { motion } from 'motion/react'` to `import { animate } from 'motion'`. For a single height transition, plain CSS is still simpler than either.

### Option C — Drop the framework entirely (plain Astro + `<script>`)

This is the **lowest-risk** option and the one I'd recommend evaluating first.

- The accordion is the only interactive thing in the React island. It's a button toggle + a height transition. No state management, no list virtualization, no form state — nothing that justifies a framework runtime.
- Removes the entire React subtree plus `motion`/`framer-motion` plus `@astrojs/react`. Adds nothing.
- Downside: you lose the declarative JSX pattern. For one accordion, that's an acceptable trade. If you expect to grow the interactive surface area of the site significantly, a framework (Svelte or Solid) becomes more attractive again.

**Implementation note — which CSS technique to use (updated for 2026 browser support):**

There are two ways to build this now, and the appealing one is not yet portable:

| Technique | Support | Verdict |
|---|---|---|
| `grid-template-rows: 0fr → 1fr` on a wrapper with `overflow: hidden` | Universal | **Use this.** Animates to intrinsic height, works in every engine today. |
| `<details>` + `::details-content` + `interpolate-size: allow-keywords` / `calc-size()` | `::details-content` is Baseline newly available (Sept 2025, all three engines). But `interpolate-size` and `calc-size()` are **Chromium-only** — Firefox and Safari have not shipped them. | Not yet. Without `interpolate-size`, the height change is instant (not animated) in Firefox and Safari. |

So: build on `<details>`/`<summary>` for the free semantics, keyboard handling, and accessibility (`name="..."` gives you exclusive-accordion behaviour with zero JS), drive the animation with the grid-rows trick, and if you want the native `::details-content` path, gate it behind `@supports (interpolate-size: allow-keywords)` as a progressive enhancement. Total: ~30 lines of CSS and little or no JavaScript.

### Option D — Keep React, but trim it

- Replace `motion` with a CSS height transition. This alone drops `framer-motion` (4.81 MB) + `motion` (683 KB) + `motion-dom` + `motion-utils` — about **42% of the unpacked React-stack weight** and the majority of the client-side animation payload.
- Delete `ProjectAccordion.jsx` (dead code, and the source of the undeclared `framer-motion` import).
- Keep `@astrojs/react` / `react` / `react-dom`.
- Smallest behavioral change. Doesn't fix the underlying "React for one accordion" issue but does cut the most advisory-prone third of the stack.

## Housekeeping found along the way

These are independent of the framework decision:

1. **`devalue@^5.9.0` is a direct dependency with zero usage anywhere in `src/`.** Nothing in your code imports it; Astro pulls its own copy transitively as needed. It also has its own advisory history (GHSA-77vg-94rm-hx3p, High — you're on a patched version). It looks like it was added manually and should simply be removed from `package.json`. Verify with a build after removing.
2. **`motion` is a major version behind** — you're on `12.43.0`, latest is `13.1.0`. Your `^12.43.0` range won't pick that up. Moot if you drop `motion` entirely.
3. **Patch updates available within your existing ranges:** `astro` 7.2.3 (you allow `^7.1.6`), `@astrojs/react` 6.0.3 (you allow `^6.0.2`). A plain `npm update` picks these up.
4. **`npm audit` is currently clean** (0 vulnerabilities, as of 2026-08-18).

## Recommendation

For your specific situation (one simple interactive component, otherwise static Astro site):

1. **Change `client:load` → `client:visible` on `Experience.astro:66`.** One line, zero risk, biggest real-user win. Do this today regardless of everything else.
2. **Delete `ProjectAccordion.jsx`** — unused dead code that also carries an undeclared `framer-motion` import.
3. **Remove `devalue` from `package.json`** — unused direct dependency.
4. **Then evaluate Option C (plain Astro + `<script>`)** as the default. It removes the most dependencies and the most advisory surface, and the implementation cost is small. Build it on `<details>`/`<summary>` with the `grid-template-rows: 0fr/1fr` transition — *not* `interpolate-size`, which is Chromium-only.
5. If you anticipate more interactive islands in the future (filters, charts, live data), **Option A (Svelte 5)** is the next-best choice — smaller runtime, smaller tree, official Astro integration.
6. **Avoid Option B (Preact/Solid) unless you specifically want to preserve JSX syntax.** They're intermediate steps between "no framework" and "smaller framework"; for one component it's not worth a new dependency.
7. **Option D** is the safe minimum if you don't want to touch component code now.

## Caveats

- Advisory counts are a noisy proxy for risk. What matters is whether *your* usage pattern exercises the vulnerable code paths. Most of React's 2026 advisory volume is in `react-router` and `react-server-dom` — neither of which you install. Symmetrically, Svelte's SSR-XSS advisories require untrusted data in spread attributes, which your content-collection-driven accordion doesn't have.
- Svelte's SSR advisories are relevant *because* Astro SSR-renders Svelte islands, and the spread-attribute issue has now been patched twice in 2026. If you go with Svelte, keep it current.
- Unpacked npm sizes are a proxy for maintenance surface, **not** for shipped bytes. Actual gzipped client JS is far smaller. The relative ordering (react-dom > framer-motion > svelte > motion > react) holds, but don't quote 13 MB as a page-weight figure.
- The original `fast-xml-parser` advisory is a reminder that the loudest advisories often come from deep transitive deps unrelated to your UI framework (RSS parser, YAML parser, nanoid generator). Replacing React won't stop those — only `npm audit fix` / Dependabot / `overrides` will.

## Sources

Local verification (run 2026-08-18): `npm audit`, `npm ls --all`, `npm view <pkg> version`, `npm view <pkg> dist.unpackedSize`, `npm view <pkg> peerDependencies`, plus `grep` over `src/` for imports and `client:` directives.

- https://docs.astro.build/en/reference/directives-reference/ — Astro template/hydration directives, incl. `client:visible` and its `rootMargin` option
- https://docs.astro.build/en/guides/framework-components/ — Astro's official guidance on framework islands and hydration
- https://docs.astro.build/en/guides/integrations-guide/svelte/ — `@astrojs/svelte` setup (v9.0.1, Svelte 5)
- https://github.com/advisories/GHSA-8r6m-32jq-jx6q — the triggering advisory (CVE-2026-73569, High/8.7; patched in 5.10.1; you're already on 5.10.1)
- https://github.com/advisories/GHSA-pr6f-5x2q-rwfp — Svelte SSR spread-attribute XSS (CVE-2026-42599, patched 5.55.7)
- https://github.com/advisories/GHSA-f3cj-j4f6-wq85 — Svelte `hydratable` promise-serialization SSR XSS (patched 5.55.7)
- https://github.com/sveltejs/svelte/security/advisories/GHSA-f7gr-6p89-r883 — earlier Svelte SSR spread-attribute XSS (CVE-2026-27121, patched 5.51.5)
- https://github.com/sveltejs/svelte/security/advisories/GHSA-crpf-4hrx-3jrp — Svelte SSR spread includes prototype-chain properties
- https://github.com/advisories/GHSA-77vg-94rm-hx3p — `devalue` sparse-array DoS (CVE-2026-42570, High/7.5, patched 5.8.1)
- https://github.com/advisories/GHSA-wx67-qw84-cm4g — `react-server-dom-*` Server Functions DoS (CVE-2026-44907, High/7.5) — not installed here
- https://github.com/sveltejs/svelte/security — Svelte security overview
- https://motion.dev/blog/framer-motion-is-now-independent-introducing-motion — Framer Motion → Motion rename, and the vanilla/React unification that supersedes `motion-one`
- https://motion.dev/docs/react-upgrade-guide — Motion / Framer Motion upgrade guide
- https://developer.chrome.com/blog/styling-details — `::details-content` and `<details>` styling
- https://developer.chrome.com/docs/css-ui/animate-to-height-auto — `interpolate-size` / `calc-size()` for animating to `height: auto` (Chromium-led; check support before relying on it)
- https://www.builder.io/blog/animated-css-accordions — animated `<details>` accordion techniques and their support caveats
