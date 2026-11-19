import type { Content } from "@prismicio/client";

/** Passed to every slice through <SliceZone context={...}>. */
export interface SliceContext {
  settings?: Content.SettingsDocument | null;
  latestPosts?: Content.BlogDocument[];
  /** Set by the blog post page: slices render bare, inside the article column. */
  inArticle?: boolean;
}
