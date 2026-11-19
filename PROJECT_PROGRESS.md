# Project Progress

Newest entry first. Use the `update-progress` skill to add entries.

---

## 2026-11-19 — Fix `npm run dev` failing on the Mac

### Source of truth

Conversation with Vinod: `npm run dev` failed with `sh: next: command not found`.

### What changed in code

No source files changed. The dependencies had never been installed (there was no `node_modules/`), so `npm install` was run against the existing [`package-lock.json`](package-lock.json): 362 packages added.

### Verified

`npm run dev` started Next.js 16.2.6 (Turbopack) on port 1204. Every page was requested once:

| Route | Expected | Actual |
| --- | --- | --- |
| `/` | 200 | 200 |
| `/about` | 200 | 200 |
| `/work` | 200 | 200 |
| `/blog` | 200 | 200 |
| `/contact` | 200 | 200 |

Only HTTP status codes were checked. The pages were not opened in a browser, and `npm run build` was not run on the Mac.

### Open items

1. `npm install` reported 3 vulnerabilities (2 high, 1 critical). These pre-date this work. They were deliberately left alone because `npm audit fix --force` can install breaking versions. Review them with `npm audit`.
2. npm did not run the install script of `sharp@0.34.5` because it is not approved yet. Next.js uses `sharp` for image optimisation. Approve it with `npm install-scripts approve sharp` if `next/image` gives errors.
3. [`_to_delete/`](_to_delete) still holds the old static site, including a `package.json` and `server.js` added earlier on 2026-11-19 so that it could be served with `npm start`. Nothing uses it. Delete it when you are ready.

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

`npm run figma:sync`, `npm run lint` and `npx tsc --noEmit` ran clean in the setup environment. `npm run build` passed with `fonts.ts` temporarily stubbed, because that sandbox could not reach Google Fonts; the real `fonts.ts` is in place. Home page checked in a headless browser at 1440px and 390px. Not yet built on the Mac itself.

### Open items

1. Replace `figma-variables/` with the real vinod.lk Figma export and run `npm run setup`.
2. Fill in contact details and social links in `src/data/site.ts`.
3. Contact form: needs a mail provider decision (the starter used Mailgun).
