"use client";

import { useActionState, useId, useState } from "react";
import { submitContact, type ContactState } from "@/app/(site)/contact/actions";
import { INQUIRY_TYPES } from "@/app/(site)/contact/schema";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const formId = useId();
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
          Thanks. We'll write back from our partnerships team within two
          business days.
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};

  return (
    <form action={formAction} id={formId} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="submittedAtMs" value={submittedAtMs} />
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
        label="Name"
        name="name"
        required
        defaultValue={values.name}
        errors={errors.name}
        autoComplete="name"
      />
      <Field
        label="Company"
        name="company"
        required
        defaultValue={values.company}
        errors={errors.company}
        autoComplete="organization"
      />
      <Field
        label="Country"
        name="country"
        defaultValue={values.country ?? "Vietnam"}
        errors={errors.country}
        autoComplete="country-name"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={values.email}
        errors={errors.email}
        autoComplete="email"
      />

      <FieldShell label="Inquiry type" name="inquiryType" errors={errors.inquiryType}>
        <select
          name="inquiryType"
          defaultValue={values.inquiryType ?? INQUIRY_TYPES[0]}
          className="w-full border-b border-line bg-transparent py-3 text-[17px] focus:border-gold focus:outline-none"
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell label="Message" name="message" errors={errors.message}>
        <textarea
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
        className="self-start text-[11px] font-medium uppercase tracking-[0.32em] text-gold underline decoration-gold underline-offset-[6px] disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message →"}
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
