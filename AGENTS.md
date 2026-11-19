<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# vinod.lk project notes

- Next.js App Router + TypeScript + Tailwind CSS v4. Source lives in `src/`, alias `@/*` → `src/*`.
- **Prismic CMS** (repository `vinod-portfolio`, Slice Machine). Pages are `page` documents rendered by `src/app/(pages)/[[...uid]]/page.tsx` (uid `home` = `/`); blog posts are `blog` documents at `/blog/:uid`. Header/footer read the `settings`, `main_menu` and `menu` documents via `src/lib/layoutData.ts`, falling back to `src/data/site.ts`.
- Page sections are **Prismic slices** in `src/slices/<Name>/` (`model.json` + `index.tsx`), one per Figma component in 📦 Components. Each component has a doc comment naming its Figma node. Models are edited in Slice Machine (`npm run dev` starts it on port 1203) and pushed from there; never hand-edit `src/slices/index.ts` or `prismicio-types.d.ts`. Titles are rich-text `heading1/2 + em`: italic words render as the brand-blue highlight (`PrismicTitle`). Button groups are Link fields with variants Primary/Secondary (`PrismicButtons`). Shared building blocks are in `src/components/ui/`.
- `src/components/sections/PageIntro` is the only non-slice section (placeholder `/blog` index).
- Figma → code workflows are project skills: `section-from-design` (one section), `section-design-qa` (measure a live section against Figma), `pages-from-design` (a whole page). NOTE: they were written for the no-CMS setup (sections + `src/data/`) and need updating for slices.
- Design tokens come from Figma: drop exported variable JSON into `figma-variables/`, run `npm run figma:sync`. This regenerates `src/app/style-variables/tokens.css` and `src/app/fonts.ts` — never hand-edit the blocks between the `figma-tokens` markers.
- Use token-based Tailwind classes (`text-title-*`, `text-body-*`, `text-primary-light`, `bg-offwhite`, `rounded-md`…) rather than hard-coded values.
- Buttons: always `StyledButton` with a variant from `src/lib/buttonTypes.ts`.
- Dev server runs on port 1204 (`npm run dev`).
- After finishing and verifying a task, log it with the `update-progress` skill in `PROJECT_PROGRESS.md`.
