"use client";

import { useActionState, useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import { CTA_BOX } from "@/app/_components/magazine/primitives/cta-link";
import { TurnstileWidget } from "@/app/_components/forms/turnstile-widget";
import type { RichfieldContactForm } from "@/lib/richfield-content";
import { RichfieldProse } from "@/app/_components/content/richfield-prose";
import { CheckCircle, ShieldCheck } from "@phosphor-icons/react";

const initial: ContactState = { status: "idle" };

export function ContactForm({ config }: { config: RichfieldContactForm }) {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const formId = useId();
  const locale = useLocale();
  const t = useTranslations("contactForm");

  if (state.status === "ok") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-green/25 bg-green/5 p-6 sm:p-8"
      >
        <CheckCircle aria-hidden className="mb-4 text-green" size={30} weight="fill" />
        <div className="font-display text-[clamp(24px,2.5vw,32px)] leading-tight text-ink">
          <RichfieldProse
            compact
            content={config.successMessage}
            structuredContent={config.successMessageContent}
          />
        </div>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};

  return (
    <form action={formAction} id={formId} className="flex flex-col gap-7" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot. Visually hidden but tab-skipped. */}
      <label className="sr-only" aria-hidden="true">
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {errors._form ? (
        <p
          role="alert"
          className="rounded-lg border border-gold/35 bg-gold/8 px-4 py-3 text-[14px] leading-6 text-ink"
        >
          {errors._form.join(" ")}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <p className="text-sm leading-6 text-ink-soft">{t("intro")}</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">{t("requiredNote")}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} name="name" placeholder={t("placeholders.name")} required defaultValue={values.name} errors={errors.name} autoComplete="name" />
        <Field label={t("company")} name="company" placeholder={t("placeholders.company")} required defaultValue={values.company} errors={errors.company} autoComplete="organization" />
        <Field label={t("country")} name="country" placeholder={t("placeholders.country")} defaultValue={values.country ?? "Vietnam"} errors={errors.country} autoComplete="country-name" />
        <Field label={t("email")} name="email" placeholder={t("placeholders.email")} type="email" required defaultValue={values.email} errors={errors.email} autoComplete="email" />
      </div>

      <FieldShell label={t("inquiryType")} name="inquiryType" errors={errors.inquiryType}>
        <select
          id="inquiryType"
          name="inquiryType"
          defaultValue={values.inquiryType ?? config.inquiryTypes[0]}
          aria-describedby={errors.inquiryType?.length ? "inquiryType-error" : undefined}
          aria-invalid={errors.inquiryType?.length ? true : undefined}
          className="min-h-12 w-full rounded-lg border border-line bg-cream/35 px-4 py-3 text-[16px] text-ink outline-none transition focus:border-gold focus:ring-3 focus:ring-gold/12"
        >
          {config.inquiryTypes.map((inquiryType) => (
            <option key={inquiryType} value={inquiryType}>
              {inquiryType}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell label={t("message")} name="message" errors={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={config.maxMessageLength}
          required
          defaultValue={values.message ?? ""}
          placeholder={t("placeholders.message")}
          aria-describedby={errors.message?.length ? "message-error" : "message-hint"}
          aria-invalid={errors.message?.length ? true : undefined}
          className="w-full resize-y rounded-lg border border-line bg-cream/35 px-4 py-3 text-[16px] leading-7 text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-gold focus:ring-3 focus:ring-gold/12"
        />
        <span className="text-xs leading-5 text-ink-soft" id="message-hint">
          {t("messageHint", { max: config.maxMessageLength })}
        </span>
      </FieldShell>

      <div className="-mx-4 grid min-w-0 gap-3 rounded-xl border border-line bg-cream/30 p-3 sm:mx-0 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-green/10 text-green">
            <ShieldCheck aria-hidden size={19} weight="bold" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">{t("verificationTitle")}</p>
            <p className="mt-0.5 text-xs leading-5 text-ink-soft">{t("verificationHint")}</p>
          </div>
        </div>
        <TurnstileWidget className="min-w-0 w-full" siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className={`${CTA_BOX} w-full justify-center sm:w-auto sm:self-start disabled:cursor-wait disabled:opacity-60`}
      >
        {pending ? t("sending") : config.submitLabel}
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
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  errors?: string[];
  autoComplete?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        aria-describedby={errors?.length ? `${name}-error` : undefined}
        aria-invalid={errors?.length ? true : undefined}
        className="min-h-12 w-full rounded-lg border border-line bg-cream/35 px-4 py-3 text-[16px] text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-gold focus:ring-3 focus:ring-gold/12"
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
      <span className="text-[11px] uppercase tracking-[0.32em] text-ink-soft">
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
