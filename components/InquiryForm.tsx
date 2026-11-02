"use client";

import { useState } from "react";
import type { Locale } from "@/lib/content";
import { business } from "@/lib/content";
import { dictionary } from "@/lib/ui";

type Errors = { name?: string; email?: string; message?: string };

export function InquiryForm({
  locale,
  enabled,
  topic,
}: {
  locale: Locale;
  enabled: boolean;
  topic: string;
}) {
  const t = dictionary(locale);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sent" | "failed">("idle");

  return (
    <form
      className="inquiry"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const name = String(data.get("name") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const phone = String(data.get("phone") ?? "").trim();
        const message = String(data.get("message") ?? "").trim();
        const next: Errors = {};
        if (!name) next.name = t.formRequired;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.formEmailInvalid;
        if (!message) next.message = t.formRequired;
        setErrors(next);
        if (Object.keys(next).length) {
          setStatus("idle");
          const first = next.name ? "inquiry-name" : next.email ? "inquiry-email" : "inquiry-message";
          document.getElementById(first)?.focus();
          return;
        }
        if (!enabled) {
          setStatus("failed");
          return;
        }
        const response = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ topic, name, email, phone, message, locale }),
        });
        if (response.ok) {
          setStatus("sent");
          form.reset();
        } else {
          setStatus("failed");
        }
      }}
    >
      <p>{enabled ? null : t.formUnavailable}</p>
      <p>
        <a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a>
        <br />
        <a href={`mailto:${business.email}`}>{business.email}</a>
      </p>
      <div>
        <label htmlFor="inquiry-name">{t.formName}</label>
        <input id="inquiry-name" name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "inquiry-name-error" : undefined} />
        {errors.name ? <p id="inquiry-name-error">{errors.name}</p> : null}
      </div>
      <div>
        <label htmlFor="inquiry-email">{t.formEmail}</label>
        <input id="inquiry-email" name="email" type="email" autoComplete="email" spellCheck={false} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "inquiry-email-error" : undefined} />
        {errors.email ? <p id="inquiry-email-error">{errors.email}</p> : null}
      </div>
      <div>
        <label htmlFor="inquiry-phone">{t.formPhone}</label>
        <input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="inquiry-message">{t.formMessage}</label>
        <textarea id="inquiry-message" name="message" rows={5} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "inquiry-message-error" : undefined} />
        {errors.message ? <p id="inquiry-message-error">{errors.message}</p> : null}
      </div>
      <button type="submit">{t.formSend}</button>
      {status === "sent" ? <p role="status" aria-live="polite">{t.formSent}</p> : null}
      {status === "failed" ? <p role="status" aria-live="polite">{enabled ? t.formFailed : t.formUnavailable}</p> : null}
    </form>
  );
}
