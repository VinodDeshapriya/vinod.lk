---
name: pages-from-design
description: Assemble a whole page of this site from a Figma page design. Splits the design into sections, matches each one to a section component this repo already has (src/components/sections), composes the route in src/app/(pages) with the design's own content, and loads the real URL in a browser to confirm it. Lists missing sections instead of building them. Use when a task supplies a figma.com URL for a full page (not a single component), names a page to build such as About, Services, Work or Contact, or asks which sections a page design needs.
---

# Page design → a real page on the site

`section-from-design` builds **one** section. This skill builds **one page**
out of sections that already exist. It reads the design top to bottom, names
every section, matches each one to a component, composes the route file, and
checks the result in a browser.

**This skill never builds a section.** A section with no match is written
down, not implemented (see step 4). Building it is a separate
`section-from-design` run, because a page task that quietly turns into three
section tasks can no longer be reviewed as one change.

There is no CMS. A page is `src/app/(pages)/<route>/page.tsx` composing
components from `src/components/sections/`, with content in `src/data/*.ts` or
passed as props. The home page is `src/app/(pages)/page.tsx` and is the model
to follow.

## The invoking prompt

**Required**

- **Figma URL**: the node for the whole page frame, not a component. The
  design file is `NUnh3bgjjIMraUD9FAlJfC` (Portfolio Website Design).
- **Desktop screenshot (1440)** of the full page. Tablet and mobile screenshots
  are optional, because the sections are already responsive and were checked
  when they were built. Attach them only when the *composition* changes between
  breakpoints, for example a section that is dropped, reordered or swapped.
- **Route**: the URL path, e.g. `/about`, `/services/web-design`.

**Optional (each one you give saves the skill a guess)**

| Value | What it does | Default when omitted |
| --- | --- | --- |
| Notes | Free-text instructions, per section or per page | none |
| Replace | `yes` / `no`: may the skill replace an existing page's content | ask first |
| Title / description | The page's `metadata` | taken from the design's H1 and intro |
| Applies to | Other routes that use the same template | only the route named above |

### Prompt structure

```
/pages-from-design

Figma:      <figma.com page-frame url>
Screenshot: <1440 desktop, full page>
Route:      /about

Notes:
  - Section 3 is the same Stats band as the home page; reuse it as is.
  - Leave the FAQ section out for now, the copy is not signed off.
  - Buttons: primary → /contact, secondary → /work.
```

**Notes is the field that earns its keep.** Static frames cannot say which
existing section a band is meant to be, where a button goes, or that a section
is deliberately left out. Anything stated there is taken as given and not
asked about again.

### Templates and dynamic routes

Several pages can share one design: a service detail page for each service, or
a case study for each project. Build that as **one dynamic route**
(`src/app/(pages)/services/[slug]/page.tsx`) that reads its item from
`src/data/*.ts`, with `generateStaticParams`, rather than copying a page file
per item. Read `node_modules/next/dist/docs/` for the current dynamic-route and
`params` conventions before writing one, because this Next version differs
from older ones. **If the prompt does not say whether a design is a one-off
page or a template, ask.** The two produce different code.

The links already in the site show which routes are expected. Check
`src/data/site.ts` (nav and footer) and `href` values in `src/data/*.ts`
(e.g. `services.ts`) so the new route matches what already links to it.

## 1. Read the design as a sequence of sections

Read the screenshot first, top to bottom, and list the sections in order before
touching Figma. That list is the deliverable of this step.

Then load **`figma:figma-design-to-code`**, call `create_session`, and call
`get_design_context` on the page node. Page frames are large. If the call
times out, call it on each top-level section instead. `get_metadata` on the
page node gives you their ids.

Where the screenshot and Figma disagree, **the screenshot is what was signed
off**. Say so and ask. Placeholder copy (`[ADD: …]`, lorem ipsum) goes in as a
`TODO` comment in the data file, not as real content.

## 2. Match every section to a component

List what exists: `ls src/components/sections/*`. The home page sections are
in `home/` (HeroSection, Testimonials, RecentBuild, Services, CtaBand,
TwoWaysToBuild, StatsBand, Process, WhyChooseUs, BlogPreview, FaqSection), and
`PageIntro` is the generic inner-page heading. Each component's doc comment
names its Figma node, so `grep -rn "<node id>" src` finds a section that has
already been built from the same component.

Match on **structure**: what the blocks are, what repeats, and what data they
need. Do not match on colour or copy. Two things decide whether a match is
real:

- **It can carry this page's content.** A section with hard-coded copy (most
  home sections read fixed data files) only matches if the page shows the
  *same* content, or if adding an optional prop would let it take different
  content. That prop is a `section-from-design` change, so it is a miss here.
- **It looks the same.** Same structure on a different background or padding
  is a match only if the section already takes that as a prop. Otherwise it is
  a miss, recorded as "extend `<Section>` with a background prop".

### Read every section's background fill

A page design alternates white and off-white bands to separate sections. Miss
that and the page renders as one flat expanse: every section is present, but
the page is visibly wrong.

**Do not eyeball this.** `#ffffff` and `#eef4fd` (`--color-offwhite`) cannot be
told apart in a scaled-down screenshot. Read the resolved fills:

```js
// use_figma, after setCurrentPageAsync to the page holding the frame
const frame = await figma.getNodeByIdAsync("<page frame id>");
const hex = (c) => "#" + [c.r, c.g, c.b]
  .map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
return frame.children.map((ch) => ({
  name: ch.name,
  hidden: ch.visible === false || undefined,
  fill: (ch.fills && ch.fills.length ? ch.fills : [])
    .filter((f) => f.visible !== false)
    .map((f) => (f.type === "SOLID" ? hex(f.color) : f.type)).join(","),
}));
```

(Load the `figma:figma-use` skill before calling `use_figma`.)

| Section fill | What it means in code |
| --- | --- |
| `#ffffff` | `StyledContainer` with `background_color: false` |
| `#eef4fd` | `background_color: true` (`bg-offwhite`) |
| `#f7f8fa` | `bg-offwhite-2` in `parentClassName` |
| dark / gradient | the section paints itself (`StatsBand`, `CtaBand`) |

- **Two instances of the same component can differ.** A page can carry the same
  CTA twice, one on white and one on off-white. Read the fill of **each
  instance**.
- **The fill often sits on the section instance itself** while its first child
  has none. The snippet reads the instance.

## 3. Report the manifest before you write anything

One row per section, in page order. This is what the user reviews, so put it in
front of them before you write any code:

```
#   Section (design)        Component                     BG        Status
1   Page heading            PageIntro                     white     match
2   Client logos            HeroSection marquee           —         MISSING (logos are inside HeroSection; extract)
3   Stats band              StatsBand                     dark      match
4   Team grid               —                             #eef4fd   MISSING (new section)
5   Closing CTA             CtaBand (title/intro props)   dark      match
```

State the number of matches and misses in one line. For each miss, say what it
would take (a prop on which section, a section extracted from a bigger one, or
a new section) without building it.

## 4. Missing sections are noted, never built

A section with no match is recorded and skipped. The page is still composed
from everything that *does* match, so the user gets a real page with a known
gap rather than nothing at all. Leave a comment at the gap's position in the
route file: `{/* TODO: Team grid (Figma 19300:1400), see PROJECT_PROGRESS */}`.

For each miss, record the section name, its Figma node id, the closest existing
section, and whether it looks like a prop, an extraction or a new section. That
is exactly the input `section-from-design` needs, so hand it over in that
shape.

**Do not** stretch a section to cover one it does not fit. For example, do not
repurpose `PageIntro` to fake a pricing table. A wrong match is worse than a
gap, because it looks finished.

## 5. Find or create the route

- **The route does not exist**: create `src/app/(pages)/<route>/page.tsx` with
  `export const metadata: Metadata = { title, description }` and the sections
  in design order.
- **The route exists with placeholder content** (`PageIntro` with "Content
  coming soon.", as About, Work, Blog and Contact are today): replace the
  placeholder. Say that you did.
- **The route exists with real content**: ask before replacing it, unless the
  prompt says `Replace: yes`.

When the page is new, check that the nav and footer in `src/data/site.ts`
already link to it. If they do not, say so and leave the nav as it is unless
the user asks you to change it.

## 6. Content is the design's own content

Use the copy and imagery from the Figma design, verbatim.

- Props at the call site for components that take them (`CtaBand` takes
  `title` and `intro`, `PageIntro` takes `title` and `description`).
- Lists of items go in `src/data/<topic>.ts`. Reuse an existing file when the
  content is the same thing. Before changing an existing data value, check what
  else reads it (`grep -rn <export> src`). A page-specific variant is a new
  field or export, not an edit to what the home page shows.
- Images go in `public/images/<page>/`, exported from Figma at 2x with
  `download_assets` or `get_screenshot`. Check the exported size, because an
  asset URL can return the raw bitmap instead of the cropped frame. Reuse what
  is already in `public/images/`.

## 7. Load the real page in a browser

Use the user's dev server on **1204** if it is running. Otherwise start
`npm run dev` in the background and stop that process when you are done. Next
refuses a second dev server for the same directory. Then check, in this order:

1. **The page responds** with 200, not 404. Also check every link that the nav
   or other pages point at this route.
2. **Every matched section rendered**, in the design's order. Count the
   top-level children of `<main>` and compare with the manifest. Use the
   `data-section` attributes where sections have them.
3. **Each section's background matches the design's fill.** Compare the
   sequence of bands with the fills from step 2. A screenshot will not settle
   this: `#ffffff` against `#eef4fd` is invisible at any scale that fits a
   whole page. Find each band like this: **search the section's descendants
   for the first opaque background on an element that spans most of the
   section's width.**

   ```js
   const bandBg = (s) => {
     const w = s.getBoundingClientRect().width;
     for (const el of [s, ...s.querySelectorAll("*")]) {
       const c = opaque(el);   // computed backgroundColor, null if transparent
       if (c && el.getBoundingClientRect().width >= w * 0.9) return c;
     }
     return "#ffffff";         // nothing paints, so the page background shows
   };
   ```

   - **Do not walk `firstElementChild`.** A section can start with a
     `<script type="application/ld+json">` (FAQ schema) or an `aria-hidden`
     glow `<div>` (`StatsBand`), and the walk finds the wrong node.
   - **Do not sample with `elementsFromPoint`.** `getBoundingClientRect` is
     relative to the viewport, so clamping to the visible area samples the
     wrong section below the fold.
   - The width test matters: without it the search finds an inner card rather
     than the band. `CtaBand`'s dark panel is inset from the page edges, so
     report it as "inset dark panel" rather than the band colour.
4. **No horizontal overflow**: compare `documentElement.scrollWidth` with
   `clientWidth` at 1440, 1288 and 375. 1288 matters because it is past `xl`
   but inside the 1280px content cap plus gutters, where fixed widths
   overflow.
5. **Screenshot the full page** and compare it with the design screenshot.
   Also compare total page height with the Figma frame height. The home page
   came within 12px.

For a closer look at any one section, run the `section-design-qa` script on it.

Report numbers, not impressions. If a section is absent, say which one and
why.

## Finish

Report, in this order:

1. **The manifest** from step 3, with what was actually placed.
2. **Missing sections**, in the input shape `section-from-design` needs.
3. **The files** created or changed: route, data and images.
4. **What the browser showed**, with numbers.
5. **Anything you could not verify**, stated plainly.

Then run `npx tsc --noEmit` and `npm run lint`, separating pre-existing
failures from ones you caused. Stop every process you started: the dev server
(1204) and any headless Chrome. Record the work with **`update-progress`**,
including the manifest and the misses, so the next run starts from the gap
list rather than working it out again.
