"use client";

import { usePathname } from "next/navigation";
import { business, hrefFor, localeFromPath } from "@/lib/content";
import { dictionary } from "@/lib/ui";

export function Footer() {
  const pathname = usePathname() || "/";
  const locale = localeFromPath(pathname);
  const t = dictionary(locale);

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <h2>{business.name}</h2>
          <p>
            {business.address.street}
            <br />
            {business.address.postalCode} {business.address.city}
          </p>
          <p>
            <a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a>
            <br />
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </p>
        </section>
        <section>
          <h2>{t.hours}</h2>
          <p>{locale === "en" ? "Monday to Friday, 08:30–12:30 and 13:30–17:30." : "Maandag tot en met vrijdag, 08.30–12.30 en 13.30–17.30."}</p>
          <p>
            <a href={hrefFor(locale, "openingstijden")}>{t.hours}</a>
          </p>
        </section>
        <nav aria-label={t.footerPrivacy}>
          <a href={hrefFor(locale, "route")}>{t.footerRoute}</a>
          <a href={hrefFor(locale, "inschrijven")}>{t.registerBand}</a>
          <a href={hrefFor(locale, "privacy")}>{t.footerPrivacy}</a>
          <a href={hrefFor(locale, "voorwaarden")}>{t.footerTerms}</a>
          <a href={business.portalUrl}>{t.portal}</a>
        </nav>
      </div>
      <p className="credit">
        <a href="https://ditectrev.com">Crafted by Ditectrev</a>
      </p>
    </footer>
  );
}
