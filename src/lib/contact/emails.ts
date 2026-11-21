import projectConfig from "../../../project.config";
import { esc, layout } from "@/lib/booking/emails";

/**
 * Contact form emails, following the Figma email template (Portfolio Website Design,
 * node 4030-19): logo, white card with a greeting, a "Client information" list, the
 * message and a sign-off, then the shared footer. Styled in the vinod.lk palette.
 */
const site = projectConfig.baseUrl.replace(/\/$/, "");
const font =
  "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
const C = {
  text: "#0a0b0f",
  body: "#4a5263",
  muted: "#8a93a3",
  blue: "#157ff8",
};

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  page?: string;
};

const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");
const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there";
const link = (href: string, label: string) =>
  `<a href="${esc(href)}" style="color:${C.blue};text-decoration:none">${label}</a>`;

/* Building blocks matching the template's type scale (15px body, 24px line height). */
const para = (html: string, extra = "") =>
  `<p style="margin:0 0 14px;font:400 15px/24px ${font};color:${C.text};${extra}">${html}</p>`;
const label = (text: string) =>
  `<p style="margin:22px 0 8px;font:500 15px/24px ${font};color:${C.text}">${esc(text)}</p>`;
const bullets = (rows: [string, string][]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 6px">${rows
    .map(
      ([k, v]) =>
        `<tr><td valign="top" style="width:18px;padding:0 0 2px 8px;font:400 15px/24px ${font};color:${C.blue}">&#8226;</td><td style="padding:0 0 2px;font:400 15px/24px ${font};color:${C.text}">${esc(k)}: ${v}</td></tr>`,
    )
    .join("")}</table>`;
const signOff = (name: string) =>
  `<p style="margin:24px 0 2px;font:400 15px/24px ${font};color:${C.text}">Best regards,</p>
   <p style="margin:0;font:600 18px/26px 'IBM Plex Sans',${font};color:${C.text}">${esc(name)}</p>`;

/** To info@vinod.lk. Replying goes straight to the visitor. */
export function adminEnquiryEmail(e: Enquiry) {
  const rows: [string, string][] = [
    ["Full name", esc(e.name)],
    ["Email address", link(`mailto:${e.email}`, esc(e.email))],
  ];
  if (e.phone) {
    const digits = e.phone.replace(/[^\d]/g, "");
    const wa = digits.startsWith("0") ? `94${digits.slice(1)}` : digits;
    rows.push([
      "Phone number",
      `${esc(e.phone)}${digits.length >= 9 ? ` &nbsp;(${link(`https://wa.me/${wa}`, "WhatsApp")})` : ""}`,
    ]);
  }
  if (e.service) rows.push(["Service", esc(e.service)]);
  if (e.budget) rows.push(["Budget", esc(e.budget)]);

  const html = layout(
    `New enquiry from ${e.name}${e.message ? `: ${e.message.slice(0, 90)}` : ""}`,
    `${para("Hi Vinod,")}
    ${para("A new contact form has been submitted on vinod.lk. Below are the details provided by the client.")}
    ${label("Client information")}
    ${bullets(rows)}
    ${e.message ? `${label("Message:")}${para(nl2br(e.message))}` : ""}
    ${para(`Reply to this email to answer ${esc(firstName(e.name))} directly.`, `color:${C.body}`)}
    ${e.page ? para(`Sent from ${link(e.page, esc(e.page.replace(/^https?:\/\//, "")))}`, `margin:0;font-size:13px;color:${C.muted}`) : ""}
    ${signOff("The Vinod.lk Website")}`,
  );

  const lines = [
    "Hi Vinod,",
    "",
    "A new contact form has been submitted on vinod.lk.",
    "",
    `Full name: ${e.name}`,
    `Email address: ${e.email}`,
  ];
  if (e.phone) lines.push(`Phone number: ${e.phone}`);
  if (e.service) lines.push(`Service: ${e.service}`);
  if (e.budget) lines.push(`Budget: ${e.budget}`);
  if (e.message) lines.push("", "Message:", e.message);
  return {
    subject: `New enquiry: ${e.service || "Website"} from ${e.name}`,
    html,
    text: lines.join("\n"),
  };
}

/** To the visitor: confirms the message arrived and what happens next. */
export function visitorConfirmationEmail(e: Enquiry) {
  const rows: [string, string][] = [];
  if (e.service) rows.push(["Service", esc(e.service)]);
  if (e.budget) rows.push(["Budget", esc(e.budget)]);
  if (e.phone) rows.push(["Phone number", esc(e.phone)]);
  const message =
    e.message.length > 800 ? `${e.message.slice(0, 800)}…` : e.message;

  const html = layout(
    "Thanks, your message is with me. I'll reply within one working day.",
    `${para(`Hi ${esc(firstName(e.name))},`)}
    ${para(`Thanks for getting in touch. Your message has reached me, and I'll reply within one working day, usually sooner.${rows.length || message ? " Below is a copy of what you sent." : ""}`)}
    ${rows.length ? `${label("Your details")}${bullets(rows)}` : ""}
    ${message ? `${label("Message:")}${para(nl2br(message), `color:${C.body}`)}` : ""}
    ${para(`Need a quicker answer? ${link("https://wa.me/94775037738", "Message me on WhatsApp")}. In the meantime, take a look at some ${link(`${site}/work`, "recent projects")}.`)}
    ${signOff("Vinod Deshapriya")}
    <p style="margin:0;font:400 13px/20px ${font};color:${C.muted}">UX Engineer, Vinod.lk</p>`,
  );

  const text = `Hi ${firstName(e.name)},

Thanks for getting in touch. Your message has reached me, and I'll reply within one working day, usually sooner.

${message ? `Your message:\n${message}\n\n` : ""}Need a quicker answer? WhatsApp: https://wa.me/94775037738

Best regards,
Vinod Deshapriya
${site}`;
  return { subject: "Thanks for getting in touch, Vinod.lk", html, text };
}
