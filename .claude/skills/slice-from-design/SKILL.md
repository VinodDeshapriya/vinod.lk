---
name: slice-from-design
description: Match a Figma component design against this repo's existing slices and either reuse the one that already fits or build a new variation or slice beside it — never editing what already renders — with the house section controls (top / bottom padding and a background option in the design's colours), then place it on the home page and QA it against the design straight away with slice-design-qa. Use when a task supplies a figma.com URL together with breakpoint screenshots (375 / 768 / 1440) of one component, or asks whether this project already has a slice for a design before building one.
---

# Design → the slice that already fits, or a new one beside it

Runs from a Figma URL plus one screenshot per breakpoint. The whole point is
**the decision in step 3**: most designs are already built here, and the
expensive mistake is editing a slice that published pages render.

Design reading, token reuse, browser verification and the Prismic mechanics are
the **`figma-to-prismic`** skill. Scaffold conventions are **`create-slice`**.
Follow both. This skill owns what they do not: the match, the no-edit rule, the
behaviour prompt, the section controls, the design screenshot, the home-page
test placement, and the hand-off to **`slice-design-qa`**, which checks the
live result against the design and fixes it.

## What the invoking prompt must carry

**Required**

- **Figma URL** — the node for the component itself, not the whole page frame.
- **Three screenshots** — one each at **1440** (desktop), **768** (tablet) and
  **375** (mobile). File paths and pasted images both work.

**Optional — say these and the skill stops guessing**

| Value | What it does | Default when omitted |
| --- | --- | --- |
| Reference Prismic repo | A repo to *read* an existing model from | none — and don't go looking |
| Name | What to call the slice or variation | derived from the Figma node name |
| Start from | The slice you already know is closest | the skill picks one and reports it |
| Force | `new slice` or `variation` | the skill decides, and says why |
| Behaviours | Hover, carousel, counters, scroll reveal… | the skill stops and asks (step 4) |
| Custom types | Which types should offer it | `page` |
| Library | `slices` · `slices-blogs` · `slices-nav` · `slices-footer` | `src/slices` |
| Test on | Where to place it after the push | the `home` page document |
| Theme | If this is one colourway of a set | one variation with a theme control |
| Backgrounds | Which section backgrounds editors can switch between | what the design shows (step 5, *Section controls*) |

Prompt shape:

```
/slice-from-design

Figma:       <figma.com node url>
Screenshots: <1440 desktop>  <768 tablet>  <375 mobile>

Name:        Feature Grid
Start from:  FeaturedContent
Force:       variation
Behaviours:  cards lift on hover; counts animate up on scroll into view
Custom types: page, service
Reference prismic: starter-demo-v4   (read-only)
Test on:     home
```

## 1. Read the inputs

Read all three screenshots before anything else — they are the layout spec at
each breakpoint, and they are the one input that shows what actually changes
between them.

Then read the design per `figma-to-prismic` step 1: `get_design_context` needs
its guidance skill loaded first, and `get_variable_defs` is how you find the
matching CSS token instead of pasting a hex.

Where the screenshots and Figma disagree, **the screenshots are what was signed
off** — say so and ask. Figma files here carry stale placeholder copy from the
template this design was forked from.

## 2. Find the closest existing slice

Twelve slices in `src/slices`, plus the hand-rolled `slices-blogs`,
`slices-nav` and `slices-footer` libraries. Read every `model.json` name,
description and variation list, then read the two or three closest components
in full.

Match on **structure, not pixels**: what the content blocks are, how they are
arranged, what repeats, what fields it would need. A design with an eyebrow, a
title, a description, buttons and an image on the right is `HeroSection /
twoColumns` whatever colour it is painted.

If a **reference Prismic repo** was named, `list_shared_slices` and
`get_shared_slice` on it may show a model that already solves this design
somewhere else. Copy the field shape. Copy nothing else, and write nothing
there — see **Prismic repos**.

Report the shortlist and the winner before you build anything.

## 3. Decide — and never edit what already renders

Three outcomes. State which one, against which slice and variation, and why.

**a) It already fits.** The design needs no style change and no new field.
**Change nothing** — not the model, not the component, not one class. Differing
copy is not a style change; copy is content. Skip straight to step 8 and place
it on the home page with the design's content. There is nothing to push.

**b) Same structure, different styling** → a **new variation** on the matched
slice. Appending a variation leaves every existing variation in `model.json`
byte-identical and every existing variant component untouched. That is what
makes it safe.

**c) Different structure or different fields** → a **new slice**, scaffolded per
`create-slice` step 3 and then shaped using the matched slice as the reference
for conventions.

**Never** reach for a fourth option where you edit an existing variation's model
entry, component or classes to make it fit the new design. If it "almost"
matches, that is (b) or (c).

If the prompt says **Force** but the design already fits as in (a) — for
example an existing variation with its background switched on — say so and ask
before building. Force was given without knowing that the match exists.

### The no-edit rule reaches through shared code

A near-match is the dangerous case, because the closer the match the more
tempting it is to nudge the thing it nearly matches. A new variation is only
safe if it is **additive all the way down**, and the matched slice shares far
more than its `model.json`:

- **Leaf components** — `FeaturedContent/components/LargeNumber.tsx` renders
  both the `default` grid *and* `defaultCarousel`. A border added there restyles
  every page using either.
- **Stylesheets** — `embla-featured-content.scss` sizes the slides for all four
  carousel variations at once.
- **Typography classes** — `text-title-medium` is used by nine files, including
  `PrismicRichText`, so it reaches the blog layouts too.

So before editing any file the new variation touches, **check who else imports
it** — `grep -rl <filename> src`. If anything else does, **copy it and scope the
copy** to the new variation instead of adding a prop, a modifier class or a
media query to the shared one. A default-off prop looks harmless and still
leaves the shared file one careless edit from restyling live pages; the copy is
cheaper than the incident.

Only these may change in place, because every existing entry stays byte-identical:

- appending a variation to `model.json`
- adding a branch to the slice's `index.tsx` router
- appending a mock, a type block, and its union and export entries

**Prove it rather than asserting it:** `git diff --numstat` on `model.json` and
`mocks.json` must show insertions only, with one exception. Appending to a JSON
array adds a comma after the old last element, which git shows as that line
deleted and re-added as `},`. List the deleted lines with
`git diff <file> | grep '^-[^-]'`. Each must reappear unchanged apart from that
trailing comma. Any other deletion means you changed something that already
renders — stop and undo it.

### A token that is wrong is not yours to fix here

When a shared token or typography class turns out not to match Figma, report it
as an open item and leave it alone. Correcting it inside a variation task
restyles every other consumer, and whoever asked for one section did not ask
for that. Offer the scoped override — an override that lives in the new
variation's own files — and let them choose.

## 4. Ask about behaviour before writing any component code

Three static frames cannot show what a component does. Ask once, as a batch,
and wait — do not build a guess and ask afterwards:

- **Motion** — scroll reveal, parallax, counters, autoplay, transitions.
- **Interaction** — hover and focus states, accordion, tabs, carousel arrows /
  dots / drag, modal, video playback.
- **Conditional rendering** — 1 item vs 8, an empty field, a missing image.
- **Runtime data** — anything fetched, like
  [fetchGoogleReviews.ts](src/slices/HeroSection/components/fetchGoogleReviews.ts).
- **Links** — where the buttons go, and whether any open in a new tab.

If the prompt already stated the behaviours, take them as given, say so, and
don't ask again.

## 5. Build

`figma-to-prismic` steps 2–3 for tokens and the model, `create-slice` steps 4–6
for trimming the scaffold, registering on custom types and filling `mocks.json`.
What this skill adds:

- **Measure against all three screenshots**, not just the desktop one. Desktop
  layouts start at **`lg` (1024)** here, not `xl`.
- For a **new variation**, copy the closest variant folder as your starting
  point and diff against it. What you did not deliberately change then stays
  consistent with the rest of the slice by construction.
- **New fields follow the existing pattern**: copy a neighbouring field's JSON
  shape exactly rather than inventing one, use a **Group** for repeating content
  rather than numbered fields, and hand-write the matching entries in
  `prismicio-types.d.ts`.
- A slice nobody can insert is invisible — add its id to the `choices` of the
  slice zone in every custom type that should offer it.

### Section controls: padding and background, like every other slice

Eleven of the twelve slices in `src/slices` give editors the same three
controls in every variation. New slices and new variations get them too, so a
section behaves like its neighbours in the editor. For these three fields this
**replaces `create-slice` step 4's advice** to delete unused scaffold fields:
keep them. There is one exception: a design that is not on white or off-white
replaces the background boolean, as described below.

| Field | Shape (copy it, don't retype it) | What renders it |
| --- | --- | --- |
| `top_padding` | Select `Full` · `Half` · `None`, default `Full`, label "Top Padding" | `StyledContainer` → `--spacing-vertical-padding-full` / `-half` |
| `bottom_padding` | the same, label "Bottom Padding" | the same |
| `background_color` | Boolean, label "Background Color?", `No` / `Yes` | `StyledContainer` → `bg-offwhite` (#f5f7fa) when true |

- **New slice:** `npm run slice:create` already writes all three, with mocks,
  and wraps the content in `<StyledContainer slice={slice}>`. Keep them, and
  keep that wrapper; it is what reads them.
- **New variation:** copy the entries from a sibling variation's `primary`,
  byte for byte, so the controls look and behave the same across the slice.
  That means all three, or only the two paddings for a variation that is not on
  white or off-white (below). Appending them is additive, so the no-edit rule
  is not touched.
- **Skip them only where they cannot apply** — a full-bleed hero image, the
  `slices-nav` / `slices-footer` libraries — and say why.

**Padding defaults come from the design.** Measure the design's top and bottom
section padding at each breakpoint. Pick the option whose tokens match: `Full`
is 120 / 80 / 60px at desktop / tablet / mobile, `Half` 60 / 40 / 30, `None`
0. Make that the `default_value` and the value in the dummy content. If no
option matches, take the nearest and report the difference. Do not add values
or edit `StyledContainer`, which every slice shares.

**The background option must produce the design's colours.** Read the
section's fill variable with `get_variable_defs` and compare its hex with what
each option paints. Offer only the colourways the design defines, because a
colour the designer never paired with this text and these buttons is a broken
combination, not an option.

- **The design is on white, off-white, or both** → keep `background_color` as
  is. `true` paints off-white (#f5f7fa, `--color-offwhite`). If the design shows
  the section on off-white, make `true` the default.
- **The design is on any other colour** — dark (#0d0d0d), off-white-2, brand
  red… → **drop `background_color`.** Kept, it paints off-white *inside* the
  coloured section, under text styled for the dark one. Stats `darkBg` has
  exactly that trap today, so do not copy it. Changing what the boolean paints
  is no answer either: every slice shares it. Instead:
  - **One colourway** → no background control. Paint it on the slice's outer
    element and say why there is no toggle.
  - **Several colourways** → a **Select with its own API id**, e.g.
    `background`. Name the options after the design's colourways
    (`Dark` · `White`) and make the design's main one the default. In the
    slice's own component, map each option to its background, text and button
    classes.
  - **Dark colourways** put `bg-primary-dark hasDarkBg` on the outer element,
    as Stats `darkBg` and CallToAction `cappedWidth` do. `.hasDarkBg` gives the
    buttons their dark-mode styles. Text takes the light token classes,
    `text-text-light` (#ffffff) and the like. Check the design's hex first:
    a library `Text/text-light` is #fafafa.
- **Never give a Select the id `background_color`.** `StyledContainer` reads
  that id as a boolean, so every non-empty option would paint off-white.
- **"Dummy content" means both places**: the home-page document *and*
  `mocks.json`, whose scaffold mocks hard-code `Half` / `Half`. Set both to the
  design's values.
- **Inner surfaces follow the section, as the design shows them.** Cards that
  are off-white on a white section usually turn white on an off-white one: see
  FeaturedContent `hasBg`, Testimonials `invertedBg`, FAQs
  `sectionHasBackground`. Build what the design shows for each background, and
  ask if it only shows one.
- **Every colour comes from a token class**, never a raw hex a token covers.

Add every new field to `mocks.json` and `prismicio-types.d.ts`, copying the
neighbouring entries' shape.

## 6. The slice screenshot is the desktop design

So that an editor picking a slice can tell which one this is, **copy the 1440
screenshot you were given** to:

```
src/slices/<Slice>/screenshot-<variationId>.png
```

`<variationId>` is the variation's `id` in `model.json` — `default` for a new
slice's first variation. PNG, cropped to the component, no browser chrome or
Figma UI.

**Put it there before the Slice Machine push** so the first push carries it.
This is why this skill does not need the "second push" from `figma-to-prismic` —
but if the editor still shows a placeholder afterwards, push again.

## 7. Stop. The user pushes through Slice Machine

**Models cannot be pushed over MCP.** Slice Machine is the only thing that
pushes a slice model or a custom type, and Prismic rejects unknown field paths
until it lands — so no content can be written before this.

Stop and ask them to run it:

```
npm run slicemachine     # http://localhost:1203
```

Tell them exactly what to push: which slice, which variation, which custom types
changed, and that the screenshot is already in place. Then wait for
confirmation. Do not write content against the new fields in the meantime.

## 8. After the push — dummy content, on the home page

Ask how they want it added, then do that:

- **You add it** over the Prismic MCP into a release on `atd-prismic-starter`, or
- **They add it** in the Prismic editor, and you hand them the dummy content
  values to paste.

Either way the dummy content is **the copy and imagery from the Figma design** —
that is what makes it a real test rather than lorem ipsum. Images move Figma →
Prismic directly: `upload_asset` fetches server-side from the Figma asset URL.
Check `search_assets` first and reuse rather than duplicate.

The target is the `page` document with uid **`home`** — `isHome` in
`src/app/(pages)/[[...uid]]/pageUtils.ts` resolves the home page from that uid —
unless the prompt named another page.

Content goes in a release: `create_release` → writes → `present_release` → ask →
`publish_release`. **Publishing is irreversible and outward-facing. Ask every
time**; approval on an earlier release does not carry to this one.

Then restart the dev server, because `src/app/layout.tsx` awaits Prismic at
module scope and a running server keeps stale data for its whole life. Restart
it only if you started it; if it is the user's, ask them to. Load the page once
to confirm the slice renders, then go straight on to step 9.

## 9. QA against the design — straight away, without being asked

Once the slice renders on the home page, run **`slice-design-qa`** in the same
task. Do not hand back to the user first. Pass it what you already have:

- the Figma URL, and the 1440 / 768 / 375 frame node ids if the design has them;
- the three screenshots;
- the slice id and variation id;
- the page (`home` unless the prompt named another).

It measures the live slice at every breakpoint, fixes mismatches in the
slice's own files, and reports what it fixed and what it deliberately left.

This applies to outcome **(a)** too: a reused slice placed with the design's
content can still differ through a section control set wrong on the document.

Its fixes follow the same rules as this skill. A fix to shared code becomes a
scoped override plus an open item. A missing field comes back here as a model
change. Content fixes go in a release, and you ask before publishing.

For a slice you have just built, the QA step **applies** the scoped override.
It touches only the new slice's own files and nothing that rendered before, so
it is safe to do immediately. The report still offers the alternative step 3
describes: correct the shared token or class for every consumer instead.

## Prismic repos

- **Write only to `atd-prismic-starter`.** It is this project's repo, the one
  `slicemachine.config.json` names, so the site reads it and Slice Machine pushes
  to it. It is the only one this skill ever creates in, updates, uploads to or
  publishes. `iee-dev` and every other repo belong to other projects. If the
  config ever names a different repo, stop and ask before writing anything.
- A **reference repo** named in the prompt is **read-only**: `list_shared_slices`,
  `get_shared_slice`, `get_custom_type`, `query_documents`, `search_assets` and
  nothing else. Never `create_document`, `update_document`, `replace_document`,
  `upload_asset`, `create_release` or `publish_release` against it.
- No reference repo named means don't consult one.

## Finish

`tsc --noEmit` and `eslint` on what you touched, separating pre-existing
failures from ones you caused. Stop every process you started — dev server
(1204), Slice Machine (1203), debug Chrome (9222). Record the work with
**`update-progress`**. Include which slice you matched and why you reused,
varied or created, the section controls and their defaults, and the
`slice-design-qa` results table under **Verified**.
