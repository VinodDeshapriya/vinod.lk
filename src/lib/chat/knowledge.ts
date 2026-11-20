import { asLink, type Content } from "@prismicio/client";
import { createClient } from "@/prismicio";

/**
 * Turns the site's Prismic content (pages, case studies, settings) into plain text
 * the chat assistant answers from. Rebuilt at most once an hour, so edits in Prismic
 * reach the chatbot without a deploy.
 */

const SKIP_KEYS = new Set([
  "icon",
  "style",
  "variant",
  "title_size",
  "top_padding",
  "bottom_padding",
  "large",
  "highlight",
  "dark",
  "is_free",
  "show_numbers",
  "show_google_rating",
  "monogram",
  "rating",
]);

type Node = unknown;

const isRichText = (v: Node): v is { type: string; text: string }[] =>
  Array.isArray(v) &&
  v.length > 0 &&
  typeof v[0] === "object" &&
  v[0] !== null &&
  "text" in (v[0] as object) &&
  "type" in (v[0] as object);

function flatten(v: Node, out: string[]) {
  if (v == null || typeof v === "boolean" || typeof v === "number") return;
  if (typeof v === "string") {
    const s = v.trim();
    if (s && !/^https:\/\/images\.prismic\.io/.test(s)) out.push(s);
    return;
  }
  if (isRichText(v)) {
    for (const b of v) {
      const t = b.text.trim();
      if (!t) continue;
      out.push(
        b.type.startsWith("heading")
          ? `## ${t}`
          : b.type.includes("list-item")
            ? `- ${t}`
            : t,
      );
    }
    return;
  }
  if (Array.isArray(v)) return v.forEach((x) => flatten(x, out));
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if ("link_type" in o) {
      const url = asLink(o as never);
      if (url && o.text) out.push(`${o.text} (${url})`);
      return;
    }
    if ("dimensions" in o && "url" in o) return; // image
    for (const [k, x] of Object.entries(o))
      if (!SKIP_KEYS.has(k)) flatten(x, out);
  }
}

const docText = (data: Record<string, unknown>) => {
  const out: string[] = [];
  const { slices, meta_image, ...rest } = data as {
    slices?: { primary: unknown; items: unknown }[];
    meta_image?: unknown;
  };
  void meta_image;
  flatten(rest, out);
  for (const s of slices ?? []) {
    flatten(s.primary, out);
    flatten(s.items, out);
  }
  // drop exact duplicates (repeated CTAs etc.)
  return [...new Set(out)].join("\n");
};

let cache: { at: number; text: string } | null = null;
const TTL = 60 * 60 * 1000;

export async function getSiteKnowledge(): Promise<string> {
  if (cache && Date.now() - cache.at < TTL) return cache.text;
  const client = createClient();
  const [pages, cases, settings] = await Promise.all([
    client.getAllByType("page").catch(() => [] as Content.PageDocument[]),
    client
      .getAllByType("case_study")
      .catch(() => [] as Content.CaseStudyDocument[]),
    client.getSingle("settings").catch(() => null),
  ]);

  const parts: string[] = [];
  if (settings)
    parts.push(`# Site settings\n${docText(settings.data as never)}`);
  for (const p of pages) {
    const path = p.uid === "home" ? "/" : `/${p.uid}`;
    parts.push(`# Page ${path}\n${docText(p.data as never)}`);
  }
  for (const c of cases)
    parts.push(`# Case study /work/${c.uid}\n${docText(c.data as never)}`);

  const text = parts.join("\n\n").slice(0, 120_000);
  cache = { at: Date.now(), text };
  return text;
}
