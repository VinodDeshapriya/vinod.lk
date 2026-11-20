import { adminEmail, guestEmail } from "@/lib/booking/emails";

/** Dev only: /api/booking/preview?to=guest|admin renders the booking emails with sample data. */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const to = new URL(request.url).searchParams.get("to");
  const start = new Date(Date.UTC(2026, 10, 24, 4, 30));
  const sample = {
    name: "Nimal Perera",
    email: "nimal@example.com",
    phone: "+94 77 123 4567",
    notes: "We run a boutique hotel in Galle and want more direct bookings.\nOur current site is on WordPress.",
    start,
    end: new Date(start.getTime() + 20 * 60_000),
    guestTimeZone: "Asia/Colombo",
    meetUrl: "https://meet.google.com/abc-defg-hij",
    eventUrl: "https://calendar.google.com/",
  };
  const mail = to === "admin" ? adminEmail(sample) : guestEmail(sample);
  return new Response(mail.html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
