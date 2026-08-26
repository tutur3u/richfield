"use server";

import { contactSchemaFor, type ContactFormErrors } from "./schema";
import { site } from "@/content/en/site";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/locale";
import {
  getOptionalRichfieldWorkspaceId,
  getRichfieldApiBaseUrl,
  getRichfieldAppId,
  getRichfieldAppSecret,
} from "@/lib/richfield-config";
import { fetchWithRichfieldTimeout } from "@/lib/richfield-fetch";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import { sendRichfieldEmail } from "@/lib/richfield-response-forwarding";
import { buildRichfieldContactEmail } from "@/lib/richfield-contact-email";
import { resolveContactRecipients } from "@/lib/richfield-contact-recipients";

export type ContactState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; errors: Record<string, string[]>; values: Record<string, string> };

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const locale: Locale =
    typeof raw.locale === "string" && isLocale(raw.locale) ? raw.locale : DEFAULT_LOCALE;
  const t = await getTranslations({ locale, namespace: "contactForm" });
  const te = await getTranslations({ locale, namespace: "contactForm.errors" });
  const errorMessages: ContactFormErrors = {
    nameRequired: te("nameRequired"),
    companyRequired: te("companyRequired"),
    emailInvalid: te("emailInvalid"),
    inquiryTypeInvalid: te("inquiryTypeInvalid"),
    messageRequired: te("messageRequired"),
    messageTooLong: te("messageTooLong", { max: 5_000 }),
    tooFast: te("tooFast"),
  };

  const parsed = contactSchemaFor(errorMessages).safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values: Object.fromEntries(
        Object.entries(raw).filter(
          ([k]) => k !== "website" && k !== "submittedAtMs" && k !== "locale",
        ),
      ) as Record<string, string>,
    };
  }

  const { name, company, country, email, inquiryType, message } = parsed.data;
  const contactForm = await getRichfieldContent(locale)
    .then((content) => content.contactForm)
    .catch(() => null);
  const allowedInquiryTypes = contactForm?.inquiryTypes ?? [];
  const maxMessageLength = contactForm?.maxMessageLength ?? 1_200;

  if (
    (allowedInquiryTypes.length > 0 && !allowedInquiryTypes.includes(inquiryType)) ||
    message.length > maxMessageLength
  ) {
    return {
      status: "error",
      errors: {
        ...(allowedInquiryTypes.length === 0 || allowedInquiryTypes.includes(inquiryType)
          ? {}
          : { inquiryType: [te("inquiryTypeInvalid")] }),
        ...(message.length <= maxMessageLength
          ? {}
          : { message: [te("messageTooLong", { max: maxMessageLength })] }),
      },
      values: parsed.data as unknown as Record<string, string>,
    };
  }

  const inboxes = resolveContactRecipients(
    process.env.RICHFIELD_LEAD_INBOX,
    contactForm?.recipientEmails,
    contactForm?.recipientEmail,
  );

  let savedSubmissionId: string | null = null;
  let persistenceFailed = false;

  try {
    savedSubmissionId = await saveContactSubmission({
      company,
      country,
      email,
      inquiryType,
      message,
      name,
      turnstileToken:
        typeof raw["cf-turnstile-response"] === "string"
          ? raw["cf-turnstile-response"]
          : undefined,
    });
  } catch (error) {
    persistenceFailed = true;
    console.warn("[contact] failed to persist lead before delivery", error);
  }

  try {
    await deliverLead({
      company,
      country,
      email,
      entryId: savedSubmissionId,
      inboxes,
      inquiryType,
      message,
      name,
    });
    if (savedSubmissionId) {
      await updateContactSubmissionEmailStatus(savedSubmissionId, "sent");
    }
  } catch (error) {
    if (savedSubmissionId) {
      await updateContactSubmissionEmailStatus(savedSubmissionId, "failed");
    }

    if (persistenceFailed) {
      console.error("[contact] failed to persist and deliver lead", error);
      return {
        status: "error",
        errors: {
          _form: [t("errors.deliveryFailed", { email: site.email })],
        },
        values: parsed.data as unknown as Record<string, string>,
      };
    }
  }

  return { status: "ok" };
}

function getSubmissionEndpoint(path = "") {
  const workspaceId = getOptionalRichfieldWorkspaceId();

  if (!workspaceId) {
    throw new Error("Missing Richfield workspace id");
  }

  return `${getRichfieldApiBaseUrl().replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
    workspaceId,
  )}/external-projects/submissions${path}`;
}

async function saveContactSubmission(input: {
  company: string;
  country: string;
  email: string;
  inquiryType: string;
  message: string;
  name: string;
  turnstileToken?: string;
}) {
  const { turnstileToken, ...submission } = input;
  const response = await fetchWithRichfieldTimeout(getSubmissionEndpoint(), {
    body: JSON.stringify({
      ...submission,
      appId: getRichfieldAppId(),
      appSecret: getRichfieldAppSecret(),
      formSlug: "contact",
      formVersion: 1,
      receivedAt: new Date().toISOString(),
      // Verified centrally by Tuturuuu, which holds the secret; this site only
      // relays the visitor's challenge result.
      ...(turnstileToken ? { turnstileToken } : {}),
    }),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Submission save failed with status ${response.status}`);
  }

  const payload = (await response.json().catch(() => null)) as {
    entry?: { id?: unknown };
  } | null;

  return typeof payload?.entry?.id === "string" ? payload.entry.id : null;
}

async function updateContactSubmissionEmailStatus(
  entryId: string,
  emailNotificationStatus: "failed" | "sent",
) {
  await fetchWithRichfieldTimeout(getSubmissionEndpoint(`/${encodeURIComponent(entryId)}`), {
    body: JSON.stringify({
      appId: getRichfieldAppId(),
      appSecret: getRichfieldAppSecret(),
      emailNotificationStatus,
    }),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
  }).catch(() => null);
}

async function deliverLead(input: {
  name: string;
  company: string;
  country: string;
  email: string;
  inquiryType: string;
  message: string;
  inboxes: string[];
  entryId?: string | null;
}) {
  const content = buildRichfieldContactEmail({
    company: input.company,
    country: input.country,
    email: input.email,
    entryId: input.entryId,
    inquiryType: input.inquiryType,
    message: input.message,
    name: input.name,
    receivedAt: new Date().toISOString(),
  });

  // Sent through Tuturuuu's SES-backed mailer with the app credentials this
  // site already holds, so there is no third-party mail key here to rotate or
  // leak, and the send is rate limited, audited, and metered centrally.
  await sendRichfieldEmail({
    body: content.text,
    entityId: input.entryId ?? undefined,
    html: content.html,
    replyTo: input.email,
    subject: content.subject,
    to: input.inboxes,
  });
}
