import { NextResponse } from "next/server";

/**
 * Receives the Contact page form (src/slices/ContactForm/ProjectForm.tsx).
 *
 * Delivery: set RESEND_API_KEY and CONTACT_TO_EMAIL (and optionally CONTACT_FROM_EMAIL,
 * a sender on a domain verified in Resend) to email each enquiry. Without them the
 * enquiry is only logged on the server and the form tells the visitor to use WhatsApp or email.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot: real visitors leave this empty.
  if (body.company) return NextResponse.json({ ok: true });

  const str = (k: string, max = 2000) => String(body[k] ?? "").trim().slice(0, max);
  const enquiry = {
    name: str("name", 120),
    email: str("email", 200),
    phone: str("phone", 60),
    launch: str("launch", 20),
    service: str("service", 80),
    budget: str("budget", 80),
    message: str("message", 4000),
  };
  if (!enquiry.name || !/^\S+@\S+\.\S+$/.test(enquiry.email) || !enquiry.message) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and your message." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.warn("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not set. Enquiry:", enquiry);
    return NextResponse.json(
      { error: "The form isn't connected yet. Please message me on WhatsApp or email info@vinod.lk." },
      { status: 503 },
    );
  }

  const text = Object.entries(enquiry)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "vinod.lk <onboarding@resend.dev>",
      to: [to],
      reply_to: enquiry.email,
      subject: `New enquiry: ${enquiry.service || "website"} from ${enquiry.name}`,
      text,
    }),
  });
  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Sorry, that didn't send. Please try WhatsApp or email." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
