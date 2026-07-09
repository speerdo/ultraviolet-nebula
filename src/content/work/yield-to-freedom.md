---
title: "Yield to Freedom | Income ETF Research Platform"
description: "A graded, searchable directory of 200+ income ETFs with a transparent A-to-D scoring system, strategy explainers, and income calculators. Built from the ground up with a custom data ingestion engine syncing daily from market data vendors."
pubDate: "2026-07-02"
heroImage: "/images/yieldtofreedom_desktop.webp"
mobileImage: "/images/yieldtofreedom_mobile.webp"
projectUrl: "https://yieldtofreedom.com"
technologies:
  - "Astro"
  - "TypeScript"
  - "Tailwind CSS"
  - "Neon Postgres"
  - "Drizzle ORM"
  - "Clerk"
  - "Stripe"
  - "Resend"
  - "Chart.js"
  - "Alpine.js"
  - "SnapTrade SDK"
  - "Vercel"
  - "Node.js"
  - "Tiingo API"
company: "Creative Bandit LLC"
---

## Project Overview

Yield to Freedom is an income ETF research and dividend strategy platform built to help investors turn a lump sum into a visible income stream. The site grades 200+ ETFs across three pillars (Income, Stability, and Growth) using a transparent A-to-D scoring system, and pairs the directory with plain-English strategy explainers, an income calculator, comparison tools, and a stack builder.

The product is live at [yieldtofreedom.com](https://yieldtofreedom.com) and operated under Creative Bandit LLC. Phase 1 research is free and advertiser-supported, with a roadmap toward advanced portfolio tools, dashboards, and brokerage-linked tracking.

### The Challenge

The income ETF category has expanded dramatically. There are now hundreds of funds with radically different structures, risk profiles, and yield quality. A 15% headline yield can mean a disciplined covered-call strategy or a fund quietly returning your own principal. Most existing research is scattered, jargon-heavy, or written to sell something. Investors needed a tool that grades funds transparently, explains trade-offs honestly, and answers the practical question: *if I put real dollars into this ETF, what cashflow might it add to my life?*

Building that required not just a marketing site, but a full data pipeline that ingests market data, computes trailing yields and grades, and keeps them current, all behind a fast, searchable frontend.

### The Solution

I designed and built the complete system across three coordinated codebases:

- **Frontend (YieldToFreedom):** An Astro site deployed on Vercel with edge middleware, Tailwind CSS styling, Alpine.js interactivity, and Chart.js for distribution visualizations. Clerk handles authentication, Stripe powers paid features, and Resend delivers the starter guide and transactional email. SnapTrade SDK integration is in place for future brokerage-linked portfolio tracking.
- **Data Engine (etf-data-engine):** A pnpm monorepo with separate API and worker apps. The worker runs on Railway as an always-on ingestion + cron scheduler, pulling ETF data from Tiingo and writing the shared `etf.*` schema in Neon Postgres via Drizzle ORM. The API app exposes a pooled read layer over stable read views.
- **Shared DB Schema (yield-to-freedom-db-schema):** A standalone package holding the Drizzle schema definitions consumed by both the frontend and the data engine, keeping types consistent across the whole system.

### Key Features

- **200+ ETFs graded** with an A-to-D scoring system factoring in expense ratio, yield consistency, NAV trend, distribution frequency, and pillar fit, not just the headline yield
- **Three-pillar framework** (Income, Stability, Growth) with a 40/30/30 starting template mnemonic for diversification
- **Live income calculator** that models estimated annual and monthly income against a user-entered lump sum and target
- **ETF directory** with per-fund profile pages showing trailing 12-month yield, 1-year return, pay frequency, expense ratio, and grade
- **Top-rated ETFs by pillar** dashboard that refreshes after each weekly data sync
- **Strategy playbook** including DRIP mechanics and income-investing explainers
- **Comparison and stack-builder tools** for evaluating funds side by side
- **Blog** with in-depth comparisons (e.g., income ETFs vs. rental property) and methodology documentation
- **Weekly data syncs** from Tiingo into Neon Postgres, with a grader pipeline that recomputes scores on each sync

### Key Results

- Launched a fully operational research platform with 200+ graded ETFs and daily-refreshing data
- Built a custom ingestion engine that automates the entire data pipeline (vendor sync, backfill, grading, and indexing) with no manual data entry
- Delivered a transparent scoring methodology documented publicly so users know exactly what each grade rewards and ignores
- Achieved fast static-rendered performance on Vercel with edge middleware and on-demand revalidation

### Responsibilities

- Architected the full system across three codebases (frontend, data engine, shared schema)
- Built the Astro frontend with Tailwind, Alpine.js, and Chart.js
- Designed the Neon Postgres schema and Drizzle ORM layer
- Implemented the ingestion worker with Tiingo API integration and cron scheduling on Railway
- Developed the A-to-D grading algorithm and documented the methodology
- Integrated Clerk authentication, Stripe payments, and Resend email
- Set up the SnapTrade SDK foundation for brokerage-linked portfolio tracking
- Configured Vercel deployment with edge middleware and web analytics
- Authored the strategy content and blog under Creative Bandit LLC