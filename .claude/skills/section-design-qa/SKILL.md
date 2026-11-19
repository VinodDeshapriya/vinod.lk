---
name: section-design-qa
description: QA a page section that already renders on the site against its Figma design and breakpoint screenshots. Checks typography (the font actually drawn, weight, size, line height, letter spacing, case, colour, text widths), spacing, backgrounds, radii and borders at 1440 / 768 / 375, then fixes every mismatch in the section's own code and proves it with measurements. Runs as the last step of section-from-design, with the same Figma URL and screenshots. Also use whenever someone asks to QA, check, compare or "pixel-check" a section, header or footer against Figma, says a built section "doesn't match the design", or asks to fix a section's typography, spacing or colours from a figma.com link.
---

# QA a live section against its design, then fix it

Runs on a section that **already renders on a real page**, normally straight
after `section-from-design` placed it. The job is to find every style and
typography difference between that render and the design at each breakpoint,
fix the ones that belong to the section, and leave numbers behind that show it.

Measure; do not eyeball. Two renders that look the same at a glance often
differ by a line height, a token or a fallback font. A difference image shows
what the eye misses.

## Inputs

These carry over from `section-from-design` when it hands off, so do not ask
for them again:

- **Figma URL** of the component node, plus the node ids of its 1440 / 768 /
  375 frames when the design has them. The file is `NUnh3bgjjIMraUD9FAlJfC`.
  A section's doc comment usually names its node id.
- **Screenshots** at 1440, 768 and 375. They are what was signed off. Where
  they and Figma disagree, the screenshots win.
- **Section**: its `data-section` value (e.g. `PricingTable`), or a CSS
  selector. Also the **page URL**, which defaults to `http://localhost:1204/`.

## 0. Make sure there is something to measure

- **Dev server.** Use the user's server on 1204 if it is running. Next 16
  refuses a second dev server for the same directory, so never start another.
  If none is running, start `npm run dev` in the background and stop it when
  you are done. Stopping the npm task can leave Next's own server listening on
  1204, so confirm the port is free afterwards and stop the leftover
  `next … -p 1204` process too.
- **The section can be found.** The script finds a section by
  `[data-section="<Name>"]`. If the root element has no such attribute, add
  `data-section="<ComponentName>"` to it. It has no effect on rendering. For
  the header and footer, or a one-off check, pass `--selector` instead, e.g.
  `--selector "footer"`. A section rendered twice on a page (`CtaBand`) is
  chosen with `--index`.

## 1. Build the expected spec from Figma

Load the **`figma:figma-design-to-code`** skill before calling
`get_design_context`, and call `create_session` first. Then, for each
breakpoint frame:

| Call | What you take from it |
| --- | --- |
| `get_design_context` | each text's style and colour variable; the container's padding, gap, radius, fill, border and shadow |
| `get_variable_defs` | text style definitions (family, weight, size, line height, letter spacing) and the colour and spacing values in that frame's mode |
| `get_metadata` | node positions and sizes, and the **intrinsic width of every auto-width text** (`whitespace-nowrap` in the context code) |
| `get_screenshot`, `maxDimension` = node width | the 1:1 render for the overlay. Check that `original_width` equals `width`. If it does not, the render is scaled or padded and cannot be overlaid. Download it into the scratchpad with the `curl` line the result gives. |

Write the spec down as a table before measuring. For each text, record its
style, family, weight, size / line height, letter spacing, case and colour hex,
plus its Figma width if it is auto-width. For each container, record padding,
gap, radius, background, border and shadow. Make one table per breakpoint the
design has.

Some values are misleading at first sight:

- **Letter spacing `1` in a style definition means 1%**, i.e. `0.01em`. The
  context code shows the resolved value: `tracking-[0.24px]` at 24px.
- **Figma rounds auto-width text widths up to whole pixels.** A text that
  measures 38.34px live is 39px in Figma. Expect `figma − 1 < live ≤ figma`.
- **Take the hex from `get_variable_defs`, not the variable name.** Library and
  local variables can share a name with different values.
- **Token modes.** `tokens.css` switches spacing to tablet values at ≤1024px
  and switches spacing *and* type to mobile values at ≤640px. At 768px, then,
  spacing is the tablet set but type is still the desktop set.
- **Fonts**: titles are IBM Plex Sans (`font-title`, weight 500), body text is
  DM Sans (`font-body`). Both load through `next/font` in `src/app/fonts.ts`.

## 2. Measure the live section

Run the bundled script. It starts its own headless Chrome on port 9223 with a
throwaway profile and always kills it afterwards:

```
node .claude/skills/section-design-qa/scripts/measure-section.mjs \
  --section PricingTable \
  --url http://localhost:1204/services \
  --widths 1440,768,375 \
  --figma 1440=<scratch>/figma-1440.png --figma 768=<scratch>/figma-768.png --figma 375=<scratch>/figma-375.png \
  --out <scratch>/qa-PricingTable
```

Options:

- `--selector "<css>"` in place of `--section`.
- `--index N` picks one instance when the page has several.
- `--hover "<selector inside the section>"` measures a hover state with a real
  mouse.
- `--before "<js>"` runs first, e.g. to open an accordion or switch a tab.

Leave out `--figma` for widths the design has no frame for.

For each width it writes:

- `measure.json`: every visible text with its computed type, the **platform
  font Chrome actually drew with** (a web font that failed to load shows as
  `LOCAL FALLBACK`), line count and widest line. It also lists painted boxes
  (background, border, radius, shadow), padded and gapped containers, media
  and horizontal overflow. Positions are relative to the section's top-left
  corner.
- `live.png`: the section alone.
- `compare.png` (Figma | live) and `diff.png` (differences in red), with an
  **ink ratio** and **ink-centre shift** per text, when a Figma render was
  given.

`summary.txt` is the readable digest. Open the JSON for anything it truncates.

Also run the in-between widths **1024** and **1280** without `--figma`. There
is no design for them, but overflow, wrapping, and a desktop layout that starts
at `lg` too early or too late all show up there.

The script removes the Next dev overlay, makes the sticky header static, hides
scrollbars so 1440 really is 1440, and grows the viewport rather than
scrolling. If the section is taller than the screen, `vh`-based heights will
differ from a real browser, and the summary says so. Scroll-triggered effects
(reveals, the sticky `Process` panel) need `--before` to put them in the state
the design shows.

## 3. Compare: numbers first, then the pictures

Check every row of the spec at every breakpoint:

| Check | Pass when |
| --- | --- |
| Font file | the platform font is the web font, never `LOCAL FALLBACK` |
| Weight, size, line height | exact |
| Letter spacing, case | within 0.01px; `uppercase` and typed capitals count as equal |
| Colour | exact hex |
| Auto-width text | `figma − 1 < width ≤ figma`. If it is off by more while every computed value is right, the font instance, weight or tracking is wrong. |
| Wrapping | the same line count as the screenshot at that width |
| Spacing | section padding, gaps and inner padding equal the design's values, i.e. the tokens they map to |
| Surfaces | background, border, radius and shadow equal the design's |
| Overflow | 0 at every width |

Then read `compare.png` and `diff.png`, and use the ink numbers to tell causes
apart:

| You see | It means |
| --- | --- |
| ink ≈ 1.0, shift ≈ 0 | matches |
| ink ≈ 1.0, a shift of 1px or more shared by several texts, or any shift over 1px | a position problem: padding, gap, line height or alignment |
| ink ≠ 1.0 on dark text on a light background | wrong weight, size or font |
| ink 1.3–1.4× only on light text on a dark or saturated background (`StatsBand`, `CtaBand`, white text on the blue button) | the browser anti-aliases light-on-dark text differently from Figma. It is not a CSS problem. **Do not lower the weight to compensate.** |
| a vertical shift of at most 1px on one text size only, while that text's line height and the surrounding padding measure exactly | Blink rounds the font's ascent and descent to whole pixels and Figma keeps fractions. Leave it. |
| ink 0 or null | the text is missing from one image because of different content, a state, or something covering it. Check the content. |
| large ink differences inside an image or gradient | the CSS stand-in for an image not yet exported (for example the `CtaBand` background). Compare the text only. |

The same font, size and weight should give the same widths and ink as Figma.
A gap beyond the margins above is worth chasing.

## 4. Classify, then fix straight away

Sort every failing check into one of these groups and act on it:

- **The section's own code**: its `.tsx` file and any file only it imports.
  **Fix it now**, without asking. Use tokens and the project's classes:
  - Tailwind classes on the 4px scale: 18px → `py-4.5`.
  - `--spacing-*` and `--color-*` tokens, and the `text-*` typography classes.
  - Never a raw hex that a token covers. A colour missing from the tokens goes
    in as an arbitrary value with a comment naming its Figma source.
- **Shared code**: `StyledContainer`, `SectionHeading`, other
  `src/components/ui/*` files, `typography.css`, `buttons.css`, any component
  another section imports (`grep -rln <name> src`), and the generated
  `tokens.css` and `fonts.ts`, which are never hand-edited. **Do not edit any
  of these.** Changing one restyles every page that uses it.
  - First check that the section picked the right class. A 36/40 title wanted
    `text-title-large`, not `text-title-medium`. Swapping the class inside the
    section is an ordinary fix.
  - If the shared class itself is off, **apply an override inside the
    section**, so only this section changes. `typography.css` and
    `buttons.css` are unlayered, so a plain utility loses to them. Use the `!`
    form (`text-4xl!`).
  - Report the shared mismatch as an open item, and offer the alternative of
    fixing the class for every user instead. A token fix goes through
    `figma-variables/` and `npm run figma:sync`. That choice is the user's.
- **Content**: wrong copy, image or link, or a wrong background or padding at
  the call site. Fix it in `src/data/*.ts` or at the call site. Before changing
  a data value, check what else reads it (`grep -rn <export> src`). Change it
  in place only if every consumer should show the new value. Otherwise add a
  field.
- **A missing input**: the design needs content or an option the section does
  not take. Add an optional prop whose default is the current behaviour, per
  `section-from-design` step 3 (b).
- **Not a defect**: the renderer artefacts above, or Figma's rounding. Record
  it in the report and do not "fix" it.

After each round of fixes, re-run the script and compare again, because a fix
at one breakpoint often moves another. Stop when every check passes or is
explained. If you are still finding new failures after three rounds, stop and
report what is left rather than tuning in circles.

Things that have cost time here:

- Tailwind v4 emits `rotate` and `translate` as separate properties, so
  `getComputedStyle(el).transform` reads `none` on a working transform. Read
  `.rotate` and `.translate` instead.
- Hand-written style files are unlayered and beat Tailwind utilities unless
  the utility has `!`.
- `drop-shadow-*` is a `filter`. It makes the element the containing block of
  any `position: fixed` child.

## 5. Report and log

End with one table per breakpoint with the columns check · expected · actual ·
status (`pass`, `fixed`, `not a defect`, `out of scope`). Below it, list what
you changed (files and why) and what you deliberately left alone, with the
reason.

- Run `npx tsc --noEmit` and `npm run lint` on the files you touched. Separate
  pre-existing failures (`git show HEAD:<path>`) from yours.
- Stop every process you started: the dev server and anything still on 1204.
  The script cleans up its own Chrome.
- Record the result with **`update-progress`**. When this runs as part of
  `section-from-design`, it goes in that task's entry under **Verified**.
