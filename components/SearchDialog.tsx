"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchEntries, type Locale } from "@/lib/content";
import { dictionary } from "@/lib/ui";

export function SearchDialog({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [query, setQuery] = useState("");
  const entries = searchEntries(locale);
  const needle = query.trim().toLowerCase();
  const matches =
    needle.length < 2
      ? []
      : entries.filter((entry) => `${entry.title} ${entry.text}`.toLowerCase().includes(needle)).slice(0, 8);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setQuery("");
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <button
        type="button"
        className="search-open"
        aria-label={t.search}
        onClick={() => {
          dialogRef.current?.showModal();
          inputRef.current?.focus();
        }}
      >
        <span>{t.searchField}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 16.5L20.5 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <dialog ref={dialogRef} className="search-dialog" aria-labelledby={titleId}>
        <form method="dialog" className="search-form">
          <h2 id={titleId}>{t.search}</h2>
          <label htmlFor="site-search">{t.searchLabel}</label>
          <input
            id="site-search"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="text-button">
            {t.close}
          </button>
        </form>
        {needle.length >= 2 ? (
          matches.length ? (
            <ul className="search-results">
              {matches.map((entry) => (
                <li key={entry.href}>
                  <a
                    href={entry.href}
                    onClick={(event) => {
                      event.preventDefault();
                      const href = event.currentTarget.href;
                      dialogRef.current?.close();
                      window.location.assign(href);
                    }}
                  >
                    {entry.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t.searchEmpty}</p>
          )
        ) : null}
      </dialog>
    </>
  );
}
