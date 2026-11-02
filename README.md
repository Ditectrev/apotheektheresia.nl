# Apotheek Theresia preview

A Next.js preview of [apotheektheresia.nl](https://www.apotheektheresia.nl). Colours and type follow the live site: teal `#008884` and Roboto. Dutch is the primary language. English is a real translation where one is published. Other English URLs show the Dutch text and a notice.

Every page sends `noindex, nofollow` so this host does not compete with the live pharmacy. Remove that in `app/layout.tsx` and `app/[[...slug]]/page.tsx` when this demo replaces production.

## Install and build

```bash
npm install
npm run build
npm run dev
```

`npm run skills` restores the review skills into `.agents/skills/`. Do not commit `.agents/` or `node_modules`.

## Vercel

Import the GitHub repository. Framework is Next.js. No deploy token is committed.

## Environment

Copy `.env.example`.

- `NEXT_PUBLIC_SITE_URL` — absolute origin for canonical links, Open Graph, the sitemap, and `llms.txt`. Empty uses the Vercel production URL.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 id. Empty means no analytics script and no consent banner. With an id, the script loads only after Accept.
- `INQUIRY_WEBHOOK_URL` — optional endpoint for the inquiry form. Empty keeps the form on screen and shows the public phone and email. Do not point it at the live site. Do not collect a BSN on this preview.

## Old addresses

Paths that still exist on the live site are kept. Paths this preview does not publish redirect. Syndicated health-news posts redirect to the homepage. Unchanged paths are not redirected.
