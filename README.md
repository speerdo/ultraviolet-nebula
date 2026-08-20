<div align="center">

# ⚡ adamspeerweb.dev

**The personal portfolio & blog of [Adam Speer](https://github.com/speerdo)** — AI & Automation Engineer, Full Stack Developer, Indianapolis IN.

[![Live Site](https://img.shields.io/badge/%F0%9F%9A%80_live-adamspeerweb.dev-8b5cf6?style=for-the-badge)](https://adamspeerweb.dev)
![Astro](https://img.shields.io/badge/Astro-7-blueviolet?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Client JS](https://img.shields.io/badge/framework_JS-0_kb-22c55e?style=for-the-badge)

*Ships **0 KB of framework JS** to the browser. Interactions — like the professional experience accordion — are hand-rolled with scoped styles and tiny inline `<script>` blocks.*

</div>

---

## ✨ Highlights

- 🤖 **AI-forward positioning** — featured automation projects, experience, and expertise sections driven by simple data arrays in [Experience.astro](src/components/HomePage/Experience.astro)
- 🧩 **Zero client-side framework** — React was removed in favor of scoped styles, semantic markup, and small inline `<script>` blocks (see [`ExperienceAccordion.astro`](src/components/HomePage/ExperienceAccordion.astro))
- 📝 **Content collections** — blog and work case studies as typed Markdown/MDX with schema validation
- 🎨 **Custom design system** — purple-nebula theme, Smooch Sans + Lato, Tailwind v4 via Vite plugin
- 🔍 **SEO-ready** — sitemap, RSS feed, OpenGraph tags, canonical URLs
- 📄 **Resume distribution** — versioned PDFs served straight from `public/pdf/`

## 🧰 Tech Stack

| Layer | Choice |
| :--- | :--- |
| Framework | [Astro 7](https://astro.build) (static output) |
| Styling | Tailwind CSS 4 + scoped component styles |
| Language | TypeScript (`strict`) |
| Content | Astro Content Collections (Markdown + MDX) |
| Hosting | Vercel (+ `@vercel/analytics`) |

## 🚀 Project Structure

```text
/
├── public/
│   ├── fonts/          # Smooch Sans, Lato
│   ├── images/         # logos, project screenshots, OG images
│   └── pdf/            # resume versions
├── src/
│   ├── components/
│   │   └── HomePage/   # Experience, Expertise, Work, Testimonials
│   ├── content/
│   │   ├── blog/       # blog posts (MD/MDX)
│   │   └── work/       # project case studies (MD/MDX)
│   ├── layouts/        # Base, BlogPost, WorkPost, Contact
│   ├── pages/          # file-based routes
│   ├── styles/         # global.css (theme tokens, Tailwind entry)
│   ├── consts.ts       # site title & description
│   └── content.config.ts
└── astro.config.mjs
```

Astro looks for `.astro` / `.md` / `.mdx` files in `src/pages/` — each becomes a route based on its filename.

## 🧞 Commands

All commands run from the project root:

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npx astro check` | TypeScript + `.astro` diagnostics |

## 📬 Elsewhere

[![LinkedIn](https://img.shields.io/badge/LinkedIn-adam--speer-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/adam-speer)
[![GitHub](https://img.shields.io/badge/GitHub-speerdo-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/speerdo)
[![Email](https://img.shields.io/badge/Email-adamspeer@gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:adamspeer@gmail.com)

---

## Credit

Theme inspired by the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/) and built on the [Astro blog starter](https://github.com/withastro/astro/tree/latest/examples/blog). Rest of it — handcrafted. 🛠️
