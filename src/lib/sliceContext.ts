import type { Content } from "@prismicio/client";

/** Passed to every slice through <SliceZone context={...}>. */
export interface SliceContext {
  settings?: Content.SettingsDocument | null;
  latestPosts?: Content.BlogDocument[];
}
