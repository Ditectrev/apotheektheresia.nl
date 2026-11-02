import type { MetadataRoute } from "next";
import { absolute, hrefFor, isTranslated, pages } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => {
    const languages: Record<string, string> = {
      nl: absolute(hrefFor("nl", page.slug)),
      "x-default": absolute(hrefFor("nl", page.slug)),
    };
    if (isTranslated(page, "en")) languages.en = absolute(hrefFor("en", page.slug));
    return {
      url: absolute(hrefFor("nl", page.slug)),
      lastModified: new Date("2026-11-01"),
      alternates: { languages },
    };
  });
}
