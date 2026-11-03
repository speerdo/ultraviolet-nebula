---
title: "Invoice for Trades | Free Invoice Generator for Contractors"
description: "A free, no-signup invoice generator for contractors and the trades, with 27 trade-specific templates, live totals, and a clean PDF that never leaves the browser."
pubDate: "2026-10-13"
heroImage: "/images/invoicefortrades_desktop.webp"
mobileImage: "/images/invoicefortrades_mobile.webp"
projectUrl: "https://invoicefortrades.com"
technologies:
  - "Astro"
  - "Svelte 5"
  - "TypeScript"
  - "Tailwind CSS"
  - "Vercel"
  - "pdfmake"
  - "Satori"
  - "Vitest"
  - "ESLint"
  - "Vercel Analytics"
company: "Creative Bandit, LLC"
---

## Project Overview

Invoice for Trades is a free invoice generator built for contractors and the trades. A plumber, roofer, or electrician fills in the job, adjusts a line item list that already matches how their trade bills, and downloads a clean PDF or prints it. There is no account, no signup, and no watermark on the output.

The site carries 27 trade templates, each with its own landing page, preset line items, default terms, trade-specific fields, sample invoice, and FAQ. The generator itself is one Svelte island that is shared across the home page and every template page.

### The Challenge

Tradespeople invoice from a truck at the end of a long day, often on a phone with one bar of signal. The tools aimed at them mostly want a subscription, a verified account, and a client list uploaded to somebody's server before a single invoice can be sent. The alternative, a generic Word template, ignores how the work is actually quoted: a service call fee, two hours of labor at a different rate, parts with and without tax, and a permit line that should not be marked up.

There is also a trust problem specific to invoicing. The document carries a homeowner's name, address, and contact details, and a tradesperson should not have to reason about where that data goes. Any tool in this category has to answer that question before it asks for anything.

### The Solution

- **Templates that follow the trade's billing model**: Each of the 27 templates ships preset line items written for that trade, so roofing starts with tear-off and install priced per square, plumbing starts with a trip fee and hourly labor, and construction starts with site prep, a lumber package, and framing labor. The presets are a starting point, not a locked format.
- **Local-first by design**: The invoice never leaves the browser. Drafts are stored in local storage with a version tag, so a half-finished invoice survives a refresh and a future schema change fails safe instead of loading garbage. The business block is stored once and reused across every trade page, and the invoice number increments while keeping its prefix and padding.
- **Money math in integer cents**: Totals are computed in cents with explicit half-away-from-zero rounding, so a line at 85.5 hours does not drift a cent across the subtotal, discount, tax allocation, and total. Discounts are allocated pro rata across taxable lines before tax is applied, which is the part generic template tools usually get wrong.
- **PDF on demand, not on page load**: The PDF engine is imported only when Download is pressed, so the initial page ships no PDF library. The same document definition drives Print, which keeps the two outputs consistent.
- **Nothing to install and nothing to explain**: The page holds the form and a live preview side by side on desktop and stacked on mobile, with a real-time total, so the tradesperson sees the finished document while typing.

### Technical Implementation

The site is Astro in static output mode with no adapter, so every page is prerendered HTML served from Vercel's CDN. A single Svelte 5 island built on runes owns the generator state, and the rest of the interface is plain Astro components styled with Tailwind v4 through the Vite plugin, using design tokens defined once in the global stylesheet.

The invoice model is separated from the UI: types, pure totals math, formatting, defaults, local storage, and the rune-based store each live in their own module, with the math, storage, formatting, and store covered by unit tests. Storage reads and writes are wrapped so an unavailable local storage leaves the invoice working in memory instead of throwing.

The 27 trade pages are content collection entries validated by a Zod schema at build time, so a malformed file fails the build instead of shipping. A content test enforces the rules that matter at this scale: every related slug resolves, and no two trades share a title, intro, preset list, section heading, or FAQ question. A separate test fails on an em dash anywhere in the trade content.

SEO is generated rather than hand-written. Each trade gets a canonical URL, FAQ and breadcrumb structured data built from the same JSON that renders the page, and a share image rendered at build time with Satori and resvg. Analytics events cover PDF downloads and affiliate clicks, and the whole project runs through a single verify script that chains type checking, linting, tests, and a production build.

### Responsibilities

- Designed and built the generator end to end
- Modeled the invoice, line item, and totals contracts
- Implemented the integer-cent totals math and its edge-case test suite
- Built the Svelte 5 generator island with live preview and autosave
- Implemented the PDF document builder and the lazy-loaded download and print paths
- Authored the 27 trade templates, preset line items, and FAQ content
- Built the SEO layer: JSON-LD, canonicals, sitemap, and per-trade OG images
- Set up linting, tests, and the CI verification pipeline
- Configured the Vercel deployment and web analytics
