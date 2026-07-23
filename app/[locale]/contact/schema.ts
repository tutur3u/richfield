import { z } from "zod";
import en from "@/messages/en.json";

export const INQUIRY_TYPES = [
  "Brand partnership",
  "Distribution opportunity",
  "Careers",
  "Press",
  "Other",
] as const;

// Shape of the contactForm.errors message group.
export type ContactFormErrors = {
  nameRequired: string;
  companyRequired: string;
  emailInvalid: string;
  inquiryTypeInvalid: string;
  messageRequired: string;
  messageTooLong: string;
  tooFast: string;
  deliveryFailed: string;
};

// Validation messages come from the locale's contactForm.errors. Inquiry
// values are managed by CMS and validated against that live allowlist in the
// server action after this structural validation.
export function contactSchemaFor(errors: ContactFormErrors) {
  return z.object({
    name: z.string().trim().min(1, errors.nameRequired),
    company: z.string().trim().min(1, errors.companyRequired),
    country: z.string().trim().optional().default("Vietnam"),
    email: z.string().trim().email(errors.emailInvalid),
    inquiryType: z.string().trim().min(1, errors.inquiryTypeInvalid).max(120),
    message: z
      .string()
      .trim()
      .min(1, errors.messageRequired)
      .max(5_000, errors.messageTooLong),
    // Honeypot: must be empty.
    website: z
      .string()
      .max(0, "Detected automated submission.")
      .optional()
      .default(""),
  });
}

export const contactSchema = contactSchemaFor(en.contactForm.errors);

export type ContactInput = z.infer<typeof contactSchema>;
