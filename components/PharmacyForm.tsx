"use client";

import { useState } from "react";
import type { Locale } from "@/lib/content";
import { business, hrefFor } from "@/lib/content";
import { dictionary } from "@/lib/ui";

type Errors = Record<string, string>;

const pharmacies = ["Duinrand Apotheek", "Apotheek Francken", "Apotheek Theresia", "Duin Apotheek"];

const months = {
  nl: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function postcodeOk(value: string) {
  return /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/.test(value.trim());
}

function dateOk(day: string, month: string, year: string) {
  if (!day || !month || !year) return false;
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function focusFirst(errors: Errors) {
  const id = Object.keys(errors)[0];
  if (id) document.getElementById(id)?.focus();
}

function Star() {
  return (
    <span className="req" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

function TextInput({
  id,
  name,
  label,
  required,
  error,
  hint,
  type = "text",
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
}) {
  const described = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required ? <Star /> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={described}
        spellCheck={type === "email" ? false : undefined}
      />
      {hint ? (
        <p id={`${id}-hint`} className="hint">
          {hint}
        </p>
      ) : null}
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

function Choice({
  name,
  legend,
  options,
  required,
  error,
  inline,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  inline?: boolean;
}) {
  return (
    <fieldset>
      <legend>
        {legend}
        {required ? <Star /> : null}
      </legend>
      <ul className={inline ? "choice-list inline" : "choice-list"}>
        {options.map((option, index) => (
          <li key={option.value}>
            <label>
              <input
                id={index === 0 ? name : undefined}
                type="radio"
                name={name}
                value={option.value}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${name}-error` : undefined}
              />
              {option.label}
            </label>
          </li>
        ))}
      </ul>
      <ErrorText id={`${name}-error`} message={error} />
    </fieldset>
  );
}

function DateSelects({
  id,
  legend,
  dayName,
  monthName,
  yearName,
  locale,
  order,
  error,
  required,
}: {
  id: string;
  legend: string;
  dayName: string;
  monthName: string;
  yearName: string;
  locale: Locale;
  order: "dmy" | "mdy";
  error?: string;
  required?: boolean;
}) {
  const dayLabel = locale === "en" ? "Day" : "Dag";
  const monthLabel = locale === "en" ? "Month" : "Maand";
  const yearLabel = locale === "en" ? "Year" : "Jaar";
  const years = [];
  for (let year = 2026; year >= 1908; year -= 1) years.push(year);
  const day = (
    <label key="day">
      <span className="sublabel">{dayLabel}</span>
      <select id={`${id}-day`} name={dayName} defaultValue="" aria-invalid={Boolean(error)} required={required}>
        <option value="">{dayLabel}</option>
        {Array.from({ length: 31 }, (_, index) => (
          <option key={index + 1} value={String(index + 1)}>
            {index + 1}
          </option>
        ))}
      </select>
    </label>
  );
  const month = (
    <label key="month">
      <span className="sublabel">{monthLabel}</span>
      <select id={`${id}-month`} name={monthName} defaultValue="" aria-invalid={Boolean(error)} required={required}>
        <option value="">{monthLabel}</option>
        {months[locale].map((name, index) => (
          <option key={name} value={String(index + 1)}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
  const year = (
    <label key="year">
      <span className="sublabel">{yearLabel}</span>
      <select id={`${id}-year`} name={yearName} defaultValue="" aria-invalid={Boolean(error)} required={required}>
        <option value="">{yearLabel}</option>
        {years.map((value) => (
          <option key={value} value={String(value)}>
            {value}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <fieldset>
      <legend>
        {legend}
        {required ? <Star /> : null}
      </legend>
      <div className="date-row">{order === "mdy" ? [month, day, year] : [day, month, year]}</div>
      <ErrorText id={`${id}-error`} message={error || undefined} />
    </fieldset>
  );
}

const copy = {
  nl: {
    unavailable: "Dit formulier verstuurt niets op deze preview. Bel of mail de apotheek.",
    sentRegister: "Uw inschrijving is verzonden. Hartelijk dank.",
    sentLocker: "Uw aanmelding is verzonden. Hartelijk dank voor uw aanmelding.",
    requiredMark: "* Verplicht veld.",
    bsn: "BSN / Sofinummer",
    bsnNote: "Dit veld staat op het formulier van de apotheek. Deze preview bewaart het nummer niet en stuurt het niet door.",
    personal: "Persoonsgegevens",
    pharmacy: "De apotheek van uw keuze",
    lastName: "Achternaam",
    initials: "Initialen",
    firstName: "Voornaam",
    infix: "Tussenvoegsel",
    birth: "Geboortedatum",
    gender: "Geslacht",
    male: "Man",
    female: "Vrouw",
    other: "Anders",
    gp: "Huisarts",
    address: "Adresgegevens",
    street: "Straatnaam",
    house: "Huisnummer",
    apartment: "Appartement nr",
    city: "Woonplaats",
    postcode: "Postcode",
    postcodeHint: "Vul als volgt in: 1234AB.",
    phoneHome: "Telefoon huis",
    phoneMobile: "Telefoon mobiel",
    mobile: "Mobiel nummer",
    phone: "Telefoonnummer",
    phoneHint: "Vul als volgt in: 0123456789.",
    email: "Emailadres",
    emailLocker: "E-mailadres",
    emailHint: "Vul als volgt in: naam@domein.nl",
    careHome: "Wonend in een woonzorginstelling",
    careHomeName: "Naam woonzorginstelling en/of thuiszorgorganisatie",
    representative: "Zaakwaarnemer (indien van toepassing)",
    representativeHint: "Naam, Telefoon mobiel, E-mail",
    insurance: "Verzekeringsgegevens",
    insurer: "Naam verzekering",
    policyNumber: "Polisnummer",
    policyType: "Soort polis",
    natura: "Naturapolis",
    restitutie: "Restitutiepolis",
    transfer: "Medicatieoverdracht en elektronisch patiëntendossier",
    transferIntro: "Om de medicatiebewaking en begeleiding optimaal te kunnen verzorgen, zijn de onderstaande vragen van belang.",
    qDossier: "Heeft u bezwaar tegen het aanleggen van een persoonlijk medicatiedossier door de apotheek?",
    qLsp: "Geeft u toestemming aan de apotheek uw medicatiegegevens te delen met uw arts(en), spoedapotheek, zorginstellingen (bijv. ziekenhuis, verzorgingstehuis) of overige medebehandelaars via het LSP ten behoeve van uw behandeling (zie informatiefolder VZVZ of de website vzvz.nl)?",
    qCare: "Heeft u bezwaar, indien u woont in een woonzorg- of begeleid/beschermd wonen-instelling of gebruik maakt van thuiszorg, dat de apotheek met uw zorgbegeleiding gegevens uitwisselt betreffende uw medicatie?",
    qHistory: "Geeft u toestemming om uw medicatiehistorie door de apotheek te laten opvragen bij uw vorige apotheek?",
    yes: "Ja",
    no: "Nee",
    previous: "Naam vorige apotheek",
    place: "Plaats",
    important: "Belangrijke gegevens",
    allergies: "Geneesmiddel allergieën/overgevoeligheid",
    chronic: "Chronische ziekte",
    pregnancy: "Kinderwens/zwangerschap/borstvoeding",
    notes: "Overige opmerkingen",
    sendRegister: "Inschrijving versturen",
    step: (n: number) => `Stap ${n} van 3`,
    next: "Volgende",
    back: "Vorige",
    summary: "Samenvatting",
    edit: "Wijzigen",
    addition: "Toevoeging",
    consentTitle: "Toestemming gebruik n.a.w. gegevens t.b.v. inplannen afspraak",
    consentBefore: "Persoonsgegevens die u verstrekt gebruiken wij uitsluitend om u zo goed mogelijk van dienst te zijn. Zie hiervoor ook ons ",
    privacy: "Privacystatement",
    consentAfter: ". Door op ‘Aanmelding versturen’ te drukken gaat u hiermee akkoord.",
    agree: "Akkoord",
    sendLocker: "Aanmelding versturen",
    dateInvalid: "Vul een geldige geboortedatum in.",
    postcodeInvalid: "Vul een postcode in als 1234AB.",
  },
  en: {
    unavailable: "This form does not send anything on this preview. Call or email the pharmacy.",
    sentRegister: "Your registration has been sent. Thank you.",
    sentLocker: "Your registration has been sent. Thank you for signing up.",
    requiredMark: "* Required field.",
    bsn: "Citizen service number (BSN)",
    bsnNote: "This field is on the pharmacy’s form. This preview does not store the number and does not send it on.",
    personal: "Personal details",
    pharmacy: "Your chosen pharmacy",
    lastName: "Last name",
    initials: "Initials",
    firstName: "First name",
    infix: "Infix",
    birth: "Date of birth",
    gender: "Sex",
    male: "Male",
    female: "Female",
    other: "Other",
    gp: "GP",
    address: "Address",
    street: "Street",
    house: "House number",
    apartment: "Apartment number",
    city: "City",
    postcode: "Postcode",
    postcodeHint: "Use this format: 1234AB.",
    phoneHome: "Home phone",
    phoneMobile: "Mobile phone",
    mobile: "Mobile number",
    phone: "Phone number",
    phoneHint: "Use this format: 0123456789.",
    email: "Email address",
    emailLocker: "Email address",
    emailHint: "Use this format: name@domain.com",
    careHome: "Living in a residential care home",
    careHomeName: "Name of the care home and/or home-care organisation",
    representative: "Representative (if applicable)",
    representativeHint: "Name, mobile phone, email",
    insurance: "Insurance",
    insurer: "Insurer",
    policyNumber: "Policy number",
    policyType: "Type of policy",
    natura: "Natura policy",
    restitutie: "Restitutie policy",
    transfer: "Medication transfer and electronic patient record",
    transferIntro: "The questions below matter for safe medication monitoring and support.",
    qDossier: "Do you object to the pharmacy creating a personal medication record?",
    qLsp: "Do you allow the pharmacy to share your medication data, for your treatment, with your doctor(s), the emergency pharmacy, care institutions (for example a hospital or nursing home), or other professionals involved in your care, through the national exchange (LSP)? See the VZVZ leaflet or vzvz.nl.",
    qCare: "If you live in residential or supported housing, or you use home care, do you object to the pharmacy exchanging medication data with your care team?",
    qHistory: "Do you allow the pharmacy to request your medication history from your previous pharmacy?",
    yes: "Yes",
    no: "No",
    previous: "Previous pharmacy",
    place: "Place",
    important: "Important details",
    allergies: "Medicine allergies or hypersensitivity",
    chronic: "Chronic illness",
    pregnancy: "Wish to conceive, pregnancy, or breastfeeding",
    notes: "Other remarks",
    sendRegister: "Send registration",
    step: (n: number) => `Step ${n} of 3`,
    next: "Next",
    back: "Previous",
    summary: "Summary",
    edit: "Change",
    addition: "Addition",
    consentTitle: "Consent to use name and address details to schedule an appointment",
    consentBefore: "We use the personal data you provide only to help you. See also our ",
    privacy: "privacy statement",
    consentAfter: ". By pressing ‘Send registration’ you agree.",
    agree: "Agree",
    sendLocker: "Send registration",
    dateInvalid: "Enter a valid date of birth.",
    postcodeInvalid: "Enter a postcode as 1234AB.",
  },
} as const;

function yesNo(locale: Locale) {
  const t = copy[locale];
  return [
    { value: "Ja", label: t.yes },
    { value: "Nee", label: t.no },
  ];
}

async function send(topic: string, locale: Locale, fields: Record<string, string>, enabled: boolean) {
  if (!enabled) return false;
  const payload = { ...fields };
  delete payload.bsn;
  const response = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ topic, locale, ...payload }),
  });
  return response.ok;
}

export function PharmacyForm({
  locale,
  enabled,
  topic,
}: {
  locale: Locale;
  enabled: boolean;
  topic: "register" | "locker";
}) {
  if (topic === "locker") return <LockerForm locale={locale} enabled={enabled} />;
  return <RegisterForm locale={locale} enabled={enabled} />;
}

function RegisterForm({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const t = copy[locale];
  const ui = dictionary(locale);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sent" | "failed">("idle");

  return (
    <form
      className="pharmacy-form"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const value = (name: string) => String(data.get(name) ?? "").trim();
        const next: Errors = {};
        const need = (name: string, id = name) => {
          if (!value(name)) next[id] = ui.formRequired;
        };
        need("pharmacy");
        need("lastName", "reg-last");
        need("initials", "reg-initials");
        if (!dateOk(value("birthDay"), value("birthMonth"), value("birthYear"))) next["reg-birth-day"] = t.dateInvalid;
        need("gender");
        need("bsn", "reg-bsn");
        need("gp", "reg-gp");
        need("street", "reg-street");
        need("houseNumber", "reg-house");
        need("city", "reg-city");
        need("postcode", "reg-postcode");
        need("phoneMobile", "reg-mobile");
        if (!emailOk(value("email"))) next["reg-email"] = ui.formEmailInvalid;
        need("insurer", "reg-insurer");
        need("policyNumber", "reg-policy");
        need("objectionDossier");
        need("consentLsp");
        need("objectionCare");
        need("consentHistory");
        need("previousPharmacy", "reg-previous");
        need("previousCity", "reg-place");
        setErrors(next);
        if (Object.keys(next).length) {
          setStatus("idle");
          focusFirst(next);
          return;
        }
        const fields = Object.fromEntries(Array.from(data.entries()).map(([key, item]) => [key, String(item)]));
        const ok = await send("register", locale, fields, enabled);
        setStatus(ok ? "sent" : "failed");
        if (ok) form.reset();
      }}
    >
      <p>{enabled ? null : t.unavailable}</p>
      <p className="hint">{t.requiredMark}</p>
      <h2>{t.personal}</h2>
      <Choice
        name="pharmacy"
        legend={t.pharmacy}
        required
        error={errors.pharmacy}
        options={pharmacies.map((name) => ({ value: name, label: name }))}
      />
      <TextInput id="reg-last" name="lastName" label={t.lastName} required autoComplete="family-name" error={errors["reg-last"]} />
      <div className="pair">
        <TextInput id="reg-initials" name="initials" label={t.initials} required autoComplete="honorific-prefix" error={errors["reg-initials"]} />
        <TextInput id="reg-first" name="firstName" label={t.firstName} autoComplete="given-name" />
      </div>
      <DateSelects id="reg-birth" legend={t.birth} dayName="birthDay" monthName="birthMonth" yearName="birthYear" locale={locale} order="mdy" required error={errors["reg-birth-day"]} />
      <Choice
        name="gender"
        legend={t.gender}
        required
        inline
        error={errors.gender}
        options={[
          { value: "Man", label: t.male },
          { value: "Vrouw", label: t.female },
        ]}
      />
      <TextInput id="reg-bsn" name="bsn" label={t.bsn} required autoComplete="off" error={errors["reg-bsn"]} hint={t.bsnNote} />
      <TextInput id="reg-gp" name="gp" label={t.gp} required error={errors["reg-gp"]} />

      <h2>{t.address}</h2>
      <div className="pair">
        <TextInput id="reg-street" name="street" label={t.street} required autoComplete="address-line1" error={errors["reg-street"]} />
        <TextInput id="reg-house" name="houseNumber" label={t.house} required autoComplete="off" error={errors["reg-house"]} />
      </div>
      <TextInput id="reg-apartment" name="apartment" label={t.apartment} />
      <div className="pair">
        <TextInput id="reg-city" name="city" label={t.city} required autoComplete="address-level2" error={errors["reg-city"]} />
        <TextInput id="reg-postcode" name="postcode" label={t.postcode} required autoComplete="postal-code" error={errors["reg-postcode"]} />
      </div>
      <div className="pair">
        <TextInput id="reg-phone" name="phoneHome" label={t.phoneHome} type="tel" autoComplete="tel" />
        <TextInput id="reg-mobile" name="phoneMobile" label={t.phoneMobile} type="tel" required autoComplete="tel" error={errors["reg-mobile"]} />
      </div>
      <TextInput id="reg-email" name="email" label={t.email} type="email" required autoComplete="email" error={errors["reg-email"]} />

      <h2>{t.careHome}</h2>
      <TextInput id="reg-care" name="careHome" label={t.careHomeName} />
      <div>
        <label htmlFor="reg-representative">{t.representative}</label>
        <textarea id="reg-representative" name="representative" rows={3} aria-describedby="reg-representative-hint" />
        <p id="reg-representative-hint" className="hint">
          {t.representativeHint}
        </p>
      </div>

      <h2>{t.insurance}</h2>
      <TextInput id="reg-insurer" name="insurer" label={t.insurer} required error={errors["reg-insurer"]} />
      <TextInput id="reg-policy" name="policyNumber" label={t.policyNumber} required error={errors["reg-policy"]} />
      <Choice
        name="policyType"
        legend={t.policyType}
        options={[
          { value: "Naturapolis", label: t.natura },
          { value: "Restitutiepolis", label: t.restitutie },
        ]}
      />

      <h2>{t.transfer}</h2>
      <p>{t.transferIntro}</p>
      <Choice name="objectionDossier" legend={t.qDossier} required error={errors.objectionDossier} options={yesNo(locale)} />
      <Choice name="consentLsp" legend={t.qLsp} required error={errors.consentLsp} options={yesNo(locale)} />
      <Choice name="objectionCare" legend={t.qCare} required error={errors.objectionCare} options={yesNo(locale)} />
      <Choice name="consentHistory" legend={t.qHistory} required error={errors.consentHistory} options={yesNo(locale)} />
      <TextInput id="reg-previous" name="previousPharmacy" label={t.previous} required error={errors["reg-previous"]} />
      <TextInput id="reg-place" name="previousCity" label={t.place} required error={errors["reg-place"]} />

      <h2>{t.important}</h2>
      <div>
        <label htmlFor="reg-allergies">{t.allergies}</label>
        <textarea id="reg-allergies" name="allergies" rows={3} />
      </div>
      <div>
        <label htmlFor="reg-chronic">{t.chronic}</label>
        <textarea id="reg-chronic" name="chronic" rows={3} />
      </div>
      <div>
        <label htmlFor="reg-pregnancy">{t.pregnancy}</label>
        <textarea id="reg-pregnancy" name="pregnancy" rows={3} />
      </div>
      <div>
        <label htmlFor="reg-notes">{t.notes}</label>
        <textarea id="reg-notes" name="notes" rows={4} />
      </div>
      <button type="submit">{t.sendRegister}</button>
      {status === "sent" ? (
        <p role="status">{t.sentRegister}</p>
      ) : null}
      {status === "failed" ? <p role="status">{enabled ? ui.formFailed : t.unavailable}</p> : null}
      <p>
        <a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a>
        {" · "}
        <a href={`mailto:${business.email}`}>{business.email}</a>
      </p>
    </form>
  );
}

function LockerForm({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const t = copy[locale];
  const ui = dictionary(locale);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sent" | "failed">("idle");

  function read(form: HTMLFormElement) {
    const data = new FormData(form);
    const next = { ...values };
    for (const [key, item] of data.entries()) next[key] = String(item);
    if (!data.get("gender")) next.gender = "";
    if (!data.get("agreement")) next.agreement = "";
    return next;
  }

  function show(nextStep: number) {
    setStep(nextStep);
    requestAnimationFrame(() => document.getElementById("locker-step-title")?.focus());
  }

  const genderLabel = values.gender === "Man" ? t.male : values.gender === "Vrouw" ? t.female : values.gender === "X" ? t.other : "–";
  const birth =
    values.birthDay && values.birthMonth && values.birthYear
      ? `${values.birthDay} ${months[locale][Number(values.birthMonth) - 1] ?? ""} ${values.birthYear}`
      : "–";

  if (status === "sent") {
    return (
      <p className="pharmacy-form" role="status">
        {t.sentLocker}
      </p>
    );
  }

  return (
    <form
      className="pharmacy-form"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const current = read(form);
        setValues(current);
        if (step === 1) {
          const next: Errors = {};
          if (!current.initials?.trim()) next.initials = ui.formRequired;
          if (!current.firstName?.trim()) next["first-name"] = ui.formRequired;
          if (!current.lastName?.trim()) next["last-name"] = ui.formRequired;
          if (!dateOk(current.birthDay ?? "", current.birthMonth ?? "", current.birthYear ?? "")) next["date-of-birth-day"] = t.dateInvalid;
          setErrors(next);
          if (Object.keys(next).length) {
            focusFirst(next);
            return;
          }
          show(2);
          return;
        }
        if (step === 2) {
          const next: Errors = {};
          if (!current.street?.trim()) next.street = ui.formRequired;
          if (!current.housenumber?.trim()) next.housenumber = ui.formRequired;
          if (!postcodeOk(current.postcode ?? "")) next["zip-code"] = t.postcodeInvalid;
          if (!current.city?.trim()) next.city = ui.formRequired;
          if (!current.mobile?.trim()) next["phone-mobile"] = ui.formRequired;
          if (!emailOk(current.email ?? "")) next.email = ui.formEmailInvalid;
          setErrors(next);
          if (Object.keys(next).length) {
            focusFirst(next);
            return;
          }
          show(3);
          return;
        }
        if (current.agreement !== "Ja") {
          setErrors({ agreement: ui.formRequired });
          document.getElementById("agreement-yes")?.focus();
          return;
        }
        const ok = await send("locker", locale, current, enabled);
        setStatus(ok ? "sent" : "failed");
      }}
    >
      <p>{enabled ? null : t.unavailable}</p>
      <p className="form-step">{t.step(step)}</p>
      <h2 id="locker-step-title" tabIndex={-1}>
        {step === 1 ? t.personal : step === 2 ? t.address : t.summary}
      </h2>
      {step < 3 ? <p className="hint">{t.requiredMark}</p> : null}

      <div hidden={step !== 1}>
        <TextInput id="initials" name="initials" label={t.initials} required error={errors.initials} />
        <TextInput id="first-name" name="firstName" label={t.firstName} required autoComplete="given-name" error={errors["first-name"]} />
        <TextInput id="infix" name="infix" label={t.infix} autoComplete="additional-name" />
        <TextInput id="last-name" name="lastName" label={t.lastName} required autoComplete="family-name" error={errors["last-name"]} />
        <DateSelects
          id="date-of-birth"
          legend={t.birth}
          dayName="birthDay"
          monthName="birthMonth"
          yearName="birthYear"
          locale={locale}
          order="dmy"
          required
          error={errors["date-of-birth-day"]}
        />
        <Choice
          name="gender"
          legend={t.gender}
          inline
          options={[
            { value: "Man", label: t.male },
            { value: "Vrouw", label: t.female },
            { value: "X", label: t.other },
          ]}
        />
      </div>

      <div hidden={step !== 2}>
        <div className="pair">
          <TextInput id="street" name="street" label={t.street} required autoComplete="street-address" error={errors.street} />
          <TextInput id="housenumber" name="housenumber" label={t.house} required autoComplete="off" error={errors.housenumber} />
        </div>
        <TextInput id="zip-code" name="postcode" label={t.postcode} required autoComplete="postal-code" hint={t.postcodeHint} error={errors["zip-code"]} />
        <TextInput id="city" name="city" label={t.city} required autoComplete="address-level2" error={errors.city} />
        <TextInput id="phone-mobile" name="mobile" label={t.mobile} type="tel" required autoComplete="tel" error={errors["phone-mobile"]} />
        <TextInput id="phone-local" name="phone" label={t.phone} type="tel" autoComplete="tel" hint={t.phoneHint} />
        <TextInput id="email" name="email" label={t.emailLocker} type="email" required autoComplete="email" hint={t.emailHint} error={errors.email} />
      </div>

      {step === 3 ? (
        <div className="summary">
          <div>
            <h3>
              {t.personal}
              <button type="button" className="button-quiet" onClick={() => show(1)}>
                {t.edit}
              </button>
            </h3>
            <dl>
              <dt>{t.lastName}</dt>
              <dd>{values.lastName || "–"}</dd>
              <dt>{t.infix}</dt>
              <dd>{values.infix || "–"}</dd>
              <dt>{t.initials}</dt>
              <dd>{values.initials || "–"}</dd>
              <dt>{t.firstName}</dt>
              <dd>{values.firstName || "–"}</dd>
              <dt>{t.birth}</dt>
              <dd>{birth}</dd>
              <dt>{t.gender}</dt>
              <dd>{genderLabel}</dd>
            </dl>
          </div>
          <div>
            <h3>
              {t.address}
              <button type="button" className="button-quiet" onClick={() => show(2)}>
                {t.edit}
              </button>
            </h3>
            <dl>
              <dt>
                {t.street} / {t.house}
              </dt>
              <dd>
                {values.street} {values.housenumber}
              </dd>
              <dt>{t.addition}</dt>
              <dd>–</dd>
              <dt>{t.postcode}</dt>
              <dd>{values.postcode || "–"}</dd>
              <dt>{t.city}</dt>
              <dd>{values.city || "–"}</dd>
              <dt>{t.phone}</dt>
              <dd>{values.phone || "–"}</dd>
              <dt>{t.mobile}</dt>
              <dd>{values.mobile || "–"}</dd>
              <dt>{t.emailLocker}</dt>
              <dd>{values.email || "–"}</dd>
            </dl>
          </div>
          <fieldset>
            <legend>{t.consentTitle}</legend>
            <p>
              {t.consentBefore}
              <a href={hrefFor(locale, "privacy")}>{t.privacy}</a>
              {t.consentAfter}
            </p>
            <label>
              <input id="agreement-yes" type="checkbox" name="agreement" value="Ja" aria-invalid={Boolean(errors.agreement)} />
              {t.agree}
              <Star />
            </label>
            <ErrorText id="agreement-error" message={errors.agreement} />
          </fieldset>
        </div>
      ) : null}

      <div className="form-actions">
        {step > 1 ? (
          <button
            type="button"
            className="button-quiet"
            onClick={(event) => {
              const form = event.currentTarget.form;
              if (form) setValues(read(form));
              show(step - 1);
            }}
          >
            {t.back}
          </button>
        ) : null}
        <button type="submit">{step === 3 ? t.sendLocker : t.next}</button>
      </div>
      {status === "failed" ? <p role="status">{enabled ? ui.formFailed : t.unavailable}</p> : null}
    </form>
  );
}
