---
name: vercel-site-poc
description: >-
  Build a Vercel-ready Next.js demo of an existing mostly-static business or
  brochure website. Use when the user wants a quick PoC, replacement demo, or
  GitHub repo that imports on Vercel, including brand-matched colors, a
  language switch, site search, light and dark themes, a preview banner, share
  cards, old-URL redirects, local business data, contact links, a branded 404,
  legal pages, opening hours, Google Analytics, Core Web Vitals, accessibility,
  sitemap, or llms.txt. Worked example: https://github.com/Ditectrev/ginkgo.lu
---

# Vercel site PoC

Rebuild an existing site as a small demo that imports from GitHub onto Vercel and gets a `*.vercel.app` URL. Match the live brand. Do not invent a new visual direction.

Worked example: Pharmacie Ginkgo (`https://github.com/Ditectrev/ginkgo.lu` for `https://ginkgo.lu`). Read it when a structural choice is unclear. Do not copy its copy, colors, or routes into another site.

## Stack

- Next.js App Router, React, TypeScript. Dependencies stop at `next`, `react`, `react-dom`, and their types.
- No UI kit, CSS framework, or component library.
- One content module (JSON imported by `lib/content.ts`) is the source for pages, search, sitemap, metadata, `llms.txt`, business name, address, phone, email, hours, and old-URL redirects.
- `generateStaticParams` for every page. `dynamicParams = false`.
- API routes only for forms that must submit. Everything else is static.
- `vercel.json` may set `"framework": "nextjs"`. Vercel detects Next without it. Never commit a deploy token. Document env vars in `.env.example` with empty values.

Use this stack even when the demo has no forms, so every PoC deploys the same way. Switch away from Next only if the user asks.

Env vars, both empty by default:

- `NEXT_PUBLIC_SITE_URL` — absolute origin for canonical, Open Graph, sitemap, and `llms.txt` links. Fall back to the Vercel production URL when unset.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 measurement id. Empty means no analytics and no consent banner.

## Brand

Sample the live site: background, text, buttons, links, header. Put those colors in CSS variables on `:root`. The light theme is the current brand. The dark theme remaps the same hues (lighter text, darker surfaces, brand green kept on buttons). Do not introduce a new palette, display typeface, or “distinctive” layout that the live site does not have.

Load the same families the live site uses via `next/font` with `display: "swap"` and only the weights the pages need. Set `color-scheme` on each theme.

Copy the live favicon into `app/icon`. Add `app/manifest.ts` with the business name, the brand `theme_color`, and that icon. Do not draw a new lettermark.

## Preview

The first element in `body`, before the skip link, is a short banner: this is a preview of the named live site. Copy comes from the locale dictionary. It stays on screen (no dismiss control) and uses the same landmarks as the rest of the chrome.

Every page sets `robots` to `noindex, nofollow` so the demo host does not compete with the live site. `app/robots.ts` still allows `/` and points `sitemap` at the absolute sitemap URL, so the files can be reviewed. Say in the README that `noindex` comes off when this demo replaces production.

## Share cards

`metadataBase` is `NEXT_PUBLIC_SITE_URL`. Each page has its own title and description. `openGraph` and `twitter` use that title, description, and an absolute image URL. Use a real photo from the page when it has one; otherwise one shared image sampled from the live site. Include `app/opengraph-image` only when the live site has no usable image.

## Languages

- Primary locale is unprefixed (`/`, `/about`). Each other locale is a prefix (`/en`, `/en/about`).
- An explicit alternate map links each path to its translation. The language control navigates to that path. Do not use a query string or a client-only dictionary for URLs.
- `generateMetadata` sets `canonical` and `alternates.languages`, including `x-default` as the primary locale. List a locale in hreflang only when that page has a real translation.
- `app/sitemap.ts` emits the same language alternates.
- `app/robots.ts` allows `/` and points `sitemap` at the absolute sitemap URL.
- Set `document.documentElement.lang` to the active locale. A root layout that always says the primary language is not enough for prefixed pages; update `lang` from the path before paint when the layout is shared.
- When a translation is missing, still serve the prefixed URL. Chrome and the notice use the requested locale. The article uses the primary-locale body and sets `lang` on the article to that source locale. The notice says the page is not translated yet.

UI chrome (nav, skip link, search, theme, preview banner, form errors, consent, opening-hours, 404, untranslated notice) lives in one dictionary per locale, separate from page bodies.

## Footer credit

Every page footer, including the 404, ends with the text `Crafted by Ditectrev`. The whole phrase is one link to `https://ditectrev.com`. Keep that wording in English on every locale. Do not translate it and do not restyle it as a new brand mark.

## Search

Build a search index from the content module: path, locale, title, and plain text stripped from blocks. Filter in the browser, current locale only. Open it as a dialog with an accessible name, label the field, close on Escape, and return focus to the button that opened it. Show matches as links. Empty state after two characters. No search service.

## Theme

Three states: `light`, `dark`, `system`. Default `system`.

- A blocking script in the root layout sets `data-theme` from `localStorage` before paint. Missing or invalid storage means `system`.
- `system` follows `prefers-color-scheme`. An explicit choice is stored and wins over the OS.
- The toggle flips between the resolved light and dark appearance and persists the choice.
- Honor `prefers-reduced-motion: reduce` (no smooth scroll, no entrance motion).

## Contact, hours, and local business data

Phone, email, and address in the content module are visible text and real links: `tel:`, `mailto:`, and a maps URL built from the address. A map on the page is a static image with dimensions and a link to that maps URL. Do not embed an iframe.

When the content includes weekly hours, show them on the contact page. “Open now” is a client island: it reads those hours and the business timezone in the browser. Do not decide open or closed at build time.

Emit JSON-LD (`LocalBusiness`, or a more specific type such as `Pharmacy` when that is what the business is) from the same name, address, phone, email, hours, and locale URLs that are visible on the page. Omit hours from the structured data when the page does not show them. Do not invent a registration number, geo coordinates, or a social profile the live site does not publish.

## Old URLs

Keep a path that already exists on the live site. When the demo path differs, add a permanent redirect in `next.config.ts` from the old path to the new one, taken from the content module. Cover each locale. Do not add a redirect where the path is unchanged.

## Not found

`app/not-found.tsx` uses the site header, the preview banner, a locale-aware heading, a link home, the search control, and the same footer credit as every other page. Locale comes from the path prefix, otherwise the primary locale. One `h1`. No default Next.js error screen.

## Legal pages

When the live site has legal or privacy pages, rebuild them from that content and keep their paths (or redirect the old paths). When it does not, and the business is in the EU, add a mentions page and a privacy page from public facts only: name, address, phone, email, and what this demo stores. The privacy page says page views are sent to Google Analytics only after the visitor accepts, and only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. Do not invent a trade register number. Put these URLs in the sitemap, search, and the Optional section of `llms.txt`.

## Google Analytics

Load analytics only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. Then show a consent banner from the locale dictionary: what is measured (page views), Accept, and Reject.

- Store the choice in `localStorage`.
- Accept loads `https://www.googletagmanager.com/gtag/js?id=MEASUREMENT_ID` and configures that id. Do not inject the script before Accept.
- Reject stores the refusal and loads nothing.
- An empty measurement id means no script and no banner.

## Accessibility and Core Web Vitals

- Skip link to `<main id="contenu">`, one `h1` per page, visible `:focus-visible`, labeled controls, button vs link used for their real roles.
- Images have dimensions and useful `alt`, or empty alt when decorative. Give the largest above-the-fold image priority. Lazy-load the rest.
- Client components are islands: header (menu, search, theme), consent, “open now”, forms, small motion. Page bodies stay server-rendered.
- Security headers in `next.config.ts`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`. `poweredByHeader: false`.
- Forms that need a secret (mail API, captcha) document the env vars and, when unset, stay on screen with the public email and phone. Do not call a private endpoint from the old site. Mention Vercel’s request-body limit if uploads are allowed.

## llms.txt

Ship `/llms.txt` from the same page index so it cannot drift from the sitemap. Prefer `app/llms.txt/route.ts` (`Content-Type: text/markdown; charset=utf-8`). A hand-written `public/llms.txt` is only for a tiny fixed page list.

Format, in this order:

1. `# Site name`
2. Blockquote summary of who the site is for and what it covers
3. Short notes only when an agent would otherwise misread the site (include that this host is a preview)
4. `##` sections of markdown lists: `- [Title](absolute URL): one-line description`
5. Put legal and utility pages under `## Optional`

Add `<link rel="describedby" href="/llms.txt">` in the document head. Curate the list; do not dump every URL with an empty description.

## Check before finishing

- [ ] `npm run build` succeeds
- [ ] Light theme matches the live brand; dark theme uses the same hues
- [ ] Theme does not flash on reload; system, light, and dark all work
- [ ] Preview banner is visible; pages send `noindex, nofollow`
- [ ] A shared link shows the page title, description, and image
- [ ] Favicon matches the live site
- [ ] Language switch lands on the translated URL; `lang` and hreflang match
- [ ] A missing translation shows the primary body plus a notice, and hreflang omits it
- [ ] Search finds a real page in the active language and is keyboard usable
- [ ] Changed live paths redirect; unchanged paths do not
- [ ] Phone, email, and address are real links; the map is a static image
- [ ] “Open now” follows the business timezone when hours exist
- [ ] JSON-LD matches the name, address, phone, and hours shown on the page
- [ ] An unknown URL shows the branded 404
- [ ] Legal pages exist when the live site has them, or when the business is in the EU
- [ ] With no measurement id, no analytics script and no consent banner
- [ ] With an id, the script loads only after Accept; Reject loads nothing
- [ ] `/sitemap.xml`, `/robots.txt`, and `/llms.txt` respond and share the page list
- [ ] Skip link, focus, and reduced motion work
- [ ] Every page footer, including 404, shows `Crafted by Ditectrev` linking to `https://ditectrev.com`
- [ ] Forms without env vars explain how to reach the business
- [ ] README covers install, build, Vercel import, env vars, and removing `noindex` at launch

Verify the changed flows in the browser (language, theme, search, consent if an id is set, one form, one inner page, one old URL, one unknown URL) on a desktop width and a narrow width.
