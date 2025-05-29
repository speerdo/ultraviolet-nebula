---
title: "RecycleOldTech.com – A Hybrid Astro Web App"
description: "Building a nationwide directory for electronics recycling"
pubDate: "May 29 2025"
heroImage: "/images/recycleoldtech_desktop.png"
---

Every year, millions of electronic devices are discarded improperly, creating significant environmental issues. RecycleOldTech.com is an ambitious nationwide directory designed to simplify the process of responsibly recycling electronic waste. As the lead developer, I took this project from concept to deployment, combining powerful web technologies and innovative data-handling techniques to deliver a high-performance, scalable solution.

## The Challenge

The goal was clear: create a reliable, user-friendly platform to help users across the United States find certified e-waste recycling centers efficiently.

## Technical Implementation

### Gathering Data with Outscraper

One of the initial technical challenges was compiling a comprehensive list of recycling centers. I employed Outscraper, a tool specifically designed for extracting large-scale data from Google Maps. With Outscraper, I collected detailed information on thousands of electronics recycling locations, including:

- Business names
- Addresses
- Phone numbers
- Websites
- Operational hours

### Data Processing and Import into Supabase

The raw data extracted from Outscraper needed significant processing to ensure consistency and usability. Using custom scripts written in Node.js and Python, I formatted and cleaned the data, ensuring fields were accurate and consistent. Once prepared, I imported this structured dataset into Supabase, a robust PostgreSQL-based backend service that offered rapid querying capabilities and reliable storage.

### Astro Framework for Hybrid Static and Dynamic Rendering

To ensure excellent performance and optimal SEO, I chose Astro for the front-end development. Astro's unique approach allows the flexibility of combining static site generation (SSG) and server-side rendering (SSR).

**Static Site Generation (SSG):** General pages like the homepage, blog, and informational content are pre-rendered at build time, ensuring fast load times and high SEO performance.

**Server-Side Rendering (SSR):** Dynamic content-heavy pages, particularly state and city-specific directories, utilize SSR. When users request local recycling center data, Astro dynamically queries Supabase to deliver fresh, accurate listings tailored to each specific location.

This hybrid approach allowed me to balance performance, scalability, and dynamic user experiences effectively.

## Results and Future Expansion

RecycleOldTech.com now provides quick, seamless access to certified recycling centers nationwide, helping users responsibly manage e-waste. The site delivers strong performance metrics, an SEO-friendly structure, and an intuitive user experience.

Future development includes:

- Enhancing interactive map features
- Expanding content resources for recycling education
- Continuously improving data accuracy and breadth

### Technical Highlights

- **Data Collection:** Google Maps scraping with Outscraper
- **Backend Storage:** Supabase (PostgreSQL)
- **Frontend Framework:** Astro (hybrid SSG & SSR)
- **Additional Technologies:**
  - Node.js
  - Vercel (deployment)
  - TypeScript
  - Tailwind CSS

This project underscores my capability in integrating complex data pipelines, utilizing modern web frameworks, and delivering performant and scalable solutions. To explore RecycleOldTech.com firsthand, visit [www.recycleoldtech.com](https://www.recycleoldtech.com).
