import { describe, it, expect } from "vitest";
import { contactSchema, INQUIRY_TYPES } from "@/app/[locale]/contact/schema";

describe("contactSchema", () => {
  it("rejects empty name", () => {
    const r = contactSchema.safeParse({
      name: "",
      company: "Acme",
      email: "x@example.com",
      inquiryType: "Brand partnership",
      message: "Hello",
      website: "",
    });
    expect(r.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const r = contactSchema.safeParse({
      name: "Asha",
      company: "Acme",
      email: "not-an-email",
      inquiryType: "Brand partnership",
      message: "Hello",
      website: "",
    });
    expect(r.success).toBe(false);
  });

  it("accepts a structurally valid inquiry for CMS allowlist validation", () => {
    const r = contactSchema.safeParse({
      name: "Asha",
      company: "Acme",
      email: "asha@example.com",
      inquiryType: "Retail leasing",
      message: "Hello",
      website: "",
    });
    expect(r.success).toBe(true);
  });

  it("rejects when honeypot 'website' field is filled", () => {
    const r = contactSchema.safeParse({
      name: "Asha",
      company: "Acme",
      email: "asha@example.com",
      inquiryType: "Brand partnership",
      message: "Hello",
      website: "http://spam.example",
    });
    expect(r.success).toBe(false);
  });

  it("accepts a valid payload", () => {
    const r = contactSchema.safeParse({
      name: "Asha",
      company: "Acme",
      country: "Vietnam",
      email: "asha@example.com",
      inquiryType: "Brand partnership",
      message: "We'd like to discuss distribution.",
      website: "",
    });
    expect(r.success).toBe(true);
  });

  it("exposes 5 inquiry types", () => {
    expect(INQUIRY_TYPES).toHaveLength(5);
  });
});
