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
| `blog` | Blog posts at `/blog/:uid`; the Blog Preview slice lists the latest ones |
| `settings` (single) | Header button, phones, email, location, WhatsApp, social + legal links, footer text, Google rating, default SEO |
| `main_menu` (single) | Header navigation (with optional dropdown links) |
| `menu` (repeatable) | Footer columns, sorted by `order` |

Slices (`src/slices/`), one per Figma component in the 📦 Components page:
Hero, LogoBar, Testimonials, FeaturedProject, ServicesGrid, CallToAction, Compare, Stats, Process, Reasons, BlogPreview, Faq, RichText.

**Changing a model:** run `npm run dev`, edit in Slice Machine (http://localhost:1203), then **Push** from Slice Machine. It also regenerates `prismicio-types.d.ts` and `src/slices/index.ts`.

If Settings / Main Menu / Footer Menu are empty, the header and footer fall back to `src/data/site.ts`.

`scripts/seed/home-content.mjs` holds the home page content in slice form (used to create the first `home` document).

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
