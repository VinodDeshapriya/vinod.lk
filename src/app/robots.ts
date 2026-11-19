import type { MetadataRoute } from "next";
import getFullUrl from "@/utils/getFullUrl";
import isProduction from "@/utils/isProduction";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction()
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: getFullUrl("/sitemap.xml"),
  };
}
