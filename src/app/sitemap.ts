import type { MetadataRoute } from "next";
import getFullUrl from "@/utils/getFullUrl";
import { mainMenu } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return mainMenu
    .map(({ href }) => (typeof href === "string" ? href : null))
    .filter((href): href is string => !!href && href.startsWith("/"))
    .map((href) => ({
      url: getFullUrl(href === "/" ? "" : href),
      lastModified,
      priority: href === "/" ? 1 : 0.8,
    }));
}
