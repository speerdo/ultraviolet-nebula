---
title: "eBikeLocal | E-Bike Vendor Directory"
description: "A nationwide directory of e-bike vendors, built with an AI spec-driven data pipeline that aggregates vendor-specific location data and enriches it with Google APIs"
pubDate: "2026-05-14"
heroImage: "/images/ebikelocal.png"
mobileImage: "/images/ebikelocal_mobile.png"
projectUrl: "https://ebikelocal.com"
technologies:
  - "Astro"
  - "Neon DB"
  - "Vercel"
  - "TypeScript"
  - "Google Places API"
  - "Google Maps API"
  - "Claude Code"
  - "Cursor"
  - "Ollama"
company: "Creative Bandit, LLC"
---

## Project Overview

eBikeLocal is a nationwide directory helping riders find e-bike dealers, rental shops, and service centers near them. Vendor location data is sourced directly from vendor-specific APIs and enriched with Google APIs, giving users accurate, up-to-date business information in a fast, accessible interface.

### The Challenge

E-bike vendor data is fragmented across dozens of brand-specific APIs, each with different formats, schemas, and update cadences. Manually aggregating and maintaining this data at scale wasn't viable—and enriching it with additional context (hours, reviews, photos) required layering in external APIs without introducing data drift.

### The Solution

I built an AI spec-driven data pipeline that automates the entire ingestion and enrichment workflow:

- **Vendor API Aggregation**: Pulls location and inventory data directly from brand-specific vendor APIs across multiple e-bike manufacturers
- **Google API Enrichment**: Enhances raw vendor records with Places and Maps API data—coordinates, hours, photos, and ratings
- **AI-Driven Workflow**: Used Claude Code, Cursor, and Ollama to spec, generate, and iterate on the pipeline automation—dramatically accelerating development
- **Neon DB**: Serverless Postgres on Neon stores and serves the enriched vendor dataset with fast query performance at the edge

### Technical Implementation

The frontend is built with Astro for static-first performance and deployed on Vercel. The data pipeline runs as an automated workflow: vendor APIs are polled for new or updated locations, records are normalized into a common schema, and Google APIs fill in enrichment fields before records are upserted into Neon DB. The entire pipeline spec was authored and iterated using AI tooling—Claude Code for spec-driven scaffolding, Cursor for in-editor iteration, and Ollama for local model inference during development.

### Responsibilities

- Designed and developed the full platform end-to-end
- Integrated multiple vendor-specific APIs for location data
- Built Google API enrichment layer (Places, Maps)
- Architected and automated the AI spec-driven data pipeline
- Configured Neon DB schema and query layer
- Deployed and configured on Vercel
