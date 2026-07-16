"use client";

import { useActionState, useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import { INQUIRY_TYPES } from "@/app/[locale]/contact/schema";
import { CTA_BOX } from "@/app/_components/magazine/primitives/cta-link";
import type { Locale } from "@/lib/locale";

const initial: ContactState = { status: "idle" };

export function ContactForm(_props: { locale?: Locale }) {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const formId = useId();
  const locale = useLocale();
  const t = useTranslations("contactForm");
  const inquiryLabel = useTranslations("contactForm.inquiryTypeLabels");
  // Capture mount-time once. Posted as a hidden field; the action rejects
  // submissions faster than 3s as automated.
  const [submittedAtMs] = useState(() => String(Date.now()));

  if (state.status === "ok") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border-t border-line pt-10"
      >
        <p className="font-display text-[clamp(24px,2.5vw,32px)] text-ink">
          {t("success")}
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};

  return (
    <form action={formAction} id={formId} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="submittedAtMs" value={submittedAtMs} />
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot. Visually hidden but tab-skipped. */}
      <label className="sr-only" aria-hidden="true">
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {errors._form ? (
        <p
          role="alert"
          className="border-l-0 border-t border-gold pt-4 text-[15px] text-ink"
        >
          {errors._form.join(" ")}
        </p>
      ) : null}

      <Field
        label={t("name")}
        name="name"
        required
        defaultValue={values.name}
        errors={errors.name}
        autoComplete="name"
      />
      <Field
        label={t("company")}
        name="company"
        required
        defaultValue={values.company}
        errors={errors.company}
        autoComplete="organization"
      />
      <Field
        label={t("country")}
        name="country"
        defaultValue={values.country ?? "Vietnam"}
        errors={errors.country}
        autoComplete="country-name"
      />
      <Field
        label={t("email")}
        name="email"
        type="email"
        required
        defaultValue={values.email}
        errors={errors.email}
        autoComplete="email"
      />

      <FieldShell label={t("inquiryType")} name="inquiryType" errors={errors.inquiryType}>
        <select
          id="inquiryType"
          name="inquiryType"
          defaultValue={values.inquiryType ?? INQUIRY_TYPES[0]}
          className="w-full border-b border-line bg-transparent py-3 text-[17px] focus:border-gold focus:outline-none"
        >
          {INQUIRY_TYPES.map((value) => (
            <option key={value} value={value}>
              {inquiryLabel(value)}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell label={t("message")} name="message" errors={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={600}
          required
          defaultValue={values.message ?? ""}
          className="w-full border-b border-line bg-transparent py-3 text-[17px] focus:border-gold focus:outline-none"
        />
      </FieldShell>

      <button
        type="submit"
        disabled={pending}
        className={`${CTA_BOX} self-start disabled:opacity-50`}
      >
        {pending ? t("sending") : t("send")}
        <span
          aria-hidden
          className="transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1"
        >
          →
        </span>
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  errors,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  errors?: string[];
  autoComplete?: string;
}) {
  return (
    <FieldShell label={label} name={name} errors={errors} required={required}>
      <input
        id={name}
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="w-full border-b border-line bg-transparent py-3 text-[17px] focus:border-gold focus:outline-none"
      />
    </FieldShell>
  );
}

function FieldShell({
  label,
  name,
  required,
  errors,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  errors?: string[];
  children: React.ReactNode;
}) {
  const errorId = `${name}-error`;
  return (
    <label className="flex flex-col gap-2" htmlFor={name}>
      <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </span>
      {children}
      {errors?.length ? (
        <span id={errorId} role="alert" className="text-[14px] text-gold">
          {errors.join(" ")}
        </span>
      ) : null}
    </label>
  );
}
