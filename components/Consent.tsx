"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { localeFromPath } from "@/lib/content";
import { dictionary } from "@/lib/ui";

const storageKey = "ga-consent";

function loadAnalytics(id: string) {
  if (document.querySelector(`script[data-ga="${id}"]`)) return;
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.async = true;
  script.dataset.ga = id;
  document.head.appendChild(script);
  const inline = document.createElement("script");
  inline.dataset.gaConfig = id;
  inline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`;
  document.head.appendChild(inline);
}

export function Consent({ measurementId }: { measurementId: string }) {
  const pathname = usePathname() || "/";
  const t = dictionary(localeFromPath(pathname));
  const [choice, setChoice] = useState<"unknown" | "accepted" | "rejected">("unknown");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "accepted") {
      setChoice("accepted");
      loadAnalytics(measurementId);
    } else if (stored === "rejected") {
      setChoice("rejected");
    }
  }, [measurementId]);

  if (!measurementId || choice !== "unknown") return null;

  return (
    <div className="consent" role="region" aria-labelledby="consent-title">
      <h2 id="consent-title">{t.consentTitle}</h2>
      <p>{t.consentBody}</p>
      <div className="consent-actions">
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(storageKey, "accepted");
            setChoice("accepted");
            loadAnalytics(measurementId);
          }}
        >
          {t.consentAccept}
        </button>
        <button
          type="button"
          className="button-quiet"
          onClick={() => {
            window.localStorage.setItem(storageKey, "rejected");
            setChoice("rejected");
          }}
        >
          {t.consentReject}
        </button>
      </div>
    </div>
  );
}
