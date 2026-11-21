import { NextResponse } from "next/server";
import {
  adminEnquiryEmail,
  visitorConfirmationEmail,
  type Enquiry,
} from "@/lib/contact/emails";

/**
 * Receives the Contact page form (src/slices/ContactForm/ProjectForm.tsx) and sends two
 * emails through Resend: the enquiry to Vinod, and a confirmation to the visitor.
 *
 * Environment variables (in .env.local and on Netlify):
 *   RESEND_API_KEY       required
 *   CONTACT_TO_EMAIL     where enquiries go (default info@vinod.lk)
 *   CONTACT_FROM_EMAIL   sender on the domain verified in Resend (default "Vinod.lk <info@vinod.lk>")
 */
export const runtime = "nodejs";

const send = (key: string, body: Record<string, unknown>) =>
  fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body)
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot: real visitors leave this empty.
  if (body.company) return NextResponse.json({ ok: true });

  const str = (k: string, max = 2000) =>
    String(body[k] ?? "")
      .trim()
      .slice(0, max);
  const enquiry: Enquiry = {
    name: str("name", 120),
    email: str("email", 200),
    phone: str("phone", 60),
    service: str("service", 80),
    budget: str("budget", 80),
    message: str("message", 4000),
    page: request.headers.get("referer") ?? undefined,
  };
  if (
    !enquiry.name ||
    !/^\S+@\S+\.\S+$/.test(enquiry.email) ||
    !enquiry.message
  ) {
    return NextResponse.json(
      { error: "Please fill in your name, a valid email and your message." },
      { status: 400 },
    );
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "info@vinod.lk";
  const from = process.env.CONTACT_FROM_EMAIL || "Vinod.lk <info@vinod.lk>";
  if (!key) {
    console.warn("[contact] RESEND_API_KEY not set. Enquiry:", enquiry);
    return NextResponse.json(
      {
        error:
          "The form isn't connected yet. Please message me on WhatsApp or email info@vinod.lk.",
      },
      { status: 503 },
    );
  }

  const admin = adminEnquiryEmail(enquiry);
  const res = await send(key, {
    from,
    to: [to],
    reply_to: enquiry.email,
    ...admin,
  });
  if (!res.ok) {
    console.error(
      "[contact] Resend error",
      res.status,
      await res.text().catch(() => ""),
    );
    return NextResponse.json(
      { error: "Sorry, that didn't send. Please try WhatsApp or email." },
      { status: 502 },
    );
  }

  // The visitor's copy is a courtesy: if it fails, the enquiry still reached Vinod.
  const confirm = visitorConfirmationEmail(enquiry);
  const res2 = await send(key, {
    from,
    to: [enquiry.email],
    reply_to: to,
    ...confirm,
  });
  if (!res2.ok)
    console.error(
      "[contact] confirmation email failed",
      res2.status,
      await res2.text().catch(() => ""),
    );

  return NextResponse.json({ ok: true });
}

/** Development only: preview the emails at /api/contact?preview=admin or ?preview=visitor. */
export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development")
    return new Response("Not found", { status: 404 });
  const sample: Enquiry = {
    name: "Nimal Perera",
    email: "nimal@example.com",
    phone: "077 123 4567",
    service: "Website Design",
    budget: "LKR 80,000 to 150,000",
    message:
      "We run a small boutique hotel in Galle and our current site is slow and hard to book from.\nWe'd like a new site with a simple booking flow before the season starts.",
    page: "https://vinod.lk/contact",
  };
  const which = new URL(request.url).searchParams.get("preview");
  const mail =
    which === "visitor"
      ? visitorConfirmationEmail(sample)
      : adminEnquiryEmail(sample);
  return new Response(mail.html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
