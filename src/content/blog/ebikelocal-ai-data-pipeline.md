---
title: "Building an AI Spec-Driven Data Pipeline for eBikeLocal"
description: "How I aggregated fragmented vendor data into one accurate nationwide directory using an AI-assisted pipeline, Google APIs, and serverless Postgres."
pubDate: "Jul 9 2026"
heroImage: "/images/ebikelocal.webp"
---

Directory sites live or die on data quality. If the listings are stale, wrong, or thin, people leave and they do not come back. eBikeLocal is a nationwide directory that helps riders find e-bike dealers, rental shops, and service centers near them, so the entire product rests on one hard problem: keeping accurate, current business data for thousands of locations without a team of people maintaining it by hand.

Here is how I built the pipeline that makes that possible, and where AI tooling actually earned its place instead of just adding noise.

## The data problem

E-bike vendor data is scattered. Every major brand publishes its own dealer locator, and each one uses a different format, a different schema, and a different update schedule. One brand gives you clean JSON with coordinates. The next gives you a paginated HTML page with store hours buried in a footer. A third returns partial records that are missing the fields you need most.

Pulling all of that into a single, trustworthy dataset means solving three things at once:

1. **Aggregation.** Collecting location and inventory data from dozens of brand-specific sources.
2. **Normalization.** Mapping every source into one common schema so a dealer from Brand A and a dealer from Brand B look identical to the front end.
3. **Enrichment.** Filling gaps like hours, photos, ratings, and precise coordinates that the vendor feeds often leave out.

Doing this once by hand is tedious. Doing it on a repeating schedule, across the whole country, is not realistic for a solo build. So I automated the whole thing.

## The architecture

The pipeline runs as an automated workflow with four clear stages.

**Vendor API aggregation.** The pipeline polls brand-specific vendor APIs for new and updated locations. Each source gets its own small adapter that knows how to authenticate, page through results, and pull raw records. Keeping the source-specific logic isolated in adapters means adding a new brand later is a contained change, not a rewrite.

**Schema normalization.** Every raw record gets mapped into one shared schema. This is the unglamorous part that matters most. Address formats get standardized, phone numbers get cleaned, and inconsistent field names get reconciled so downstream code never has to care which brand a record came from.

**Google API enrichment.** Once a record is normalized, I enrich it with the Google Places and Maps APIs. That fills in the fields vendor feeds tend to miss: accurate latitude and longitude, business hours, photos, and ratings. The goal is a listing that feels complete and current, not a bare name and address.

**Storage on Neon.** The enriched records are upserted into a serverless Postgres database on Neon. Upserting rather than reinserting is what prevents data drift. A location that already exists gets updated in place, and a genuinely new one gets added, so re-running the pipeline converges on a clean dataset instead of creating duplicates.

The front end is built with Astro for static-first performance and deployed on Vercel. Riders get a fast, accessible interface, and the heavy data work happens in the pipeline, not in the browser.

## Where AI actually helped

I want to be specific here, because "AI-powered" gets thrown around loosely. The AI did not magically write the product. It sped up the parts of development that are normally slow and repetitive.

I used a spec-driven approach with three tools:

- **Claude Code** for scaffolding the pipeline from a written spec. I described the adapter interface, the normalized schema, and the enrichment rules, and used it to generate the first working structure I could then refine.
- **Cursor** for in-editor iteration, especially when adjusting individual vendor adapters and reconciling schema edge cases.
- **Ollama** for running local models during development, which kept iteration fast and cheap while I was testing prompts and transformations.

The value was not code I could not have written. It was pace. Writing a clear spec first and generating from it meant I spent my time on the decisions that actually needed judgment, like how to resolve conflicting data between a vendor feed and Google, instead of typing boilerplate for the twentieth adapter.

## What I would tell anyone building something similar

A few lessons held up across this project.

**Normalize early and normalize hard.** Most of the pain in a multi-source pipeline comes from letting source-specific quirks leak downstream. Force everything into one schema as soon as possible and the rest of the system gets simpler.

**Design for re-runs.** A pipeline you can safely run again is worth far more than one that produces a perfect result once. Upserts, idempotent steps, and stable record keys are what let the data stay fresh without constant babysitting.

**Use AI for leverage, not autopilot.** Writing a real spec before generating anything is what made the AI tooling useful. Skip the spec and you get plausible code that quietly makes the wrong assumptions.

**Keep enrichment separate from ingestion.** Pulling vendor data and enriching it with Google APIs are two different jobs with different failure modes. Keeping them as distinct stages made the whole thing easier to debug when a single source misbehaved.

eBikeLocal is live, and the pipeline keeps the directory current without manual upkeep. If you are working on a data-heavy product and wrestling with fragmented sources, this pattern of aggregate, normalize, enrich, and upsert has held up well for me. You can see the result at [ebikelocal.com](https://ebikelocal.com).
