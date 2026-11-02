import site from "@/content/site.json";

export type Locale = "nl" | "en";
export const locales: Locale[] = ["nl", "en"];
export const primaryLocale: Locale = "nl";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "links"; items: { label: string; href: string }[] };

export type Copy = {
  title: string;
  description: string;
  translated: boolean;
  blocks: Block[];
};

export type Page = {
  slug: string;
  template: "home" | "article";
  showHours: boolean;
  showMap: boolean;
  form: "register" | "locker" | "complaint" | "job" | null;
  optional: boolean;
  nl: Copy;
  en: Copy | null;
};

export const business = site;
export const pages = site.pages as Page[];

export function hrefFor(locale: Locale, slug: string): string {
  const prefix = locale === "en" ? "/en" : "";
  if (!slug) return prefix || "/";
  return `${prefix}/${slug}`;
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "nl";
}

export function slugFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "en") parts.shift();
  return parts.join("/");
}

export function pageBySlug(slug: string): Page | undefined {
  return pages.find((page) => page.slug === slug);
}

export function copyFor(page: Page, locale: Locale): Copy {
  if (locale === "en" && page.en?.translated) return page.en;
  return page.nl;
}

export function isTranslated(page: Page, locale: Locale): boolean {
  if (locale === primaryLocale) return true;
  return Boolean(page.en?.translated);
}

export function plainText(blocks: Block[]): string {
  return blocks
    .flatMap((block) => {
      if (block.type === "p" || block.type === "h2" || block.type === "h3") {
        return [block.text.replace(/\[[^\]]+\]\([^)]+\)/g, (match) => match.slice(1, match.indexOf("]")))];
      }
      if (block.type === "ul") return block.items;
      return block.items.map((item) => item.label);
    })
    .join(" ");
}

export type SearchEntry = { href: string; title: string; text: string };

export function searchEntries(locale: Locale): SearchEntry[] {
  return pages.map((page) => {
    const copy = copyFor(page, locale);
    return {
      href: hrefFor(locale, page.slug),
      title: copy.title,
      text: plainText(copy.blocks),
    };
  });
}

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  return "http://localhost:3000";
}

export function absolute(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
