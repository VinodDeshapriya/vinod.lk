---
name: section-from-design
description: Match a Figma component design against this repo's existing page sections (src/components/sections) and either reuse the one that already fits or build a new section beside it, without changing how any existing placement renders. Puts the design's content in src/data or props, places it on the page, and QA's it against the design straight away with section-design-qa. Use when a task supplies a figma.com URL together with breakpoint screenshots (375 / 768 / 1440) of one component, or asks whether this project already has a section for a design before building one.
---

# Design → the section that already fits, or a new one beside it

Runs from a Figma URL plus one screenshot per breakpoint. The point is **the
decision in step 3**. Many designs are already built here. The costly mistake
is editing a section that a live page renders, and restyling that page without
noticing.

This site has **no CMS**. A "section" is a React component in
`src/components/sections/`. Its content is in `src/data/*.ts` or comes in as
props from the page, and a page is a route file in `src/app/(pages)/`. There is
no model to push and nothing to publish. A change is done when the code renders
correctly.

## What the invoking prompt must carry

**Required**

- **Figma URL**: the node for the component itself, not the whole page frame.
  The design file is `NUnh3bgjjIMraUD9FAlJfC` (Portfolio Website Design).
- **Three screenshots**: one each at **1440** (desktop), **768** (tablet) and
  **375** (mobile). File paths and pasted images both work.

**Optional (each one you give saves the skill a guess)**

| Value | What it does | Default when omitted |
| --- | --- | --- |
| Name | Component name (PascalCase) | derived from the Figma node name |
| Start from | The section you already know is closest | the skill picks one and reports it |
| Force | `new section` or `prop` (extend an existing one) | the skill decides, and says why |
| Behaviours | Hover, carousel, counters, accordion, scroll reveal… | the skill stops and asks (step 4) |
| Page | Which route it goes on | the home page, `src/app/(pages)/page.tsx` |
| Position | Where on that page | where the design puts it, or the end |

Prompt shape:

```
/section-from-design

Figma:       <figma.com node url>
Screenshots: <1440 desktop>  <768 tablet>  <375 mobile>

Name:        PricingTable
Start from:  TwoWaysToBuild
Behaviours:  cards lift on hover; monthly / yearly toggle
Page:        /services   (after Services)
```

## 1. Read the inputs

Read all three screenshots before anything else. They are the layout spec at
each breakpoint, and they are the one input that shows what actually changes
between them.

Then read the design. Load the **`figma:figma-design-to-code`** skill before
calling `get_design_context`, and `create_session` first, as the Figma server
requires. Use `get_variable_defs` to find the matching token instead of pasting
a hex.

Where the screenshots and Figma disagree, **the screenshots are what was signed
off**. Say so and ask. Figma frames here can carry placeholder copy such as
`[ADD: URLs]`. That copy goes in as a `TODO` in the data file, not as real
content.

## 2. Find the closest existing section

The sections today:

```
src/components/sections/home/
  HeroSection  Testimonials  RecentBuild  Services  CtaBand  TwoWaysToBuild
  StatsBand  Process  WhyChooseUs  BlogPreview  FaqSection
src/components/sections/PageIntro/
```

List the folders again (`ls src/components/sections/*`) because this list goes
stale. Each component's doc comment names its Figma node (`/** Figma: Home
Page › Stats band (19267:1770) */`). If the design's node id is already in a
comment, the section has been built: `grep -rn "<node id>" src`.

Match on **structure, not pixels**: what the content blocks are, how they are
arranged, what repeats, and what data they need. A centred title, an intro and
two buttons on a dark rounded band is `CtaBand`, whatever the copy says.

The shared building blocks are in `src/components/ui/`: `StyledContainer`,
`SectionHeading`, `StyledButton`, `Highlight`, `Stars`, `CarouselArrows`,
`useScrollCarousel`, `ArrowUpRight`. A new section is built from these. It does
not re-implement them.

Report the shortlist and the winner before you build anything.

## 3. Decide, without changing what already renders

Three outcomes. State which one applies, against which section, and why.

**a) It already fits.** It needs no style change, only different content. Copy
is content: if the section already takes the content as props (`CtaBand` takes
`title`, `intro`, `primary` and `secondary`), render it with the design's
values and change nothing else. Skip to step 7.

**b) The same section with an option.** This covers the same structure with a
different background, a different padding, a different number of columns, or
content that is hard-coded today but needs to vary. Add an **optional prop
whose default is exactly what renders now**. Every existing call site passes
nothing new, so it renders as before.

**c) A different structure or different data** calls for a **new section**: a
new file beside the closest one, using it as the reference for conventions.

**Never** take a fourth path where you change an existing section's default
classes, markup or data so that it fits the new design. If it "almost"
matches, that is (b) or (c).

### "Unchanged" reaches through shared code

A near-match is the dangerous case, because the closer the match the more
tempting it is to nudge it. Before editing any file, **check who else uses
it**: `grep -rln "<ComponentName>\|<file name>" src`.

- **`src/components/ui/*`** is used by most sections. `SectionHeading` sets
  the title size for every centred heading on the site.
- **`src/data/*.ts`** feeds several places. `services.ts` feeds the
  `Services` section *and* the header's Services dropdown (`site.ts`).
  `testimonials.ts` feeds `Testimonials` *and* the rating in `StatsBand`.
  Add new fields or a new export. Never rewrite values another consumer shows.
- **Typography and button classes** (`typography.css`, `buttons.css`) are
  site-wide. Generated tokens (`tokens.css` between the `figma-tokens` markers,
  and `fonts.ts`) are never hand-edited. Change them through `figma-variables/`
  and `npm run figma:sync`, and only when asked.

If a shared file is touched by anything else, either add an optional prop with
the current behaviour as its default, or copy the piece into the new section.
Do not change the default.

**Prove it rather than asserting it.** Run the measuring script from
`section-design-qa` on every existing placement of a section you changed, once
before the edit and once after, and diff the two `measure.json` files. They
must be identical apart from timing noise. If you changed something that
already renders, undo it.

### A token that is wrong is not yours to fix here

When a shared token or typography class turns out not to match Figma, report it
as an open item and leave it alone. Fixing it inside a one-section task
restyles every other user, and nobody asked for that. Offer a scoped override
(a class or `!` utility inside the new section only) and let the user choose.

## 4. Ask about behaviour before writing any component code

Three static frames cannot show what a component does. Ask once, as a batch,
and wait. Do not build a guess and ask afterwards:

- **Motion**: scroll reveal, parallax, counters, autoplay, marquee,
  transitions.
- **Interaction**: hover and focus states, accordion, tabs, carousel arrows,
  dots or drag, modal, video playback.
- **Conditional rendering**: 1 item vs 8, an empty field, a missing image.
- **Links**: where the buttons go, and whether any open in a new tab. A target
  page that does not exist yet stays linked and is listed as an open item.

If the prompt already stated the behaviours, take them as given, say so, and
don't ask again. The home page already has interactions to copy from: the
marquee (`HeroSection`), the carousel (`Testimonials` with `useScrollCarousel`
and `CarouselArrows`), tabs (`RecentBuild`), the sticky step panel (`Process`)
and the accordion (`FaqSection`).

## 5. Build

- **File**: `src/components/sections/<group>/<Name>.tsx`. Home-page sections
  live in `home/`. A section for another page goes in a folder named after that
  page (`services/`, `work/`…). A section used on several pages moves to its own
  folder, `src/components/sections/<Name>/index.tsx`, like `PageIntro`.
- **Doc comment** on the default export with the Figma page, section name and
  node ids: `/** Figma: Services Page › Pricing (19300:1200) */`. The next run
  of step 2 relies on it.
- **Root marker**: put `data-section="<Name>"` on the section's outermost
  element so `section-design-qa` can find it.
- **Server component by default.** Add `"use client"` only to a component that
  needs state or effects, and keep that component as small as possible.
- **Wrap in `StyledContainer`** (`as="section"`). It gives the side gutters
  (16 / 40 / 80px), the 1280px content cap and the vertical padding:
  `slice={{ primary: { top_padding, bottom_padding, background_color } }}`.
  `background_color: true` paints `bg-offwhite` (#eef4fd). Any other
  background goes in `parentClassName`, as `StatsBand` does.
- **Section titles** use `SectionHeading` when the design is the centred
  title-and-intro pattern. Pass `inverted` on dark backgrounds.
- **Buttons**: always `StyledButton` with a variant from
  `src/lib/buttonTypes.ts`. A new look is a new variant there plus its class in
  `buttons.css`, not inline classes on a button.
- **Tokens and classes** come from `tokens.css` and `typography.css`:
  `text-title-*`, `text-body-*`, `text-text-heading`, `text-text-description`,
  `text-primary-light`, `bg-offwhite`, `rounded-md` and so on. Use Tailwind's
  4px scale (18px → `4.5`). Do not use a raw hex that a token covers. A colour
  the tokens lack goes in as an arbitrary value with a comment naming its Figma
  source.
- **Breakpoints**: the desktop layout starts at **`lg` (1024)**. Spacing tokens
  switch to tablet values at ≤1024px and to mobile values at ≤640px. Type
  tokens only switch at ≤640px. Measure against all three screenshots, not just
  the desktop one.
- **Icons**: `atd-icons` (`import X from "atd-icons/dist/X"`) before exporting
  SVGs from Figma.

### Padding and background come from the design

Measure the design's top and bottom section padding at each breakpoint and
pick the option whose tokens match. `Full` is 120 / 80 / 60px at desktop /
tablet / mobile, `Half` is 60 / 40 / 30, and `None` is 0. If no option matches,
take the nearest one and report the difference. Do not add values to, or edit,
`StyledContainer`, which every section shares.

Read each section's fill with `get_variable_defs`. `#ffffff` and `#eef4fd`
cannot be told apart in a scaled-down screenshot.

| Design fill | Do this |
| --- | --- |
| white | `background_color: false` |
| `#eef4fd` (`--color-offwhite`) | `background_color: true` |
| `#f7f8fa` (`--color-offwhite-2`) | `parentClassName="bg-offwhite-2"` |
| dark / gradient | paint it in `parentClassName` and use light text classes, as `StatsBand` does |

If the design places the same section on two backgrounds, make the background
a prop (outcome b) and map each value to its background, text and inner-card
classes inside the section. Cards that are off-white on a white band usually
turn white on an off-white band. Build what the design shows for each
background, and ask if it only shows one.

## 6. Content and images

The content is **the copy and imagery from the Figma design**, verbatim.

- A list of items (cards, steps, FAQs, logos) goes in `src/data/<topic>.ts`
  with an exported interface, like `projects.ts` and `process.ts`. Reuse an
  existing file when the content is the same thing (`services.ts`, `faqs.ts`).
- One-off copy (a title, an intro, button labels) goes either as props at the
  call site, like `CtaBand`, or as defaults inside the section when it will only
  ever appear once.
- Images go in `public/images/<page>/` and render with `next/image` with their
  real `width` and `height`. Export them from Figma with `download_assets` or
  `get_screenshot` at 2x. Check the exported size: an asset URL can return the
  raw bitmap rather than the cropped frame. Reuse a file that is already in
  `public/images/` rather than adding a duplicate.

## 7. Place it on the page

Import it in the page route (`src/app/(pages)/page.tsx` for home) at the
position the design gives it. A route that does not exist yet means a new
`src/app/(pages)/<route>/page.tsx` with `metadata`. Copy the pattern from
`about/page.tsx`, and say that you created the route.

Use the user's dev server on **1204** if it is running. Otherwise start
`npm run dev` in the background and stop it when you are done. Next refuses a
second dev server for the same directory. Load the page once to confirm the
section renders, then go straight on to step 8.

## 8. QA against the design, straight away and without being asked

Once the section renders, run **`section-design-qa`** in the same task. Do not
hand back to the user first. Pass it what you already have:

- the Figma URL, plus the 1440 / 768 / 375 frame node ids if the design has
  them;
- the three screenshots;
- the section name (its `data-section` value) and the page URL.

This applies to outcome **(a)** too: a reused section with the design's content
can still differ because of a wrong background or padding at the call site.

Its fixes follow this skill's rules. A fix to shared code becomes a scoped
override plus an open item. For a section you have just built, it applies the
override straight away, because it only touches the new section's own files.

## Finish

Run `npx tsc --noEmit` and `npm run lint` on what you touched, and separate
pre-existing failures from ones you caused. Stop every process you started:
the dev server (1204) and any headless Chrome. Record the work with
**`update-progress`**. Include which section you matched and why you reused,
extended or created one, the padding and background chosen, any new data file,
and the `section-design-qa` results table under **Verified**.
