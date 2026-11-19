# Project Progress

Newest entry first. Use the `update-progress` skill to add entries.

---

## 2026-11-19 — Project skills rewritten for the no-CMS setup

### Source of truth

Conversation with Vinod: the `.claude/skills` design workflows had been copied from the AT Digital Prismic starter and referred to slices, Slice Machine, Prismic releases and the `atd-prismic-starter` repo. None of that exists here.

### What changed in code

| File | Change |
| --- | --- |
| [`section-from-design`](.claude/skills/section-from-design/SKILL.md) | Was `slice-from-design`. Now: match a Figma component to a section in `src/components/sections/`, reuse it, extend it with an optional prop, or add a new section. Content goes in `src/data/` or props, and the section is placed in the route file |
| [`section-design-qa`](.claude/skills/section-design-qa/SKILL.md) | Was `slice-design-qa`. Same measuring method; fixes go to the section file, `src/data/` or the call site instead of Prismic |
| [`measure-section.mjs`](.claude/skills/section-design-qa/scripts/measure-section.mjs) | Was `measure-slice.mjs`. Finds the target by `--section <Name>` (`[data-section]`) or `--selector <css>` instead of `data-slice-type`; dev hint is now `npm run dev` |
| [`pages-from-design`](.claude/skills/pages-from-design/SKILL.md) | Composes a route in `src/app/(pages)/` from existing sections instead of filling a Prismic document; covers dynamic routes for templates |
| [`AGENTS.md`](AGENTS.md) | Section layout line corrected (`home/*.tsx` files, not only `<Name>/index.tsx`); skills listed |

### Why these choices

- **Unchanged rendering is still the rule.** Without slice variations, "never edit what renders" becomes "an optional prop whose default is today's output". It is proved by running the measuring script on existing placements before and after the change and diffing the results.
- **`data-section` marker**: the sections have no attribute the script can target. New sections get `data-section="<Name>"`, and the QA skill adds it to an existing section when it measures one. `--selector` covers the header and footer.
- **Project values corrected**: off-white is `#eef4fd` here (the starter's was `#f5f7fa`), and the Figma file key is `NUnh3bgjjIMraUD9FAlJfC`.

### Verified

- `node --check` on the script passed.
- Ran the script against `npm run dev` with `--selector footer` at 1440 and 375. Both widths measured, and the summary showed DM Sans text, the `#0b1220` background and 0px overflow.
- The skill list reloaded with the new names.
- `update-progress` is unchanged; it was already project-specific.

### Open items

1. None of the existing sections carry `data-section` yet. Adding it to all 12 would let the scripts target them by name without `--selector`.


### Source of truth

Figma file `NUnh3bgjjIMraUD9FAlJfC` (Portfolio Website Design), frame **Home Page** `19250:39770`. Section node IDs are noted in each component's doc comment.

### What changed in code

| File | Change |
| --- | --- |
| [`figma-variables/`](figma-variables) | Values updated to the design's tokens: IBM Plex Sans / DM Sans, brand `#157FF8`, text `#0A0B0F` / `#4A5263`, radii 16/28/999, type scale 80/60/48/32/24/20/18/16/14 |
| [`typography.css`](src/app/style-variables/typography.css) | Title weights 500, letter-spacing from Figma |
| [`src/app/(pages)/page.tsx`](src/app/(pages)/page.tsx) | Composes the 12 home sections in design order |
| [`src/components/sections/home/`](src/components/sections/home) | HeroSection, Testimonials, RecentBuild, Services, CtaBand (×2), TwoWaysToBuild, StatsBand, Process, WhyChooseUs, BlogPreview, FaqSection |
| [`src/data/`](src/data) | clients, testimonials, projects, services, process, posts, faqs, site (nav + footer) |
| [`StyledHeader`](src/components/ui/StyledHeader/index.tsx) | Centred nav, "Call" CTA button on the right (`headerCta` in site.ts) |
| [`StyledFooter`](src/components/ui/StyledFooter/index.tsx) | Rebuilt to the Figma footer |
| [`src/components/ui/`](src/components/ui) | New: SectionHeading, Highlight, Stars, CarouselArrows, useScrollCarousel, ArrowUpRight |

### Why

- **Icons** use `atd-icons` (the project's icon library) instead of the Figma SVG exports, because figma.com was not reachable from the build environment.
- **Images** were exported via Figma MCP screenshots at **1x**: hero showcase, Absoliq project shot, 7 client logos. Replace with 2x/SVG exports for retina.
- **Interactions added** (not visible in a static frame): logo marquee, testimonial carousel + "Read more", project tabs, sticky "How it works" panel that follows the step in view, FAQ accordion.

### Verified

`npm run lint` and `npx tsc --noEmit` clean. `npm run build` passed with fonts stubbed (Google Fonts unreachable in the sandbox). Rendered at 1440px: page height 13,360px vs 13,372px in Figma; header, footer and every section compared visually against Figma screenshots. Rendered at 390px with no horizontal overflow. Not yet run on the Mac.

### Open items

1. **Client logos:** only 7 of 16 exported — the other 9 are clipped off-canvas in the Figma frame. Export them (SVG preferred) into `public/images/clients/` and add `src` in [`clients.ts`](src/data/clients.ts).
2. **CTA band background** (`19255:60521`, `19268:1997`) is a CSS gradient stand-in; export the image and pass `backgroundSrc` to [`CtaBand`](src/components/sections/home/CtaBand.tsx).
3. **Noise texture** used on dark panels (Figma `d9409.png`, 11% opacity) is not applied.
4. **Content placeholders:** blog post dates, social profile URLs, Google review link, FAQ answers 2–5 (drafted — review), case-study content for the 5 other Recent-build tabs (tabs disabled until added).
5. Pages linked from the home page (services, work, blog posts, pricing, industries, legal) do not exist yet.

## 2026-11-19 — Initial project setup

### Source of truth

Conversation with Vinod: set up vinod.lk following the AT Digital Next.js + Prismic starter (`vinod-portfolio`), but without Prismic.

### What changed in code

| File | Change |
| --- | --- |
| [`package.json`](package.json) | Next 16.2.6, React 19.2.4, Tailwind 4; dev on port 1204; only the `figma:sync` script kept |
| [`scripts/figma-to-css.mjs`](scripts/figma-to-css.mjs) | Copied unchanged from the starter |
| [`figma-variables/`](figma-variables) | Starter placeholders; red primary (`#ce0000`, `#3f0000`, `#ff5462`) swapped for brand blue (`#157ff8`, `#0b3d7a`, `#5aa8ff`) |
| [`src/data/site.ts`](src/data/site.ts) | New — replaces Prismic `settings`, `main_menu`, `menu` documents |
| [`StyledHeader`](src/components/ui/StyledHeader/index.tsx) | From the starter; logo from `/logo.svg`, nav from `site.ts`; PreHeader dropped; `MenuItem` moved in from `slices-nav` |
| [`StyledFooter`](src/components/ui/StyledFooter/index.tsx) | Rewritten as a simple static footer |
| [`StyledButton`](src/components/ui/StyledButton/index.tsx) | Prismic `field` / `PrismicNextLink` support removed; `link` prop only |
| [`src/app/(pages)/`](src/app/(pages)) | Home + placeholder About / Work / Blog / Contact pages |
| [`src/components/sections/`](src/components/sections) | `HeroSection`, `PageIntro` — sections replace slices |
| [`footer.css`](src/app/style-variables/footer.css) | Fallbacks added — no `Footer` Figma collection exists yet |

### Why

- **No CMS**: content lives in code until a CMS is chosen.
- **Left out from the starter**: Prismic (slices, custom types, Slice Machine, preview/revalidate routes, migration scripts), Algolia search, Mailgun/Slack contact API, blog components, button-sync script. Add back individually when a feature needs them.

### Verified

`npm run figma:sync`, `npm run lint` and `npm run build` ran clean in the setup environment.

### Open items

1. Replace `figma-variables/` with the real vinod.lk Figma export and run `npm run setup`.
2. Fill in contact details and social links in `src/data/site.ts`.
3. Contact form: needs a mail provider decision (the starter used Mailgun).
