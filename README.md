# vinod.lk

Personal website for Vinod — Next.js 16 + Tailwind CSS v4 + Prismic (Slice Machine), following the AT Digital Next.js + Prismic starter setup.

## Project setup

1. Clone this repo
2. Run `npm i`
3. Run `npm outdated` to check for packages that need updating
4. Run `npm update --save` to update and save new versions in `package.json` (or `npm update {package}` individually if some updates are unstable)

## Running the project locally

Run `npm run dev` to start the [project](http://localhost:1204) and [Slice Machine](http://localhost:1203).

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js on port 1204 + Slice Machine on port 1203 |
| `npm run next:dev` | Next.js only |
| `npm run slicemachine` | Slice Machine only |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 1204 |
| `npm run lint` | ESLint |
| `npm run setup` / `npm run figma:sync` | Regenerate design tokens and fonts from `figma-variables/` |

## Project structure

```
figma-variables/          Exported Figma variable collections (JSON)
scripts/figma-to-css.mjs  Generates tokens.css + fonts.ts from figma-variables/
public/                   Static files (logo.svg)
src/app/                  App Router: layout, globals.css, fonts.ts, icon.svg, robots, sitemap, 404
src/app/(pages)/          Site pages: / , /about, /work, /blog, /contact
src/app/style-variables/  tokens.css (generated), typography.css, buttons.css, footer.css
src/components/sections/  Page sections (Hero, PageIntro, …)
src/components/ui/        Shared Styled* components (Header, Footer, Button, Container, Input)
src/data/site.ts          Navigation, footer and contact details
src/lib/buttonTypes.ts    Button variants
project.config.ts         Site name + base URL
```

## Content (Prismic)

Repository: **vinod-portfolio** (`slicemachine.config.json`).

| Document type | Used for |
| --- | --- |
| `page` | Every page. UID `home` is `/`, any other UID is `/:uid`. Built from slices |
| `blog` | Blog posts at `/blog/:uid` (template: `src/components/blog/ArticleView.tsx`). Tick **Featured** for the big card on `/blog`; **Cover title** is the shorter title on the navy cover |
| `settings` (single) | Header button, phones, email, location, WhatsApp, social + legal links, footer text, Google rating, default SEO, blog author + article sidebar CTA |
| `main_menu` (single) | Header navigation (with optional dropdown links) |
| `menu` (repeatable) | Footer columns, sorted by `order` |

Slices (`src/slices/`). In Slice Machine and the Prismic editor each slice and variation is named after its Figma component on the 📦 Components page (e.g. `cta_variants1`, `hero_variants2`). Sections that have no Figma component use the same style (`content_cards_dark`, `about_story`, …). Folder names and API ids are unchanged:

| Name in Prismic | Folder | API id |
| --- | --- | --- |
| hero_variants (1 · 3 · 4 centred, 2 breadcrumb + image, hero_about) | Hero | `hero` |
| social-proof_logos_variants1 | LogoBar | `logo_bar` |
| testimonial_variants1 | Testimonials | `testimonials` |
| featured_project_variants1 | FeaturedProject | `featured_project` |
| content_services_variants1 | ServicesGrid | `services_grid` |
| cta_variants1 | CallToAction | `call_to_action` |
| content_compare_variants1 | Compare | `compare` |
| social-proof_stats_variants1 | Stats | `stats` |
| content_process_variants1 | Process | `process` |
| content_reasons_variants1 | Reasons | `reasons` |
| blog_variants1 | BlogPreview | `blog_preview` |
| faq_variants1 / faq_article | Faq | `faq` |
| rich_text | RichText | `rich_text` |
| contact_variants1 | ContactForm | `contact_form` |
| content_split_variants1 / _platforms / _grid | SplitList | `split_list` |
| content_deliverables_variants1 / _bento | ImageCards | `image_cards` |
| content_cards_light / _dark / _numbered | FeatureCards | `feature_cards` |
| about_story, about_experience, about_skills | StoryArc, Experience, SkillsServices | `story_arc`, `experience`, `skills_services` |
| content_steps | StepsShowcase | `steps_showcase` |
| blog_index, blog_table, blog_callout | BlogIndex, ArticleTable, ArticleCallout | `blog_index`, `article_table`, `article_callout` |

Inner-page slices (Figma page frames):

| Slice | Variations | Used on |
| --- | --- | --- |
| Hero | Centred (title size Large/Medium, optional checkmarks), Split with image, Centred with photos | Every page |
| FeatureCards | Light, Dark, Numbered links | Service pages, Services, About (beliefs) |
| ImageCards | Numbered, Bento | "What you get", "Every build includes", "Websites I build" |
| SplitList | Checklist, Platforms, Card grid | "Is this right for you", "Platforms", "What I'll need" |
| StoryArc, Experience, SkillsServices | – | About |
| StepsShowcase | – | How it works |
| ContactForm | – | Contact (posts to `/api/contact`) |
| BlogIndex | – | Blog (tabs from post tags, featured post, paging) |
| ArticleTable, ArticleCallout (CTA / pull quote), Faq › Simple list | – | Inside blog posts |

Card-picking icons (`icon` select fields) map to atd-icons in `src/components/ui/SliceIcon.tsx`.

**Changing a model:** run `npm run dev`, edit in Slice Machine (http://localhost:1203), then **Push** from Slice Machine. It also regenerates `prismicio-types.d.ts` and `src/slices/index.ts`.

If Settings / Main Menu / Footer Menu are empty, the header and footer fall back to `src/data/site.ts`.

`scripts/seed/` holds the content each page was created from, in slice form: `home-content.mjs`, `pages-content.mjs` (the other 12 pages) and `blog-content.mjs` (the website-cost article).

`scripts/slice-specs.py` + `scripts/gen-slice-models.py` generated the inner-page slice models (`python3 scripts/gen-slice-models.py` rewrites the listed slices' `model.json`). After the first push, editing in Slice Machine is fine; the script is only a shortcut.

**Contact form email:** set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (optionally `CONTACT_FROM_EMAIL`) in the hosting environment. Without them the form answers with "message me on WhatsApp or email" and logs the enquiry.

## Project configuration

1. Export the variables from the vinod.lk Figma file and replace the files in `figma-variables/`. `Colors`, `Radius`, `Spacing` and `Typography` feed the shared token pool; any other collection is namespaced by its own name:
   - `Buttons` → `--color-button-*` and `--radius-button`, used by `src/app/style-variables/buttons.css`
   - `Footer` → `--color-footer-*`, used by `src/app/style-variables/footer.css`
   
   A new collection (e.g. `Header.json` → `--color-header-*`) needs no script change — just a matching `src/app/style-variables/<component>.css` and an `@import` in `src/app/globals.css`.
2. Check the button types in `src/lib/buttonTypes.ts`.
3. Run `npm run setup` to regenerate `tokens.css` and `fonts.ts`.
4. Check the fonts — `--font-title` and `--font-body` are loaded from Google Fonts via `src/app/fonts.ts`.

> The current `figma-variables/` are placeholders carried over from the starter, with the primary colour switched to the vinod.lk brand blue (`#157FF8`). Replace them with the real export once the design is ready.

## Adding button variants

`Primary` and `Secondary` are the defaults and always present. To add one (e.g. `Outline`):

1. Add it to `BUTTON_VARIANTS` in `src/lib/buttonTypes.ts` with its CSS class
2. Add the styles to `src/app/style-variables/buttons.css` (e.g. `.btn-outline { … }`)

## Deployment

Deploy to Netlify (or Vercel). Set `NEXT_PUBLIC_SITE_URL=https://vinod.lk` and `NEXT_PUBLIC_STAGE=production` in the production environment — `robots.txt` blocks indexing on every other stage.
