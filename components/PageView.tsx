import type { Block, Locale, Page } from "@/lib/content";
import { business, copyFor, hrefFor, isTranslated, absolute } from "@/lib/content";
import { dictionary } from "@/lib/ui";
import { ContactFacts, localBusinessJson } from "./ContactFacts";
import { InquiryForm } from "./InquiryForm";
import { PharmacyForm } from "./PharmacyForm";
import { OpenNow } from "./OpenNow";
import { Rich } from "./Rich";
import Image from "next/image";

function IconCapsules() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="8" y="18" width="22" height="12" rx="6" transform="rotate(-40 19 24)" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <rect x="18" y="18" width="22" height="12" rx="6" transform="rotate(40 29 24)" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

function IconNote() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M14 8h16l8 8v24H14V8z" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M30 8v8h8M20 24h12M20 30h12" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 22L24 8l16 14v18H30V28h-12v12H8V22z" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

function ServiceList({ items }: { items: string[] }) {
  return (
    <ul className="services">
      {items.map((item) => {
        const split = item.indexOf(": ");
        const title = split > 0 ? item.slice(0, split) : item;
        const body = split > 0 ? item.slice(split + 2) : "";
        return (
          <li key={item}>
            <h3>{title}</h3>
            {body ? (
              <p>
                <Rich text={body} />
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function Blocks({ blocks, home }: { blocks: Block[]; home?: boolean }) {
  let servicesShown = false;
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "h2") return <h2 key={index}>{block.text}</h2>;
        if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
        if (block.type === "ul") {
          if (home && !servicesShown) {
            servicesShown = true;
            return <ServiceList key={index} items={block.items} />;
          }
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>
                  <Rich text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "links") {
          return (
            <ul key={index} className="link-list">
              {block.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index}>
            <Rich text={block.text} />
          </p>
        );
      })}
    </>
  );
}

export function PageView({
  page,
  locale,
  inquiryEnabled,
}: {
  page: Page;
  locale: Locale;
  inquiryEnabled: boolean;
}) {
  const t = dictionary(locale);
  const translated = isTranslated(page, locale);
  const copy = copyFor(page, locale);
  const home = page.template === "home";

  return (
    <main id="contenu" className={home ? "home-page" : "inner-page"}>
      {home ? (
        <>
          <section className="welcome">
            <Image
              className="welcome-photo"
              src="/media/interior.png"
              alt={
                locale === "en"
                  ? "The counter and shelves at Apotheek Theresia"
                  : "De balie en schappen van Apotheek Theresia"
              }
              width={1280}
              height={320}
              sizes="100vw"
              quality={60}
              priority
              fetchPriority="high"
            />
            <div className="welcome-dock">
              <ul className="welcome-actions">
                <li>
                  <a href={business.portalUrl}>
                    <IconCapsules />
                    {t.repeat}
                  </a>
                </li>
                <li>
                  <a href={hrefFor(locale, "toestemming")}>
                    <IconNote />
                    {t.consent}
                  </a>
                </li>
                <li>
                  <a href={hrefFor(locale, "afhaalautomaat")}>
                    <IconHome />
                    {t.locker}
                  </a>
                </li>
              </ul>
            </div>
          </section>
          <section className="register-band">
            <h2>{t.registerBand}</h2>
            <a className="button" href={hrefFor(locale, "inschrijven")}>
              {t.moreInfo}
            </a>
          </section>
        </>
      ) : null}
      {!translated ? <p className="notice">{t.untranslated}</p> : null}
      {!home ? (
        <div className="page-intro">
          <p className="crumbs">
            <a href={hrefFor(locale, "")}>{t.home}</a>
            <span aria-hidden="true"> / </span>
            <span>{copy.title}</span>
          </p>
          <h1>{copy.title}</h1>
        </div>
      ) : null}
      <article className="article" lang={translated ? undefined : "nl"}>
        {home ? <h1>{t.aboutLead}</h1> : null}
        {home ? <p className="lead">{t.aboutText}</p> : null}
        <Blocks blocks={copy.blocks} home={home} />
        {page.showMap ? (
          <figure className="map">
            <a href={business.mapsUrl}>
              <Image src="/media/map.png" alt={t.map} width={800} height={420} />
            </a>
            <figcaption>
              <a href={business.mapsUrl}>{t.mapLink}</a>
              <br />
              {t.mapCredit}
            </figcaption>
          </figure>
        ) : null}
        {page.form === "register" || page.form === "locker" ? (
          <PharmacyForm locale={locale} enabled={inquiryEnabled} topic={page.form} />
        ) : page.form ? (
          <InquiryForm locale={locale} enabled={inquiryEnabled} topic={page.form} />
        ) : null}
      </article>
      {page.showHours || home ? (
        <section className="visit">
          <OpenNow locale={locale} />
          <ContactFacts locale={locale} showHours />
        </section>
      ) : null}
      {page.showHours || home ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              localBusinessJson(locale, absolute(hrefFor(locale, page.slug)), true),
            ),
          }}
        />
      ) : null}
    </main>
  );
}
