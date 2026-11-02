"use client";

import { usePathname } from "next/navigation";
import { localeFromPath } from "@/lib/content";
import { dictionary } from "@/lib/ui";

export function PreviewBanner() {
  const pathname = usePathname() || "/";
  const t = dictionary(localeFromPath(pathname));
  return (
    <div className="preview" role="region" aria-label={t.preview}>
      <p>
        {t.preview}{" "}
        <a href="https://www.apotheektheresia.nl/">{t.liveSite}</a>
      </p>
    </div>
  );
}
