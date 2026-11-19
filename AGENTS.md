<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# vinod.lk project notes

- Next.js App Router + TypeScript + Tailwind CSS v4. Source lives in `src/`, alias `@/*` → `src/*`.
- **No CMS.** Content is in code: site-wide data (nav, footer, contact) in `src/data/site.ts`, page content in `src/app/(pages)/**/page.tsx`.
- Page sections live in `src/components/sections/`: one file per section grouped by page (`home/HeroSection.tsx`…), or `<SectionName>/index.tsx` for sections shared across pages (`PageIntro`). Each has a doc comment naming its Figma node. Shared building blocks are in `src/components/ui/` (`StyledContainer`, `SectionHeading`, `StyledButton`…).
- Figma → code workflows are project skills: `section-from-design` (one section), `section-design-qa` (measure a live section against Figma), `pages-from-design` (a whole page).
- Design tokens come from Figma: drop exported variable JSON into `figma-variables/`, run `npm run figma:sync`. This regenerates `src/app/style-variables/tokens.css` and `src/app/fonts.ts` — never hand-edit the blocks between the `figma-tokens` markers.
- Use token-based Tailwind classes (`text-title-*`, `text-body-*`, `text-primary-light`, `bg-offwhite`, `rounded-md`…) rather than hard-coded values.
- Buttons: always `StyledButton` with a variant from `src/lib/buttonTypes.ts`.
- Dev server runs on port 1204 (`npm run dev`).
- After finishing and verifying a task, log it with the `update-progress` skill in `PROJECT_PROGRESS.md`.
