import { z } from "zod";

export const INQUIRY_TYPES = [
  "Brand partnership",
  "Distribution opportunity",
  "Careers",
  "Press",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  company: z.string().trim().min(1, "Please enter your company."),
  country: z.string().trim().optional().default("Vietnam"),
  email: z.string().trim().email("Please enter a valid email."),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z
    .string()
    .trim()
    .min(1, "Please add a message.")
    .max(600, "Please keep your message under 600 characters."),
  // Honeypot: must be empty.
  website: z
    .string()
    .max(0, "Detected automated submission.")
    .optional()
    .default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
