const RICHFIELD_ADMIN_ORIGIN = "https://richfieldgroup.com.vn";

export type RichfieldContactEmailInput = {
  company: string;
  country: string;
  email: string;
  entryId?: string | null;
  inquiryType: string;
  message: string;
  name: string;
  receivedAt?: string | null;
};

export type RichfieldContactEmail = {
  html: string;
  subject: string;
  text: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function subjectText(value: string, fallback: string) {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim() || fallback;
}

function displayReceivedAt(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return `${new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date)} (GMT+7)`;
}

function detailRow(label: string, value: string, href?: string) {
  const content = href
    ? `<a href="${escapeHtml(href)}" style="color:#965637;text-decoration:underline;text-decoration-color:#d9a75b;text-underline-offset:3px">${escapeHtml(value)}</a>`
    : escapeHtml(value);

  return `<tr>
    <td class="detail-label" style="width:132px;padding:10px 16px 10px 0;border-bottom:1px solid #eee3d2;color:#786f63;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #eee3d2;color:#241f1a;font-size:15px;line-height:1.55;vertical-align:top">${content}</td>
  </tr>`;
}

/**
 * A self-contained, email-client-safe contact notification.
 *
 * The layout uses tables and inline styles for broad client support, with a
 * small media query for narrow screens and clients that honour dark mode. All
 * visitor-controlled values are escaped before entering markup.
 */
export function buildRichfieldContactEmail(
  input: RichfieldContactEmailInput,
): RichfieldContactEmail {
  const name = subjectText(input.name, "Unknown sender");
  const company = subjectText(input.company, "Unknown company");
  const inquiryType = subjectText(input.inquiryType, "General enquiry");
  const country = input.country.trim() || "—";
  const senderEmail = input.email.trim() || "—";
  const message = input.message.trim() || "(no message)";
  const receivedAt = displayReceivedAt(input.receivedAt);
  const responseUrl = input.entryId
    ? `${RICHFIELD_ADMIN_ORIGIN}/admin/responses/${encodeURIComponent(input.entryId)}`
    : null;
  const subject = `[Richfield enquiry] ${inquiryType} · ${company}`;
  const text = [
    "NEW RICHFIELD ENQUIRY",
    "",
    `Name: ${name}`,
    `Company: ${company}`,
    `Country: ${country}`,
    `Email: ${senderEmail}`,
    `Inquiry type: ${inquiryType}`,
    ...(receivedAt ? [`Received: ${receivedAt}`] : []),
    "",
    "MESSAGE",
    message,
    ...(responseUrl ? ["", `Open response: ${responseUrl}`] : []),
    "",
    `Reply to this email to write directly to ${name}.`,
  ].join("\n");

  const details = [
    detailRow("Name", name),
    detailRow("Company", company),
    detailRow("Country", country),
    detailRow("Email", senderEmail, senderEmail === "—" ? undefined : `mailto:${senderEmail}`),
    detailRow("Inquiry", inquiryType),
    ...(receivedAt ? [detailRow("Received", receivedAt)] : []),
  ].join("");
  const action = responseUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 0"><tr><td style="border-radius:6px;background:#0c1f34"><a href="${escapeHtml(responseUrl)}" style="display:inline-block;padding:14px 22px;color:#fffdf8;font-size:14px;font-weight:700;letter-spacing:.02em;text-decoration:none">Open response in Richfield&nbsp;&nbsp;→</a></td></tr></table>`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    @media only screen and (max-width:620px){.email-shell{padding:16px!important}.email-card{border-radius:12px!important}.email-header,.email-content,.email-footer{padding-left:22px!important;padding-right:22px!important}.detail-label{display:block!important;width:auto!important;padding:12px 0 2px!important;border-bottom:0!important}.detail-label+td{display:block!important;padding:0 0 12px!important}.message-card{padding:18px!important}}
    @media (prefers-color-scheme:dark){body,.email-shell{background:#101820!important}.email-card,.email-content{background:#18222c!important}.email-content h1,.email-content td,.message-card{color:#f6efe1!important}.email-content p,.email-footer,.detail-label{color:#c4bbad!important}.email-content td{border-color:#34414d!important}.message-card{background:#111a23!important;border-color:#3e4b57!important}}
  </style>
</head>
<body style="margin:0;padding:0;background:#f3eee5;color:#241f1a;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">New ${escapeHtml(inquiryType)} enquiry from ${escapeHtml(company)}.</div>
  <table class="email-shell" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f3eee5;padding:36px 16px">
    <tr><td align="center">
      <table class="email-card" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;overflow:hidden;border:1px solid #e4d8c5;border-radius:16px;background:#fffdf8;box-shadow:0 16px 44px rgba(36,31,26,.08)">
        <tr><td class="email-header" style="padding:24px 34px;background:#0c1f34;border-top:4px solid #d9a75b">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
            <td style="color:#fffdf8;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;letter-spacing:-.01em">Richfield</td>
            <td align="right"><span style="display:inline-block;border:1px solid rgba(217,167,91,.55);border-radius:999px;padding:6px 10px;color:#e8be79;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">New enquiry</span></td>
          </tr></table>
        </td></tr>
        <tr><td class="email-content" style="padding:34px;background:#fffdf8">
          <p style="margin:0 0 8px;color:#965637;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase">${escapeHtml(inquiryType)}</p>
          <h1 style="margin:0;color:#241f1a;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.18;letter-spacing:-.02em">A new conversation is ready.</h1>
          <p style="margin:12px 0 26px;color:#6f6557;font-size:15px;line-height:1.65">${escapeHtml(name)} from ${escapeHtml(company)} reached out through the Richfield website.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse">${details}</table>
          <div class="message-card" style="margin-top:26px;padding:22px;border:1px solid #e4d8c5;border-left:4px solid #d9a75b;border-radius:8px;background:#f8f3e9;color:#241f1a">
            <p style="margin:0 0 10px;color:#965637;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Message</p>
            <p style="margin:0;font-size:16px;line-height:1.72;white-space:pre-wrap;word-break:break-word">${escapeHtml(message)}</p>
          </div>
          ${action}
          <p style="margin:24px 0 0;color:#6f6557;font-size:13px;line-height:1.6">Reply directly to this email to write back to ${escapeHtml(name)}.</p>
        </td></tr>
        <tr><td class="email-footer" style="padding:20px 34px;border-top:1px solid #e4d8c5;background:#f8f3e9;color:#786f63;font-size:11px;line-height:1.6">Sent securely from the Richfield contact form · richfieldgroup.com.vn</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { html, subject, text };
}
