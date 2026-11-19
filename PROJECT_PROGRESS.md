# Project Progress

Newest entry first. Use the `update-progress` skill to add entries.

---

## 2026-11-19 — Starter documents archived in Prismic

### Source of truth

Open item 1 of the entry below. Vinod archived the documents by hand in the Prismic dashboard. The MCP `archive_documents` tool only removes a document's change from a release, so it cannot archive published documents.

### Content

- Repository `vinod-portfolio`: 41 of the 42 starter documents are archived. That covers every `service`, `author`, `blog_categories`, `blog_tag`, `blog`, `page`, `menu` and `main_menu` document.
- **Correction to the entry below:** only 15 of the 42 belonged to the four removed types. The rest used types that the new models keep.
- The `home` page, `main_menu` and footer `menu` documents are gone too. Until the new ones are created, `/` has no Prismic content, and the header and footer fall back to [`site.ts`](src/data/site.ts).

### Verified

| Check | Expected | Actual |
| --- | --- | --- |
| `search_documents` (exact, no filter) | 0 starter documents left except Settings | total 1: `settings` `avbJIRIAAC0Ayx-M` |
| `get_documents` on 7 archived ids, one per type | all `notFound` | all 7 `notFound` |

### Open items

1. **Settings** (`avbJIRIAAC0Ayx-M`) is still published with starter content. Its type stays, so either edit it with the vinod.lk values or archive it and create a new one.
2. **Push models** from Slice Machine. This should no longer be blocked.
3. Create the `home`, `main_menu` and footer `menu` documents from [`home-content.mjs`](scripts/seed/home-content.mjs).

## 2026-11-19 — Prismic + Slice Machine: home sections become slices (dev branch)

### Source of truth

Conversation with Vinod: put the common Figma components (📦 Components page, `1:356`) into Prismic repository `vinod-portfolio` as slices; work on the `dev` branch. Chosen approach: **new slice set, retire the old starter slices and documents**.

### What changed in code

| File | Change |
| --- | --- |
| [`package.json`](package.json) | `@prismicio/client`, `@prismicio/next`, `@prismicio/react`, `slice-machine-ui`, `@slicemachine/adapter-next`, `prismic-ts-codegen`, `concurrently`; `npm run dev` starts Next + Slice Machine |
| [`slicemachine.config.json`](slicemachine.config.json), [`src/prismicio.ts`](src/prismicio.ts), [`src/prismicio-routes.json`](src/prismicio-routes.json) | Repository `vinod-portfolio`, one library `./src/slices`, routes `/`, `/:uid`, `/blog/:uid` |
| [`customtypes/`](customtypes) | New models: `page`, `blog`, `settings`, `main_menu`, `menu` (replace the starter's 9 types) |
| [`src/slices/`](src/slices) | 13 slices: Hero, LogoBar, Testimonials, FeaturedProject, ServicesGrid, CallToAction, Compare, Stats, Process, Reasons, BlogPreview, Faq, RichText — converted from `src/components/sections/home/*` (removed) |
| [`src/app/(pages)/[[...uid]]/page.tsx`](src/app/(pages)/[[...uid]]/page.tsx), [`blog/[uid]`](src/app/(pages)/blog/[uid]/page.tsx) | Prismic-driven pages; old `/`, `/about`, `/work`, `/contact` placeholders removed |
| [`src/lib/layoutData.ts`](src/lib/layoutData.ts), [`layout.tsx`](src/app/layout.tsx) | Header/footer from `settings` / `main_menu` / `menu`, fallback `src/data/site.ts`; `PrismicPreview` |
| [`src/app/api/{preview,exit-preview,revalidate}`](src/app/api), [`slice-simulator`](src/app/slice-simulator/page.tsx) | Copied from the starter |
| [`PrismicTitle`](src/components/ui/PrismicTitle.tsx), [`PrismicButtons`](src/components/ui/PrismicButtons.tsx), [`GoogleRatingPill`](src/components/ui/GoogleRatingPill.tsx), [`LogoMarquee`](src/components/ui/LogoMarquee.tsx) | New shared helpers; `StyledButton` accepts a Prismic `field` again; `Highlight` removed (italic in rich text instead) |
| [`scripts/seed/home-content.mjs`](scripts/seed/home-content.mjs) | Home content in slice shape |

### Why

- **Slice ids are new** (`hero`, `call_to_action`, `faq`…), not variations of the starter's `hero_section`/`c_t_a`/`f_a_qs`: the vinod.lk designs share no fields with those models.
- **Google rating lives in Settings** and reaches slices through SliceZone `context`, so Testimonials and Stats show the same figure.
- **Compare row height** is derived from text length (84/96/108px) instead of a field, to keep the model simple.
- **Project tags** are one Text field separated by `|` (commas appear inside tags like "Colombo, Sri Lanka").

### Verified

`npx tsc --noEmit` and `npm run lint` clean. Rendered all 12 home slices from `scripts/seed/home-content.mjs` through a temporary local route at 1440px: visually identical to the previous section-based page (BlogPreview hidden only because the sandbox could not reach Prismic). Not built against the live repository — Prismic is unreachable from the build sandbox.

### Open items

1. **Push models** from Slice Machine. The push removes the starter's 20 slices and 4 custom types (`author`, `blog_categories`, `blog_tag`, `service`); their 42 documents should be archived first or the push may be refused.
2. Create the `home` page, `settings`, `main_menu` and footer `menu` documents (content ready in `scripts/seed/home-content.mjs` and `src/data/site.ts`) and upload the images to the media library.
3. Figma components not yet built as slices: hero_variants1–3, contact_variants1, content_split_variants1, content_deliverables_variants1, Service Area.
4. Project skills (`section-from-design`, `section-design-qa`, `pages-from-design`) still describe the no-CMS workflow.
5. `blog` index page (`/blog`) is still a placeholder.

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
