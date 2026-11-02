import { absolute, business, copyFor, hrefFor, isTranslated, pages } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${business.name}`,
    "",
    `> ${business.summary.nl}`,
    "",
    "This host is a preview of https://www.apotheektheresia.nl. Pages send noindex. Dutch is the primary language. English pages exist where a translation is published; otherwise the Dutch text is shown.",
    "",
    "## Pages",
  ];
  const optional: string[] = ["## Optional"];
  for (const page of pages) {
    const copy = copyFor(page, "nl");
    const line = `- [${copy.title}](${absolute(hrefFor("nl", page.slug))}): ${copy.description}`;
    if (page.optional) optional.push(line);
    else lines.push(line);
    if (isTranslated(page, "en") && page.en) {
      const english = `- [${page.en.title}](${absolute(hrefFor("en", page.slug))}): ${page.en.description}`;
      if (page.optional) optional.push(english);
      else lines.push(english);
    }
  }
  const body = [...lines, "", ...optional, ""].join("\n");
  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
