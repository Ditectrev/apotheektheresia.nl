"use client";

import { usePathname } from "next/navigation";
import { localeFromPath } from "@/lib/content";
import { dictionary } from "@/lib/ui";

export function SkipLink() {
  const pathname = usePathname() || "/";
  const t = dictionary(localeFromPath(pathname));
  return (
    <a className="skip" href="#contenu">
      {t.skip}
    </a>
  );
}
