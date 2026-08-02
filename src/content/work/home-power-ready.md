---
title: "Home Power Ready | Standby Generator & Home Backup Directory"
description: "An independent directory of whole-house standby generators, solar generators, and home battery backup, with sourced specs, regional installer coverage, and interactive sizing and cost tools built on a zero-JS static architecture"
pubDate: "2026-08-02"
heroImage: "/images/homepowerready_desktop.webp"
mobileImage: "/images/homepowerready_mobile.webp"
projectUrl: "https://homepowerready.com"
technologies:
  - "Astro"
  - "Preact"
  - "Neon DB"
  - "Vercel"
  - "TypeScript"
  - "Amazon Product API"
  - "Schema.org JSON-LD"
  - "Ahrefs"
  - "Claude Code"
company: "Creative Bandit, LLC"
---

## Project Overview

Home Power Ready is an independent directory for homeowners researching backup power: whole-house standby generators, solar generators, and home battery systems. It pairs a sourced product catalog with regional installer coverage and two interactive tools that answer the questions buyers actually start with, namely what size unit they need and what it will cost installed.

The site ships as 167 static pages built from a catalog of 32 models across 9 brands, 23 of them carrying live pricing, spanning model detail pages, brand pages, head-to-head comparisons, cost breakdowns by size, buying guides, and installer directories across dozens of metro areas. Every spec on the site is sourced rather than transcribed from marketing copy.

### The Challenge

Backup power is a high-consideration purchase where most of the available information is either a manufacturer's marketing page or a thin affiliate roundup. Specs conflict between sources, prices drift, and discontinued models linger in search results long after they stop shipping. A directory in this space is only useful if its numbers can be trusted, which makes data accuracy an architectural problem rather than an editorial one.

The second constraint was performance. Content sites like this typically get buried under scripts, and Core Web Vitals suffer directly in a category where organic search is the only meaningful acquisition channel.

### The Solution

- **Database as the single source of truth**: Every spec, price, and installer record lives in Neon Postgres and is queried at build time. Nothing is hand-typed into a template, so a correction lands in one place and propagates to every page that references it.
- **Zero-JS by default**: The site is fully static with no client-side framework runtime. JavaScript ships only on the two calculator islands and two cookieless analytics beacons. Astro's prefetch is deliberately left off to hold the line.
- **Sizing calculator**: A Preact island that estimates required kW from selected appliance loads, using standard generator-sizing practice by summing running watts, adding the largest single motor's starting surge rather than the sum of all of them, applying 20% headroom, and rounding up to the next standard residential size.
- **Cost estimator**: Produces an installed-cost range from unit size, fuel type, and site variables, backed by documented cost ranges rather than a single misleading number.
- **Automated product media**: An Amazon Product API pipeline resolves verified ASINs to real product photography and refreshes it on every Vercel build, so imagery does not silently rot as listings change.

### Technical Implementation

The frontend is Astro in static output mode on the Vercel adapter, with Preact powering the two calculator islands. TypeScript runs in strict mode with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`, which matters when the entire page tree is generated from database rows that may legitimately be null.

Content is split by nature rather than convenience: catalog data (brands, models, specs, comparisons, cities, installers) lives in Neon and is read through `@neondatabase/serverless` inside `getStaticPaths`, while long-form guides are Astro content collections. Schema migrations are versioned SQL applied through a CI-parity runner, so the schema history is reviewable alongside the code.

SEO infrastructure is treated as a first-class feature. Canonical URLs, OG tags, sitemap entries, and JSON-LD `@id` values all derive from a single configured site origin, trailing slashes are pinned so no internal link triggers a redirect, and the sitemap filters out intentionally noindexed pages so Search Console is not asked to reconcile a contradiction. Product, Article, and Breadcrumb structured data is emitted per page type.

Development leaned heavily on Claude Code for spec-driven implementation, data-accuracy audits, and resolving findings from Ahrefs site crawls.

### Responsibilities

- Designed and developed the full platform end to end
- Modeled and migrated the Postgres schema on Neon
- Built the build-time data layer feeding all 167 generated pages
- Implemented the sizing and cost calculator islands in Preact
- Built the Amazon media pipeline with ASIN research and per-build refresh
- Authored the buying guides and cost content
- Implemented the SEO layer: JSON-LD, canonicals, sitemap policy, and noindex rules
- Ran accessibility, Core Web Vitals, and data-accuracy audits ahead of launch
- Configured hosting, security headers, and analytics on Vercel
