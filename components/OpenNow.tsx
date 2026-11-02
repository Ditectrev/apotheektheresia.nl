"use client";

import { useEffect, useState } from "react";
import { isOpenAt } from "@/lib/hours";
import type { Locale } from "@/lib/content";
import { dictionary } from "@/lib/ui";

export function OpenNow({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenAt(new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      className="open-now"
      role="status"
      data-open={open === null ? undefined : open ? "yes" : "no"}
    >
      {open === null ? t.hours : open ? t.openNow : t.closedNow}
    </span>
  );
}
