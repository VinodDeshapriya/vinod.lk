---
name: pages-from-design
description: Assemble a whole page in Prismic from a Figma page-template design — split the design into sections, match each to a slice this repo already has, create or update the page document with the design's own dummy content, and load the real URL in a browser to confirm it. Notes missing slices rather than building them. Use when a task supplies a figma.com URL for a full page or page template (not a single component), names a page to build or fill in Prismic, or asks which slices a page design needs.
---

# Page design → a real page in Prismic

`slice-from-design` builds **one** slice. This skill builds **one page** out of
slices that already exist: read the design top to bottom, name every section,
match each to a slice and variation, then create or fill the Prismic document
and look at it in a browser.

**This skill never builds a slice.** A section with no match is written down,
not implemented — see step 4. Building it is a separate `slice-from-design`
run, because a page task that quietly turns into three slice tasks stops being
reviewable.

Design reading, token rules, browser verification and Prismic mechanics are
**`figma-to-prismic`**. Follow it. This skill owns the page-level work: the
section inventory, the match table, the document, the content, and the
end-to-end check on the real URL.

## The invoking prompt

**Required**

- **Figma URL** — the node for the whole page frame, not a component.
- **Desktop screenshot (1440)** of the full page. Tablet and mobile are
  optional here: the slices are already responsive and were verified when they
  were built. Attach them only when the *composition* changes between
  breakpoints (a section dropped, reordered, or swapped).
- **Page** — which document this is, as `<custom type>:<uid>`, e.g.
  `page:about-us`, `service:ev-charger-installation`. See **Which type** below.

**Optional — say these and the skill stops guessing**

| Value | What it does | Default when omitted |
| --- | --- | --- |
| Template | Which template this design is, when a type has several | the skill asks (step 1) |
| Applies to | Which documents this template should be used for | just the one named in **Page** |
| Notes | Free-text instructions, per section or per page | none |
| Parent | `parent_page` for a nested URL | none — the page sits at `/<uid>` |
| Create | `yes` / `no` — may the skill create a missing document | ask before creating |
| Publish | `ask` / `hold` | `ask` — never publishes unprompted |
| Reference page | An existing page whose content shape to copy | none |

### Prompt structure

```
/pages-from-design

Figma:      <figma.com page-frame url>
Screenshot: <1440 desktop, full page>
Page:       page:about-us

# Template — only when the type has more than one page design.
Template:   Service detail — layout B
Applies to: service:ev-charger-installation, service:switchboard-upgrades

# Notes — free text. Anything the design cannot tell me.
Notes:
  - Section 3 is the same Stats band as the home page; reuse its numbers.
  - The testimonial section should pull Google reviews, not authored quotes.
  - Leave the FAQ section out for now, the copy is not signed off.
  - Buttons: primary → /contact-us, secondary → /services.
```

**Notes is the field that earns its keep.** Three static frames cannot say
which variation a section is, where a button goes, or that a section is
deliberately deferred. Anything stated there is taken as given and not asked
about again.

### Which type, and templates

`page` and `service` are both repeatable and both carry slice zones, so a
design that looks like a page could be either:

| Type | URL | Use it for |
| --- | --- | --- |
| `page` | `/<uid>`, or `/<parent>/<uid>` | Home, About, Contact, Services index, News |
| `service` | `/services/<uid>` | An individual service |
| `blog` | `/blog/<uid>` | A post — body is `text_block` etc., not page slices |
| `author` | `/authors/<uid>` | An author profile |

`home` is the `page` document with uid **`home`** and renders at `/` —
`isHome` in `src/app/(pages)/[[...uid]]/pageUtils.ts` resolves it.

**One custom type, many templates.** A type has a single slice zone, so every
template is just a different *composition* of slices on a different document.
Nothing distinguishes them in the model. So when the design set has more than
one template for a type — a services index and a service detail, or two
service detail layouts — the prompt must say which one this is and which
documents it applies to. **If the prompt does not say, stop and ask**; guessing
means writing a whole page of content onto the wrong document.

Applying one template to several documents is a repeat of steps 5–8 per
document, each in the same release. Say which documents up front.

## 1. Read the design as a sequence of sections

Read the screenshot first, top to bottom, and list the sections in order before
touching Figma. That list is the deliverable of this step.

Then `get_design_context` on the page node per `figma-to-prismic` step 1. Page
frames are large; if it times out, call it on each top-level section instead —
`get_metadata` on the page node gives you their ids.

Where the screenshot and Figma disagree, **the screenshot is what was signed
off**. Say so and ask. Figma files here carry stale placeholder copy from the
template this design was forked from, and a page design is where that bites
hardest — whole sections can be left over from another site.

## 2. Match every section to a slice

Read `src/slices/*/model.json` for names, descriptions and variation lists.
Twelve slices today:

```
c_t_a  contact  content_listing  f_a_qs  featured_content
featured_content_listing  hero_section  image_content  rich_text
stats  testimonials  trust_bar
```

Match on **structure** — what the blocks are, what repeats, what fields it
would need — not on colour or copy. The variation matters as much as the
slice: `hero_section` has five, `featured_content` eleven.

Two things decide whether a match is real:

- **The slice must be offered on that type.** A slice missing from the type's
  `choices` cannot be inserted, however well it matches. `page` offers 12,
  `service` 9, `blog` 6 — check `customtypes/<type>/index.json`.
- **The fields must carry the design's content.** A section needing an author
  and a date is not a match for a slice with a title and an image.

### Read every section's background fill

A page design alternates white and off-white bands to separate sections. That
banding is **content**, not styling: `StyledContainer` paints `bg-offwhite`
when the slice's `background_color` boolean is on, and nothing when it is off.
Miss it and the page renders as one flat expanse — technically every slice
present, visibly wrong.

**Do not eyeball this.** `#ffffff` and `#f5f7fa` are indistinguishable in a
scaled-down screenshot, which is exactly how a whole band goes unnoticed. Read
the resolved fills:

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

Then map fill → field:

| Section fill | `background_color` |
| --- | --- |
| `#ffffff` | `false` |
| `#f5f7fa` (`--color-offwhite`) | `true` |
| `#201d1d` | neither — the slice paints itself |

Three things that catch people out:

- **Two instances of the same component can differ.** A page can carry the
  same CTA twice with one on white and one on off-white. Read the fill of
  **each instance**; never clone the first and assume.
- **Not every slice exposes the field.** All five `hero_section` variations and
  `stats / socialProof` have no `background_color` — they paint themselves. If
  the design's fill disagrees with what such a slice paints, that is an open
  item, not something to force.
- **The fill often sits on the section instance itself**, while its first child
  is `none`. Read both, as the snippet does.

Carry the answer into the manifest as its own column, and state it when you
report — a background that is merely absent is the single easiest thing to
place correctly and never notice.

## 3. Report the manifest before you write anything

One row per section, in page order. This is the artefact the user reviews, and
it is worth getting in front of them before any Prismic write:

```
#   Section (design)        Slice / variation                  BG       Status
1   Hero with form          hero_section / withForm            #201d1d  match
2   Trust logos             trust_bar / credibilityBar         off      match
3   Three feature cards     featured_content / icons           on       match
4   Stats band              stats / socialProof                #201d1d  match
5   Pricing table           —                                  on       MISSING
6   Closing CTA             c_t_a / cappedWidth                on       match
```

`BG` is the `background_color` value the design's fill implies — `on`, `off`,
or the hex when the slice paints itself and has no field.

State the count of matches and misses in one line. If anything is missing, say
what it would take — a new variation on which slice, or a new slice — without
building it.

## 4. Missing slices are noted, never built

A section with no match is recorded and skipped. The page is still assembled
from everything that *does* match, so the user gets a real page with a known
hole rather than nothing at all.

For each miss, record: the section name, its Figma node id, the closest
existing slice, and whether it looks like a variation or a new slice. That is
exactly the input `slice-from-design` wants, so hand it over in that shape.

**Do not** stretch a slice to cover a section it does not fit — no repurposing
a `rich_text` to fake a pricing table. A wrong match is worse than a gap,
because it looks finished.

## 5. Find or create the document

Query before creating: `search_documents` on the type, then check the uid.
Creating a second document with an existing uid fails, and creating a
near-duplicate (`about`, `about-us`) is worse than failing.

- **Exists** → `update_document`, appending slices to its zone. **Never
  replace the slice zone**; that drops everything you did not re-send. Append
  with `inserts`, remove with `deletes`.
- **Missing** → **ask before creating**, unless the prompt said `Create: yes`.
  Then `create_document` with the uid, title, and the slices.

If the design is a page that already has content, say what you will do with it:
appending to a filled page is usually wrong. Offer replacing the zone's slices
or starting a new document, and let the user pick.

## 6. Content is the design's own content

The dummy content is **the copy and imagery from the Figma design**, verbatim —
that is what makes the page a real test rather than lorem ipsum with the right
shape. Placeholder copy in the design stays placeholder copy in Prismic.

Images move Figma → Prismic directly with `upload_asset`, which fetches
server-side from the Figma asset URL. `search_assets` first and reuse rather
than duplicate.

**Two traps that cost real time:**

- **The MCP asset URL returns the raw bitmap, not the composed frame.** It can
  come back small, or portrait where the design is landscape. Check the
  returned `width`/`height`; if they are not what the design draws, take
  `get_screenshot` on the image node instead and upload that.
- **Content relationships need their targets to exist first.** A slice that
  points at blog posts, authors or services cannot be filled until those
  documents exist. Create them earlier in the same release, and say plainly
  that they are disposable test content.

Field shapes that are easy to get wrong:

| Field | Shape |
| --- | --- |
| Group | `{__TYPE__:"GroupContentType", value:[{__TYPE__:"GroupItemContent", value:[["<field>", <widget>]]}]}` — **tuples**, not an object |
| Image | `origin` needs **all** of `{id,url,width,height}`, and a top-level `url` mirroring it, or the write fails |
| Doc link | `{__TYPE__:"LinkContent", value:{__TYPE__:"DocumentLink", kind:"document", id:"<id>"}}` |
| Buttons | `{__TYPE__:"RepeatableContent", type:"Link", value:[…]}`, each with `text` and `variant` |

`get_field_shapes` and a neighbouring document's real content are better
references than memory.

## 7. Release, then ask

`create_release` → writes → `present_release` → **ask** → `publish_release`.

**Publishing is irreversible and outward-facing. Ask every time.** Approval on
an earlier release never carries to this one. Put every document for this page
— the page plus any relationship targets — in the **same** release, so they go
live together and cannot half-publish.

Two releases branched from the same base version of one document will lose each
other's changes. If a release for this document is already open, add to it
rather than opening a second.

**Models cannot be pushed over MCP.** If anything here needed a model change it
was out of scope — see step 4.

## 8. Load the real page in a browser

Not the SSR markup, not the slice simulator. **The page's own URL.**

`src/app/layout.tsx` awaits Prismic at module scope, so a running dev server
serves the data it started with. **Restart it after publishing** or you will
debug a stale page. Next refuses a second dev server for the same directory,
so kill 1204 and start again rather than starting another.

**A restart is not enough on its own.** Next's Data Cache lives in
`.next/cache` and survives it, so the first load after restarting can still
render the *previous* publish — including the previous slice list, which looks
exactly like your writes having failed. The client's `revalidate` is 5s in
dev, so request the page two or three times a few seconds apart. Before
concluding anything is wrong, **query the Prismic CDN directly** and compare:
if the CDN has the new slices and the page does not, it is the cache, not the
content. `rm -rf .next/cache` settles it.

**The header and footer are worse than the page body.** `layout.tsx` fetches
`settings`, `main_menu` and the `menu` documents at **module scope**, so those
are frozen for the life of the process while page slices refetch per request.
A page can therefore show its new content beside a stale nav, which reads like
a failed write. If you changed a menu or settings document, expect to restart
**twice** — one clean `rm -rf .next/cache` plus restart did not pick up a
published nav change in practice, and a second restart did.

Then drive headless Chrome over CDP per `figma-to-prismic` step 5 and check,
in this order:

1. **The page responds** — not a 404. A wrong uid or a missing route resolver
   entry shows up here and nowhere else.
2. **Every matched slice rendered**, in the design's order. Count
   `[data-slice-type]` and compare against the manifest. A slice that renders
   nothing because a field is empty is the common failure, and it is silent.
3. **Each section's rendered background matches the design's fill.** Compare
   the sequence of bands against the fills from step 2. A screenshot will not
   settle this: `#ffffff` against `#f5f7fa` is invisible at any scale that
   fits a whole page.

   Find the band like this — **search the section's descendants for the first
   opaque background on an element that spans most of the section's width**:

   ```js
   const bandBg = (s) => {
     const w = s.getBoundingClientRect().width;
     if (opaque(s)) return opaque(s);
     for (const el of [s, ...s.querySelectorAll("*")]) {
       const c = opaque(el);
       if (c && el.getBoundingClientRect().width >= w * 0.9) return c;
     }
     return "#ffffff";           // nothing paints — the page background shows
   };
   ```

   Two ways to get this wrong, both of which produce confident false results:

   - **Do not walk `firstElementChild`.** `FAQs` renders a
     `<script type="application/ld+json">` as its first child, so a
     first-child walk finds an unstyled node, falls through to the default and
     reports white for a band that is actually off-white.
   - **Do not sample with `elementsFromPoint`.** A page is many viewports tall,
     `getBoundingClientRect` is viewport-relative, and clamping the y
     coordinate to the visible area silently samples the wrong section — it
     reports every band below the fold as white.

   The width test matters too: without it the search finds an inner card or
   form panel rather than the band.
4. **No horizontal overflow**: `documentElement.scrollWidth` vs
   `clientWidth`, at 1440, 1288 and 375. 1288 matters — it is past `xl` but
   inside the 1280 content cap, where fixed widths overflow.
5. **Screenshot the page** and compare against the design screenshot.

Report numbers, not impressions. If a slice is absent, say which and why.

## Prismic repos

**Write only to `atd-prismic-starter`**, the repo `slicemachine.config.json` names
(the site reads it, Slice Machine pushes to it). A reference repo named in the prompt is
read-only: `query_documents`, `search_documents`, `get_custom_type`,
`get_shared_slice`, `search_assets` and nothing else. Never create, update,
upload or publish against it. No reference repo named means don't consult one.

## Finish

Report, in this order:

1. **The manifest** from step 3, with what was actually placed.
2. **Missing slices**, in `slice-from-design` input shape.
3. **The release** and whether it was published.
4. **What the browser showed**, with numbers.
5. **Anything you could not verify**, plainly.

Then `tsc --noEmit` and `eslint` if any code was touched (usually none),
separating pre-existing failures from ones you caused. Stop every process you
started — dev server (1204), Slice Machine (1203), headless Chrome (9222).
Record the work with **`update-progress`**, including the manifest and the
misses, so the next run starts from the gap list rather than re-deriving it.
