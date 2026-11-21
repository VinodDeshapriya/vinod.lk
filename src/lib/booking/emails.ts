import projectConfig from "../../../project.config";
import { bookingConfig } from "./config";

/**
 * Booking emails, laid out like the Figma "Contact us_Admin email template"
 * (logo header, white message card, footer strip) in the vinod.lk palette.
 * Table-based with inline styles so it holds up in Gmail and Outlook.
 */
const site = projectConfig.baseUrl.replace(/\/$/, "");
const C = {
  bg: "#f4f5f7",
  card: "#ffffff",
  text: "#0a0b0f",
  body: "#4a5263",
  muted: "#8a93a3",
  line: "#dde2ea",
  blue: "#157ff8",
  soft: "#eef5ff",
};
const font =
  "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";

export const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

export const p = (html: string, extra = "") =>
  `<p style="margin:0 0 16px;font:400 16px/26px ${font};color:${C.body};${extra}">${html}</p>`;

export const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 20px"><tr><td style="border-radius:999px;background:${C.blue}">
  <a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font:600 15px/20px ${font};color:#ffffff;text-decoration:none;border-radius:999px">${esc(label)}</a>
  </td></tr></table>`;

/** A soft panel of label / value rows. */
export const details = (rows: [string, string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;background:${C.soft};border-radius:12px">
  ${rows
    .map(
      (
        [k, v],
        i,
      ) => `<tr><td style="padding:${i ? 0 : 18}px 20px ${i === rows.length - 1 ? 18 : 10}px;font:400 15px/22px ${font};color:${C.body}">
      <span style="display:block;font:600 11px/16px ${font};letter-spacing:1.4px;text-transform:uppercase;color:${C.muted}">${esc(k)}</span>
      <span style="color:${C.text}">${v}</span></td></tr>`,
    )
    .join("")}
  </table>`;

export function layout(preheader: string, body: string) {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>Vinod.lk</title></head>
<body style="margin:0;padding:0;background:${C.bg}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:576px">
  <tr><td style="padding:12px 16px 20px"><a href="${site}"><img src="${site}/images/email/logo.png?v=2" width="132" height="45" alt="Vinod.lk" style="display:block;border:0"></a></td></tr>
  <tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:16px;padding:32px 28px">${body}</td></tr>
  <tr><td style="padding:28px 16px 8px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><img src="${site}/images/email/logo.png?v=2" width="96" height="33" alt="Vinod.lk" style="display:block;border:0"></td>
      <td align="right" style="font:500 13px/20px ${font}">
        <a href="https://www.facebook.com/vinod.ux.lk" style="color:${C.body};text-decoration:none">Facebook</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://www.instagram.com/vinod_deshapriya96/" style="color:${C.body};text-decoration:none">Instagram</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://www.linkedin.com/in/vinod-deshapriya/" style="color:${C.body};text-decoration:none">LinkedIn</a>
      </td>
    </tr></table>
    <div style="height:1px;background:${C.line};margin:16px 0 12px"></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font:400 12px/20px ${font};color:${C.muted}">© ${year} Vinod.lk. All rights reserved.</td>
      <td align="right" style="font:400 12px/20px ${font}"><a href="${site}/terms" style="color:${C.muted};text-decoration:none">Terms</a>&nbsp;&nbsp;&nbsp;<a href="${site}/privacy-policy" style="color:${C.muted};text-decoration:none">Privacy</a></td>
    </tr></table>
  </td></tr>
</table></td></tr></table></body></html>`;
}

export type BookingInfo = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  start: Date;
  end: Date;
  /** The visitor's own time zone, for their email. */
  guestTimeZone: string;
  meetUrl?: string;
  eventUrl?: string;
};

export function when(start: Date, end: Date, timeZone: string) {
  const day = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(start);
  const t = (d: Date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    }).format(d);
  const zone =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
      .formatToParts(start)
      .find((x) => x.type === "timeZoneName")?.value ?? timeZone;
  return { day, time: `${t(start)} – ${t(end)}`, zone };
}

/** Sent to the person who booked. */
export function guestEmail(b: BookingInfo) {
  const first = b.name.split(/\s+/)[0];
  const w = when(b.start, b.end, b.guestTimeZone);
  const html = layout(
    `Your call with Vinod is booked for ${w.day}, ${w.time}.`,
    `${p(`Hi ${esc(first)},`, `color:${C.text}`)}
    ${p("Thanks for booking a free call. It's confirmed, and I'm looking forward to hearing about your project.")}
    ${details([
      ["When", `${esc(w.day)}<br>${esc(w.time)} (${esc(w.zone)})`],
      ["Length", `${bookingConfig.durationMin} minutes`],
      [
        "Where",
        b.meetUrl
          ? `Google Meet: <a href="${esc(b.meetUrl)}" style="color:${C.blue}">${esc(b.meetUrl.replace(/^https?:\/\//, ""))}</a>`
          : "Google Meet (link in the calendar invite)",
      ],
    ])}
    ${b.meetUrl ? button(b.meetUrl, "Join Google Meet") : ""}
    ${p("A calendar invite is on its way too. Before the call, it helps to have your current website (if you have one) and a rough idea of your goals, timeline and budget.")}
    ${p(`Need to change the time? Just reply to this email or message me on <a href="https://wa.me/94775037738" style="color:${C.blue}">WhatsApp</a>.`)}
    ${p("Best regards,", "margin-bottom:6px")}
    <p style="margin:0;font:600 18px/26px ${font};color:${C.text}">Vinod Deshapriya</p>
    <p style="margin:2px 0 0;font:400 14px/22px ${font};color:${C.muted}">UX Engineer · Vinod.lk</p>`,
  );
  const text = `Hi ${first},\n\nYour free call with Vinod is booked.\n\nWhen: ${w.day}, ${w.time} (${w.zone})\nLength: ${bookingConfig.durationMin} minutes\nWhere: ${b.meetUrl ?? "Google Meet (see the calendar invite)"}\n\nNeed to change the time? Reply to this email or WhatsApp +94 77 50 377 38.\n\nBest regards,\nVinod Deshapriya\nVinod.lk`;
  return { subject: `Booked: your free call with Vinod, ${w.day}`, html, text };
}

/** Sent to info@vinod.lk. */
export function adminEmail(b: BookingInfo) {
  const w = when(b.start, b.end, bookingConfig.timeZone);
  const theirs =
    b.guestTimeZone !== bookingConfig.timeZone
      ? when(b.start, b.end, b.guestTimeZone)
      : null;
  const rows: [string, string][] = [
    ["Full name", esc(b.name)],
    [
      "Email address",
      `<a href="mailto:${esc(b.email)}" style="color:${C.blue}">${esc(b.email)}</a>`,
    ],
  ];
  if (b.phone) rows.push(["Phone / WhatsApp", esc(b.phone)]);
  rows.push(["When (Sri Lanka)", `${esc(w.day)}<br>${esc(w.time)}`]);
  if (theirs)
    rows.push(["Their time", `${esc(theirs.time)} (${esc(b.guestTimeZone)})`]);
  if (b.meetUrl)
    rows.push([
      "Google Meet",
      `<a href="${esc(b.meetUrl)}" style="color:${C.blue}">${esc(b.meetUrl.replace(/^https?:\/\//, ""))}</a>`,
    ]);
  const html = layout(
    `New call booked: ${b.name}, ${w.day} ${w.time}`,
    `${p("Hi Vinod,", `color:${C.text}`)}
    ${p("A new free call has been booked through your website. Here are the details.")}
    <p style="margin:0 0 8px;font:600 16px/24px ${font};color:${C.text}">Client information</p>
    ${details(rows)}
    <p style="margin:0 0 8px;font:600 16px/24px ${font};color:${C.text}">Message</p>
    ${p(b.notes ? esc(b.notes).replace(/\n/g, "<br>") : `<span style="color:${C.muted}">No notes added.</span>`)}
    ${b.eventUrl ? button(b.eventUrl, "Open in Google Calendar") : ""}
    ${p("Reply to this email to answer the client directly.")}
    ${p("Best regards,", "margin-bottom:6px")}
    <p style="margin:0;font:600 18px/26px ${font};color:${C.text}">Your website</p>`,
  );
  const text = `New call booked\n\nName: ${b.name}\nEmail: ${b.email}\nPhone: ${b.phone || "-"}\nWhen (Sri Lanka): ${w.day}, ${w.time}\nMeet: ${b.meetUrl ?? "-"}\n\nMessage:\n${b.notes || "-"}`;
  return {
    subject: `New call booked: ${b.name}, ${w.day} ${w.time}`,
    html,
    text,
  };
}
