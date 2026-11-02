import type { Locale } from "@/lib/content";
import { hrefFor, pages } from "@/lib/content";
import type { Dictionary } from "@/lib/ui";

export type NavLink = { label: string; href: string; external?: boolean };
export type NavGroup = { label: string; href?: string; children: NavLink[] };

const about = [
  "inschrijven",
  "afhaalautomaat",
  "algemene-informatie",
  "ons-team",
  "onze-huisregels",
  "openingstijden",
  "services",
  "klachtenregeling",
];

export function navigation(locale: Locale, t: Dictionary): NavGroup[] {
  const label = (slug: string) => {
    const page = pages.find((item) => item.slug === slug);
    if (!page) return slug;
    if (locale === "en" && page.en) return page.en.title;
    return page.nl.title;
  };
  const item = (slug: string): NavLink => ({ label: label(slug), href: hrefFor(locale, slug) });

  return [
    {
      label: t.groups.about,
      href: hrefFor(locale, "ons-team"),
      children: [
        ...about.map(item),
        { label: "Apotheken Den Haag", href: "https://apotheken-denhaag.uwapothekeronline.nl", external: true },
      ],
    },
    {
      label: t.groups.online,
      href: "https://apotheektheresia.uwzorgonline.nl",
      children: [
        { label: t.repeat, href: "https://apotheektheresia.uwzorgonline.nl", external: true },
        item("uw-zorg-online-app"),
      ],
    },
    {
      label: t.groups.info,
      href: hrefFor(locale, "farmacotherapeutisch-kompas"),
      children: [
        item("privacy-2"),
        item("toestemming"),
        item("medische-encyclopedie"),
        {
          label: locale === "en" ? "Insurer reimbursement" : "Vergoeding van zorgverzekeraar",
          href: "https://www.netwerkapotheken.nl/apotheek-theresia/zorgverzekeringen",
          external: true,
        },
        item("links"),
        item("ramadan-en-medicijngebruik"),
        item("meldpunt-bijwerkingen"),
        item("geneesmiddelen-mee-op-reis"),
        item("kijksluiter"),
      ],
    },
    {
      label: t.groups.more,
      children: [item("vacatures")],
    },
  ];
}
