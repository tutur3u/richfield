// "What Employees Say" — verbatim quotes from the final content doc.
export type Testimonial = {
  quote: string;
  author: string;
  tenure: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I advanced from sales rep to supervisor to regional leader. The environment, the colleagues, the support from leadership — it made this possible.",
    author: "Nguyễn Khắc Trí Trung",
    tenure: "10 years",
    role: "Area Sales Manager HCM, Mars category",
  },
  {
    quote:
      "During COVID, leadership stayed calm and kept every commitment to employees. That kind of stability — and that kind of trust — is rare.",
    author: "Nguyễn Thị Thanh Huyền",
    tenure: "7+ years",
    role: "Delivery Department",
  },
];
