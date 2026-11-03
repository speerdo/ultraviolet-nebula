---
title: "Home Water Pure | Sourced Water Softener & Filter Guide"
description: "An independent guide to whole-home water softeners and filters, comparing 37 systems on rated capacity, service flow, certification status, and live price, with the sizing math shown on the page."
pubDate: "2026-08-21"
heroImage: "/images/homewaterpure_desktop.webp"
mobileImage: "/images/homewaterpure_mobile.webp"
projectUrl: "https://homewaterpure.com"
technologies:
  - "Astro"
  - "TypeScript"
  - "Neon Postgres"
  - "Drizzle ORM"
  - "Vercel"
  - "Amazon Creators API"
  - "Vercel Cron"
  - "MDX"
  - "Schema.org JSON-LD"
  - "Ahrefs"
company: "Creative Bandit, LLC"
---

## Project Overview

Home Water Pure is an independent guide to whole-home water treatment: softeners, filters, and combination systems. It compares 37 products across 14 brands on the four numbers that actually decide the purchase, namely rated capacity, service flow, certification status, and today's price. Every spec is read off the manufacturer's own page, dated, and linked, so a reader can check any claim against its source, and prices come from the merchant feed on a daily refresh.

The site pairs that catalog with six full reviews, four buying pillars, three brand comparison pieces, a filter-and-softener combination guide, twelve support articles, a sizing calculator, and cost breakdowns by size. The calculator answers what size softener a household actually needs. The cost pages show what a system should run installed.

### The Challenge

Water treatment is a category where the marketing copy and the spec sheet disagree, prices move, and a discontinued model can outlive its own product page in search results. Most of the material a homeowner finds is either a dealer's landing page or an affiliate roundup that repeats the dealer's numbers. That makes accuracy an architectural problem rather than an editorial one: a directory is only worth reading if its numbers can be traced, and only worth trusting if they stay current after launch.

The second constraint was performance and crawlability. Organic search is the only meaningful acquisition channel for a site like this, so the pages have to stay light, the canonical URLs have to resolve one way, and the structured data has to describe what is actually on the page.

### The Solution

- **Database as the single source of truth**: Products, offers, merchants, and price history live in Neon Postgres and are read at build time through Drizzle ORM. No spec or price is typed into a template, so a correction lands in one row and propagates to every page that references it.
- **A source URL on every row**: Each seeded product carries the manufacturer page it was read from, the date it was checked, and a note separating what is certified from what is merely claimed. Certifications are checked against the NSF listing rather than the badge on the box.
- **Price automation that survives the API change**: Amazon retired the old Product Advertising API in May 2026, so the price pipeline was rebuilt against the Creators API. A Vercel cron runs daily at 06:00, writes into a price history table, and fires a deploy hook so the static pages rebuild with the new numbers instead of serving the price they were built with.
- **Prices rendered only from the database**: A shared price component gates every price surface, including the prose, so an out-of-date figure cannot be printed beside a live affiliate link.
- **The sizing math shown on the page**: The calculator takes daily household use and water hardness, derives grains per week, applies a 25 percent reserve, then brackets the required capacity with standard tank sizes and surfaces the systems in the catalog that fit. Every intermediate value is visible, so a reader can audit the recommendation against a dealer's quote.
- **Compliance built into the link layer**: Every outbound affiliate link routes through an internal redirect that logs the click, serves a no-cache response, and attributes the click to its page. Clicks are deduplicated per day with a coarse hash so reporting works without storing an IP. Link attributes live in a single sanctioned link component and the disclosure is its own component, so neither is retyped per page.
- **Content that answers the second question**: The pillars, reviews, and comparisons are backed by a support section covering sizing, salt types, regeneration, well water, and installation, so the site can hold a reader who is not ready to buy today.

### Technical Implementation

The site is Astro in static output mode on the Vercel adapter, with TypeScript in strict mode and a schema defined once in Drizzle and applied through versioned SQL migrations. Products, offers, and historical prices are queried at build time; long-form content lives in MDX collections with typed frontmatter.

The price refresh runs as a scheduled Vercel function. It resolves each verified ASIN through the Creators API, writes a new row into the price history table, and triggers a rebuild, which keeps the catalog, the comparison tables, and the prose in sync with what the merchant is actually charging.

Security and SEO were treated as build constraints rather than post-launch chores. A content security policy is generated from hashes of the scripts and styles Astro emits, which required externalizing stylesheets so the hashes match what the browser receives. Trailing slashes are pinned so one page has one crawlable URL, the sitemap filters out intentionally noindexed pages and carries a lastmod drawn from frontmatter, and JSON-LD for products, articles, breadcrumbs, and the organization graph is generated from the same data the page renders.

Email capture and unsubscribe run on opaque tokens that are never rotated once issued, and the unsubscribe flow is inert on a GET so a mail scanner cannot unsubscribe a reader by opening a link.

### Responsibilities

- Designed and developed the full platform end to end
- Modeled the Postgres schema and wrote the migration history on Neon
- Built the build-time data layer behind the catalog, comparison, and cost pages
- Implemented the sizing calculator and the price display components
- Rebuilt the price automation on the Creators API after the old API was retired
- Authored the reviews, pillars, comparisons, and support library
- Implemented the CSP, sitemap policy, canonical URL rules, and structured data
- Built the affiliate redirect layer with click logging and disclosure placement
- Configured hosting, cron scheduling, and deploy hooks on Vercel
