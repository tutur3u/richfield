"use client";

import { ArrowClockwise } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  RichfieldAdminEditorDraft,
  RichfieldEditorStepId,
} from "./richfield-admin-editor-state";

type Draft = RichfieldAdminEditorDraft;

/**
 * Editor field primitives.
 *
 * These carried literal `bg-white` with `text-[var(--ink)]` on top. The theme
 * remaps --ink to near-white in dark mode, but nothing remapped the background,
 * so every input in the editor rendered as white text on a white box — the text
 * was still there, and completely unreadable. The panel-level override did not
 * catch it because it matches `bg-white/<alpha>`, not bare `bg-white`.
 *
 * Theme tokens throughout now, so the fields follow light and dark instead of
 * assuming parchment.
 */
const FIELD_LABEL =
  "text-xs font-bold uppercase tracking-[0.14em] text-gold-strong";

const FIELD_BASE =
  "w-full min-w-0 border bg-paper px-3 text-sm text-ink outline-none transition " +
  "placeholder:text-admin-ink-soft/70 focus:border-gold " +
  "disabled:cursor-not-allowed disabled:bg-cream disabled:text-admin-ink-soft";

const FIELD_INPUT = `min-h-11 ${FIELD_BASE}`;

export function EditorStepHeader({ step }: { step: RichfieldEditorStepId }) {
  const t = useTranslations("admin.form.steps");

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-gold-strong">
        {t(`${step}.label`)}
      </p>
      <p className="mt-2 text-sm leading-6 text-admin-ink-soft">
        {t(`${step}.description`)}
      </p>
    </div>
  );
}

export function TextField<TName extends keyof Draft>({
  disabled,
  error,
  label,
  name,
  onChange,
  placeholder,
  required,
  value,
}: {
  disabled?: boolean;
  error?: string;
  label: string;
  name: TName;
  onChange: (name: TName, value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className={FIELD_LABEL}>{label}</span>
      <input
        className={`${FIELD_INPUT} ${error ? "border-red-500" : "border-line"}`}
        disabled={disabled}
        name={name}
        onChange={(event) => onChange(name, event.currentTarget.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
      {error ? (
        <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
      ) : null}
    </label>
  );
}

export function PageLinkField<TName extends keyof Draft>({
  disabled,
  label,
  matchTitleLabel,
  name,
  onChange,
  onMatchTitle,
  prefix,
  showMatchTitle,
  value,
}: {
  disabled?: boolean;
  label: string;
  matchTitleLabel: string;
  name: TName;
  onChange: (name: TName, value: string) => void;
  onMatchTitle: () => void;
  prefix: string;
  showMatchTitle: boolean;
  value: string;
}) {
  const inputId = useId();

  return (
    <div className="grid min-w-0 gap-2">
      <label className={FIELD_LABEL} htmlFor={inputId}>
        {label}
      </label>
      <div className="flex min-w-0 items-stretch overflow-hidden rounded-lg border border-line bg-paper transition focus-within:border-gold focus-within:ring-3 focus-within:ring-gold/15">
        <span className="flex shrink-0 items-center border-r border-line bg-cream px-2.5 font-mono text-xs text-admin-ink-soft">
          {prefix}
        </span>
        <input
          autoCapitalize="none"
          autoComplete="off"
          className="h-11 min-w-0 flex-1 bg-transparent px-2.5 font-mono text-sm text-ink outline-none placeholder:text-admin-ink-soft/70 disabled:cursor-not-allowed disabled:text-admin-ink-soft"
          disabled={disabled}
          id={inputId}
          inputMode="url"
          name={name}
          onChange={(event) => onChange(name, event.currentTarget.value)}
          spellCheck={false}
          value={value}
        />
        {showMatchTitle ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                aria-label={matchTitleLabel}
                render={
                  <Button
                    className="m-1 self-center text-admin-ink-soft hover:text-admin-ink"
                    disabled={disabled}
                    onClick={onMatchTitle}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  />
                }
              >
                <ArrowClockwise aria-hidden />
              </TooltipTrigger>
              <TooltipContent>{matchTitleLabel}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
    </div>
  );
}

export function NumberField<TName extends keyof Draft>({
  disabled,
  label,
  name,
  onChange,
  placeholder,
  value,
}: {
  disabled?: boolean;
  label: string;
  name: TName;
  onChange: (name: TName, value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className={FIELD_LABEL}>{label}</span>
      <input
        className={`${FIELD_INPUT} border-line`}
        disabled={disabled}
        inputMode="numeric"
        name={name}
        onChange={(event) =>
          onChange(name, event.currentTarget.value.replace(/[^\d]/g, ""))
        }
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </label>
  );
}

export function SelectField<TName extends keyof Draft>({
  disabled,
  error,
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
}: {
  disabled?: boolean;
  error?: string;
  label: string;
  name: TName;
  onChange: (name: TName, value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  value: string;
}) {
  const t = useTranslations("admin.form");
  const hasCurrentValue =
    value.trim() && !options.some((option) => option.value === value);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ??
    (hasCurrentValue ? value : undefined);

  return (
    <div className="grid min-w-0 gap-2">
      <span className={FIELD_LABEL}>{label}</span>
      <Select
        disabled={disabled}
        onValueChange={(nextValue) => onChange(name, String(nextValue))}
        value={value}
      >
        <SelectTrigger
          aria-invalid={Boolean(error)}
          aria-label={label}
          className="h-11 w-full rounded-lg border-line bg-paper px-3 text-ink shadow-none focus-visible:border-gold dark:bg-paper"
        >
          <SelectValue placeholder={placeholder ?? t("chooseOne")}>
            {selectedLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          className="border border-line bg-paper text-ink"
        >
          <SelectGroup>
            {hasCurrentValue ? <SelectItem value={value}>{value}</SelectItem> : null}
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error ? (
        <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
      ) : null}
    </div>
  );
}

export function TextAreaField<TName extends keyof Draft>({
  disabled,
  label,
  name,
  onChange,
  placeholder,
  rows = 4,
  value,
}: {
  disabled?: boolean;
  label: string;
  name: TName;
  onChange: (name: TName, value: string) => void;
  placeholder?: string;
  rows?: number;
  value: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className={FIELD_LABEL}>{label}</span>
      <textarea
        className={`min-h-28 resize-y border-line py-3 leading-6 ${FIELD_BASE}`}
        disabled={disabled}
        name={name}
        onChange={(event) => onChange(name, event.currentTarget.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    </label>
  );
}

export function CheckboxField<TName extends keyof Draft>({
  description,
  disabled,
  label,
  name,
  onChange,
  value,
}: {
  description: string;
  disabled?: boolean;
  label: string;
  name: TName;
  onChange: (name: TName, value: boolean) => void;
  value: boolean;
}) {
  return (
    <label className="flex items-start gap-3 border border-line bg-paper px-3 py-3 text-sm text-ink">
      <input
        checked={value}
        className="mt-0.5 size-4 accent-gold-strong"
        disabled={disabled}
        name={name}
        onChange={(event) => onChange(name, event.currentTarget.checked)}
        type="checkbox"
      />
      <span className="grid gap-1">
        <span className={FIELD_LABEL}>{label}</span>
        <span className="text-xs leading-5 text-admin-ink-soft">{description}</span>
      </span>
    </label>
  );
}
