import { NextResponse } from "next/server";
import { bookingConfig, bookingEnv, calendarConfigured } from "@/lib/booking/config";
import { isFree } from "@/lib/booking/slots";
import { createEvent } from "@/lib/booking/google";
import { adminEmail, guestEmail, type BookingInfo } from "@/lib/booking/emails";

async function send(to: string, mail: { subject: string; html: string; text: string }, replyTo?: string) {
  const e = bookingEnv();
  if (!e.resendKey) {
    console.warn(`[booking] RESEND_API_KEY not set; email to ${to} not sent: ${mail.subject}`);
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${e.resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: e.from, to: [to], reply_to: replyTo, ...mail }),
  });
  if (!res.ok) console.error("[booking] Resend", res.status, await res.text().catch(() => ""));
  return res.ok;
}

/** POST /api/booking: books a slot on the Google Calendar and emails both sides. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const str = (k: string, max: number) => String(body[k] ?? "").trim().slice(0, max);
  const name = str("name", 120);
  const email = str("email", 200);
  const phone = str("phone", 60);
  const notes = str("notes", 3000);
  const tz = str("timeZone", 64);
  const start = new Date(str("start", 40));
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please add your name and a valid email address." }, { status: 400 });
  }
  if (isNaN(+start)) return NextResponse.json({ error: "Please pick a time." }, { status: 400 });
  let guestTimeZone = bookingConfig.timeZone;
  try {
    if (tz) {
      new Intl.DateTimeFormat("en", { timeZone: tz });
      guestTimeZone = tz;
    }
  } catch {}

  const configured = calendarConfigured();
  if (!configured && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Online booking isn't connected yet. Please message me on WhatsApp or email info@vinod.lk." },
      { status: 503 },
    );
  }

  try {
    if (!(await isFree(start))) {
      return NextResponse.json({ error: "Sorry, that time was just taken. Please pick another.", taken: true }, { status: 409 });
    }
    const end = new Date(start.getTime() + bookingConfig.durationMin * 60_000);
    const info: BookingInfo = { name, email, phone, notes, start, end, guestTimeZone };

    if (configured) {
      const ev = await createEvent({
        start,
        end,
        summary: `Free call: ${name} × Vinod.lk`,
        description: [
          `Booked on vinod.lk`,
          `Name: ${name}`,
          `Email: ${email}`,
          phone && `Phone: ${phone}`,
          notes && `\nNotes:\n${notes}`,
        ].filter(Boolean).join("\n"),
        guest: { email, name },
      });
      info.meetUrl = ev.meetUrl;
      info.eventUrl = ev.htmlLink;
    } else {
      console.warn("[booking] Google Calendar not configured (dev): booking not saved.", info);
    }

    const admin = bookingEnv().adminEmail;
    await Promise.all([send(email, guestEmail(info), admin), send(admin, adminEmail(info), email)]);
    return NextResponse.json({ ok: true, start: start.toISOString(), end: end.toISOString(), meetUrl: info.meetUrl ?? null });
  } catch (e) {
    console.error("[booking]", e);
    return NextResponse.json({ error: "Sorry, that didn't go through. Please try again or message me on WhatsApp." }, { status: 502 });
  }
}
