import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/PageView";
import {
  absolute,
  copyFor,
  hrefFor,
  isTranslated,
  pageBySlug,
  pages,
  type Locale,
} from "@/lib/content";

export const dynamicParams = false;

type Params = { slug?: string[] };

function parse(slug: string[] | undefined): { locale: Locale; pageSlug: string } | null {
  const parts = slug ?? [];
  if (parts.length === 0) return { locale: "nl", pageSlug: "" };
  if (parts[0] === "en") {
    if (parts.length > 2) return null;
    return { locale: "en", pageSlug: parts[1] ?? "" };
  }
  if (parts.length !== 1) return null;
  return { locale: "nl", pageSlug: parts[0] };
}

export function generateStaticParams(): Params[] {
  const params: Params[] = [{ slug: [] }, { slug: ["en"] }];
  for (const page of pages) {
    if (!page.slug) continue;
    params.push({ slug: [page.slug] });
    params.push({ slug: ["en", page.slug] });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parse(slug);
  if (!parsed) return {};
  const page = pageBySlug(parsed.pageSlug);
  if (!page) return {};
  const copy = copyFor(page, parsed.locale);
  const translated = isTranslated(page, parsed.locale);
  const canonicalPath = translated ? hrefFor(parsed.locale, page.slug) : hrefFor("nl", page.slug);
  const languages: Record<string, string> = {
    nl: absolute(hrefFor("nl", page.slug)),
    "x-default": absolute(hrefFor("nl", page.slug)),
  };
  if (isTranslated(page, "en")) languages.en = absolute(hrefFor("en", page.slug));
  const image = absolute("/media/interior.png");
  return {
    title: copy.title,
    description: copy.description,
    robots: { index: false, follow: false },
    alternates: { canonical: absolute(canonicalPath), languages },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: absolute(canonicalPath),
      images: [{ url: image, width: 1280, height: 320, alt: "Apotheek Theresia" }],
      locale: parsed.locale === "en" ? "en_GB" : "nl_NL",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [image],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const parsed = parse(slug);
  if (!parsed) notFound();
  const page = pageBySlug(parsed.pageSlug);
  if (!page) notFound();
  return (
    <PageView
      page={page}
      locale={parsed.locale}
      inquiryEnabled={Boolean(process.env.INQUIRY_WEBHOOK_URL)}
    />
  );
}
