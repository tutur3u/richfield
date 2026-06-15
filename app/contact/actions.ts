"use server";

import { contactSchema } from "./schema";
import { site } from "@/content/en/site";

export type ContactState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; errors: Record<string, string[]>; values: Record<string, string> };

const FALLBACK_INBOX = "cskh@richfieldvn.com.vn";

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());

  // Anti-spam: 3-second submission delay (spec §6.4). Reject if the form
  // posts within 3s of mount, which catches automated fillers.
  const submittedAt = Number(raw.submittedAtMs);
  if (!Number.isFinite(submittedAt) || Date.now() - submittedAt < 3000) {
    return {
      status: "error",
      errors: { _form: ["Please give us a moment before submitting."] },
      values: Object.fromEntries(
        Object.entries(raw).filter(
          ([k]) => k !== "website" && k !== "submittedAtMs",
        ),
      ) as Record<string, string>,
    };
  }

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values: Object.fromEntries(
        Object.entries(raw).filter(
          ([k]) => k !== "website" && k !== "submittedAtMs",
        ),
      ) as Record<string, string>,
    };
  }

  const { name, company, country, email, inquiryType, message } = parsed.data;
  const inbox = process.env.RICHFIELD_LEAD_INBOX ?? FALLBACK_INBOX;

  try {
    await deliverLead({ name, company, country, email, inquiryType, message, inbox });
  } catch {
    return {
      status: "error",
      errors: {
        _form: [
          `We couldn't send your message. Try email at ${site.email}.`,
        ],
      },
      values: parsed.data as unknown as Record<string, string>,
    };
  }

  return { status: "ok" };
}

async function deliverLead(input: {
  name: string;
  company: string;
  country: string;
  email: string;
  inquiryType: string;
  message: string;
  inbox: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY missing; lead would be delivered:", input);
      return;
    }
    throw new Error("RESEND_API_KEY missing in production");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Richfield Site <noreply@${new URL(site.domainCanonical).hostname}>`,
      to: input.inbox,
      reply_to: input.email,
      subject: `[Richfield site] ${input.inquiryType} from ${input.company}`,
      text: [
        `Name: ${input.name}`,
        `Company: ${input.company}`,
        `Country: ${input.country}`,
        `Email: ${input.email}`,
        `Inquiry type: ${input.inquiryType}`,
        "",
        "Message:",
        input.message,
      ].join("\n"),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend API failed with status ${res.status}`);
  }
}
