"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/content";
import { dictionary } from "@/lib/ui";

type Choice = "light" | "dark" | "system";

function apply(choice: Choice) {
  const dark =
    choice === "dark" ||
    (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.themeChoice = choice;
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const next: Choice = stored === "light" || stored === "dark" ? stored : "system";
    apply(next);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = window.localStorage.getItem("theme");
      if (current !== "light" && current !== "dark") apply("system");
      setResolved(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    };
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const label = resolved === "dark" ? t.themeToLight : t.themeToDark;

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      onClick={() => {
        const next: Choice = resolved === "dark" ? "light" : "dark";
        window.localStorage.setItem("theme", next);
        apply(next);
        setResolved(next);
      }}
    >
      <span aria-hidden="true">{resolved === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}
