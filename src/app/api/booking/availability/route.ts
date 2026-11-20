import { NextResponse } from "next/server";
import { bookingConfig, calendarConfigured } from "@/lib/booking/config";
import { freeSlots } from "@/lib/booking/slots";

export const dynamic = "force-dynamic";

/** GET /api/booking/availability?from=ISO&to=ISO → free start times (ISO, UTC). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const from = new Date(url.searchParams.get("from") ?? Date.now());
  const to = new Date(url.searchParams.get("to") ?? Date.now() + 31 * 864e5);
  if (isNaN(+from) || isNaN(+to) || to <= from || +to - +from > 62 * 864e5) {
    return NextResponse.json({ error: "Invalid range." }, { status: 400 });
  }
  try {
    const slots = await freeSlots(from, to);
    return NextResponse.json(
      { slots, durationMin: bookingConfig.durationMin, connected: calendarConfigured() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    console.error("[booking] availability", e);
    return NextResponse.json({ error: "Couldn't load times. Please try again." }, { status: 502 });
  }
}
