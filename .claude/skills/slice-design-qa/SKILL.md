---
name: slice-design-qa
description: QA a slice that is already live on a page against its Figma design and breakpoint screenshots — typography (font actually drawn, weight, size, line height, letter spacing, case, colour, text widths), spacing, backgrounds, radii and borders at 1440 / 768 / 375 — then fix every mismatch in the slice's own code and prove it with measurements. Runs as the last step of slice-from-design, straight after the slice is published on the home page, with the same Figma URL and screenshots. Also use whenever someone asks to QA, check, compare or "pixel-check" a slice or section against Figma, says a built section "doesn't match the design", or asks to fix a slice's typography, spacing or colours from a figma.com link.
---

# QA a live slice against its design, then fix it

Runs on a slice that **already renders on a real page**, normally the `home`
page straight after `slice-from-design` published it. The job is to find every
style and typography difference between that render and the design at each
breakpoint, fix the ones that belong to the slice, and leave numbers behind
that show it.

Measure; do not eyeball. Two renders that look the same at a glance routinely
differ by a line height, a token or a fallback font, and a difference image
shows what the eye misses.

## Inputs

Carried over from `slice-from-design` when it hands off, so do not re-ask:

- **Figma URL** of the component node, plus the node ids of its 1440 / 768 /
  375 frames when the design has them.
- **Screenshots** at 1440, 768 and 375. They are what was signed off. Where they
  and Figma disagree, the screenshots win, and Figma copy here is often stale
  placeholder from the template the design was forked from.
- **Slice id** (`slice_type`, snake_case, e.g. `feature_grid`) and **variation
  id** (`default`, `twoColumns`…), and the page. The default page is `home` →
  `http://localhost:1204/`.

## 0. Make sure there is something to measure

- **Dev server.** Use the user's server on 1204 if it is running. Next 16
  refuses a second dev server for the same directory, so never start another.
  If none is running, start `npm run next:dev` in the background, and stop it
  when you are done. Stopping the npm task can leave Next's own server
  listening on 1204, so confirm the port is free afterwards and stop the
  leftover `next … -p 1204` process tree too.
- **The slice is on the page.** If the script below reports "slice not found"
  although the release is published, the server is serving stale data:
  `src/app/layout.tsx` awaits Prismic at module scope. Restart it if you
  started it; if it is the user's, ask them to.

## 1. Build the expected spec from Figma

Load the Figma design-to-code guidance before `get_design_context`, as
`figma-to-prismic` step 1 says. Then, per breakpoint frame:

| Call | What you take from it |
| --- | --- |
| `get_design_context` | each text's style and colour variable; container padding, gap, radius, fill, border, shadow |
| `get_variable_defs` | text style definitions (family, weight, size, line height, letter spacing) and the colour and spacing values in that frame's mode |
| `get_metadata` | node positions and sizes, and the **intrinsic width of every auto-width text** (`whitespace-nowrap` in the context code) |
| `get_screenshot`, `maxDimension` = node width | the 1:1 render for the overlay. Check `original_width` equals `width`; otherwise it is scaled or padded and cannot be overlaid. Download it with the `curl` line it gives into the scratchpad. |

Write the spec down as a table before measuring: per text, its style, family,
weight, size / line height, letter spacing, case and colour hex, plus its
Figma width if auto-width. Per container, padding, gap, radius, background,
border and shadow. One table per breakpoint the design has.

Things that read wrong on their face:

- **Letter spacing `1` in a style definition is 1%**, i.e. `0.01em`. The context
  code shows it resolved: `tracking-[0.24px]` at 24px.
- **Figma rounds auto-width text widths up to whole pixels.** A text that
  measures 38.34px live is 39 in Figma. Expect `figma − 1 < live ≤ figma`.
- **Two variables can share a name.** A library `Text/text-light` (#fafafa) and
  a local `text-text-light` (#ffffff) both exist in this file. Take the hex from
  `get_variable_defs`, not the name.
- **Token modes.** `tokens.css` switches type *and* spacing to Mobile at ≤640px.
  At 641–1024px only spacing changes; type stays at desktop sizes. So a 768
  frame uses desktop type.

## 2. Measure the live slice

Run the bundled script. It starts its own headless Chrome on port 9223 with a
throwaway profile, and always kills it:

```
node .claude/skills/slice-design-qa/scripts/measure-slice.mjs \
  --slice feature_grid --variation default \
  --widths 1440,768,375 \
  --figma 1440=<scratch>/figma-1440.png --figma 768=<scratch>/figma-768.png --figma 375=<scratch>/figma-375.png \
  --out <scratch>/qa-feature_grid
```

Options: `--url` (default the home page on 1204), `--index` (which instance,
if the page has several), `--hover "<selector inside the slice>"` for hover
states with a real mouse, `--before "<js>"` to open an accordion or tab first.
Leave out `--figma` for widths the design has no frame for.

It writes, per width:

- `measure.json` — every visible text, with its computed type, the
  **platform font Chrome actually drew with** (a missing web font shows as
  `LOCAL FALLBACK`), line count and widest line. Also painted boxes (background,
  border, radius, shadow), padded and gapped containers, media, and horizontal
  overflow. Positions are relative to the slice's top-left.
- `live.png` — the slice alone.
- `compare.png` (Figma | live) and `diff.png` (differences in red), with an
  **ink ratio** and **ink-centre shift** per text, when a Figma render was given.

`summary.txt` is the readable digest; open the JSON for anything it truncates.

Also run the in-between widths, **1024** and **1280**, without `--figma`. There
is no design for them, but overflow, wrapping and a desktop layout that starts
at `lg` too early or late show up there.

The script removes the Next dev overlay, makes the header static, hides
scrollbars so 1440 really is 1440, and grows the viewport rather than
scrolling. If the slice is taller than the screen, `vh`-based heights will
differ from a real browser; it says so in the summary.

## 3. Compare: numbers first, then the pictures

Check every row of the spec at every breakpoint:

| Check | Pass when |
| --- | --- |
| Font file | the platform font is the web font, never `LOCAL FALLBACK` |
| Weight, size, line height | exact |
| Letter spacing, case | within 0.01px; `uppercase` vs typed capitals count as equal |
| Colour | exact hex |
| Auto-width text | `figma − 1 < width ≤ figma`. Off by more with every computed value right means the font instance, weight or tracking is wrong. |
| Wrapping | the same line count as the screenshot at that width |
| Spacing | slice padding, gaps and inner padding equal the design's values, i.e. the tokens they map to |
| Surfaces | background, border, radius and shadow equal the design's |
| Overflow | 0 at every width |

Then read `compare.png` and `diff.png`, and use the ink numbers to tell causes apart:

| You see | It means |
| --- | --- |
| ink ≈ 1.0, shift ≈ 0 | matches |
| ink ≈ 1.0, a shift ≥ 1px shared by several texts, or any shift over 1px | a position problem: padding, gap, line height, alignment |
| ink ≠ 1.0 on dark text on a light background | wrong weight, size or font |
| ink 1.3–1.4× only on light text on a dark or saturated background (dark sections, white text on the red button) | Chrome on Windows anti-aliases light-on-dark text heavier than Figma. Not CSS. `antialiased` is already on `<html>` for macOS. **Do not lower the weight to compensate.** |
| a vertical shift of at most 1px on one text size only, with that text's line height and the surrounding padding measuring exact | Blink rounds the font's ascent and descent to whole pixels; Figma keeps fractions. Leave it. |
| ink 0 or null | the text is missing from one image: different content, a state, or something covering it. Check the content. |

The same font, size and weight should give the same widths and ink as Figma.
In the header audit of 2026-09-30, every text came within 1px and ink
×0.97–1.01 once the CSS was right. So a gap beyond those margins is worth
chasing.

## 4. Classify, then fix straight away

Sort every failing check into one of these, and act on it:

- **The slice's own code** — its `index.tsx`, its variant folder, its own
  `*.module.css` or `*.scss`, its `mocks.json`. **Fix it now**, without asking.
  Use tokens and the project's classes:
  - Tailwind canonical classes on the 4px scale: 18px → `py-4.5`.
  - `--spacing-*` and `--color-*` tokens, and the `text-*` typography classes.
  - Never a raw hex a token covers. A library colour missing from the tokens
    goes in a slice-local CSS rule with a comment saying where it comes from,
    like the badge and pre-header colours in `header.css`.
- **Shared code** — `StyledContainer`, `StyledSectionTitle`, `typography.css`
  classes, `buttons.css`, a component another slice imports
  (`grep -rl <file> src`), or the generated `tokens.css` and `fonts.ts` (never
  hand-edited). **Do not edit it.** That is `slice-from-design`'s no-edit rule:
  it would restyle every page using it.
  - First check the slice picked the right class. A 36/40 title wanted
    `text-title-large`, not `text-title-medium`. Swapping the class in the
    slice is an ordinary fix.
  - If the shared class itself is off, **apply an override inside the slice's
    own files**, so only this slice changes. `typography.css` and `buttons.css`
    are unlayered, so a plain utility loses to them: use the `!` form
    (`text-4xl!`) or a rule in the slice's own module CSS.
  - Report the shared mismatch as an open item, and offer the alternative of
    correcting the class for every consumer instead. That choice is the
    user's.
- **Content** — wrong copy, image, link, or a section control set wrong on the
  document, such as `background_color` or a padding select. Fix it in Prismic
  in a release on `atd-prismic-starter`. Publishing is outward-facing: present the
  release and **ask before every publish**.
- **The model** — the design needs a field the slice does not have. Out of
  scope for QA, because a model change needs a Slice Machine push. Stop, say
  what is missing, and hand it back to `slice-from-design`.
- **Not a defect** — the renderer artefacts above, or Figma's rounding. Record
  it in the report and do not "fix" it.

After each round of fixes, re-run the script and compare again. A fix to one
breakpoint often moves another. Stop when every check passes or is explained.
If you are still finding new failures after three rounds, stop and report what
is left, rather than tuning in circles.

Gotchas that cost time here:

- Tailwind v4 emits `rotate` and `translate` as standalone properties.
  `getComputedStyle(el).transform` reads `none` on a working transform, so read
  `.rotate` and `.translate`.
- Hand-written style files are unlayered and beat Tailwind utilities unless the
  utility has `!`.
- `drop-shadow-*` is a `filter`; it makes the element the containing block of
  any `position: fixed` child.

## 5. Report and log

End with one table per breakpoint: check · expected · actual · status
(`pass`, `fixed`, `not a defect`, `out of scope`). Below it, list what you
changed (files and the reason) and what you deliberately left, with why.

- `tsc --noEmit` and `eslint` on the files you touched. Separate pre-existing
  failures (`git show HEAD:<path>`) from yours.
- Stop every process you started: the dev server and anything still on 1204.
  The script cleans up its own Chrome.
- Record the result with **`update-progress`**. Run from `slice-from-design`,
  it goes in that task's entry under **Verified**.
