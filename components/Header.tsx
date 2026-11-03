"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { business, hrefFor, localeFromPath, slugFromPath, type Locale } from "@/lib/content";
import { navigation } from "@/lib/nav";
import { dictionary } from "@/lib/ui";
import { OpenNow } from "./OpenNow";
import { SearchDialog } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname() || "/";
  const locale = localeFromPath(pathname);
  const t = dictionary(locale);
  const groups = navigation(locale, t);
  const other: Locale = locale === "nl" ? "en" : "nl";
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="topbar">
        <p className="top-address">
          <OpenNow locale={locale} />
          <span>
            {business.address.street}, {business.address.postalCode} {business.address.city}{" "}
            <a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a>
          </span>
        </p>
        <a className="portal" href={business.portalUrl}>
          {t.portal}
        </a>
      </div>
      <div className="nav-bar">
        <a className="wordmark" href={hrefFor(locale, "")}>
          <img src="/media/logo-nav.jpg" alt="Apotheek Theresia" width={296} height={122} />
        </a>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? t.close : t.menu}
        </button>
        <nav
          id="site-nav"
          className={open ? "site-nav is-open" : "site-nav"}
          aria-label={t.menu}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <a href={hrefFor(locale, "")} aria-current={slugFromPath(pathname) === "" ? "page" : undefined}>
            {t.home}
          </a>
          {groups.map((group) => (
            <details key={group.label}>
              <summary>{group.label}</summary>
              <ul>
                {group.children.map((child) => (
                  <li key={child.href + child.label}>
                    <a href={child.href} {...(child.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>
        <div className="nav-tools">
          <SearchDialog locale={locale} />
          <ThemeToggle locale={locale} />
          <a className="lang" href={hrefFor(other, slugFromPath(pathname))} hrefLang={other} lang={other}>
            {t.otherLanguage}
          </a>
        </div>
      </div>
    </header>
  );
}
