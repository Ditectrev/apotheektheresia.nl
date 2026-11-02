import { business, hrefFor, type Locale } from "@/lib/content";
import { dictionary } from "@/lib/ui";

const slots = business.hours;

export function HoursTable({ locale }: { locale: Locale }) {
  const t = dictionary(locale);
  const rows = [1, 2, 3, 4, 5, 6, 0].map((day) => {
    const daySlots = slots.filter((slot) => slot.days.includes(day));
    const label = daySlots.length
      ? daySlots.map((slot) => `${slot.opens}–${slot.closes}`).join(", ")
      : t.closed;
    return { day: t.days[day], label };
  });

  return (
    <table className="hours">
      <caption className="visually-hidden">{t.hours}</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.day}>
            <th scope="row">{row.day}</th>
            <td>{row.label}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ContactFacts({ locale, showHours }: { locale: Locale; showHours: boolean }) {
  const t = dictionary(locale);
  return (
    <div className="facts">
      <section>
        <h2>{t.address}</h2>
        <p>
          {business.address.street}
          <br />
          {business.address.postalCode} {business.address.city}
        </p>
        <p>
          <a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a>
          <br />
          {t.fax}: {business.faxDisplay}
        </p>
        <p>
          {t.emailGeneral}
          <br />
          <a href={`mailto:${business.email}`}>{business.email}</a>
        </p>
        <p>
          {t.emailRx}
          <br />
          <a href={`mailto:${business.prescriptionsEmail}`}>{business.prescriptionsEmail}</a>
        </p>
      </section>
      {showHours ? (
        <section>
          <h2>{t.hours}</h2>
          <HoursTable locale={locale} />
          <p className="note">{t.walkIn}</p>
          <p className="note">{t.holidayNote}</p>
        </section>
      ) : null}
      <section>
        <h2>{t.emergency}</h2>
        <p>
          {business.emergency.name}
          <br />
          {business.emergency.street}
          <br />
          {business.emergency.postalCode} {business.emergency.city}
        </p>
        <p>
          <a href={`tel:${business.emergency.phoneTel}`}>{business.emergency.phoneDisplay}</a>
        </p>
      </section>
    </div>
  );
}

export function localBusinessJson(locale: Locale, path: string, includeHours: boolean) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    name: business.name,
    url: path,
    telephone: business.phoneTel,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressCountry: "NL",
    },
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Debit Card",
    inLanguage: locale,
  };
  if (includeHours) {
    data.openingHoursSpecification = business.hours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days.map((day) =>
        ["https://schema.org/Sunday", "https://schema.org/Monday", "https://schema.org/Tuesday", "https://schema.org/Wednesday", "https://schema.org/Thursday", "https://schema.org/Friday", "https://schema.org/Saturday"][day],
      ),
      opens: slot.opens,
      closes: slot.closes,
    }));
  }
  return data;
}

export function pagePath(locale: Locale, slug: string): string {
  return hrefFor(locale, slug);
}