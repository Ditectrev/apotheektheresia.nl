"use client";

import { usePathname } from "next/navigation";
import { hrefFor, localeFromPath } from "@/lib/content";
import { dictionary } from "@/lib/ui";

export default function NotFound() {
  const pathname = usePathname() || "/";
  const locale = localeFromPath(pathname);
  const t = dictionary(locale);
  return (
    <main id="contenu">
      <article className="article">
        <h1>{t.notFoundTitle}</h1>
        <p>{t.notFoundBody}</p>
        <p>
          <a href={hrefFor(locale, "")}>{t.notFoundHome}</a>
        </p>
      </article>
    </main>
  );
}
