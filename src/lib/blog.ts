import { asLink, asText, type Content, type RichTextField } from "@prismicio/client";

/** The fields of a blog post that cards and lists need (safe to pass to client components). */
export type PostSummary = {
  id: string;
  href: string;
  tag: string;
  title: string;
  /** Title with highlighted (italic) words, when set. */
  displayTitle?: RichTextField;
  /** Shorter title for the typographic cover. */
  coverTitle: string;
  excerpt: string;
  date?: string;
  readMinutes?: number | null;
  featured: boolean;
};

export const toPostSummary = (doc: Content.BlogDocument): PostSummary => ({
  id: doc.id,
  href: asLink(doc) ?? `/blog/${doc.uid}`,
  tag: doc.data.tag ?? "",
  title: doc.data.title || asText(doc.data.display_title) || "",
  displayTitle: doc.data.display_title?.length ? doc.data.display_title : undefined,
  coverTitle: doc.data.cover_title || doc.data.title || asText(doc.data.display_title) || "",
  excerpt: doc.data.excerpt ?? "",
  date: doc.data.publish_date ?? undefined,
  readMinutes: doc.data.read_minutes,
  featured: !!doc.data.featured,
});

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Newest first: publish date, then first publication. */
export const blogOrderings = [
  { field: "my.blog.publish_date", direction: "desc" as const },
  { field: "document.first_publication_date", direction: "desc" as const },
];

/** URL-safe id for a heading, shared by the article headings and its contents list. */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
