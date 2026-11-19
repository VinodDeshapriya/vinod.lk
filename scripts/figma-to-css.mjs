#!/usr/bin/env node
/**
 * Reads every JSON file in ./figma-variables/ and writes CSS custom properties
 * + Tailwind v4 @theme tokens into src/app/style-variables/tokens.css, plus the
 * matching `next/font/google` loaders into src/app/fonts.ts.
 *
 * Variable roles are detected from Figma metadata (type, scopes) — file names
 * are irrelevant, so any project's export just works. Collection names matter
 * only for namespacing (see BASE_COLLECTIONS below).
 *
 * Role → output mapping:
 *   COLOR                              → @theme   --color-{name}
 *   FLOAT  scopes:CORNER_RADIUS        → @theme   --radius-{name}
 *   STRING name contains "family"      → @theme   --font-{name}
 *   FLOAT  scopes:FONT_SIZE            → :root + @media  --font-size-{name}
 *                                        @theme inline   --text-{name}
 *   FLOAT  scopes:LINE_HEIGHT          → :root + @media  --line-height-{name}
 *   FLOAT  ALL_SCOPES, single mode     → @theme   --{collectionPrefix}-{name}
 *   FLOAT  ALL_SCOPES, multiple modes  → :root + @media  --{collectionPrefix}-{name}
 *   BOOLEAN / STRING (non-family)      → skipped
 *
 * Component collections — any collection NOT in BASE_COLLECTIONS — are
 * namespaced by their collection name so they drive a component's CSS rather
 * than polluting the shared pool. Drop in Header.json and --color-header-*
 * appears with no code change.
 *   COLOR "bg-color"    in "Footer" → --color-footer-bg
 *   COLOR "text-hover"  in "Footer" → --color-footer-text-hover
 * A trailing "-color" is redundant once namespaced, so it is stripped.
 *
 * "Button"/"Buttons" keeps a bespoke key mapping for its nested Figma names:
 *   COLOR "Colors/<variant>-btn/<state>" → --color-button-<variant>-<state>
 *     (e.g. "Colors/primary-btn/text-color-hover" → --color-button-primary-text-hover)
 *   COLOR "Colors/<state>"               → --color-button-<state>
 *   FLOAT whose name contains "radius"   → --radius-button
 * The Figma typo "secondry"/"secndary" is normalised to "secondary".
 *
 * Font families additionally drive src/app/fonts.ts, which layout.tsx imports.
 * `next/font/google` needs the family as a static import, so it has to be
 * generated rather than read at runtime:
 *   STRING "font/family/title" = "Barlow Condensed"
 *     → import { Barlow_Condensed } from "next/font/google"
 *     → export const titleFont = Barlow_Condensed({ variable: "--font-title", … })
 * Families absent from Google Fonts (Futura PT, say) warn and emit an inert
 * stub, so the build stays green and the --font-* token from tokens.css applies
 * unopposed — load such a face via Typekit or next/font/local.
 *
 * Run: npm run figma:sync
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, '..');
const FIGMA_DIR  = join(ROOT, 'figma-variables');
const CSS_FILE   = join(ROOT, 'src/app/style-variables/tokens.css');
const FONTS_FILE = join(ROOT, 'src/app/fonts.ts');

/** Next's own manifest of every family next/font/google can load. */
const FONT_DATA_FILE = join(
  ROOT,
  'node_modules/next/dist/compiled/@next/font/dist/google/font-data.json',
);

const MARKER_START = '/* [figma-tokens:start] */';
const MARKER_END   = '/* [figma-tokens:end] */';

/** Subsets to request, in preference order — the first one the family has wins. */
const PREFERRED_SUBSETS = ['latin'];

/** Weights requested when a static font's collection declares none. */
const DEFAULT_WEIGHTS = ['400', '500', '600', '700'];

/**
 * Collections whose variables belong to the shared, global token pool.
 * Every other collection is treated as component-scoped and namespaced by its
 * collection name: Buttons → --color-button-*, Footer → --color-footer-*.
 */
const BASE_COLLECTIONS = new Set(['colors', 'radius', 'spacing', 'typography']);

// ── Utilities ──────────────────────────────────────────────────────────────────

const toKebab = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s/]+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

/** "Brand/primary-light" → "primary-light" */
const lastName = (name) => toKebab(name.split('/').pop());

/** "heading-alt" → "headingAlt" */
const toCamel = (str) => str.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/**
 * Figma weight label → CSS numeric weight. Matched against the variable's value
 * and its name, both stripped to bare letters ("Semi bold" → "semibold").
 * Order matters: "semibold" and "extralight" must be tested before the plain
 * "bold" and "light" they contain.
 */
const WEIGHT_NAMES = [
  [/thin|hairline/,          '100'],
  [/(extra|ultra)light/,     '200'],
  [/light/,                  '300'],
  [/book|regular|normal/,    '400'],
  [/medium/,                 '500'],
  [/(semi|demi)bold/,        '600'],
  [/(extra|ultra)bold/,      '800'],
  [/black|heavy/,            '900'],
  [/bold/,                   '700'],
];

const weightFromLabel = (...labels) => {
  for (const label of labels) {
    const flat = String(label ?? '').toLowerCase().replace(/[^a-z]/g, '');
    if (!flat) continue;
    for (const [re, weight] of WEIGHT_NAMES) {
      if (re.test(flat)) return weight;
    }
  }
  return null;
};

/**
 * Button colour key from a nested Figma name.
 * "Colors/primary-btn/text-color-hover" → "primary-text-hover"
 * "Colors/secondry-btn/default"         → "secondary-default"
 * "Colors/link-btn/text-color-default"  → "link-text-default"
 * "Colors/active"                       → "active"
 */
const buttonColorKey = (name) => {
  const parts = name.split('/');
  parts.shift(); // drop leading "Colors"
  return toKebab(parts.join('-'))
    .replace(/sec(?:on|n)d(?:a)?ry/g, 'secondary')
    .replace(/-btn-/g, '-')
    .replace(/-btn$/, '')
    .replace(/^btn-/, '')
    .replace(/text-color-/g, 'text-');
};

/**
 * Colour key for a component collection with flat Figma names. The collection
 * name already supplies the namespace, so a trailing "-color" is noise.
 * "bg-color"      → "bg"
 * "icons-color"   → "icons"
 * "text-default"  → "text-default"
 * "Colors/hover"  → "hover"
 */
const componentColorKey = (name) => lastName(name).replace(/-colors?$/, '');

const rgbaToHex = ({ r, g, b, a }) => {
  const h = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  if (Math.round(a * 255) === 255) return `#${h(r)}${h(g)}${h(b)}`;
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${+a.toFixed(3)})`;
};

/**
 * Maps a Figma mode name to a CSS breakpoint key or 'base'.
 *
 * Returns one of: 'base' | 'min:NNN' | 'max:NNN' | null (unknown → skip)
 */
function classifyMode(modeName) {
  const lower = modeName.toLowerCase();
  const pxMatch = modeName.match(/(\d{3,4})px/);
  const px = pxMatch ? parseInt(pxMatch[1]) : null;

  if (px === 1920 || /desktop.?l\b/i.test(modeName)) return 'min:1920';
  if (px === 1440 || /desktop.?m\b/i.test(modeName)) return 'base';
  if (lower === 'desktop' || lower.startsWith('desktop')) return 'base';
  if (lower.includes('tablet') || (px && px >= 600 && px < 1200)) return 'max:1024';
  if (lower.includes('mobile') || (px && px <= 599)) return 'max:640';

  return null;
}

/** "Responsive Tabs" → "responsive-tabs", "Colors" → "colors" */
const collectionPrefix = (name) => toKebab(name);

// ── Per-collection processor ────────────────────────────────────────────────────

/**
 * Processes one Figma variable collection JSON file and returns categorised
 * CSS lines ready for assembly into the output block.
 *
 * @returns {{ theme, themeInline, root, responsive, label, families, weights }}
 */
function processCollection(data) {
  const modeEntries = Object.entries(data.modes);

  // Classify every mode
  const modeMap = {};     // modeId → 'base' | 'min:N' | 'max:N' | null
  let baseModeId = null;

  for (const [id, name] of modeEntries) {
    const cls = classifyMode(name);
    modeMap[id] = cls;
    if (cls === 'base') baseModeId = id;
  }

  // Fall back to the first mode as base when none matched
  if (!baseModeId) baseModeId = modeEntries[0][0];

  const prefix    = collectionPrefix(data.name);
  const isSingle  = modeEntries.length === 1;

  // A dedicated "Button" collection is namespaced so its values feed the button
  // CSS (--color-button-*, --radius-button) instead of the shared token pool.
  const isButtonCollection = prefix === 'button' || prefix === 'buttons';

  // Any other non-base collection is a component collection and is namespaced
  // by its own name, e.g. "Footer" → --color-footer-*.
  const isComponentCollection = !BASE_COLLECTIONS.has(prefix);

  // Buckets
  const theme       = [];  // @theme (static — emits CSS var + utility)
  const themeInline = [];  // @theme inline (responsive refs)
  const root        = [];  // :root
  const responsive  = {};  // 'max:640' → [cssLine, ...]
  const families    = [];  // { key: 'title', family: 'Barlow Condensed' } → fonts.ts
  const weights     = [];  // ['400', '700', ...] offered by this collection

  // Variables that should be skipped regardless of type
  const SKIP_NAMES  = new Set(['Width']);

  for (const v of data.variables) {
    if (SKIP_NAMES.has(v.name))     continue;
    if (v.type === 'BOOLEAN')       continue;

    const scopes  = v.scopes ?? [];
    const baseVal = v.resolvedValuesByMode[baseModeId]?.resolvedValue;

    // ── COLOR ──────────────────────────────────────────────────────────────
    if (v.type === 'COLOR') {
      if (baseVal == null) continue;
      const key = isButtonCollection
        ? `button-${buttonColorKey(v.name)}`
        : isComponentCollection
          ? `${prefix}-${componentColorKey(v.name)}`
          : lastName(v.name);
      theme.push(`  --color-${key}: ${rgbaToHex(baseVal)};`);
      continue;
    }

    // ── STRING ─────────────────────────────────────────────────────────────
    if (v.type === 'STRING') {
      const lower = v.name.toLowerCase();
      if (lower.includes('family') && baseVal) {
        const key = lastName(v.name);
        theme.push(`  --font-${key}: "${baseVal}";`);
        families.push({ key, family: String(baseVal).trim() });
      } else if (lower.includes('weight')) {
        // Not CSS-emitted, but tells fonts.ts which cuts a static font needs.
        const w = weightFromLabel(baseVal, lastName(v.name));
        if (w && !weights.includes(w)) weights.push(w);
      }
      // Labels, etc. → skip
      continue;
    }

    // ── FLOAT ──────────────────────────────────────────────────────────────
    if (v.type !== 'FLOAT' || baseVal == null) continue;

    // Button radius → --radius-button. The button export may drop the
    // CORNER_RADIUS scope, so match on the name instead.
    if (isButtonCollection && /radius/i.test(v.name)) {
      const px = baseVal >= 9999 ? '9999px' : `${baseVal}px`;
      theme.push(`  --radius-button: ${px};`);
      continue;
    }

    // Corner radius → static @theme
    if (scopes.includes('CORNER_RADIUS')) {
      const px = baseVal >= 9999 ? '9999px' : `${baseVal}px`;
      let rKey = lastName(v.name);
      if (isComponentCollection) {
        // "button-radius" → --radius-button, "lg" → --radius-button-lg
        const ns   = isButtonCollection ? 'button' : prefix;
        const rest = rKey.split('-').filter((s) => s !== ns && s !== 'radius').join('-');
        rKey = rest ? `${ns}-${rest}` : ns;
      }
      theme.push(`  --radius-${rKey}: ${px};`);
      continue;
    }

    // Font size → responsive :root + @theme inline
    if (scopes.includes('FONT_SIZE')) {
      const key = lastName(v.name);
      root.push(`  --font-size-${key}: ${baseVal}px;`);
      themeInline.push(`  --text-${key}: var(--font-size-${key});`);
      addResponsiveOverrides(v, baseModeId, modeEntries, modeMap,
        (bp, val) => `    --font-size-${key}: ${val}px;`, responsive);
      continue;
    }

    // Line height → responsive :root
    if (scopes.includes('LINE_HEIGHT')) {
      const key = lastName(v.name);
      root.push(`  --line-height-${key}: ${baseVal}px;`);
      addResponsiveOverrides(v, baseModeId, modeEntries, modeMap,
        (bp, val) => `    --line-height-${key}: ${val}px;`, responsive);
      continue;
    }

    // Generic FLOAT (ALL_SCOPES or other)
    const key     = lastName(v.name);
    const cssName = `--${prefix}-${key}`;

    if (isSingle) {
      // Single mode → static @theme
      const px = baseVal >= 9999 ? '9999px' : `${baseVal}px`;
      theme.push(`  ${cssName}: ${px};`);
    } else {
      // Multi-mode → :root + responsive overrides
      root.push(`  ${cssName}: ${baseVal}px;`);
      addResponsiveOverrides(v, baseModeId, modeEntries, modeMap,
        (bp, val) => `    ${cssName}: ${val}px;`, responsive);
    }
  }

  weights.sort();

  return { theme, themeInline, root, responsive, families, weights, label: data.name.trim() };
}

function addResponsiveOverrides(v, baseModeId, modeEntries, modeMap, lineFn, responsive) {
  const baseVal = v.resolvedValuesByMode[baseModeId]?.resolvedValue;
  for (const [modeId] of modeEntries) {
    if (modeId === baseModeId) continue;
    const bp  = modeMap[modeId];
    if (!bp || bp === 'base') continue;
    const val = v.resolvedValuesByMode[modeId]?.resolvedValue;
    if (val != null && val !== baseVal) {
      responsive[bp] ??= [];
      responsive[bp].push(lineFn(bp, val));
    }
  }
}

// ── CSS assembly ────────────────────────────────────────────────────────────────

function buildCssBlock(results) {
  const themeLines       = [];
  const themeInlineLines = [];
  const rootLines        = [];
  const responsiveMap    = {};

  for (const r of results) {
    if (r.theme.length) {
      themeLines.push(`  /* ${r.label} */`, ...r.theme, '');
    }
    if (r.themeInline.length) {
      themeInlineLines.push(`  /* ${r.label} */`, ...r.themeInline, '');
    }
    if (r.root.length) {
      rootLines.push(`  /* ${r.label} */`, ...r.root, '');
    }
    for (const [bp, lines] of Object.entries(r.responsive)) {
      if (!lines.length) continue;
      responsiveMap[bp] ??= [];
      responsiveMap[bp].push(`    /* ${r.label} */`, ...lines);
    }
  }

  const parts = [];

  if (themeLines.length) {
    parts.push(`@theme {\n${themeLines.join('\n')}\n}`);
  }

  if (rootLines.length) {
    parts.push(`:root {\n${rootLines.join('\n')}\n}`);
  }

  // max-width descending first, then min-width ascending
  const sorted = Object.entries(responsiveMap).sort(([a], [b]) => {
    const [at, av] = a.split(':');
    const [bt, bv] = b.split(':');
    if (at !== bt) return at === 'max' ? -1 : 1;
    const diff = parseInt(av) - parseInt(bv);
    return at === 'max' ? -diff : diff;
  });

  for (const [bp, lines] of sorted) {
    const [type, px] = bp.split(':');
    const query = type === 'min' ? `min-width: ${px}px` : `max-width: ${px}px`;
    parts.push(`@media (${query}) {\n  :root {\n${lines.join('\n')}\n  }\n}`);
  }

  if (themeInlineLines.length) {
    parts.push(`@theme inline {\n${themeInlineLines.join('\n')}\n}`);
  }

  return [
    MARKER_START,
    '/* Auto-generated by `npm run figma:sync` — do not edit manually */',
    '',
    parts.join('\n\n'),
    '',
    MARKER_END,
  ].join('\n');
}

// ── fonts.ts generation ─────────────────────────────────────────────────────────

/** Reads Next's Google Fonts manifest, or null when it can't be found. */
function loadFontData() {
  try {
    return JSON.parse(readFileSync(FONT_DATA_FILE, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Works out the `next/font/google` call for one family token.
 *
 * @returns {{ key, family, importName, options } | { key, family, unsupported: true }}
 */
function resolveGoogleFont({ key, family }, weights, fontData) {
  const meta = fontData[family];
  if (!meta) return { key, family, unsupported: true };

  const options = [`variable: "--font-${key}"`];

  // `subsets` is mandatory while preload is on, so always send one.
  const subsets = PREFERRED_SUBSETS.filter((s) => meta.subsets.includes(s));
  if (subsets.length) {
    options.push(`subsets: [${subsets.map((s) => `"${s}"`).join(', ')}]`);
  }

  // A variable font covers every weight from its wght axis, and Next rejects
  // `variable` alongside any other value — so send no weight at all. A static
  // font has no such default and errors out without an explicit list.
  if (!meta.weights.includes('variable')) {
    const wanted = weights.filter((w) => meta.weights.includes(w));
    const chosen = wanted.length
      ? wanted
      : DEFAULT_WEIGHTS.filter((w) => meta.weights.includes(w));
    const list = chosen.length ? chosen : [meta.weights[0]];
    options.push(`weight: [${list.map((w) => `"${w}"`).join(', ')}]`);
  }

  return { key, family, importName: family.replace(/ /g, '_'), options };
}

function buildFontsFile(fonts) {
  const importNames = [
    ...new Set(fonts.filter((f) => !f.unsupported).map((f) => f.importName)),
  ].sort();

  const lines = [
    '// [figma-tokens:start]',
    '// Auto-generated by `npm run figma:sync` — do not edit manually.',
    '// Font families come from the `font/family/*` variables in ./figma-variables.',
    '',
  ];

  if (importNames.length) {
    lines.push(`import { ${importNames.join(', ')} } from "next/font/google";`, '');
  }

  for (const font of fonts) {
    const name = `${toCamel(font.key)}Font`;

    if (font.unsupported) {
      lines.push(
        `// "${font.family}" is not available on Google Fonts, so it can't be`,
        `// self-hosted by next/font. --font-${font.key} in tokens.css still names it;`,
        '// load the face yourself (Typekit, next/font/local) if it needs embedding.',
        `export const ${name} = { variable: "" };`,
        '',
      );
      continue;
    }

    lines.push(
      `export const ${name} = ${font.importName}({`,
      ...font.options.map((o) => `  ${o},`),
      '});',
      '',
    );
  }

  const varList = fonts.map((f) => `${toCamel(f.key)}Font.variable`);

  lines.push(
    '/** Every font token\'s CSS-variable class, for the <html> className. */',
    varList.length
      ? `export const fontVariables = [\n${varList.map((v) => `  ${v},`).join('\n')}\n]\n  .filter(Boolean)\n  .join(" ");`
      : 'export const fontVariables = "";',
    '',
    '// [figma-tokens:end]',
  );

  return lines.join('\n');
}

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  const files = readdirSync(FIGMA_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  if (!files.length) {
    console.error(`No JSON files found in ${FIGMA_DIR}`);
    process.exit(1);
  }

  const results = [];

  for (const file of files) {
    const data = JSON.parse(readFileSync(join(FIGMA_DIR, file), 'utf8'));
    console.log(`Processing: ${data.name} (${file})`);
    results.push(processCollection(data));
  }

  const block = buildCssBlock(results);

  let css = readFileSync(CSS_FILE, 'utf8');
  const si = css.indexOf(MARKER_START);
  const ei = css.indexOf(MARKER_END);

  if (si !== -1 && ei !== -1) {
    css = css.slice(0, si) + block + css.slice(ei + MARKER_END.length);
  } else {
    const importLineEnd = css.indexOf('\n', css.indexOf('@import')) + 1;
    css = css.slice(0, importLineEnd) + '\n' + block + '\n\n' + css.slice(importLineEnd);
  }

  writeFileSync(CSS_FILE, css);
  console.log(`\n✅  Updated ${CSS_FILE.replace(ROOT, '.')}`);

  writeFontsFile(results);
}

function writeFontsFile(results) {
  const pending = results.flatMap((r) =>
    r.families.map((f) => ({ family: f, weights: r.weights })),
  );

  if (!pending.length) {
    console.log('ℹ️   No `font/family/*` variables found — left fonts.ts untouched');
    return;
  }

  const fontData = loadFontData();
  if (!fontData) {
    console.warn(
      `⚠️   Could not read ${FONT_DATA_FILE.replace(ROOT, '.')} — left fonts.ts untouched.\n` +
        '     Run `npm install` and try again.',
    );
    return;
  }

  const fonts = pending.map(({ family, weights }) =>
    resolveGoogleFont(family, weights, fontData),
  );

  for (const font of fonts) {
    if (font.unsupported) {
      console.warn(
        `⚠️   "${font.family}" (--font-${font.key}) is not on Google Fonts — ` +
          'emitting a stub; load it via Typekit or next/font/local',
      );
    } else {
      const weight = font.options.find((o) => o.startsWith('weight:'));
      console.log(
        `   --font-${font.key}: ${font.family}` +
          (weight ? ` (${weight})` : ' (variable)'),
      );
    }
  }

  writeFileSync(FONTS_FILE, buildFontsFile(fonts) + '\n');
  console.log(`✅  Updated ${FONTS_FILE.replace(ROOT, '.')}`);
}

main();
