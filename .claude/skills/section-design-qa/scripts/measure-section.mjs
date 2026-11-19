#!/usr/bin/env node
// Measure one rendered slice for design QA, at several widths, in a headless
// Chrome this script starts and always stops itself.
//
//   node measure-slice.mjs --slice feature_grid [--variation default] [--index 0]
//     [--url http://localhost:1204/] [--widths 1440,768,375] [--height 900]
//     [--figma 1440=ref-1440.png --figma 375=ref-375.png]
//     [--before "<js run in the page before measuring>"] [--hover "<css selector>"]
//     --out <dir>
//
// Per width it writes <out>/<width>/measure.json and live.png (the slice
// only), plus compare.png and diff.png when a Figma render for that width is
// given. A Figma render must be get_screenshot of the slice's own node at 1:1
// (maxDimension = the node's width), so its top-left is the slice's top-left.
// <out>/summary.txt is the readable digest.

import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// ── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const opt = { url: "http://localhost:1204/", widths: "1440,768,375", height: "900", index: "0", port: "9223", figma: [] };
for (let i = 0; i < argv.length; i++) {
  const k = argv[i].replace(/^--/, "");
  const v = argv[i + 1];
  if (k === "figma") opt.figma.push(v);
  else opt[k] = v;
  i++;
}
if (!opt.slice || !opt.out) {
  console.error("usage: node measure-slice.mjs --slice <slice_type> --out <dir> [--variation <id>] [--url ...] [--widths 1440,768,375] [--figma 1440=file.png]");
  process.exit(2);
}
// Fail loudly when the site is down: Chrome would otherwise load its error page
// and every width would report "slice not found".
try {
  const res = await fetch(opt.url, { signal: AbortSignal.timeout(120000) });
  if (!res.ok) { console.error(`${opt.url} answered ${res.status}; QA needs the page to render`); process.exit(2); }
} catch {
  console.error(`${opt.url} is not reachable. Start the dev server (npm run next:dev, port 1204), and stop it afterwards if you started it.`);
  process.exit(2);
}
const widths = opt.widths.split(",").map(Number);
const figmaRefs = Object.fromEntries(opt.figma.map((s) => { const [w, f] = s.split("="); return [Number(w), path.resolve(f)]; }));
fs.mkdirSync(opt.out, { recursive: true });

// ── chrome ──────────────────────────────────────────────────────────────────
const chromePath = (() => {
  const c = [process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].filter(Boolean);
  return c.find((p) => fs.existsSync(p));
})();
if (!chromePath) { console.error("Chrome not found; set CHROME_PATH"); process.exit(2); }
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "slice-qa-chrome-"));
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${opt.port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "about:blank"], { stdio: "ignore" });
let cleaned = false;
const cleanup = () => {
  if (cleaned) return; cleaned = true;
  try { if (process.platform === "win32") execSync(`taskkill /PID ${chrome.pid} /T /F`, { stdio: "ignore" }); else chrome.kill("SIGKILL"); } catch {}
  setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
};
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(130); });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0;
const pending = new Map(), waiters = [], pageErrors = [];
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const i = ++id; pending.set(i, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
  ws.send(JSON.stringify({ id: i, method, params }));
});
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error("page: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result.value;
};

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    try { target = await (await fetch(`http://127.0.0.1:${opt.port}/json/new?about:blank`, { method: "PUT" })).json(); } catch { await sleep(200); }
  }
  if (!target) throw new Error("Chrome did not open its debugging port");
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    else if (m.method === "Runtime.exceptionThrown") pageErrors.push((m.params.exceptionDetails.exception?.description || "").split("\n")[0]);
    else for (const w of waiters) w(m);
  });
  await send("Page.enable"); await send("Runtime.enable"); await send("DOM.enable"); await send("CSS.enable");
  await send("Emulation.setScrollbarsHidden", { hidden: true });

  const SLICE = `[...document.querySelectorAll('[data-slice-type="${opt.slice}"]${opt.variation ? `[data-slice-variation="${opt.variation}"]` : ""}')][${Number(opt.index)}]`;
  const summary = [];

  for (const width of widths) {
    const dir = path.join(opt.out, String(width)); fs.mkdirSync(dir, { recursive: true });
    let height = Number(opt.height);
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    const loaded = new Promise((r) => waiters.push((m) => m.method === "Page.loadEventFired" && r()));
    await send("Page.navigate", { url: opt.url }); await loaded;
    // A dev server that is still compiling can reload the page right after
    // "load"; wait until the document is complete and settled.
    // Stylesheets too: measured unstyled, the header's menus push the slice
    // thousands of pixels down.
    for (let i = 0; i < 40; i++) { if (await ev(`document.readyState === "complete" && !!document.head && !!document.body && [...document.querySelectorAll('link[rel="stylesheet"]')].every((l) => l.sheet)`).catch(() => false)) break; await sleep(500); }
    await ev(`document.fonts.ready.then(() => true)`); await sleep(1500);
    // Dev overlay out; the sticky header back in the flow so it never covers the slice once scrolled.
    // Next re-adds its dev indicator after removal, so also hide it with CSS for the whole run.
    await ev(`(() => { document.querySelectorAll('nextjs-portal').forEach((n) => n.remove()); const s = document.createElement('style'); s.textContent = 'header{position:relative!important;top:auto!important}nextjs-portal{display:none!important}'; (document.head || document.documentElement).appendChild(s); return true; })()`);
    const found = await ev(`(() => { const el = ${SLICE}; if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; })()`);
    if (!found) { summary.push(`== ${width}px: slice not found (${opt.slice}${opt.variation ? "/" + opt.variation : ""}) on ${opt.url}`); continue; }
    // Never scroll: the dev server can reset the scroll position after load,
    // which puts the header inside the crop. Grow the viewport instead so the
    // whole slice is on screen at scroll 0.
    let note = "";
    const bottom = Math.ceil(found.top + found.h + 1);
    if (bottom > height) { height = bottom; note = `viewport raised to ${height}px so the slice is on screen without scrolling (vh-based sizes differ)`; await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false }); }
    await ev(`(() => { scrollTo(0, 0); return true; })()`); await sleep(900);
    // Measure once more: late CSS or a re-render can move the slice after the
    // first reading, and an over-tall viewport changes vh-based layouts.
    const settled = await ev(`(() => { const el = ${SLICE}; if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; })()`);
    if (settled) {
      const fit = Math.max(Number(opt.height), Math.ceil(settled.top + settled.h + 1));
      if (fit !== height) {
        height = fit; note = fit > Number(opt.height) ? `viewport raised to ${height}px so the slice is on screen without scrolling (vh-based sizes differ)` : "";
        await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false }); await sleep(500);
      }
    }
    // The dev server can re-render or Fast-Refresh the page after load; wait
    // for the slice to be back in the DOM before touching it.
    const waitForSlice = async () => { for (let i = 0; i < 20; i++) { if (await ev(`!!(${SLICE})`)) return true; await sleep(500); } return false; };
    if (!(await waitForSlice())) { summary.push(`== ${width}px: slice disappeared after load (page re-rendered?) — rerun`); continue; }
    if (opt.before) { await ev(`(async () => { ${opt.before}; return true; })()`); await sleep(700); }
    if (opt.hover) {
      const c = await ev(`(() => { const el = (${SLICE}).querySelector(${JSON.stringify(opt.hover)}); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
      if (c) { await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: c.x, y: c.y, button: "none" }); await sleep(500); }
      else note = (note ? note + "; " : "") + `--hover "${opt.hover}" matched nothing in the slice`;
    } else await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 1, y: 1, button: "none" });
    if (!(await waitForSlice())) { summary.push(`== ${width}px: slice disappeared after --before/--hover — rerun`); continue; }
    console.error(`… ${width}px: measuring`);

    // Tag and read everything QA compares: text, painted boxes, layout gaps, media.
    const m = await ev(`(() => {
      const root = ${SLICE}, R = root.getBoundingClientRect();
      const rel = (r) => ({ x: +(r.left - R.left).toFixed(2), y: +(r.top - R.top).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) });
      const shown = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && +cs.opacity > 0 && !el.closest('[inert],[aria-hidden="true"]'); };
      const label = (el) => el.tagName.toLowerCase() + ([...el.classList].slice(0, 3).map((c) => '.' + c).join(''));
      // Remember elements in a page-side registry rather than tagging them with
      // an attribute: the page may still be hydrating, and React reports any
      // attribute it did not render itself as a hydration mismatch.
      const reg = (window.__sliceQa = new Map()), ids = new Map();
      const tag = (el) => { if (ids.has(el)) return ids.get(el); const k = 'q' + ids.size; ids.set(el, k); reg.set(k, el); return k; };
      const texts = [], boxes = [], layouts = [], media = [];
      for (const el of [root, ...root.querySelectorAll('*')]) {
        if (!shown(el)) continue;
        const cs = getComputedStyle(el);
        const ownText = [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join('').replace(/\\s+/g, ' ').trim();
        if (ownText && texts.length < 300) {
          const range = document.createRange(); range.selectNodeContents(el);
          const lines = [...range.getClientRects()].filter((r) => r.width > 0);
          texts.push({ id: tag(el), el: label(el), text: el.textContent.replace(/\\s+/g, ' ').trim().slice(0, 80), rect: rel(el.getBoundingClientRect()),
            family: cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim(), size: cs.fontSize, lineHeight: cs.lineHeight, weight: cs.fontWeight, letterSpacing: cs.letterSpacing,
            transform: cs.textTransform, style: cs.fontStyle, color: cs.color, align: cs.textAlign, decoration: cs.textDecorationLine,
            lines: new Set(lines.map((r) => Math.round(r.top))).size, maxLineWidth: +Math.max(0, ...lines.map((r) => r.width)).toFixed(2) });
        }
        const painted = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) + parseFloat(cs.borderRightWidth) + parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderLeftWidth) > 0 || cs.boxShadow !== 'none' || parseFloat(cs.borderTopLeftRadius) > 0;
        if ((painted || el === root) && boxes.length < 150) boxes.push({ id: tag(el), el: label(el), rect: rel(el.getBoundingClientRect()), bg: cs.backgroundColor, bgImage: cs.backgroundImage === 'none' ? null : cs.backgroundImage.slice(0, 80),
          border: [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].join(' ') + ' ' + cs.borderTopColor, radius: [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].join(' '),
          shadow: cs.boxShadow === 'none' ? null : cs.boxShadow, padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].join(' ') });
        // Padding on any element (StyledContainer, which carries the slice's
        // top/bottom padding, is display:block), gaps on flex and grid ones.
        const flexy = cs.display.includes('flex') || cs.display.includes('grid');
        if (layouts.length < 150) {
          const pad = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].join(' ');
          if (flexy && (cs.rowGap !== 'normal' && cs.rowGap !== '0px' || cs.columnGap !== 'normal' && cs.columnGap !== '0px') || pad !== '0px 0px 0px 0px')
            layouts.push({ id: tag(el), el: label(el), rect: rel(el.getBoundingClientRect()), display: cs.display, direction: cs.flexDirection, gap: cs.rowGap + ' / ' + cs.columnGap, padding: pad, justify: cs.justifyContent, align: cs.alignItems, columns: cs.display.includes('grid') ? cs.gridTemplateColumns : null });
        }
        if ((el.tagName === 'IMG' || el.tagName === 'svg' || el.tagName === 'VIDEO' || el.tagName === 'IFRAME') && media.length < 100) {
          media.push({ id: tag(el), el: label(el), rect: rel(el.getBoundingClientRect()), natural: el.naturalWidth ? el.naturalWidth + 'x' + el.naturalHeight : null, fit: cs.objectFit, position: cs.objectPosition, color: el.tagName === 'svg' ? cs.color : null, alt: el.getAttribute('alt'), src: (el.currentSrc || el.getAttribute('src') || '').split('?')[0].split('/').pop() });
        }
      }
      // The section's painted background may sit on the slice root or an ancestor.
      let bgEl = root; while (bgEl && getComputedStyle(bgEl).backgroundColor === 'rgba(0, 0, 0, 0)') bgEl = bgEl.parentElement;
      return { slice: { type: root.dataset.sliceType, variation: root.dataset.sliceVariation, rect: { x: +(R.left).toFixed(2), w: +R.width.toFixed(2), h: +R.height.toFixed(2) }, background: bgEl ? getComputedStyle(bgEl).backgroundColor : 'transparent', backgroundFrom: bgEl ? label(bgEl) : null },
        viewport: { width: innerWidth, height: innerHeight }, overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth, sliceOverflowX: root.scrollWidth - root.clientWidth, texts, boxes, layouts, media };
    })()`);

    // The font file Chrome actually drew each text with (catches fallbacks).
    // DOM.requestNode below only resolves nodes once the document is requested.
    await send("DOM.getDocument", { depth: -1 });
    for (const t of m.texts) {
      try {
        const { result } = await send("Runtime.evaluate", { expression: `window.__sliceQa.get(${JSON.stringify(t.id)})` });
        const { nodeId } = await send("DOM.requestNode", { objectId: result.objectId });
        const { fonts } = await send("CSS.getPlatformFontsForNode", { nodeId });
        t.platformFont = fonts.map((f) => `${f.familyName}${f.postScriptName ? " [" + f.postScriptName + "]" : ""}${f.isCustomFont ? "" : " (LOCAL FALLBACK)"}`).join(" + ");
      } catch { t.platformFont = "?"; }
    }

    // Slice-only screenshot, then the Figma comparison when a render was given.
    await ev(`(() => { scrollTo(0, 0); return true; })()`);
    const r = await ev(`(() => { const b = (${SLICE}).getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, scrollY }; })()`);
    if (r.scrollY !== 0) note = (note ? note + "; " : "") + `page was scrolled to ${r.scrollY}px at capture`;
    const live = (await send("Page.captureScreenshot", { format: "png", clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } })).data;
    fs.writeFileSync(path.join(dir, "live.png"), Buffer.from(live, "base64"));
    if (figmaRefs[width]) {
      const figma = fs.readFileSync(figmaRefs[width]).toString("base64");
      const cmp = await ev(`(async () => {
        const load = (s) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
        const [F, L] = await Promise.all([load(${JSON.stringify(figma)}), load(${JSON.stringify(live)})]);
        const W = Math.min(F.width, L.width), H = Math.min(F.height, L.height);
        const px = (img) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.drawImage(img, 0, 0); return x.getImageData(0, 0, W, H); };
        const f = px(F), l = px(L), diff = new ImageData(W, H);
        for (let i = 0; i < f.data.length; i += 4) { let d = 0; for (let k = 0; k < 3; k++) d = Math.max(d, Math.abs(f.data[i + k] - l.data[i + k])); const a = Math.min(255, d * 3); diff.data[i] = 255; diff.data[i + 1] = 255 - a; diff.data[i + 2] = 255 - a; diff.data[i + 3] = 255; }
        const lum = (img, x, y) => { const i = (y * W + x) * 4; return 0.2126 * img.data[i] + 0.7152 * img.data[i + 1] + 0.0722 * img.data[i + 2]; };
        const ink = (img, x0, y0, w, h) => { const v = []; for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) v.push(lum(img, x, y)); const bg = [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];
          let s = 0, sx = 0, sy = 0; v.forEach((p, k) => { const d = Math.abs(p - bg); s += d; sx += d * (k % w); sy += d * Math.floor(k / w); }); return { s, cx: s ? sx / s : 0, cy: s ? sy / s : 0 }; };
        const texts = ${JSON.stringify(m.texts.map((t) => ({ id: t.id, ...t.rect })))}.map((t) => {
          const x0 = Math.max(0, Math.floor(t.x) - 2), y0 = Math.max(0, Math.floor(t.y) - 2), w = Math.min(W - x0, Math.ceil(t.w) + 4), h = Math.min(H - y0, Math.ceil(t.h) + 4);
          if (w < 4 || h < 4) return { id: t.id, outside: true };
          const a = ink(f, x0, y0, w, h), b = ink(l, x0, y0, w, h);
          return { id: t.id, inkRatio: a.s ? +(b.s / a.s).toFixed(2) : null, dx: +(b.cx - a.cx).toFixed(2), dy: +(b.cy - a.cy).toFixed(2) };
        });
        const side = (a, b) => { const c = document.createElement('canvas'); c.width = a.width + b.width + 16; c.height = Math.max(a.height, b.height); const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(a, 0, 0); x.drawImage(b, a.width + 16, 0); return c.toDataURL('image/png'); };
        const dc = document.createElement('canvas'); dc.width = W; dc.height = H; dc.getContext('2d').putImageData(diff, 0, 0);
        let changed = 0; for (let i = 0; i < diff.data.length; i += 4) if (diff.data[i + 1] < 205) changed++;
        return { figmaSize: [F.width, F.height], liveSize: [L.width, L.height], changedPixelShare: +(changed / (W * H)).toFixed(4), texts, compare: side(F, L), diff: dc.toDataURL('image/png') };
      })()`);
      fs.writeFileSync(path.join(dir, "compare.png"), Buffer.from(cmp.compare.split(",")[1], "base64"));
      fs.writeFileSync(path.join(dir, "diff.png"), Buffer.from(cmp.diff.split(",")[1], "base64"));
      m.figma = { file: figmaRefs[width], figmaSize: cmp.figmaSize, liveSize: cmp.liveSize, changedPixelShare: cmp.changedPixelShare };
      const byId = Object.fromEntries(cmp.texts.map((t) => [t.id, t]));
      for (const t of m.texts) t.vsFigma = byId[t.id];
    }
    m.note = note || undefined;
    fs.writeFileSync(path.join(dir, "measure.json"), JSON.stringify(m, null, 1));

    // Readable digest
    // Tailwind v4 opacity modifiers (bg-primary-light/12) compute to oklab(),
    // so convert OKLab / OKLCh / color(srgb) to sRGB hex as well as rgb().
    const hex = (c) => {
      const v = c.match(/-?[\d.]+(?:e-?\d+)?%?/g); if (!v) return c;
      const n = v.map((x) => (x.endsWith("%") ? parseFloat(x) / 100 : +x)), alpha = n[3];
      if (alpha === 0) return "transparent";
      let rgb = n.slice(0, 3);
      if (/^ok(lab|lch)\(/.test(c)) {
        let [L, a, b] = n;
        if (c.startsWith("oklch")) { const h = (n[2] * Math.PI) / 180; a = n[1] * Math.cos(h); b = n[1] * Math.sin(h); }
        const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
        rgb = [4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s]
          .map((x) => 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055));
      } else if (/^color\(srgb /.test(c)) rgb = rgb.map((x) => x * 255);
      const s = "#" + rgb.map((x) => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, "0")).join("");
      return alpha !== undefined && alpha < 1 ? `${s}@${alpha}` : s;
    };
    summary.push(`== ${width}px  ${m.slice.type}/${m.slice.variation}  ${m.slice.rect.w}x${m.slice.rect.h}  bg ${hex(m.slice.background)} (from ${m.slice.backgroundFrom})  page overflow-x ${m.overflowX}px${note ? "  [" + note + "]" : ""}`);
    if (m.figma) summary.push(`   figma ${m.figma.figmaSize.join("x")} vs live ${m.figma.liveSize.join("x")}; ${(m.figma.changedPixelShare * 100).toFixed(1)}% of pixels differ noticeably`);
    for (const t of m.texts) {
      const v = t.vsFigma && !t.vsFigma.outside ? `  ink×${t.vsFigma.inkRatio} Δ${t.vsFigma.dx},${t.vsFigma.dy}` : "";
      summary.push(`   "${t.text.slice(0, 38)}"`.padEnd(44) + ` ${t.family} ${t.weight} ${t.size}/${t.lineHeight} ls ${t.letterSpacing} ${t.transform !== "none" ? t.transform + " " : ""}${hex(t.color)} ${t.align}  w${t.maxLineWidth} ×${t.lines}L @${t.rect.x},${t.rect.y}${v}${/FALLBACK/.test(t.platformFont) ? "  !! " + t.platformFont : ""}`);
    }
    for (const b of m.boxes.slice(0, 40)) summary.push(`   box ${b.el.slice(0, 40)} @${b.rect.x},${b.rect.y} ${b.rect.w}x${b.rect.h} bg ${hex(b.bg)} pad ${b.padding} r ${b.radius}${b.shadow ? " shadow" : ""}${b.border.startsWith("0px 0px 0px 0px") ? "" : " border " + b.border}`);
    for (const l of m.layouts.filter((l) => l.padding !== "0px 0px 0px 0px").slice(0, 20)) summary.push(`   pad ${l.el.slice(0, 40)} @${l.rect.x},${l.rect.y} ${l.rect.w}x${l.rect.h} padding ${l.padding}${/flex|grid/.test(l.display) ? " gap " + l.gap : ""}`);
  }
  summary.push(pageErrors.length ? `page errors: ${[...new Set(pageErrors)].join(" | ")}` : "no page errors");
  fs.writeFileSync(path.join(opt.out, "summary.txt"), summary.join("\n") + "\n");
  console.log(summary.join("\n"));
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  try { ws?.close(); } catch {}
  cleanup();
}
