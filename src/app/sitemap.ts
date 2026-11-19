import type { MetadataRoute } from "next";
import { asLink } from "@prismicio/client";
import { createClient } from "@/prismicio";
import getFullUrl from "@/utils/getFullUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient();
  const [pages, posts] = await Promise.all([
    client.getAllByType("page").catch(() => []),
    client.getAllByType("blog").catch(() => []),
  ]);
  return [...pages, ...posts].map((doc) => ({
    url: getFullUrl(doc.uid === "home" ? "" : asLink(doc)),
    lastModified: new Date(doc.last_publication_date),
    priority: doc.uid === "home" ? 1 : doc.type === "page" ? 0.8 : 0.7,
  }));
}
